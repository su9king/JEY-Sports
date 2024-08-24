//필요한 모듈 선언
const connection = require('../DatabaseLoad');
const { CreateAttendanceList } = require('./CreateAttendanceList.js');
const { DeleteContent } = require('./DeleteContent.js');

// 메인 실행 코드
module.exports = {
    EditGroupSchedules : async(data) => {
        const functionType = data["functionType"];
        const scheduleToken = data["scheduleToken"];

        if (functionType == 1){//일정 불러오기
            const result = await LoadSchedule(scheduleToken);
            return result;

        }else if (functionType == 2){// 일정 삭제

            const userPermission = data["userPermission"];
            if (userPermission == 1 || userPermission == 2){

                if (data["scheduleAttendance"] == true){ // 출석 기능이 포함된 일정이라면,
                    var result1 = await DeleteContent(scheduleToken,1);
                
                }else{
                    var result1 = 1;
                }
                console.log(data["scheduleAttendance"]);
                if (result1 == 1){ //출석 데이터가 정상적으로 삭제됨. or 원래 없었음.
                    const result2 = await DeleteSchedule(scheduleToken);
                    return {result : result2 , resources : null};
                }
                
            }

        }else if (functionType == 3){//일정 수정, 일정 저장
            const userPermission = data["userPermission"];
            const scheduleAttendance = data["scheduleAttendance"];
            if (userPermission == 1 || userPermission == 2){
                
                if (scheduleToken == null){ // scheduleToken 이 존재하지 않다면, 일정을 새로 생성하는 동작임.

                    if (scheduleAttendance == true){ //출석기능을 사용하는 일정
                        
                        const result1 = await CreateSchedule(data); //생성된 scheduleToken 출력됨
                        const result2 = await CreateAttendanceList(result1,data["groupToken"]);

                        if (result2.result == 0){ //출석 데이터를 생성하지 못했다면,
                            const result = await DeleteSchedule(result1);
                            return {result : 0 , resources : null};
                        }else{
                            return result2;
                        }


                    } else {// 출석기능을 사용하지 않는 일정

                        const result = await CreateSchedule(data);

                        if (result != 0){
                            return {result : 1 , resources : null};
                        }else{
                            return {result : 0 , resources : null};
                        }
                        
                    }

                }else{
                    const result = await EditSchedule(data);
                    console.log(result)
                    return {result : result , resources : null};
                }
            }
        }
    }
};
//==================================================함수 선언 파트
async function LoadSchedule(scheduleToken) {
    return new Promise((resolve, reject) => {
        // 일정 데이터 전부 불러오기
        connection.query(`SELECT scheduleStartDate,scheduleAlert,
                          scheduleContent,scheduleEndDate,scheduleLocation,scheduleAttendance FROM Schedules 
                          WHERE scheduleToken = ?`, [scheduleToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                // 출력된 행의 수 확인
                if (results.length > 0) {
                    resolve({result : 1, resources: results});  // 데이터가 정상적으로 출력됨.
                } else {
                    resolve({result : 0 ,resources : null});  //출력된 데이터가 없음
                }
            }
        );
    });
}


async function DeleteSchedule(scheduleToken) {
    return new Promise((resolve, reject) => {
        // 일정 삭제하기
        connection.query(`DELETE FROM Schedules 
                          WHERE scheduleToken = ?`, [scheduleToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                // 삭제된 행의 수 확인
                if (results.affectedRows > 0) {
                    resolve(1);  // 데이터가 정상적으로 삭제됨
                } else {
                    resolve(0);  //삭제된 데이터가 없음
                }
            }
        );
    });
}

async function CreateSchedule(data) {
    return new Promise((resolve, reject) => {
        // 일정 추가하기
        connection.query(`INSERT INTO Schedules 
                          (groupToken,scheduleTitle,scheduleContent,scheduleStartDate,scheduleEndDate,
                          scheduleLocation,scheduleImportance,scheduleAlert,scheduleAttendance,scheduleAttendanceCode)
                          VALUES(?,?,?,?,?,?,?,?,?,?,?) `, 
                          [data["groupToken"],data["scheduleTitle"],
                           data["scheduleContent"],data["scheduleStartDate"],
                           data["scheduleEndDate"],data["scheduleLocation"],
                           data["scheduleImportance"],
                           data["scheduleAlert"],data["scheduleAttendance"],
                           data["scheduleAttendanceCode"]], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                // 추가된 행의 수 확인
                if (results.affectedRows > 0) {
                    resolve(results.insertId);  // 데이터가 정상적으로 추가됨
                } else {
                    resolve(0);  //추가된 데이터가 없음
                }
            }
        );
    });
}

async function EditSchedule(data) {
    return new Promise((resolve, reject) => {
        // 일정 수정하기
        connection.query(`UPDATE Schedules 
                          SET scheduleTitle = ?,scheduleContent = ? ,scheduleStartDate = ? ,scheduleEndDate = ?,
                          scheduleLocation = ? ,scheduleImportance = ? ,scheduleAlert = ?
                          WHERE scheduleToken = ? `, 
                          [data["scheduleTitle"],
                           data["scheduleContent"],data["scheduleStartDate"],
                           data["scheduleEndDate"],data["scheduleLocation"],
                           data["scheduleImportance"],
                           data["scheduleAlert"],data["scheduleToken"]], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                // 수정된 행의 수 확인
                if (results.affectedRows > 0) {
                    resolve(1);  // 데이터가 정상적으로 수정됨
                } else {
                    resolve(0);  //수정된 데이터가 없음
                }
            }
        );
    });
}