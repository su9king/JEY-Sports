//////////////////// Step0 : 회원인증, 사이드바 ////////////////////
let members = [];
let notUserMembers = [];
let participateRequest = [];

window.onload = async function() {
	const page = 'GroupMemberPage';
	userToken = sessionStorage.getItem('userToken');
	groupToken = sessionStorage.getItem('groupToken');
	userPermission = sessionStorage.getItem('userPermission');
	const data = `userToken=${userToken}&groupToken=${groupToken}&userPermission=${userPermission}`;
	
	response = await certification(page, data);
	
	if (response.result == 0) {
		alert('로그인 후 사용해주세요!');
		window.location.href = '/WarningPage.html';
		return;
	}
	
	loadSidebar(page, userPermission, response);


	// buffer에 잠깐 저장했다가 권한에 따라 리스트 따로 생성
	response.resources[0].forEach(resource => {
		const buffer = {
			userID: resource.userID,
			userImage: resource.userImage,
			userName: resource.userName,
			userPermission: resource.userPermission,
			userAttentionRate: resource.userAttentionRate,
			userPhone: resource.userPhone,
		};
	

		// 모두에게 보여줄 멤버 리스트와 관리자들이 볼 요청멤버 리스트 분리
		
		if (resource.userPermission == 0 || resource.userPermission == 1 || resource.userPermission == 2) {
			members.push(buffer);
		} else if (resource.userPermission == 3 || resource.userPermission == 4 || resource.userPermission == 5) {
			participateRequest.push(buffer);
		}
	});

    if ( response.resources[1] != null ) {
        response.resources[1].forEach(resource => {
            const buffer = {
                notUserToken : resource.notUserToken ,
                userName: resource.userName,
                userPhone: resource.userPhone,
            };

            notUserMembers.push(buffer);
        });
    }
	
	displayMembers();  //// 멤버 리스트 생성 함수 ////

	// 뒤로가기 버튼에 이벤트 추가
	document.getElementById('backButton').addEventListener('click', function() {
		window.history.back();
	});
}

// 권한 레이블 정의
const permissionLabels = {
	0: '유저',
	1: '관리자',
	2: '창설자',
	3: '초대받은 상태',
	4: '참가 대기중',
	5: '제명'
};

function getPermissionLabel(permission) {
	return permissionLabels[permission] || '알 수 없음';
}

// 권한 순서 정의
const permissionOrder = [2, 1, 0];

function getPermissionRank(permission) {
	return permissionOrder.indexOf(permission);
}

