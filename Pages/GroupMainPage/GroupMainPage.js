window.onload = async function() {
    const page = 'GroupMainPage';
    const userToken = sessionStorage.getItem('userToken');
    const groupToken = sessionStorage.getItem('groupToken');
    const data = `userToken=${userToken}&groupToken=${groupToken}`

    const resources = await certification(page, data);

    if (resources.result == 0) {
        alert('로그인 후 사용해주세요!');
        window.location.href = '/WarningPage.html';
    } else {

        const userPermission = resources.userPermission;
        loadSidebar(page, userPermission, resources);


        document.getElementById('groupName').textContent = `${resources.resources[0]["groupName"]}에 오신 것을 환영합니다!`

        ///////////////////////이미지 불러오기
        const groupImage = resources.resources[0]["groupImage"];
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

//////////////////// 사이드바 열기 ////////////////////
function toggleSidebar() {
    document.body.classList.toggle('sidebar-open');
}