//필요한 모듈 선언
const connection = require('../DatabaseLoad');

// 메인 실행 코드. 그냥 복사 붙여넣기 용
module.exports = {
    DeleteContent : async(Token,functionType) => {

        if (functionType == 1){
            var result = await DeleteAttendance(Token);
    
        
        }else if(functionType == 2){
            var result = await DeleteDues(Token);
        
        }
        return result;
        
        
    }
};

async function DeleteAttendance(scheduleToken) {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM AttendanceUsers WHERE scheduleToken = ?`, [scheduleToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                
                if (results.affectedRows > 0) {
                    resolve(1);  
                } else {
                    resolve(0);  
                }
            }
        );
    });
}

async function DeleteDues(noticeToken) {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM DuesUsers WHERE noticeToken = ?`, [noticeToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                
                if (results.affectedRows > 0) {
                    resolve(1);  
                } else {
                    resolve(0);  
                }
            }
        );
    });
}