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
                userPermission: resource.userPermission
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

    const repuestGroupBtn = document.getElementById('repuestGroup');
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
    const buttonContainer = document.getElementById('button-container');
    buttonContainer.innerHTML = '';

    console.log(groups.length)
    if (groups.length === 0) {
        
        const noGroups = document.createElement('div');
        noGroups.innerHTML = `
        <h1>참여중인 조직이 없습니다!</h1>
        `
        buttonContainer.appendChild(noGroups)
    }
    
    groups.forEach((group, index) => {
        const button = document.createElement('button');
        button.classList.add("btn");
        button.textContent = `Button ${group['groupName']}`;

        if (group['userPermission'] == 2) {
            button.style.backgroundColor = 'yellow';
        }

        button.addEventListener('click', () => {
            alert(`group ${group['groupName']} selected`);
            sessionStorage.setItem('groupToken', group['groupToken'] );
            sessionStorage.setItem('userPermission', group['userPermission'] );
            sessionStorage.setItem('groupName', group['groupName'] );
            window.location.href = '/GroupMainPage/GroupMainPage.html'; 
        });
        buttonContainer.appendChild(button);
    });
}


//////////////////// 초대 받은 그룹 표시 ////////////////////
function createInvitedGroups(invitedGroups) {
    const invitedGroupsContainer = document.getElementById('invitedGroups-container');
    invitedGroupsContainer.innerHTML = '';

    invitedGroups.forEach(group => {
        const groupBox = document.createElement("div");
        groupBox.classList.add("groupBox");

        // 그룹 정보
        const groupInfo = document.createElement("div");
        groupInfo.classList.add("group-info");
        groupInfo.innerHTML = `
            <h2 class="group-name">${group.groupName}</h2>
        `;

        // 참여와 거절 버튼을 담을 컨테이너
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");

        // 참여 버튼
        const joinButton = document.createElement("button");
        joinButton.textContent = "참여";
        joinButton.classList.add("basicBtn", "join-button");
        joinButton.addEventListener("click", async function() {
            if (confirm(`${group.groupName}에 참여하시겠습니까?`)) {
                try {
                    const response = await fetch('/JoinGroup', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ functionType: 3, groupToken: group.groupToken, userToken: userToken })
                    });

                    const data = await response.json();

                    if (data.result == 0) {
                        alert('다시 시도해주세요!');
                    } else if (data.result == 1) {
                        alert(`${group.groupName}에 참여하였습니다!`);
                        location.reload();
                    } else {
                        alert('관리자에게 문의해주세요')
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        });

        // 거절 버튼
        const declineButton = document.createElement("button");
        declineButton.textContent = "거절";
        declineButton.classList.add("basicBtn", "decline-button");
        declineButton.addEventListener("click", async function() {
            if (confirm(`${group.groupName}의 초대를 거절하시겠습니까?`)) {
                try {
                    const response = await fetch('/RefuseMember', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ functionType: 3, groupToken: group.groupToken, userToken: userToken })

                    });

                    const data = await response.json();

                    if (data.result == 0) {
                        alert('다시 시도해주세요!');
                    } else if (data.result == 1) {
                        alert(`${group.groupName}의 초대를 거절하였습니다!`);
                        location.reload();
                    } else {
                        alert('관리자에게 문의해주세요')
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        });

        buttonContainer.appendChild(joinButton);
        buttonContainer.appendChild(declineButton);
        groupBox.appendChild(groupInfo);
        groupBox.appendChild(buttonContainer);
        invitedGroupsContainer.appendChild(groupBox);
    });
}


//////////////////// 참여 요청한 그룹 표시 ////////////////////
function createRequestGroups(requestGroups) {
    const requestGroupsContainer = document.getElementById('requestGroups-container');
    requestGroupsContainer.innerHTML = '';

    requestGroups.forEach(group => {
        const groupBox = document.createElement("div");
        groupBox.classList.add("groupBox");

        // 그룹 정보
        const groupInfo = document.createElement("div");
        groupInfo.classList.add("group-info");
        groupInfo.innerHTML = `
            <h2 class="group-name">${group.groupName}</h2>
        `;

        // 취소 버튼을 담을 컨테이너
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");

        // 취소 버튼
        const cancelButton = document.createElement("button");
        cancelButton.textContent = "취소하기";
        cancelButton.classList.add("basicBtn", "cancel-button");
        cancelButton.addEventListener("click", async function() {
            if (confirm(`${group.groupName}의 요청을 취소하시겠습니까?`)) {
                try {
                    const response = await fetch('/RefuseMember', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ functionType: 4, groupToken: group.groupToken, userToken: userToken })
                    });

                    const data = await response.json();

                    if (data.result == 0) {
                        alert('다시 시도해주세요!');
                    } else if (data.result == 1) {
                        alert(`${group.groupName}의 요청을 취소하였습니다.`);
                        location.reload();
                    } else {
                        alert('관리자에게 문의해주세요')
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        });

        buttonContainer.appendChild(cancelButton);
        groupBox.appendChild(groupInfo);
        groupBox.appendChild(buttonContainer);
        requestGroupsContainer.appendChild(groupBox);
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
                    }

                } else {
                    alert("참여하고 싶은 조직의 PW를 작성해주세요!");
                }
            });


		})

		.catch(error => console.error('Error loading template:', error));



		
}

