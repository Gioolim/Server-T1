const HDWalletProvider = require("truffle-hdwallet-provider-klaytn")

const NETWORK_ID = '1001'
const GASLIMIT = '8500000'

const URL = "https://api.baobab.klaytn.net:8651"
const PRIVATE_KEY = "0x2cfb2dc72f26ace5e2bdcdfe02950f6ce83493f839fbf4d246acb6eb56ff17da"
// => == function() {}
module.exports = {
    networks : {
        baobab : {
            provider : () => new HDWalletProvider(PRIVATE_KEY, URL)
            network_id : NETWORK_ID,
            gas : GASLIMIT,
            pasPrise : null
        }  
    }
}