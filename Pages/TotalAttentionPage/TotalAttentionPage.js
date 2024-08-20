let noticeToken, getData;

//////////////////// Step0 : 회원인증, 사이드바, 뒤로가기 초기 세팅 ////////////////////
window.onload = async function() {
    const page = 'TotalAttentionPage';
    userToken = sessionStorage.getItem('userToken');
    groupToken = sessionStorage.getItem('groupToken');
    userPermission = sessionStorage.getItem('userPermission');

    const data = `userToken=${userToken}&groupToken=${groupToken}&userPermission=${userPermission}`;
    
    const response = await certification(page, data);
    getData = response.resources;
    
    if (response.result == 0) {
        alert('로그인 후 사용해주세요!');
        window.location.href = '/WarningPage.html';
        return;
    }

    loadSidebar(page, userPermission, response);


    // 회비 리스트 테이블
    const tableContainer = document.getElementById("table-container");
    const table = generateTable(getData);
    tableContainer.appendChild(table);

    initSearchFunctionality();

    
    // 뒤로가기 버튼
    document.getElementById('backButton').addEventListener('click', function() {
        window.history.back();
    });
}


// JSON 데이터를 HTML 테이블로 변환하는 함수
function generateTable(getData) {
    const table = document.createElement("table");
    table.id = "attendanceTable"; // 테이블에 ID 추가

    // 테이블 헤더 생성
    const thead = table.createTHead();
    const headerRow = thead.insertRow();

    // 첫 번째 빈 칸 헤더
    const emptyHeader = document.createElement("th");
    headerRow.appendChild(emptyHeader);

    // '개인 참여율' 헤더 추가
    const personalParticipationHeader = document.createElement("th");
    personalParticipationHeader.textContent = '개인 참여율';
    headerRow.appendChild(personalParticipationHeader);

    // 각 일정에 대한 헤더 추가
    getData[0].forEach(schedule => {
        const th = document.createElement("th");
        if (schedule.scheduleStartDate == schedule.scheduleEndDate) {
            th.textContent = `${schedule.scheduleStartDate}`;
        } else {
            th.textContent = `${schedule.scheduleStartDate} ~ ${schedule.scheduleEndDate}`;
        }

        th.addEventListener("click", () => {
            window.location.href = `/GroupSchedulePage/DetailScheduleAttendancePage.html?scheduleToken=${schedule.scheduleToken}&scheduleTitle=${schedule.scheduleTitle}&scheduleStartDate=${schedule.scheduleStartDate}&scheduleEndDate=${schedule.scheduleEndDate}&scheudleImportance=${schedule.scheudleImportance}&scheduleAlert=${schedule.scheduleAlert}&scheduleStatus=${schedule.scheduleStatus}`;
        });

        headerRow.appendChild(th);
    });

    // 테이블 본문 생성
    const tbody = table.createTBody();

    // 조직 참여율 행 추가
    const orgParticipationRow = tbody.insertRow();
    const orgParticipationCell = orgParticipationRow.insertCell();
    orgParticipationCell.textContent = '조직 참여율';

    // 첫 번째 빈 칸 셀 추가
    const emptyCell = orgParticipationRow.insertCell();

    // 각 일정에 대한 조직 참여율 계산 및 셀 추가
    getData[1].forEach((schedule, scheduleIndex) => {
        // getData[1]과 getData[2]의 유저들을 모두 합쳐서 하나의 배열로 만듦
        const combinedUsers = schedule.concat(getData[2][scheduleIndex]);
    
        // attendanceStatus가 1인 유저의 수 계산
        const attendanceCount = combinedUsers.filter(user => user.attendanceStatus === 1).length;
        
        // attendanceStatus가 0 또는 1인 유저의 수 계산 (null 제외)
        const validCount = combinedUsers.filter(user => user.attendanceStatus !== null).length;
    
        // 조직 참여율 계산
        const orgParticipationRate = validCount > 0 ? (attendanceCount / validCount) * 100 : 0;
    
        // 조직 참여율을 셀에 추가
        const orgParticipationRateCell = orgParticipationRow.insertCell();
        orgParticipationRateCell.appendChild(createGauge(orgParticipationRate));
    });
    

    // 각 사용자의 행 추가
    getData[1][0].forEach((user, userIndex) => {
        const userRow = tbody.insertRow();

        // 유저 이름 셀 추가
        const userNameCell = userRow.insertCell();
        userNameCell.textContent = user.userName;

        // 개인 참여율 계산
        let attendedCount = 0;
        let totalCount = 0;

        getData[1].forEach(schedule => {
            const attendanceStatus = schedule[userIndex].attendanceStatus;
            if (attendanceStatus !== null) {
                totalCount++;
                if (attendanceStatus === 1) {
                    attendedCount++;
                }
            }
        });

        const personalParticipationRate = totalCount > 0 ? (attendedCount / totalCount) * 100 : 0;

        // 개인 참여율 셀 추가
        const personalParticipationCell = userRow.insertCell();
        personalParticipationCell.appendChild(createGauge(personalParticipationRate));

        // 각 일정에 대한 참석 여부 데이터 셀 추가
        getData[1].forEach((schedule, scheduleIndex) => {
            const attendanceCell = userRow.insertCell();
            const attendanceStatus = schedule[userIndex].attendanceStatus;

            if (attendanceStatus === 1) {
                attendanceCell.textContent = '참석';
            } else if (attendanceStatus === 0) {
                attendanceCell.textContent = '불참';
            } else if (attendanceStatus === null) {
                attendanceCell.textContent = '비회원';
            }
        });
    });

    const border = tbody.insertRow();
    const borderline = border.insertCell();
    borderline.textContent = '비유저 멤버들';

    getData[2][0].forEach((user, userIndex) => {
        const userRow = tbody.insertRow();

        // 유저 이름 셀 추가
        const userNameCell = userRow.insertCell();
        userNameCell.textContent = user.userName;

        // 개인 참여율 계산
        let notUserAttendedCount = 0;
        let notUserTotalCount = 0;

        getData[2].forEach(schedule => {
            const attendanceStatus = schedule[userIndex].attendanceStatus;
            if (attendanceStatus !== null) {
                notUserTotalCount++;
                if (attendanceStatus === 1) {
                    notUserAttendedCount++;
                }
            }
        });

        const personalParticipationRate = notUserTotalCount > 0 ? (notUserAttendedCount / notUserTotalCount) * 100 : 0;

        // 개인 참여율 셀 추가
        const personalParticipationCell = userRow.insertCell();
        personalParticipationCell.appendChild(createGauge(personalParticipationRate));

        // 각 일정에 대한 참석 여부 데이터 셀 추가
        getData[2].forEach((schedule, scheduleIndex) => {
            const attendanceCell = userRow.insertCell();
            const attendanceStatus = schedule[userIndex].attendanceStatus;

            if (attendanceStatus === 1) {
                attendanceCell.textContent = '참석';
            } else if (attendanceStatus === 0) {
                attendanceCell.textContent = '불참';
            } else if (attendanceStatus === null) {
                attendanceCell.textContent = '비회원';
            }
        });
    });

    return table;
}

// 게이지 바를 만드는 함수
function createGauge(percentage) {
    const container = document.createElement("div");
    container.className = "gauge";

    const fill = document.createElement("div");
    fill.className = "gauge-fill";
    fill.style.width = percentage + "%";

    const text = document.createElement("span");
    text.className = "gauge-text";
    text.textContent = percentage.toFixed(0) + "%";

    container.appendChild(fill);
    container.appendChild(text);

    return container;
}

function initSearchFunctionality() {
    const payrollSearch = document.querySelector('#search-box');
    const payrollTable = document.querySelector('#attendanceTable tbody');

    payrollSearch.addEventListener('keyup', function() {
        const filterValue = payrollSearch.value.toLowerCase();
        const rows = payrollTable.querySelectorAll('tr');

        rows.forEach(row => {
            // 각 행의 첫 번째 열(td)을 가져옴
            const userNameCell = row.querySelector('td:first-child');
            const cellText = userNameCell.textContent.toLowerCase();
            row.style.display = cellText.includes(filterValue) ? '' : 'none';
        });
    });
}
