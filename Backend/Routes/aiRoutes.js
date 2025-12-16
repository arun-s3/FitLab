const express = require('express')
const aiRouter = express.Router()
const {askAI} = require('../Controllers/AIControllers')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


aiRouter.get('/ask', isLogin, askAI)


module.exports = aiRouter