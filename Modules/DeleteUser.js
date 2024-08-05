// 메인 실행 코드. 그냥 복사 붙여넣기 용
module.exports = {
    DeleteUser : async(userToken) => {
        return new Promise((resolve, reject) => {
            // 유저 데이터 삭제
            connection.query('DELETE FROM Users WHERE userToken = ?', [userToken], 
                (error, results, fields) => {
                    if (error) {
                        console.error('쿼리 실행 오류:', error);
                        return reject(error);
                    }
    
                    // 삭제된 행의 수 확인
                    if (results.affectedRows > 0) {
                        resolve(1);  // 데이터가 잘 삭제됨
                    } else {
                        resolve(0);  // 데이터가 삭제되지 않음 (해당 userToken이 없음)
                    }
                }
            );
        });
};
}
