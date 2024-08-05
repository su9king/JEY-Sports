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

    

    const changePermissionBtn = document.getElementById('changePermissionBtn');
    const deleteUserBtn = document.getElementById('deleteUserBtn');
    const allowUserBtn = document.getElementById('allowUserBtn');
    const inviteUserBtn = document.getElementById('inviteUserBtn');
    const addUserBtn = document.getElementById('addUserBtn');

    changePermissionBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const functionType = document.getElementById('changePermission').value;

        try {
            const response = await fetch('/EditGroupMembers', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, userToken: userToken })
            });

            data = await response.json();

            if (data.result == 0) {
                alert('다시 시도해주세요!')
            } else {
                alert('회원을 강제로 퇴장시켰습니다!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    deleteUserBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const functionType = 1;

        try {
            const response = await fetch('/EditGroupMembers', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, userToken: userToken })
            });

            data = await response.json();

            if (data.result == 0) {
                alert('다시 시도해주세요!')
            } else {
                alert('회원을 강제로 퇴장시켰습니다!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    allowUserBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const functionType = 2;

        try {
            const response = await fetch('/EditGroupMembers', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, userToken: userToken })
            });

            data = await response.json();

            if (data.result == 0) {
                alert('다시 시도해주세요!')
            } else {
                alert('회원의 가입을 수용했습니다!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    inviteUserBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const functionType = 3;

        try {
            const response = await fetch('/EditGroupMembers', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, userToken: userToken })
            });

            data = await response.json();

            if (data.result == 0) {
                alert('다시 시도해주세요!')
            } else {
                alert('회원을 초대했습니다!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    addUserBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const functionType = 4;

        try {
            const response = await fetch('/EditGroupMembers', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, userToken: userToken })
            });

            data = await response.json();

            if (data.result == 0) {
                alert('다시 시도해주세요!')
            } else {
                alert('회원을 멤버로 추가했습니다!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });




});
