const express = require('express')
const aiRouter = express.Router()
const {askAIForAnalysis, getTodayAiFitnessInsights, getTodayBusinessInsight} = require('../Controllers/aiController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


aiRouter.post('/ask', isLogin, askAIForAnalysis)
aiRouter.get('/insights/tracker', isLogin, getTodayAiFitnessInsights) 
aiRouter.get('/insights/business', isLogin, getTodayBusinessInsight)


module.exports = aiRouter