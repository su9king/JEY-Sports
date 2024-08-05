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

    
    const noticeSaveBtn = document.getElementById('noticeSaveBtn');

    noticeSaveBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const functionType = 5;

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
                alert('공지사항을 저장했습니다!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
    
    

});
