//필요한 모듈 선언
const connection = require('../DatabaseLoad');
const moment = require('moment-timezone');

// 메인 실행 코드
module.exports = {

    //page 와 userToken 기반으로 각 페이지에 맞는 리소스 제공
    Certification: async (userToken,page,query) => {

        if (page == "PrivatePage"){
            const data = await PrivatePage(userToken)
            return {result : 1 , resources : data};

        }else if (page == "CreateGroupPage"){
            console.log("필요한 리소스가 존재하지 않습니다.")
            return {result : 1 , resources : null};

        }else if (page == "GroupMainPage"){
            const groupToken = query["groupToken"];

            if (groupToken == undefined){ // 그룹 토큰을 전달 받지 않음
                return {result : 0 , resources : null}
            }

            const data = await GroupMainPage(groupToken)

            if (data == null){ //그룹 토큰이 잘못 됨 
                return {result : 0 , resources : data};
            }else{
                return {result : 1 , resources : data};
            }
            
        }else if (page == "EditUserPage"){
            
            const data = await EditUserPage(userToken);
            return {result : 1 , resources : data};

        }else if (page == "EditGroupPage"){
            const groupToken = query["groupToken"];
            const data = await EditGroupPage(groupToken);
            return {result : 1 , resources : data};

        }else if (page == "GroupMemberPage"){
            const groupToken = query["groupToken"];
            const data = await GroupMemberPage(groupToken);
            const data2 = await GroupMemberPage2(groupToken);
            return {result : 1 , resources : [data,data2]};

            //// 일정 및 공지사항 회원인증 
        }else if (page == "GroupSchedulePage"){
            const groupToken = query["groupToken"];
            const data = await GroupSchedulePage(groupToken);
            return {result : 1 , resources : data};

        }else if (page == "GroupNoticePage"){
            const groupToken = query["groupToken"];
            const data = await GroupNoticePage(groupToken);
            return {result : 1 , resources : data};
            
        }else if (page == "CreateGroupNoticePage"){
            return {result : 1 , resources : null};
        }else if (page == "CreateGroupSchedulePage"){
            return {result : 1 , resources : null};

            //// 출석 및 회비 관련 회원인증
        }else if (page == "ScheduleAttendancePage"){
            
            const groupToken = query["groupToken"];
            const data = await ScheduleAttendancePage(groupToken);
            return {result : 1 , resources : data};

        }else if (page == "DetailScheduleAttendancePage"){
            const scheduleToken = query["scheduleToken"];
            const data = await DetailScheduleAttendancePage(scheduleToken,userToken); //일정 데이터랑, 출석 데이터 2차원배열 이용

            return {result : 1 , resources : data};

        }else if (page == "EditScheduleAttendancePage"){
            const scheduleToken = query["scheduleToken"];
            const data = await DetailScheduleAttendancePage(scheduleToken,userToken); //일정 데이터랑, 출석 데이터 2차원배열 이용

            return {result : 1 , resources : data};

            //// 출석 및 회비 관련 회원인증
        }else if (page == "TotalAttendancePage"){
            const groupToken = query["groupToken"];
            const data = await TotalAttendancePage(groupToken);
            return {result : 1 , resources : data};

        }else if (page == "NoticeDuesPage"){
            const groupToken = query["groupToken"];
            const data = await NoticeDuesPage(groupToken);

            return {result : 1 , resources : data};

        }else if (page == "DetailNoticeDuesPage"){
            const noticeToken = query["noticeToken"];
            const data = await DetailNoticeDuesPage(noticeToken,userToken); //공지사항, 회비 데이터 2차원배열 이용

            return {result : 1 , resources : data};

        }else if (page == "EditNoticeDuesPage"){
            const noticeToken = query["noticeToken"];
            const data = await DetailNoticeDuesPage(noticeToken,userToken); //공지사항, 회비 데이터 2차원배열 이용

            return {result : 1 , resources : data};

            //// 출석 및 회비 관련 회원인증
        }else if (page == "TotalDuesPage"){
            const groupToken = query["groupToken"];
            const data = await TotalDuesPage(groupToken,userToken);
            return {result : 1 , resources : data};
        }

        
    }
};

//==================================================함수 선언 파트

