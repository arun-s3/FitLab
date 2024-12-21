const express = require('express')
const orderRouter = express.Router()
const {createOrder } = require('../Controllers/orderController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')

orderRouter.post('/add', isLogin, createOrder)


module.exports = orderRouter