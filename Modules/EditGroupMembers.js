const connection = require('../DatabaseLoad');

// 메인 실행 코드 
module.exports = {
    EditGroupMembers : async(userToken,groupToken,userPermission,data) => {
        const functionType = data["functionType"];

        if (functionType == 1){// 멤버 강퇴
            const userID = data["userID"]; //강퇴할 유저 ID
            console.log("작동됨");
            console.log(userID,groupToken);
            if (userPermission == 1 || userPermission == 2){
                const kickUserPermission = await GetPermission(userID,groupToken);
                console.log(kickUserPermission);
                if (kickUserPermission == 0){ // 강퇴 가능함.
                    
                    const result = await KickUser(userID,groupToken);
                    return {result : result , resources : null}
                }else{ // 강퇴 불가능
                    return {result : 0 , resources : null};
                }
                    
            }
        
        }else if (functionType == 2){// 멤버 입장 수락
            const userID = data["userID"]; //입장 수락할 유저 ID

            if (userPermission == 1 || userPermission == 2){
                const acceptUserPermission = await GetPermission(userID,groupToken);

                if (acceptUserPermission == 4){// 수락 가능함.
                    
                    const result = await AcceptUser(userID,groupToken);
                    return {result : result , resources : null};
                }else{
                    return {result : 0, resources : null};
                }
            }

        }else if (functionType == 3){// 멤버 초대 (소프트웨어 유저 초대)
            const userID = data["userID"];

            if (userPermission == 1 || userPermission == 2){
                
                const result = await InviteUser(userID,groupToken);
                return {result : result , resources : null};

            }else{
                return {result : 0 , resources : null};
            }

        }else if (functionType == 4){// 멤버 (소프트웨어 비유저 등록)
        
            const userName = data["userName"];
            const userPhone = data["userPhone"];

            if (userPermission == 1 || userPermission == 2){
                
                const result = await SetNotUser(userName,userPhone,groupToken);

                return {result : result , resources : null};
                
            }else{

                return {result : 0 , resources : null};
            }
            
        }else if (functionType == 5){// 멤버 권한 조정 (일반 유저)

            const userID = data["userID"];
            if (userPermission == 2){
                
                const result = await ModifyPermission(userID,groupToken,0);

                return {result : result , resources : null};
            }else{
                return {result : 0 , resources : null};
            }
            
            
        }else if (functionType == 6){// 멤버 권한 조정 ( 관리자 )

            const userID = data["userID"];
            if (userPermission == 2){
                
                const result = await ModifyPermission(userID,groupToken,1);

                return {result : result , resources : null};
            }else{
                return {result : 0 , resources : null};
            }

        }else if (functionType == 7){// 멤버 권한 조정 ( 창시자 , 자기 자신은 관리자로 강등 )
            
            const userID = data["userID"];

            if (userPermission == 2){

                const result = await ChangeGroupPublisher(userToken,userID,groupToken);

                return {result : result , resources : null};

            }else{
                return {result : 0, resources : null};
            }
        }else{ //functionType 이 잘못 됨 
            return {result : 99 , resources : null};
        } 
    }
};
////////////////////////////// 함수 선언 파트 
async function KickUser(userID,groupToken) {
    return new Promise((resolve, reject) => {
        // 유저 데이터 삭제
        connection.query(`DELETE FROM UsersOrganizations 
                          WHERE userToken = (SELECT userToken FROM Users WHERE userID = ?)
                          and groupToken = ?`, [userID,groupToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                // 수정된 행의 수 확인
                if (results.affectedRows > 0) {
                    
                    resolve(1);  // 데이터가 정상적으로 삭제됨.
                } else {
                    resolve(99);  //삭제할 데이터가 없음
                }
            }
        );
    });
}
async function AcceptUser(userID,groupToken) {
    return new Promise((resolve, reject) => {
        // 유저 조직 참가 수락
        connection.query(`UPDATE UsersOrganizations 
                          SET userPermission = 0
                          WHERE userToken = (SELECT userToken FROM Users WHERE userID = ?)
                          and groupToken = ?`, [userID,groupToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                // 변경된 행의 수 확인
                if (results.affectedRows > 0) {
                    resolve(1);  // 데이터가 정상적으로 변경됨.
                } else {
                    resolve(99);  //변경된 데이터가 없음
                }
            }
        );
    });
}

