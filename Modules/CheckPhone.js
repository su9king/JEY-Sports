//필요한 변수 및 모듈 , API 선언
const { rand } = require('../BackEndUtility.js');
const { CheckDuplicate } = require('./CheckDuplicate.js');

const coolsms = require('../node_modules/coolsms-node-sdk').default
const messageService = new coolsms('API_KEY', 'API_SECRET_KEY')
let phoneList = {}
let successList = {}




// 메인 실행 코드
module.exports = {
    CheckPhone: async (data) => {

        const functionType = data["functionType"];
        const userPhone = data["userPhone"];
        
        if( functionType == 0 ){
            
            data = {userPhone : userPhone};
            table = "Users"
            var result = await CheckDuplicate(table,data);
            
            if (result == 1){
                return 2
            }else{
                result = await sendMessage(userPhone);
                return result
            }
            
        }else if( functionType == 1){
            
            const code = data["code"]
            const result = await checkCode(userPhone,code)
            return result
        }
        
    }
    ,checkCode
};

//==================================================함수 선언 파트



// 메시지 전송하기
phoneList = {}
async function sendMessage(userPhone){
    return new Promise((resolve, reject) => {



        const code = rand(100000, 999999);
        phoneList[userPhone] = code;
        
        //API 를 이용해 메시지 전송
        messageService.sendOne({
            to: userPhone,
            from: '01027034699',
            text: 'JEYSport 인증번호 입니다. ' + code

        }).then(res => {
            console.log(res);
            resolve(1);

        }).catch(err => {
            console.error(err);
            reject(err);
        });

        // 3분(180,000밀리초) 후에 데이터를 삭제하는 타이머 설정
        setTimeout(() => {
            // phoneList에서 해당 데이터를 삭제
            if (phoneList[userPhone] == code) {
                delete phoneList[userPhone];
                console.log('데이터 삭제:', userPhone, code);
            }
        }, 180000);
    });
}

async function checkCode(userPhone, code) {
    return new Promise((resolve, reject) => {
        // 해당 전화번호에 대해서 메세지가 전송이 간 상태라면
        if (userPhone in phoneList) {
            // 입력한 코드가 인증완료 되었다면 
            if (phoneList[userPhone] == code) {
                delete phoneList[userPhone];
                successList[userPhone] = true;
                resolve(1);

                // 12분(720,000밀리초) 후에 데이터를 삭제하는 타이머 설정
                setTimeout(() => {
                    // successList에서 해당 데이터를 삭제
                    if (successList[userPhone] == true) {
                        delete successList[userPhone];
                        console.log('데이터 삭제:', userPhone);
                    }
                }, 720000);
            } else {
                // 코드가 일치하지 않음
                resolve(0);
            }
        // 입력된 전화번호가 이미 인증완료 되어있는 상태라면
        } else if (userPhone in successList) {
            resolve(1);
        // 메세지 전송이 안간 상태이거나 그 외 상황들
        } else {
            resolve(0);
        }
    });
}

