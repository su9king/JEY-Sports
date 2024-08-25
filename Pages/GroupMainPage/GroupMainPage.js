const page = 'GroupMainPage';
const userToken = sessionStorage.getItem('userToken');
const groupToken = sessionStorage.getItem('groupToken');
const userPermission = sessionStorage.getItem('userPermission');
const todayDate = new Date().toISOString().split('T')[0];
previousPage = "/PrivatePage/PrivatePage.html";
window.onload = async function() {

    const data = `userToken=${userToken}&groupToken=${groupToken}&userPermission=${userPermission}`
    const response = await certification(page, data);

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

        const data = await response.json();
        console.log(data);
        if (data.result == 0) {
            alert('다시 시도해주세요!')
        } else if (data.result == 1)  {

            if(data.resources[0].length == 0 && data.resources[1].length == 0 && data.resources[2].length == 0) {
                const example = document.getElementById("example");
                example.style.display = 'block';
            }else{
                const example = document.getElementById("example");
                example.style.display = 'none';
            }
            

            alertStatusNotice(data.resources[0]);  // 회비 납부 상황 노출


            const currentScheduleContainer = document.getElementById("current-schedule-container");
            currentScheduleContainer.innerHTML = '';

            const expectedScheduleContainer = document.getElementById("expected-schedule-container");
            expectedScheduleContainer.innerHTML = '';

            alertStatusSchedule(data.resources[1]); // 출석 기능 있는 일정 사항 노출
            alertStatusSchedule(data.resources[2]); // 출석 기능 있는 일정 사항 노출

        } else {
            alert('관리자에게 문의해주세요')
        }
    } catch (error) {
        console.error('Error:', error);
    }


    loadSidebar(page, userPermission, response);
    loadMenubar(sessionStorage.getItem('groupName'));

    ///////////////////////이미지 불러오기
    const groupImage = response.resources[0]["groupImage"];
    if (groupImage == null){
        document.getElementById('groupImage').src = `/GroupImages/NULL.png`
    } else{
        document.getElementById('groupImage').src = `/GroupImages/${groupImage}`;  
    }

    document.getElementById('groupName').textContent = `${response.resources[0]["groupName"]} 채널에 오신 것을 환영합니다!`

    

}



async function alertStatusNotice(statusNotice) {
    const duesContainer = document.getElementById("dues-container");
    duesContainer.innerHTML = '';

    // "지금 내야하는 회비" 제목 생성
    if(statusNotice.length == 0) {
        return
    }
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




async function alertStatusSchedule(data) {

    
    const currentScheduleContainer = document.getElementById("current-schedule-container");

    const expectedScheduleContainer = document.getElementById("expected-schedule-container");

    if(data.length == 0) {
        currentScheduleContainer.style.display = 'none';
        expectedScheduleContainer.style.display = 'none';
        return
    }
    // 오늘 날짜
    const todayDate = new Date().toISOString().split('T')[0];

    // 오늘의 일정 및 예정 일정 분류 및 생성
    let hasTodaySchedule = false;
    let hasExpectedSchedule = false;

    data.forEach(schedule => {
        const scheduleStartDate = new Date(schedule.scheduleStartDate).toISOString().split('T')[0];
        const scheduleEndDate = new Date(schedule.scheduleEndDate).toISOString().split('T')[0];
        const isToday = (scheduleStartDate <= todayDate && todayDate <= scheduleEndDate);

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

        // 출석기능이 있는 경우만 버튼 생성
        console.log(schedule.scheduleAttendance)
        if (schedule.attendanceStatus !== undefined) { 
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
                // 출석 여부에 따라 버튼 상태 조정
                if (schedule.attendanceStatus === 1) {
                    const attendCheckedButton = document.createElement("p");
                    attendCheckedButton.classList.add("attend-checked-button");
                    attendCheckedButton.innerText = "참석 완료!";
                    attendCheckedButton.disabled = true;
                    scheduleInfo.appendChild(attendCheckedButton);
                } else if (schedule.attendanceStatus === 0) {
                    const absentCheckedButton = document.createElement("p");
                    absentCheckedButton.classList.add("absent-checked-button");
                    absentCheckedButton.innerText = "불참 예정 ㅠㅠ";

                    const absentReason = document.createElement("p");
                    absentReason.classList.add("absent-reason");
                    absentReason.innerText = `사유: ${schedule.absentReason}`;

                    scheduleInfo.appendChild(absentCheckedButton);
                    scheduleInfo.appendChild(absentReason);
                }
                
                scheduleInfo.appendChild(attendButton);
                scheduleInfo.appendChild(absentButton);

            }
            // 예정 일정에는 결석하기 버튼만 추가
            if (!isToday) {
                scheduleInfo.appendChild(absentButton);
            }
        }

        scheduleBox.appendChild(scheduleInfo);
        container.appendChild(scheduleBox);

    });

    // "오늘의 일정" 제목 생성
    if (hasTodaySchedule) {
        if(!document.querySelector('#today-schedule-title')) {
            const currentScheduleTitle = document.createElement("h2");
            currentScheduleTitle.classList.add("schedule-title");
            currentScheduleTitle.id = "today-schedule-title"
            currentScheduleTitle.textContent = "오늘의 일정";
            currentScheduleContainer.prepend(currentScheduleTitle);
        }
    }

    // "예정 일정" 제목 생성
    if (hasExpectedSchedule) {
        if(!document.querySelector('#expected-schedule-title')) {
            const expectedScheduleTitle = document.createElement("h2");
            expectedScheduleTitle.classList.add("schedule-title");
            expectedScheduleTitle.id = "expected-schedule-title"
            expectedScheduleTitle.textContent = "예정 일정";
            expectedScheduleContainer.prepend(expectedScheduleTitle);
        }
    }
    
}
