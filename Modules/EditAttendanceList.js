
//필요한 모듈 선언
const connection = require('../DatabaseLoad');

// 메인 실행 코드. 그냥 복사 붙여넣기 용
module.exports = {
    EditAttendanceList : async(data) => {
        try {
            const datas = data["datas"]
            const userPermission = data["userPermission"];
            const scheduleToken = data["scheduleToken"];
            console.log(datas);
            if (userPermission == 1 || userPermission == 2){
                
                for (const item of datas){
                    
                    if (item.functionType == 1){ // 소프트웨어 유저의 출석정보 수정
                        const { userID , attendanceStatus } = item;
                        const result = await ChangeUserAttendanceStatus(userID,attendanceStatus,scheduleToken);
    
                        if (result == 0){
                            return {result : 0 , resources : null}
                        }
    
                    } else if (item.functionType == 2){ // 소프트웨어 비유저의 출석정보 수정
                        const { notUserToken , attendanceStatus } = item;
                        const result = await ChangeNotUserAttendanceStatus(notUserToken,attendanceStatus,scheduleToken);
    
                        if (result == 0){
                            return {result : 0 , resources : null}
                        }
                    } else if (item.functionType == 3){ // 출석코드 변경
                        console.log("작동함.")
                        const { scheduleAttendanceCode } = item;
                        const result = await ChangeAttendanceCode(scheduleAttendanceCode,scheduleToken);
    
                        if (result == 0){
                            return {result : 0 , resources : null}
                        }
                    } 
    
                }
                return {result : 1 ,resources : null};
            }else{
                return {result : 0 ,resources : null};
            }
            
        }catch(error){
            return {result : 0 ,resources : null};
        }

         

        
        // SQL 구문 그냥 복사 붙여넣기 용
        
    }
};

async function ChangeUserAttendanceStatus(userID,attendanceStatus,scheduleToken) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE AttendanceUsers SET attendanceStatus = ?, absentReason = "관리자에 의해 변경됨"
            WHERE userToken = (SELECT userToken FROM Users WHERE userID = ?) 
            and scheduleToken = ?`, [attendanceStatus,userID,scheduleToken], 
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

async function ChangeNotUserAttendanceStatus(notUserToken,attendanceStatus,scheduleToken) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE AttendanceUsers SET attendanceStatus = ? , absentReason = "관리자에 의해 변경됨"
            WHERE notUserToken = ?
            and scheduleToken = ?`, [attendanceStatus,notUserToken,scheduleToken], 
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

async function ChangeAttendanceCode(scheduleAttendanceCode,scheduleToken) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE Schedules SET scheduleAttendanceCode = ?
            WHERE scheduleToken = ?`, [scheduleAttendanceCode,scheduleToken], 
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