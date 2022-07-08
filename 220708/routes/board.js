var express = require("express")
var router = express.Router()

var mysql = require("mysql2")
var connection = mysql.createConnection( {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "tiger",
    database: "blockchain"
})

// localhost:3000/board 접속 시
// 게시글 목록을 유저에게 보이도록 하는 기능
router.get("/", function(req, res) {
    connection.query(
        `select * from board`,
        function(err, result) {
            if(err) {
                console.log(err)
                res.send("SQL Error")
            } else {
                console.log(result)
                res.render("main.ejs", {content : result})
            }
        }
    )
    // res.render("main.ejs")
})

// 글 쓰기 api는 /board/add
// board.js 자체는 /board 호출이 돼야 열리는 파일
router.get("/add", function(req, res) {
    //res.send("글 쓰기 페이지")
    res.render("write.ejs")
})

// 글을 DB에 등록하는 API
// 여태 get으로 정보를 보내본 적이 없어서 테스트 겸 해보는 것
router.get("/writing", function(req, res) {
    // write.ejs에서 데이터 3개를 보낸다.
    // 보낸 데이터에 변수를 지정하고
    // board table 에 insert
    var input_title = req.query._title
    var input_contents = req.query._contents
    var input_writer = req.query._writer
    console.log(input_title, input_contents, input_writer)
    // DB에 insert
    connection.query(
        `insert into board (title, contents, writer) value (?, ?, ?)`,
        [input_title, input_contents, input_writer],
        function(err) {   // result 따로 없음
            if(err) {
                console.log(err)
                res.send("SQL Error")
            } else {
                //res.send("등록 완료")
                res.redirect("/board")
            }
        }
    )
})

// 글 내용을 보여주기 위한 API
// cannont GET /board/info
// localhost:3000/board/info?_no=글번호
router.get("/info", function(req, res) {
    // 글 번호 변수 지정
    var no = req.query._no
    console.log(no)
    // 글 번호를 받아온 뒤 해야되는 작업?
    // DB 해당 글 번호의 정보를 로드
    connection.query(
        `select * from board where No = ?`,
        [no],
        function(err, result) {
            if(err){
                console.log(err)
                res.send("SQL Error")
            } else {
                console.log(result)
                res.render("info.ejs", {info:result}) // 데이터를 보낼 때는 중괄호{}! Json 형태로
            }
        }
    )
})

// 글 삭제를 위한 API
router.get("/delete", function(req, res) {
    var no = req.query._no    // 삭제할 글의 번호
    console.log(no)
    // DB에서 해당 글 번호에 대응하는 데이터 삭제
    connection.query(
        `delete from board where No = ?`,
        [no],
        function(err) {
            if(err) {
                console.log(err)
                res.send("SQL Error")
            } else {
                res.redirect("/board")
            }
        }
    )
})

// 글 수정을 위한 API 1
router.get("/update", function(req, res) {
    var no = req.query._no
    var title = req.query._title
    var contents = req.query._contents
    var writer = req.query._writer
    
    res.render("update.ejs", {     // 보내는 데이터는 중괄호에!
        u_no : no,
        u_title : title,
        u_contents : contents,
        u_writer : writer
    })
})

// 글 수정을 위한 API 2 (사용자가 수정한 내용을 update)
router.post("/update2", function(req, res) {
    var no = req.body._no
    var title = req.body._title
    var contents = req.body._contents
    var writer = req.body._writer
    connection.query(
        `update board set title = ?, contents = ?, writer = ? where No = ?`,
        [title, contents, writer, no],
        function(err) {
            if(err) {
                console.log(err)
                res.send("SQL Error")
            } else {
                res.redirect("/board/info?_no="+no)
            }
        }
    )
})

module.exports = router