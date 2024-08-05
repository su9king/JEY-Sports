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

    
    const noticeLoadBtn = document.getElementById('noticeLoadBtn');
    const noticeAddBtn = document.getElementById('noticeAddBtn');
    const noticeDeleteBtn = document.getElementById('noticeDeleteBtn');
    const noticeFixBtn = document.getElementById('noticeFixBtn');


    noticeLoadBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const functionType = 1;

        try {
            const response = await fetch('/EditGroupNotices', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, userToken: userToken })
            });

            data = await response.json();

            if (data.result == 0) {
                alert('다시 시도해주세요!')
            } else {
                alert('공지사항을 불러왔습니다!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
    
    noticeAddBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const functionType = 2;

        try {
            const response = await fetch('/EditGroupNotices', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, userToken: userToken })
            });

            data = await response.json();

            if (data.result == 0) {
                alert('다시 시도해주세요!')
            } else {
                alert('공지사항을 추가했습니다!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    noticeDeleteBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const functionType = 3;

        try {
            const response = await fetch('/EditGroupNotices', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, userToken: userToken })
            });

            data = await response.json();

            if (data.result == 0) {
                alert('다시 시도해주세요!')
            } else {
                alert('공지사항을 삭제했습니다!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    noticeFixBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const functionType = 4;

        try {
            const response = await fetch('/EditGroupNotices', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, userToken: userToken })
            });

            data = await response.json();

            if (data.result == 0) {
                alert('다시 시도해주세요!')
            } else {
                alert('공지사항을 수정했습니다!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
