const express = require('express')
const paymentRouter = express.Router()
const {createRazorpayPayment, verifyRazorpayPayment} = require('../Controllers/paymentController')
const {isLogin} = require('../Middlewares/Authentication')


paymentRouter.post('/order', isLogin, createRazorpayPayment)
paymentRouter.post('/verify/:orderId', isLogin, verifyRazorpayPayment)


module.exports = paymentRouter
