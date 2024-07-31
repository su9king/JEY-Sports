//필요한 모듈 선언
const connection = require('../DatabaseLoad');


// 메인 실행 코드
module.exports = {

    //page 와 userToken 기반으로 각 페이지에 맞는 리소스 제공
    Certification: async (userToken,page,query) => {

        if (page == "PrivatePage"){
            var data = await PrivatePage(userToken)
            return data;

        }else if (page == "CreateGroupPage"){
            console.log("필요한 리소스가 존재하지 않습니다.")
            return null;

        }else if (page == "GroupPage"){
            const groupToken = query["groupToken"];
            var data = await GroupPage(groupToken)
            return data;
        }

        
    }
};



async function PrivatePage(userToken){
    return new Promise((resolve, reject) => {
        connection.query(`SELECT org.groupName, usorg.groupToken 
                            FROM UsersOrganizations AS usorg
                            JOIN Organizations AS org ON org.groupToken = usorg.groupToken
                            WHERE usorg.userToken = ?;`, [userToken],
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);

                } //쿼리 결과가 없다면 소속된 조직이 존재하지 않다는 뜻
                if (results.length > 0) {
                    resolve(results);
                } else {
                    resolve(null);
                }
            }
        );
    })
}

async function GroupPage(groupToken){

    return new Promise((resolve, reject) => {
        connection.query(`SELECT groupName,groupImage FROM Organizations
            WHERE groupToken = ?`, [groupToken],
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);

                } //쿼리 결과가 없다면 소속된 그룹 토큰이 잘못 됨.
                if (results.length > 0) {
                    resolve(results);
                } else {
                    resolve(null);
                }
            }
        );
    })
}