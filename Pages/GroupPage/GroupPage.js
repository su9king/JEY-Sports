window.onload = async function() {
    const page = 'GroupPage';
    const data = {userToken: sessionStorage.getItem('userID'), groupToken: sessionStorage.getItem('groupToken')};

    const resources = await certification(page, data);

    if (resources.result == 0) {
        alert('로그인 후 사용해주세요!');
        window.location.href = '/WarningPage.html';
    } else {
        document.getElementById('groupName').textContent = `${resources.resources[0]["groupName"]}에 오신 것을 환영합니다!`
        // document.getElementById('groupImage').src = 'JEY_text_icon.jpg';
        document.getElementById('groupImage').src = `${resources.resources[0]["groupImage"]}`;  ///////////////////////이미지 불러오기
        console.log('회원 인증 성공');
    }
}