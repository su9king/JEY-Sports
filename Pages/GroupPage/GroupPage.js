window.onload = async function() {
    const page = 'GroupPage';
    const userToken = sessionStorage.getItem('userToken');
    const groupToken = sessionStorage.getItem('groupToken');
    const data = `userToken=${userToken}&groupToken=${groupToken}`

    const resources = await certification(page, data);

    if (resources.result == 0) {
        alert('로그인 후 사용해주세요!');
        window.location.href = '/WarningPage.html';
    } else {
        document.getElementById('groupName').textContent = `${resources.resources[0]["groupName"]}에 오신 것을 환영합니다!`
        // document.getElementById('groupImage').src = 'JEY_text_icon.jpg';
        document.getElementById('groupImage').src = `/GroupImages/${resources.resources[0]["groupImage"]}.png`;  ///////////////////////이미지 불러오기
        console.log('회원 인증 성공');
    }
}