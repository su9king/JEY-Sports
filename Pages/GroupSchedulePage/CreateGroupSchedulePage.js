let scheduleToken;

//////////////////// Step0 : 회원인증, 사이드바, 뒤로가기 초기 세팅 ////////////////////
window.onload = async function() {
    const page = 'CreateGroupSchedulePage';
    userToken = sessionStorage.getItem('userToken');
    groupToken = sessionStorage.getItem('groupToken');
    userPermission = sessionStorage.getItem('userPermission');
    const data = `userToken=${userToken}&groupToken=${groupToken}&userPermission=${userPermission}`;
    
    response = await certification(page, data);

    const urlParams = new URLSearchParams(window.location.search);

    const scheduleAttendance = urlParams.get('scheduleAttendance');
    console.log(scheduleAttendance)
    const scheduleTitle = urlParams.get('scheduleTitle');
    const scheduleStartDate = urlParams.get('scheduleStartDate');
    const scheduleEndDate = urlParams.get('scheduleEndDate');
    const scheduleImportance = urlParams.get('scheduleImportance');
    const scheduleAlert = urlParams.get('scheduleAlert');
    const scheduleContent = urlParams.get('scheduleContent');
    const scheduleLocation = urlParams.get('scheduleLocation');
    scheduleToken = urlParams.get('scheduleToken');
    const scheduleStatus = urlParams.get('scheduleStatus');

    if (response.result == 0) {
        alert('로그인 후 사용해주세요!');
        window.location.href = '/WarningPage.html';
    } else {
        loadSidebar(page, userPermission, response);
        
        if (scheduleTitle) {
            console.log('수정페이지로 접근');
            document.getElementById('scheduleAttendance').value = scheduleAttendance;
            document.getElementById('scheduleTitle').value = scheduleTitle;
            document.getElementById('scheduleStartDate').value = scheduleStartDate;
            document.getElementById('scheduleEndDate').value = scheduleEndDate;
            document.getElementById('scheduleImportance').value = scheduleImportance;
            document.getElementById('scheduleAlert').value = scheduleAlert;
            document.getElementById('scheduleContent').value = scheduleContent;
            document.getElementById('scheduleLocation').value = scheduleLocation;
            // document.getElementById('scheduleStatus').value = scheduleStatus;
        } else {
            console.log('작성페이지로 접근');
        }
    }   

    // 뒤로가기
    document.getElementById('backButton').addEventListener('click', function() {
        window.history.back();
    });
}

//////////////////// Step1 : 페이지 구성 요소 생성 ////////////////////
document.addEventListener('DOMContentLoaded', function() {

    const scheduleAttendance = document.getElementById('scheduleAttendance');
    const scheduleStartDateInput = document.getElementById('scheduleStartDate');
    const scheduleEndDateInput = document.getElementById('scheduleEndDate');
    const noEndDateCheckbox = document.getElementById('noEndDate');
    const scheduleEndDate = document.getElementById('scheduleEndDate');

    // 모든 label 요소에 클릭 이벤트를 방지하는 핸들러 추가
    const labels = document.querySelectorAll('label');
    labels.forEach(label => {
        label.addEventListener('click', function(e) {
            e.preventDefault(); // 클릭 이벤트 기본 동작 방지
        });
    });

    // 종료날짜 없음 체크박스
    noEndDateCheckbox.addEventListener('change', function() {
        if (this.checked) {
            if (scheduleStartDateInput.value) {
                // 체크박스가 체크 -> 종료 날짜와 시작 날짜 동일, 종료 날짜 비활성화
                scheduleEndDateInput.value = scheduleStartDateInput.value;
                scheduleEndDateInput.disabled = true;
            } else {
                // 체크박스 체크 시 시작 날짜가 없는 경우
                this.checked = false;
                alert('시작 날짜를 선택해주세요!');
            }
        } else {
            // 체크박스가 언체크된 경우 -> 종료 날짜를 선택할 수 있도록 함
            scheduleEndDateInput.disabled = false;
            scheduleEndDateInput.value = '';
        }
    });

    // 시작 날짜 변경 시 종료 날짜에 적용
    scheduleStartDateInput.addEventListener('change', function() {
        if (noEndDateCheckbox.checked) {
            scheduleEndDateInput.value = this.value;
        }
    });



    // 시작 날짜가 종료 날짜보다 늦은 경우
    scheduleEndDate.addEventListener('change', function() {
        const startDate = new Date(document.getElementById('scheduleStartDate').value);
        const endDate = new Date(document.getElementById('scheduleEndDate').value);

        if (startDate > endDate) {
            // 경고 메시지를 띄웁니다.
            alert('시작 날짜는 종료 날짜보다 앞서야 합니다.');
            document.getElementById('scheduleEndDate').value = '';
        }
    });

    // 저장 버튼
    const scheduleSaveBtn = document.getElementById('scheduleSaveBtn');
    scheduleSaveBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const scheduleTitle = document.getElementById('scheduleTitle').value;
        const scheduleStartDate = document.getElementById('scheduleStartDate').value;
        const scheduleEndDate = noEndDateCheckbox.checked ? scheduleStartDateInput.value : scheduleEndDateInput.value;
        const scheduleImportance = document.getElementById('scheduleImportance').value;
        const scheduleAlert = document.getElementById('scheduleAlert').value;
        const scheduleContent = document.getElementById('scheduleContent').value;
        const scheduleLocation = document.getElementById('scheduleLocation').value;
        // const scheduleStatus = document.getElementById('scheduleStatus').value;

        if (scheduleTitle && scheduleStartDate && scheduleContent && scheduleLocation && scheduleEndDate ) {
            try {
                const response = await fetch('/EditGroupSchedules', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        userPermission: userPermission,
                        functionType: 3,
                        userToken: userToken,
                        groupToken: groupToken,
                        scheduleToken: scheduleToken,
                        scheduleAttendance: scheduleAttendance,
                        scheduleTitle: scheduleTitle,
                        scheduleStartDate: scheduleStartDate,
                        scheduleEndDate: scheduleEndDate,
                        scheduleImportance: scheduleImportance,
                        scheduleAlert: scheduleAlert,
                        scheduleContent: scheduleContent,
                        scheduleLocation: scheduleLocation
                        // scheduleStatus: scheduleStatus
                    })
                });

                const data = await response.json();

                if (data.result == 0) {
                    alert('다시 시도해주세요!');
                } else if (data.result == 1)  {
                    alert('일정을 저장했습니다!');
                    window.location.href = "GroupSchedulePage.html";
                } else {
                    alert('관리자에게 문의해주세요')
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            alert('모든 칸을 채워주세요!');
        }
    });

    const noticeCancleBtn = document.getElementById('noticeCancleBtn');
    noticeCancleBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        window.location.href = "GroupSchedulePage.html";
    });
});
