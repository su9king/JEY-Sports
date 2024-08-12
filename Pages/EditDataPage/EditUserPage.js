let userID

//////////////////// Step0 : 회원인증, 사이드바 ////////////////////
window.onload = async function() {
    const page = 'EditUserPage';
    const userToken = sessionStorage.getItem('userToken');
    const groupToken = sessionStorage.getItem('groupToken');
    const data = `userToken=${userToken}&groupToken=${groupToken}`
    
    response = await certification(page, data);
    userID = response.resources[0]['userID']
    

    if (response.result == 0) {
        alert('로그인 후 사용해주세요!');
        window.location.href = '/WarningPage.html';
    } else {
        const userPermission = response.userPermission;
        loadSidebar(page, userPermission, response);
        document.getElementById('userName').value = response.resources[0]['userName'];
        document.getElementById('userIntro').value = response.resources[0]['userIntro'];
        document.getElementById('userMail').value = response.resources[0]['userMail'];

        const userImage = sessionStorage.getItem('userImage');
        document.getElementById('userImageSample').src = userImage == 'null' ? `/UserImages/NULL.jpg` : `/UserImages/${userImage}`;

    }
    

    // 뒤로가기
    document.getElementById('backButton').addEventListener('click', function() {
        window.history.back();
    });
}


