let groups = [];
let invitedGroups = [];
let requestGroups = [];
let ws = new WebSocket('wss://jeysport.codns.com');

ws.onmessage = function(event) {
    const messagesList = document.getElementById('messages');
    const newMessage = document.createElement('li');
    newMessage.textContent = event.data;
    messagesList.appendChild(newMessage);
};


window.onload = async function() {
    const page = 'PrivatePage';
    userToken = sessionStorage.getItem('userToken')
    const data = `userToken=${userToken}`
    const response = await certification(page, data);

    const userImage = sessionStorage.getItem('userImage');
    const profileImage = document.getElementById('profileImage');
    profileImage.src = userImage == 'null' ? `/UserImages/NULL.jpg` : `/UserImages/${userImage}`;
    
    if (response.result == 0) {
        alert('로그인 후 사용해주세요!');
        window.location.href = '/WarningPage.html';
    } else if (response.result == 1) {

        const userPermission = 0;
        loadSidebar(page, userPermission, response);


        response.resources.forEach(resource => {
            const buffer = {
                groupToken: resource.groupToken,
                groupName: resource.groupName,
                userPermission: resource.userPermission,
                groupImage :  resource.groupImage
            }
        
            if (resource.userPermission == 0 || resource.userPermission == 1 || resource.userPermission == 2) {
                groups.push(buffer);
            } else if (resource.userPermission == 3) {
                invitedGroups.push(buffer);
            } else if (resource.userPermission == 4) {
                requestGroups.push(buffer);
            }
        });
        
        createGroupsButtons(groups);
        createInvitedGroups(invitedGroups);
        createRequestGroups(requestGroups);
        ws.send("사용자가 접속하였습니다.")

        

    }
    

}

//////////////////// 조직 생성 버튼, 조직 검색 버튼 이벤트 추가 ////////////////////
document.addEventListener('DOMContentLoaded', function() {

    const createGroupBtn = document.getElementById('createGroup');
    createGroupBtn.addEventListener('click', createGroupPage);

    const repuestGroupBtn = document.getElementById('requestGroup');
    repuestGroupBtn.addEventListener('click', requestGroup);

})

// 조직 생성 버튼 함수 //
function createGroupPage() {
    window.location.href = '/CreateGroupPage/CreateGroupPage.html'
}

// 조직 참여 요청 버튼 함수 //
function requestGroup() {
    const overlay = document.getElementById('overlay');
	const requestGroupModal = document.getElementById('requestGroupModal');
    
    overlay.classList.remove('hidden');
    overlay.classList.add('visible');
    requestGroupModal.classList.remove('hidden');
    requestGroupModal.classList.add('visible');
    loadRequestGroupModal();
}



