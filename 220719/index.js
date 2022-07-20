var express = require("express")
var app = express()

app.set("views", __dirname+"/views")
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended:false}))

// klaytn 설정
var Caver = require("caver-js")
var CaverExtKAS = require("caver-js-ext-kas")
var caver = new CaverExtKAS()

// var account = cav.klay.accounts.createWithAccountKey()
var keyringContainer = new caver.keyringContainer()
var keyring = keyringContainer.keyring.createFromPrivateKey("0x2cfb2dc72f26ace5e2bdcdfe02950f6ce83493f839fbf4d246acb6eb56ff17da")
keyringContainer.add(keyring)

var accesskey = "KASKD62MMH8VPGWCOSO67QI6"
var secretaccesskey = "s4ljm8s3fhey_zYMx8ruLu4Hg6O6vzFNRoMKqDqp"
var chainId = 1001   // test net, 8217번이 메인넷
caver.initKASAPI(chainId, accesskey, secretaccesskey)    // KAS 초기화
var kip7 = new caver.kct.kip7("0xBfb04775380a443eECa92D84aC0aB0064A2f317F")
kip7.setWallet(keyringContainer)                         // kip7 내의 wallet 설정
 // klaytn 설정 끝

// 송금 함수
async function token_trans(address, token) {
    var receipt = await kip7.transfer(address, token, {from: keyring.address})
    return receipt
}

// 조회 함수
async function balanceOf(address) {
    var receipt = await kip7.balanceOf(address, {from: keyring.address})
    return receipt
}

app.get("/", function(req, res) {
    res.render("main.ejs")
})

app.get("/signup", function(req, res) {
    res.render("signup.ejs")
})

app.post("/signup2", function(req, res) {
    var id = req.body._id
    var pass = req.body._pass
    var wallet = req.body._wallet
    console.log(id, pass, wallet)
    // mysql data insert
    res.send(id, pass, wallet)
})

app.get("/trans", function(req,res) {
    res.render("trans.ejs")
})

app.post("/trans2", function(req, res) {
    var address = req.body._address
    var token = req.body._token
    token_trans(address, token).then(function(receipt) {
        console.log(receipt)
        res.redirect("/trans")
    })
})

app.get("/balance", function(req, res) {
    var address = "0xc2d9bf4829ac69a79c5d0f86498182e7e79073e3"
    balanceOf(address).then(function(result) {
        console.log(result)
        res.send(result)
    })
})

// API 통해서 지갑을 생성
app.get("/get_wallet", function(req,res) {
    account = async() => {
        res.json(await caver.kas.wallet.createAccount())
    }
    account()
})


var port = 3000
app.listen(port, function() {

})