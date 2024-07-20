window.logout = logout;
window.certification = certification;

async function logout() {
    console.log('로그아웃 함수 실행');
    const userToken = sessionStorage.getItem('userToken');
    try {
        const response = await fetch('/Logout', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ userToken: userToken })
        });

        const data =  await response.json();

        if (data.result == 1) {
            sessionStorage.clear();
            alert("로그아웃 되었습니다!")
            window.location.href = '/LoginPage.html';
        } else {
            alert('로그아웃 실패!')
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function certification() {
    console.log('certification 함수 실행');
    const userToken = sessionStorage.getItem('userToken');
    const page = 'PrivatePage';

    try {
        const response = await fetch('/Certification', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ userToken: userToken, page: page })
        });

        const data =  await response.json();
        console.log(data);

        if (data.result == 1) {
            sessionStorage.setItem( 'pageResource', data.userID );
            console.log('리소스 데이터 저장 성공');
        } else if (data.result == 0) {
            window.location.href = '/WarningPage.html'; 
        }
    } catch (error) {
        console.error('Error:', error);
    }
}