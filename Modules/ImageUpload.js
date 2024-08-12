const multer = require('multer');
const path = require('path');
const fs = require('fs');
const connection = require('../DatabaseLoad');

// multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images'); // 기본 경로 설정
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`); // 파일 이름을 현재 시간으로 설정
    }
});

const upload = multer({ storage: storage });

// 메인 실행 코드
module.exports = {
    // 이미지 업로드 함수
    ImageUpload: async (userToken,req, res) => {
        try {
            const JSONdata = JSON.parse(req.body.json); // JSON 데이터 파싱
            const functionType = JSONdata["functionType"];
            let uploadDir;
            let result;

            const ext = path.extname(req.file.originalname);

            // functionType에 따라 디렉토리 설정
            if (functionType == 1) {
                uploadDir = 'Images/UserImages'; // 사용자 이미지 폴더
                var fileName = userToken;
                result = await DBsave(1, fileName, ext);

            } else if (functionType == 2) {
                uploadDir = 'Images/GroupImages'; // 그룹 이미지 폴더
                var fileName = JSONdata["groupToken"]
                result = await DBsave(2, fileName, ext);

            } else {
                return {result : 0 , resources : null};
            }

            // DBsave 결과 확인
            if (result === 0) {
                return {result : 0 , resources : null};
            }

            // 폴더가 없으면 생성
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // 파일 이동

            const newFilePath = path.join(uploadDir, `${fileName}${ext}`);

            fs.renameSync(req.file.path, newFilePath); // 파일 이름 변경
            const resources = {userImage : `${fileName}${ext}`};
            return {result : 1, resources : resources }
            
        } catch (error) {
            console.error('Error in ImageUpload:', error); // 에러 로그 출력
            return {result : 0 , resources : null};
        }
    },
    upload // multer 미들웨어를 export
};

async function DBsave(functionType, Token , ext) {

    const value = `${Token}${ext}`;
    let table, key, imageKey;

    if (functionType == 1) { // 유저 이미지 저장
        table = 'Users';
        key = 'userToken';
        imageKey = 'userImage';
    } else if (functionType == 2) { // 조직 이미지 저장
        console.log("DBSAVE 2 SIGN");
        table = 'Organizations';
        key = 'groupToken';
        imageKey = 'groupImage';
    } else {
        return 0; // 잘못된 functionType 처리
    }

    return new Promise((resolve, reject) => {
        connection.query(`UPDATE ??
                          SET ?? = ?
                          WHERE ?? = ?`, [table, imageKey, value, key, Token],
            (error, results) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return reject(error);
                }
                // 쿼리 결과가 없다면 토큰이 잘못 됨.
                if (results.affectedRows > 0) {
                    resolve(1);
                } else {
                    resolve(0);
                }
            }
        );
    });
}
