var value = 0;
while(value < 10){
    value++;
    if(value % 2 == 0){
        continue;
    }

    console.log('value의 값: ' + value);
}