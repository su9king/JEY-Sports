window.dues = dues;

//////////////// 회비 납부 함수 ////////////////
async function dues(userToken, groupToken, userPermission, noticeToken, noticeDues) { 
    var IMP = window.IMP;
    IMP.init("imp74527225");
    
    IMP.request_pay({
        pg: 'tosspay',
        pay_method: 'card',
        merchant_uid: 'merchant_' + new Date().getTime(),
        name: "신민철", 
        amount: noticeDues,
        buyer_email: "su9king@naver.com",
        buyer_name: "조직 회비",
    }, async function(rsp) {
        if (rsp.success) {
            try {
                const response = await fetch('/Dues', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ 
                        userToken: userToken,
                        groupToken: groupToken,
                        userPermission: userPermission,
                        noticeToken: noticeToken,
                    })
                });
        
                const data = await response.json();
                
                if (data.result == 1) {
                    alert('납부 완료!');
                } else if (data.result == 0)  {
                    alert('다시 시도해주세요!');
                }
                location.reload();
            } catch (error) {
                console.error('Error occurred:', error);
                alert('서버와의 통신 중 문제가 발생했습니다.');
            }
        } else {
            alert('결제에 실패하였습니다. 에러내용 : ' + rsp.error_msg);
        }
    });
}
