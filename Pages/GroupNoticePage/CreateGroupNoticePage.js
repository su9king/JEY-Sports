let noticeToken

//////////////////// Step0 : 회원인증, 사이드바, 뒤로가기 초기 세팅 ////////////////////
window.onload = async function() {
    const page = 'CreateGroupNoticePage';
    userToken = sessionStorage.getItem('userToken');
    groupToken = sessionStorage.getItem('groupToken');
    userPermission = sessionStorage.getItem('userPermission');
    const data = `userToken=${userToken}&groupToken=${groupToken}&userPermission=${userPermission}`;
    
    response = await certification(page, data);

    const urlParams = new URLSearchParams(window.location.search);
    noticeTitle = urlParams.get('noticeTitle');
    noticeImportance = urlParams.get('noticeImportance');
    noticeStatus = urlParams.get('noticeStatus');
    noticeContent = urlParams.get('noticeContent');
    noticeEndDate = urlParams.get('noticeEndDate');
    noticeWriter = urlParams.get('noticeWriter');
    noticeToken = urlParams.get('noticeToken');
    noticeType = urlParams.get('noticeType');
    noticeDues = urlParams.get('noticeDues');
    
    loadSidebar(page, userPermission, response);
    loadMenubar(sessionStorage.getItem('groupName'));
        
    if (noticeTitle) {
        console.log('수정페이지로 접근');
        if (noticeType != 1) {
            document.getElementById('noticeDuesContainer').style.display = 'block'
            document.getElementById('noticeDues').value = noticeDues;
            if (noticeType == 2) {
                document.getElementById('noticeDues').disabled = 'true'
            }
        }
        document.getElementById('noticeType').disabled = 'true';
        document.getElementById('noticeTitle').value = noticeTitle;
        document.getElementById('noticeImportance').value = noticeImportance;
        document.getElementById('noticeStatus').value = noticeStatus;
        document.getElementById('noticeContent').value = noticeContent;
        document.getElementById('noticeEndDate').value = noticeEndDate ? noticeEndDate.split('T')[0] : null;
        document.getElementById('noticeWriter').value = noticeWriter;
        document.getElementById('noticeType').value = noticeType;
    } else {
        console.log('작성페이지로 접근');
    }

}

//////////////////// Step1 : 페이지 구성 요소 생성 ////////////////////
document.addEventListener('DOMContentLoaded', function() {

    const noticeTypeInput = document.getElementById('noticeType');
    const noticeDuesContainer = document.getElementById('noticeDuesContainer');
    const noticeEndDateInput = document.getElementById('noticeEndDate');
    const noEndDateCheckbox = document.getElementById('noEndDate');

    // 모든 label 요소에 클릭 이벤트를 방지하는 핸들러 추가
    const labels = document.querySelectorAll('label');
    labels.forEach(label => {
        label.addEventListener('click', function(e) {
            e.preventDefault(); // 클릭 이벤트 기본 동작 방지
        });
    });
    
    // noticeType에 따라 noticeDues 작성 칸 생성
    noticeTypeInput.addEventListener('change', function() {
        if (noticeTypeInput.value == 1) {
            noticeDuesContainer.style.display = 'none'
        } else {
            noticeDuesContainer.style.display = 'block'
        }
    });

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

        const noticeType = document.getElementById('noticeType').value;
        const noticeDues = document.getElementById('noticeDues').value ? document.getElementById('noticeDues').value : null;
        const noticeTitle = document.getElementById('noticeTitle').value;
        const noticeImportance = document.getElementById('noticeImportance').value;
        const noticeStatus = document.getElementById('noticeStatus').value;
        const noticeContent = document.getElementById('noticeContent').value;
        const noticeWriter = document.getElementById('noticeWriter').value;
        const noticeEndDate = noticeEndDateInput.value ? noticeEndDateInput.value : null;
        const noticeCreatedDate = new Date().toISOString().split('T')[0];
        const noticeEditDate = new Date().toISOString().split('T')[0];

        
        if ((noticeDues || noticeType == 1) && noticeTitle && noticeContent && noticeWriter &&(noticeEndDate || noEndDateCheckbox.checked)) {
            try {
                const response = await fetch('/EditGroupNotices', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        userPermission: userPermission,
                        functionType: functionType,
                        userToken: userToken,
                        groupToken: groupToken,
                        noticeToken: noticeToken,
                        noticeType: noticeType,
                        noticeTitle: noticeTitle,
                        noticeImportance: noticeImportance,
                        noticeStatus: noticeStatus,
                        noticeContent: noticeContent,
                        noticeWriter: noticeWriter,
                        noticeEndDate: noticeEndDate,
                        noticeCreatedDate: noticeCreatedDate,
                        noticeEditDate: noticeEditDate,
                        noticeDues : noticeDues
                    })
                });

                data = await response.json();

                if (data.result == 0) {
                    alert('다시 시도해주세요!');
                } else if (data.result == 1)  {
                    alert('공지사항을 저장했습니다!');
                    window.location.href = "GroupNoticePage.html";
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
        window.location.href = "GroupNoticePage.html";
    });
    
});
