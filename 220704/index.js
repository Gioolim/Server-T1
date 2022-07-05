/* 간단한 서버 구축 */
var express = require("express")
var app = express()

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

// localhost:3000/second 접속 시
app.get("/second", function(req, res) {
    //res.send("Second Page")
    // index.ejs 데이터를 보낸 부분은 req 안에 존재
    // GET 형식에서는 req.query 데이터가 존재
    console.log(req.query)
    console.log(req.query.id)
    console.log(req.query.pass)
    // id값이 test이고 password값이 1234인 경우 로그인 성공 -> second.ejs 보여준다.
    // 조건 중 하나라도 거짓이거나 모두 거짓이면 index page로 돌아간다.
    if(req.query.id == "test" && req.query.pass == "1234") {
        res.render("second.ejs")
    } else {
        // res.render("index.ejs")
        res.redirect("/")  // 설정된 주소로 이동 (localhost:3000 이동)
    }
    // res.render("second.ejs")  // second.ejs 파일을 브라우저에 덮어준다.
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


var port = 3000
app.listen(port, function(){
    console.log("서버 시작")
})