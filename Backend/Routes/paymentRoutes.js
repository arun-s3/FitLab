const express = require('express')
const paymentRouter = express.Router()
const {createRazorpayPayment, verifyRazorpayPayment, getRazorpayKey, createStripePayment, saveStripePayment,
    getPaypalClientId, createPaypalOrder, capturePaypalOrder, savePaypalPayment
} = require('../Controllers/paymentController')
const {isLogin} = require('../Middlewares/Authentication')


paymentRouter.get('/razorpay/key', isLogin, getRazorpayKey)
paymentRouter.post('/razorpay/order', isLogin, createRazorpayPayment)
paymentRouter.post('/razorpay/verify', isLogin, verifyRazorpayPayment)

paymentRouter.post('/stripe/order', createStripePayment)
paymentRouter.post('/stripe/save', isLogin, saveStripePayment)

paymentRouter.get('/paypal/clientid', isLogin, getPaypalClientId)
paymentRouter.post('/paypal/order', createPaypalOrder)
paymentRouter.post('/paypal/capture', capturePaypalOrder)
paymentRouter.post('/paypal/save', isLogin, savePaypalPayment)



module.exports = paymentRouter
