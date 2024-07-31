//필요한 모듈 선언
const multer = require('../node_modules/multer');
const path = require('../node_modules/path');
const fs = require('fs');

// 메인 실행 코드
module.exports = {
    ImageUpload : async(req,res) => {

        const groupImage = req.file;
        const data = JSON.parse(req.body.json)

        console.log(data)

        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const uploadDir = 'Images'; // 업로드할 폴더
                // 폴더가 없으면 생성
                if (!fs.existsSync(uploadDir)){
                    fs.mkdirSync(uploadDir);
                }
                cb(null, uploadDir);
            },
            filename: (req, file, cb) => {
                cb(null, file.originalname);
            }
        });

        const upload = multer({ storage: storage });

        return new Promise((resolve, reject) => {
            upload.single('image')(req, res, (err) => {
                if (err) {
                    return reject(err);
                }
                // 업로드 성공 시
                resolve(1);
            });
        });
    
    }
};

