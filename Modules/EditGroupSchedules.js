const connection = require('../DatabaseLoad');

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
            if (userPermission == 2 || userPermission == 3){

                const result = await DeleteSchedule(scheduleToken);
                return {result : result , resources : null};
            }

        }else if (functionType == 3){//일정 수정, 일정 저장
            const userPermission = data["userPermission"];
            if (userPermission == 2 || userPermission == 3){
                
                if (scheduleToken == null){
                    const result = await CreateSchedule(data);
                    return {result : result , resources : null};
                }else{
                    const result = await EditSchedule(data);
                    return {result : result , resources : null};
                }
            }
        }
    }
};

async function LoadSchedule(scheduleToken) {
    return new Promise((resolve, reject) => {
        // 일정 데이터 전부 불러오기
        connection.query(`SELECT scheduleStartDate,scheduleAlert,
                          scheduleContent,scheduleEndDate,scheduleLocation FROM Schedules 
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
                          (scheduleGroupToken,scheduleTitle,scheduleContent,scheduleStartDate,scheduleEndDate,
                          scheduleLocation,scheduleStatus,scheduleImportance,scheduleAlert)
                          VALUES(?,?,?,?,?,?,?,?,?) `, 
                          [data["scheduleGroupToken"],data["scheduleTitle"],
                           data["scheduleContent"],data["scheduleStartDate"],
                           data["scheduleEndDate"],data["scheduleLocation"],
                           data["scheduleStatus"],data["scheduleImportance"],
                           data["scheduleAlert"]], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                // 추가된 행의 수 확인
                if (results.affectedRows > 0) {
                    resolve(1);  // 데이터가 정상적으로 추가됨
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
                          scheduleLocation = ? ,scheduleStatus = ?,scheduleImportance = ? ,scheduleAlert = ?)
                          WHERE scheduleToken = ? `, 
                          [data["scheduleTitle"],
                           data["scheduleContent"],data["scheduleStartDate"],
                           data["scheduleEndDate"],data["scheduleLocation"],
                           data["scheduleStatus"],data["scheduleImportance"],
                           data["scheduleAlert"],data["scheduleGroupToken"]], 
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