document.addEventListener('DOMContentLoaded', function() {
    const userToken = sessionStorage.getItem('userToken');
    const groupToken = sessionStorage.getItem('groupToken');

    const userNameBtn = document.getElementById('userNameBtn');
    const userPWBtn = document.getElementById('userPWBtn');
    const userImageBtn = document.getElementById('userImageBtn');
    const userMailBtn = document.getElementById('userMailBtn');
    const userIntroBtn = document.getElementById('userIntroBtn');
    const leaveJEYBtn = document.getElementById('leaveJEYBtn');


    // 모든 label 요소에 클릭 이벤트를 방지하는 핸들러 추가
    const labels = document.querySelectorAll('label');
    labels.forEach(label => {
            label.addEventListener('click', function(e) {
                e.preventDefault(); // 클릭 이벤트 기본 동작 방지
            });
    });

    /////////////////////////////////// 프로필 사진 변경 ///////////////////////////////////
    ////// 이미지 저장 ////// 
    const userImage = document.getElementById('userImage');

    userImage.addEventListener('change', function(event) {  
        const file = event.target.files[0];

        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                alert('JPG와 PNG 파일만 업로드 가능합니다!');
                userImage.value = '';
                return;
            }

            if (file.size > 5 * 1024 * 1024) { // 5MB
                alert('5MB 이하의 파일만 가능합니다!');
                userImage.value = '';
                return;
            } 
            
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('userImageSample').src = e.target.result;
            };
            reader.readAsDataURL(file);

        } else {
            alert('변경할 이미지를 첨부해주세요!');
        }
    });
    ////// 이미지 버튼 ////// 
    userImageBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const userImage = document.getElementById('userImage').files[0] ? document.getElementById('userImage').files[0] : null;
        const functionType = 1; // 개인 프로필
    

        const newImage = await imageUpload(functionType, userToken, userImage)
        sessionStorage.setItem('userImage', newImage )
        alert("개인 프로필 사진이 수정되었습니다!");
        location.reload();
    });





    /////////////////////////////////// 이름 변경 ///////////////////////////////////
    userNameBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const userName = document.getElementById('userName').value;
        const functionType = 1;
        
        if (userName && userName != response.resources[0]['userName']) {
            try {
                const response = await fetch('/ChangeNormalData', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ functionType: functionType, userToken: userToken, userID: userID, setKey : "userName", setValue : userName })
                });
    
                data = await response.json();
    
                if (data.result == 0) {
                    alert('다시 시도해주세요!')
                } else if (data.result == 1) {
                    alert('이름이 성공적으로 수정되었습니다!')
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            alert('새로운 이름을 작성해주세요!');
        }
        
    });



    /////////////////////////////////// ID 변경 ///////////////////////////////////
    ////// ID 작성 형태 제한 //////
    const userIDInput = document.getElementById('userID');
    const allowID = document.getElementById('idAlert');
    const idCheckButton = document.getElementById('idCheckButton');
    const userIDBtn = document.getElementById('userIDBtn');

    userIDInput.addEventListener('input', async function(e) {
        e.preventDefault();
        allowID.style.display = 'none'
        idCheck = false;

        const engFilter = /^[a-zA-Z0-9]*$/;

        if (!engFilter.test(userIDInput.value)) {
            userIDInput.value = userIDInput.value.replace(/[^a-zA-Z0-9]/g, ''); // 한글 및 기타 문자 제거
            alert('아이디는 영어와 숫자만 가능합니다!');
        }
    });


    ////// ID 중복 확인 버튼 //////
    idCheckButton.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const userID = document.getElementById('userID').value;
        
        allowID.style.display = 'none' // 가능한 id를 작성했다가 불가능한 id를 확인하는 경우, 가능하다는 알림을 삭제하기 위해

        const functionType = 3;
        
        if (userID) {
            try {
                const response = await fetch('/ChangeNormalData', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ functionType: functionType, userID: userID, userToken: userToken  })
                });

                data = await response.json();

                if (data.result == 0) {  // 사용 가능한 ID
                    allowID.style.display = 'block';
                    idCheck = true;
                } else {
                    document.getElementById('userID').value = '';
                    alert('이미 사용중인 ID입니다! \n다른 ID를 이용해주세요!')
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {  // 빈칸으로 제출한 경우
            alert('원하는 ID를 작성해주세요!');
        }
        
    });


    ////// ID 버튼 ////// 
    userIDBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const userID = document.getElementById('userID').value;
        const functionType = 1;

        if (idCheck == true) {
            try {
                const response = await fetch('/ChangeNormalData', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ functionType: functionType, userToken: userToken, setKey : "userID", setValue : userID })
                });
    
                data = await response.json();
    
                if (data.result == 1) {  
                    alert('ID가 성공적으로 수정되었습니다!');
                } else if (data.result == 0) {
                    alert('다시 시도해주세요!');
                } else {
                    alert('완전 오류!');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            alert('ID 중복체크를 해주세요!');
        }
            
    });





    /////////////////////////////////// 비밀 번호 변경 ///////////////////////////////////
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

    ////// 비밀번호 버튼 ////// 
    userPWBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const PW1 = document.getElementById('PW1').value;
        const PW2 = document.getElementById('PW2').value;

        const functionType = 1;
 
        if (PW2) {
            if (PW1 == PW2) {
                try {
                    const response = await fetch('/ChangeNormalData', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ functionType: functionType, userToken: userToken, userID: userID, setKey : "userPW", setValue : PW1 })
                    });
        
                    data = await response.json();
        
                    if (data.result == 0) {  
                        alert('다시 시도해주세요!')
                    } else {
                        alert('userPW이 성공적으로 수정되었습니다!')
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            } else {
                alert('비밀번호가 일치하지 않습니다!');
            }
        } else {
            alert('변경할 비밀번호를 작성해주세요!');
        }
            
    });


    /////////////////////////////////// 이메일 변경 ///////////////////////////////////
    ////// 이메일 형식 확인 ////// 
    let emailCheck = false;
    const userMail = document.getElementById('userMail');
    userMail.addEventListener('input', validateEmail);

    function validateEmail() {
        const userMail = document.getElementById('userMail').value;
        const emailFeedback = document.getElementById('emailFeedback');
        const emailPattern = /^[^\s@]+@[^\s@]+\.(com|net|ac\.kr)$/;
        emailCheck = false;

        if (emailPattern.test(userMail)) {
            emailFeedback.textContent = '';
            emailFeedback.className = 'valid';
            emailCheck = true;
        } else {
            emailFeedback.textContent = '올바른 이메일 주소를 작성해주세요!';
            emailFeedback.className = 'invalid';
        }
    }

    ////// 이메일 버튼 ////// 
    userMailBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const userMail = document.getElementById('userMail').value;
        const functionType = 1;
        if (userMail != response.resources[0]['userMail']) {
            if (emailCheck == true) {
                try {
                    const response = await fetch('/ChangeNormalData', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ functionType: functionType, userToken: userToken, userID: userID, setKey : "userMail", setValue : userMail })
                    });
        
                    data = await response.json();
        
                    if (data.result == 0) {
                        alert('다시 시도해주세요!')
                    } else {
                        alert('userMail이 성공적으로 수정되었습니다!')
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            } else {
                alert('올바른 이메일 형식을 지켜주세요!');
            }
        } else {
            alert('새로운 이메일을 작성해주세요!');
        }
        
        
    });

    /////////////////////////////////// 개인소개 변경 ///////////////////////////////////
    ////// 자기소개 글자수 제한 ////// 
    const textarea = document.getElementById('userIntro');

    textarea.addEventListener('input', function() {
        if (this.value.length > 50) {
            alert('50자까지만 입력할 수 있습니다.');
            this.value = this.value.substring(0, 50);
        }
    });
    
    ////// 자기소개 버튼 ////// 
    userIntroBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const userIntro = document.getElementById('userIntro').value;
        const functionType = 1;
        
        if ( userIntro != response.resources[0]['userIntro'] ){
            try {
                const response = await fetch('/ChangeNormalData', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ functionType: functionType, userToken: userToken, userID: userID, setKey : "userIntro", setValue : userIntro })
                });
    
                data = await response.json();
    
                if (data.result == 0) {
                    alert('다시 시도해주세요!')
                } else {
                    alert('자기소개가 성공적으로 수정되었습니다!')
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            alert('새로운 자기소개를 작성해주세요!')
        }
        
    });

    
    /////////////////////////////////// 소프트웨어 탈퇴 ///////////////////////////////////
    ////// 회원 탈퇴 버튼 ////// 
    leaveJEYBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        if (confirm('소속된 조직이 있다면 탈퇴하실 수 없습니다. \n정말로 탈퇴하시겠습니까?')) {
            try {
                const response = await fetch('/DeleteUser', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ userToken: userToken, userID: userID })
                });
    
                data = await response.json();
    
                if (data.result == 0) {
                    //alert(`소속된 조직이 있으면 탈퇴가 불가능합니다!\n\n 소속된 조직 : ${data.resources['groupName']} `);
                    alert(`소속된 조직이 있으면 탈퇴가 불가능합니다!\n\n 소속된 조직 : 데이터 수신 `);
                } else if (data.result == 1) {
                    console.log('Delete response 성공')
                    try {
                        const response = await fetch('/Logout', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ userToken: userToken })
                        });
                
                        const data =  await response.json();
                
                        if (data.result == 1) {
                            sessionStorage.clear();
                            alert('회원 탈퇴 되었습니다! 그동안 이용해주셔서 감사합니다.')
                            window.location.href = '/LoginPage.html';
                        } else {
                            alert('로그아웃 실패!')
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }

        }

    });
});




