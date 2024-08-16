const http = require('http');
const express = require('express');
const session = require('express-session')
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const Certification = require('./Modules/Certification');
const multer = require('multer'); // 이미지 전송


// multer 설정 (이미지 전송 미들웨어)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//// 리소스 제공
const app = express();
const server = http.createServer(app);
app.use(express.static(path.join(__dirname, 'Pages')));
app.use(express.static(path.join(__dirname, 'Images')));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

//// 루트 경로에서 Login.html 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Pages', 'LoginPage.html')); 
});

//// Req <-> Res

//유저 회원인증 요청
app.get('/Certification' , async (req,res) => {
    
    var data = req.query;
    var page = req.query.page;

    console.log("회원인증 요청 성공");
    console.log(data, page);
    if (page == 'PrivatePage') {
        res.status(200).send({result : 1 , resources : [{groupToken : 1 , groupName : 'GyuChul1', userPermission : 1}, 
                                                        {groupToken : 9 , groupName : 'GyuChul1', userPermission : 2}, 
                                                        {groupToken : 2, groupName : 'GyuChul2', userPermission : 3}, 
                                                        {groupToken : 3, groupName : 'GyuChul3', userPermission : 4}, 
                                                        {groupToken : 7, groupName : 'GyuChul6', userPermission : 4}]});
    } else if (page == 'GroupMainPage') {
        res.status(200).send({result : 1 , userPermission : 1 , resources : [{groupImage : '58.jpeg' , groupName : 'GyuChul1'}], userPermission : 3});
    } else if (page == 'EditUserPage') {
        res.status(200).send({result : 1 , resources : [{userImage : null, userName : '최규호' , userIntro : '안녕하십니까 저는 최규호입니다', userEmail: 'gyuTest@naver.com'}], userPermission : 3});
    } else if (page == 'EditGroupPage') {
            res.status(200).send({result : 1 , resources : [{groupImage : null,groupID : 'jeysports', groupName : 'JEY Sports' , groupBankAccountName: '신한은행',  groupIntro : '안녕하십니까 스포츠를 즐기는데 집중하자입니다', groupBankAccountNumber: 1123448451 }]});
    } else if (page == 'GroupNoticePage') {
        res.status(200).send({result : 1 , resources : [{
            noticeToken: 1, noticeTitle: '이번달 활동 장소 안내입니다!', noticeImportance: 1, noticeStatus: 1, noticeEditDate: '2024-08-11',noticeType: 3
         }, 
         { noticeToken: 2, noticeTitle: '다음달 활동 장소 안내입니다!',noticeImportance: 0,noticeStatus: 0,noticeEditDate: '2024-08-12',noticeType: 1}, 
         {
            noticeToken: 3,
            noticeTitle: '3 활동 장소 안내입니다!',
            noticeImportance: 0,
            noticeStatus: 0,
            noticeEditDate: '2024-08-12',
            noticeType: 3,
         }, 
         {
            noticeToken: 4,
            noticeTitle: '4 활동 장소 안내입니다!',
            noticeImportance: 0,
            noticeStatus: 0,
            noticeEditDate: '2024-08-12',
            noticeType: 3,
         }, 
         {
            noticeToken: 2,
            noticeTitle: '5 활동 장소 안내입니다!',
            noticeImportance: 0,
            noticeStatus: 0,
            noticeEditDate: '2024-08-12',
            noticeType: 3,
         }, 
         {
            noticeToken: 2,
            noticeTitle: '6 활동 장소 안내입니다!',
            noticeImportance: 0,
            noticeStatus: 0,
            noticeEditDate: '2024-08-12',
            noticeType: 3,
         }, 
         {
            noticeToken: 2,
            noticeTitle: '7 활동 장소 안내입니다!',
            noticeImportance: 0,
            noticeStatus: 0,
            noticeEditDate: '2024-08-12',
            noticeType: 3,
         }, 
         {
            noticeToken: 2,
            noticeTitle: '8 활동 장소 안내입니다!',
            noticeImportance: 0,
            noticeStatus: 0,
            noticeEditDate: '2024-08-12',
            noticeType: 3,
         }, 
         {
            noticeToken: 2,
            noticeTitle: '9 활동 장소 안내입니다!',
            noticeImportance: 0,
            noticeStatus: 0,
            noticeEditDate: '2024-08-12',
            noticeType: 3,
         }, 
         {
            noticeToken: 2,
            noticeTitle: '10 활동 장소 안내입니다!',
            noticeImportance: 0,
            noticeStatus: 0,
            noticeEditDate: '2024-08-12',
            noticeType: 3,
         }, 
         {
            noticeToken: 2,
            noticeTitle: '11 활동 장소 안내입니다!',
            noticeImportance: 0,
            noticeStatus: 0,
            noticeEditDate: '2024-08-12',
            noticeType: 3,
         }, 
         {
            noticeToken: 2,
            noticeTitle: '12 활동 장소 안내입니다!',
            noticeImportance: 0,
            noticeStatus: 0,
            noticeEditDate: '2024-08-12',
            noticeType: 3,
         }, 
         {
            noticeToken: 2,
            noticeTitle: '13 활동 장소 안내입니다!',
            noticeImportance: 0,
            noticeStatus: 0,
            noticeEditDate: '2024-08-12',
            noticeType: 3,
         }]});
    } else if (page == 'CreateGroupNoticePage') {
        console.log(data.noticeToken)
        res.status(200).send({result : 1, userPermission : 2});        
    } else if (page == 'GroupMemberPage') {
        res.status(200).send({result : 1 , resources : [[{
            userImage: 'CrossFit.png',
            userName: '최규호',
            userPermission: 1,
            userAttentionRate: 50,
            userToken: 1,
            userPhone: '01062131310',
         }, 
         {
            userImage: null,
            userName: '신민철',
            userPermission: 2,
            userAttentionRate: 80,
            userToken: 2,
            userPhone: '01011112222',
         },{
            userImage: null,
            userName: '강지훈',
            userPermission: 0,
            userAttentionRate: 80,
            userToken: 3,
            userPhone: '01011112222',
         }],
         [
         {
            userImage: null,
            userName: '이윤창',
            userPermission: 3,
            userAttentionRate: 70,
            userToken: 4,
            userPhone: '01011112222',
         }, 
         {
            userImage: null,
            userName: '이준호',
            userPermission: 4,
            userAttentionRate: 10,
            userToken: 5,
            userPhone: '01011112222',
         }
        ]]});
    } else if (page == 'GroupSchedulePage') {
        res.status(200).send({result : 1 , resources : [{
            scheduleToken: 1,
            scheduleTitle: '정기활동 3회차',
            scheduleStartDate: '2024-08-10',
            scheduleImportance: 1,
            scheduleAlert: 1,
            scheduleStatus: 0,
            
         }, 
         {
            scheduleToken: 2,
            scheduleTitle: '정기활동 4회차',
            scheduleStartDate: '2024-08-14',
            scheduleImportance: 0,
            scheduleAlert: 1,
            scheduleStatus: null,
         },
         {
            scheduleToken: 3,
            scheduleTitle: '출석기능 사용할래!',
            scheduleStartDate: '2024-08-19',
            scheduleImportance: 0,
            scheduleAlert: 1,
            scheduleStatus: null,
         }]});
    } else if (page == 'ScheduleAttendancePage') {
        res.status(200).send({result : 1 , resources : [{
            scheduleToken: 1,
            scheduleTitle: '정기활동 3회차',
            scheduleStartDate: '2024-08-10',
            scheduleEndDate: '2024-08-10',
            scheduleImportance: 1,
            scheduleAlert: 1,
            scheduleStatus: 0,
         }, 
         {
            scheduleToken: 2,
            scheduleTitle: '정기활동 4회차',
            scheduleStartDate: '2024-08-14',
            scheduleEndDate: '2024-08-16',
            scheduleImportance: 0,
            scheduleAlert: 0,
            scheduleStatus: null,
         },
         {
            scheduleToken: 3,
            scheduleTitle: '출석기능 사용할래!',
            scheduleStartDate: '2024-08-20',
            scheduleEndDate: '2024-08-20',
            scheduleImportance: 1,
            scheduleAlert: 1,
            scheduleStatus: 1,
         }]});
    } else if (page == 'NoticeDuesPage') {
        res.status(200).send({result : 1 , resources : [{
            noticeType: 1,
            noticeToken: 1,
            noticeTitle: '1월 회비',
            noticeChangedDate: '2024-08-10',
            noticeEndDate: '2024-09-10',
            noticeImportance: 1,
            noticeStatus: 1,
            DuesStatus: 1,
            noticeDues: '10000'
         }, 
         {
            noticeType: 2,
            noticeToken: 2,
            noticeTitle: '2 회비',
            noticeChangedDate: '2024-08-12',
            noticeEndDate: '2024-09-14',
            noticeImportance: 0,
            noticeStatus: 0,
            DuesStatus: 0,
            noticeDues: '20000'
         },
         {
            noticeType: 3,
            noticeToken: 3,
            noticeTitle: '3 회비',
            noticeChangedDate: '2024-08-13',
            noticeEndDate: '2024-09-10',
            noticeImportance: 1,
            noticeStatus: 1,
            DuesStatus: 1,
            noticeDues: '2000'
         }]});
    }else {
        res.status(200).send({result : 1, userPermission : 2});
    }
    
});