//// 멤버 리스트 생성 함수 ////
async function displayMembers() {
	const memberContainer = document.getElementById("member-container");
	memberContainer.innerHTML = '';

	// 권한 순서에 따라 멤버 정렬
	members.sort((a, b) => getPermissionRank(a.userPermission) - getPermissionRank(b.userPermission));

	members.forEach(member => {
		const memberBox = document.createElement("div");
		memberBox.classList.add("memberBox");

		// 프로필 사진
		const memberImage = document.createElement("img");
		memberImage.src = member.userImage ? `/UserImages/${member.userImage}` : `/UserImages/NULL.jpg`;
		memberImage.alt = `${member.userName}의 프로필 사진`;
		memberImage.classList.add("member-image");

		// 회원 정보
		const memberInfo = document.createElement("div");
		memberInfo.classList.add("member-info");
		memberInfo.innerHTML = `
			<h2 class="member-name">${member.userName}</h2>
			<p class="member-Permission">등급: ${getPermissionLabel(member.userPermission)}</p>
			<p class="member-AttentionRate">참석률: ${member.userAttentionRate}%</p>
			<p class="member-Phone">휴대폰 번호: ${member.userPhone}</p>
		`;

		// 삭제 버튼, 권한 변경 버튼을 담을 컨테이너 지정
		const buttonContainer = document.createElement("div");
		buttonContainer.classList.add("button-container");



		// 멤버 권한 변경 버튼
		if (userPermission == 2) {
			const permissionSelect = document.createElement("select");  //////////// 드롭박스 생성
			permissionSelect.classList.add("permission-select");

			const options = [
				{ value: '5', text: '일반회원' },
				{ value: '6', text: '관리자' },
				{ value: '7', text: '창설자' }
			];

			options.forEach(optionData => {
				const option = document.createElement("option");
				option.value = optionData.value;
				option.textContent = optionData.text;
				permissionSelect.appendChild(option);
			});

			const changePermissionButton = document.createElement("button");  //////////// 변경 버튼 생성
			changePermissionButton.textContent = "권한 변경";
			changePermissionButton.classList.add("basicBtn", "change-permission-button");
			changePermissionButton.addEventListener("click", async function() {
				const selectedValue = permissionSelect.value;
				const selectedText = options.find(opt => opt.value == selectedValue).text;

				
				if (confirm(`${selectedText}로 권한을 변경하시겠습니까?`)) {
					try {
						const response = await fetch('/EditGroupMembers', {
							method: 'POST',
							headers: {'Content-Type': 'application/json'},
							body: JSON.stringify({ functionType: selectedValue, userToken: userToken, groupToken: groupToken, userPermission: userPermission, userID: member.userID,  })
						});
			
						data = await response.json();
			
						if (data.result == 0) {
							alert('다시 시도해주세요!')
						} else {
							alert(`멤버의 권한이 ${selectedText}(functionType == ${selectedValue})으로 변경되었습니다!`);
							location.reload();
						}
					} catch (error) {
						console.error('Error:', error);
					}
				} else {
					alert('권한 변경이 취소되었습니다.');
				}
			});

			buttonContainer.appendChild(permissionSelect);
			buttonContainer.appendChild(changePermissionButton);
		}

		// 멤버 삭제 버튼
		if (userPermission == 1 || userPermission == 2) {
			const deleteButton = document.createElement("button");  //////////// 삭제버튼 생성
			deleteButton.textContent = "삭제";
			deleteButton.classList.add("basicBtn", "delete-button");
			deleteButton.addEventListener("click", async function() {
				if (confirm(`정말 ${member.userName}을 삭제하시겠습니까?`)) {
					try {
						const functionType = 1;

						const response = await fetch('/EditGroupMembers', {
							method: 'POST',
							headers: {'Content-Type': 'application/json'},
							body: JSON.stringify({ functionType: functionType, userToken: userToken, userID: member.userID, groupToken: groupToken, userPermission: userPermission })
						});
			
						data = await response.json();
			
						if (data.result == 0) {
							alert('다시 시도해주세요!')
						} else {
							alert(`삭제할 멤버의 userID: ${member.userID} 삭제 완료`);
							location.reload();
						}
					} catch (error) {
						console.error('Error:', error);
					}
				}
			});
			buttonContainer.appendChild(deleteButton);
		}

		memberBox.appendChild(memberImage);
		memberBox.appendChild(memberInfo);
		memberBox.appendChild(buttonContainer); // 버튼 컨테이너 추가
		memberContainer.appendChild(memberBox);
	});



	//////////////////////////////////////// 비유저 ///////////////////////////////////////
	notUserMembers.forEach(member => {
		const notUserMemberBox = document.createElement("div");
		notUserMemberBox.classList.add("memberBox");

		const notUserMemberMangeBtn = document.createElement("div");
		notUserMemberMangeBtn.classList.add("notUser-management-button");

		// 회원 정보
		const memberInfo = document.createElement("div");
		memberInfo.classList.add("member-info");
		memberInfo.innerHTML = `
			<h2 class="member-name">${member.userName}</h2>
			<p class="member-Phone">휴대폰 번호: ${member.userPhone}</p>
		`;

		// 삭제 버튼, 권한 변경 버튼을 담을 컨테이너 지정
		const buttonContainer = document.createElement("div");
		buttonContainer.classList.add("button-container");



		// 비유저 정보 수정 버튼
		if (userPermission == 1 || userPermission == 2) {
			const overlay = document.getElementById('overlay2');
			const notUserMemberManageModal = document.getElementById('notUserMemberManageModal');

			const managementModalBtn = document.createElement("button");
			managementModalBtn.textContent = "정보 수정";
			managementModalBtn.classList.add("btn");

			managementModalBtn.addEventListener('click', function() {
				overlay.classList.remove('hidden');
				overlay.classList.add('visible');
				notUserMemberManageModal.classList.remove('hidden');
				notUserMemberManageModal.classList.add('visible');
				loadnotUserMemberManageModal(member.notUserToken, member.userName, member.userPhone);  // 버튼이 클릭될 때 템플릿을 로드; html 요소들이 늦게 도착해서 인식하지 못하는 버그 대비
			});

			buttonContainer.appendChild(managementModalBtn);
		}

		// 비유저 멤버 삭제 버튼
		if (userPermission == 1 || userPermission == 2) {
			const deleteButton = document.createElement("button");  //////////// 삭제버튼 생성
			deleteButton.textContent = "삭제";
			deleteButton.classList.add("basicBtn", "delete-button");
			deleteButton.addEventListener("click", async function() {
				if (confirm(`정말 ${member.userName}을 삭제하시겠습니까?`)) {
					try {
						const functionType = 2;

						const response = await fetch('/DeleteUser', {
							method: 'POST',
							headers: {'Content-Type': 'application/json'},
							body: JSON.stringify({ functionType: functionType, userToken: userToken, notUserToken: member.notUserToken, groupToken: groupToken, userPermission: userPermission })
						});
			
						data = await response.json();
			
						if (data.result == 0) {
							alert('다시 시도해주세요!')
						} else if (data.result == 1) {
							alert(`삭제할 멤버의 userID: ${member.userName} 삭제 완료`);
							location.reload();
						}
					} catch (error) {
						console.error('Error:', error);
					}
				}
			});
			buttonContainer.appendChild(deleteButton);
		}

		notUserMemberBox.appendChild(memberInfo);
		notUserMemberBox.appendChild(buttonContainer);
		memberContainer.appendChild(notUserMemberBox);
	});


}