//////////////////// 참여중인 그룹 참여 버튼 ////////////////////
function createGroupsButtons(groups) {
    const buttonContainer = document.getElementById('joinedGroups-container');
    buttonContainer.innerHTML = '';

    console.log(groups.length);
    if (groups.length === 0) {
        const noGroups = document.createElement('div');
        noGroups.innerHTML = `
        <h1>참여중인 조직이 없습니다!</h1>
        `;
        buttonContainer.appendChild(noGroups);
        return; // 그룹이 없을 경우 함수 종료
    }

    groups.forEach((group) => {
        const buttonWrapper = document.createElement('div');
        buttonWrapper.classList.add('button-wrapper'); // button-wrapper 클래스 추가

        const button = document.createElement('button');
        button.classList.add("Gbtn");
        
        // 이미지 요소 생성
        const img = document.createElement('img');
        if (group["groupImage"] === null) {
            img.src = '/GroupImages/NULL.png'; // 기본 이미지 경로
        } else {
            img.src = `/GroupImages/${group["groupImage"]}`; // 실제 이미지 경로
        }
        img.alt = group['groupName']; // 이미지 설명으로 groupName 설정
        img.classList.add('button-image'); // 이미지 클래스 추가

        // span 요소 생성
        const span = document.createElement('span');
        
        // 소속된 조직 여부에 따라 왕관 이모티콘 추가
        if (group['userPermission'] == 2) { // 해당 코드가 true라면, 본인의 조직임.
            const crownIcon = '👑'; // 왕관 이모티콘
            span.innerHTML = `${crownIcon} ${group['groupName']}`; // 왕관과 groupName을 함께 설정
        } else {
            span.textContent = group['groupName']; // groupName을 span에 설정
        }
        button.style.border = '2px solid black'; // 테두리 색깔 검정색

        button.addEventListener('click', () => {
            alert(`group ${group['groupName']} selected`);
            sessionStorage.setItem('groupToken', group['groupToken']);
            sessionStorage.setItem('userPermission', group['userPermission']);
            sessionStorage.setItem('groupName', group['groupName']);
            window.location.href = '/GroupMainPage/GroupMainPage.html'; 
        });

        // buttonWrapper에 버튼, 이미지, span 추가
        buttonWrapper.appendChild(button);
        button.appendChild(img); // 버튼 안에 이미지 추가
        button.appendChild(span); // 버튼 안에 span 추가

        buttonContainer.appendChild(buttonWrapper); // button-wrapper를 buttonContainer에 추가
    });
}





//////////////////// 초대 받은 그룹 표시 ////////////////////
function createInvitedGroups(invitedGroups) {
    const invitedGroupsContainer = document.getElementById('invitedGroups-container');
    invitedGroupsContainer.innerHTML = '';

    if (invitedGroups.length === 0) {
        //invitedGroupsContainer.appendChild(noInvitedGroups);
        return; // 그룹이 없을 경우 함수 종료
    }

    invitedGroups.forEach(group => {
        const buttonWrapper = document.createElement('div');
        buttonWrapper.classList.add('button-wrapper'); // button-wrapper 클래스 추가
        buttonWrapper.style.position = 'relative'; // relative로 설정

        const button = document.createElement('button');
        button.classList.add("Gbtn");
        button.style.border = '2px solid green'; // 버튼 테두리 색깔 설정

        // 이미지 요소 생성 (반투명 처리)
        const img = document.createElement('img');
        if (group["groupImage"] === null) {
            img.src = '/GroupImages/NULL.png'; // 기본 이미지 경로
        } else {
            img.src = `/GroupImages/${group["groupImage"]}`; // 실제 이미지 경로
        }
        img.alt = group['groupName']; // 이미지 설명으로 groupName 설정
        img.classList.add('button-image'); // 이미지 클래스 추가
        img.style.opacity = '0.5'; // 반투명 처리

        // 초대됨 텍스트 생성
        const inviteText = document.createElement('span');
        inviteText.textContent = "초대됨";
        inviteText.style.position = 'absolute'; // 절대 위치 설정
        inviteText.style.top = '40%'; // 중앙에서 30% 위로 이동
        inviteText.style.left = '50%'; // 중앙 정렬 (가로)
        inviteText.style.transform = 'translate(-50%, -50%)'; // 중앙 정렬을 위한 변환
        inviteText.style.fontWeight = 'bold'; // 굵게
        inviteText.style.fontSize = '16px'; // 글씨 크기 조정

        // span 요소 생성
        const span = document.createElement('span');
        span.textContent = group['groupName']; // groupName을 span에 설정

        button.addEventListener('click', async () => {
            const action = confirm(`${group.groupName}에 참여하시겠습니까?`) ? '참여' : confirm(`${group.groupName}의 초대를 거절하시겠습니까?`) ? '거절' : '취소';
            if (action === '참여') {
                // 참여 처리
                try {
                    const response = await fetch('/JoinGroup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ functionType: 3, groupToken: group.groupToken, userToken: userToken })
                    });

                    const data = await response.json();

                    if (data.result == 0) {
                        alert('다시 시도해주세요!');
                    } else if (data.result == 1) {
                        alert(`${group.groupName}에 참여하였습니다!`);
                        location.reload();
                    } else {
                        alert('관리자에게 문의해주세요');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            } else if (action === '거절') {
                // 거절 처리
                try {
                    const response = await fetch('/RefuseMember', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ functionType: 3, groupToken: group.groupToken, userToken: userToken })
                    });

                    const data = await response.json();

                    if (data.result == 0) {
                        alert('다시 시도해주세요!');
                    } else if (data.result == 1) {
                        alert(`${group.groupName}의 초대를 거절하였습니다!`);
                        location.reload();
                    } else {
                        alert('관리자에게 문의해주세요');
                    }
                } catch (error) {
                        console.error('Error:', error);
            }

            } else {
                alert('취소되었습니다.');
            }
        });

        // buttonWrapper에 버튼, 이미지, span 추가
        buttonWrapper.appendChild(button);
        button.appendChild(img); // 버튼 안에 이미지 추가
        button.appendChild(span); // 버튼 안에 span 추가
        buttonWrapper.appendChild(inviteText); // 버튼 위에 초대됨 텍스트 추가

        // 초대받은 그룹의 버튼을 invitedGroupsContainer에 추가
        invitedGroupsContainer.appendChild(buttonWrapper);
    });
}








