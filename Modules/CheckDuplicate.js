
//필요한 모듈 선언
const connection = require('../DatabaseLoad');

module.exports = {
    
    CheckDuplicate: async (table,data) => {
        return new Promise((resolve, reject) => {
            const [[key,value]] = Object.entries(data);
            console.log(data,key,value);
    
            //입력받은 데이터가 존재하면 1 출력
            connection.query('SELECT 1 FROM ?? WHERE ?? = ?', [table,key,value],
                (error, results, fields) => {
                    if (error) {
                        console.error('쿼리 실행 오류:', error);
                        return reject(error);
    
                    } //쿼리 결과가 없다면 ID가 존재하지 않다는 뜻
                    if (results.length > 0) {
                        resolve(1);
                    } else {
                        resolve(0);
                    }
                }
            );
        });
        
    }
    
};