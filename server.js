
/////////////////////////////////STEP 0/////////////////////////////////////////
// Node.js 관련 모듈 불러오기
const https = require('https');
const http = require('http');
const express = require('express');
const session = require('express-session')
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require('multer');
const DeleteGroup = require('./Modules/DeleteGroup');

console.log("Node.js 모듈 불러오기 성공")







/////////////////////////////////STEP 1/////////////////////////////////////////
// Modules 디렉토리의 모든 모듈 불러오기
const ModulesDiretory = path.join(__dirname,'Modules');
const Modules = {};

fs.readdirSync(ModulesDiretory).forEach(file => {
    const filePath = path.join(ModulesDiretory, file);

    // 파일이 자바스크립트 파일인지 확인
    if (path.extname(filePath) === '.js') {
        const ModuleName = path.basename(file, '.js'); // 확장자를 제거한 파일 이름
        Modules[ModuleName] = require(filePath); 
    }
});

console.log("JEYSport 모듈 불러오기 성공")






/////////////////////////////////STEP 2/////////////////////////////////////////
// 리소스 접근 권한 제어 및 JSON 파싱 기술 사용
// 서버 구축, 미들웨어 및 서버 보안 설정

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'Pages')));
app.use(express.static(path.join(__dirname, 'Images')));
// 세션 보안 설정
app.use(session({
    secret: '164365',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: 20 * 60 * 1000 } // HTTPS를 사용할 경우 true로 설정
}));

// 서버 사이드 오류처리 미들웨어 
app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).send({result : 99, message : '서버 오류 발생'});
});


const options = {
    //자기서명한 SSL 인증키를 통한 서버 생성
    key: fs.readFileSync(path.join(__dirname, 'SecurityKeys/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'SecurityKeys/cert.pem'))

    //메인서버 운영용 SSL 인증키
    //key: fs.readFileSync('/etc/letsencrypt/live/jeysport.codns.com/privkey.pem'),
    //cert: fs.readFileSync('/etc/letsencrypt/live/jeysport.codns.com/fullchain.pem')
};

const server = https.createServer(options,app);
const httpServer = http.createServer((req,res) => {
    res.writeHead(301,{"Location" : `https://${req.headers.host}${req.url}`});
    res.end();
})
console.log("HTTPS , HTTP 서버 구축 성공")


//로그인된 유저(세션토큰) 확인 후,소프트웨어 내 유저토큰으로 리턴 함수
async function checkToken(userToken,req){

    if ( userToken == req.sessionID ) {

        // 세션토큰 만료기간 초기화
        req.session._lastAccess = Date.now();
        req.session.cookie.maxAge = 20 * 60 * 1000;

        //검증 후 리소스 접근권한을 위한 유저토큰 사용
        userToken = req.session.userToken;
        return userToken
    }else{
        return 0
    }
}



/////////////////////////////////STEP 3/////////////////////////////////////////
// 서버 시작지점 접근 리소스 세팅
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Pages', 'LoginPage.html'));
    
});

//서버 작동
const PORT = process.env.PORT || 443;
server.listen(PORT, () => console.log(`\n서버 작동 성공 , 현재 포트 : ${PORT} 에서 작동중입니다.`));
httpServer.listen(80,() => console.log(`서버 작동 성공 , 현재 포트 : ${80} 에서 작동중입니다.`));






/////////////////////////////////STEP FINAL/////////////////////////////////////////
//////////////////////////////////클라이언트 Request <-> 서버 Response 파트//////////

//로그인 요청 
app.post('/Login' , async (req,res,next) => {
    console.log("Login sign");
    try {
        const {userID , userPW} = req.body;
        const result = await Modules["Login"].Login(userID,userPW);

        //result 값에 userToken 값이 들어감, ID,PW 검증 실패시 0이 첨부됨.
        if (result != 0){
            req.session.userToken = result[0]["userToken"];
            const resources = {userToken : req.sessionID , userImage : result[0]["userImage"]}
            res.status(200).send({result : 1, resources : resources});
            
        }else{
            res.status(200).send({result : 0});
            
        }
    }catch(error) {
        next(error);
    }



})

//회원가입 요청 (ID 중복확인 기능 확장, CheckTelephon.js 에게 의존성 존재)
app.post('/Register' , async (req,res,next) => {

    console.log("Register sign");
    try {
        const data = req.body;
        result = await Modules["Register"].Register(data);
        res.status(200).send({result : result});
    }catch(error) {
        next(error);
    }


    
})

//로그아웃 요청
app.post('/Logout' , (req,res,next) => {
    console.log("Logout sign");
    try{
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send({ result : 0 });
            }
            res.status(200).send({ result : 1 });
        });
    }catch(error){
        next(error);
    }
    
    
});

//전화번호 인증 요청 (Register에 포함관계)
app.post('/CheckPhone' , async (req,res,next) => {
    console.log("CheckPhone sign");
    try {
        const data = req.body;
        const result = await Modules["CheckPhone"].CheckPhone(data);
        res.status(200).send({result : result});
    }catch(error) {
        next(error);
    }

});

