window.imageUpload = imageUpload;

//////////////// 이미지 업로드 함수 ////////////////
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