/////////////////////////////////////////////////////////////////////////////////

// Attend
app.post('/Attend' , async (req,res) => {
    const data = req.body;
    
    console.log("Attend 요청 성공");
    console.log(data);

    
    res.status(200).send({result : 0, userPermission : 2});
});

// Dues
app.post('/Dues' , async (req,res) => {
    const data = req.body;
    
    console.log("Dues 요청 성공");
    console.log(data);
    
    res.status(200).send({result : 1, userPermission : 2});
});

// CheckGroupStatus
app.post('/CheckGroupStatus' , async (req,res) => {
    const data = req.body;
    
    console.log("CheckGroupStatus 요청 성공");
    console.log(data);
    
    res.status(200).send({result : 1 ,
         resources : 
        [[
            {noticeToken : 3, noticeTitle : '회비 내라!', userDuesStatus : 0 , noticeDues: '5000', },
            {noticeToken : 4, noticeTitle : '회비 내라 고!', userDuesStatus : 0 , noticeDues: '10000', }
        ], [
            {scheduleToken : 3, scheduleTitle : '결석 예정이라서 보이면 안돼', attendanceStatus : 0 , scheduleStartDate: '2024-08-22', scheduleEndDate: '2024-08-22', },
            {scheduleToken : 4, scheduleTitle : '중산 정기모임 ', attendanceStatus : null , scheduleStartDate: '2024-08-16', scheduleEndDate: '2024-08-17', },
            {scheduleToken : 4, scheduleTitle : '중산 정기모임 아직 결정 안해서 보여야돼', attendanceStatus : null , scheduleStartDate: '2024-08-18', scheduleEndDate: '2024-08-18', },
            {scheduleToken : 4, scheduleTitle : '후곡 정기모임 아직 결정 안해서 보여야돼', attendanceStatus : null , scheduleStartDate: '2024-08-19', scheduleEndDate: '2024-08-19', },
        ]]});
});



