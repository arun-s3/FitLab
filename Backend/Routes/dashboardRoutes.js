const express = require('express')
const dashboardRouter = express.Router()
const {isLogin, isLogout, authorizeAdmin} = require('../Middlewares/Authentication')
const {getAnnualRevenueStats, getMonthlyRevenue, getAverageOrderTotal, getTotalOrdersCount} = require('../Controllers/dashboardController')



dashboardRouter.get('/revenue/total',isLogin, authorizeAdmin, getAnnualRevenueStats) 
dashboardRouter.get('/revenue/monthly',isLogin, authorizeAdmin, getMonthlyRevenue) 
dashboardRouter.get('/orders/average',isLogin, authorizeAdmin, getAverageOrderTotal) 
dashboardRouter.get('/orders/total',isLogin, authorizeAdmin, getTotalOrdersCount) 



module.exports = dashboardRouter