const express = require('express')
const walletRouter = express.Router()
const {getOrCreateWallet, addFundsToWallet, getUserNameFromAccountNumber, addPeerAccount, sendMoneyToUser,
     requestMoneyFromUser, confirmMoneyRequest, declineMoneyRequest, payOrderWithWallet,
     updateAutoRechargeSettings, saveStripePaymentMethod, rechargeWalletWithRazorpayMoney, skipAutoRecharge} = require('../Controllers/walletController')
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
walletRouter.post('/save-stripe-settings', isLogin, saveStripePaymentMethod)
walletRouter.post('/recharge/razorpay', isLogin, rechargeWalletWithRazorpayMoney)
walletRouter.post('/recharge/skip', isLogin, skipAutoRecharge)

// walletRouter.post("/razorpay/autopay/callback",
//   express.json({ verify: (req, res, buf) => (req.rawBody = buf) }), 
//   handleRazorpayAutopayCallback
// )



module.exports = walletRouter