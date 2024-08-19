window.dues = dues;

//////////////// 회비 납부 함수 ////////////////
async function dues(userToken, groupToken, userPermission,noticeToken,noticeDues) { 
    var IMP = window.IMP;
    IMP.init("imp74527225");
    var success = 0;
    IMP.request_pay({

        //실제 결제가 되는 것은 아니라서 데이터 수집은 대충 설정하도록 함.
        //가격만 실제 데이터를 불러와서 진행.
        pg: 'tosspay',
        pay_method: 'card',
        merchant_uid: 'merchant_' + new Date().getTime(),
        
        name: "신민철 ", 
        amount: noticeDues,
        buyer_email: "su9king@naver.com",  /*필수 항목이라 "" 로 남겨둠*/
        buyer_name: "조직 회비",
        }, function(rsp) {
        //console.log(rsp); //테스트용
                
        //결제 성공 시
        if (rsp.success) {
            var msg = '결제가 완료되었습니다.';
            alert(msg);
            success = 1;
                    
        } else {
            var msg = '결제에 실패하였습니다.';
            msg += '에러내용 : ' + rsp.error_msg;
            location.reload();
        }
    })

    console.log(success);
    if (success == 1){
        try {
            const response = await fetch('/Dues', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    functionType: 1,
                    userToken: userToken,
                    groupToken: groupToken,
                    userPermission: userPermission,
                    noticeToken: noticeToken,
                })
            });
    
            const data = await response.json();
            console.log(data);
            if (data.result == 1) {
                alert('납부 완료!');
                location.reload();
            } else if (data.result == 0)  {
                alert('다시 시도해주세요!');
                location.reload();
            }
        } catch (error) {
            console.error('Error occurred:', error);
        }
    }
    
}
