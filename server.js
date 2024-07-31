
/////////////////////////////////STEP 0/////////////////////////////////////////
// Node.js 관련 모듈 불러오기
const https = require('https');
const express = require('express');
const session = require('express-session')
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

console.log("Node.js 모듈 불러오기 성공")







/////////////////////////////////STEP 1/////////////////////////////////////////
const app = express();

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
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'Pages')));

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

//자기서명한 SSL 인증키를 통한 서버 생성
const options = {
    key: fs.readFileSync(path.join(__dirname, 'SecurityKeys/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'SecurityKeys/cert.pem'))
};
const server = https.createServer(options,app);

console.log("HTTPS 서버 구축 성공")






/////////////////////////////////STEP 3/////////////////////////////////////////
// 서버 시작지점 접근 리소스 세팅
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Pages', 'LoginPage.html'));
    
});

//서버 작동
const PORT = process.env.PORT || 443;
server.listen(PORT, () => console.log(`\n서버 작동 성공 , 현재 포트 : ${PORT} 에서 작동중입니다.`));







/////////////////////////////////STEP FINAL/////////////////////////////////////////
//////////////////////////////////클라이언트 Request <-> 서버 Response 파트//////////

//로그인 요청 
app.post('/Login' , async (req,res,next) => {
    const {userID , userPW} = req.body;

    console.log("로그인 요청 성공")
    try {
        const result = await Modules["Login"].Login(userID,userPW);

        //result 값에 userToken 값이 들어감, ID,PW 검증 실패시 0이 첨부됨.
        if (result != 0){
            console.log("로그인 성공!");
            req.session.userID = result;
            res.status(200).send({userToken : req.sessionID});
            
        }else{
            console.log("로그인 실패");
            res.status(200).send({result : 0});
            
        }
    }catch(error) {
        next(error);
    }



})

//회원가입 요청 (ID 중복확인 기능 확장, CheckTelephon.js 에게 의존성 존재)
app.post('/Register' , async (req,res,next) => {

    const data = req.body;

    try {
           result = await Modules["Register"].Register(data);
        res.status(200).send({result : result});
    }catch(error) {
        next(error);
    }


    
})

//로그아웃 요청
app.post('/Logout' , (req,res,next) => {
    console.log("로그아웃 요청 성공")
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
    console.log("전화번호 인증 요청 성공");
    const data = req.body;
    try {
        const result = await Modules["CheckPhone"].CheckPhone(data);
        res.status(200).send({result : result});
    }catch(error) {
        next(error);
    }

});

//유저 회원인증 요청
app.get('/Certification' , async (req,res,next) => {
    console.log("회원인증 요청 성공");

    let query = req.query;
    let userToken = query["userToken"];
    let page = query["page"]; 
    
    if ( userToken == req.sessionID ) {
        // 세션토큰 만료기간 초기화
        req.session._lastAccess = Date.now();
        req.session.cookie.maxAge = 20 * 60 * 1000;

        //검증 후 리소스 접근권한을 위한 유저토큰 사용
        userToken = req.session.userID;

        try {
            if (page == undefined){
                res.status(200).send({result : 0 , resources : null});

            }else{
                const result = await Modules["Certification"].Certification(userToken,page,query);
                res.status(200).send({result : 1 , resources : result});
            }
            
        }catch(error) {
            next(error);
        }
        
    } else {
        res.status(401).send({result : 0});
    
    
}});

// 이미지 업로드
app.post('/ImageUpload', async(req,res,next) => {

    try{
        const jsonData = req.body.jsonData; // JSON 데이터는 req.body에서 가져옴
        console.log('업로드된 JSON 데이터:', jsonData);
        const data = req.file;
        const data1 = req;
        const data2 = res;
        if (data) {
            return res.status(400).send('파일이 업로드되지 않았습니다.');
        }

        const result = await Modules["ImageUpload"].ImageUpload(data1,data2);
        res.status(200).send({result : result});

    }catch(error){
        next(error);
    }
})

// 그룹 생성
app.post('/CreateGroup', async(req,res,next) => {
    console.log("CreateGroup 요청 성공")
    const data = req.body;

    try {
        const result = await Modules["CreateGroup"].CreateGroup(data);
        if (result == 0){
            console.log("CreateGroup 실패")
            res.status(200).send({result : 0, resources : null});
        }else{
            console.log("CreateGroup 성공")
            res.status(200).send({result : 1, resources : result});
        }
    }catch(error) {
        next(error);
    }
})