//////////////////// 참여 요청한 그룹 표시 ////////////////////
function createRequestGroups(requestGroups) {
    const requestGroupsContainer = document.getElementById('requestGroups-container');
    requestGroupsContainer.innerHTML = '';
    console.log
    requestGroups.forEach(group => {
        const buttonWrapper = document.createElement('div');
        buttonWrapper.classList.add('button-wrapper'); // button-wrapper 클래스 추가
        buttonWrapper.style.position = 'relative'; // relative로 설정

        const button = document.createElement('button');
        button.classList.add("Gbtn");
        button.style.border = '2px solid #dfa830'; // 버튼 테두리 색깔 설정

        // 이미지 요소 생성 (반투명 처리)
        const img = document.createElement('img');
        if (group["groupImage"] === null) {
            img.src = '/GroupImages/NULL.png'; // 기본 이미지 경로
        } else {
            img.src = `/GroupImages/${group["groupImage"]}`; // 실제 이미지 경로
        }
        img.alt = group['groupName']; // 이미지 설명으로 groupName 설정
        img.classList.add('button-image'); // 이미지 클래스 추가
        img.style.opacity = '0.5'; // 반투명 처리

        // "참가"와 "대기중" 텍스트 생성
        const waitingText = document.createElement('div');
        waitingText.style.position = 'absolute'; // 절대 위치 설정
        waitingText.style.top = '40%'; // 중앙에서 30% 위로 이동
        waitingText.style.left = '50%'; // 중앙 정렬 (가로)
        waitingText.style.transform = 'translate(-50%, -50%)'; // 중앙 정렬을 위한 변환
        waitingText.style.fontWeight = 'bold'; // 굵게
        waitingText.style.fontSize = '16px'; // 글씨 크기 조정
        waitingText.innerHTML = `참가<br>대기중`; // 줄바꿈 추가

        // 조직 이름 텍스트 생성
        const span = document.createElement('span');
        span.textContent = group['groupName']; // groupName을 span에 설정
        span.style.display = 'block'; // 블록 요소로 설정
        span.style.textAlign = 'center'; // 중앙 정렬
        span.style.marginTop = '10px'; // 이미지와 텍스트 간격 조정
        span.style.fontSize = '16px'; // 글씨 크기 조정

        // 버튼 클릭 이벤트
        button.addEventListener('click', async () => {
            const action = confirm(`${group.groupName}의 참여 요청을 취소하시겠습니까?`) ? '취소' : '취소하지 않음';
            if (action === '취소') {
                try {
                    const response = await fetch('/RefuseMember', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ functionType: 4, groupToken: group.groupToken, userToken: userToken })
                    });

                    const data = await response.json();

                    if (data.result == 0) {
                        alert('다시 시도해주세요!');
                    } else if (data.result == 1) {
                        alert(`${group.groupName}의 요청을 취소하였습니다.`);
                        location.reload();
                    } else {
                        alert('관리자에게 문의해주세요');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            } else {
                alert('취소되지 않았습니다.');
            }
        });

        // buttonWrapper에 버튼, 이미지, 텍스트 추가
        buttonWrapper.appendChild(button);
        button.appendChild(img); // 버튼 안에 이미지 추가
        button.appendChild(waitingText); // 버튼 위에 "참가"와 "대기중" 텍스트 추가
        button.appendChild(span); // 버튼 안에 조직 이름 추가

        // 참여 요청한 그룹의 버튼을 requestGroupsContainer에 추가
        requestGroupsContainer.appendChild(buttonWrapper);
    });
}







