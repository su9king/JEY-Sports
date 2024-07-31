//필요한 모듈 선언
const connection = require('../DatabaseLoad');
const { CheckDuplicate } = require('./CheckDuplicate.js');


//메인 실행 코드
module.exports = {
    CreateGroup : async(data) => {
        const functionType = data["functionType"];
        const groupID = data["groupID"];


        //그룹 아이디 중복확인
        if( functionType == 0 ){
            table = "Organizations"
            const data = {groupID : groupID};
            const result = await CheckDuplicate(table,data);
            return result;

        }else if(functionType == 1){

            //CheckDuplicate.js 의존 코드
            //ID가 중복되지 않았다면 0 출력
            const groupID = data["groupID"];
            const data2 = {groupID : groupID};
            const groupIDCheck = await CheckDuplicate(data2);

            if (groupIDCheck == 0){
                const groupPublisher = data["userToken"];
                const groupName = data["groupName"];
                const groupNumber = data["groupNumber"];
                const groupClassification = data["groupClassification"];
                const groupSportType = data["groupSportType"];
                const groupPW = data["groupPW"];
                const groupImage = data["groupImage"];
                const groupLocation = data["groupLoacation"];

                const result = await CreateGroupData(groupPublisher,groupID,groupName,groupNumber,
                    groupClassification,groupSportType,groupPW,groupImage,groupLocation
                )
                return result;
            }else{
                return 0;
            }
        }
        
    }
};

async function CreateGroupData(groupPublisher,groupID,groupName,groupNumber,
groupClassification,groupSportType,groupPW,groupImage,groupLocation){
    return new Promise((resolve, reject) => {

        //입력받은 userID 존재하면 1 출력
        connection.query(`INSERT INTO Organizations (groupPublisher,groupID,groupName,
            groupNumber,groupClassification,groupSportType,
            groupPW,groupImage,groupLocation) 
                          VALUES(?,?,?,?,?,?,?,?,?)`, 
                        [groupPublisher,groupID,groupName,
                            groupNumber,groupClassification,groupSportType,
                            groupPW,groupImage,groupLocation],
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);

                } //쿼리 결과가 없다면 데이터 삽입이 제대로 작동하지 않은 것
                if (results.affectedRows > 0) {
                    const groupToken = results.insertId; // 마지막으로 삽입된 ID
                    resolve( {groupToken} );
                } else {
                    resolve(0);
                }
            }
        );
    });
    
        
}
