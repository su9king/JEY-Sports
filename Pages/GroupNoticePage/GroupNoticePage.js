//////////////////// Step0 : 회원인증, 사이드바 ////////////////////
let notices = [];
let noticeContents = [];

window.onload = async function() {
    const page = 'GroupNoticePage';
    userToken = sessionStorage.getItem('userToken');
    groupToken = sessionStorage.getItem('groupToken');
    userPermission = sessionStorage.getItem('userPermission');
    const data = `userToken=${userToken}&groupToken=${groupToken}&userPermission=${userPermission}`;
    
    const response = await certification(page, data);
    
    if (response.result == 0) {
        alert('로그인 후 사용해주세요!');
        window.location.href = '/WarningPage.html';
    } else {
        loadSidebar(page, userPermission, response);

        if (response.resources !== null) {
            notices = response.resources.map(resource => ({
                noticeToken: resource.noticeToken,
                noticeTitle: resource.noticeTitle,
                noticeImportance: resource.noticeImportance,
                noticeStatus: resource.noticeStatus,
                noticeEditDate: resource.noticeEditDate.split('T')[0],
            }));
            displayNotices();  //// 게시글 생성 함수 ////
        }

        addCreateNoticeButton(userPermission);  //// 권한에 따라 수정 ////
    }   

    // 뒤로가기
    document.getElementById('backButton').addEventListener('click', function() {
        window.history.back();
    });
}


//// 게시글 생성 함수 ////
async function displayNotices() {
    const noticeContainer = document.getElementById("notice-container");
    noticeContainer.innerHTML = '';

    notices.forEach(notice => {

        // 비공개 공지사항은 관리자, 창설자만 가능
        if (notice.noticeStatus == false && (userPermission == 0 || userPermission == 3 || userPermission == 4)) {
            return;
        }
    

        //// 게시글 박스 생성
        const noticeBox = document.createElement("div");
        noticeBox.classList.add("noticeBox");
    
        // 게시글 제목 생성
        const noticeTitle = document.createElement("h2");
        noticeTitle.classList.add("notice-title");
        noticeTitle.textContent = notice.noticeTitle;
    
        // 중요도에 따른 제목 색상 설정
        if (notice.noticeImportance === 'True') {
            noticeTitle.style.color = 'red';
        }
    
        // 게시글 정보 생성
        const noticeInfo = document.createElement("div");
        noticeInfo.classList.add("notice-info");

        const importanceText = notice.noticeImportance == true ? '중요' : '일반';
        const statusText = notice.noticeStatus == true ? '공개' : '비공개';

        noticeInfo.innerHTML = `
        마지막 수정일: ${notice.noticeEditDate} | 중요도: ${importanceText} | 상태: ${statusText}
        `;
    
        // 게시글 내용이 들어갈 공간 생성
        const noticeContent = document.createElement("div");
        noticeContent.classList.add("notice-content");
    



        //// 제목 클릭시 작동 - 게시글 형성
        noticeTitle.addEventListener("click", async function() {

            // 내용물 생성 형성 호출
            await displayNoticeContent(notice.noticeToken, noticeContent);
            noticeContent.classList.toggle("open");
    

            // 권한에 따라 삭제, 수정 버튼 추가
            if (userPermission == 2 || userPermission == 1) {
                if (!noticeContent.querySelector(".deleteButton") && !noticeContent.querySelector(".editButton")) {

                    // 삭제버튼 형성
                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "삭제";
                    deleteButton.classList.add("deleteButton");
    
                    deleteButton.addEventListener("click", async function() {
                        const functionType = 2;
                        if (confirm('공지사항을 삭제하시겠습니까?')) {
                            try {
                                const response = await fetch('/EditGroupNotices', {
                                    method: 'POST',
                                    headers: {'Content-Type': 'application/json'},
                                    body: JSON.stringify({ functionType: functionType, groupToken: groupToken, userToken: userToken, noticeToken: notice.noticeToken, userPermission: userPermission })
                                });
    
                                data = await response.json();
    
                                if (data.result == 1) {
                                    alert('공지사항이 삭제되었습니다!');
                                    window.location.reload(); // 삭제 후 페이지 새로고침
                                } else if (data.result == 0)  {
                                    alert('다시 시도해주세요');
                                } else {
                                    alert('관리자에게 문의해주세요')
                                }
                            } catch (error) {
                                console.error('Error:', error);
                            }
                        }
                    });
    

                    // 수정버튼 형성
                    const editButton = document.createElement("button");
                    editButton.textContent = "수정";
                    editButton.classList.add("editButton");
    
                    editButton.addEventListener("click", function() {
                        //// noticeContent 찾기
                        const noticeDetails = noticeContents.find(n => n.noticeToken === notice.noticeToken);
                        
                        if (noticeDetails) {
                            window.location.href = `CreateGroupNoticePage.html?noticeTitle=${notice.noticeTitle}&noticeImportance=${notice.noticeImportance}&noticeStatus=${notice.noticeStatus}&noticeContent=${noticeDetails.noticeContent}&noticeEndDate=${noticeDetails.noticeEndDate}&noticeWriter=${noticeDetails.noticeWriter}&noticeToken=${noticeDetails.noticeToken}`;
                        } else {
                            alert('공지사항 내용을 불러오지 못했습니다. 제목을 클릭해 주세요.');
                        }
                    });
    
                    noticeContent.appendChild(deleteButton);
                    noticeContent.appendChild(editButton);
                }
            }
        });
    
        noticeBox.appendChild(noticeTitle);
        noticeBox.appendChild(noticeInfo);
        noticeBox.appendChild(noticeContent);
        noticeContainer.appendChild(noticeBox);
    });
    
}

