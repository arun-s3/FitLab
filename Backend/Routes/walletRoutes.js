const express = require('express')
const walletRouter = express.Router()
const {getOrCreateWallet, addFundsToWallet, getUserNameFromAccountNumber, addPeerAccount, sendMoneyToUser,
     requestMoneyFromUser, confirmMoneyRequest, declineMoneyRequest, payOrderWithWallet,
     updateAutoRechargeSettings} = require('../Controllers/walletController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


walletRouter.post('/', isLogin, getOrCreateWallet)
walletRouter.post('/add', isLogin, addFundsToWallet)
walletRouter.get('/account/:acc', isLogin, getUserNameFromAccountNumber)
walletRouter.post('/peer-account', isLogin, addPeerAccount)
walletRouter.post('/send', isLogin, sendMoneyToUser)
walletRouter.post('/request', isLogin, requestMoneyFromUser)
walletRouter.post('/request-confirm', isLogin, confirmMoneyRequest)
walletRouter.post('/request-decline', isLogin, declineMoneyRequest)
walletRouter.post('/order', isLogin, payOrderWithWallet)
walletRouter.post('/recharge-settings', isLogin, updateAutoRechargeSettings)


module.exports = walletRouter