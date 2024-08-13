//필요한 모듈 선언
const connection = require('../DatabaseLoad');

//메인 실행 코드
module.exports = {
    RefuseMember : async(userToken,data) => {

        const functionType = data["functionType"]

        if (functionType == 1){ //초대장 삭제하기
            const userPermission = data["userPermission"];
            const userID = data["userID"];
            const groupToken = data["groupToken"];
            

            if (userPermission == 1 || userPermission == 2){
                const result = await DeleteInvitation(userID,groupToken);
                return result;
            }

        }else if (functionType == 2){ // 참가 거부하기
            const userPermission = data["userPermission"];
            const userID = data["userID"];
            const groupToken = data["groupToken"];

            if (userPermission == 1 || userPermission == 2){
                const result = await RefuseJoin(userID,groupToken);
                return result;
            }

        }else if (functionType == 3){ // 초대장 거부하기 (소프트웨어 사용자 입장에서)
            
            const groupToken = data["groupToken"];

            const result = await RefuseInvite(userToken,groupToken);
            return result;
            

        }else if (functionType == 4){ // 참가 취소하기 (소프트웨어 사용자 입장에서)
            
            const groupToken = data["groupToken"];

            const result = await DeleteJoin(userToken,groupToken);
            return result;
            

        }else{
            return {result : 0 , resources : null};
        }

    }
};
//==================================================함수 선언 파트
//초대장 삭제
async function DeleteInvitation(userID,groupToken) {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM UsersOrganizations 
                          WHERE userToken = (SELECT userToken FROM Users WHERE userID = ?) and
                          groupToken = ? and userPermission = 3`, [userID,groupToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                
                if (results.affectedRows > 0) { 
                    resolve({result : 1,resources : null});  //초대장 삭제 완료
                } else {
                    resolve({result : 0 , resources : null});  //초대장 삭제 실패
                }
            }
        );
    });
}


//참가 거절
async function RefuseJoin(userID,groupToken) {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM UsersOrganizations 
                          WHERE userToken = (SELECT userToken FROM Users WHERE userID = ?) and
                          groupToken = ? and userPermission = 4`, [userID,groupToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                
                if (results.affectedRows > 0) {
                    resolve({result : 1,resources : null});  //참가 거절 완료
                } else {
                    resolve({result : 0 , resources : null});  //참가 거절 실패
                }
            }
        );
    });
}

//초대장 거절하기
async function RefuseInvite(userToken,groupToken) {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM UsersOrganizations 
                          WHERE userToken = ? and
                          groupToken = ? and userPermission = 3`, [userToken,groupToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                
                if (results.affectedRows > 0) {
                    resolve({result : 1,resources : null});  //참가 거절 완료
                } else {
                    resolve({result : 0 , resources : null});  //참가 거절 실패
                }
            }
        );
    });
}

//참가 취소하기
async function DeleteJoin(userToken,groupToken) {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM UsersOrganizations 
                          WHERE userToken = ? and
                          groupToken = ? and userPermission = 4`, [userToken,groupToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                
                if (results.affectedRows > 0) {
                    resolve({result : 1,resources : null});  //참가 거절 완료
                } else {
                    resolve({result : 0 , resources : null});  //참가 거절 실패
                }
            }
        );
    });
}