document.addEventListener('DOMContentLoaded', function() {
    const phoneCheckForm = document.getElementById('phoneCheckForm');
    const registerForm = document.getElementById('registrationForm');
    
    const userID = document.getElementById('userID');
    const allowID = document.getElementById('idAlert');

    const idCheckButton = document.getElementById('idCheckButton');
    const sendCodeButton = document.getElementById('sendCodeButton');
    const verifyCodeButton = document.getElementById('verifyCodeButton');

    let idCheck = false;
    let codeCheck = false;
    let consentedCheck = false;
    let emailCheck = false;

    // 뒤로가기
    document.getElementById('backButton').addEventListener('click', function() {
        window.history.back();
    });


    // 모든 label 요소에 클릭 이벤트를 방지하는 핸들러 추가
    const labels = document.querySelectorAll('label');
    labels.forEach(label => {
        if (label.id !== 'checkboxLabel') { // 특정 라벨 제외
            label.addEventListener('click', function(e) {
                e.preventDefault(); // 클릭 이벤트 기본 동작 방지
        });
    }
    });
    

    ////// ID 작성 형태 제한 //////
    userID.addEventListener('input', async function(e) {
        e.preventDefault();
        allowID.style.display = 'none'
        idCheck = false;

        const engFilter = /^[a-zA-Z0-9]*$/;

        if (!engFilter.test(userID.value)) {
            userID.value = userID.value.replace(/[^a-zA-Z0-9]/g, ''); // 한글 및 기타 문자 제거
            alert('아이디는 영어와 숫자만 가능합니다!');
        }
    });


    ////// ID 중복 확인 버튼 //////
    idCheckButton.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const userID = document.getElementById('userID').value;
        
        allowID.style.display = 'none' // 가능한 id를 작성했다가 불가능한 id를 확인하는 경우, 가능하다는 알림을 삭제하기 위해

        const functionType = 0;
        
        if (userID) {
            try {
                const response = await fetch('/Register', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ functionType: functionType, userID: userID })
                });
    
                data = await response.json();
    
                if (data.result == 0) {  // 사용 가능한 ID
                    allowID.style.display = 'block';
                    idCheck = true;
                } else if (data.result == 1)  {
                    document.getElementById('userID').value = '';
                    alert('이미 사용중인 ID입니다! \n다른 ID를 이용해주세요!')
                } else {
                    alert('관리자에게 문의해주세요')
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {  // 빈칸으로 제출한 경우
            alert('원하는 ID를 작성해주세요!');
        }
        
    });

    ////// 인증번호 전송 버튼 //////
    sendCodeButton.addEventListener('click', async function(e) {
        e.preventDefault();

        const userPhone = document.getElementById('userPhone').value;
        const functionType = 0;

        if (!/^\d{10,11}$/.test(userPhone)) {  // 작성 형태 제한
            alert('전화번호는 숫자만 입력해주세요! \nex)01012345678');
            document.getElementById('userPhone').value = '';
            return;
        }

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
            } else if (data.result == 2) {
                alert('이미 가입된 전화번호입니다!');
                document.getElementById('userPhone').value = '';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    ////// 인증번호 확인 버튼 //////
    verifyCodeButton.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const userPhone = document.getElementById('userPhone').value;
        const code = document.getElementById('code').value;
        const functionType = 1;
        
        try {
            const response = await fetch('/CheckPhone', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, code: code, userPhone: userPhone })
            });

            data = await response.json();

            if (data.result == 1) {
                alert('휴대폰 인증이 완료되었습니다!')
                codeCheck = true;
                document.getElementById('userPhone').readOnly = true; // 인증 완료하면 수정 금지
                document.getElementById('code').readOnly = true; // 인증 완료하면 수정 금지
                document.getElementById('verifyCodeButton').disabled = true;
                document.getElementById('sendCodeButton').disabled = true;
            } else if (data.result == 0) {
                document.getElementById('code').value = '';
                alert('옳지 않은 인증번호입니다. \n휴대폰 인증을 다시 시도해주세요!');
            } else {
                alert('관리자에게 문의해주세요')
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

    // 이메일 //
    const userEmail = document.getElementById('userEmail');
    userEmail.addEventListener('input', validateEmail);

    function validateEmail() {
        const userEmail = document.getElementById('userEmail').value;
        const emailFeedback = document.getElementById('emailFeedback');
        const emailPattern = /^[^\s@]+@[^\s@]+\.(com|net|ac\.kr)$/;

        if (emailPattern.test(userEmail)) {
            emailFeedback.textContent = '';
            emailFeedback.className = 'valid';
            emailCheck = true;
        } else {
            emailFeedback.textContent = '올바른 이메일 주소를 작성해주세요!';
            emailFeedback.className = 'invalid';
        }
    }


    //// 개인 정보 수집 동의 ////
    const privacyPolicyLabel = document.getElementById('privacyPolicyLabel');
    const overlay = document.getElementById('overlay');
    const privacyModal = document.getElementById('privacyModal');
    const privacyContent = document.getElementById('privacyContent');
    const modalPrivacyPolicy = document.getElementById('modalPrivacyPolicy');
    const finishModalButton = document.getElementById('finishModalButton');
    const closeModalButton = document.getElementById('closeModalButton');

    // 개인정보 동의 레이블 클릭 시 모달 열기
    privacyPolicyLabel.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('test');
        overlay.classList.remove('hidden');
        privacyModal.classList.remove('hidden');
    });

    // 모달 내 스크롤이 끝까지 내려가면 동의 체크박스 활성화
    privacyContent.addEventListener('scroll', function() {
        if (privacyContent.scrollTop + privacyContent.clientHeight >= privacyContent.scrollHeight - 20) {
            modalPrivacyPolicy.disabled = false;
            finishModalButton.disabled = false;
        }
    });

    // 모달 동의 체크박스 변경 시 처리
    modalPrivacyPolicy.addEventListener('change', function() {
        if (modalPrivacyPolicy.checked) {
            document.getElementById('userConsented').checked = true;
            consentedCheck = true;
            // overlay.classList.add('hidden');
            // privacyModal.classList.add('hidden');
        } else {
            document.getElementById('userConsented').checked = false;
        }
    });

    // 완료 후 닫기 버튼 클릭 시 처리
    finishModalButton.addEventListener('click', function() {
        if (modalPrivacyPolicy.checked) {
            overlay.classList.add('hidden');
            privacyModal.classList.add('hidden');
        } else {
            alert('약관에 동의하셔야 합니다.');
        }
    });

    // 완료 후 닫기 버튼 클릭 시 처리
    closeModalButton.addEventListener('click', function() {
        overlay.classList.add('hidden');
        privacyModal.classList.add('hidden');
        });








    ////// 최종 회원가입 폼 제출 //////
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
    
        const userName = document.getElementById('userName').value;
        const userID = document.getElementById('userID').value;
        const userPhone = document.getElementById('userPhone').value;
        const PW1 = document.getElementById('PW1').value;
        const PW2 = document.getElementById('PW2').value;
        const userEmail = document.getElementById('userEmail').value;

        const code = document.getElementById('code').value;

        let userAddress = document.getElementById('userAddress').value;
        let userBirth = document.getElementById('userBirth').value;
        let userGender = document.querySelector('input[name="gender"]:checked');
        let userImage = document.getElementById('userImage').files[0];

        const userConsented = document.getElementById('userConsented').checked;
        const userConsentedDate = userConsented ? new Date().toISOString().split('T')[0] : null;

        // null값 허용
        userAddress = allowNull(userAddress);
        userBirth = allowNull(userBirth);
        userGender = userGender | userGender == 'P' ? userGender.value : null;
        userImage = userImage ? userImage : null;
        
        console.log('userGender', userGender);
        


        if (userName && userID && userPhone && code && userEmail && PW1 && PW1 == PW2 && idCheck == true && codeCheck == true && consentedCheck == true && emailCheck == true ) {
            const functionType = 1;

            const response = await fetch('/Register', {
                method : 'POST',
                headers : {'Content-Type': 'application/json'},
                body : JSON.stringify({ functionType: functionType,
                                        userName: userName,
                                        userImage: userImage,
                                        userID: userID, 
                                        userPW: PW1, 
                                        userPhone: userPhone, 
                                        userMail: userEmail, 
                                        userAddress: userAddress, 
                                        userGender: userGender, 
                                        userBirth: userBirth,
                                        userConsented: userConsented,// 약관
                                        userConsentedDate: userConsentedDate// 약관 날짜
                                        })
            });

            data =  await response.json();

            if (data.result == 1) {
                alert("회원가입이 완료되었습니다!");
                window.location.href = '/LoginPage.html'; 
            } else if (data.result == 0) {
                alert('다시 시도해주세요!');
            } else {
                alert('관리자에게 문의해주세요')
            }

        } else {
            if (idCheck == false) {
                alert('ID 중복 체크를 진행해주세요!!');
            } else if (codeCheck == false) {
                alert('인증번호 확인을 진행해주세요!!');
            } else if (consentedCheck == false) {
                alert('개인 정보 수집에 동의해주세요!');
            } else {
                alert('제시된 정보를 모두 채워주세요!');
            }
        }
       
        function allowNull(userData) {
            if (userData == '') {
                userData = null;
                return userData;
            } else {
                return userData;
            }
        }

    });




});



