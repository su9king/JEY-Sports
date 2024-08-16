window.dues = dues;

//////////////// 회비 납부 함수 ////////////////
async function dues(userToken, groupToken, userPermission, noticeToken, noticeDues) { 

    try {
        const response = await fetch('/Dues', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                userToken: userToken,
                groupToken: groupToken,
                userPermission: userPermission,
                noticeToken: noticeToken,
                noticeDues: noticeDues
            })
        });

        const data = await response.json();
        
        if (data.result == 1) {
            alert('납부 완료!');
        } else if (data.result == 0)  {
            alert('다시 시도해주세요!');
        }
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

