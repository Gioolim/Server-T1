/* 간단한 서버 구축 */
var express = require("express")
var app = express()

// mysql2 라이브러리 로드
var mysql = require("mysql2")
// mysql 접속 정보 지정
var connection = mysql.createConnection ({
  host : "localhost",
  port : 3306,
  user : "root",
  password : "tiger",       // 본인 sql 패스워드
  database : "blockchain"   // 
})

// 서버의 기본 세팅
app.set("views", __dirname + "/views")
  // 브라우저에 화면을 만들 파일들은 __dirname(현재폴더) + "/views"
  // 현재 폴더에서 하위폴더 views라는 폴더에 파일이 위치한다.
app.set("view engine", "ejs")
  // view 파일들을 ejs 엔진을 사용하여 열겠다.
  // ejs : html 태그 파일을 열어주는 엔진
app.use(express.json())  // json 형식의 데이터를 사용
app.use(express.urlencoded({extended: false}))
  // post 형식 데이터를 받을 때 True 패키지 새로 설치
  // false 형태일 때는 추가 패키지 설치 필요 X


// api 구성
// api는 간단하게 음식점에 있는 메뉴판
// 음식점 -> 손님 메뉴 선택 -> 해당하는 음식
// 주소 -> 손님 주소에 접속(요청) -> 해당하는 파일을 보내주는 형식

// get과 cost 두 가지 방식의 요청 방법 (get 사용)
// localhost:3000/ 접속(요청) 시
app.get("/", function(req, res) {  // req: request, res: respose
    //res.send("Hello World")
    res.render("index.ejs")  // index.ejs 파일을 브라우저에 덮어준다.
      // index.ejs 파일의 위치는 현재폴더의 하위폴더인 views 폴더에 존재한다.
})

// // localhost:3000/second 접속 시
// app.get("/second", function(req, res) {
//     //res.send("Second Page")
//     // index.ejs 데이터를 보낸 부분은 req 안에 존재
//     // GET 형식에서는 req.query 데이터가 존재
//     console.log(req.query)
//     console.log(req.query.id)
//     console.log(req.query.pass)
//     // id값이 test이고 password값이 1234인 경우 로그인 성공 -> second.ejs 보여준다.
//     // 조건 중 하나라도 거짓이거나 모두 거짓이면 index page로 돌아간다.
//     if(req.query.id == "test" && req.query.pass == "1234") {
//         res.render("second.ejs")
//     } else {
//         // res.render("index.ejs")
//         res.redirect("/")  // 설정된 주소로 이동 (localhost:3000 이동)
//     }
//     // res.render("second.ejs")  // second.ejs 파일을 브라우저에 덮어준다.
// })

app.post("/login", function(req,res) {
  // POST 형식에서는 데이터 body에 넣어서 보낸다.
  var input_id = req.body.id
  var input_passwrord = req.body.pass
  // input 데이터를 sql 담아서 쿼리문 실행 결과값 리턴
  connection.query (
    `select * from user_info where user_id = ? and user_pass = ?`,
    [input_id, input_passwrord],
     function(err, result) {
      if(err) {
        console.log(err)
        res.send("sql error")
      } else {
        if(result.length > 0)  {    // id와 pw 조건이 둘 다 참
          console.log(result)
          res.render("second.ejs")
        } else {
          console.log(result)
          res.redirect("/")
        }
      }
     }
  )
})

app.post("/third", function(req, res) {
    console.log(req.body)  // POST 형식 통신 데이터는 body 담아 보낸다.
    // get 형식은 url 데이터를 담아서 보내고 POST 형식은 body 숨겨서 데이터를 보낸다.
    var input_name = req.body.user_name
    var input_phone = req.body.user_phone
          // body 안에 user_name, user_phone 키 값이 가지고 있는 value 값을 변수에 삽입
    console.log(input_name, input_phone)  // 변수에 데이터가 잘 들어갔는지 확인
    res.render('third.ejs',
    {
        name : input_name,
        phone : input_phone
    })  // third.ejs 파일을 렌더링
})

app.get("/signup", function(req, res) {
    res.render("signup.ejs")
})

app.post("/signup2", function(req, res) {
  // signup 페이지에서 데이터 2개를 send
  // 두 데이터의 값을 변수로 지정, DB insert()
  // {id: input id 입력값, pass: input password 입력값}
  var input_id = req.body.id
  var input_pass = req.body.pass
  connection.query(  // sql 접속하는 문법, `` 사용 주의
    `insert into user_info(user_id, user_pass) values(?, ?)`,
    [input_id, input_pass],
    function(err, result) {
      if(err) {
        console.log(err)
        res.send("SQL Error")
      } else {
        // 회원가입 완료 후 로그인 페이지로 이동
        res.redirect("/")
      }
    }
  )
})

// 회원정보 수정
// 조건 : 아이디 값이 같은 데이터의 password 변경
// id와 password 두 데이터를 유저에게서 받아오는 작업
// 1. api 생성
// 2. 유저가 보내온 데이터를 변수에 지정
// 3. sql 쿼리문을 이용하여 데이터를 수정
// 4. index.ejs로 돌아가기
app.post("/update2", function(req, res) {
  var input_id = req.body.id
  var input_pass = req.body.pass
  console.log(input_id)     // 값을 잘 받았는지 확인
  console.log(input_pass)
  connection.query (        // DB에 접근하는 명령어
    `update user_info set user_pass = ? where user_id = ?`,
    [input_pass, input_id],
    function(err, result) {
      if(err) {
        console.log(err)
        res.send("sql Error")
      } else {
        res.redirect("/")   // 위 4. index.ejs로 돌아가기
      }
    }
  )
})
// 이제 1) 회원정보를 수정할 수 있는 update.ejs를 만들고
// 2) 사용자가 update 할 수 있도록 해주어야 한다.
app.get("/update", function(req,res) {
  res.render("update.ejs")
})

// 회원 탈퇴
// 회원 탈퇴 페이지 이동 api 생성
app.get("/delete", function(req, res) {
  res.render("delete.ejs")
})

// 1. delete.ejs id 값을 받아오고
// 2. sql 쿼리문 데이터를 삭제
// 3. index.ejs 다시 이동
app.post("/delete2", function(req, res) {
  var input_id = req.body.id
  connection.query(
    `delete from user_info where user_id = ?`,
    [input_id],
    function(err) {
      if(err) {
        console.log(err)
        res.send("Wrong ID")
      } else {
        res.redirect("/")
      }
    }
  )
})


var port = 3000
app.listen(port, function(){
    console.log("서버 시작")
})
