window.onload = async function() {
    const page = 'CreateGroupPage';
    const data = {userToken: sessionStorage.getItem('userID')};
    const resources = await certification(page, data);

    if (resources.result == 0) {
        alert('로그인 후 사용해주세요!');
        window.location.href = '/WarningPage.html';
    } else {
        console.log('회원 인증 성공');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const CreateGroupForm = document.getElementById('CreateGroupForm');

    const groupID = document.getElementById('groupID');
    const groupIDBtn = document.getElementById('groupIDBtn');
    const allowGroupID = document.getElementById('groupIDAlert');

    let idCheck = false;

    ////// GroupID 중복 확인 버튼 //////
    groupID.addEventListener('input', async function(e) {
        e.preventDefault();
        allowGroupID.style.display = 'none'
        idCheck = false;
    });

    groupIDBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        
        var groupID = document.getElementById('groupID').value;

        allowGroupID.style.display = 'none' // 가능한 조직명을 작성했다가 불가능한 id를 확인하는 경우, 가능하다는 알림을 삭제하기 위해

        const functionType = 0;
        
        try {
            const response = await fetch('/CreateGroup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ functionType: functionType, groupID: groupID })
            });

            data = await response.json();

            if (data.result == 0) {
                allowGroupID.style.display = 'block';
                idCheck = true;
            } else {
                document.getElementById('groupID').value = '';
                alert('이미 사용중인 ID입니다! \n다른 ID를 이용해주세요!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });


    ////// 이미지 저장 ////// 
    const groupImageLabel = document.getElementById('groupImageLabel');
    groupImageLabel.addEventListener('click', function(e) {
        e.preventDefault();  // 라벨에 있는 클릭 이벤트는 삭제; 라벨 텍스트 클릭은 무시하기 위함
    });


////// 최종 회원가입 폼 제출 //////
CreateGroupForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const groupPublisher = sessionStorage.getItem('userToken');

    const groupName = document.getElementById('groupName').value;
    const groupNumber = document.getElementById('groupNumber').value;
    const groupID = document.getElementById('groupID').value;
    const groupPW = document.getElementById('groupPW').value;
    const groupLocation = document.getElementById('groupLocation').value;

    let groupClassification = document.getElementById('groupClassification').value;
    let groupSportType = document.getElementById('groupSportType').value;

    let groupImage = document.getElementById('groupImage').files[0];

    // null값 허용
    groupClassification = allowNull(groupClassification);
    groupSportType = allowNull(groupSportType);
    
    console.log('groupImage', groupImage);
    
    if ( groupClassification == 'empty') {
        alert('조직 분류를 선택해 주세요!');
        return
    } else if (groupSportType == 'empty') {
        alert('활동 종목을 선택해 주세요!');
    }


    if (groupName && groupNumber && groupID && groupPW && idCheck == true && groupLocation && groupImage ) {
        const functionType = 1;

        const response = await fetch('/CreateGroup', {
            method : 'POST',
            headers : {'Content-Type': 'application/json'},
            body : JSON.stringify({ functionType: functionType,
                                    groupPublisher: groupPublisher,
                                    groupName: groupName,
                                    groupNumber: groupNumber,
                                    groupID: groupID, 
                                    groupPW: groupPW, 
                                    groupLocation: groupLocation,
                                    groupClassification: groupClassification, 
                                    groupSportType: groupSportType,
                                    groupImage: null
                                    })
        });

        data =  await response.json();

        if (data.result == 1) {

            const groupToken = data.groupToken;
            const functionType = 2;
            imageUpload(functionType, groupPublisher, groupImage, groupToken );             
            
            alert("조직 생성이 완료되었습니다!");
            window.location.href = '/PrivatePage/PrivatePage.html'; 

        } else {
            alert('다시 시도해주세요!');
        }

    } else if (idCheck == false) {
        alert('ID 중복 체크를 진행해주세요!!');
    } else if (groupImage == undefined) {
        alert('그룹의 프로필 사진을 추가해주세요!!');
    }
    else {
        alert('제시된 정보를 모두 채워주세요!');
    }
   
    function allowNull(userData) {
        if (userData == '') {
            userData = null;
            return userData;
        } else {
            return userData;
        }
    }

});






});