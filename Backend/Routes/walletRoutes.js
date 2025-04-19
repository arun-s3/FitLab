const express = require('express')
const walletRouter = express.Router()
const {getOrCreateWallet, addFundsToWallet} = require('../Controllers/walletController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


walletRouter.get('/', isLogin, getOrCreateWallet)
walletRouter.post('/add', isLogin, addFundsToWallet)


module.exports = walletRouter