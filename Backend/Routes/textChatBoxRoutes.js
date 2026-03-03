const express = require('express')
const textChatBoxRouter = express.Router()
const {getAdminChatHistory} = require('../Controllers/textChatBoxController')
const {isLogin, authorizeAdmin} = require('../Middlewares/Authentication')


textChatBoxRouter.get('/history', isLogin, authorizeAdmin, getAdminChatHistory)


module.exports = textChatBoxRouter