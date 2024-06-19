let user = {
    id : "sahi",
    pw : "1111",
    name : "ash",
    mobile : "010-8221-2855",
    country : "japan"
}

for(let info in user){
    console.log(`${info} : ${user[info]}`);
}