const express = require('express')
const orderRouter = express.Router()
const {createOrder, getOrders, cancelOrderProduct, cancelOrder} = require('../Controllers/orderController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


orderRouter.post('/', isLogin, getOrders)
orderRouter.post('/add', isLogin, createOrder)
orderRouter.patch('/cancel', isLogin, cancelOrderProduct)
orderRouter.patch('/cancel/:orderId', cancelOrder)

module.exports = orderRouter