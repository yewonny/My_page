const express = require('express');
const app = express();
const sha = require('sha256');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

let session = require('express-session');
app.use(session({
    secret : 'dlsfjekjfleij235m',
    resave : false,
    saveUninitialized : true
}))

app.use(passport.initialize);
app.use(passport.session());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs')

app.use(express.static("public"));

const mongoclient = require('mongodb').MongoClient;
const ObjId = require('mongodb').ObjectId;
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

/* app.get('/', function(req, res){
    res.render("index.ejs");
}); */

app.get('/', function(req, res){
    console.log(req.session);
    if(req.session.user){
        console.log('세션 유지');
        res.render("index.ejs", {user : req.session.user});
    } else {
        res.render("index.ejs", {user : null});
    }
});

app.get('/list', function(req, res){
    mydb.collection('post').find().toArray().then(result => {
        console.log(result);
        res.render('list.ejs', { data : result });
    })
});

app.get('/enter', function(req, res){
    res.render('enter.ejs');
});

app.post('/save', function(req, res){
    console.log(req.body.title);
    console.log(req.body.content);
    console.log(req.body.someDate); 
    // 몽고DB에 데이터 저장하기
    mydb.collection('post').insertOne(
        {title : req.body.title, content : req.body.content, date : req.body.someDate})
    .then(result => {
        console.log(result);
        console.log('데이터 추가 성공');
    });
    res.redirect("/list");
});

app.post("/delete", function(req, res){
    console.log(req.body._id);
    req.body._id = new ObjId(req.body._id);
    mydb.collection('post').deleteOne(req.body)
    .then(result=>{
        console.log('삭제완료');
        res.status(200).send();
    })
    .catch(err =>{
        console.log(err);
        res.status(500).send();
    });
});

app.get('/content/:id', function(req, res){
    console.log(req.params.id);
    req.params.id = new ObjId(req.params.id);
    mydb
        .collection("post")
        .findOne({_id : req.params.id})
        .then((result) => {
            console.log(result);
            res.render("content.ejs", {data : result});
        });
});

app.get("/edit/:id", function(req, res){
    req.params.id = new ObjId(req.params.id);
    mydb
        .collection("post")
        .findOne({_id : req.params.id})
        .then((result) => {
            console.log(result);
            res.render("edit.ejs", {data : result});
        });
});

app.post("/edit", function(req, res){
    console.log(req.body);
    req.body.id = new ObjId(req.body.id);
    // let objId = new ObjId(req.body.id);
    mydb
        .collection("post")
        .updateOne({_id : req.body.id}, {$set : {title : req.body.title, content : req.body.content, date : req.body.someDate}})
        .then((result) => {
            console.log("수정완료");
            res.redirect('/list');
        })
        .catch((err) => {
            console.log(err);
        });
});

let cookieParser = require('cookie-parser');
app.use(cookieParser('sdlfkjjsdk2i318'));
app.get('/cookie', function(req, res){
    let milk = parseInt(req.signedCookies.milk) + 1000;
    if(isNaN(milk)){
        milk = 0;
    }
    res.cookie('milk', milk, {signed : true});
    res.send('product : ' + milk + '원');
});

app.get("/session", function(req, res){
    if(isNaN(req.session.milk)){
        req.session.milk = 0;
    }
    req.session.milk = req.session.milk + 1000;
    res.send("session : " + req.session.milk + "원");
});

app.get("/login", function(req, res){
    console.log(req.session);
    if(req.session.user){
        console.log('세션 유지');
        res.render('index.ejs', {user : req.session.user});
    }else{
        res.render('login.ejs');
    }
});

app.post(
    '/login', 
    passport.authenticate("local", {
        failureRedirect: "/fail",
    }),
    function(req, res){
        console.log(req.session);
        console.log(req.session.passport);
        res.render("index.ejs", {user : req.session.passport});
    }
);
passport.use(
    new LocalStrategy(
        {
            usernameField: "userid",
            passwordField: "userpw",
            session: true,
            passReqToCallback: false,
        },
        function(inputid, inputpw, done){
            mydb
            .collection("account")
            .findOne({userid : inputid})
            .then((result) => {
                if(result.userpw == sha(inputpw)){
                    console.log("새로운 로그인");
                    done(null, result);
                }else{
                    done(null, false, {message: "비밀번호가 틀렸습니다."});
                }
            });
        }
    )
)

app.get('/logout', function(req, res){
    console.log('로그아웃');
    req.session.destroy();
    res.render('index.ejs', {user : null});
})

app.get("/signup", function(req, res){
    res.render('signup.ejs');
});

app.post('/signup', function(req, res){
    console.log(req.body.userid);
    console.log(sha(req.body.userpw));
    console.log(req.body.usergroup); 
    console.log(req.body.useremail); 
    // 몽고DB에 데이터 저장하기
    mydb
        .collection('account')
        .insertOne(
            {userid : req.body.userid, userpw : req.body.userpw, usergroup : req.body.usergroup, useremail : req.body.useremail})
        .then((result) => {
            console.log('회원가입 성공');
    });
    res.redirect("/");
});