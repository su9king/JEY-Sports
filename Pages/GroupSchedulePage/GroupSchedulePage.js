//////////////////// Step0 : 회원인증, 사이드바, 뒤로가기 초기 세팅 ////////////////////
let schedules = [];
let scheduleContents = [];
let userToken, groupToken, userPermission;
previousPage = "/GroupMainPage/GroupMainPage.html"
window.onload = async function() {
    const page = 'GroupSchedulePage';
    userToken = sessionStorage.getItem('userToken');
    groupToken = sessionStorage.getItem('groupToken');
    userPermission = sessionStorage.getItem('userPermission');
    const data = `userToken=${userToken}&groupToken=${groupToken}&userPermission=${userPermission}`;
    
    response = await certification(page, data);
    
    loadSidebar(page, userPermission, response);
    loadMenubar(sessionStorage.getItem('groupName'));

    if (response.resources !== null) {
        schedules = response.resources.map(resource => ({
            scheduleToken: resource.scheduleToken,
            scheduleTitle: resource.scheduleTitle,
            scheduleStartDate: resource.scheduleStartDate ? resource.scheduleStartDate.split('T')[0] : null,
            scheduleEndDate: resource.scheduleEndDate ? resource.scheduleEndDate.split('T')[0] : null,
            scheduleImportance: resource.scheduleImportance,
        }));
    }

    displayCalendar(userPermission);  //// 달력 생성 및 일정 추가 버튼 적용 ////

}

//// 일정 생성 함수 ////
function displayCalendar(userPermission) { 
    var calendarEl = document.getElementById('calendar');

    var headerToolbarConfig = {
        start: '',
        center: 'title',
        end: 'prevYear,prev,next,nextYear'
    };

    // 일정 추가 버튼이 필요한 경우 start에 추가
    if (userPermission == 2 || userPermission == 1) {
        headerToolbarConfig.start = 'customAddScheduleButton';
    }

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: headerToolbarConfig,
        locale: 'ko', // 한국어로 변경

        events: schedules.map(schedule => ({
            id: schedule.scheduleToken,
            title: schedule.scheduleTitle,
            start: schedule.scheduleStartDate,
            end: schedule.scheduleEndDate,
            color: schedule.scheduleImportance == true ? '#FF0000' : '#0056b3', // 'True'면 빨간색, 아니면 기본 색상
            extendedProps: {
                scheduleImportance: schedule.scheduleImportance,
            }
        })),
        customButtons: {
            customAddScheduleButton: {
                text: '일정 추가',
                click: function() {
                    window.location.href = "CreateGroupSchedulePage.html"; // 일정 추가 페이지로 이동
                }
            }
        },
        eventClick: function(info) {
            displayScheduleDetails(info.event.id);
        }
    });

    calendar.render();
}

