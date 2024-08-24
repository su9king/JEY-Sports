let myData = null;        // 내 출석 데이터
let members = [];         // 멤버 출석 데이터
let notuserMembers = [];  // 비유저 출석 데이터
let userToken, groupToken, userPermission, noticeToken;
previousPage = new URLSearchParams(window.location.search).get('previousPage');

window.onload = async function () {
    const page = 'DetailNoticeDuesPage';
    userToken = sessionStorage.getItem('userToken');
    groupToken = sessionStorage.getItem('groupToken');
    userPermission = sessionStorage.getItem('userPermission');

    noticeToken = new URLSearchParams(window.location.search).get('noticeToken');

    const data = `userToken=${userToken}&groupToken=${groupToken}&userPermission=${userPermission}&noticeToken=${noticeToken}`;

    const response = await certification(page, data);
    console.log(response.resources);


    loadSidebar(page, userPermission, response);
    loadMenubar(sessionStorage.getItem('groupName'));


    myData = response.resources[1][0];      // 내 회비 납부 데이터
    members = response.resources[2];        // 멤버 회비 데이터
    notuserMembers = response.resources[3]; // 비유저 회비 데이터
    
    displayAnnouncement(response.resources[0][0]);
    displayMyData(response.resources[0][0]);  // 내 회비 납부 데이터 표시
    displayMembers();  // 멤버 및 비유저 멤버 표시
    createAdminContainer(userPermission); // 수정 버튼, 출석 코드 생성

    // 검색 기능 설정
    setupSearchInput();
}


function displayAnnouncement(announcement) {

    const duesStatusText = myData.duesStatus == true ? '납부 완료' : '아직!!!!';

    document.getElementById('noticeTitle').innerText = `공지사항 제목: ${announcement.noticeTitle}`;
    document.getElementById('scheduleImportance').innerText = `중요도: ${announcement.noticeImportance}`;
    document.getElementById('noticeEditDate').innerText = `마지막 수정일: ${announcement.noticeEditDate}`;
    document.getElementById('noticeEndDate').innerText = `기한 날짜: ${announcement.noticeEndDate}`;
    document.getElementById('noticeStatus').innerText = `상태: ${announcement.noticeStatus}`;
    document.getElementById('duesStatus').innerText = `내 회비 납부 상태: ${duesStatusText}`;
    document.getElementById('noticeDues').innerText = `회비 금액: ${announcement.noticeDues}원`;
    document.getElementById('noticeContent').innerText = `세부 공지사항 내용: ${announcement.noticeContent}`;
    document.getElementById('noticeWriter').innerText = `작성자: ${announcement.noticeWriter}`;

}



// 나의 회비 납부 현황 표시
function displayMyData(announcement) {
    const myDataContainer = document.getElementById('my-data-container');
    if (myData) {
        const myTitle = document.createElement('h2');
        myTitle.textContent = '나의 회비 납부 현황';
        myDataContainer.appendChild(myTitle);
        const myBox = createMemberBox(myData, true, false);
        myDataContainer.appendChild(myBox);
    } else {
        myDataContainer.innerHTML = '<h2>나의 회비 납부 현황</h2><p>회비 납부 정보가 없습니다.</p>';
    }


    if (myData.duesStatus == false) {
        const payButton = document.createElement("button");
        payButton.classList.add("pay-button");
        payButton.textContent = "납부하기";

        // 납부하기 버튼 클릭 이벤트
        payButton.addEventListener("click", function() {
            dues(userToken, groupToken, userPermission, noticeToken, announcement.noticeDues);
        });

        myDataContainer.appendChild(payButton);
    }
}

// 멤버들 및 비유저 멤버 표시
function displayMembers(filteredMembers = null) {
    const userMemberContainer = document.getElementById("user-member-container");
    userMemberContainer.innerHTML = '';

    // 통합된 멤버 목록
    const allMembers = [...members, ...notuserMembers];
    const displayList = filteredMembers || allMembers;

    // 멤버들 섹션
    const userMembers = displayList.filter(member => member.userID);
    if (userMembers.length > 0) {
        const userTitle = document.createElement('h2');
        userTitle.textContent = '멤버들';
        userMemberContainer.appendChild(userTitle);
        userMembers.forEach(member => {
            if (member.userToken !== userToken) {
                const memberBox = createMemberBox(member, false, false);
                userMemberContainer.appendChild(memberBox);
            }
        });
    }

    // 비유저 멤버들 섹션
    const notUserMembers = displayList.filter(member => member.notUserToken);
    if (notUserMembers.length > 0) {
        const notUserTitle = document.createElement('h2');
        notUserTitle.textContent = '비유저 멤버들';
        userMemberContainer.appendChild(notUserTitle);
        notUserMembers.forEach(member => {
            const memberBox = createMemberBox(member, false, true);
            userMemberContainer.appendChild(memberBox);
        });
    }
}

// 검색 기능 설정
function setupSearchInput() {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        const filteredMembers = [...members, ...notuserMembers].filter(member =>
            member.userName.toLowerCase().includes(value)
        );
        displayMembers(filteredMembers); // 필터링된 결과 다시 표시
    });
}

function createMemberBox(member, isMyStatus = false, isNotUser = false) {
    const memberBox = document.createElement("div");
    memberBox.classList.add("memberBox");

    // 프로필 사진
    const memberImage = document.createElement("img");
    memberImage.src = isNotUser ? `/UserImages/NULL.jpg` : (member.userImage ? `/UserImages/${member.userImage}` : `/UserImages/NULL.jpg`);
    memberImage.alt = `${member.userName}의 프로필 사진`;
    memberImage.classList.add("member-image");

    // 회원 정보
    const memberInfo = document.createElement("div");
    memberInfo.classList.add("member-info");
    memberInfo.innerHTML = `
        <h2 class="member-name">${member.userName}</h2>
    `;

    // 회비 납부 상태 표시
    const duesStatusContainer = document.createElement("div");
    duesStatusContainer.classList.add("fee-status-container");

    const duesStatus = member.duesStatus; // 1: 납부 완료, 0: 미납, null: 정보 없음

    const statusText = duesStatus == 1 ? '납부 완료' : (duesStatus == 0 ? '미납' : '정보 없음');
    const statusColor = duesStatus == 1 ? '#4caf50' : (duesStatus == 0 ? '#f44336' : '#ccc');

    const statusButton = document.createElement("button");
    statusButton.textContent = statusText;
    statusButton.classList.add("status-button");
    statusButton.style.backgroundColor = statusColor;
    statusButton.disabled = !isMyStatus;  // 본인만 수정 가능

    duesStatusContainer.appendChild(statusButton);

    memberBox.appendChild(memberImage);
    memberBox.appendChild(memberInfo);
    memberBox.appendChild(duesStatusContainer);

    return memberBox;
}



async function createAdminContainer(userPermission) {
    if (userPermission == 1 || userPermission == 2) {
        
        ///////////////// 수정하기 버튼 생성
        const editButtonContainer = document.getElementById('edit-button-container');
        editButtonContainer.innerHTML = '';
        const editButton = document.createElement('button');
        editButton.textContent = '수정하기';
        editButton.id = 'edit-button';
        editButtonContainer.appendChild(editButton);
        editButton.addEventListener('click', () => {
            window.location.href = `/GroupNoticePage/EditNoticeDuesPage.html?noticeToken=${noticeToken}&previousPage=${previousPage}`;
        });
    }
}
