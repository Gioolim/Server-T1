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



module.exports = router