const express = require('express')
const textChatBoxRouter = express.Router()
const {} = require('../Controllers/textChatBoxController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


// textChatBoxRouter.post('/', isLogin, getOrderCounts)
// textChatBoxRouter.get('/statusCounts', getOrderCounts)



module.exports = textChatBoxRouter