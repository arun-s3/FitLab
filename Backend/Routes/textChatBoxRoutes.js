const express = require('express')
const textChatBoxRouter = express.Router()
const {getAdminChatHistory} = require('../Controllers/textChatBoxController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


textChatBoxRouter.get('/history', getAdminChatHistory)


module.exports = textChatBoxRouter