//////////////////// Step0 : 회원인증, 사이드바 ////////////////////\
previousPage = "/GroupMainPage/GroupMainPage.html"
window.onload = async function() {
    const page = 'EditGroupPage';
    const userToken = sessionStorage.getItem('userToken');
    const groupToken = sessionStorage.getItem('groupToken');
    const userPermission = sessionStorage.getItem('userPermission');
    const data = `userToken=${userToken}&groupToken=${groupToken}&userPermission=${userPermission}`;
    
    response = await certification(page, data);
    

    if (response.result == 0) {
        alert('로그인 후 사용해주세요!');
        window.location.href = '/WarningPage.html';
    } else {
        loadSidebar(page, userPermission, response);
        document.getElementById('groupName').value = response.resources[0]['groupName'];
        document.getElementById('groupID').value = response.resources[0]['groupID'];
        document.getElementById('groupIntro').value = response.resources[0]['groupIntro'];
        document.getElementById('groupBankAccountName').value = response.resources[0]['groupBankAccountName'];
        document.getElementById('groupBankAccountNumber').value = response.resources[0]['groupBankAccountNumber'];

        const groupImage = response.resources[0]["groupImage"];
        document.getElementById('groupImageSample').src = groupImage ? `/GroupImages/${groupImage}` : `/GroupImages/NULL.png`;
           

    
    }
    loadMenubar(sessionStorage.getItem('groupName'));
}


