let members = [];
let notuserMembers = [];
let userToken, groupToken, userPermission, scheduleToken, scheduleAttendanceCode;
let myData = null;  // 나의 출석 상황 데이터를 저장할 변수

window.onload = async function () {
    const page = 'DetailScheduleAttendancePage';
    userToken = sessionStorage.getItem('userToken');
    groupToken = sessionStorage.getItem('groupToken');
    userPermission = sessionStorage.getItem('userPermission');

    const urlParams = new URLSearchParams(window.location.search);
    scheduleToken = urlParams.get('scheduleToken');
    scheduleTitle = urlParams.get('scheduleTitle');
    scheduleStartDate = urlParams.get('scheduleStartDate');
    scheduleEndDate = urlParams.get('scheduleEndDate');
    scheudleImportance = urlParams.get('scheudleImportance') == true ? '중요' : '일반';
    scheduleAlert = urlParams.get('scheduleAlert') == true ? '알람 예정' : '없음';
    scheduleStatus = urlParams.get('scheduleStatus') == true ? '공개' : '비공개';

    const data = `userToken=${userToken}&groupToken=${groupToken}&userPermission=${userPermission}&scheduleToken=${scheduleToken}`;

    const response = await certification(page, data);
    console.log(response.resources)

    if (response.result == 0) {
        alert('로그인 후 사용해주세요!');
        window.location.href = '/WarningPage.html';
    } else {
        loadSidebar(page, userPermission, response);

        scheduleAttendanceCode = response.resources[0][0].scheduleAttendanceCode;
        myData = response.resources[1][0];  // 내 출석 데이터
        members = response.resources[2];          // 멤버 출석 데이터
        notuserMembers = response.resources[3] ? response.resources[3] : '';   // 비유저 출석 데이터

        if (response.resources[0][0] != null) {displayAnnouncement(response.resources[0][0]);} // 공지사항 표시
        displayMyData();  // 내 출석 데이터 표시
        displayMembers();// 멤버 및 비유저 멤버 표시
        createAdminContainer(userPermission); // 수정 버튼, 출석 코드 생성
    }

    // 뒤로가기 버튼
    document.getElementById('backButton').addEventListener('click', function () {
        window.history.back();
    });

    // 검색 기능 설정
    setupSearchInput();
}

// 공지사항 표시 함수
function displayAnnouncement(announcement) {
    const announcementContainer = document.getElementById("announcement-container");

    announcementContainer.innerHTML = `
        <h2>${scheduleTitle}</h2>
        <p><strong>일정 날짜:</strong> ${scheduleStartDate} ~ ${scheduleEndDate}</p>
        <p><strong>중요도:</strong> ${scheudleImportance}</p>
        <p><strong>알람:</strong> ${scheduleAlert}</p>
        <p><strong>공개 상태:</strong> ${scheduleStatus}</p>
        <p><strong>일정 내용:</strong> ${announcement.scheduleContent}</p>
        <p><strong>장소:</strong> ${announcement.scheduleLocation}</p>
    `;
}


// 내 출석 현황 표시
function displayMyData() {
    const myDataContainer = document.getElementById('my-data-container');
    if (myData) {
        const myTitle = document.createElement('h2');
        myTitle.textContent = '나의 출석 현황';
        myDataContainer.appendChild(myTitle);
        const myBox = createMemberBox(myData, true, false);
        myDataContainer.appendChild(myBox);

    } else {
        myDataContainer.innerHTML = '<h2>나의 출석 현황</h2><p>출석 정보가 없습니다.</p>';
    }
}

// 권한 순서 정의
const permissionOrder = [2, 1, 0, 3, 4];

