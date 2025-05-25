const express = require('express')
const textChatBoxRouter = express.Router()
const {} = require('../Controllers/textChatBoxController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')



module.exports = textChatBoxRouter