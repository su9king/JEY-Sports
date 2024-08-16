let notices = [];
let currentPage = 1;
const noticesPerPage = 10;

//////////////////// Step0 : 회원인증, 사이드바 ///////////////////
window.onload = async function() {
    const page = 'ScheduleAttendancePage';
    userToken = sessionStorage.getItem('userToken');
    groupToken = sessionStorage.getItem('groupToken');
    userPermission = sessionStorage.getItem('userPermission');
    const data = `userToken=${userToken}&groupToken=${groupToken}&userPermission=${userPermission}`;
    
    const response = await certification(page, data);
    
    if (response.result == 0) {
        alert('로그인 후 사용해주세요!');
        window.location.href = '/WarningPage.html';
    } else {
        loadSidebar(page, userPermission, response);

        if (response.resources !== null) {
            notices = response.resources.map(resource => ({
                scheduleToken: resource.scheduleToken,
                scheduleTitle: resource.scheduleTitle,
                scheduleStartDate: resource.scheduleStartDate,
                scheduleEndDate: resource.scheduleEndDate,
                scheudleImportance: resource.scheudleImportance,
                scheduleAlert: resource.scheduleAlert,
                scheduleStatus: resource.scheduleStatus,
            }));
            createNoticeElements();
            displayNotices();
        }
        
        addCreateNoticeButton(userPermission);
    }   

    // 뒤로가기 이벤트 리스너 등록
    document.getElementById('backButton').addEventListener('click', function() {
        window.history.back();
    });

    // 검색 기능 이벤트 리스너 등록
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        filterNotices(value);
    });

    // 페이지네이션 이벤트 리스너 등록
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayNotices();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        const totalPages = Math.ceil(notices.length / noticesPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayNotices();
        }
    });
}

// 공지사항 요소 생성 함수
function createNoticeElements() {
    const noticeContainer = document.getElementById("notice-container");

    notices.forEach(notice => {
        // // 비공개 공지사항은 관리자, 창설자만 가능
        // if (notice.noticeStatus == false && (userPermission == 0 || userPermission == 3 || userPermission == 4)) {
        //     return;
        // }

        // 게시글 박스 생성
        const noticeBox = document.createElement("div");
        noticeBox.classList.add("noticeBox");

        // 게시글 제목 생성
        const noticeTitle = document.createElement("h2");
        noticeTitle.classList.add("notice-title");
        noticeTitle.innerHTML = `
        [${notice.scheduleStartDate} ~ ${notice.scheduleEndDate}] ${notice.scheduleTitle}
        `

        // 중요도에 따른 제목 색상 설정
        if (notice.scheudleImportance == true) {
            noticeTitle.style.color = 'red';
        }

        //// 게시글 정보 생성
        const noticeInfo = document.createElement("div");
        noticeInfo.classList.add("notice-info");

        const importanceText = notice.scheudleImportance == true ? '중요' : '일반';
        const alertText = notice.scheduleAlert == true ? '알림예정' : '알림없음';
        var statusText;
        if (notice.scheduleStatus === true) {
            statusText = '완료됨';
        } else if (notice.scheduleStatus === false) {
            statusText = '취소됨';
        } else {
            statusText = '대기중';
        }


        noticeInfo.innerHTML = `
        진행 상태: ${statusText} | 중요도: ${importanceText} | 알람: ${alertText}
        `;

        
        // 제목 클릭시 작동 - 게시글 형성
        noticeTitle.addEventListener("click", async function() {
            window.location.href = `DetailScheduleAttendancePage.html?scheduleToken=${notice.scheduleToken}&scheduleTitle=${notice.scheduleTitle}&scheduleStartDate=${notice.scheduleStartDate}&scheduleEndDate=${notice.scheduleEndDate}&scheduleImportance=${notice.scheduleImportance}&scheduleAlert=${notice.scheduleAlert}&scheduleStatus=${notice.scheduleStatus}`;
        });

        noticeBox.appendChild(noticeTitle);
        noticeBox.appendChild(noticeInfo);

        // 필터링된 요소들을 저장
        notice.element = noticeBox;

        // 모든 공지사항을 컨테이너에 추가
        noticeContainer.appendChild(noticeBox);
    });
}

// 공지사항 필터링 함수
function filterNotices(value) {
    // 모든 공지사항을 숨기고, 필터링된 결과만 표시
    notices.forEach(notice => {
        if (notice.element instanceof Node) {  
            if (notice.noticeTitle.toLowerCase().includes(value)) {  /////////////// 여기에서 필터링 대상 추가 가능
                notice.element.classList.remove("hide");
            } else {
                notice.element.classList.add("hide");
            }
        }
    });

    // 현재 페이지 리셋
    currentPage = 1;

    // 필터링된 결과를 기반으로 게시글 생성
    displayFilteredNotices(value);
}

// 필터링된 공지사항 생성 함수
function displayFilteredNotices(filterValue) {
    const noticeContainer = document.getElementById("notice-container");
    noticeContainer.innerHTML = '';

    // 필터링된 결과에서 페이지 범위 계산
    const filteredNotices = notices.filter(notice => 
        notice.noticeTitle.toLowerCase().includes(filterValue)
    );

    const start = (currentPage - 1) * noticesPerPage;
    const end = start + noticesPerPage;
    const paginatedNotices = filteredNotices.slice(start, end);

    paginatedNotices.forEach(notice => {
        if (notice.element instanceof Node) {  
            noticeContainer.appendChild(notice.element);
        }
    });

    // 페이지네이션 업데이트
    updatePaginationControls(filteredNotices.length);
}

// 공지사항 생성 함수
function displayNotices() {
    const noticeContainer = document.getElementById("notice-container");
    noticeContainer.innerHTML = '';

    // 계산 페이지 범위
    const start = (currentPage - 1) * noticesPerPage;
    const end = start + noticesPerPage;
    const paginatedNotices = notices.slice(start, end);

    paginatedNotices.forEach(notice => {
        if (notice.element instanceof Node) {  
            noticeContainer.appendChild(notice.element);
        }
    });

    // 페이지 업데이트
    updatePaginationControls(notices.length);
}

// 공지사항 추가 버튼 생성(권한 제한을 위해 함수화)
function addCreateNoticeButton(userPermission) {
    if (userPermission == 2 || userPermission == 1 || userPermission == 0) {
        const createButtonContainer = document.createElement("div");
        createButtonContainer.classList.add("create-button-container");

        const createButton = document.createElement("button");
        createButton.textContent = "전체 출석 확인하기";
        createButton.classList.add("create-button");
        createButton.addEventListener("click", function() {
            window.location.href = '/TotalAttentionPage/TotalAttentionPage.html';
        });

        createButtonContainer.appendChild(createButton);

        document.body.insertBefore(createButtonContainer, document.body.firstChild);
    }
}

// 페이지네이션 컨트롤 업데이트
function updatePaginationControls(totalNotices = notices.length) {
    const totalPages = Math.ceil(totalNotices / noticesPerPage);
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;

    document.getElementById('prevPage').disabled = (currentPage === 1);
    document.getElementById('nextPage').disabled = (currentPage === totalPages || totalPages === 0);
}