////////////// 비유저 수정 모달 열기 //////////////
function loadnotUserMemberManageModal(notUserToken, OGuserName, OGuserPhone) {
	fetch('GroupNotUserMemberMange.html') 
		.then(response => response.text())
		.then(data => {
			const notUserMemberManageModal = document.getElementById('notUserMemberManageModal');
			notUserMemberManageModal.innerHTML = data;

			// 모달 닫기 버튼 이벤트 추가
			const closeModalBtn = notUserMemberManageModal.querySelector('#closeModalBtn');
			if (closeModalBtn) {
				closeModalBtn.addEventListener('click', function() {
					const overlay = document.getElementById('overlay');
					overlay.classList.remove('visible');
					overlay.classList.add('hidden');
					notUserMemberManageModal.classList.remove('visible');
					notUserMemberManageModal.classList.add('hidden');
				});
			}

			// 모든 label 요소에 클릭 이벤트를 방지하는 핸들러 추가
			const labels = document.querySelectorAll('label');
			labels.forEach(label => {
				label.addEventListener('click', function(e) {
					e.preventDefault(); // 클릭 이벤트 기본 동작 방지
				});
			});

			document.getElementById("userName").value = OGuserName;
			document.getElementById("userPhone").value = OGuserPhone;

			// 비유저 멤버 이름 수정 버튼 클릭 이벤트 추가
			const userNameBtn = document.getElementById("userNameBtn");
			userNameBtn.addEventListener("click", async function() {
				const userName = document.getElementById("userName").value;
				
				console.log(OGuserName);

				if (userName !== OGuserName) {
					
					const functionType = 5;

					try {
						const response = await fetch('/ChangeNormalData', {
							method: 'POST',
							headers: {'Content-Type': 'application/json'},
							body: JSON.stringify({ functionType: functionType, notUserToken: notUserToken, userToken: userToken, setKey: 'userName', setValue: userName,  groupToken: groupToken, userPermission: userPermission })
						});
			
						data = await response.json();
			
						if (data.result == 0) {
							alert('다시 시도해주세요!')
						} else if (data.result == 1) {
							alert('이름이 변경되었습니다!');
							location.reload();
						}
					} catch (error) {
						console.error('Error:', error);
					}
					
				} else {
					alert("비유저 회원의 새로운 이름을 입력해주세요!");
				}
			});



			// 비유저 멤버 이름 수정 버튼 클릭 이벤트 추가
			const userPhoneBtn = document.getElementById("userPhoneBtn");
			userPhoneBtn.addEventListener("click", async function() {
				const userPhone = document.getElementById("userPhone").value;

				if (!/^\d{10,11}$/.test(userPhone)) {  // 작성 형태 제한
					alert('전화번호는 숫자만 입력해주세요! \nex)01012345678');
					document.getElementById('userPhone').value = '';
					return;
				}
				
				if (userPhone !== OGuserPhone) {
					
					const functionType = 5;

					try {
						const response = await fetch('/ChangeNormalData', {
							method: 'POST',
							headers: {'Content-Type': 'application/json'},
							body: JSON.stringify({ functionType: functionType, notUserToken: notUserToken, userToken: userToken, setKey: 'userPhone', setValue: userPhone,  groupToken: groupToken, userPermission: userPermission })
						});
			
						data = await response.json();
			
						if (data.result == 0) {
							alert('다시 시도해주세요!')
						} else if (data.result == 1) {
							alert(`전화번호 변경 완료!`);
							location.reload();
						}
					} catch (error) {
						console.error('Error:', error);
					}
					
				} else {
					alert("비유저 회원의 새로운 전화번호를 입력해주세요!");
				}
			});

		})

		.catch(error => console.error('Error loading template:', error));



		
}





