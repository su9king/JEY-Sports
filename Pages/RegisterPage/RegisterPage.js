document.addEventListener('DOMContentLoaded', function() {
    const idForm = document.getElementById('idForm');
    const phoneForm = document.getElementById('phoneForm');
    const phoneCheckForm = document.getElementById('phoneCheckForm');
    
    const register = document.getElementById('register');

    ////// ID 중복 확인 폼 //////
    idForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const userID = document.getElementById('userID').value;
        const allowID = document.getElementById('idAlert');

        const functionType = 0;
        
        try {
            const response = await fetch('/Register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, userID: userID })
            });

            data =  await response.json();

            if (data.result == 0) {
                allowID.style.display = 'block';
            } else {
                userID.innerHTML = '';
                alert('이미 사용중인 ID입니다! \n다른 ID를 이용해주세요!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    ////// 인증번호 전송 폼 //////
    phoneForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const userPhone = document.getElementById('userPhone').value;
        const functionType = 0;

        try {
            const response = await fetch('/CheckPhone', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, userPhone: userPhone })
            });

            data =  await response.json();

            if (data.result == 1) {
                phoneCheckForm.style.display = 'block';
                alert('인증번호가 전송되었습니다!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    ////// 인증번호 확인 폼 //////
    phoneCheckForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const userPhone = document.getElementById('userPhone').value;
        const code = document.getElementById('code').value;
        const codeHTML = document.getElementById('code');
        const functionType = 1;
        
        try {
            const response = await fetch('/CheckPhone', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, code: code, userPhone: userPhone })
            });

            data =  await response.json();

            if (data.result == 1) {
                alert('휴대폰 인증이 완료되었습니다!')
            } else if (data.result == 0) {
                codeHTML.value = '';
                alert('옳지 않은 인증번호입니다. \n휴대폰 인증을 다시 시도해주세요!');
                phoneCheckForm.style.display = 'none';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
    
    ////// 비밀번호 확인 기능 상시 활성화 //////
    const PW1 = document.getElementById('PW1');
    const PW2 = document.getElementById('PW2');
    const pwAlert = document.getElementById('pwAlert');

    PW1.addEventListener('input', checkPasswords); 
    PW2.addEventListener('input', checkPasswords);

    function checkPasswords() {
        if (PW1.value !== PW2.value) {
            pwAlert.style.display = 'block';
        } else {
            pwAlert.style.display = 'none';
        }
    }

    ////// 최종 회원가입 버튼 //////
    register.addEventListener('click', registerBtn);

    async function registerBtn() {
        const userID = document.getElementById('userID').value;
        const userPhone = document.getElementById('userPhone').value;
        const PW1 = document.getElementById('PW1').value;
        const PW2 = document.getElementById('PW2').value;
        const userEmail = document.getElementById('userEmail').value;

        let userAddress = document.getElementById('userAddress').value;
        let userGender = document.getElementById('userGender').value;
        let userBirth = document.getElementById('userBirth').value;

        const code = document.getElementById('code').value;

        console.log(userAddress,userGender,userBirth)

        userAddress = allowNull(userAddress);
        userGender = allowNull(userGender);
        userBirth = allowNull(userBirth);

        console.log(userAddress,userGender,userBirth)

        if (userID && userPhone && code && userEmail && PW1 == PW2) {
            const functionType = 1;

            const response = await fetch('/Register', {
                method : 'POST',
                headers : {'Content-Type': 'application/json'},
                body : JSON.stringify({ functionType: functionType,
                                        userID: userID, 
                                        userPW: PW1, 
                                        userPhone: userPhone, 
                                        userMail: userEmail, 
                                        userAddress: userAddress, 
                                        userGender: userGender, 
                                        userBirth: userBirth})
            });

            data =  await response.json();

            if (data.result == 1) {
                alert("회원가입이 완료되었습니다!");
                window.location.href = '/LoginPage.html'; 
            } else {
                alert('다시 시도해주세요!');
            }

        } else {
            alert('제시된 정보를 모두 채워주세요!');
        }
       

    }

    function allowNull(userData) {
        console.log(userData)
        if (userData == '') {
            userData = null;
            return userData;
        }else{
            return userData;
        }
    }


});







