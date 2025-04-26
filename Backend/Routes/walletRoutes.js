const express = require('express')
const walletRouter = express.Router()
const {getOrCreateWallet, addFundsToWallet, getUserNameFromAccountNumber, addPeerAccount, sendMoneyToUser,
     requestMoneyFromUser, confirmMoneyRequest, declineMoneyRequest} = require('../Controllers/walletController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


walletRouter.get('/', isLogin, getOrCreateWallet)
walletRouter.post('/add', isLogin, addFundsToWallet)
walletRouter.get('/account/:acc', isLogin, getUserNameFromAccountNumber)
walletRouter.post('/peer-account', isLogin, addPeerAccount)
walletRouter.post('/send', isLogin, sendMoneyToUser)
walletRouter.post('/request', isLogin, requestMoneyFromUser)
walletRouter.post('/request-confirm', isLogin, confirmMoneyRequest)
walletRouter.post('/request-decline', isLogin, declineMoneyRequest)



module.exports = walletRouter