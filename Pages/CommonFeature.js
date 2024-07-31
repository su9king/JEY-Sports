window.logout = logout;
window.certification = certification;
window.imageUpload = imageUpload;

async function logout() {
    console.log('로그아웃 함수 실행');
    const userToken = sessionStorage.getItem('userToken');
    try {
        const response = await fetch('/Logout', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ userToken: userToken })
        });

        const dataBuffer =  await response.json();

        if (dataBuffer.result == 1) {
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

async function certification(page, data) {
    console.log('certification 함수 실행');
    const getData = data;
    const getPage = page;
    

    try {
        const response = await fetch(`/Certification?${getData}&page=${getPage}`, {
            method: 'GET'
        });

        const data =  await response.json();
        console.log(data);

        if (data.result == 1) {            
            console.log('리소스 데이터 반환 성공');
            return data;
        } else if (data.result == 0) {
            window.location.href = '/WarningPage.html'; 
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function imageUpload(functionType, userToken, imageData, extraData) {
    let imageFormData = new FormData()
    
    let imageFormJson = { functionType: functionType, userToken: userToken }
      
        console.log('이미지 업로드 함수 실행 성공');

    if (functionType == 1) {  // 유저 개인 프로필 사진

        imageFormData.append('Image', imageData);
        imageFormData.append('json', JSON.stringify(imageFormJson));

    } else if (functionType == 2) {  // 조직 그룹 프로필 사진

        imageFormData.append('Image', imageData);
        imageFormJson.groupToken = extraData  // 그룹 이미지에 필요한 그룹토큰 추가
        console.log(imageFormJson);
        imageFormData.append('json', JSON.stringify(imageFormJson));

    }

    console.log(imageFormData);  // 콘솔에서는 formdata 형식의 데이터를 확인할 수 없는 것이 정상

    try {
        const response = await fetch('/ImageUpload', {
            method: 'POST',
            body: imageFormData  // formdata를 fetch 보낼 때는 content-type을 직접 명시하지 않고 전송
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Image uploaded successfully:', result);
        } else {
            console.error('Image upload failed:', response.statusText);
        }
    } catch (error) {
        console.error('Error occurred:', error);
    }
}