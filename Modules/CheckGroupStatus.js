//필요한 모듈 선언
const connection = require('../DatabaseLoad');
const moment = require('moment-timezone');

// 메인 실행 코드. 그냥 복사 붙여넣기 용
module.exports = {
    CheckGroupStatus : async(userToken,data) => {
        try {
            const todayDate = data["todayDate"];
            const groupToken = data["groupToken"];
            
            const scheduleResources1 = await GetFutureSchedules(userToken,groupToken,todayDate,true);
            const scheduleResources2 = await GetFutureSchedules(userToken,groupToken,todayDate,false);
            const noticeResources = await GetNotices(userToken,groupToken,todayDate);

            const resources = [noticeResources,scheduleResources1,scheduleResources2];

            return {result : 1, resources : resources};
        }catch(error){
            return {result : 0, resources : null};
        }
        
        //복사 붙여넣기 용 
        
    }
};

//2주일 이내의 일정들 모두 불러오기
async function GetFutureSchedules(userToken,groupToken,todayDate,boolean) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT sc.scheduleToken, sc.scheduleTitle, ac.attendanceStatus ,sc.scheduleStartDate ,sc.scheduleEndDate , ac.absentReason
            FROM Schedules AS sc 
            JOIN AttendanceUsers AS ac ON sc.scheduleToken = ac.scheduleToken
            WHERE (? BETWEEN scheduleStartDate AND scheduleEndDate 
            or scheduleStartDate BETWEEN ? AND DATE_ADD(?, INTERVAL 2 WEEK))
            AND sc.groupToken = ?
            AND ac.userToken = ?
            AND sc.scheduleAttendance = ?`, [todayDate,todayDate,todayDate,groupToken,userToken,boolean], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }
                if (results.length > 0) {
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
    });
}

async function GetNotices(userToken,groupToken,todayDate) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT nc.noticeToken, nc.noticeTitle, du.duesStatus , nc.noticeDues
            FROM Notices AS nc 
            JOIN DuesUsers AS du ON nc.noticeToken = du.noticeToken
            WHERE ? BETWEEN nc.noticeCreatedDate AND COALESCE(nc.noticeEndDate, '2099-12-31')
            AND nc.groupToken = ?
            AND du.userToken = ?
            AND nc.noticeType  = 2
            AND du.duesStatus = 0`, [todayDate,groupToken,userToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }
    
                
                if (results.length > 0) {
                    resolve(results);  
                } else {
                    resolve(null);  
                }
            }
        );
    });
}