async function InviteUser(userID,groupToken) {
    return new Promise((resolve, reject) => {
        // 유저 ID 기반으로 초대 발송
        connection.query(`INSERT INTO UsersOrganizations 
                          (userToken,groupToken,userPermission)
                          VALUES ((SELECT userToken FROM Users WHERE userID = ?),?,3)`, [userID,groupToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                // 추가된 행의 수 확인
                if (results.affectedRows > 0) {
                    resolve(1);  // 데이터가 정상적으로 추가됨.
                } else {
                    resolve(99);  //추가된 데이터가 없음
                }
            }
        );
    });
}

async function SetNotUser(userName,userPhone,groupToken) {
    return new Promise((resolve, reject) => {
        // 소프트웨어 비유저 조직에 등록
        connection.query(`INSERT INTO NotUsersOrganizations 
                          (userName,userPhone,groupToken)
                          VALUES (?,?,?)`, [userName,userPhone,groupToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                // 추가된 행의 수 확인
                if (results.affectedRows > 0) {
                    resolve(1);  // 데이터가 정상적으로 추가됨.
                } else {
                    resolve(99);  //추가된 데이터가 없음
                }
            }
        );
    });
}

async function ModifyPermission(userID,groupToken,value) {
    return new Promise((resolve, reject) => {
        // 유저 권한 수정 
        connection.query(`UPDATE UsersOrganizations 
                          SET userPermission = ?
                          WHERE userToken = (SELECT userToken FROM Users WHERE userID = ?)
                          and groupToken = ?`, [value,userID,groupToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                // 수정된 행의 수 확인
                if (results.affectedRows > 0) {
                    resolve(1);  // 데이터가 정상적으로 수정됨
                } else {
                    resolve(99);  //수정된 데이터가 없음
                }
            }
        );
    });
}

async function ChangeGroupPublisher(userToken,userID,groupToken) {
    const result = await ModifyPermission(userID,groupToken,2);
    if ( result != 1 ){//입력받은 유저를 창시자로 변경이 정상적으로 이루어지지 않았다면
        resolve(99); 
    }
    return new Promise((resolve, reject) => {
        // 조직 창시자 변경
        connection.query(`UPDATE Organizations 
                          SET userToken = (SELECT userToken FROM Users WHERE userID = ?)
                          WHERE groupToken = ?`, [userID,groupToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }
                // 변경된 행의 수 확인
                if (results.affectedRows > 0) {
                    //원래 창시자였던 유저를 관리자로 변경
                    connection.query(`UPDATE UsersOrganizations 
                        SET userPermission = 1
                        WHERE userToken = ? and groupToken = ?`, [userToken,groupToken], 
                        (error, results, fields) => {
                            if (error) {
                                console.error('쿼리 실행 오류:', error);
                                return reject(error);
                            }

                            // 변경된 행의 수 확인
                            if (results.affectedRows > 0) {
                                resolve(1);  // 데이터가 전부 정상적으로 변경됨.
                            } else {
                                resolve(99);  //변경된 데이터가 없음
                            }
                        }
                    );
                } else {
                    resolve(99);  //변경된 데이터가 없음
                }
            }
        );
    });
}

async function GetPermission(userID,groupToken) {
    return new Promise((resolve, reject) => {
        // 유저 데이터 삭제
        connection.query(`SELECT usrorg.userPermission FROM UsersOrganizations AS usrorg 
            JOIN Users AS usr ON usr.userToken = usrorg.userToken
            WHERE usr.userID = ? and usrorg.groupToken = ?;`, [userID,groupToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                // 출력된 행의 수 확인
                if (results.length > 0) {
                    const userPermission = results[0].userPermission;
                    resolve(userPermission);  // 데이터가 잘 출력됨 
                } else {
                    resolve(99);  // 데이터가 출력되지 않음 (해당 userID가 없음)
                }
            }
        );
    });
}