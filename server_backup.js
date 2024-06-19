const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

const mongoclient = require('mongodb').MongoClient;
let mydb;
const url = 'mongodb+srv://inoweyz:yang0916!@cluster0.jmr6n3b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoclient.connect(url)
    .then(client => {
        mydb = client.db('myboard');
        // mydb.collection('post').find().toArray().then(result => {
        //     console.log(result);
        // })

        app.listen(8080, function(){
            console.log("포트 8080으로 서버 대기중...");
        });
        // console.log('몽고db 접속 성공')
    }).catch(err => {
        console.log(err);
    });

app.get('/book', function(req, res){
    res.send('도서 목록 관련 페이지입니다.')
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
});

app.get('/list', function(req, res){
    mydb.collection('post').find().toArray().then(result => {
        console.log(result);
    })
});

app.get('/enter', function(req, res){
    res.sendFile(__dirname + '/enter.html');
});

app.post('/save', function(req, res){
    console.log(req.body);
    console.log("저장완료");
});