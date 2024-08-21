let noticeToken, getData;
let totalDues = 0;
let totalDuesPaid = 0;

//////////////////// Step0 : 회원인증, 사이드바, 뒤로가기 초기 세팅 ////////////////////
window.onload = async function() {
    const page = 'TotalDuesPage';
    userToken = sessionStorage.getItem('userToken');
    groupToken = sessionStorage.getItem('groupToken');
    userPermission = sessionStorage.getItem('userPermission');

    const data = `userToken=${userToken}&groupToken=${groupToken}&userPermission=${userPermission}`;
    
    const response = await certification(page, data);
    getData = response.resources;
    
    if (response.result == 0) {
        alert('로그인 후 사용해주세요!');
        window.location.href = '/WarningPage.html';
        return;
    }

    loadSidebar(page, userPermission, response);

    // 회비 리스트 테이블
    const tableContainer = document.getElementById("table-container");
    const table = generateTable(getData);
    tableContainer.appendChild(table);

    initSearchFunctionality();
    createLedgerContainer();

    // 뒤로가기 버튼
    document.getElementById('backButton').addEventListener('click', function() {
        window.history.back();
    });
}

// JSON 데이터를 HTML 테이블로 변환하는 함수
function generateTable(getData) {
    const table = document.createElement("table");
    table.id = "duesTable"; // 테이블에 ID 추가

    // 테이블 헤더 생성
    const thead = table.createTHead();
    const headerRow = thead.insertRow();

    // 첫 번째 빈 칸 헤더
    const emptyHeader = document.createElement("th");
    headerRow.appendChild(emptyHeader);

    // 각 공지에 대한 헤더 추가
    const headers = ['공지 날짜', '지출 내역', '금액', '납부된 회비', '납부 여부'];
    headers.forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });

    // 테이블 본문 생성
    const tbody = table.createTBody();

    // 각 공지에 대한 행 추가
    getData.forEach((data, noticeIndex) => {
        const notice = data[0]; // 공지 정보를 가져옴
        const noticeRow = tbody.insertRow();

        // 첫 번째 셀: noticeType에 따라 다른 색상의 텍스트로 표시
        const noticeTypeCell = noticeRow.insertCell();
        noticeTypeCell.style.fontWeight = 'bold';
        switch (notice.noticeType) {
            case 2:
                noticeTypeCell.style.color = 'green';
                noticeTypeCell.textContent = '회비';
                break;
            case 3:
                noticeTypeCell.style.color = 'blue';
                noticeTypeCell.textContent = '입금';
                break;
            case 4:
                noticeTypeCell.style.color = 'red';
                noticeTypeCell.textContent = '지출';
                break;
        }

        // 공지 날짜 셀
        const noticeDateCell = noticeRow.insertCell();
        noticeDateCell.textContent = notice.noticeEditDate;

        // 지출 내역 셀 (클릭 이벤트 추가)
        const noticeTitleCell = noticeRow.insertCell();
        noticeTitleCell.textContent = `🔗${notice.noticeTitle}`;
        noticeTitleCell.style.overflow = 'auto';
        noticeTitleCell.style.whiteSpace = 'nowrap';
        noticeTitleCell.style.cursor = 'pointer';

        noticeTitleCell.addEventListener("click", () => {
            if (notice.noticeType == 2) {
                window.location.href = `/GroupNoticePage/DetailNoticeDuesPage.html?noticeType=${notice.noticeType}&noticeToken=${notice.noticeToken}&noticeTitle=${notice.noticeTitle}&noticeChangedDate=${notice.noticeChangedDate}&noticeEndDate=${notice.noticeEndDate}&noticeImportance=${notice.noticeImportance}&noticeStatus=${notice.noticeStatus}&userDuesStatus=${notice.userDuesStatus}&noticeDues=${notice.noticeDues}`;
            } else {
                loadNoticeDeailModal(notice);
            }
        });

        // 금액 셀  
        const noticeDuesCell = noticeRow.insertCell();
        if (notice.noticeType == 2) {
            // 회비 대상자 총 멤버 수 계산
            const softwareUsers = data[2]; // 소프트웨어 유저 정보
            let totalDuesMember = softwareUsers.length;
            let totalDuesNotUsers = data[3].length;
            let dues = notice.noticeDues * (totalDuesMember + totalDuesNotUsers);
            
            totalDues += dues;  // 맨 아래에 가계부 컨테이너에 들어갈 준비
            noticeDuesCell.textContent = `${dues}원`;  // 해당 공지사항에서 받아야할 총 회비 금액
        } else {
            noticeDuesCell.textContent = `${notice.noticeDues}원`; 
        }

        // 납부된 회비 금액 셀 
        const paidDuesCell = noticeRow.insertCell();
        if (notice.noticeType == 2) {
            // 회비 납부자 멤버 수 계산
            const softwareUsers = data[2]; // 소프트웨어 유저 정보
            let totalPaidDuesMember = softwareUsers.filter(user => user.duesStatus == 1).length;

            const notSoftwareUsers = data[3]; // 소프트웨어 비유저 정보
            let totalPaidDuesNotUserMember = notSoftwareUsers.filter(user => user.duesStatus == 1).length;

            const totalPaidMembers = totalPaidDuesMember + totalPaidDuesNotUserMember

            let paidDues = notice.noticeDues * totalPaidMembers;
            totalDuesPaid += paidDues;  // 맨 아래에 가계부 컨테이너에 들어갈 준비
            paidDuesCell.textContent = `${paidDues}원`;  // 해당 공지사항에서 받은 회비 금액
        } else {
            paidDuesCell.textContent = ``;
        }

        // 납부 여부 셀 -- 아직 미개발
        const duesStatusCell = noticeRow.insertCell();
        const duesStatus = getData[noticeIndex][1][0]?.duesStatus; // 유효한 인덱스 확인
        if (notice.noticeType == 2) {
            if (duesStatus == 1) {
                duesStatusCell.style.color = 'blue';
                duesStatusCell.textContent = '완료';
            } else {
                duesStatusCell.style.color = 'red';
                duesStatusCell.textContent = '미납';
            }
        }

    });

    return table;
}


