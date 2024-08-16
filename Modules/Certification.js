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

        }else if (page == "GroupSchedulePage"){
            const groupToken = query["groupToken"];
            const data = await GroupSchedulePage(groupToken);
            return {result : 1 , resources : data};

        }else if (page == "GroupNoticePage"){
            const groupToken = query["groupToken"];
            const data = await GroupNoticePage(groupToken);
            return {result : 1 , resources : data};

        }else if (page == "CreateGroupNoticePage"){
            console.log("필요한 리소스가 존재하지 않습니다.")
            return {result : 1 , resources : null};
        }else if (page == "CreateGroupSchedulePage"){
            console.log("필요한 리소스가 존재하지 않습니다.")
            return {result : 1 , resources : null};
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