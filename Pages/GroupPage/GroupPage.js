window.onload = async function() {
    const page = 'GroupPage';
    const userToken = sessionStorage.getItem('userToken');
    const groupToken = sessionStorage.getItem('groupToken');
    const data = `userToken=${userToken}&groupToken=${groupToken}`

    const response = await certification(page, data);

    if (response.result == 0) {
        alert('로그인 후 사용해주세요!');
        window.location.href = '/WarningPage.html';
    } else {
        document.getElementById('groupName').textContent = `${response.resources[0]["groupName"]}에 오신 것을 환영합니다!`
        // document.getElementById('groupImage').src = 'JEY_text_icon.jpg';

        ///////////////////////이미지 불러오기
        const groupImage = response.resources[0]["groupImage"];
        if (groupImage == null){
            document.getElementById('groupImage').src = `/GroupImages/NULL.png`
        } else{
            document.getElementById('groupImage').src = `/GroupImages/${groupImage}`;  
        }
        
       
    }

    // 뒤로가기
    document.getElementById('backButton').addEventListener('click', function() {
        window.history.back();
    });
}

