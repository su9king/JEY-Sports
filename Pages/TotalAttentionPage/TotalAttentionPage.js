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
    getData.forEach(scheduleData => {
        const schedule = scheduleData[0]; // 각 행의 첫 번째 요소에 접근
        console.log("테스트용 콘솔 : ", schedule);
        const th = document.createElement("th");
        
        if (schedule.scheduleStartDate === schedule.scheduleEndDate) {
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
    getData.forEach((scheduleData) => {
        const combinedUsers = scheduleData[1].concat(scheduleData[2]); // 유저 데이터 합치기

        const attendanceCount = combinedUsers.filter(user => user.attendanceStatus === 1).length;
        const validCount = combinedUsers.filter(user => user.attendanceStatus !== null).length;

        const orgParticipationRate = validCount > 0 ? (attendanceCount / validCount) * 100 : 0;

        const orgParticipationRateCell = orgParticipationRow.insertCell();
        orgParticipationRateCell.appendChild(createGauge(orgParticipationRate));
    });

    // 각 사용자의 행 추가 (소프트웨어 유저)
    getData.forEach((scheduleData) => {
        scheduleData[1].forEach((user) => {
            // 사용자가 이미 추가된 경우 중복 추가 방지
            if (!tbody.querySelector(`tr[data-userid="${user.userID}"]`)) {
                const userRow = tbody.insertRow();
                userRow.setAttribute('data-userid', user.userID); // 사용자 ID를 데이터 속성으로 추가
                const userNameCell = userRow.insertCell();
                userNameCell.textContent = user.userName;
    
                // 개인 참여율 계산
                let attendedCount = 0;
                let totalCount = 0;
    
                getData.forEach(data => {
                    const userAttendance = data[1].find(u => u.userID == user.userID);
                    if (userAttendance) {
                        const attendanceStatus = userAttendance.attendanceStatus;
                        if (attendanceStatus !== null) {
                            totalCount++;
                            if (attendanceStatus === 1) {
                                attendedCount++;
                            }
                        }
                    }
                });
    
                const personalParticipationRate = totalCount > 0 ? (attendedCount / totalCount) * 100 : 0;
    
                const personalParticipationCell = userRow.insertCell();
                personalParticipationCell.appendChild(createGauge(personalParticipationRate));
    
                // 각 일정에 대한 참석 여부 데이터 셀 추가
                getData.forEach(data => {
                    const attendanceCell = userRow.insertCell();
                    const userAttendance = data[1].find(u => u.userID == user.userID);
    
                    if (userAttendance) {
                        const attendanceStatus = userAttendance.attendanceStatus;
                        if (attendanceStatus === 1) {
                            attendanceCell.textContent = '참석';
                        } else if (attendanceStatus === 0) {
                            attendanceCell.textContent = '불참';
                        } else {
                            attendanceCell.textContent = '비회원';
                        }
                    } else {
                        attendanceCell.textContent = '비회원';
                    }
                });
            }
        });
    });
    
    

    // 비유저 멤버들 추가
    const notUserRowHeader = tbody.insertRow();
    const notUserHeaderCell = notUserRowHeader.insertCell();
    notUserHeaderCell.textContent = '비유저 멤버들';

    getData.forEach((scheduleData) => {
        scheduleData[2].forEach((user) => {
            // 사용자가 이미 추가된 경우 중복 추가 방지
            if (!tbody.querySelector(`tr[data-notusertoken="${user.notUserToken}"]`)) {
                const userRow = tbody.insertRow();
                userRow.setAttribute('data-notusertoken', user.notUserToken); // 비유저 토큰을 데이터 속성으로 추가
                const userNameCell = userRow.insertCell();
                userNameCell.textContent = user.userName;
    
                // 개인 참여율 계산
                let notUserAttendedCount = 0;
                let notUserTotalCount = 0;
    
                getData.forEach(data => {
                    const userAttendance = data[2].find(u => u.notUserToken == user.notUserToken);
                    if (userAttendance) {
                        const attendanceStatus = userAttendance.attendanceStatus;
                        if (attendanceStatus !== null) {
                            notUserTotalCount++;
                            if (attendanceStatus === 1) {
                                notUserAttendedCount++;
                            }
                        }
                    }
                });
    
                const personalParticipationRate = notUserTotalCount > 0 ? (notUserAttendedCount / notUserTotalCount) * 100 : 0;
    
                const personalParticipationCell = userRow.insertCell();
                personalParticipationCell.appendChild(createGauge(personalParticipationRate));
    
                // 각 일정에 대한 참석 여부 데이터 셀 추가
                getData.forEach(data => {
                    const attendanceCell = userRow.insertCell();
                    const userAttendance = data[2].find(u => u.notUserToken == user.notUserToken);
    
                    if (userAttendance) {
                        const attendanceStatus = userAttendance.attendanceStatus;
                        if (attendanceStatus === 1) {
                            attendanceCell.textContent = '참석';
                        } else if (attendanceStatus === 0) {
                            attendanceCell.textContent = '불참';
                        } else {
                            attendanceCell.textContent = '비회원';
                        }
                    } else {
                        attendanceCell.textContent = '비회원';
                    }
                });
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
