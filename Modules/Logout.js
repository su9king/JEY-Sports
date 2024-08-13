//필요한 모듈 선언
const connection = require('../DatabaseLoad');

// 메인 실행 코드. 그냥 복사 붙여넣기 용
module.exports = {
    test1 : async(data) => {
        console.log("기능이 존재하지 않습니다.")

        //복사 붙여넣기 용 
        return new Promise((resolve, reject) => {
            connection.query('?', [userToken], 
                (error, results, fields) => {
                    if (error) {
                        console.error('쿼리 실행 오류:', error);
                        return reject(error);
                    }
    
                    
                    if (results.affectedRows > 0) {
                        resolve({result : 1,resources : null});  
                    } else {
                        resolve({result : 0 , resources : null});  
                    }
                }
            );
        });
    }
};

