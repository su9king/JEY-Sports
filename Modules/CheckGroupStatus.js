//필요한 모듈 선언
const connection = require('../DatabaseLoad');

// 메인 실행 코드. 그냥 복사 붙여넣기 용
module.exports = {
    CheckGroupStatus : async(userToken,data) => {
        try {
            const todayDate = data["todayDate"];
            const groupToken = data["groupToken"];
            
            const scheduleResources = await GetFutureSchedules(userToken,groupToken,todayDate);
            const noticeResources = await GetNotices(userToken,groupToken,todayDate);

            const resources = [noticeResources,scheduleResources];

            return {result : 1, resources : resources};
        }catch(error){
            return {result : 0, resources : null};
        }
        
        //복사 붙여넣기 용 
        
    }
};

//2주일 이내의 일정들 모두 불러오기
async function GetFutureSchedules(userToken,groupToken,todayDate) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT sc.scheduleToken, sc.scheduleTitle, ac.attendanceStatus ,sc.scheduleStartDate ,sc.scheduleEndDate
            FROM Schedules AS sc 
            JOIN AttendanceUsers AS ac ON sc.scheduleToken = ac.scheduleToken
            WHERE scheduleStartDate BETWEEN ? AND DATE_ADD(?, INTERVAL 2 WEEK)
            AND sc.groupToken = ?
            AND ac.userToken = ?
            AND sc.scheduleAttendance = true`, [todayDate,todayDate,groupToken,userToken], 
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
async function GetNotices(userToken,groupToken,todayDate) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT nc.noticeToken, nc.noticeTitle, du.duesStatus , nc.noticeDues
            FROM Notices AS nc 
            JOIN DuesUsers AS du ON nc.noticeToken = du.noticeToken
            WHERE ? BETWEEN nc.noticeCreatedDate AND COALESCE(nc.noticeEndDate, '2099-12-31')
            AND nc.groupToken = ?
            AND du.userToken = ?
            AND nc.noticeType  = 2`, [todayDate,groupToken,userToken], 
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
