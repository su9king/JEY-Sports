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
        res.status(200).send({result : 1 , resources : 
        [
        //  { noticeToken: 1, noticeTitle: '이번달 활동 장소 안내입니다!', noticeImportance: 1, noticeStatus: 1, noticeEditDate: '2024-08-11',noticeType: 3}, 
        //  { noticeToken: 2, noticeTitle: '다음달 활동 장소 안내입니다!',noticeImportance: 0,noticeStatus: 0,noticeEditDate: '2024-08-12',noticeType: 1}, 
        //  {
        //     noticeToken: 3,
        //     noticeTitle: '3 활동 장소 안내입니다!',
        //     noticeImportance: 0,
        //     noticeStatus: 0,
        //     noticeEditDate: '2024-08-12',
        //     noticeType: 3,
        //  }, 
        //  {
        //     noticeToken: 4,
        //     noticeTitle: '4 활동 장소 안내입니다!',
        //     noticeImportance: 0,
        //     noticeStatus: 0,
        //     noticeEditDate: '2024-08-12',
        //     noticeType: 1,
        //  }, 
        //  {
        //     noticeToken: 2,
        //     noticeTitle: '5 활동 장소 안내입니다!',
        //     noticeImportance: 0,
        //     noticeStatus: 0,
        //     noticeEditDate: '2024-08-12',
        //     noticeType: 2,
        //  }, 
        //  {
        //     noticeToken: 2,
        //     noticeTitle: '6 활동 장소 안내입니다!',
        //     noticeImportance: 0,
        //     noticeStatus: 0,
        //     noticeEditDate: '2024-08-12',
        //     noticeType: 3,
        //  }, 
        //  {
        //     noticeToken: 2,
        //     noticeTitle: '7 활동 장소 안내입니다!',
        //     noticeImportance: 0,
        //     noticeStatus: 0,
        //     noticeEditDate: '2024-08-12',
        //     noticeType: 4,
        //  }, 
        //  {
        //     noticeToken: 2,
        //     noticeTitle: '8 활동 장소 안내입니다!',
        //     noticeImportance: 0,
        //     noticeStatus: 0,
        //     noticeEditDate: '2024-08-12',
        //     noticeType: 3,
        //  }, 
        //  {
        //     noticeToken: 2,
        //     noticeTitle: '9 활동 장소 안내입니다!',
        //     noticeImportance: 0,
        //     noticeStatus: 0,
        //     noticeEditDate: '2024-08-12',
        //     noticeType: 3,
        //  }, 
        //  {
        //     noticeToken: 2,
        //     noticeTitle: '10 활동 장소 안내입니다!',
        //     noticeImportance: 0,
        //     noticeStatus: 0,
        //     noticeEditDate: '2024-08-12',
        //     noticeType: 3,
        //  }, 
        //  {
        //     noticeToken: 2,
        //     noticeTitle: '11 활동 장소 안내입니다!',
        //     noticeImportance: 0,
        //     noticeStatus: 0,
        //     noticeEditDate: '2024-08-12',
        //     noticeType: 3,
        //  }, 
        //  {
        //     noticeToken: 2,
        //     noticeTitle: '12 활동 장소 안내입니다!',
        //     noticeImportance: 0,
        //     noticeStatus: 0,
        //     noticeEditDate: '2024-08-12',
        //     noticeType: 3,
        //  }, 
        //  {
        //     noticeToken: 2,
        //     noticeTitle: '13 활동 장소 안내입니다!',
        //     noticeImportance: 0,
        //     noticeStatus: 0,
        //     noticeEditDate: '2024-08-12',
        //     noticeType: 3,
        //  }
        ]
    });
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
         },{
            userImage: null,
            userName: '김상수',
            userPermission: 2,
            userAttentionRate: 100,
            userToken: 3,
            userPhone: '01032856899',
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
            scheduleAttendance : 1,
         }, 
         {
            scheduleToken: 2,
            scheduleTitle: '정기활동 4회차',
            scheduleStartDate: '2024-08-14',
            scheduleImportance: 0,
            scheduleAlert: 1,
            scheduleStatus: null,
            scheduleAttendance : 0,
         },
         {
            scheduleToken: 3,
            scheduleTitle: '출석기능 사용할래!',
            scheduleStartDate: '2024-08-17',
            scheduleImportance: 0,
            scheduleAlert: 1,
            scheduleStatus: null,
            scheduleAttendance : 1,
         }]});
    } else if (page == 'ScheduleAttendancePage') {
        res.status(200).send({result : 1 , resources : 
            [
                {
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
                }
            ]
        });
    } else if (page == 'NoticeDuesPage') {
        res.status(200).send({result : 1 , resources : 
        [
        {
            noticeType: 2,
            noticeToken: 1,
            noticeTitle: '1월 회비',
            noticeEditDate: '2024-08-10',
            noticeEndDate: '2024-09-10',
            noticeImportance: 1,
            noticeStatus: 1,
            duesStatus: 1,
            noticeDues: '10000'
         }, 
         {
            noticeType: 2,
            noticeToken: 2,
            noticeTitle: '2 회비',
            noticeEditDate: '2024-08-12',
            noticeEndDate: '2024-09-14',
            noticeImportance: 0,
            noticeStatus: 0,
            duesStatus: 0,
            noticeDues: '20000'
         },
         {
            noticeType: 2,
            noticeToken: 3,
            noticeTitle: '3 회비',
            noticeEditDate: '2024-08-13',
            noticeEndDate: '2024-09-10',
            noticeImportance: 1,
            noticeStatus: 1,
            duesStatus: 1,
            noticeDues: '2000'
         }
        ]});
    } else if (page == 'DetailScheduleAttendancePage' || page == 'EditScheduleAttendancePage') {
        res.status(200).send({result : 1 , resources : [
            [
                {scheduleAttendanceCode: '1234', 
                scheduleContent: '일정에 대한 세부 내용 설명 텍스트 형태', 
                scheduleLocation: '일정 장소는 배드민턴장입니다!', 
                scheduleAttendanceCode: null,
                scheduleContent: '노티스 컨텐트 텍스트다!',
                scheduleTitle: '이정도의 데이터만 줄래'}
            ], 
            [{  userToken: 6,   /// 나의 데이터
                userID: 2,
                userName: '최규호',
                attendanceStatus: null,
                absentReason: null,
                userImage: '456.jpg',
             }], 
            [
                {
                    userID: 1,
                    userName: '신민철456',
                    attendanceStatus: null,
                    absentReason: null,
                    userImage: '123.jpg',
                }, 
                {  
                    userID: 2,
                    userName: '김상수123',
                    attendanceStatus: 0,
                    absentReason: '대대장님 면담',
                    userImage: null,
                },
                {  
                    userID: 3,
                    userName: '최현234',
                    attendanceStatus: 1,
                    absentReason: null,
                    userImage: null,
                }
            ],
            [
                {  notUserToken: 2,
                    userName: '이준호',
                    attendanceStatus: 0,
                    absentReason: '안경점',
                    userImage: null,
                },
                {  notUserToken: 3,
                    userName: '김민창',
                    attendanceStatus: null,
                    absentReason: null,
                    userImage: null,
                },
                {  notUserToken: 4,
                    userName: '이윤창',
                    attendanceStatus: 1,
                    absentReason: null,
                    userImage: null,
                },
            ]]});
    }  else if (page == 'DetailNoticeDuesPage' || page == 'EditNoticeDuesPage') {
        res.status(200).send({result : 1 , 
            resources : 
                [[{scheduleAlert: true,
                 noticeContent: '회비 공지사항 디테일',
                 noticeWriter: '최규호', 
                 noticeContent : '노티스 컨텐트 받아라!',
                 noticeTitle: '노티스 제목이다 이녀석아',
                 noticeDues: '20000000',
                 noticeEndDate: '2024-08-22',
                
                    
                 duesPayStartDate : '2024-07-28',
                 duesPayEndDate : '2024-07-31',
                 duesUseStartDate : '2024-08-01',
                 duesUseEndDate : '2024-08-31',

                 duesList: [
                    {payToken: 1, payType: 1, payDate: '2024-08-18', updateDate: '2024-08-18', payName: '셔틀콕 구매', 
                        payPrice: '20000', payDetailContent: '셔틀콕 여분이 없어서 구매했습니다~', payDetailImage: '123.jpg'},

                    {payToken: 2, payType: 2, payDate: '2024-08-17', updateDate: '2024-08-19', payName: '음료', 
                        payPrice: '10000', payDetailContent: '편의점에서 포카리 구매했습니다~', payDetailImage: '456.jpg'},

                    {payToken: 3, payType: 3, payDate: '2024-08-20', updateDate: '2024-08-20', payName: '체육관', 
                        payPrice: '15000', payDetailContent: '탄현 배드민턴장 입장권 구매했습니다~', payDetailImage: null},
                 ]
                }],[{
                    userID: 'gyuho', userName: '최규호', duesStatus: 0
                }],[
                    {userID: 'gyuho', userName: '민한성', duesStatus: 0},
                    {userID: 'minchul', userName: '신민철', duesStatus: 1},
                    {userID: 'hyun', userName: '최현', duesStatus: 0},
                    {userID: 'jihoon', userName: '강지훈', duesStatus: 1},
                    {userID: 'younchang', userName: '이윤창', duesStatus: 0},
                ],[
                    // {notUserToken: 1, userName: '김민창', duesStatus: 1},
                    // {notUserToken: 2, userName: '우경찬', duesStatus: 1},
                    // {notUserToken: 3, userName: '이준호', duesStatus: 0},
                ]
           ]});
    }  else if (page == 'TotalAttendancePage') {
        res.status(200).send({result : 1 , 
            resources : 
                [
                    [
                        {scheduleToken: 1, scheduleStartDate: '2024-08-06', scheduleEndDate: '2024-08-06', 
                            scheduleTitle: '여행', scheudleImportance: true, scheduleAlert: false, scheduleStatus: true},
                            [{userID: 'minchul', userName: '신민철', attendanceStatus: 1}, {userID: 'gyuho', userName: '최규호', attendanceStatus: 1}, {userID: 'jihoon', userName: '강지훈', attendanceStatus: 0}, {userID: 'hansung', userName: '민한성', attendanceStatus: 0}, {userID: 'hansung', userName: '민한성', attendanceStatus: 0}, {userID: 'hansung', userName: '민한성', attendanceStatus: 0}, {userID: 'hansung', userName: '민한성', attendanceStatus: 0}],
                            [{notUserToken: 1, userName: '김민창', attendanceStatus: null}, {notUserToken: 2, userName: '최현', attendanceStatus: 1}, {notUserToken: 3, userName: '우경찬', attendanceStatus: 0}, {notUserToken: 4, userName: '김상수', attendanceStatus: null}]
                    ],
                    [
                        {scheduleToken: 2, scheduleStartDate: '2024-08-07', scheduleEndDate: '2024-08-07', 
                            scheduleTitle: '개강', scheudleImportance: true, scheduleAlert: false, scheduleStatus: true},
                            [{userID: 'minchul', userName: '신민철', attendanceStatus: 1}, {userID: 'gyuho', userName: '최규호', attendanceStatus: 0}, {userID: 'jihoon', userName: '강지훈', attendanceStatus: 1}, {userID: 'hansung', userName: '민한성', attendanceStatus: 0}, {userID: 'hansung', userName: '민한성', attendanceStatus: 0}, {userID: 'hansung', userName: '민한성', attendanceStatus: 0}, {userID: 'hansung', userName: '민한성', attendanceStatus: 0}],
                            [{notUserToken: 1, userName: '김민창', attendanceStatus: null}, {notUserToken: 2, userName: '최현', attendanceStatus: 0}, {notUserToken: 3, userName: '우경찬', attendanceStatus: 0}, {notUserToken: 4, userName: '김상수', attendanceStatus: null}],
                    ],
                    [
                        {scheduleToken: 3, scheduleStartDate: '2024-08-08', scheduleEndDate: '2024-08-08', 
                            scheduleTitle: '운동', scheudleImportance: false, scheduleAlert: true, scheduleStatus: true},
                            [{userID: 'minchul', userName: '신민철', attendanceStatus: 0}, {userID: 'gyuho', userName: '최규호', attendanceStatus: 0}, {userID: 'jihoon', userName: '강지훈', attendanceStatus: 1}, {userID: 'hansung', userName: '민한성', attendanceStatus: 1}, {userID: 'hansung', userName: '민한성', attendanceStatus: 0}, {userID: 'hansung', userName: '민한성', attendanceStatus: 0}, {userID: 'hansung', userName: '민한성', attendanceStatus: 0}],
                            [{notUserToken: 1, userName: '김민창', attendanceStatus: 1}, {notUserToken: 2, userName: '최현', attendanceStatus: 1}, {notUserToken: 3, userName: '우경찬', attendanceStatus: 0}, {notUserToken: 4, userName: '김상수', attendanceStatus: 1}],
                    ],
                    [
                        {scheduleToken: 3, scheduleStartDate: '2024-08-08', scheduleEndDate: '2024-08-08', 
                            scheduleTitle: '운동', scheudleImportance: false, scheduleAlert: true, scheduleStatus: true},
                            [{userID: 'minchul', userName: '신민철', attendanceStatus: 0}, {userID: 'gyuho', userName: '최규호', attendanceStatus: 0}, {userID: 'jihoon', userName: '강지훈', attendanceStatus: 1}, {userID: 'hansung', userName: '민한성', attendanceStatus: 0}, {userID: 'hansung', userName: '민한성', attendanceStatus: 0}, {userID: 'hansung', userName: '민한성', attendanceStatus: 0}, {userID: 'hansung', userName: '민한성', attendanceStatus: 0}],
                            [{notUserToken: 1, userName: '김민창', attendanceStatus: 1}, {notUserToken: 2, userName: '최현', attendanceStatus: 1}, {notUserToken: 3, userName: '우경찬', attendanceStatus: 0}, {notUserToken: 4, userName: '김상수', attendanceStatus: 0}],
                    ],
                    [
                        {scheduleToken: 3, scheduleStartDate: '2024-08-08', scheduleEndDate: '2024-08-08', 
                            scheduleTitle: '운동', scheudleImportance: false, scheduleAlert: true, scheduleStatus: true},
                            [{userID: 'minchul', userName: '신민철', attendanceStatus: 0}, {userID: 'gyuho', userName: '최규호', attendanceStatus: 0}, {userID: 'jihoon', userName: '강지훈', attendanceStatus: 1}, {userID: 'hansung', userName: '민한성', attendanceStatus: 1}, {userID: 'hansung', userName: '민한성', attendanceStatus: 0}, {userID: 'hansung', userName: '민한성', attendanceStatus: 0}, {userID: 'hansung', userName: '민한성', attendanceStatus: 0}],
                            [{notUserToken: 1, userName: '김민창', attendanceStatus: 1}, {notUserToken: 2, userName: '최현', attendanceStatus: 1}, {notUserToken: 3, userName: '우경찬', attendanceStatus: 0}, {notUserToken: 4, userName: '김상수', attendanceStatus: 0}],
                    ]

                ]
            });
    } else if (page == 'TotalDuesPage') {
        res.status(200).send({result : 1 , 
            resources : 
            [ [{"noticeToken":1,"noticeType":2,"noticeEditDate":"2024-08-06","noticeEndDate":"2024-08-06","noticeDues":"10000","noticeTitle":"여행","noticeImportance":true,"scheduleAlert":false,"noticeStatus":true, noticeContent: '내돈내산'}, 
                {duesStatus: 1},
                [{"userID":"minchul","userName":"신민철","duesStatus":1},{"userID":"gyuho","userName":"최규호","duesStatus":1},{"userID":"jihoon","userName":"강지훈","duesStatus":0},{"userID":"hansung","userName":"민한성","duesStatus":0},{"userID":"hansung","userName":"민한성","duesStatus":0},{"userID":"hansung","userName":"민한성","duesStatus":0},{"userID":"hansung","userName":"민한성","duesStatus":0}], 
                [{"notUserToken":1,"userName":"김민창","duesStatus":null},{"notUserToken":2,"userName":"최현","duesStatus":1},{"notUserToken":3,"userName":"우경찬","duesStatus":0},{"notUserToken":4,"userName":"김상수","duesStatus":null}]
            ], 
            [{"noticeToken":2,"noticeType":3,"noticeEditDate":"2024-08-07","noticeEndDate":"2024-08-07","noticeDues":"20000","noticeTitle":"셔틀콕을","noticeImportance":true, scheduleAlert:false,"noticeStatus":true, noticeContent: '와우'}, 
                {duesStatus: 1},
                [{"userID":"minchul","userName":"신민철","duesStatus":1},{"userID":"gyuho","userName":"최규호","duesStatus":0},{"userID":"jihoon","userName":"강지훈","duesStatus":1},{"userID":"hansung","userName":"민한성","duesStatus":0},{"userID":"hansung","userName":"민한성","duesStatus":0},{"userID":"hansung","userName":"민한성","duesStatus":0},{"userID":"hansung","userName":"민한성","duesStatus":0}], 
                [{"notUserToken":1,"userName":"김민창","duesStatus":null},{"notUserToken":2,"userName":"최현","duesStatus":0},{"notUserToken":3,"userName":"우경찬","duesStatus":0},{"notUserToken":4,"userName":"김상수","duesStatus":null}]
            ], 
            [{"noticeToken":3,"noticeType":4,"noticeEditDate":"2024-08-08","noticeEndDate":"2024-08-08","noticeDues":"30000","noticeTitle":"배고파","noticeImportance":false,"scheduleAlert":true,"noticeStatus":true, noticeContent: '노티스 콘텐트'}, 
                {},
                [{"userID":"minchul","userName":"신민철","duesStatus":0},{"userID":"gyuho","userName":"최규호","duesStatus":0},{"userID":"jihoon","userName":"강지훈","duesStatus":1},{"userID":"hansung","userName":"민한성","duesStatus":1},{"userID":"hansung","userName":"민한성","duesStatus":0},{"userID":"hansung","userName":"민한성","duesStatus":0},{"userID":"hansung","userName":"민한성","duesStatus":0}], 
                [{"notUserToken":1,"userName":"김민창","duesStatus":1},{"notUserToken":2,"userName":"최현","duesStatus":1},{"notUserToken":3,"userName":"우경찬","duesStatus":0},{"notUserToken":4,"userName":"김상수","duesStatus":1}]
            ], 
            [{"noticeToken":3,"noticeType":2,"noticeEditDate":"2024-08-08","noticeEndDate":"2024-08-08","noticeDues":"40000","noticeTitle":"음료","scheudleImportance":false,"scheduleAlert":true,"noticeStatus":true, noticeContent: '내용물'}, 
                {duesStatus: 0},
                [{"userID":"minchul","userName":"신민철","duesStatus":0},{"userID":"gyuho","userName":"최규호","duesStatus":0},{"userID":"jihoon","userName":"강지훈","duesStatus":1},{"userID":"hansung","userName":"민한성","duesStatus":0},{"userID":"hansung","userName":"민한성","duesStatus":0},{"userID":"hansung","userName":"민한성","duesStatus":0},{"userID":"hansung","userName":"민한성","duesStatus":0}], 
                [{"notUserToken":1,"userName":"김민창","duesStatus":1},{"notUserToken":2,"userName":"최현","duesStatus":1},{"notUserToken":3,"userName":"우경찬","duesStatus":0},{"notUserToken":4,"userName":"김상수","duesStatus":0}]
            ], 
            [{"noticeToken":3,"noticeType":3,"noticeEditDate":"2024-08-08","noticeEndDate":"2024-08-08","noticeDues":"30000","noticeTitle":"런닝화","noticeImportance":false,"scheduleAlert":true,"noticeStatus":true, noticeContent: '세부설명'}, 
                {},
                [{"userID":"minchul","userName":"신민철","duesStatus":0},{"userID":"gyuho","userName":"최규호","duesStatus":0},{"userID":"jihoon","userName":"강지훈","duesStatus":1},{"userID":"hansung","userName":"민한성","duesStatus":1},{"userID":"hansung","userName":"민한성","duesStatus":0},{"userID":"hansung","userName":"민한성","duesStatus":0},{"userID":"hansung","userName":"민한성","duesStatus":0}], 
                [{"notUserToken":1,"userName":"김민창","duesStatus":1},{"notUserToken":2,"userName":"최현","duesStatus":1},{"notUserToken":3,"userName":"우경찬","duesStatus":0},{"notUserToken":4,"userName":"김상수","duesStatus":0}]
            ]]
  
            });
    } else {
        res.status(200).send({result : 1, userPermission : 2});
    }
    
});