document.addEventListener('DOMContentLoaded', function() {
    const userToken = sessionStorage.getItem('userToken');
    const groupToken = sessionStorage.getItem('groupToken');
    const userPermission = sessionStorage.getItem('userPermission');

    const groupNameBtn = document.getElementById('groupNameBtn');
    const groupPWBtn = document.getElementById('groupPWBtn');
    const groupImageBtn = document.getElementById('groupImageBtn');
    const groupIDBtn = document.getElementById('groupIDBtn');
    const groupIntroBtn = document.getElementById('groupIntroBtn');
    const groupAccountBtn = document.getElementById('groupAccountBtn');
    const deleteGroupBtn = document.getElementById('deleteGroupBtn');

    // 모든 label 요소에 클릭 이벤트를 방지하는 핸들러 추가
    const labels = document.querySelectorAll('label');
    labels.forEach(label => {
        label.addEventListener('click', function(e) {
            e.preventDefault(); // 클릭 이벤트 기본 동작 방지
        });
    });


    /////////////////////////////////// 프로필 사진 변경 ///////////////////////////////////
    ////// 이미지 저장 ////// 
    const groupImage = document.getElementById('groupImage');

    groupImage.addEventListener('change', function(event) {  
        const file = event.target.files[0];

        if (file) {  // 파일 확장자, 용량 제한
            const allowedTypes = ['image/jpeg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {  // 파일 확장자, 용량 제한
                alert('JPG와 PNG 파일만 업로드 가능합니다!');
                groupImage.value = '';
                return;
            }

            if (file.size > 5 * 1024 * 1024) { // 5MB // 파일 확장자, 용량 제한
                alert('5MB 이하의 파일만 가능합니다!');
                groupImage.value = '';
                return;
            } 
            
            // 첨부 이미지 미리보기
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('groupImageSample').src = e.target.result;
            };
            reader.readAsDataURL(file);

        } else {
            alert('변경할 이미지를 첨부해주세요!');
        }
    });
    ////// 이미지 버튼 ////// 
    groupImageBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const groupImage = document.getElementById('groupImage').files[0];
        const functionType = 2; // 조직 프로필

        if (groupImage) {
            await imageUpload(functionType, userToken, groupImage, groupToken );
            alert("조직 프로필 사진이 수정되었습니다!");
            location.reload(true);
        }

    });




    /////////////////////////////////// 조직 이름 변경 ///////////////////////////////////
    document.getElementById('groupName').addEventListener('input', function () {
        const maxLength = 10;
        const groupNameInput = this;

        if (groupNameInput.value.length > maxLength) {
            alert('조직 이름은 최대 10글자까지 입력할 수 있습니다!');
            groupNameInput.value = groupNameInput.value.slice(0, maxLength);
        }
    });

    groupNameBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const groupName = document.getElementById('groupName').value;
        const functionType = 2;
        const userPermission = sessionStorage.getItem('userPermission');
        if (groupName && groupName != response.resources[0]['groupName']) {
            try {
                const response = await fetch('/ChangeNormalData', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ functionType: functionType, userPermission: userPermission, userToken: userToken, groupToken: groupToken, setKey : "groupName", setValue : groupName })
                });
    
                data = await response.json();
    
                if (data.result == 0) {  
                    alert('다시 시도해주세요!')
                } else if (data.result == 1) {
                    alert('조직명이 성공적으로 수정되었습니다!')
                    location.reload(true);
                } else {
                    alert('관리자에게 문의해주세요')
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            alert('새로운 조직명을 작성해주세요!');
        }
        
    });

    
    /////////////////////////////////// ID 변경 ///////////////////////////////////
    const groupID = document.getElementById('groupID');
    const allowID = document.getElementById('idAlert');
    const idCheckButton = document.getElementById('idCheckButton');
    
    ////// 입력 가능 문자 제한 ////// 
    let idCheck = false;
    
    groupID.addEventListener('input', async function(e) {
        e.preventDefault();
        allowID.style.display = 'none'
        idCheck = false;

        const engFilter = /^[a-zA-Z0-9]*$/;

        if (!engFilter.test(groupID.value)) {
            groupID.value = groupID.value.replace(/[^a-zA-Z0-9]/g, '');
            alert('아이디는 영어와 숫자만 가능합니다!');
        }
    });

    
    ////// ID 중복 확인 버튼 ////// 
    idCheckButton.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const groupID = document.getElementById('groupID').value;
        console.log(groupID);
        allowID.style.display = 'none'

        const functionType = 4;
        
        if (groupID) {
            if (groupID != response.resources[0]['groupID']) {
                try {
                    const response = await fetch('/ChangeNormalData', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ functionType: functionType, userToken: userToken, userPermission: userPermission, groupToken: groupToken, groupID : groupID })
                    });
        
                    data = await response.json();
        
                    if (data.result == 0) {  // 사용 가능한 ID
                        idCheck = true;
                        allowID.style.display = 'block';
                        alert('사용가능한 ID입니다!')
                    } else if (data.result == 1) {
                        alert('이미 사용중인 ID입니다! \n다른 ID를 이용해주세요!')
                    } else {
                        alert('관리자에게 문의해주세요')
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            } else {
                document.getElementById('groupID').value = response.resources[0]['groupID'];
                alert('새로운 ID를 작성해주세요!')
            }
            
        } else {  // 빈칸으로 제출한 경우
            document.getElementById('groupID').value = response.resources[0]['groupID'];
            alert('원하는 ID를 작성해주세요!');
        }
        
    });


    ////// ID 변경 버튼 ////// 
    groupIDBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const groupID = document.getElementById('groupID').value;
        const functionType = 2;

        if (idCheck == true) {
            try {
                const response = await fetch('/ChangeNormalData', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ functionType: functionType, userToken: userToken, userPermission: userPermission, groupToken: groupToken, setKey : "groupID", setValue : groupID })
                });
    
                data = await response.json();
    
                if (data.result == 1) { 
                    alert('ID가 성공적으로 수정되었습니다!');
                    location.reload(true);
                } else if (data.result == 0) {
                    alert('다시 시도해주세요!');
                } else {
                    alert('관리자에게 문의해주세요')
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            alert('ID 중복 체크를 해주세요!');
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
    groupPWBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const PW1 = document.getElementById('PW1').value;
        const PW2 = document.getElementById('PW2').value;

        const functionType = 2;

        if (PW2) {
            if (PW1 == PW2) {
                try {
                    const response = await fetch('/ChangeNormalData', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ functionType: functionType, userToken: userToken, userPermission: userPermission, groupToken: groupToken, setKey : "groupPW", setValue : PW1 })
                    });
        
                    data = await response.json();
        
                    if (data.result == 0) {  
                        alert('다시 시도해주세요!')
                    } else if (data.result == 1)  {
                        alert('userPW이 성공적으로 수정되었습니다!')
                        location.reload(true);
                    } else {
                        alert('관리자에게 문의해주세요')
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





    /////////////////////////////////// 개인소개 변경 ///////////////////////////////////
    ////// 조직 소개 글자수 제한 ////// 
    const textarea = document.getElementById('groupIntro');

    textarea.addEventListener('input', function() {
        if (this.value.length > 50) {
            alert('50자까지만 입력할 수 있습니다.');
            this.value = this.value.substring(0, 50);
        }
    });
    
    ////// 조직 소개 버튼 ////// 
    groupIntroBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const groupIntro = document.getElementById('groupIntro').value;
        const functionType = 2;
        
        if ( groupIntro != response.resources[0]['groupIntro'] ){
            try {
                const response = await fetch('/ChangeNormalData', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ functionType: functionType, userToken: userToken, userPermission: userPermission, groupToken: groupToken, setKey : "groupIntro", setValue : groupIntro })
                });
    
                data = await response.json();
    
                if (data.result == 0) {
                    alert('다시 시도해주세요!')
                } else if (data.result == 1)  {
                    alert('조직소개가 성공적으로 수정되었습니다!')
                    location.reload(true);
                } else {
                    alert('관리자에게 문의해주세요')
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            alert('새로운 조직소개를 작성해주세요!')
        }
        
    });


    /////////////////////////////////// 조직 계좌 작성 ///////////////////////////////////
    ////// 조직 계좌 숫자로 제한 //////
    const groupBankAccountNumber = document.getElementById('groupBankAccountNumber');
    groupBankAccountNumber.addEventListener('input', async function(e) {
        e.preventDefault();

        const numFilter = /^[0-9]*$/;

        if (!numFilter.test(groupBankAccountNumber.value)) {
            document.getElementById('groupBankAccountNumber').value = ''
            alert('계좌번호의 숫자만 작성해주세요!');
        }
    
    });
    ////// 조직 계좌 버튼 ////// 
    groupAccountBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const groupBankAccountName = document.getElementById('groupBankAccountName').value;
        const groupBankAccountNumber = document.getElementById('groupBankAccountNumber').value;

        const functionType = 2;

        if (groupBankAccountName == 'empty' ) {
            alert('계좌의 은행을 선택해주세요!');
        } else if (groupBankAccountNumber) {
            try {
                const nameresponse = await fetch('/ChangeNormalData', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ functionType: functionType, userToken: userToken, userPermission: userPermission, groupToken: groupToken, setKey : "groupBankAccountName", setValue : groupBankAccountName })
                });
    
                namedata = await nameresponse.json();

                const numresponse = await fetch('/ChangeNormalData', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ functionType: functionType, userToken: userToken, userPermission: userPermission, groupToken: groupToken, setKey : "groupBankAccountNumber", setValue : groupBankAccountNumber })
                });
    
                numdata = await numresponse.json();
    
                if (namedata.result == 1 && numdata.result == 1) {
                    alert('조직 계좌가 성공적으로 등록되었습니다!');
                    location.reload(true);
                } else if (namedata.result == 0) {
                    alert('은행명 등록에 실패했습니다!');
                } else if (numdata.result == 0) {
                    alert('계좌번호 등록에 실패했습니다!');
                } else {
                    alert('관리자에게 문의해주세요')
                }

            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            alert('계좌번호를 작성해주세요!')
        }
        
    });



    /////////////////////////////////// 조직 삭제 ///////////////////////////////////
    ////// 조직 삭제 버튼 //////
    deleteGroupBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        if (confirm('소속된 회원이 있다면 조직을 삭제하실 수 없습니다. \n정말로 삭제하시겠습니까?')) {
            try {
                const response = await fetch('/DeleteGroup', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ userToken: userToken,  groupToken: groupToken ,userPermission : userPermission})
                });
    
                data = await response.json();
    
                if (data.result == 0) {
                    //alert(`조직의 회원이 남아있다면 조직 삭제가 불가능합니다!\n\n 남아있는 회원 : ${data.resources['userName']} `);
                    alert(`조직의 회원이 남아있다면 조직 삭제가 불가능합니다!\n\n 남아있는 회원 : 데이터 수신 `);
                } else if (data.result == 1) {
                    alert('조직이 삭제 되었습니다! 그동안 이용해주셔서 감사합니다.')
                    window.location.href = '/PrivatePage/PrivatePage.html';
                } else {
                    alert('관리자에게 문의해주세요')
                }
            } catch (error) {
                console.error('Error:', error);
            }

        }
    });
});




