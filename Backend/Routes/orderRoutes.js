const express = require('express')
const orderRouter = express.Router()
const upload = require('../Utils/multer')
const {createOrder, applyCoupon, getOrders, getAllUsersOrders, cancelOrderProduct, cancelOrder, deleteProductFromOrderHistory, changeProductStatus,
     changeOrderStatus, initiateReturn, handleReturnDecision, cancelReturnRequest, processRefund, getOrderCounts, 
     getTodaysLatestOrder} = require('../Controllers/orderController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


orderRouter.post('/', isLogin, getOrders)
orderRouter.post('/all', isLogin, getAllUsersOrders)
// orderRouter.post('/apply-coupon', isLogin, applyCoupon)
orderRouter.post('/add', isLogin, createOrder)
orderRouter.patch('/status/:orderId', changeOrderStatus)
orderRouter.patch('/status/:orderId/products/:productId', changeProductStatus)
orderRouter.patch('/cancel', isLogin, cancelOrderProduct) 
orderRouter.patch('/cancel/:orderId', cancelOrder)
orderRouter.post('/delete/:orderId', deleteProductFromOrderHistory)
orderRouter.get('/statusCounts', getOrderCounts)
orderRouter.get('/latest', isLogin, getTodaysLatestOrder)
orderRouter.post('/return', upload.fields([{name:'images', maxCount:10}]), initiateReturn)
orderRouter.post('/return/decision', handleReturnDecision)
orderRouter.post('/return/cancel', cancelReturnRequest)
orderRouter.post('/refund', isLogin, processRefund)


module.exports = orderRouter