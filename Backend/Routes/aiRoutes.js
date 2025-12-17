const express = require('express')
const aiRouter = express.Router()
const {askAIForAnalysis} = require('../Controllers/AiControllers')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


aiRouter.post('/ask', isLogin, askAIForAnalysis)


module.exports = aiRouter