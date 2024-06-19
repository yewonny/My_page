var userName = '아사히';
var userPW = '1111';

function account(userid, userpw){
    console.log(userid);
    console.log(userpw);
    var savedName = '아사히';
    var savedPW = '1111';

    if(userpw === undefined){
        userpw = '1111';
    }

    if(userid == savedName){
        if(userPW == savedPW){
            console.log('반갑습니다. ' + userid + '님');
        }
    }
}
account(userName)