// route 설정
var express = require("express")
var router = express.Router()

// mysql 설정
var mysql = require("mysql2")
var connection = mysql.createConnection( {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "tiger",
    database: "blockchain"
})

router.post("/", function(req, res) {
    // login.ejs 보내준 데이터 변수 지정
    // 변수 데이터를 mysql user_info 테이블에 값이 존재하는지 확인
    // 값이 존재하면 로그인 성공, 존재하지 않으면 로그인 실패
    var input_id = req.body._id
    var input_pass = req.body._pass
    console.log(input_id, input_pass)
    // mysql 데이터 조회
    connection.query(
        `select * from user_info where user_id = ? and user_pass = ?`,
        [input_id, input_pass],  // 해당 값을 쿼리문에 넣어 나온 결과 : result
        function(err, result) {
            if(err) {
                console.log(err)
                res.send("SQL Error")
            } else {
                if(result.length > 0) {
                      // 정보를 맞게 입력하면 결과값이 나오고,
                      // 잘못 입력하면 [] 빈 리스트가 나오기 때문에 length로 판별 가능
                    //res.send("로그인 성공")
                    res.redirect("/board")
                    console.log("login success")
                }
                else {
                    res.send("로그인 실패")
                    console.log("login failed")
                }
            }
        }
    )
})



// 요 아이를 index.js 에서 사용할 것이기 때문에 모듈화 필요
module.exports = router