document.addEventListener('DOMContentLoaded', function() {

	const userPermission = sessionStorage.getItem('userPermission');
	addMemberManagementButtons(userPermission);

		// 조직 탈퇴하기 버튼 
	const leaveGroupBtn = document.getElementById("leaveGroupBtn");
	leaveGroupBtn.addEventListener("click", leaveGroup);

});



///////////////////////////// 멤버 추가 버튼 /////////////////////////////
// 멤버 관리 버튼 생성 (권한 제한을 위해 함수화)
function addMemberManagementButtons(userPermission) {
	
	if (userPermission == 2 || userPermission == 1) {
		const managementButtonContainer = document.querySelector(".management-button-container");

		const overlay = document.getElementById('overlay');
		const memberManageModal = document.getElementById('memberManageModal');

		const managementModalBtn = document.createElement("button");
		managementModalBtn.textContent = "회원 초대";
		managementModalBtn.classList.add("btn");

		managementModalBtn.addEventListener('click', function() {
			overlay.classList.remove('hidden');
			overlay.classList.add('visible');
			memberManageModal.classList.remove('hidden');
			memberManageModal.classList.add('visible');
			loadMemberManageModal();  // 버튼이 클릭될 때 템플릿을 로드; html 요소들이 늦게 도착해서 인식하지 못하는 버그 대비
		});

		managementButtonContainer.appendChild(managementModalBtn);
	}
}


