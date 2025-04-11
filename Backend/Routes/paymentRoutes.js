const express = require('express')
const paymentRouter = express.Router()
const {createRazorpayPayment, verifyRazorpayPayment, getRazorpayKey} = require('../Controllers/paymentController')
const {isLogin} = require('../Middlewares/Authentication')


paymentRouter.get('/razorpay/key', isLogin, getRazorpayKey)
paymentRouter.post('/razorpay/order', isLogin, createRazorpayPayment)
paymentRouter.post('/razorpay/verify', isLogin, verifyRazorpayPayment)


module.exports = paymentRouter
