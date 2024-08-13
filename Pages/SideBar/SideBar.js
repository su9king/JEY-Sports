//////////////// 로그아웃 함수 ////////////////
async function logout() {  
    console.log('로그아웃 함수 실행');
    const userToken = sessionStorage.getItem('userToken');
    try {
        const response = await fetch('/Logout', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ userToken: userToken })
        });

        const dataBuffer =  await response.json();

        if (dataBuffer.result == 1) {
            sessionStorage.clear();
            alert("로그아웃 되었습니다!")
            window.location.href = '/LoginPage.html';
        } else if (data.result == 0)  {
            alert('로그아웃 실패!')
        } else {
            alert('관리자에게 문의해주세요')
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


//////////////// 사이드바 호출 함수 ////////////////
function loadSidebar(page, userPermission, response) {
    // 사용 조건: 사용할 HTML 파일에 <div id="navbar"></div>가 존재

    fetch('/SideBar/SideBar.html')
    .then(response => {
        if (!response.ok) {
            throw new Error('네트워크 응답 X');
        }
        return response.text();
    })
    .then(data => {
        document.getElementById('sidebar').innerHTML = data;
        sidebar_createButtons(page, userPermission, response);
    })
    .catch(error => {
        console.error('문제가 발생했습니다:', error);
    });
}

//////////////// 사이드바의 버튼 생성 함수 ////////////////
function sidebar_createButtons(page, userPermission, response) {
    const buttonContainer = document.getElementById('sidebar-button-container');
    buttonContainer.innerHTML = '';

    const userImage = sessionStorage.getItem('userImage');
    const sidebar_userImmageSample = document.getElementById('sidebar-userImageSample');
    sidebar_userImmageSample.src = userImage == 'null' ? `/UserImages/NULL.jpg` : `/UserImages/${userImage}`;

    // 기본 버튼 목록 생성
    const buttons = [
        { text: '로그아웃', onClick: () => logout() },
        { text: '마이페이지', onClick: () => window.location.href = '/PrivatePage/PrivatePage.html' },
        { text: '개인정보수정', onClick: () => window.location.href = '/EditDataPage/EditUserPage.html' },
    ];

    // GroupMainPage인 경우 추가 버튼 생성
    if (page !== 'PrivatePage' && page !== 'EditUserPage') {  
        buttons.push(
            { text: '멤버페이지', onClick: () => window.location.href = '/GroupMemberPage/GroupMemberPage.html' },
            { text: '일정', onClick: () => window.location.href = '/GroupSchedulePage/GroupSchedulePage.html' },
            { text: '공지사항', onClick: () => window.location.href = '/GroupNoticePage/GroupNoticePage.html' },
        );

        if (userPermission == 2) {  // 그룹 창시자인 경우 조직 정보 수정 가능
            buttons.push({ text: '조직정보수정', onClick: () => window.location.href = '../EditDataPage/EditGroupPage.html' });
        }
    }

    // 버튼들을 생성하고 컨테이너에 추가
    buttons.forEach(buttonData => {
        const button = document.createElement('button');
        button.textContent = buttonData.text;
        button.classList.add('sidebar-button'); // Add class for styling
        button.addEventListener('click', buttonData.onClick);
        buttonContainer.appendChild(button);
    });
}


function toggleSidebar() {
    document.body.classList.toggle('sidebar-open');
}