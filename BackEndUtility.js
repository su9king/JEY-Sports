
//랜덤 함수
function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}



module.exports = { rand };