//// 제목 클릭하면 내용 생성 ////
async function displayNoticeContent(noticeToken, noticeContentElement) {
    const functionType = 1;
    const userToken = sessionStorage.getItem('userToken');
    const groupToken = sessionStorage.getItem('groupToken');

    try {
        const response = await fetch('/EditGroupNotices', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ functionType: functionType, userToken: userToken, groupToken: groupToken, noticeToken: noticeToken, userPermission: userPermission })
        });

        const contentData = await response.json();

        if (contentData.result == 1) {
            contentData.resources.forEach(resource => {
                noticeContents.push({
                    noticeToken: noticeToken,
                    noticeContent: resource.noticeContent,
                    noticeWriter: resource.noticeWriter,
                    noticeCreatedDate: resource.noticeCreatedDate ? resource.noticeCreatedDate.split('T')[0] : null,
                    noticeEndDate: resource.noticeEndDate ? resource.noticeEndDate.split('T')[0] : null,       
                });
            });

            //// noticeContents 찾기
            const notice = noticeContents.find(n => n.noticeToken === noticeToken);

            const endDateText = notice.noticeEndDate ? notice.noticeEndDate : '없음';

            noticeContentElement.innerHTML = `
                <div class="notice-info">
                    작성자: ${notice.noticeWriter}
                </div>
                <div class="notice-dates">
                    작성일: ${notice.noticeCreatedDate} | 종료일: ${endDateText}
                </div>
                <div class="notice-textContent">
                    ${notice.noticeContent}
                </div>
            `;

        } else if (data.result == 0)  {
            alert('공지사항을 불러오지 못했습니다.');
        } else {
            alert('관리자에게 문의해주세요')
        }
    } catch (error) {
        console.error('Error:', error);
    }

}



//// 공지사항 추가 버튼 생성(권한 제한을 위해 함수화) ////
function addCreateNoticeButton(userPermission) {
    if (userPermission == 2 || userPermission == 1) {
        const createButtonContainer = document.createElement("div");
        createButtonContainer.classList.add("create-button-container");

        const createButton = document.createElement("button");
        createButton.textContent = "공지사항 작성하기";
        createButton.classList.add("create-button");
        createButton.addEventListener("click", function() {
            window.location.href = 'CreateGroupNoticePage.html';
        });

        createButtonContainer.appendChild(createButton);

        document.body.insertBefore(createButtonContainer, document.body.firstChild);
    }
}

