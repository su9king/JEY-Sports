//필요한 모듈 선언
const connection = require('../DatabaseLoad');
const { CheckDuplicate } = require('./CheckDuplicate.js');


//메인 실행 코드
module.exports = {
    CreateGroup : async(userToken,data) => {
        const functionType = data["functionType"];
        const groupID = data["groupID"];

        //그룹 아이디 중복확인
        if( functionType == 0 ){
            const table = "Organizations"
            const data = {groupID : groupID};
            const result = await CheckDuplicate(table,data);
            return result;

        }else if(functionType == 1){

            //CheckDuplicate.js 의존 코드
            //ID가 중복되지 않았다면 0 출력
            const table = "Organizations"
            const groupID = data["groupID"];
            const data2 = {groupID : groupID};
            const groupIDCheck = await CheckDuplicate(table,data2);

            if (groupIDCheck == 0){
                const groupPublisher = userToken;
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

async function CreateGroupData(groupPublisher, groupID, groupName, groupNumber,
    groupClassification, groupSportType, groupPW, groupImage, groupLocation, userToken) {
    
    return new Promise((resolve, reject) => {

        // 첫 번째 쿼리: 조직 생성
        connection.query(`INSERT INTO Organizations (groupPublisher, groupID, groupName,
            groupNumber, groupClassification, groupSportType,
            groupPW, groupImage, groupLocation) 
                          VALUES(?,?,?,?,?,?,?,?,?)`, 
                        [groupPublisher, groupID, groupName,
                            groupNumber, groupClassification, groupSportType,
                            groupPW, groupImage, groupLocation],
            (error, results) => {
                if (error) {
                    console.error('조직 생성 오류:', error);
                    return reject(error);
                }

                // 조직이 성공적으로 생성되었으면 groupToken 가져오기
                if (results.affectedRows > 0) {
                    const groupToken = results.insertId; // 마지막으로 삽입된 ID

                    // 두 번째 쿼리: UsersOrganizations 테이블에 데이터 추가
                    connection.query(`INSERT INTO UsersOrganizations (userToken, groupToken, userPermission) 
                                      VALUES (?, ?, ?)`, 
                                      [groupPublisher, groupToken, 2], (error) => {
                        if (error) {
                            console.error('UsersOrganizations 데이터 추가 오류:', error);
                            return reject(error);
                        }

                        // 모든 작업이 성공적으로 완료되면 결과 반환
                        resolve({groupToken : groupToken});
                    });
                } else {
                    resolve(0);
                }
            }
        );
    });
}

