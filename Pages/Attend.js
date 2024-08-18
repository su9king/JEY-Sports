window.attend = attend;

//////////////// 일정 참석 함수 ////////////////
async function attend(functionType, userToken, groupToken, userPermission, scheduleToken) { 

    //// functionType == 1: 참석하기, functionType == 2: 결석하기
    var absentReason = null;
    var scheduleAttendanceCode = null;
    if (functionType == 2) {
        var absentReason = prompt("결석 사유를 작성해주세요!", "")
        if (absentReason === null) {
            alert("취소되었습니다!");
            return
        }
    } else if (functionType == 1 && userPermission != 1 && userPermission != 2) {
        var scheduleAttendanceCode = prompt("오늘의 출석 코드를 작성해주세요!", "")
        if (scheduleAttendanceCode === null) {
            alert("취소되었습니다!");
            return
        }
    } else if (functionType == 1 && (userPermission == 1 || userPermission == 2)) {
        if(!confirm("출석으로 변경하시겠습니까?")) {
            return
        }
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
                alert('다시 시도해주세요!');
            }
        }

        location.reload();

    } catch (error) {
        console.error('Error occurred:', error);
    }
}

