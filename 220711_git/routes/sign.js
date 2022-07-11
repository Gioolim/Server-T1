var express = require('express')
const { route } = require('./login')
var router = express.Router()

// API 구성
// 기본 url : localhost:3000/contract
router.get("/", function(req, res) {
    if(req.session.login) {
        res.render("main.ejs")
    } else {
        res.redirect("/login")
    }
})

// index.js에서 사용할 수 있게 설정
module.exports = router