var express = require('express')
// const { route } = require('./login')
var router = express.Router()
var moment = require("moment")

var mysql = require("mysql2")
var connection = mysql.createConnection( {
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : 'tiger',
    database : 'blockchain'
})

// API 구성
// 기본 url : localhost:3000/contract
router.get("/", function(req, res) {
    if(req.session.login) {
        var id = req.session.login.ID
        connection.query(
            `select No, a_id, b_id, a, b from contract where a_id = ? or b_id = ?`,
            [id, id],
            function(err, result) {
                if(err){
                    console.log(err)
                    res.send("SQL select error")
                } else {
                    res.render("main.ejs", {
                        contents : result
                    })
                }
            }
        )
//        res.render("main.ejs")
    } else {
        res.redirect("/login")
    }
})

// 1. 계약서 내용 전체를 넣는 방법 (textarea 전체 내용 기입, 파일 업로드)
// 2. 특정 항목들만 넣는 방법 (input 다중)
router.get("/add", function(req,res) {
    if(req.session.login) {
        res.render("add.ejs")
    } else {
        res.redirect("/login")
    }
})

router.post("/add2", function(req, res) {
    var no = req.body._no
    var content = req.body._content
    var b_id = req.body._b_id
    var time = moment().format('YYYY/MM/DD hh:mm:ss')
    var a_id = req.session.login.ID
    console.log(no, content, b_id)
    // 문서번호, 계약, 내용, 작성 시간, 갑의 사인(0), 을의 사인(0),
    // 갑의 아이디, 을의 아이디
    connection.query (
        `insert into contract values(?,?,?,?,?,?,?)`,
        [no, content, time, 0, 0, a_id, b_id],
        function(err) {
            if(err) {
                console.log(err)
                res.send("SQL insert error")
            } else {
                res.redirect("/contract")
            }
        }
    )
})

// 단일 계약서 상세 정보 출력 url
router.get("/info", function(req, res) {
    if(req.session.login) {
        var no = req.query._no
        connection.query(
            `select * from contract where No = ?`,
            [no],
            function(err, result) {
                if(err) {
                    console.log(err)
                    res.send("SQL select error")
                } else {
                    // result.length --> 1 기본키를 기준으로 조회
                    // result 형태는 리스트
                    // result[0] 형태는 json
                    res.render("info.ejs", {
                        content : result[0],
                        login_id : req.session.login.ID
                    })
                }
            }
        )

    }
})

//
router.get("/sign", function(req, res) {
    if(req.session.login) {
        var no = req.query._no
        var n = req.query._n
        console.log(no, n)
        // n == 0 : 갑 -> 해당하는 데이터의 a필드 값을 0에서 1로 변경
        // n == 1 : 을 -> 해당하는 데이터의 b필드 값을 0에서 1로 변경
        if(n==0) {
            sql = `update contract set a = 1 where No = ?`
        } else {
            sql = `update contract set b = 1 where No = ?`
        }
        connection.query(
            sql,
            [no],
            function(err) {
                if(err) {
                    console.log(err)
                    res.send("SQL update error")
                } else {
                    res.redirect("/contract")
                }
            }
        )
    }
})


// index.js에서 사용할 수 있게 설정
module.exports = router