//////////////// 사이드바 호출 함수 ////////////////
function loadMenubar(groupName) {
    // 사용 조건: 사용할 HTML 파일에 <div id="navbar"></div>가 존재
    console.log('loadMenubar')
    fetch('/MenuBar/MenuBar.html')
    .then(response => {
        if (!response.ok) {
            throw new Error('네트워크 응답 X');
        }
        return response.text();
    })
    .then(data => {
        document.getElementById('menubar').innerHTML = data;
        document.getElementById('goToGroupMain').innerHTML = `${sessionStorage.getItem('groupName')}`;
        document.getElementById('backButton').addEventListener('click', function() {
            window.location.href = previousPage;
        });

        // 로고 이미지 요소 설정 및 클릭 이벤트 추가
        const logo = document.getElementById('mainButtonImage');
        logo.src = '/Icon.png';
        logo.addEventListener('click', function() {
            window.location.href = '/MainPage.html';
        });
    })
    .catch(error => {
        console.error('문제가 발생했습니다:', error);
    });
}
