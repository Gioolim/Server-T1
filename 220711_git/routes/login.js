var express = require("express")
var router = express.Router()

// mysql 설정 (DB에서 접속 설정)
var mysql = require("mysql2")
var connection = mysql.createConnection( {
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : 'tiger',
    database : 'blockchain'
})

// API 구성
// 기본 url : localhost:3000/login
// '/' 로그인 화면
// '/signup' 회원 가입
// '/signin' DB 확인해 로그인 유무 세션 저장
// '/delete' 회원 탈퇴
// '/update' 회원 정보 수정

router.get("/", function(req, res) {
    if(req.session.login) {
        res.redirect("/contract")
    } else {
        res.render("login.ejs")
    }
    // res.redirect("/login")
})

router.post("/signin", function(req, res) {
    var id = req.body._id
    var pass = req.body._pass
    console.log(id, pass)      // 데이터가 잘 들어왔는지 확인
    connection.query(
        `select * from user where ID = ? and password = ?`,
        [id, pass],
        function(err, result) {
            // result의 data type : list
            // result [{},{},{}]
            // result[0]의 data type : json
            if(err){
                console.log(err)
                res.send("SQL select error")
            } else {
                if(result.length > 0) {  // 결과가 있다 -> 로그인 성공
                    req.session.login = result[0]
                    res.redirect("/contract")
                } else {                 // 로그인 실패
                    res.redirect("/login")
                }
            }
        }
    )
})

// 회원 가입 페이지 렌더
router.get("/signup", function(req, res) {
    res.render("signup.ejs")
})

// 회원 정보 데이터베이스
router.post("/signup2", function(req, res) {
    var id = req.body._id
    var pass = req.body._pass
    var name = req.body._name
    var birth = req.body._birth
    var phone = req.body._phone
    // ID 값에 대한 중복 여부
    // 중복 데이터가 존재하지 않으면 insert,
    // 중복 데이터가 존재하면 message 팝업
    connection.query(
        `select * from user where ID = ?`,
        [id],
        function(err, result) {
            if(err) {
                console.log(err)
                res.send("SQL select error")
            } else {
                if(result.length == 0) {
                    connection.query(
                        `insert into user values (?,?,?,?,?)`,
                        [id, pass, name, birth, phone],
                        function(err2) {
                            if(err2) {
                                console.log(err2)
                                res.send("SQL insert error")
                            } else {
                                res.redirect("/login")
                            }
                        }
                    )
                } else {
                    res.send("이미 존재하는 아이디입니다.")
                }
            }
        }
    )
})

// 로그아웃
router.get("/logout", function(req, res) {
    if(req.session.login) {
        req.session.destroy(
            function(err) {
                if(err) {
                    console.log(err)
                } else {
                    res.redirect("/login")
                }
            }
        )
    } else {
        res.redirect("/login")
    }
})


module.exports = router