const mongoclient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

let mydb;

mongoclient.connect('mongodb+srv://inoweyz:yang0916!@cluster0.jmr6n3b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', function (err, client) {
    if (err) {
        console.log(err);
        return;
    }
    mydb = client.db('myboard');
    app.listen(8080, function () {
        console.log("포트 8080으로 서버 대기중...");
    });
});

app.get('/book', function (req, res) {
    res.send('도서 목록 관련 페이지입니다.');
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/list', function (req, res) {
    mydb.collection('post').find().toArray().then(result => {
        console.log(result);
        res.json(result); // 요청에 대한 응답으로 결과를 JSON 형식으로 보내기
    }).catch(err => {
        console.log(err);
        res.status(500).send("서버 오류"); // 오류 발생 시 500 상태 코드와 메시지를 클라이언트에게 보내기
    });
});

app.get('/enter', function (req, res) {
    res.sendFile(__dirname + '/enter.html');
});

app.post('/save', function (req, res) {
    console.log(req.body);
    console.log("저장완료");

    // 여기에 데이터를 MongoDB에 저장하는 코드 추가
    mydb.collection('post').insertOne(req.body, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("데이터 저장 실패"); // 오류 발생 시 500 상태 코드와 메시지를 클라이언트에게 보내기
        } else {
            res.send("데이터 저장 완료"); // 성공 시 성공 메시지를 클라이언트에게 보내기
        }
    });
});