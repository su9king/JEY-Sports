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
    getData[0].forEach((notice, noticeIndex) => {
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
            window.location.href = `/GroupNoticePage/DetailNoticeDuesPage.html?noticeType=${notice.noticeType}&noticeToken=${notice.noticeToken}&noticeTitle=${notice.noticeTitle}&noticeChangedDate=${notice.noticeChangedDate}&noticeEndDate=${notice.noticeEndDate}&noticeImportance=${notice.noticeImportance}&noticeStatus=${notice.noticeStatus}&userDuesStatus=${notice.userDuesStatus}&noticeDues=${notice.noticeDues}`;
        });


        ////////////////////////////////////////////////////////////////////여기부터 수정
        // 금액 셀  
        const noticeDuesCell = noticeRow.insertCell();
        if(notice.noticeType == 2) {
            let totalDuesMember = 0;
            /////////////////////////// 여기서 회비 대상자 총 멤버 코드 추가
    
            let dues = notice.noticeDues * totalDuesMember;
            totalDues += dues;  // 맨 아래에 가계부 컨테이너에 들어갈 준비
            noticeDuesCell.textContent = `${dues}원`;  // 해당 공지사항에서 받아야할 총 회비 금액
        } else {
            noticeDuesCell.textContent = `${notice.noticeDues}원`; 
        }


        // 납부된 회비 금액 셀 
        const paidDuesCell = noticeRow.insertCell();
        if(notice.noticeType == 2) {
            let totalPaidDuesMember = 0;
            /////////////////////////// 여기서 회비 납부자 멤버 수 코드 추가
            
            let paidDues = notice.noticeDues * totalPaidDuesMember;
            totalDuesPaid += paidDues  // 맨 아래에 가계부 컨테이너에 들어갈 준비
            paidDuesCell.textContent = `${paidDues}원`;  // 해당 공지사항에서 받은 회비 금액
        } else {
            noticeDuesCell.textContent = ``;
        }



        // 납부 여부 셀
        const duesStatusCell = noticeRow.insertCell();
        const duesStatus = getData[1][noticeIndex].duesStatus;
        if(notice.noticeType == 2) {
            if (duesStatus === 1) {
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

    getData[0].forEach(notice => {
        if (notice.noticeType === 4) {  // 지출 내역
            totalExpenditure += parseInt(notice.noticeDues);
        } else if (notice.noticeType === 3) {  // 입금 내역
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