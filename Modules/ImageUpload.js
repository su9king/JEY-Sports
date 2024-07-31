//필요한 모듈 및 변수 선언
const multer = require('../node_modules/multer');
const path = require('../node_modules/path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'Images/GroupImages'; // 업로드할 폴더
        // 폴더가 없으면 생성
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        
        cb(null, file.originalname); // 원래 파일 이름으로 저장
    }
});

const upload = multer({ storage: storage });


// 메인 실행 코드
module.exports = {
    // 이미지 업로드 함수
    ImageUpload: async (req, res) => {
        const groupImage = req.file; // 업로드된 이미지
        const JSONdata = JSON.parse(req.body.json);
        console.log(JSONdata);
        
        if (!groupImage) {
            return 0;
        }
        // 업로드 성공 시
        return 1; // 또는 필요한 경우 다른 데이터를 반환
    },
    upload // multer 미들웨어를 export
};