async function PrivatePage(userToken){
    return new Promise((resolve, reject) => {
        connection.query(`SELECT org.groupID,org.groupImage, 
                            org.groupName, usorg.groupToken ,usorg.userPermission
                            FROM UsersOrganizations AS usorg
                            JOIN Organizations AS org ON org.groupToken = usorg.groupToken
                            WHERE usorg.userToken = ?;`, [userToken],
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);

                } //쿼리 결과가 없다면 소속된 조직이 존재하지 않다는 뜻
                if (results.length > 0) {
                    resolve(results);
                } else {
                    resolve(null);
                }
            }
        );
    })
}

async function GroupMainPage(groupToken){

    return new Promise((resolve, reject) => {
        connection.query(`SELECT groupName,groupImage FROM Organizations
            WHERE groupToken = ?`, [groupToken],
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);

                } //쿼리 결과가 없다면 소속된 그룹 토큰이 잘못 됨.
                if (results.length > 0) {
                    resolve(results);
                } else {
                    resolve(null);
                }
            }
        );
    })
}

async function EditUserPage(userToken){

    return new Promise((resolve, reject) => {
        connection.query(`SELECT userImage,userName,userIntro,
            userMail, userPW 
            FROM Users
            WHERE userToken = ?`, [userToken],
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);

                } //쿼리 결과가 없다면 유저 토큰이 잘못 됨.
                if (results.length > 0) {
                    resolve(results);
                } else {
                    resolve(null);
                }
            }
        );
    })
}

async function EditGroupPage(groupToken){

    return new Promise((resolve, reject) => {
        connection.query(`SELECT groupImage,groupName,groupIntro,
            groupID, groupPW,
            groupBankAccountName,group BankAccountNumber
            FROM Users
            WHERE groupToken = ?`, [groupToken],
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);

                } //쿼리 결과가 없다면 그룹 토큰이 잘못 됨.
                if (results.length > 0) {
                    resolve(results);
                } else {
                    resolve(null);
                }
            }
        );
    })
}

async function EditGroupPage(groupToken){

    return new Promise((resolve, reject) => {
        connection.query(`SELECT groupImage,groupName,groupIntro,
            groupID, groupPW,
            groupBankAccountName,groupBankAccountNumber
            FROM Organizations
            WHERE groupToken = ?`, [groupToken],
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);

                } //쿼리 결과가 없다면 그룹 토큰이 잘못 됨.
                if (results.length > 0) {
                    resolve(results);
                } else {
                    resolve(null);
                }
            }
        );
    })
}


