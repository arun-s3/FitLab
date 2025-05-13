const express = require('express')
const dashboardRouter = express.Router()
const {isLogin, isLogout, authorizeAdmin} = require('../Middlewares/Authentication')

const {getAnnualRevenueStats, getMonthlyRevenue, getWeeklyRevenue, getAverageOrderTotal,
     getTotalOrdersCount, getHourlySalesOfDay, getRevenueByMainCategory} = require('../Controllers/dashboardControllers/salesInsightsController')

const {getOrdersStats, getMonthlyOrderStats, getTopFiveProductsByOrders, getOrderStatusDistribution,
} = require('../Controllers/dashboardControllers/ordersInsightsController')

const {getUserMetrics, getUserTypePercentages, getMonthlyCustomersGrowth, getTopVIPCustomers
} = require('../Controllers/dashboardControllers/customersInsightsController')

const {getProductStockInsights, getLowStockProducts, getCategoryStockDatas} = require('../Controllers/dashboardControllers/inventoryInsightsController')

const {getCouponRevenueStats, getCouponStats, getCouponRedemptionDetails, getDiscountImpactDatas}
      = require('../Controllers/dashboardControllers/couponInsightsController')

const {getOfferRevenueStats, getOfferStats, getTopUsedOffers, getMonthlyOfferStats, getOffersCountByUserGroup} 
      = require('../Controllers/dashboardControllers/offerInsightsController')
      
const {getWalletAndRefundStats, getPaymentMethodStats, getMonthlyRefundRequests} = require('../Controllers/dashboardControllers/paymentInsightsController')



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

dashboardRouter.get('/products/stock', isLogin, authorizeAdmin, getProductStockInsights) 
dashboardRouter.get('/products/stock/low', isLogin, authorizeAdmin, getLowStockProducts) 
dashboardRouter.get('/category/stock', isLogin, authorizeAdmin, getCategoryStockDatas) 

dashboardRouter.get('/coupons/revenue', isLogin, authorizeAdmin, getCouponRevenueStats)  
dashboardRouter.get('/coupons/stats', isLogin, authorizeAdmin, getCouponStats) 
dashboardRouter.get('/coupons/redemptions', isLogin, authorizeAdmin, getCouponRedemptionDetails) 
dashboardRouter.get('/coupons/impact', isLogin, authorizeAdmin, getDiscountImpactDatas) 

dashboardRouter.get('/offers/revenue', isLogin, authorizeAdmin, getOfferRevenueStats) 
dashboardRouter.get('/offers/stats', isLogin, authorizeAdmin, getOfferStats) 
dashboardRouter.get('/offers/top', isLogin, authorizeAdmin, getTopUsedOffers) 
dashboardRouter.get('/offers/monthly', isLogin, authorizeAdmin, getMonthlyOfferStats) 
dashboardRouter.get('/offers/userGroup', isLogin, authorizeAdmin, getOffersCountByUserGroup) 

dashboardRouter.get('/payments/stats', isLogin, authorizeAdmin, getWalletAndRefundStats) 
dashboardRouter.get('/payments/methods', isLogin, authorizeAdmin, getPaymentMethodStats) 
dashboardRouter.get('/payments/refunds', isLogin, authorizeAdmin, getMonthlyRefundRequests) 



module.exports = dashboardRouter

