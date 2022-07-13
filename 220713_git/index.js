var express = require("express")
var app = express()
var session = require("express-session")

// post 통신 방식 데이터를 받기 위한 초기 설정
app.use(express.json())
app.use(express.urlencoded({extended:false}))

// 뷰 파일을 어느 곳에서 가지고 올지 설정
app.set('views', __dirname+"/views")
// 뷰 엔진 설정
app.set("view engine", "ejs")
// 세션을 설정
app.use(
    session( {
        secret : "nsajofnjasfos",
        resave : false,
        saveUninitialized : true
    })
)

// mysql 설정 (DB에서 접속 설정)
var mysql = require("mysql2")
var connection = mysql.createConnection( {
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : 'tiger',
    database : 'blockchain'
})

// contract에 접속 설정



// localhost:3000 접속 시 세션이 존재하면 main으로,
// 세션이 존재하지 않으면 로그인 페이지
app.get("/", function(req, res) {
    if(req.session.login) {
        res.redirect("/contract")   // main.ejs 보여주는 주소
    } else {
        res.redirect("/login")
    }
})

// API(url) 구성
// index.js 에서 주소를 다 만드는 방법
// router를 이용해 파일 분할 관리
// router를 통해 로그인 part,
// ex) 안전점검표 / 계약서(문서화) / 티켓팅 / DID

// 로그인 -> ID, PASS, 이름, 생년월일, 전화번호
// 계약서 -> 문서번호(기본키), 계약내용, 갑&을, 날짜

// route 로그인, 계약
// routes -> login.js, sign.js
var login = require("./routes/login.js")
app.use("/login", login)

var sign = require("./routes/sign.js")
app.use("/contract", sign)               // 주소

var smart = require("./routes/contract.js")
app.use("/smart", smart)


var port = 3000
app.listen(port, function() {
    console.log("서버 시작")
})