/////////////////////////////////// 참여 요청 모달 열기 ///////////////////////////////////
function loadRequestGroupModal() {
	fetch('RequestGroupModal.html') 
		.then(response => response.text())
		.then(data => {
			const requestGroupModal = document.getElementById('requestGroupModal');
			requestGroupModal.innerHTML = data;

			// 모달 닫기 버튼 이벤트 추가
			const closeModalBtn = requestGroupModal.querySelector('#closeModalBtn');
			if (closeModalBtn) {
				closeModalBtn.addEventListener('click', function() {
					const overlay = document.getElementById('overlay');
					overlay.classList.remove('visible');
					overlay.classList.add('hidden');
					requestGroupModal.classList.remove('visible');
					requestGroupModal.classList.add('hidden');
				});
			}

			// 모든 label 요소에 클릭 이벤트를 방지하는 핸들러 추가
			const labels = document.querySelectorAll('label');
			labels.forEach(label => {
				label.addEventListener('click', function(e) {
					e.preventDefault(); // 클릭 이벤트 기본 동작 방지
				});
			});


            // groupID 검색
            const groupIDBtn = document.getElementById("groupIDBtn");
            const groupPWSection = document.getElementById("groupPWSection");

            groupIDBtn.addEventListener("click", async function() {
                const groupID = document.getElementById("groupID").value;
                
                
                if (groupID) {
                    const functionType = 1;

                    try {
                        const response = await fetch('/JoinGroup', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ functionType: functionType, userToken: userToken, groupID: groupID })
                        });

                        const data = await response.json();

                        if (data.result == 0) {
                            alert('없는 ID 입니다!');
                            groupPWSection.classList.add('hidden');
                            document.getElementById("groupID").value = '';
                        } else if (data.result == 1) {
                            groupPWSection.classList.remove('hidden');
                        } else {
                            alert('다시 시도해주세요!');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }

                } else {
                    alert("참여하고 싶은 조직의 ID를 입력해주세요!");
                }
            });

            // 조직 비밀번호 작성
            const groupPWBtn = document.getElementById("groupPWBtn");
            groupPWBtn.addEventListener("click", async function() {
                const groupPW = document.getElementById("groupPW").value;
                const groupID = document.getElementById("groupID").value;

                if (groupPW) {
                    const functionType = 2;

                    try {
                        const response = await fetch('/JoinGroup', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ functionType: functionType, userToken: userToken, groupID: groupID, groupPW: groupPW })
                        });

                        const data = await response.json();

                        if (data.result == 0) {
                            alert('다시 시도해주세요!');
                        } else if (data.result == 1) {
                            alert(`참여 요청이 완료되었습니다!`);
                            location.reload();
                        } else {
                            alert('관리자에게 문의해주세요')
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        alert("이미 초대받았거나, 참여 대기중이거나, 소속된 조직입니다.")
                    }

                } else {
                    alert("참여하고 싶은 조직의 PW를 작성해주세요!");
                }
            });


		})

		.catch(error => console.error('Error loading template:', error));



		
}

