window.onerror = function (message, source, lineno, colno, error) {
    console.error('전역 에러 발생:', message, source, lineno, colno, error);
};


// 엔터 누르면 로그인 버튼 작동
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('loginBtn').click(); 
    }
});

async function login() {

    const ID = document.getElementById('ID').value;
    const PW = document.getElementById('PW').value;
    
    if ( ID && PW ) {
        const response = await fetch('/Login', {
            method : 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ userID: ID, userPW: PW })
        });
            
        data =  await response.json();

        if (data.result == 1) {  // 올바르지 않은 ID, PW 입력시 return = 0; 에러 메세지 노출
            sessionStorage.setItem('userToken', data.userToken);
            sessionStorage.setItem('userImage', data.userImage);
            alert("로그인 되었습니다!");
            window.location.href = 'PrivatePage/PrivatePage.html'; 
        } else {
            alert("일치하는 정보가 없습니다.")    
        }
    } else {
        alert('아이디와 비밀번호를 입력해주세요!')
    }
}

async function register() {
    window.location.href = 'RegisterPage/RegisterPage.html';  
}
