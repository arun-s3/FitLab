const express = require('express')
const webhookRouter = express.Router() 
const {handleRazorpayWebhook} = require('../Webhooks/razorpayWebhook')
const {handleStripeWebhook} = require('../Webhooks/stripeWebhook')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


// webhookRouter.post('/razorpay', isLogin, express.raw({type: 'application/json'}), handleRazorpayWebhook)

webhookRouter.post('/stripe', isLogin, express.raw({ type: 'application/json' }), handleStripeWebhook)


module.exports = webhookRouter