//조직의 소프트웨어 유저 불러오기
async function GroupMemberPage(groupToken){

    return new Promise((resolve, reject) => {
        connection.query(`SELECT usr.userID , usr.userPhone, usrorg.userPermission ,usr.userName, usr.userImage , usr.userIntro, usr.userMail
                          FROM Users AS usr
                          JOIN UsersOrganizations AS usrorg ON usrorg.userToken = usr.userToken
                          WHERE usrorg.groupToken = ?`, [groupToken],
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);

                } //쿼리 결과가 없다면 그룹 토큰이 잘못 됨.
                if (results.length > 0) {
                    resolve(results);
                } else {
                    resolve(null);
                }
            }
        );
    })
}
//조직의 소프트웨어 비유저 불러오기
async function GroupMemberPage2(groupToken){

    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT notUserToken,userName,userPhone FROM NotUsersOrganizations
            WHERE groupToken = ?`, [groupToken],
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);

                } //쿼리 결과가 없다면 그룹 토큰이 잘못 됨.
                if (results.length > 0) {
                    resolve(results);
                } else {
                    resolve(null);
                }
            }
        );
    })
}

async function GroupSchedulePage(groupToken){

    return new Promise((resolve, reject) => {
        connection.query(`SELECT scheduleToken , scheduleTitle, scheduleStatus, scheduleImportance,
                          scheduleStartDate,scheduleEndDate,scheduleLocation,scheduleContent
                          FROM Schedules 
                          WHERE groupToken = ?`, [groupToken],
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);

                } //쿼리 결과가 없다면 그룹 토큰이 잘못 됨.
                if (results.length > 0) {
                    // 날짜를 한국 시간대로 변환
                    results.forEach(schedule => {
                        schedule.scheduleStartDate = moment(schedule.scheduleStartDate).tz('Asia/Seoul').format('YYYY-MM-DD');
                        schedule.scheduleEndDate = moment(schedule.scheduleEndDate).tz('Asia/Seoul').format('YYYY-MM-DD');
                    });
                    resolve(results);
                } else {
                    resolve(null);
                }
            }
        );
    })
}

async function GroupNoticePage(groupToken){

    return new Promise((resolve, reject) => {
        connection.query(`SELECT noticeToken , noticeTitle, noticeStatus, noticeImportance, noticeEditDate , noticeType
                          FROM Notices 
                          WHERE groupToken = ?`, [groupToken],
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);

                } //쿼리 결과가 없다면 그룹 토큰이 잘못 됨.
                if (results.length > 0) {
                    resolve(results);
                } else {
                    resolve(null);
                }
            }
        );
    })
}

async function ScheduleAttendancePage(groupToken){

    return new Promise((resolve, reject) => {
        connection.query(`SELECT scheduleToken , scheduleTitle, scheduleStatus, scheduleImportance,
                          scheduleStartDate,scheduleEndDate,scheduleLocation,scheduleContent
                          FROM Schedules 
                          WHERE groupToken = ? and scheduleAttendance = true`, [groupToken],
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);

                } //쿼리 결과가 없다면 그룹 토큰이 잘못 됨.
                if (results.length > 0) {
                    // 날짜를 한국 시간대로 변환
                    results.forEach(schedule => {
                        schedule.scheduleStartDate = moment(schedule.scheduleStartDate).tz('Asia/Seoul').format('YYYY-MM-DD');
                        schedule.scheduleEndDate = moment(schedule.scheduleEndDate).tz('Asia/Seoul').format('YYYY-MM-DD');
                    });
                    resolve(results);
                } else {
                    resolve(null);
                }
            }
        );
    })
}

async function NoticeDuesPage(groupToken){

    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM Notices 
                          WHERE groupToken = ? and noticeType = 2`, [groupToken],
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);

                } //쿼리 결과가 없다면 그룹 토큰이 잘못 됨.
                if (results.length > 0) {
                    results.forEach(notice => {
                        notice.noticeEditDate = moment(notice.noticeEditDate).tz('Asia/Seoul').format('YYYY-MM-DD');
                        notice.noticeEndDate = moment(notice.noticeEndDate).tz('Asia/Seoul').format('YYYY-MM-DD');
                    });
                    resolve(results);
                } else {
                    resolve(null);
                }
            }
        );
    })
}

