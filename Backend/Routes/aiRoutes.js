const express = require('express')
const aiRouter = express.Router()
const {askAIForAnalysis, askAICoach, getTodayAiFitnessInsights, getTodayBusinessInsight} = require('../Controllers/aiController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


aiRouter.post('/analyze', isLogin, askAIForAnalysis)
aiRouter.post('/coach', isLogin, askAICoach)

aiRouter.get('/insights/tracker', isLogin, getTodayAiFitnessInsights) 
aiRouter.get('/insights/business', isLogin, getTodayBusinessInsight)


module.exports = aiRouter