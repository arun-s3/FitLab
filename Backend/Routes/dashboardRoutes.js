const express = require('express')
const dashboardRouter = express.Router()
const {isLogin, isLogout, authorizeAdmin} = require('../Middlewares/Authentication')

const {getAnnualRevenueStats, getMonthlyRevenue, getWeeklyRevenue, getAverageOrderTotal,
     getTotalOrdersCount, getHourlySalesOfDay, getRevenueByMainCategory} = require('../Controllers/dashboardControllers/salesInsightsController')
const {getOrdersStats, getMonthlyOrderStats, getTopFiveProductsByOrders, getOrderStatusDistribution,
} = require('../Controllers/dashboardControllers/ordersInsightsController')
const {getUserMetrics, getUserTypePercentages, getMonthlyCustomersGrowth, getTopVIPCustomers
} = require('../Controllers/dashboardControllers/customersInsightsController')

dashboardRouter.get('/revenue/total', isLogin, authorizeAdmin, getAnnualRevenueStats) 
dashboardRouter.get('/revenue/monthly', isLogin, authorizeAdmin, getMonthlyRevenue) 
dashboardRouter.get('/revenue/weekly', isLogin, authorizeAdmin, getWeeklyRevenue) 
dashboardRouter.get('/revenue/hourly/:date', isLogin, authorizeAdmin, getHourlySalesOfDay) 
dashboardRouter.get('/revenue/category', isLogin, authorizeAdmin, getRevenueByMainCategory) 
dashboardRouter.get('/orders/average', isLogin, authorizeAdmin, getAverageOrderTotal) 
dashboardRouter.get('/orders/total', isLogin, authorizeAdmin, getTotalOrdersCount) 

dashboardRouter.get('/orders/stats', isLogin, authorizeAdmin, getOrdersStats) 
dashboardRouter.get('/orders/stats/monthly', isLogin, authorizeAdmin, getMonthlyOrderStats) 
dashboardRouter.get('/products/top', isLogin, authorizeAdmin, getTopFiveProductsByOrders) 
dashboardRouter.get('/orders/status-percent', isLogin, authorizeAdmin, getOrderStatusDistribution) 

dashboardRouter.get('/customers/metrics', isLogin, authorizeAdmin, getUserMetrics) 
dashboardRouter.get('/customers/types', isLogin, authorizeAdmin, getUserTypePercentages) 
dashboardRouter.get('/customers/monthly', isLogin, authorizeAdmin, getMonthlyCustomersGrowth) 
dashboardRouter.get('/customers/vip', isLogin, authorizeAdmin, getTopVIPCustomers) 


module.exports = dashboardRouter