async function DetailScheduleAttendancePage(scheduleToken,userToken) {
    return new Promise((resolve, reject) => {
        // 일정 불러오기
        const scheduleQuery = new Promise((resolveSchedule, rejectSchedule) => {
            connection.query(`SELECT * FROM schedules WHERE scheduleToken = ?`, [scheduleToken],
                (error, results) => {
                    if (error) {
                        console.error('일정 쿼리 실행 오류:', error);
                        return rejectSchedule(error);
                    }
                    if (results.length > 0) {
                        // 날짜를 한국 시간대로 변환
                        results.forEach(schedule => {
                            schedule.scheduleStartDate = moment(schedule.scheduleStartDate).tz('Asia/Seoul').format('YYYY-MM-DD');
                            schedule.scheduleEndDate = moment(schedule.scheduleEndDate).tz('Asia/Seoul').format('YYYY-MM-DD');
                        });
                        resolveSchedule(results);
                    } else {
                        resolveSchedule(null);
                    }
                }
            );
        });
        //본인의 출석정보 가져오기
        const MyAttendanceStatus = new Promise((resolveMyAttendance, rejectMyAttendance) => {
            connection.query(`SELECT usr.userID, usr.userName ,au.attendanceStatus, au.absentReason
                FROM AttendanceUsers as au
                JOIN Users AS usr ON usr.userToken = au.userToken
                WHERE au.scheduleToken = ? and usr.userToken = ?`, [scheduleToken,userToken],
                (error, results) => {
                    if (error) {
                        console.error('소프트웨어 유저 출석 쿼리 실행 오류:', error);
                        return rejectMyAttendance(error);
                    }
                    if (results.length > 0) {
                        resolveMyAttendance(results);
                    } else {
                        resolveMyAttendance(null);
                    }
                }
            );
        });

        // 소프트웨어 유저의 출석정보 가져오기
        const attendanceUsersQuery = new Promise((resolveAttendanceUsers, rejectAttendanceUsers) => {
            connection.query(`SELECT usr.userID, usr.userName, au.attendanceStatus, au.absentReason
                FROM AttendanceUsers as au
                JOIN Users AS usr ON usr.userToken = au.userToken
                WHERE au.scheduleToken = ?`, [scheduleToken],
                (error, results) => {
                    if (error) {
                        console.error('소프트웨어 유저 출석 쿼리 실행 오류:', error);
                        return rejectAttendanceUsers(error);
                    }
                    if (results.length > 0) {
                        resolveAttendanceUsers(results);
                    } else {
                        resolveAttendanceUsers(null);
                    }
                }
            );
        });

        // 소프트웨어 비유저의 출석정보 가져오기
        const attendanceNonUsersQuery = new Promise((resolveNonUsers, rejectNonUsers) => {
            connection.query(`SELECT nuo.notUserToken,nuo.userName, au.attendanceStatus, au.absentReason 
                FROM AttendanceUsers as au
                JOIN NotUsersOrganizations AS nuo ON nuo.notUserToken = au.notUserToken
                WHERE au.scheduleToken = ?`, [scheduleToken],
                (error, results) => {
                    if (error) {
                        console.error('소프트웨어 비유저 출석 쿼리 실행 오류:', error);
                        return rejectNonUsers(error);
                    }
                    if (results.length > 0) {
                        resolveNonUsers(results);
                    } else {
                        resolveNonUsers(null);
                    }
                }
            );
        });

        // 모든 쿼리 실행
        Promise.all([scheduleQuery,MyAttendanceStatus ,attendanceUsersQuery, attendanceNonUsersQuery])
            .then(results => {
                const [data1, data2, data3, data4] = results;
                resolve([data1, data2, data3, data4]);
            })
            .catch(error => {
                reject(error);
            });
    });
}



async function DetailNoticeDuesPage(noticeToken,userToken) {
    return new Promise((resolve, reject) => {
        // 공지사항 불러오기
        const noticeQuery = new Promise((resolveNotice, rejectNotice) => {
            connection.query(`SELECT * FROM Notices WHERE noticeToken = ?`, [noticeToken],
                (error, results) => {
                    if (error) {
                        console.error('공지사항 쿼리 실행 오류:', error);
                        return rejectNotice(error);
                    }
                    if (results.length > 0) {
                        // 날짜를 한국 시간대로 변환
                        results.forEach(notice => {
                            notice.noticeCreatedDate = moment(notice.noticeCreatedDate).tz('Asia/Seoul').format('YYYY-MM-DD');
                            notice.noticeEndDate = moment(notice.noticeEndDate).tz('Asia/Seoul').format('YYYY-MM-DD');
                        });
                        resolveNotice(results);
                    } else {
                        resolveNotice(null);
                    }
                }
            );
        });
        //본인의 출석정보 가져오기
        const MyDueStatus = new Promise((resolveMyAttendance, rejectMyAttendance) => {
            connection.query(`SELECT usr.userName,usr.userID ,du.duesStatus
                FROM DuesUsers as du
                JOIN Users AS usr ON usr.userToken = du.userToken
                WHERE du.noticeToken = ? and usr.userToken = ?`, [noticeToken,userToken],
                (error, results) => {
                    if (error) {
                        console.error('소프트웨어 유저 출석 쿼리 실행 오류:', error);
                        return rejectMyAttendance(error);
                    }
                    if (results.length > 0) {
                        resolveMyAttendance(results);
                    } else {
                        resolveMyAttendance(null);
                    }
                }
            );
        });
        // 소프트웨어 유저의 회비정보 가져오기
        const duesUsersQuery = new Promise((resolveDuesUsers, rejectDuesUsers) => {
            connection.query(`SELECT usr.userName,usr.userID, du.duesStatus
                FROM DuesUsers as du
                JOIN Users AS usr ON usr.userToken = du.userToken
                WHERE du.noticeToken = ?`, [noticeToken],
                (error, results) => {
                    if (error) {
                        console.error('소프트웨어 유저 쿼리 실행 오류:', error);
                        return rejectDuesUsers(error);
                    }
                    if (results.length > 0) {
                        resolveDuesUsers(results);
                    } else {
                        resolveDuesUsers(null);
                    }
                }
            );
        });

        // 소프트웨어 비유저의 회비정보 가져오기
        const duesNonUsersQuery = new Promise((resolveNonUsers, rejectNonUsers) => {
            connection.query(`SELECT nuo.notUserToken,nuo.userName, du.duesStatus
                FROM DuesUsers as du
                JOIN NotUsersOrganizations AS nuo ON nuo.notUserToken = du.notUserToken
                WHERE du.noticeToken = ?`, [noticeToken],
                (error, results) => {
                    if (error) {
                        console.error('소프트웨어 비유저 쿼리 실행 오류:', error);
                        return rejectNonUsers(error);
                    }
                    if (results.length > 0) {
                        resolveNonUsers(results);
                    } else {
                        resolveNonUsers(null);
                    }
                }
            );
        });

        // 모든 쿼리 실행
        Promise.all([noticeQuery, MyDueStatus ,duesUsersQuery, duesNonUsersQuery])
            .then(results => {
                const [data1, data2, data3, data4] = results;
                resolve([data1, data2, data3 , data4]);
            })
            .catch(error => {
                reject(error);
            });
    });
}


