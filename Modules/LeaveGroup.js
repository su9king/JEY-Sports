//필요한 모듈 선언
const connection = require('../DatabaseLoad');

// 메인 실행 코드
module.exports = {
    LeaveGroup : async(userToken,data) => { //조직 나가기

        const groupToken = data["groupToken"];
        const userPermission = data["userPermission"];

        if (userPermission == 2){ //조직 창시자는 조직 탈퇴 못함.
            return {result : 0 , resources : null};
        }

        return new Promise((resolve, reject) => {
            connection.query(`DELETE FROM UsersOrganizations
                WHERE userToken = ? and groupToken = ? `, [userToken,groupToken], 
                (error, results, fields) => {
                    if (error) {
                        console.error('쿼리 실행 오류:', error);
                        return reject(error);
                    }
    
                    
                    if (results.affectedRows > 0) {
                        resolve({result : 1,resources : null}); //조직 탈퇴 성공 
                    } else {
                        resolve({result : 0 , resources : null}); //조직 탈퇴 실패
                    }
                }
            );
        });
    }

}
