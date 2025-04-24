const express = require('express')
const walletRouter = express.Router()
const {getOrCreateWallet, addFundsToWallet, getUserNameFromAccountNumber, addBeneficiaryAccount, sendMoneyToUser,
     requestMoneyFromUser} = require('../Controllers/walletController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


walletRouter.get('/', isLogin, getOrCreateWallet)
walletRouter.post('/add', isLogin, addFundsToWallet)
walletRouter.get('/account/:acc', isLogin, getUserNameFromAccountNumber)
walletRouter.post('/beneficiary', isLogin, addBeneficiaryAccount)
walletRouter.post('/send', isLogin, sendMoneyToUser)
walletRouter.post('/request', isLogin, requestMoneyFromUser)


module.exports = walletRouter