// JoinGroup
app.post('/JoinGroup' , async (req,res) => {
    const data = req.body;
    
    console.log("JoinGroup 요청 성공");
    console.log(data);
    
    if (data.functionType == 1) {
        if (data.groupID == 'gyuho' ) {
            res.status(200).send({result : 1});
        } else {
            res.status(200).send({result : 0});
        }
    } else {
        res.status(200).send({result : 1});
    }
    
});





// 공지사항 요청
app.post('/EditGroupNotices' , async (req,res) => {
    const data = req.body;
    
    console.log("공지사항 요청 성공");
    console.log(data);
    
    if (data.functionType == 1) {

        if (data.noticeToken == 1) {
            res.status(200).send({result : 1 , resources : [{
                noticeContent: '장소는 탄현배드민턴장이구요, 참석자는 10명입니다!',
                noticeWriter: '최규호',
                noticeCreatedDate: '2024-08-08',
                noticeEditDate: '2024-08-09',
                noticeEndDate: '2024-08-29',
                noticeType: 1
             }]});
        } else if (data.noticeToken == 2) {
            res.status(200).send({result : 1 , resources : [{
                noticeContent: '장소는 중산배드민턴장이구요, 참석자는 10명입니다!',
                noticeWriter: '신민철',
                noticeCreatedDate: '2024-09-09',
                noticeEditDate: '2024-09-29',
                noticeEndDate: '2024-08-31',
                noticeType: 3
             }]});
        } else {
            res.status(200).send({result : 1 , resources : [{
                noticeContent: '나머지 공지사항들이구요, 참석자는 10명입니다!',
                noticeWriter: '최현',
                noticeCreatedDate: '2024-09-09',
                noticeEditDate: '2024-09-29',
                noticeEndDate: '2024-08-31',
                noticeType: 3
             }]});
        }
        
    } else if (data.functionType == 2) {

        console.log(data.noticeToken);
        res.status(200).send({result : 1});

    } else if (data.functionType == 3) {

        console.log(data);
        res.status(200).send({result : 1});

    }else {
        res.status(200).send({result : 1});
    }
    
});


