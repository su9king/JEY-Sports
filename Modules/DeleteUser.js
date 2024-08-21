//필요한 모듈 선언
const connection = require('../DatabaseLoad');

// 메인 실행 코드.


module.exports = {
    DeleteUser : async(userToken,data) => {
        const functionType = data["functionType"];
        
        if( functionType == 1 ){
            
            data = {userPhone : userPhone};
            table = "Users"
            const result = await DeleteSoftwareUser(userToken);
            return result
            
        }else if( functionType == 2){
            const userPermission = data["userPermission"];
            const notUserToken = data["notUserToken"]

            if (userPermission == 1 || userPermission == 2){
                const result1 = await DeleteNotSoftwareUserDatas(notUserToken);

                if (result1 == 1){
                    const result = await DeleteNotSoftwareUser(notUserToken);
                    return result
                }else{
                    return {result : 0,resources : null}
                }
            }
            
        }else{
            return {result : 0 , resources : null};
        }
}
}
//==================================================함수 선언 파트

async function DeleteSoftwareUser(userToken) {
    return new Promise((resolve, reject) => {
        // 유저 데이터 삭제
        connection.query('DELETE FROM Users WHERE userToken = ?', [userToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                // 삭제된 행의 수 확인
                if (results.affectedRows > 0) {
                    resolve({result : 1,resources : null});  // 데이터가 잘 삭제됨
                } else {
                    resolve({result : 0 , resources : null});  // 데이터가 삭제되지 않음 (해당 userToken이 없음)
                }
            }
        );
    });
}

async function DeleteNotSoftwareUser(notUserToken) {
    return new Promise((resolve, reject) => {
        // 유저 데이터 삭제
        connection.query('DELETE FROM NotUsersOrganizations WHERE notUserToken = ?', [notUserToken], 
            (error, results) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    console.log("소프트웨어 비유저 데이터 변경 추가 시도");

                    // 왜래키 제약조건에 의해 삭제가 되지 않을 경우 조직 토큰 값을 null로 변경
                    connection.query(`UPDATE NotUsersOrganizations 
                        SET groupToken = null
                        WHERE notUserToken = ?`, [notUserToken], (updateError, updateResults) => {
                            if (updateError) {
                                console.error('업데이트 쿼리 실행 오류:', updateError);
                                return reject(updateError);
                            }

                            // 업데이트된 행의 수 확인
                            if (updateResults && updateResults.affectedRows > 0) {
                                resolve({ result: 1, resources: null });  // 데이터가 잘 변경됨
                            } else {
                                resolve({ result: 0, resources: null });  // 데이터가 변경되지 않음
                            }
                        }
                    );
                    return; // 중복 실행 방지
                }

                // 삭제된 행의 수 확인
                if (results && results.affectedRows > 0) {
                    resolve({ result: 1, resources: null });  // 데이터가 잘 삭제됨
                } else {
                    resolve({ result: 0, resources: null });  // 데이터가 삭제되지 않음
                }
            }
        );
    });
}


async function DeleteNotSoftwareUserDatas(notUserToken) {
    return new Promise((resolve, reject) => {
        // 유저 데이터 삭제
        connection.query(`DELETE FROM AttendanceUsers WHERE notUserToken = ?`, [notUserToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                // 삭제된 행의 수 확인
                if (results.affectedRows > 0) {
                    resolve(1);  // 데이터가 잘 삭제됨
                } else {
                    resolve(1);  // 데이터가 삭제되지 않음 (해당 유저와 연결된 일정이 없음.)
                }
            }
        );
    });
}