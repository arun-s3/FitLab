const express = require('express')
const cartRouter = express.Router()
const {addToCart, removeFromCart} = require('../Controllers/cartController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


cartRouter.post('/add', isLogin, addToCart)
cartRouter.post('/delete', isLogin, removeFromCart)


module.exports = cartRouter