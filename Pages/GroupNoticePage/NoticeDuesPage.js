let notices = [];
let currentPage = 1;
const noticesPerPage = 10;
let userToken, groupToken, userPermission

//////////////////// Step0 : 회원인증, 사이드바 ///////////////////
window.onload = async function() {
    const page = 'NoticeDuesPage';
    userToken = sessionStorage.getItem('userToken');
    groupToken = sessionStorage.getItem('groupToken');
    userPermission = sessionStorage.getItem('userPermission');
    const data = `userToken=${userToken}&groupToken=${groupToken}&userPermission=${userPermission}`;
    
    const response = await certification(page, data);
    
    loadSidebar(page, userPermission, response);
    loadMenubar(sessionStorage.getItem('groupName'));

    if (response.resources.length !== 0) {
        notices = response.resources.map(resource => ({
            noticeType: resource.noticeType,
            noticeToken: resource.noticeToken,
            noticeTitle: resource.noticeTitle,
            noticeEditDate: resource.noticeEditDate,
            noticeEndDate: resource.noticeEndDate,
            noticeImportance: resource.noticeImportance,
            noticeStatus: resource.noticeStatus,
            duesStatus: resource.duesStatus,
            noticeDues: resource.noticeDues,
        }));
        createNoticeElements();
        displayNotices();
    } else {
        noNotice();
    }
    
    addCreateNoticeButton(userPermission);

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
        // 비공개 공지사항은 관리자, 창설자만 가능
        if (notice.noticeStatus == false && (userPermission == 0 || userPermission == 3 || userPermission == 4)) {
            return;
        }

        // noticeType == 2번 회비 공지사항만 노출
        if (notice.noticeType != 2) {
            return;
        }

        // 게시글 박스 생성
        const noticeBox = document.createElement("div");
        noticeBox.classList.add("noticeBox");

        // 게시글 제목 생성
        const noticeTitle = document.createElement("h2");
        noticeTitle.classList.add("notice-title");
        noticeTitle.innerHTML = `${notice.noticeTitle}        `

        // 중요도에 따른 제목 색상 설정
        if (notice.noticeImportance == true) {
            noticeTitle.style.color = 'red';
        }

        //// 게시글 정보 생성
        const noticeInfo = document.createElement("div");
        noticeInfo.classList.add("notice-info");

        const noticeStatusText = notice.noticeStatus == true ? '공개' : '비공개';
        const importanceText = notice.noticeImportance == true ? '중요' : '일반';
        var typeText;
        if (notice.noticeType == 2) {
            typeText = '멤버 회비 공지사항';
        } else if (notice.noticeType === 3) {
            typeText = '회비 훈지 공지사항';
        } else if (notice.noticeType === 4) {
            typeText = '회비 지출 공지사항';
        }


        noticeInfo.innerHTML = `
        공지 유형: ${typeText} <br>
        마지막 수정일: ${notice.noticeEditDate} | 공지사항 종료일: ${notice.noticeEndDate} | 중요도: ${importanceText} | 공개: ${noticeStatusText}
        `;


        //// 납부하기 버튼 생성
        if (notice.duesStatus == 0) {
            const payBtn = document.createElement("button");
            payBtn.classList.add("pay-button");
            payBtn.textContent = "납부하기";
            payBtn.addEventListener("click", async function () {
                dues(userToken, groupToken, userPermission, notice.noticeToken, notice.noticeDues);
            })

            noticeBox.appendChild(payBtn);
        }

        
        // 제목 클릭시 작동 - 게시글 형성
        noticeTitle.addEventListener("click", async function() {
            window.location.href = `DetailNoticeDuesPage.html?noticeToken=${notice.noticeToken}`;
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

function addCreateNoticeButton(userPermission) {
    const buttonContainer = document.getElementById("button-container");

    // 공지사항 작성하기 버튼 생성
    if (userPermission == 2 || userPermission == 1) {
        const createNoticeButton = document.createElement("button");
        createNoticeButton.textContent = "공지사항 작성하기";
        createNoticeButton.classList.add("create-button");
        createNoticeButton.addEventListener("click", function() {
            window.location.href = 'CreateGroupNoticePage.html';
        });

        buttonContainer.appendChild(createNoticeButton);
    }

    // 전체 회비 납부 내역 보기 버튼 생성
    const detailDuesButton = document.createElement("button");
    detailDuesButton.textContent = "전체 회비 납부 내역 보기";
    detailDuesButton.classList.add("create-button");
    detailDuesButton.addEventListener("click", function() {
        window.location.href = '/TotalDuesPage/TotalDuesPage.html';
    });

    buttonContainer.appendChild(detailDuesButton);
}


// 페이지네이션 컨트롤 업데이트
function updatePaginationControls(totalNotices = notices.length) {
    const totalPages = Math.ceil(totalNotices / noticesPerPage);
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;

    document.getElementById('prevPage').disabled = (currentPage === 1);
    document.getElementById('nextPage').disabled = (currentPage === totalPages || totalPages === 0);
}


// 공지사항이 하나도 없는 경우
function noNotice() {
    const noticeContainer = document.getElementById("notice-container");
    
    const noNoticeBox = document.createElement("div");
    noNoticeBox.classList.add("noticeBox");

    // 게시글 제목 생성
    const noNoticeTitle = document.createElement("h2");
    noNoticeTitle.classList.add("notice-title");
    noNoticeTitle.textContent = '작성된 회비 공지사항이 없습니다!!';

    noNoticeBox.appendChild(noNoticeTitle)
    noticeContainer.appendChild(noNoticeBox)
}