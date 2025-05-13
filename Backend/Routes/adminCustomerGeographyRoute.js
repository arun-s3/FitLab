const express = require('express')
const geographyRouter = express.Router()
const {isLogin, isLogout, authorizeAdmin} = require('../Middlewares/Authentication')

const {getCustomerHeatmapData, getUserAndOrderStatsByState} = require('../Controllers/dashboardControllers/userGeographyInsightController')


geographyRouter.get('/map', isLogin, authorizeAdmin, getCustomerHeatmapData) 
geographyRouter.get('/stats', isLogin, authorizeAdmin, getUserAndOrderStatsByState) 


module.exports = geographyRouter