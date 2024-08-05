window.onload = async function() {
    const page = 'PrivatePage';
    const userToken = sessionStorage.getItem('userToken')
    const data = `userToken=${userToken}`
    const resources = await certification(page, data);
    
    //const resources = {result : 1 , resources : [{groupToken : 1 , groupName : 'GyuChul1'}, {groupToken : 2, groupName : 'GyuChul2'}]};

    if (resources.result == 0) {
        alert('로그인 후 사용해주세요!');
        window.location.href = '/WarningPage.html';
    } else if (resources.result == 1) {

        const userPermission = resources.userPermission;
        loadSidebar(page, userPermission);


        let groups = [];
        resources.resources.forEach(resource => {
            groups.push({
                groupToken: resource.groupToken,
                groupName: resource.groupName
            });
        });
        console.log(groups)
        createButtons(groups);
    }
    

}

//////////////////// 로그아웃, 조직 생성 버튼 이벤트 추가 ////////////////////
document.addEventListener('DOMContentLoaded', function() {

    const createGroupBtn = document.getElementById('createGroup');
    createGroupBtn.addEventListener('click', createGroupPage);

})


//////////////////// 버튼 생성 ////////////////////
function createButtons(groups) {
    const buttonContainer = document.getElementById('button-container');
    buttonContainer.innerHTML = '';
    
    groups.forEach((group, index) => {
        console.log(group);
        const button = document.createElement('button');
        button.textContent = `Button ${group['groupName']}`;
        button.addEventListener('click', () => {
            alert(`group ${group['groupName']} selected`);
            sessionStorage.setItem('groupToken', group['groupToken'] );
            window.location.href = '../GroupMainPage/GroupMainPage.html'; 
        });
        buttonContainer.appendChild(button);
    });
}


function createGroupPage() {
    window.location.href = '/CreateGroupPage/CreateGroupPage.html'
}

function toggleSidebar() {
    document.body.classList.toggle('sidebar-open');
}