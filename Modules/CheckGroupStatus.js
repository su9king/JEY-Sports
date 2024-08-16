//필요한 모듈 선언
const connection = require('../DatabaseLoad');

// 메인 실행 코드. 그냥 복사 붙여넣기 용
module.exports = {
    CheckGroupStatus : async(userToken,data) => {
        try {
            const todayDate = data["todayDate"];
            const groupToken = data["groupToken"];
            
            const scheduleResources = await GetSchedules(userToken,groupToken,todayDate);
            const noticeResources = await GetNotices(userToken,groupToken,todayDate);

            const resources = [scheduleResources,noticeResources];

            return {result : 1,resources : resources};
        }catch(error){
            return {result : 0, resources : null};
        }
        
        //복사 붙여넣기 용 
        
    }
};

async function GetSchedules(userToken,groupToken,todayDate) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT sc.scheduleToken, sc.scheduleTitle, ac.attendance
            FROM Schedules AS sc 
            JOIN AttendanceUsers AS ac ON sc.scheduleToken = ac.scheduleToken
            WHERE ? BETWEEN sc.scheduleStartDate AND sc.scheduleEndDate
            AND sc.groupToken = ?
            AND ac.userToken = ?
            AND sc.scheduleAttendance = true`, [todayDate,groupToken,userToken], 
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
        connection.query(`SELECT nc.noticeToken, nc.noticeTitle, du.duesStatus
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
    
                
                if (results.affectedRows > 0) {
                    resolve({result : 1,resources : null});  
                } else {
                    resolve({result : 0 , resources : null});  
                }
            }
        );
    });
}
