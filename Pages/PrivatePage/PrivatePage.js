// const session = require("express-session");

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

        let groups = [];
        resources.resources.forEach(resource => {
            groups.push({
                groupToken: resource.groupToken,
                groupName: resource.groupName
            });
        });
        
        createButtons(groups);
    }
    

}


//////////////////// 버튼 생성 ////////////////////
function createButtons(groups) {
    const buttonContainer = document.getElementById('button-container');
    buttonContainer.innerHTML = '';
    
    console.log(groups)
    groups.forEach((group, index) => {
        console.log(group);
        const button = document.createElement('button');
        button.textContent = `Button ${group['groupName']}`;
        button.addEventListener('click', () => {
            alert(`group ${group['groupName']} selected`);
            sessionStorage.setItem('groupToken', group['groupToken'] );
            window.location.href = '../GroupPage/GroupPage.html'; 
        });
        buttonContainer.appendChild(button);
    });
}




//////////////////// 로그아웃, 조직 생성 버튼 이벤트 추가 ////////////////////
document.addEventListener('DOMContentLoaded', function() {

    const logoutBtn = document.getElementById('logout');
    logoutBtn.addEventListener('click', logout); 
    
    const createGroupBtn = document.getElementById('createGroup');
    createGroupBtn.addEventListener('click', createGroupPage);

})

function createGroupPage() {
    window.location.href = '/CreateGroupPage/CreateGroupPage.html'
}