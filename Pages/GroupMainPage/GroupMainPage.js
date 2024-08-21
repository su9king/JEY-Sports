const page = 'GroupMainPage';
const userToken = sessionStorage.getItem('userToken');
const groupToken = sessionStorage.getItem('groupToken');
const userPermission = sessionStorage.getItem('userPermission');
const todayDate = new Date().toISOString().split('T')[0];

let statusNotice = [];
let statusSchedule = [];

window.onload = async function() {

    const data = `userToken=${userToken}&groupToken=${groupToken}&userPermission=${userPermission}`
    const response = await certification(page, data);

    if (response.result == 0) {
        alert('로그인 후 사용해주세요!');
        window.location.href = '/WarningPage.html';
    } else {  // 회원은 확인이 되었고,

        //////// 그룹 현재 상태 조회 데이터 요청
        try {
            const response = await fetch('/CheckGroupStatus', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    userToken: userToken, 
                    groupToken: groupToken, 
                    userPermission: userPermission,
                    todayDate: todayDate,
                })
            });

            const buffer = await response.json();
            console.log(buffer.resources);
            if (buffer.result == 0) {
                alert('다시 시도해주세요!')
            } else if (buffer.result == 1)  {
                console.log(buffer.resources);
                if(buffer.resources[0] !== null) {
                    statusNotice = buffer.resources[0].map(resource => ({
                        noticeToken: resource.noticeToken,
                        noticeTitle: resource.noticeTitle,
                        duesStatus: resource.duesStatus,
                        noticeDues: resource.noticeDues,
                    }));
                }

                if(buffer.resources[1] !== null) {
                    statusSchedule = buffer.resources[1].map(resource => ({
                        scheduleToken: resource.scheduleToken,
                        scheduleTitle: resource.scheduleTitle,
                        attendanceStatus : resource.attendanceStatus ,
                        scheduleStartDate: resource.scheduleStartDate,
                        scheduleEndDate: resource.scheduleEndDate,
                        absentReason: resource.absentReason,
                    }));
                }

            } else {
                alert('관리자에게 문의해주세요')
            }
        } catch (error) {
            console.error('Error:', error);
        }

        loadSidebar(page, userPermission, response);

        ///////////////////////이미지 불러오기
        const groupImage = response.resources[0]["groupImage"];
        if (groupImage == null){
            document.getElementById('groupImage').src = `/GroupImages/NULL.png`
        } else{
            document.getElementById('groupImage').src = `/GroupImages/${groupImage}`;  
        }

        document.getElementById('groupName').textContent = `${response.resources[0]["groupName"]}에 오신 것을 환영합니다!`

        alertStatusNotice(statusNotice);
        alertStatusSchedule(statusSchedule);
       
    }

    // 뒤로가기
    document.getElementById('backButton').addEventListener('click', function() {
        window.history.back();
    });
}



async function alertStatusNotice(statusNotice) {
    const duesContainer = document.getElementById("dues-container");
    duesContainer.innerHTML = '';

    // "지금 내야하는 회비" 제목 생성
    const duesTitle = document.createElement("h2");
    duesTitle.classList.add("dues-title");
    duesTitle.textContent = "지금 내야하는 회비";
    duesContainer.appendChild(duesTitle);

    // 각 회비에 대한 noticeBox 생성
    statusNotice.forEach(notice => {
        const noticeBox = document.createElement("div");
        noticeBox.classList.add("noticeBox");

        // 공지사항 제목 생성
        const noticeTitle = document.createElement("h3");
        noticeTitle.classList.add("notice-title");
        noticeTitle.textContent = notice.noticeTitle;

        // 개인당 회비 및 납부하기 버튼 생성
        const noticeInfo = document.createElement("div");
        noticeInfo.classList.add("notice-info");
        noticeInfo.innerHTML = `
            <span>개인당 회비: ${notice.noticeDues}원</span>
        `;

        const payButton = document.createElement("button");
        payButton.classList.add("pay-button");
        payButton.textContent = "납부하기";

        // 납부하기 버튼 클릭 이벤트
        payButton.addEventListener("click", function() {
            dues(userToken, groupToken, userPermission, notice.noticeToken, notice.noticeDues);
        });

        noticeInfo.appendChild(payButton);
        noticeBox.appendChild(noticeTitle);
        noticeBox.appendChild(noticeInfo);
        duesContainer.appendChild(noticeBox);
    });
}

