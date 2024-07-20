async function login() {

    var ID = document.getElementById('ID').value;
    var PW = document.getElementById('PW').value;
    
    if ( ID && PW ) {
        const response = await fetch('/Login', {
            method : 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ userID: ID, userPW: PW })
        });
            
        data =  await response.json();

        if (data.result == 0) {  // 올바르지 않은 ID, PW 입력시 return = 0; 에러 메세지 노출
            alert("일치하는 정보가 없습니다.")    
        } else {
            sessionStorage.setItem('userToken', data.userToken);
            alert("로그인 되었습니다!");
            window.location.href = 'PrivatePage/PrivatePage.html'; 
        }
    } else {
        alert('아이디와 비밀번호를 입력해주세요!')
    }
}

async function register() {
    window.location.href = 'RegisterPage/RegisterPage.html';  
}
