//////////////////// Step0 : 회원인증, 사이드바 ////////////////////
window.onload = async function() {
    const page = 'EditUserPage';
    const userToken = sessionStorage.getItem('userToken')
    const data = `userToken=${userToken}`
    
    const resources = await certification(page, data);
    

    if (resources.result == 0) {
        alert('로그인 후 사용해주세요!');
        window.location.href = '/WarningPage.html';
    } else {
        const userPermission = resources.userPermission;
        loadSidebar(page, userPermission);
        

    }
    

    
}


document.addEventListener('DOMContentLoaded', function() {
    const userToken = sessionStorage.getItem('userToken')

    

    const userNameBtn = document.getElementById('userNameBtn');
    const userPWBtn = document.getElementById('userPWBtn');
    const userImageBtn = document.getElementById('userImageBtn');
    const userEmailBtn = document.getElementById('userEmailBtn');
    const userIntroBtn = document.getElementById('userIntroBtn');
    const leaveJEYBtn = document.getElementById('leaveJEYBtn');

    userNameBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const userName = document.getElementById('userName').value;
        const functionType = 1;

        try {
            const response = await fetch('/ChangeNormalData', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, userToken: userToken, userName: userName })
            });

            data = await response.json();

            if (data.result == 0) {  // 사용 가능한 ID
                alert('다시 시도해주세요!')
            } else {
                alert('이름이 성공적으로 수정되었습니다!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    userPWBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const userPW = document.getElementById('userPW').value;
        const functionType = 1;

        try {
            const response = await fetch('/ChangeNormalData', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, userToken: userToken, userPW: userPW })
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
    });

    userImageBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const userImage = document.getElementById('userImage').value;
        const functionType = 1;

        try {
            const response = await fetch('/ChangeNormalData', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, userToken: userToken, userImage: userImage })
            });

            data = await response.json();

            if (data.result == 0) {
                alert('다시 시도해주세요!')
            } else {
                alert('userImage이 성공적으로 수정되었습니다!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    userEmailBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const userEmail = document.getElementById('userEmail').value;
        const functionType = 1;

        try {
            const response = await fetch('/ChangeNormalData', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, userToken: userToken, userEmail: userEmail })
            });

            data = await response.json();

            if (data.result == 0) {
                alert('다시 시도해주세요!')
            } else {
                alert('userEmail이 성공적으로 수정되었습니다!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    userIntroBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const userIntro = document.getElementById('userIntro').value;
        const functionType = 1;

        try {
            const response = await fetch('/ChangeNormalData', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, userToken: userToken, userIntro: userIntro })
            });

            data = await response.json();

            if (data.result == 0) {
                alert('다시 시도해주세요!')
            } else {
                alert('userIntro이 성공적으로 수정되었습니다!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    
    leaveJEYBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const functionType = 5;

        try {
            const response = await fetch('/ChangeNormalData', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, userToken: userToken })
            });

            data = await response.json();

            if (data.result == 0) {
                alert('가입된 조직이 있으면 탈퇴가 불가능합니다!')
            } else {
                alert('회원 탈퇴 되었습니다! 그동안 이용해주셔서 감사합니다.')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});




