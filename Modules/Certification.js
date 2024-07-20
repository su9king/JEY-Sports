
// 메인 실행 코드
module.exports = {

    //page 와 userToken 기반으로 각 페이지에 맞는 리소스 제공
    Certification: async (userToken,page) => {
        return new Promise((resolve, reject) => {
            
            if (page == "PrivatePage"){
                console.log("제공할 리소스가 없습니다.")
                resolve(1);
            }
        });
        
    }
};