function loadMemberManageModal() {
	fetch('GroupMemberManage.html') 
		.then(response => response.text())
		.then(data => {
			const memberManageModal = document.getElementById('memberManageModal');
			memberManageModal.innerHTML = data;

			// 모달 닫기 버튼 이벤트 추가
			const closeModalBtn = memberManageModal.querySelector('#closeModalBtn');
			if (closeModalBtn) {
				closeModalBtn.addEventListener('click', function() {
					const overlay = document.getElementById('overlay');
					overlay.classList.remove('visible');
					overlay.classList.add('hidden');
					memberManageModal.classList.remove('visible');
					memberManageModal.classList.add('hidden');
				});
			}

			// 모든 label 요소에 클릭 이벤트를 방지하는 핸들러 추가
			const labels = document.querySelectorAll('label');
			labels.forEach(label => {
				label.addEventListener('click', function(e) {
					e.preventDefault(); // 클릭 이벤트 기본 동작 방지
				});
			});

			
			/////////////////////// 참여 요청 리스트 표시 ///////////////////////
			displayParticipationRequests();


			/////////////////////// 멤버 초대  ///////////////////////
			const inviteBtn = document.getElementById("inviteBtn");
			inviteBtn.addEventListener("click", async function() {
				const userID = document.getElementById("userID").value;
				if (userID) {

					const functionType = 3;

					try {
						const response = await fetch('/EditGroupMembers', {
							method: 'POST',
							headers: {'Content-Type': 'application/json'},
							body: JSON.stringify({ functionType: functionType, userToken: userToken, userID: userID, groupToken: groupToken, userPermission: userPermission })
						});
			
						data = await response.json();
			
						if (data.result == 0) {
							alert('다시 시도해주세요!')
						} else {
							alert(`${userID}님에게 초대 메세지를 보냈습니다!`);
							document.getElementById("userID").value = '';
						}
					} catch (error) {
						console.error('Error:', error);
					}
					
				} else {
					alert("초대 메세지를 보낼 아이디를 입력하세요!");
				}
			});


			// 멤버 등록 버튼 클릭 이벤트 추가
			const registerBtn = document.getElementById("registerBtn");
			registerBtn.addEventListener("click", async function() {
				const userName = document.getElementById("userName").value;
				const userPhone = document.getElementById("userPhone").value;

				if (!/^\d{10,11}$/.test(userPhone)) {  // 작성 형태 제한
					alert('전화번호는 숫자만 입력해주세요! \nex)01012345678');
					document.getElementById('userPhone').value = '';
					return;
				}
				
				if (userName && userPhone) {
					
					const functionType = 4;

					try {
						const response = await fetch('/EditGroupMembers', {
							method: 'POST',
							headers: {'Content-Type': 'application/json'},
							body: JSON.stringify({ functionType: functionType, userToken: userToken, userName: userName, userPhone: userPhone, groupToken: groupToken, userPermission: userPermission })
						});
			
						data = await response.json();
			
						if (data.result == 0) {
							alert('다시 시도해주세요!')
						} else {
							alert(`${userName}님을 비유저 회원으로 등록하였습니다!`);
							document.getElementById("userName").value = '';
							document.getElementById("userPhone").value = '';
							location.reload();
						}
					} catch (error) {
						console.error('Error:', error);
					}
					
				} else {
					alert("추가할 비유저 회원의 이름과 전화번호를 입력해주세요!");
				}
			});
		})
		.catch(error => console.error('Error loading template:', error));
}





