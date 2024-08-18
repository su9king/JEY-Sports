let members = [];
let currentPage = 1;
const elementPerPage = 10;
let userToken, scheduleToken, scheduleAttendanceCode

//////////////////// Step0 : 회원인증, 사이드바 ///////////////////
window.onload = async function () {
    const page = 'DetailScheduleAttendancePage';
    userToken = sessionStorage.getItem('userToken');
    groupToken = sessionStorage.getItem('groupToken');
    userPermission = sessionStorage.getItem('userPermission');

    const urlParams = new URLSearchParams(window.location.search);
    scheduleToken = urlParams.get('scheduleToken');

    const data = `userToken=${userToken}&groupToken=${groupToken}&userPermission=${userPermission}&scheduleToken=${scheduleToken}`;

    const response = await certification(page, data);

    if (response.result == 0) {
        alert('로그인 후 사용해주세요!');
        window.location.href = '/WarningPage.html';
    } else {
        loadSidebar(page, userPermission, response);

        scheduleAttendanceCode = response.resources['0'];

        if (response.resources !== null) {
            members = response.resources[1].map(resource => ({
                userToken: resource.userToken,
                userID: resource.userID,
                userName: resource.userName,
                attendanceStatus: resource.attendanceStatus,
                absentReason: resource.absentReason,
                userImage: resource.userImage, 
                userPermission: resource.userPermission,
            }));

            console.log(members);
            displayMembers();
            createCodeContainer(userPermission);
        }
    }

    // 뒤로가기 이벤트 리스너 등록
    document.getElementById('backButton').addEventListener('click', function () {
        window.history.back();
    });

    // 검색 기능 이벤트 리스너 등록
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        filterMembers(value);
    });

    // 페이지네이션 이벤트 리스너 등록
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayMembers();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        const totalPages = Math.ceil(members.length / elementPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayMembers();
        }
    });
}

// 권한 순서 정의
const permissionOrder = [2, 1, 0, 3, 4];

function getPermissionRank(permission) {
    return permissionOrder.indexOf(permission);
}

// 검색된 멤버들만 표시하는 기능 추가
function displayMembers(filteredMembers = null) {
    const memberContainer = document.getElementById("member-container");
    memberContainer.innerHTML = '';

    // 타이틀 추가
    const myStatusTitle = document.createElement('h2');
    myStatusTitle.textContent = '나의 출석 상황';
    memberContainer.appendChild(myStatusTitle);

    // 표시할 멤버들 선택 (필터링된 멤버들 또는 전체 멤버)
    const displayList = filteredMembers || members;

    // "나의 출석상태" 추가
    const myMember = members.find(member => member.userToken == userToken);
    if (myMember) {
        const myMemberBox = createMemberBox(myMember, true);
        memberContainer.appendChild(myMemberBox);
    }

    // 멤버들 타이틀 추가
    const membersTitle = document.createElement('h2');
    membersTitle.textContent = '멤버들';
    memberContainer.appendChild(membersTitle);

    // 권한 순서와 userName 가나다 순으로 정렬
    displayList.sort((a, b) => {
        const rankComparison = getPermissionRank(a.userPermission) - getPermissionRank(b.userPermission);
        if (rankComparison !== 0) return rankComparison;
        return a.userName.localeCompare(b.userName);
    });

    // 현재 페이지에 해당하는 멤버만 보여주기
    const start = (currentPage - 1) * elementPerPage;
    const end = start + elementPerPage;
    const paginatedMembers = displayList.slice(start, end);

    paginatedMembers.forEach(member => {
        if (member.userToken !== userToken) { // "나의 출석상태" 제외
            const memberBox = createMemberBox(member);
            memberContainer.appendChild(memberBox);
        }
    });

    updatePaginationControls(displayList.length);
}

function createMemberBox(member, isMyStatus = false) {
    const memberBox = document.createElement("div");
    memberBox.classList.add("memberBox");

    // 프로필 사진
    const memberImage = document.createElement("img");
    memberImage.src = member.userImage ? `/UserImages/${member.userImage}` : `/UserImages/NULL.jpg`;
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

    const statusOptions = [
        { value: 1, text: '참석', color: '#4caf50' },
        { value: 0, text: '결석', color: '#f44336' },
        { value: null, text: '미확인', color: '#ccc' },
    ];

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

        // 본인 출석상태만 수정 가능
        if (option.value !== null && (isMyStatus || userPermission == 1 || userPermission == 2)) {

            const functionType = option.value == 1 ? 1 : 2;
            statusButton.addEventListener("click", () => {
                console.log(`${member.userName}의 출석 상태: ${option.value}`);
                attend(functionType, userToken, groupToken, userPermission, scheduleToken)
                displayMembers();
            });
        }

        attendanceStatusContainer.appendChild(statusButton);
    });

    // 결석 사유 추가
    if (member.attendanceStatus == 0 && member.absentReason) {
        const absentReasonText = document.createElement("p");
        absentReasonText.textContent = `결석 사유: ${member.absentReason}`;
        absentReasonText.classList.add("absent-reason");
        attendanceStatusContainer.appendChild(absentReasonText);
    }

    memberBox.appendChild(memberImage);
    memberBox.appendChild(memberInfo);
    memberBox.appendChild(attendanceStatusContainer);

    return memberBox;
}

///////////////////////////////// 검색기능 함수 /////////////////////////////////
function filterMembers(value) {
    const filteredMembers = members.filter(member =>
        member.userName.toLowerCase().includes(value)
    );

    // 현재 페이지 리셋
    currentPage = 1;

    // 필터링된 결과를 기반으로 멤버 표시
    displayMembers(filteredMembers);
}

///////////////////////////////// 페이지네이션 함수 /////////////////////////////////
function updatePaginationControls(totalMembers = members.length) {
    const totalPages = Math.ceil(totalMembers / elementPerPage);
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;

    document.getElementById('prevPage').disabled = (currentPage === 1);
    document.getElementById('nextPage').disabled = (currentPage === totalPages || totalPages === 0);
}



///////////////////////////////// 참석 코드 컨테이너 생성 함수 /////////////////////////////////
async function createCodeContainer(userPermission) {
    if (userPermission == 1 || userPermission == 2) {
        const scheduleCodeContainer = document.getElementById('schedule-code-container');
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
            try {
                const response = await fetch('/Attend', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ 
                        functionType: 3, 
                        userToken: userToken, 
                        groupToken: groupToken, 
                        userPermission: userPermission, 
                        scheduleAttendanceCode: scheduleAttendanceCode,  
                    })
                });
    
                data = await response.json();
    
                if (data.result == 0) {
                    alert('다시 시도해주세요!')
                } else if (data.result == 1) {
                    alert(`출석코드가 변경되었습니다!`);
                    location.reload();
                } else {
                    alert('관리자에게 문의해주세요')
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }
    
}
