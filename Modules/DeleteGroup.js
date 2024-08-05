// 메인 실행 코드. 그냥 복사 붙여넣기 용
module.exports = {
    DeleteGroup : async(userToken,groupToken) => {
        return new Promise((resolve, reject) => {
            // 유저 데이터 삭제
            connection.query('SELECT * FROM UsersOrganizations WHERE groupToken = ? ',[groupToken], 
                (error, results, fields) => {
                    if (error) {
                        console.error('쿼리 실행 오류:', error);
                        return reject(error);
                    }
    
                    // 그룹의 유저수 출력 
                    if (results.length > 1) {
                        resolve(1);  // 데이터가 잘 삭제됨
                    } else {
                        resolve(0);  // 데이터가 삭제되지 않음 (해당 userToken이 없음)
                    }
                }
            );
        });
};
}