/////////////////////// 멤버 입장 수락 리스트 생성///////////////////////
async function displayParticipationRequests() {
	const requestContainer = document.getElementById("request-container");
	requestContainer.innerHTML = '';

	// userPermission에 따라 분류
	const groupedRequests = {
		3: [],
		4: [],
		5: []
	};

	participateRequest.forEach(request => {
		groupedRequests[request.userPermission].push(request);
	});

	// '초대받은 상태' 그룹 표시
	if (groupedRequests[3].length > 0) {
		const inviteStatusHeader = document.createElement("h3");
		inviteStatusHeader.textContent = "초대받은 상태";
		requestContainer.appendChild(inviteStatusHeader);

		groupedRequests[3].forEach(request => {
			const requestBox = document.createElement("div");
			requestBox.classList.add("requestBox");

			// 프로필 사진
			const requestImage = document.createElement("img");
			requestImage.src = request.userImage ? `/UserImages/${request.userImage}` : `/UserImages/NULL.jpg`;
			requestImage.alt = `${request.userName}의 프로필 사진`;
			requestImage.classList.add("request-image");

			// 요청자 정보
			const requestInfo = document.createElement("div");
			requestInfo.classList.add("request-info");
			requestInfo.innerHTML = `
				<h2 class="request-name">${request.userName}</h2>
				<p class="request-permission">등급: ${getPermissionLabel(request.userPermission)}</p>
			`;

			// 취소하기 버튼을 담을 컨테이너
			const buttonContainer = document.createElement("div");
			buttonContainer.classList.add("button-container");

			// 취소하기 버튼
			const cancelButton = document.createElement("button");
			cancelButton.textContent = "취소하기";
			cancelButton.classList.add("basicBtn", "cancel-button");
			cancelButton.addEventListener("click", async function() {
				if (confirm(`${request.userName}의 초대를 취소하시겠습니까?`)) {
					try {
						const functionType = 1;

						const response = await fetch('/RefuseMember', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								functionType: functionType,
								userToken: userToken,
								groupToken: groupToken,
								userID: request.userID,
								userPermission: userPermission
							})
						});

						const data = await response.json();

						if (data.result == 0) {
							alert('다시 시도해주세요!');
						} else {
							alert(`${request.userName}의 초대를 취소하였습니다!`);
							location.reload();
						}
					} catch (error) {
						console.error('Error:', error);
					}
				}
			});

			// 버튼 컨테이너에 취소 버튼 추가
			buttonContainer.appendChild(cancelButton);

			// 요청 정보에 버튼 컨테이너 추가
			requestInfo.appendChild(buttonContainer);

			// 요청 박스에 이미지와 정보 추가
			requestBox.appendChild(requestImage);
			requestBox.appendChild(requestInfo);

			// 요청 컨테이너에 요청 박스 추가
			requestContainer.appendChild(requestBox);
		});
	}


	// '참가 대기중' 그룹 표시
	if (groupedRequests[4].length > 0) {
		const waitingStatusHeader = document.createElement("h3");
		waitingStatusHeader.textContent = "참가 대기중";
		requestContainer.appendChild(waitingStatusHeader);

		groupedRequests[4].forEach(request => {
			const requestBox = document.createElement("div");
			requestBox.classList.add("requestBox");

			// 프로필 사진
			const requestImage = document.createElement("img");
			requestImage.src = request.userImage ? `/UserImages/${request.userImage}` : `/UserImages/NULL.jpg`;
			requestImage.alt = `${request.userName}의 프로필 사진`;
			requestImage.classList.add("request-image");

			// 요청자 정보
			const requestInfo = document.createElement("div");
			requestInfo.classList.add("request-info");
			requestInfo.innerHTML = `
				<h2 class="request-name">${request.userName}</h2>
				<p class="request-permission">등급: ${getPermissionLabel(request.userPermission)}</p>
			`;

			// 참가 승인 및 거절 버튼
			const buttonContainer = document.createElement("div");
			buttonContainer.classList.add("button-container");

			// 참가 승인 버튼
			const approveButton = document.createElement("button");
			approveButton.textContent = "참가 승인";
			approveButton.classList.add("basicBtn", "accept-button");
			approveButton.addEventListener("click", async function() {
				if (confirm(`정말 ${request.userName}의 참가를 승인하시겠습니까?`)) {
					try {
						const functionType = 2;

						const response = await fetch('/EditGroupMembers', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								functionType: functionType,
								userToken: userToken,
								userID: request.userID,
								groupToken: groupToken,
								userPermission: userPermission
							})
						});

						const data = await response.json();

						if (data.result == 0) {
							alert('다시 시도해주세요!');
						} else {
							alert(`${request.userName}님의 참가가 승인되었습니다.`);
							location.reload();
						}
					} catch (error) {
						console.error('Error:', error);
					}
				}
			});

			// 참가 거절 버튼
			const declineButton = document.createElement("button");
			declineButton.textContent = "참가 거절";
			declineButton.classList.add("basicBtn", "decline-button");
			declineButton.addEventListener("click", async function() {
				if (confirm(`정말 ${request.userName}의 참가를 거절하시겠습니까?`)) {
					try {
						const functionType = 2

						const response = await fetch('/RefuseMember', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								functionType: functionType,
								userToken: userToken,
								userID: request.userID,
								groupToken: groupToken,
								userPermission: userPermission
							})
						});

						const data = await response.json();

						if (data.result == 0) {
							alert('다시 시도해주세요!');
						} else {
							alert(`${request.userName}님의 참가가 거절되었습니다.`);
							location.reload();
						}
					} catch (error) {
						console.error('Error:', error);
					}
				}
			});

			// 버튼 컨테이너에 버튼 추가
			buttonContainer.appendChild(approveButton);
			buttonContainer.appendChild(declineButton);

			// 요청 정보에 버튼 컨테이너 추가
			requestInfo.appendChild(buttonContainer);

			// 요청 박스에 이미지와 정보 추가
			requestBox.appendChild(requestImage);
			requestBox.appendChild(requestInfo);

			// 요청 컨테이너에 요청 박스 추가
			requestContainer.appendChild(requestBox);
		});
	}


	// '제명' 그룹 표시
	if (groupedRequests[5].length > 0) {
		const expelledStatusHeader = document.createElement("h3");
		expelledStatusHeader.textContent = "제명된 멤버";
		requestContainer.appendChild(expelledStatusHeader);

		groupedRequests[5].forEach(request => {
			const requestBox = document.createElement("div");
			requestBox.classList.add("requestBox");

			// 프로필 사진
			const requestImage = document.createElement("img");
			requestImage.src = request.userImage ? `/UserImages/${request.userImage}` : `/UserImages/NULL.jpg`;
			requestImage.alt = `${request.userName}의 프로필 사진`;
			requestImage.classList.add("request-image");

			// 요청자 정보
			const requestInfo = document.createElement("div");
			requestInfo.classList.add("request-info");
			requestInfo.innerHTML = `
				<h2 class="request-name">${request.userName}</h2>
				<p class="request-permission">등급: ${getPermissionLabel(request.userPermission)}</p>
			`;

			if (userPermission == 2) {
				const buttonContainer = document.createElement("div");
				buttonContainer.classList.add("button-container");

				const permissionSelect = document.createElement("select");
				permissionSelect.classList.add("permission-select");

				const options = [
					{ value: '1', text: '일반회원' },
					{ value: '2', text: '관리자' },
					{ value: '3', text: '창설자' }
				];

				options.forEach(optionData => {
					const option = document.createElement("option");
					option.value = optionData.value;
					option.textContent = optionData.text;
					permissionSelect.appendChild(option);
				});

				const changePermissionButton = document.createElement("button");
				changePermissionButton.textContent = "권한 변경";
				changePermissionButton.classList.add("basicBtn", "change-permission-button");
				changePermissionButton.addEventListener("click", async function() {
					const selectedValue = permissionSelect.value;
					const selectedText = options.find(opt => opt.value == selectedValue).text;

					if (confirm(`${selectedText}로 권한을 변경하시겠습니까?`)) {
						try {
							const response = await fetch('/EditGroupMembers', {
								method: 'POST',
								headers: {'Content-Type': 'application/json'},
								body: JSON.stringify({ functionType: selectedValue, userToken: userToken, userID: request.userID, groupToken: groupToken, userPermission: userPermission })
							});
							data = await response.json();

							if (data.result == 0) {
								alert('다시 시도해주세요!')
							} else {
								alert(`멤버의 권한이 ${selectedText}(functionType == ${selectedValue})으로 변경되었습니다.`);
								location.reload();
							}
						} catch (error) {
							console.error('Error:', error);
						}
					} else {
						alert('권한 변경이 취소되었습니다.');
					}
				});

				buttonContainer.appendChild(permissionSelect);
				buttonContainer.appendChild(changePermissionButton);
				requestInfo.appendChild(buttonContainer);
			}

			requestBox.appendChild(requestImage);
			requestBox.appendChild(requestInfo);
			requestContainer.appendChild(requestBox);
		});
	}
}




// 조직 탈퇴 함수
async function leaveGroup() {
    if (confirm("정말로 조직을 탈퇴하시겠습니까?")) {

        try {
			const response = await fetch('/LeaveGroup', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({ userToken: userToken, groupToken: groupToken, userPermission: userPermission })
			});

			data = await response.json();

			if (data.result == 0) {
				alert('다시 시도해주세요!');
			} else if (data.result == 1) {
				alert("조직을 탈퇴하였습니다.");
                window.location.href = '/PrivatePage/PrivatePage.html';
			}
		} catch (error) {
			console.error('Error:', error);
		}

    } else {
		alert('현명한 선택입니다!')
	}
}