function getPermissionRank(permission) {
    return permissionOrder.indexOf(permission);
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

    // 출석 여부 확인 폼
    const attendanceStatusContainer = document.createElement("div");
    attendanceStatusContainer.classList.add("attendance-status-container");

    if (isMyStatus) {
        // 출석 상태 버튼들 생성 (본인 출석 상태일 때)
        const statusOptions = [
            { value: 1, text: '참석', color: '#4caf50' },
            { value: 0, text: '결석', color: '#f44336' },
            { value: null, text: '미확인', color: '#ccc' },
        ];

        const statusButtonsContainer = document.createElement("div");
        statusButtonsContainer.classList.add("status-buttons-container");

        statusOptions.forEach(option => {
            const statusButton = document.createElement("button");
            statusButton.textContent = option.text;
            statusButton.classList.add("status-button");

            if (member.attendanceStatus == option.value) {
                statusButton.style.backgroundColor = option.color;
                statusButton.style.transform = "translateY(-3px)";
            } else {
                statusButton.style.backgroundColor = "#e0e0e0";
            }

            // 클릭 이벤트 추가 (본인 출석 상태만 수정 가능)
            if (option.value !== null) {
                const functionType = option.value == 1 ? 1 : 2;
                statusButton.addEventListener("click", () => {
                    console.log(`${member.userName}의 출석 상태: ${option.value}`);
                    attend(functionType, userToken, groupToken, userPermission, scheduleToken);
                    displayMembers();
                });
            }

            statusButtonsContainer.appendChild(statusButton);
        });

        attendanceStatusContainer.appendChild(statusButtonsContainer);
    } else {
        // 출석 상태 표시 (본인이 아닐 때)
        const statusOptions = [
            { value: 1, text: '참석', color: '#4caf50' },
            { value: 0, text: '결석', color: '#f44336' },
            { value: null, text: '미확인', color: '#ccc' },
        ];

        const currentStatus = statusOptions.find(option => option.value === member.attendanceStatus);

        const statusButton = document.createElement("button");
        statusButton.textContent = currentStatus ? currentStatus.text : '미확인';
        statusButton.classList.add("status-button");
        statusButton.style.backgroundColor = currentStatus ? currentStatus.color : '#e0e0e0';
        statusButton.disabled = true;  // 클릭 불가능

        attendanceStatusContainer.appendChild(statusButton);
    }

    // 결석 사유 추가
    if (member.attendanceStatus == 0) {
        let absentReasonContainer = document.createElement("div");
        absentReasonContainer.classList.add("absent-reason-container");
        const absentReasonText = document.createElement("p");
        absentReasonText.textContent = member.absentReason ? `결석 사유: ${member.absentReason}` : `결석 사유: 나도 궁금한데?`;
        absentReasonText.classList.add("absent-reason");
        absentReasonContainer.appendChild(absentReasonText);

        attendanceStatusContainer.appendChild(absentReasonContainer);
    }

    document.body.appendChild(attendanceStatusContainer);


    memberBox.appendChild(memberImage);
    memberBox.appendChild(memberInfo);
    memberBox.appendChild(attendanceStatusContainer);

    return memberBox;
}


async function createAdminContainer(userPermission) {
    if (userPermission == 1 || userPermission == 2) {
        ///////////////// 출석 코드 생성 컨테이너 생성
        const scheduleCodeContainer = document.getElementById('code-container');
        scheduleCodeContainer.innerHTML = '';

        if (scheduleAttendanceCode == null) {
            const message = document.createElement('h2');
            message.textContent = "출석 코드를 생성해주세요!";
            scheduleCodeContainer.appendChild(message);
        } else {
            const message = document.createElement('h2');
            message.textContent = `오늘의 출석 코드 : ${scheduleAttendanceCode}`;
            scheduleCodeContainer.appendChild(message);
        }

        const codeInput = document.createElement('input');
        codeInput.type = 'text';
        codeInput.placeholder = '출석 코드를 입력하세요';
        codeInput.id = 'attendance-code-input';
        scheduleCodeContainer.appendChild(codeInput);

        const codeButton = document.createElement('button');
        codeButton.textContent = '출석 코드 제출';
        codeButton.id = 'attendance-code-button';
        scheduleCodeContainer.appendChild(codeButton);

    
        
        
        codeButton.addEventListener('click', async () => {
            scheduleAttendanceCode = document.getElementById('attendance-code-input').value;
            const datas = [{functionType : 3,scheduleAttendanceCode : scheduleAttendanceCode}]
            try {
                const response = await fetch('/EditAttendanceList', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userToken: userToken,
                        groupToken: groupToken,
                        userPermission: userPermission,
                        scheduleToken : scheduleToken,
                        datas : datas
                    })
                });

                const data = await response.json();

                if (data.result == 0) {
                    alert('다시 시도해주세요!');
                } else if (data.result == 1) {
                    alert('출석코드가 변경되었습니다!');
                    location.reload();
                } else {
                    alert('관리자에게 문의해주세요');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });

        ///////////////// 수정하기 버튼 생성
        const editButtonContainer = document.getElementById('edit-button-container');
        editButtonContainer.innerHTML = '';
        const editButton = document.createElement('button');
        editButton.textContent = '수정하기';
        editButton.id = 'edit-button';
        editButtonContainer.appendChild(editButton);
        editButton.addEventListener('click', () => {
            window.location.href = `/GroupSchedulePage/EditScheduleAttendancePage.html?scheduleToken=${scheduleToken}&scheduleTitle=${scheduleTitle}&scheduleStartDate=${scheduleStartDate}&scheduleEndDate=${scheduleEndDate}&scheudleImportance=${scheudleImportance}&scheduleAlert=${scheduleAlert}&scheduleStatus=${scheduleStatus}`;
        });
    }
}