// 일정 요청
app.post('/EditGroupSchedule' , async (req,res) => {
    const data = req.body;
    
    console.log("일정관리 요청 성공");
    console.log(data);
    
    if (data.functionType == 1) {
        res.status(200).send({result : 1 , resources : [{
            scheduleToken: 1,
            scheduleTitle: '정기활동 3회차',
            scheduleStartDate: '2024-08-10',
            scheduleEndDate: '2024-08-10',
            scheduleImportance: 1,
            scheduleAlert: 1,
            scheduleStatus: 0,
            scheduleContent: '정기활동 3회차가 있는 날입니다!',
            scheduleLocation: '탄현 배드민턴 구장',
            scheduleattendanceStatus: 1,
         }, 
         {
            scheduleToken: 2,
            scheduleTitle: '정기활동 4회차',
            scheduleStartDate: '2024-08-14',
            scheduleImportance: 1,
            scheduleAlert: 1,
            scheduleStatus: null,
            scheduleContent: '정기활동 4548회차가 있는 날입니다!',
            scheduleLocation: '중산 배드민턴 구장',
            scheduleattendanceStatus: 0,
         },
         {
            scheduleToken: 3,
            scheduleTitle: '출석기능쓸래요!',
            scheduleStartDate: '2024-08-19',
            scheduleImportance: 1,
            scheduleAlert: 1,
            scheduleStatus: null,
            scheduleContent: '정기활동 9896132회차가 있는 날입니다!',
            scheduleLocation: '제니스의 어느 한 카페',
            scheduleattendanceStatus: 1,
         }]});
    } else {
        res.status(200).send({result : 1});
    }
    
});

// 일정 요청
app.post('/EditGroupSchedules' , async (req,res) => {
    const data = req.body;
    
    console.log("수정 요청 성공");
    console.log(data);
    
    if (data.functionType == 1) {
        res.status(200).send({result : 1 , resources : [{
            scheduleAlert: 1,
            scheduleContent: '정기활동 3회차입니다람쥐',
            scheduleLocation: '장소는 어디일까요 과연',   
            scheduleattendanceStatus: 1,
         }, 
         {
            scheduleAlert: 0,
            scheduleContent: '정기활동 4851485123회차입니다람쥐',
            scheduleLocation: '장소는 호주 시드니 과연',   
            scheduleattendanceStatus: 1,
        }]});
    } else {
        res.status(200).send({result : 1});
    }
    
});

