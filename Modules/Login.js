const connection = require('../DatabaseLoad');

//메인 실행 코드
module.exports = {

    Login: async (userID,userPW) => {

        return new Promise((resolve, reject) => {

            //userID,userPW 기반으로 userToken 탐색
            connection.query('SELECT userToken FROM users WHERE userID = ? AND userPW = ?', [userID, userPW],

                (error, results, fields) => {

                    //쿼리 실행 오류
                    if (error) {
                        console.error('쿼리 실행 오류:', error);
                        return reject(error);
                    }
                    //결과물이 존재한다면, 어차피 ID가 공통되는 것이 없기때문에 1개만 출력 될 것임.
                    if (results.length > 0) {
                        console.log("Success",results);
                        resolve([results[0]['userToken']]);
                    } else {
                        console.log("Fail");
                        resolve([0]);
                    }
                }
            );
        });
    }
};