//유저 회원인증 요청
app.get('/Certification' , async (req,res,next) => {

    console.log("Certification sign");
    try {
        let query = req.query;
        var userToken = query["userToken"];
        let page = query["page"]; 

        userToken = await checkToken(userToken,req);

        if ( userToken != 0 ) {

            if (page == undefined){
                res.status(200).send({result : 0 , resources : null});

            }else{
                const result = await Modules["Certification"].Certification(userToken,page,query);
                res.status(200).send(result);
            }
        } else {
            res.status(401).send({result : 0});
        }
    }catch(error) {
        next(error);
    }
        
    
    
    
});


// 이미지 업로드

app.post('/ImageUpload', Modules["ImageUpload"].upload.single('Image'), async (req, res, next) => {

    console.log("ImageUpload sign")

    try {
        const JSONdata = JSON.parse(req.body.json);
        const Imagedata = req.file;
        let userToken = JSONdata["userToken"];
        
        userToken = await checkToken(userToken, req);

        if (userToken !== 0) {
            if (!Imagedata) {
                return res.status(400).send('파일이 업로드되지 않았습니다.');
            }

            // ImageUpload 함수 호출
            const result = await Modules["ImageUpload"].ImageUpload(userToken,req, res);
            return res.status(200).send(result);
        } else {
            return res.status(403).send({ result: 99, message: '인증 실패' });
        }
    } catch (error) {
        next(error);
    }
});

// 그룹 생성
app.post('/CreateGroup', async(req,res,next) => {
    
    console.log("CreateGroup sign")
    try {
        const data = req.body;
        var userToken = data["userToken"]
        userToken = await checkToken(userToken,req);

        if ( userToken != 0 ) {
                
            const result = await Modules["CreateGroup"].CreateGroup(userToken,data);

            if (result == 0){
                res.status(200).send({result : 0, resources : null});
            }else{
                res.status(200).send({result : 1, resources : result});
            }
        }else{
            res.status(500).send({result : 99, message : '서버 오류 발생'});
        }
    }catch(error) {
        next(error);
    }
});
//여기 코드에서부터는 , result 의 형태가 각 모듈에서 완벽히 제공되도록 작성.
//데이터 수정 
app.post('/ChangeNormalData', async(req,res,next) => {

    console.log("ChangeNormalData sign");
    try{
        const data = req.body;
        var userToken = data["userToken"]
        userToken = await checkToken(userToken,req);

        if ( userToken != 0 ){
            const result = await Modules["ChangeNormalData"].ChangeNormalData(userToken,data)
            res.status(200).send(result);

        }else{
            res.status(200).send({result : 99 , message : "로그인 바랍니다."});
        }

    

    }catch(error){
        next(error);
    }            

})

//회원 탈퇴
app.post('/DeleteUser', async(req,res,next) => {

    console.log("DeleteUser sign");
    try{
        const data = req.body;
        var userToken = data["userToken"]
        userToken = await checkToken(userToken,req);

        if ( userToken != 0 ){
            const result = await Modules["DeleteUser"].DeleteUser(userToken)
            res.status(200).send(result);
        }else{
            res.status(200).send({result : 99 , message : "로그인 바랍니다."});
        }

    }catch(error){
        next(error);
    }
    
})

/// 개발중. 테스트를 위한 Default Code
app.post('/DeleteGroup', async(req,res,next) => {

    console.log("DeleteGroup sign");
    try{
        const data = req.body;
        var userToken = data["userToken"]
        var groupToken = 58
        userToken = await checkToken(userToken,req);

        if ( userToken != 0 ){
            const result = await Modules["DeleteGroup"].DeleteGroup(userToken,groupToken);
            res.status(200).send(result);
        }else{
            res.status(200).send({result : 99 , message : "로그인 바랍니다."});
        }
    }catch(error){
        next(error);
    }
    
})

app.post('/EditGroupNotices', async(req,res,next) => {

    console.log("EditGroupNotices sign");
    try{
        const data = req.body;
        var userToken = data["userToken"]
        userToken = await checkToken(userToken,req);

        if ( userToken != 0 ){
            const result = await Modules["EditGroupNotices"].EditGroupNotices(data);
            res.status(200).send(result);
        }else{
            res.status(200).send({result : 99 , message : "로그인 바랍니다."});
        }
    }catch(error){
        next(error);
    }
    
})

app.post('/EditGroupSchedules', async(req,res,next) => {

    console.log("EditGroupSchedules sign");
    try{
        const data = req.body;
        var userToken = data["userToken"]
        userToken = await checkToken(userToken,req);

        if ( userToken != 0 ){
            const result = await Modules["EditGroupSchedules"].EditGroupSchedules(data);
            res.status(200).send(result);
        }else{
            res.status(200).send({result : 99 , message : "로그인 바랍니다."});
        }
    }catch(error){
        next(error);
    }
    
})

app.post('/EditGroupMembers', async(req,res,next) => {

    console.log("EditGroupMembers sign");
    try{
        const data = req.body;
        var userToken = data["userToken"]
        var groupToken = data["groupToken"]
        var userPermission = data["userPermission"]
        userToken = await checkToken(userToken,req);

        if ( userToken != 0 ){
            const result = await Modules["EditGroupMembers"].EditGroupMembers(userToken,groupToken,userPermission,data);
            res.status(200).send(result);
        }else{
            res.status(200).send({result : 99 , message : "로그인 바랍니다."});
        }
    }catch(error){
        next(error);
    }
    
})