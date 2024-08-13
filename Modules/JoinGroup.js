//필요한 모듈 선언

const connection = require('../DatabaseLoad');

// 메인 실행 코드
module.exports = {
    JoinGroup : async(userToken,data) => {

        const functionType = data["functionType"]

        if (functionType == 1){ //조직 ID 검색 
            const groupID = data["groupID"];

            const result = await SearchGroupID(groupID);
            return result;

        }else if (functionType == 2){ // 조직 PW 확인
            const groupID = data["groupID"];
            const groupPW = data["groupPW"];

            const groupToken = await CheckGroupPW(groupID,groupPW);
            console.log(groupID,groupPW,groupToken);
            if (groupToken != 0){// 조직 참가 성공

                const result = await requestJoin(groupToken,userToken);
                return result;

            }else{ //조직 참가 실패
                return {result : 0 , resources : null};
            }

        }else if (functionType == 3){ // 유저가 조직의 초대권 수락

            const groupToken = data["groupToken"];
            const result = await AcceptInvitation(groupToken,userToken);
            return result;
        }else{
            return {result : 0 , resources : null};
        }

    }
};

//==================================================함수 선언 파트


async function SearchGroupID(groupID) {
    return new Promise((resolve, reject) => {
        // 조직 있는지 확인
        connection.query('SELECT groupID FROM Organizations WHERE groupID = ?', [groupID], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                // 출력된 행의 수 확인
                if (results.length > 0) {
                    resolve({result : 1,resources : null});  // 데이터가 존재함
                } else {
                    resolve({result : 0 , resources : null});  // 데이터가 존재하지 않음
                }
            }
        );
    });
}

async function CheckGroupPW(groupID,groupPW) {
    return new Promise((resolve, reject) => {
        // 조직 있는지 확인
        connection.query('SELECT groupToken FROM Organizations WHERE groupID = ? and groupPW = ?', [groupID,groupPW], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                // 출력된 행의 수 확인
                if (results.length > 0) {
                    resolve(results[0].groupToken);  // 데이터가 존재함. ID,PW 가 맞으므로 그룹토큰 출력
                } else {
                    resolve(0);  // ID,PW 입력 실패
                }
            }
        );
    });
}

async function requestJoin(groupToken,userToken) {
    return new Promise((resolve, reject) => {
        // 참가 신청
        connection.query(`INSERT INTO UsersOrganizations 
            (userToken,groupToken,userPermission)
            VALUES (?,?,4)`, [userToken,groupToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                // 출력된 행의 수 확인
                if (results.affectedRows > 0) {
                    resolve({result : 1 , resources : null});  // 참가 신청이 완료됨
                } else {
                    resolve({result : 0 , resources : null});  // 참가 신청 실패
                }
            }
        );
    });
}

async function AcceptInvitation(groupToken,userToken) {
    return new Promise((resolve, reject) => {
        // 초대장 수락
        connection.query(`UPDATE UsersOrganizations 
            SET userPermission = 0
            WHERE userToken = ? and groupToken = ?`, [userToken,groupToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                // 수정된 행의 수 확인
                if (results.affectedRows > 0) {
                    resolve({result : 1 , resources : null});  // 참가완료
                } else {
                    resolve({result : 0 , resources : null});  // 참가실패
                }
            }
        );
    });
}