// 검색 기능 초기화 (지출 내역을 대상으로 검색)
function initSearchFunctionality() {
    const searchBox = document.querySelector('#search-box');
    const duesTable = document.querySelector('#duesTable tbody');

    searchBox.addEventListener('keyup', function() {
        const filterValue = searchBox.value.toLowerCase();
        const rows = duesTable.querySelectorAll('tr');

        rows.forEach(row => {
            const noticeTitleCell = row.querySelector('td:nth-child(3)');
            const cellText = noticeTitleCell.textContent.toLowerCase();
            row.style.display = cellText.includes(filterValue) ? '' : 'none';
        });
    });
}


// 가계부 데이터를 추가 함수
function createLedgerContainer() {
    const ledgerContainer = document.getElementById('ledger-container');

    let totalExpenditure = 0;
    let totalIncome = 0;

    getData.forEach(data => {
        const notice = data[0]
        if (notice.noticeType == 4) {  // 지출 내역
            totalExpenditure += parseInt(notice.noticeDues);
        } else if (notice.noticeType == 3) {  // 입금 내역
            totalIncome += parseInt(notice.noticeDues);
        }
    });

    // 현재 조직 자금 계산 (입금 + 회비 - 지출)
    const currentFunds = totalIncome + totalDuesPaid - totalExpenditure;

    // 각 항목의 HTML 요소 생성
    const expenditureElement = document.createElement('p');
    expenditureElement.textContent = `총 지출 금액: ${totalExpenditure} 원`;

    const incomeElement = document.createElement('p');
    incomeElement.textContent = `총 입금 금액: ${totalIncome} 원`;

    const duesRequestedElement = document.createElement('p');
    duesRequestedElement.textContent = `총 회비 요청 금액: ${totalDues} 원`;

    const duesIncomeElement = document.createElement('p');
    duesIncomeElement.textContent = `총 회비 납부 금액: ${totalDuesPaid} 원`;

    const currentFundsElement = document.createElement('p');
    currentFundsElement.textContent = `현재 조직 자금: ${currentFunds} 원`;

    // 계산된 데이터를 컨테이너에 추가
    ledgerContainer.appendChild(expenditureElement);
    ledgerContainer.appendChild(incomeElement);
    ledgerContainer.appendChild(duesRequestedElement);
    ledgerContainer.appendChild(duesIncomeElement);
    ledgerContainer.appendChild(currentFundsElement);
}


function loadNoticeDeailModal(notice) {
    const overlay = document.getElementById('overlay');
    const noticeDetailModal = document.getElementById('noticeDetailModal');

    overlay.classList.remove('hidden');
    overlay.classList.add('visible');
    noticeDetailModal.classList.remove('hidden');
    noticeDetailModal.classList.add('visible');

    fetch('DuesNoticeDetailModal.html') 
		.then(response => response.text())
		.then(data => {
			const noticeDetailModal = document.getElementById('noticeDetailModal');
			noticeDetailModal.innerHTML = data;

			// 모달 닫기 버튼 이벤트 추가
			const closeModalBtn = noticeDetailModal.querySelector('#closeModalBtn');
			if (closeModalBtn) {
				closeModalBtn.addEventListener('click', function() {
					const overlay = document.getElementById('overlay');
					overlay.classList.remove('visible');
					overlay.classList.add('hidden');
					noticeDetailModal.classList.remove('visible');
					noticeDetailModal.classList.add('hidden');
				});
			}

			const noticeContainer = document.getElementById('notice-container');
            const endDateText = notice.noticeEndDate ? notice.noticeEndDate : '없음';

            noticeContainer.innerHTML = `
            <div class="notice-info">
                <h1> ${notice.noticeTitle} </h1>
                금액: ${notice.noticeDues}원
            </div>
            <div class="notice-dates">
                마지막 수정일: ${notice.noticeEditDate} | 종료일: ${endDateText}
            </div>
            <h2 class="notice-textContent">
                ${notice.noticeContent}
            </h2>
        `;

		})

		.catch(error => console.error('Error loading template:', error));


}