async function TotalAttendancePage(groupToken) {
    return new Promise((resolve, reject) => {
        // 그룹에 해당하는 모든 일정 불러오기
        const schedulesQuery = new Promise((resolveSchedules, rejectSchedules) => {
            connection.query(`SELECT * FROM Schedules WHERE groupToken = ?`, [groupToken],
                (error, results) => {
                    if (error) {
                        console.error('일정 쿼리 실행 오류:', error);
                        return rejectSchedules(error);
                    }
                    results.forEach(schedule => {
                        schedule.scheduleStartDate = moment(schedule.scheduleStartDate).tz('Asia/Seoul').format('YYYY-MM-DD');
                        schedule.scheduleEndDate = moment(schedule.scheduleEndDate).tz('Asia/Seoul').format('YYYY-MM-DD');
                    });
                    resolveSchedules(results);
                }
            );
        });

        // 모든 일정에 대해 출석 정보를 가져오는 함수
        const getAttendanceForSchedules = (schedules) => {
            return Promise.all(schedules.map(schedule => {
                return Promise.all([
                    new Promise((resolveAttendanceUsers, rejectAttendanceUsers) => {
                        connection.query(`SELECT usr.userName,usr.userID, au.attendanceStatus, au.absentReason
                            FROM AttendanceUsers as au
                            JOIN Users as usr ON usr.userToken = au.userToken
                            WHERE au.scheduleToken = ?`, [schedule.scheduleToken],
                            (error, attendanceResults) => {
                                if (error) {
                                    console.error('출석 쿼리 실행 오류 (Users):', error);
                                    return rejectAttendanceUsers(error);
                                }
                                resolveAttendanceUsers(attendanceResults);
                            }
                        );
                    }),
                    new Promise((resolveAttendanceNonUsers, rejectAttendanceNonUsers) => {
                        connection.query(`SELECT nuo.notUserToken, nuo.userName, au.attendanceStatus, au.absentReason 
                            FROM AttendanceUsers as au
                            JOIN NotUsersOrganizations AS nuo ON nuo.notUserToken = au.notUserToken
                            WHERE au.scheduleToken = ?`, [schedule.scheduleToken],
                            (error, nonUserAttendanceResults) => {
                                if (error) {
                                    console.error('출석 쿼리 실행 오류 (NotUsersOrganizations):', error);
                                    return rejectAttendanceNonUsers(error);
                                }
                                resolveAttendanceNonUsers(nonUserAttendanceResults);
                            }
                        );
                    })
                ]);
            }));
        };

        // 모든 쿼리 실행
        schedulesQuery
            .then(schedules => {
                if (schedules.length === 0) {
                    resolve(null); // 일정이 없다면 null 반환
                    return;
                }
                return getAttendanceForSchedules(schedules).then(attendanceData => {
                    // 최종 데이터 구조 만들기
                    const finalData = schedules.map((schedule, index) => {
                        return [
                            schedule,
                            attendanceData[index][0], // 멤버 출석 데이터
                            attendanceData[index][1] // 비멤버 출석 데이터
                        ];
                    });
                    resolve(finalData);
                });
            })
            .catch(error => {
                reject(error);
            });
    });
}