/////////////////////////////////////////////////////////////////////////////////
// EditAttendanceList
app.post('/EditDuesList' , async (req,res) => {
    const data = req.body;
    
    console.log("EditDuesList 요청 성공");
    console.log(data);
    
    res.status(200).send({result : 1, userPermission : 2});
});

// EditAttendanceList
app.post('/EditAttendanceList' , async (req,res) => {
    const data = req.body;
    
    console.log("EditAttendanceList 요청 성공");
    console.log(data);
    
    res.status(200).send({result : 1, userPermission : 2});
});

// Attend
app.post('/Attend' , async (req,res) => {
    const data = req.body;
    
    console.log("Attend 요청 성공");
    console.log(data);

    
    res.status(200).send({result : 1, userPermission : 2});
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
            {noticeToken : 3, noticeTitle : '회비 내라!', userduesStatus : 0 , noticeDues: '5000', },
            {noticeToken : 4, noticeTitle : '회비 내라 고!', userduesStatus : 0 , noticeDues: '10000', }
        ], [
            {scheduleToken : 3, scheduleTitle : '출석 있어', attendanceStatus : 0 , scheduleStartDate: '2024-08-22', scheduleEndDate: '2024-08-22', scheduleAttendace: true, attendanceStatus: 0,},
            {scheduleToken : 4, scheduleTitle : '출석 있어 ', attendanceStatus : 1 , scheduleStartDate: '2024-08-16', scheduleEndDate: '2024-08-25', scheduleAttendace: true, attendanceStatus: 1,},
            {scheduleToken : 4, scheduleTitle : '출석 있어출석 있어출석 있어출석 있어출석 있어', attendanceStatus : 0 , absentReason: '내맘이지!', scheduleStartDate: '2024-08-23', scheduleEndDate: '2024-08-29', scheduleAttendace: true, attendanceStatus: 1,},
            {scheduleToken : 4, scheduleTitle : '출석 있어출석 있어출석 있어출석 있어출석 있어출석 있어출석 있어출석 있어', attendanceStatus : null , scheduleStartDate: '2024-08-12', scheduleEndDate: '2024-08-23', scheduleAttendace: true, attendanceStatus: 0,},
        ], [
            {scheduleToken : 3, scheduleTitle : '출석기능이 없어', attendanceStatus : 0 , scheduleStartDate: '2024-08-22', scheduleEndDate: '2024-08-22', scheduleAttendace: false },
            {scheduleToken : 4, scheduleTitle : '출석기능이 없어 중산 정기모임 ', attendanceStatus : 1 , scheduleStartDate: '2024-08-16', scheduleEndDate: '2024-08-17', scheduleAttendace: false, },
            // {scheduleToken : 4, scheduleTitle : '출석기능이 없어2', attendanceStatus : 0 , absentReason: '내맘이지!', scheduleStartDate: '2024-08-18', scheduleEndDate: '2024-08-18', scheduleAttendace: false, },
            // {scheduleToken : 4, scheduleTitle : '출석기능이 없어3', attendanceStatus : null , scheduleStartDate: '2024-08-19', scheduleEndDate: '2024-08-19', scheduleAttendace: false, },
        ]
    ]});
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
                noticeType: 1,
                noticeDues: null,
             }]});
        } else if (data.noticeToken == 2) {
            res.status(200).send({result : 1 , resources : [{
                noticeContent: '장소는 중산배드민턴장이구요, 참석자는 10명입니다!',
                noticeWriter: '신민철',
                noticeCreatedDate: '2024-09-09',
                noticeEditDate: '2024-09-29',
                noticeEndDate: '2024-08-31',
                noticeType: 2,
                noticeDues: '10000',
             }]});
        } else {
            res.status(200).send({result : 1 , resources : [{
                noticeContent: '나머지 공지사항들이구요, 참석자는 10명입니다!',
                noticeWriter: '최현',
                noticeCreatedDate: '2024-09-09',
                noticeEditDate: '2024-09-29',
                noticeEndDate: '2024-08-31',
                noticeType: 3,
                noticeDues: '2000000',
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
            scheduleAttendance: 1,
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
            scheduleAttendance: 0,
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
            scheduleascheduleAttendancettendanceStatus: 1,
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
            scheduleAttendance: 1,
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

    res.status(200).send({result: 1, resources : {userToken : 6, userImage : '456.jpg' }});

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



