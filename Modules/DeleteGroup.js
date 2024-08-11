const connection = require('../DatabaseLoad');

// 메인 실행 코드.

module.exports = {
    DeleteGroup : async(userToken,groupToken) => {
        return new Promise((resolve, reject) => {
            // 유저 데이터 삭제
            connection.query('SELECT userToken FROM UsersOrganizations WHERE groupToken = ?',[groupToken], 
                (error, results, fields) => {
                    if (error) {
                        console.error('쿼리 실행 오류:', error);
                        return reject(error);
                    }                   
                    if (results.length < 2 && results[0]["userToken"] == userToken ) {
                        // 그룹에 유저 자기자신 밖에 없음.
                        connection.query(`DELETE FROM UsersOrganizations WHERE groupToken = ?;
                                         DELETE FROM Organizations WHERE groupToken = ?;`,[groupToken,groupToken], 
                            (error, results) => {
                                if (error) {
                                    console.error('쿼리 실행 오류:', error);
                                    return reject(error);
                                }
                                // 첫 번째 쿼리의 결과를 체크
                                const usersOrganizationsAffectedRows = results[0].affectedRows;
                                // 두 번째 쿼리의 결과를 체크
                                const organizationsAffectedRows = results[1].affectedRows;
                                if (usersOrganizationsAffectedRows > 0 || organizationsAffectedRows > 0) {
                                    resolve({result : 1,resources : null});//삭제가 성공적으로 이루어짐
                                } else {
                                    resolve({result : 0,resources : null}); //삭제 실패
                                }
                                
                            }
                        );
                        
                    } else {
                        resolve({result : 0, resources : null});  // 그룹에 자신이 없고 다른 유저가 존재함.
                    }
                    
                }
            );
        });
}
}
