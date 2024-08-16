//필요한 모듈 선언
const connection = require('../DatabaseLoad');

// 메인 실행 코드. 그냥 복사 붙여넣기 용
module.exports = {
    CreateAttendanceList : async(scheduleToken,groupToken) => {
        try {
            const groupRealMembers = await GroupRealMembers(groupToken);
            const groupNotRealMembers = await GroupNotRealMembers(groupToken);

            // 출석 목록 생성
            const result = await SetAttendanceList(scheduleToken, groupRealMembers, groupNotRealMembers);
            return result;
        } catch (error) {
            return {result : 0 , resources : null};
        }

        
        
    }
};

async function GroupRealMembers(groupToken) {

    return new Promise((resolve, reject) => {
        connection.query(`SELECT userToken FROM UsersOrganizations
            WHERE groupToken = ?`, [groupToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }
    
                
                if (results.length > 0) {
                    resolve(results);  
                } else {
                    resolve(null);  
                }
            }
        );
    });
    
}

async function GroupNotRealMembers(groupToken) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT notUserToken FROM NotUsersOrganizations
            WHERE groupToken = ?`, [groupToken], 
            (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }
    
                
                if (results.length > 0) {
                    resolve(results);  
                } else {
                    resolve(null);  
                }
            }
        );
    });
}

async function SetAttendanceList(scheduleToken, groupRealMembers, groupNotRealMembers) {
    return new Promise((resolve, reject) => {
        const attendanceData = [];

        // userToken과 scheduleToken 묶기
        if (groupRealMembers) {
            groupRealMembers.forEach(member => {
                attendanceData.push([scheduleToken, member.userToken, null]);  // notUserToken은 null
            });
        }

        // notUserToken과 scheduleToken 묶기
        if (groupNotRealMembers) {
            groupNotRealMembers.forEach(member => {
                attendanceData.push([scheduleToken, null, member.notUserToken]);  // userToken은 null
            });
        }
        if (attendanceData.length > 0) {
            // 다중 삽입 쿼리
            const query = `INSERT INTO AttendanceUsers (scheduleToken, userToken, notUserToken) VALUES ?`;
            connection.query(query, [attendanceData], (error, results, fields) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }

                if (results.affectedRows > 0) {
                    resolve({result : 1 , resources : null});  
                } else {
                    resolve({result : 0 , resources : null});  
                }
            });
        } else {
            // 삽입할 데이터가 없는 경우
            resolve(null);
        }
    });
}