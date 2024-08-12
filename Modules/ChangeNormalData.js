//필요한 모듈 선언

const { CheckDuplicate } = require('./CheckDuplicate.js');
const connection = require('../DatabaseLoad');

// 메인 실행 코드
module.exports = {
    ChangeNormalData : async(userToken,data) => {
        const functionType = data["functionType"];
        
        const setKey = data["setKey"];
        const setValue = data["setValue"];

        if (functionType == 1){ //일반 유저 데이터 수정
            const result = await editData(userToken,"Users",setKey,setValue);
            return {result : result};

        } else if (functionType == 2){ //조직 데이터 수정
            const userPermission = data["userPermission"];

            if (userPermission == 2){

                const result = await editData(groupToken,"Organizations",setKey,setValue);
                return {result : result , resources : null};

            } else{ //조직 데이터 수정 권한 없음.
                return {result : 0 , resources : null};
            }
            

        } else if (functionType == 3){ //유저 ID 중복 요청
            const userID = data["userID"];

            table = "Users"
            data = {userID : userID};
            const result = await CheckDuplicate(table,data);
            return {result : result , resources : null};

        } else if (functionType == 4){ //조직 ID 중복 요청
            const groupID = data["groupID"];

            table = "Organizations"
            data = {groupID : groupID};
            const result = await CheckDuplicate(table,data);
            return {result : result , resources : null};
        }

    }
};


//일반 데이터 수정
async function editData(userToken,table,key,value) {
    return new Promise((resolve, reject) => {

        connection.query('UPDATE ?? SET ?? = ? WHERE ?? = ?', [table,key,value,"userToken",userToken],
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);

                } //쿼리 결과가 없다면 ID가 존재하지 않다는 뜻
                if (results.affectedRows > 0) {
                    resolve(1);
                } else {
                    resolve(0);
                }
            }
        );
    });
}

