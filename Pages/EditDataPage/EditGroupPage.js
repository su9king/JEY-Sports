//////////////////// Step0 : 회원인증, 사이드바 ////////////////////
window.onload = async function() {
    const page = 'EditGroupPage';
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
    const groupToken = sessionStorage.getItem('groupToken')

    

    const groupNameBtn = document.getElementById('groupNameBtn');
    const groupPWBtn = document.getElementById('groupPWBtn');
    const groupImageBtn = document.getElementById('groupImageBtn');
    const groupIDBtn = document.getElementById('groupIDBtn');
    const groupIntroBtn = document.getElementById('groupIntroBtn');
    const groupAccountBtn = document.getElementById('groupAccountBtn');
    const deleteGroupBtn = document.getElementById('deleteGroupBtn');

    groupNameBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const groupName = document.getElementById('groupName').value;
        const functionType = 1;

        try {
            const response = await fetch('/ChangeNormalData', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, groupToken: groupToken, groupName: groupName })
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

    groupPWBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const groupPW = document.getElementById('groupPW').value;
        const functionType = 1;

        try {
            const response = await fetch('/ChangeNormalData', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, groupToken: groupToken, groupPW: groupPW })
            });

            data = await response.json();

            if (data.result == 0) {  
                alert('다시 시도해주세요!')
            } else {
                alert('groupPW이 성공적으로 수정되었습니다!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    groupImageBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const groupImage = document.getElementById('groupImage').value;
        const functionType = 1;

        try {
            const response = await fetch('/ChangeNormalData', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, groupToken: groupToken, groupImage: groupImage })
            });

            data = await response.json();

            if (data.result == 0) {
                alert('다시 시도해주세요!')
            } else {
                alert('groupImage이 성공적으로 수정되었습니다!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    groupIDBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const groupID = document.getElementById('groupID').value;
        const functionType = 1;

        try {
            const response = await fetch('/ChangeNormalData', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, groupToken: groupToken, groupID: groupID })
            });

            data = await response.json();

            if (data.result == 0) {
                alert('다시 시도해주세요!')
            } else {
                alert('groupID이 성공적으로 수정되었습니다!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    groupIntroBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const groupIntro = document.getElementById('groupIntro').value;
        const functionType = 1;

        try {
            const response = await fetch('/ChangeNormalData', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, groupToken: groupToken, groupIntro: groupIntro })
            });

            data = await response.json();

            if (data.result == 0) {
                alert('다시 시도해주세요!')
            } else {
                alert('groupIntro이 성공적으로 수정되었습니다!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    groupAccountBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const groupAccount = document.getElementById('groupAccount').value;
        const functionType = 1;

        try {
            const response = await fetch('/ChangeNormalData', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, groupToken: groupToken, groupAccount: groupAccount })
            });

            data = await response.json();

            if (data.result == 0) {
                alert('다시 시도해주세요!')
            } else {
                alert('groupAccount 성공적으로 수정되었습니다!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    deleteGroupBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const functionType = 5;

        try {
            const response = await fetch('/ChangeNormalData', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, groupToken: groupToken })
            });

            data = await response.json();

            if (data.result == 0) {
                alert('회원이 남아있으면 삭제가 불가능합니다!')
            } else {
                alert('그룹이 삭제 되었습니다! 그동안 이용해주셔서 감사합니다.')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});




