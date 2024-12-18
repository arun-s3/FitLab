const express = require('express')
const cartRouter = express.Router()
const {addToCart, removeFromCart, getTheCart, calculateCharges} = require('../Controllers/cartController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


cartRouter.get('/', isLogin, getTheCart)
cartRouter.post('/add', isLogin, addToCart)
cartRouter.post('/delete', isLogin, removeFromCart)
cartRouter.post('/calculate-charges', calculateCharges)


module.exports = cartRouter