async function alertStatusSchedule(statusSchedule) {
    const currentScheduleContainer = document.getElementById("current-schedule-container");
    currentScheduleContainer.innerHTML = '';

    const expectedScheduleContainer = document.getElementById("expected-schedule-container");
    expectedScheduleContainer.innerHTML = '';

    // 오늘 날짜
    const todayDate = new Date().toISOString().split('T')[0];

    // 오늘의 일정 및 예정 일정 분류 및 생성
    let hasTodaySchedule = false;
    let hasExpectedSchedule = false;

    statusSchedule.forEach(schedule => {
        //isToday 변수는 예정 일정인지, 현재 진행중인 일정인지 구분점. isToday true 이면 현재 진행중인 일정임.
    
        const isToday = schedule.scheduleStartDate <= todayDate ? true : false
        const container = isToday ? currentScheduleContainer : expectedScheduleContainer;
        

        if (isToday) {
            hasTodaySchedule = true;
        } else {
            hasExpectedSchedule = true;
        }

        const scheduleBox = document.createElement("div");
        scheduleBox.classList.add("scheduleBox");

        // 일정 정보 표시
        const scheduleInfo = document.createElement("div");
        scheduleInfo.classList.add("schedule-info");
        scheduleInfo.innerHTML = `
            [ ${schedule.scheduleStartDate} ~ ${schedule.scheduleEndDate} ] : ${schedule.scheduleTitle}
        `;

        // 버튼 생성
        const attendButton = document.createElement("button");
        attendButton.classList.add("attend-button");
        attendButton.textContent = "출석하기";

        const absentButton = document.createElement("button");
        absentButton.classList.add("absent-button");
        absentButton.textContent = "결석하기";

        // 출석하기 버튼 클릭 이벤트
        attendButton.addEventListener("click", function() {
            attend(1, userToken, groupToken, userPermission, schedule.scheduleToken);
        });

        // 결석하기 버튼 클릭 이벤트
        absentButton.addEventListener("click", function() {
            attend(2, userToken, groupToken, userPermission, schedule.scheduleToken);
        });

        // 오늘 일정인지 아닌지에 따라 버튼 추가
        if (isToday) {
            if (schedule.attendanceStatus == 1) {
                const attendCheckedButton = document.createElement("p");
                attendCheckedButton.classList.add("attend-checked-button");
                attendCheckedButton.innerText = "참석 완료!";
                attendCheckedButton.disabled = true;
                scheduleInfo.appendChild(attendCheckedButton);
            } else if (schedule.attendanceStatus == 0) {
                const absentCheckedButton = document.createElement("p");
                absentCheckedButton.classList.add("absent-checked-button");
                absentCheckedButton.innerText = "불참 예정 ㅠㅠ";

                const absentReason = document.createElement("p");
                absentReason.classList.add("absent-reason");
                absentReason.innerText = `사유: ${schedule.absentReason}`;

                scheduleInfo.appendChild(absentCheckedButton);
                scheduleInfo.appendChild(absentReason);
            } else {
                console.log(schedule.attendanceStatus)
            }
            scheduleInfo.appendChild(attendButton);
        }
        scheduleInfo.appendChild(absentButton);

        scheduleBox.appendChild(scheduleInfo);
        container.appendChild(scheduleBox);
    
    
    });

    // "오늘의 일정" 제목 생성
    if (hasTodaySchedule) {
        const currentScheduleTitle = document.createElement("h2");
        currentScheduleTitle.classList.add("schedule-title");
        currentScheduleTitle.textContent = "오늘의 일정";
        currentScheduleContainer.prepend(currentScheduleTitle);
    }

    // "예정 일정" 제목 생성
    if (hasExpectedSchedule) {
        const expectedScheduleTitle = document.createElement("h2");
        expectedScheduleTitle.classList.add("schedule-title");
        expectedScheduleTitle.textContent = "예정 일정";
        expectedScheduleContainer.prepend(expectedScheduleTitle);
    }
}