const express = require('express')
const dashboardRouter = express.Router()
const {isLogin, isLogout, authorizeAdmin} = require('../Middlewares/Authentication')
const {getAnnualRevenueStats, getMonthlyRevenue, getWeeklyRevenue, getAverageOrderTotal,
     getTotalOrdersCount, getHourlySalesOfDay, getRevenueByMainCategory} = require('../Controllers/dashboardControllers/salesInsightsController')
const {getOrdersStats} = require('../Controllers/dashboardControllers/ordersInsightsController')


dashboardRouter.get('/revenue/total', isLogin, authorizeAdmin, getAnnualRevenueStats) 
dashboardRouter.get('/revenue/monthly', isLogin, authorizeAdmin, getMonthlyRevenue) 
dashboardRouter.get('/revenue/weekly', isLogin, authorizeAdmin, getWeeklyRevenue) 
dashboardRouter.get('/revenue/hourly/:date', isLogin, authorizeAdmin, getHourlySalesOfDay) 
dashboardRouter.get('/revenue/category', isLogin, authorizeAdmin, getRevenueByMainCategory) 
dashboardRouter.get('/orders/average', isLogin, authorizeAdmin, getAverageOrderTotal) 
dashboardRouter.get('/orders/total', isLogin, authorizeAdmin, getTotalOrdersCount) 

dashboardRouter.get('/orders/stats', isLogin, authorizeAdmin, getOrdersStats) 



module.exports = dashboardRouter

