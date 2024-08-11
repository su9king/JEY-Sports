let noticeToken

//////////////////// Step0 : 회원인증, 사이드바, 뒤로가기 초기 세팅 ////////////////////
window.onload = async function() {
    const page = 'CreateGroupNoticePage';
    userToken = sessionStorage.getItem('userToken');
    groupToken = sessionStorage.getItem('groupToken');
    userPermission = sessionStorage.getItem('userPermission');
    const data = `userToken=${userToken}&groupToken=${groupToken}&userPermission=${userPermission}`;
    
    resources = await certification(page, data);

    const urlParams = new URLSearchParams(window.location.search);
    noticeTitle = urlParams.get('noticeTitle');
    noticeImportance = urlParams.get('noticeImportance');
    noticeStatus = urlParams.get('noticeStatus');
    noticeContent = urlParams.get('noticeContent');
    noticeEndDate = urlParams.get('noticeEndDate');
    noticeWriter = urlParams.get('noticeWriter');


    
    if (resources.result == 0) {
        alert('로그인 후 사용해주세요!');
        window.location.href = '/WarningPage.html';
    } else {
        loadSidebar(page, userPermission, resources);
        // document.getElementById('noticeWriter').value = resources.resources[0]['userName'];
            
        if (noticeTitle) {
            console.log('수정페이지로 접근');
            document.getElementById('noticeTitle').value = noticeTitle;
            document.getElementById('noticeImportance').value = noticeImportance;
            document.getElementById('noticeStatus').value = noticeStatus;
            document.getElementById('noticeContent').value = noticeContent;
            document.getElementById('noticeEndDate').value = noticeEndDate;
            document.getElementById('noticeWriter').value = noticeWriter;
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

    const noticeEndDateInput = document.getElementById('noticeEndDate');
    const noEndDateCheckbox = document.getElementById('noEndDate');

    // 종료날짜 없음 체크박스
    noEndDateCheckbox.addEventListener('change', function() {
        if (this.checked) {
            // 체크박스가 체크 -> 종료 날짜를 null, 날짜 선택 금지
            noticeEndDateInput.value = null;
            noticeEndDateInput.disabled = true;
        } else {
            noticeEndDateInput.disabled = false;
        }
    });

    // 저장 버튼
    const noticeSaveBtn = document.getElementById('noticeSaveBtn');
    noticeSaveBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const functionType = 3;

        const noticeTitle = document.getElementById('noticeTitle').value;
        const noticeImportance = document.getElementById('noticeImportance').value;
        const noticeStatus = document.getElementById('noticeStatus').value;
        const noticeContent = document.getElementById('noticeContent').value;
        const noticeWriter = document.getElementById('noticeWriter').value;
        const noticeEndDate = noticeEndDateInput.value;

        
        if (noticeTitle && noticeContent && noticeWriter &&(noticeEndDate || noEndDateCheckbox.checked)) {
            try {
                const response = await fetch('/EditGroupNotices', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        functionType: functionType,
                        userToken: userToken,
                        groupToken: groupToken,
                        noticeToken: noticeToken,
                        noticeTitle: noticeTitle,
                        noticeImportance: noticeImportance,
                        noticeStatus: noticeStatus,
                        noticeContent: noticeContent,
                        noticeWriter: noticeWriter,
                        noticeEndDate: noticeEndDate
                    })
                });

                data = await response.json();

                if (data.result == 0) {
                    alert('다시 시도해주세요!');
                } else {
                    alert('공지사항을 저장했습니다!');
                    window.location.href = "GroupNoticePage.html";
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            alert('모든 칸을 채워주세요!');
        }
    });
});
