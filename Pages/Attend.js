window.attend = attend;

//////////////// 일정 참석 함수 ////////////////
async function attend(functionType, userToken, groupToken, userPermission, scheduleToken) { 

    //// functionType == 1: 참석하기, functionType == 2: 결석하기
    var absentReason = null
    var scheduleAttendanceCode
    if (functionType == 2) {
        var absentReason = prompt("결석 사유를 작성해주세요!", "")
    } else if (functionType == 1) {
        var scheduleAttendanceCode = prompt("오늘의 출석 코드를 작성해주세요!", "")
    }

    try {
        const response = await fetch('/Attend', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                functionType : functionType,
                userToken: userToken,
                groupToken: groupToken,
                userPermission: userPermission,
                scheduleToken: scheduleToken,
                absentReason: absentReason,
                scheduleAttendanceCode: scheduleAttendanceCode
            })
        });

        const data = await response.json();
        
        if (data.result == 1) {
            if (functionType == 1) {
                alert('참석이 예정되었습니다!');
            } else if (functionType == 2) {
                alert('결석이 예정되었습니다!');
            }
        } else if (data.result == 0)  {
            if (functionType == 1) {
                alert('올바르지 않은 출석 코드입니다!');
            } else if (functionType == 2) {
                console.error('다시 시도해주세요!');
            }
        }
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

