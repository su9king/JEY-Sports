// db.js
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '172.30.1.2', // 데이터베이스 호스트
  user: 'root',      // 데이터베이스 사용자
  password: '123456', // 데이터베이스 비밀번호
  database: 'JEYSportDB', // 데이터베이스 이름
  port : 3306,
  multipleStatements : true
});

connection.connect((err) => {
  if (err) {
    console.error('데이터베이스 연결 실패:', err.stack);
    console.log("DatabaseLoad.js 의 설정을 확인하시기 바랍니다.")
    return;
  }
  console.log('데이터베이스에 연결되었습니다. 연결 ID:', connection.threadId);
});

module.exports = connection;