async function TotalDuesPage(groupToken,userToken){

    return new Promise((resolve, reject) => {
        // 그룹에 해당하는 모든 공지사항 불러오기
        const noticeQuery = new Promise((resolveNotices, rejectNotices) => {
            connection.query(`SELECT * FROM Notices WHERE groupToken = ? and noticeType > 1`, [groupToken],
                (error, results) => {
                    if (error) {
                        console.error('일정 쿼리 실행 오류:', error);
                        return rejectNotices(error);
                    }
                    results.forEach(notice => {
                        notice.noticeEditDate = moment(notice.noticeEditDate).tz('Asia/Seoul').format('YYYY-MM-DD');
                        notice.noticeEndDate = moment(notice.noticeEndDate).tz('Asia/Seoul').format('YYYY-MM-DD');
                    });
                    resolveNotices(results);
                }
            );
        });

        // 공지사항에 대해 회비 정보를 가져오는 함수
        const getDuesFromNotices = (notices) => {
            return Promise.all(notices.map(notice => {
                return Promise.all([
                    new Promise((resolveDuesUsers, rejectDuesUsers) => {
                        connection.query(`SELECT usr.userName,usr.userID, du.duesStatus
                            FROM DuesUsers as du
                            JOIN Users as usr ON usr.userToken = du.userToken
                            WHERE du.noticeToken = ?`, [notice.noticeToken],
                            (error, duesResult) => {
                                if (error) {
                                    console.error('출석 쿼리 실행 오류 (Users):', error);
                                    return rejectDuesUsers(error);
                                }
                                resolveDuesUsers(duesResult);
                            }
                        );
                    }),
                    new Promise((resolveAttendanceNonUsers, rejectAttendanceNonUsers) => {
                        connection.query(`SELECT nuo.notUserToken, nuo.userName, du.duesStatus
                            FROM DuesUsers as du
                            JOIN NotUsersOrganizations AS nuo ON nuo.notUserToken = du.notUserToken
                            WHERE du.noticeToken = ?`, [notice.noticeToken],
                            (error, nonUserDuesResult) => {
                                if (error) {
                                    console.error('출석 쿼리 실행 오류 (NotUsersOrganizations):', error);
                                    return rejectAttendanceNonUsers(error);
                                }
                                resolveAttendanceNonUsers(nonUserDuesResult);
                            }
                        );
                    }),
                    new Promise((resolveMyDues, rejectMyDues) => {
                        connection.query(`SELECT usr.userName,usr.userID, du.duesStatus
                            FROM DuesUsers as du
                            JOIN Users as usr ON usr.userToken = du.userToken
                            WHERE du.noticeToken = ?
                            AND usr.userToken = ?`, [notice.noticeToken,userToken],
                            (error, myDuesResult) => {
                                if (error) {
                                    console.error('출석 쿼리 실행 오류 (SelfUsers):', error);
                                    return rejectMyDues(error);
                                }
                                resolveMyDues(myDuesResult);
                            }
                        );
                    })
                ]);
            }));
        };

        // 모든 쿼리 실행
        noticeQuery
            .then(notices => {
                if (notices.length === 0) {
                    resolve(null); // 회비 공지사항이 없다면 null 반환
                    return;
                }
                return getDuesFromNotices(notices).then(duesDatas => {
                    // 최종 데이터 구조 만들기
                    const finalData = notices.map((notice, index) => {
                        return [
                            notice,
                            duesDatas[index][2],
                            duesDatas[index][0], // 멤버 회비 데이터
                            duesDatas[index][1] // 비멤버 회비 데이터
                        ];
                    });
                    resolve(finalData);
                });
            })
            .catch(error => {
                reject(error);
            });
    });
}
