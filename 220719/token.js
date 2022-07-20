var CaverExtKAS = require('caver-js-ext-kas')
var caver = new CaverExtKAS()

var accesskey = "KASKD62MMH8VPGWCOSO67QI6"
var secretaccesskey = "s4ljm8s3fhey_zYMx8ruLu4Hg6O6vzFNRoMKqDqp"
var chainId = 1001   // test net, 8217번이 메인넷
caver.initKASAPI(chainId, accesskey, secretaccesskey)    // KAS 초기화

var keyringContainer = new caver.keyringContainer()
var keyring = keyringContainer.keyring.createFromPrivateKey("0x2cfb2dc72f26ace5e2bdcdfe02950f6ce83493f839fbf4d246acb6eb56ff17da")
keyringContainer.add(keyring)   // 새로운 월렛 추가(kAS 지갑주소가 아닌 외부)


async function create_token() {
var kip7 = await caver.kct.kip7.deploy( {
    name : 'ourmemory2',         // 토큰의 이름
    symbol : 'OM2',              // 토큰의 심볼
    decimals : 0,                 // 토큰 소수점자리
    initialSupply : 1000000      // 토큰 발행량 
}, keyring.address, keyringContainer)
console.log(kip7._address)
}
create_token()



