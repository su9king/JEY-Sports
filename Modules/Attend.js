//필요한 모듈 선언
const connection = require('../DatabaseLoad');

// 메인 실행 코드
module.exports = {
    Attend : async(userToken,data) => {
        const scheduleToken = data["scheduleToken"];
        const functionType = data["functionType"];

        if (functionType == 1){
            const result = await Attend(scheduleToken,userToken);
            return result;

        } else if (functionType == 2){
            const absentReason = data["absentReason"];
            const result = await Absent(scheduleToken,userToken,absentReason);
            return result;

        }else{
            return {result : 0 , resources : null};
        }
        
        
        //출석하기 attendanceStatus = true 값으로 변경
    
        
    }
};

async function Attend(scheduleToken,userToken) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE AttendanceUsers SET attendanceStatus = true
            WHERE scheduleToken = ? and userToken = ?`, [scheduleToken,userToken], 
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

async function Absent(scheduleToken,userToken,absentReason) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE AttendanceUsers SET attendanceStatus = false , absentReason = ?
            WHERE scheduleToken = ? and userToken = ?`, [absentReason,scheduleToken,userToken], 
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