// 멤버 관리 요청
app.post('/EditGroupMembers' , async (req,res) => {
    const data = req.body;
    
    console.log("멤버 수정 요청 성공");
    console.log(data);
    
    if (data.functionType == 1) {
        res.status(200).send({result : 1});
        console.log("멤버 삭제 요청 성공");
    } else {
        res.status(200).send({result : 1});
    }
    
});
// 탈퇴 요청
app.post('/DeleteUser' , async (req,res) => {
    const data = req.body;
    
    console.log("탈퇴 요청 성공");
    console.log(data);
    
     res.status(200).send({result : 1});
    
    
});

// 수정 요청
app.post('/ChangeNormalData' , async (req,res) => {
    const data = req.body;
    
    console.log("수정 요청 성공");
    console.log(data);
    
    if (data.functionType == 0) {
        res.status(200).send({result : 1});
    } else {
        res.status(200).send({result : 1});
    }
    
});

//// 사이드바 호출 요청
app.get('/SideBarOrder', (req, res) => {
    console.log("Sidebar request successful");
    res.sendFile(path.join(__dirname, 'Pages/SideBar', 'SideBar.html'));
});


//// 그룹 생성 요청
app.post('/CreateGroup' , async (req,res) => {
    const data = req.body;
    console.log(data);

    console.log("createGroup 요청 성공");
    
    if (data.functionType == 0) {
        res.status(200).send({result: 0, resources : [{groupToken : 5 , groupName : 'GyuChul1'}]});
    } else if (data.functionType == 1) {
        res.status(200).send({result: 1, resources : [{groupToken : 5 , groupName : 'GyuChul1'}]});
    } 
})


//// 이미지 저장 요청
app.post('/ImageUpload' , upload.single('Image'), async (req,res) => {
    const file = req.file;
    const test = req.body.json;
    const parsedData = JSON.parse(test);
    console.log(parsedData);
    console.log('post 받음');
    console.log(file);
    console.log(req.userToken); ////
    if (file) {
        // 파일 정보를 DB에 저장하거나 다른 처리 수행
        console.log(file.originalname);  // 업로드된 파일 이름
        console.log(file.buffer);        // 파일 데이터

        // 응답 전송
        // res.json({ message: 'File uploaded successfully', fileName: file.originalname });
        res.status(200).send({result: 1, resources : [{userImage : null}]});
    } else {
        res.status(400).json({ error: 'No file uploaded' });
    }
})







//로그인 요청 
app.post('/Login' , async (req,res) => {
    // const {userID , userPW} = req.body;
    const test = req.body;
    console.log(test);

    console.log("로그인 요청 성공");
    // console.log(userID , userPW);

    res.status(200).send({result: 1, resources : [{userToken : 2, userImage : null}]});

})

//회원가입 요청 (ID 중복확인 기능 확장, CheckTelephon.js 에게 의존성 존재)
app.post('/Register' , async (req,res) => {
    const data = req.body;

    console.log("회원가입 요청 성공");
    console.log(data.userID);
    if (data.functionType == 0) {
        if (data.userID == 'gyuho1215'){
            res.status(200).send({result : 0});
        } else {
            res.status(200).send({result : 1});
        }
    } else {
        const data = req.body;
        console.log('최종 전송', data);
            res.status(200).send({result : 0});
    }
    
})

//로그아웃 요청
app.post('/Logout' , (req,res) => {
    console.log("로그아웃 요청 성공")

    res.status(200).send({ result : 1 });    
});

//전화번호 인증 요청 (Register에 포함관계)
app.post('/CheckPhone' , async (req,res) => {
    const data = req.body;
    
    console.log("전화번호 인증 요청 성공");
    console.log(data);
    
    if (data.functionType == 0) {
        res.status(200).send({result : 1});
    } else {
        res.status(200).send({result : 1});
    }
    
});






//// 서버 오픈
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



