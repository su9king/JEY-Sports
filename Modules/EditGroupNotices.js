//필요한 모듈 선언
const connection = require('../DatabaseLoad');
const { CreateDuesList } = require('./CreateDuesList.js');
const { DeleteContent } = require('./DeleteContent.js');

// 메인 실행 코드
module.exports = {
    EditGroupNotices : async(data) => {
        const functionType = data["functionType"];
        const noticeToken = data["noticeToken"];

        if (functionType == 1){//공지사항 불러오기
            const result = await LoadNotice(noticeToken);
            return result;

        }else if (functionType == 2){// 공지사항 삭제
            const userPermission = data["userPermission"]
        
            if (userPermission == 1 || userPermission == 2){
                if (data["noticeType"] == 2){ // 회비 공지사항이라면
                    var result1 = await DeleteContent(noticeToken,2);
                    
                }else{
                    var result1 = 1;
                }
                if (result1 == 1){ //출석 데이터가 정상적으로 삭제됨. or 원래 없었음.
                    const result2 = await DeleteNotice(noticeToken);
                    return {result : result2 , resources : null};
                }
            }


        }else if (functionType == 3){//공지사항 수정, 공지사항 저장
            const userPermission = data["userPermission"];
            const noticeType = data["noticeType"];
            if (userPermission == 1 || userPermission == 2){
                
                if (noticeToken == null){ // noticeToken 이 존재하지 않다면, 공지사항을 새로 생성하는 동작임.

                    if (noticeType == 2){ 

                        const result1 = await CreateNotice(data);
                        const result2 = await CreateDuesList(result1,data["groupToken"]);


                        if (result2.result == 0){//회비 데이터를 생성하지 못했다면,
                            const result = await DeleteNotice(result1);
                            return {result : 0 , resources : null};
                        }else{
                            return result2;
                        }

                    }else{// 회계타입 1,3,4 공지사항 생성
                        const result = await CreateNotice(data);

                        if (result != 0){
                            return {result : 1 , resources : null};
                        }else{
                            return {result : 0 , resources : null};
                        }
                    }
                    
                }else{
                    const result = await EditNotice(data);
                    return {result : result , resources : null};
                }
            }
        }
    }
};

async function LoadNotice(noticeToken) {
    return new Promise((resolve, reject) => {
        // 공지사항 데이터 전부 불러오기
        connection.query(`SELECT noticeContent,noticeWriter,
                          noticeCreatedDate,noticeEditDate,noticeEndDate FROM Notices 
                          WHERE noticeToken = ?`, [noticeToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                // 출력된 행의 수 확인
                if (results.length > 0) {
                    resolve({result : 1, resources: results});  // 데이터가 정상적으로 출력됨.
                } else {
                    resolve({result : 0 ,resources : null});  //출력된 데이터가 없음
                }
            }
        );
    });
}

async function DeleteNotice(noticeToken) {
    return new Promise((resolve, reject) => {
        // 공지사항 삭제하기
        connection.query(`DELETE FROM Notices 
                          WHERE noticeToken = ?`, [noticeToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                // 삭제된 행의 수 확인
                if (results.affectedRows > 0) {
                    resolve(1);  // 데이터가 정상적으로 삭제됨
                } else {
                    resolve(0);  //삭제된 데이터가 없음
                }
            }
        );
    });
}

async function CreateNotice(data) {
    return new Promise((resolve, reject) => {
        // 공지사항 추가하기
        connection.query(`INSERT INTO Notices 
                          (groupToken,noticeTitle,noticeContent,noticeWriter,noticeCreatedDate,
                          noticeEditDate,noticeImportance,noticeStatus,noticeEndDate)
                          VALUES(?,?,?,?,?,?,?,?,?) `, 
                          [data["groupToken"],data["noticeTitle"],
                           data["noticeContent"],data["noticeWriter"],
                           data["noticeCreatedDate"],data["noticeEditDate"],
                           data["noticeImportance"],data["noticeStatus"],
                           data["noticeEndDate"]], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                // 추가된 행의 수 확인
                if (results.affectedRows > 0) {
                    resolve(results.insertId);  // 데이터가 정상적으로 추가됨
                } else {
                    resolve(0);  //추가된 데이터가 없음
                }
            }
        );
    });
}
//==================================================함수 선언 파트
async function EditNotice(data) {
    return new Promise((resolve, reject) => {
        // 일정 수정하기
        connection.query(`UPDATE Notices
                          SET noticeTitle = ?,noticeContent = ? ,noticeWriter = ? ,
                          noticeEditDate = ? ,noticeImportance = ?,noticeStatus = ? ,noticeEndDate = ?
                          WHERE noticeToken = ? `, 
                          [data["noticeTitle"],
                           data["noticeContent"],data["noticeWriter"],
                           data["noticeEditDate"],
                           data["noticeImportance"],data["noticeStatus"],
                           data["noticeEndDate"],data["noticeToken"]], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                // 수정된 행의 수 확인
                if (results.affectedRows > 0) {
                    resolve(1);  // 데이터가 정상적으로 수정됨
                } else {
                    resolve(0);  //수정된 데이터가 없음
                }
            }
        );
    });
}