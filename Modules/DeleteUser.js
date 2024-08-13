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
                const result = await DeleteNotSoftwareUser(notUserToken);
                return result
            }
            
        }else{
            return {result : 0 , resources : null};
        }
}
}


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
//==================================================함수 선언 파트
async function DeleteNotSoftwareUser(notUserToken) {
    return new Promise((resolve, reject) => {
        // 유저 데이터 삭제
        connection.query('DELETE FROM NotUsersOrganizations WHERE notUserToken = ?', [notUserToken], 
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