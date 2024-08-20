window.certification = certification;

//////////////// 회원 인증 함수 ////////////////
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
            return data;
        } else if (data.result == 0) {
            window.location.href = '/WarningPage.html'; 
        }
    } catch (error) {
        console.error('Error:', error);
        window.location.href = '/WarningPage.html'; 
    }
}