//// 일정 세부사항 표시 ////
async function displayScheduleDetails(scheduleToken) {
    const modal = document.getElementById("eventModal");
    const eventDetails = document.getElementById("eventDetails");

    const attendButton = document.getElementById("attendButton");
    const absentButton = document.getElementById("absentButton");

    const attendDetailButton = document.getElementById("attendDetailButton");
    const deleteEventButton = document.getElementById("deleteEventButton");
    const saveButton = document.getElementById("saveEventButton");

    try {
        const response = await fetch('/EditGroupSchedules', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ functionType: 1, userToken: userToken, groupToken: groupToken, scheduleToken: scheduleToken, userPermission: userPermission })
        });

        const contentData = await response.json();

        if (contentData.result == 1) {

            const currentSchedule = schedules.find(s => s.scheduleToken == scheduleToken);  // 회원 인증간에 이미 받은 것을 찾아오는 로직
            const scheduleDetails = contentData.resources[0];  // 새로 요청한 디테일 정보들 저장

            
            const scheduleTitle = currentSchedule.scheduleTitle;
            const scheduleStartDate = currentSchedule.scheduleStartDate;
            const scheduleEndDate = currentSchedule.scheduleEndDate || scheduleStartDate; // undefined라면 StartDate와 동일하게 출력
            const scheduleImportance = currentSchedule.scheduleImportance;
            const scheduleAlert = scheduleDetails.scheduleAlert || false; // 기본값 'False'
            const scheduleContent = scheduleDetails.scheduleContent;
            const scheduleLocation = scheduleDetails.scheduleLocation;
            const scheduleAttendance = scheduleDetails.scheduleAttendance;

            const importanceText = scheduleImportance == true ? '중요' : '일반';
            const alertText = scheduleAlert == true ? '알람 예정' : '알람 없음';

            eventDetails.innerHTML = `
                <strong>제목:</strong> ${scheduleTitle}<br>
                <strong>시작 시간:</strong> ${scheduleStartDate}<br>
                <strong>종료 시간:</strong> ${scheduleEndDate}<br>
                <strong>중요도:</strong> ${importanceText}<br>
                <strong>알람 설정:</strong> ${alertText}<br>
                <strong>장소:</strong> ${scheduleLocation}<br>
                <strong>일정 내용:</strong> ${scheduleContent}<br>
            `;

            console.log(scheduleAttendance)
            if (scheduleAttendance == 1) {
                //////////// 날짜 따라 참석, 결석 버튼 추가
                const todayDate = new Date().toISOString().split('T')[0];

                if (scheduleStartDate == todayDate) {
                    attendButton.style.display = "inline-block";
                    absentButton.style.display = "inline-block";

                    attendButton.onclick = function() {
                        attend(1, userToken, groupToken, userPermission, scheduleToken)
                    }

                    absentButton.onclick = async function() {
                        attend(2, userToken, groupToken, userPermission, scheduleToken)
                    }
                } else {
                    attendButton.style.display = "none";
                    absentButton.style.display = "none";
                }


                //////////// 출석 자세히보기 버튼
                attendDetailButton.onclick = function() {
                    window.location.href = `DetailScheduleAttendancePage.html?scheduleTitle=${scheduleTitle}&scheduleAttendance=${scheduleAttendance}&scheduleStartDate=${scheduleStartDate}&scheduleEndDate=${scheduleEndDate}&scheduleImportance=${scheduleImportance}&scheduleAlert=${scheduleAlert}&scheduleContent=${scheduleContent}&scheduleLocation=${scheduleLocation}&scheduleToken=${scheduleToken}`;
                }
            } else {
                attendButton.style.display = "none";
                absentButton.style.display = "none";                    attendButton.style.display = "none";
                attendDetailButton.style.display = "none";
            }
            

            //////////// 권한에 따라 삭제, 수정 버튼 추가
            if (userPermission == 2 || userPermission == 1) {
                saveButton.style.display = "inline-block";
                deleteEventButton.style.display = "inline-block";

                saveButton.onclick = function() {
                    window.location.href = `CreateGroupSchedulePage.html?scheduleTitle=${scheduleTitle}&scheduleAttendance=${scheduleAttendance}&scheduleStartDate=${scheduleStartDate}&scheduleEndDate=${scheduleEndDate}&scheduleImportance=${scheduleImportance}&scheduleAlert=${scheduleAlert}&scheduleContent=${scheduleContent}&scheduleLocation=${scheduleLocation}&scheduleToken=${scheduleToken}`;
                }

                deleteEventButton.onclick = async function() {
                    if (confirm('일정을 삭제하시겠습니까?')) {
                        try {
                            const response = await fetch('/EditGroupSchedules', {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({ functionType: 2, userToken: userToken, scheduleToken: scheduleToken, groupToken: groupToken, userPermission: userPermission, scheduleAttendance: scheduleAttendance })
                            });
                
                            const data = await response.json();
                
                            if (data.result == 0) {
                                alert('다시 시도해주세요!')
                            } else if (data.result == 1) {
                                alert('일정이 삭제되었습니다!');
                                window.location.reload(); // 삭제 후 페이지 새로고침
                            } else {
                                alert('관리자에게 문의해주세요')
                            }
                        } catch (error) {
                            console.error('Error:', error);
                        }
                    }
                }
            } else {
                saveButton.style.display = "none";
                deleteEventButton.style.display = "none";
            }


            modal.style.display = "block";


        } else if (data.result == 0)  {
            alert('일정을 불러오지 못했습니다.');
        } else {
            alert('관리자에게 문의해주세요')
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// 일정 추가 버튼 생성 (권한 제한을 위해 함수화)
function addScheduleAddButton(userPermission) {
    // 권한이 2 또는 1인 경우에만 버튼을 추가
    if (userPermission == 2 || userPermission == 1) {
        const buttonContainer = document.querySelector(".button-container"); // 버튼을 추가할 컨테이너

        // 일정 추가 버튼 생성
        const addScheduleBtn = document.createElement("button");
        addScheduleBtn.textContent = "일정 추가";
        addScheduleBtn.classList.add("btn");

        // 클릭 이벤트 리스너 추가
        addScheduleBtn.addEventListener('click', function() {
            window.location.href = "CreateGroupSchedulePage.html"; // 일정 추가 페이지로 이동
        });

        // 버튼을 컨테이너에 추가
        buttonContainer.appendChild(addScheduleBtn);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('closeBtn').addEventListener('click', function() {
        document.getElementById("eventModal").style.display = "none";
    });

    window.onclick = function(event) {
        if (event.target == document.getElementById("eventModal")) {
            document.getElementById("eventModal").style.display = "none";
        }
    };
    
});
