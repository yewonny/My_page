const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

for(var i = 0; i < 101; i++){
    console.log('충전중 : ' + i + '%');
}
console.log('충전이 완료되었습니다.')