const express = require('express')
const cartRouter = express.Router()
const {addToCart, reduceFromCart, removeFromCart, getTheCart, calculateCharges, applyCoupon, removeCoupon} = require('../Controllers/cartController')
const {isLogin, optionalAuth} = require('../Middlewares/Authentication')


cartRouter.get('/', optionalAuth, getTheCart)
cartRouter.post('/add', isLogin, addToCart)
cartRouter.post('/reduce', isLogin, reduceFromCart)
cartRouter.post('/delete', isLogin, removeFromCart)
cartRouter.post('/calculate-charges', calculateCharges)
cartRouter.post('/apply-coupon', isLogin, applyCoupon)
cartRouter.get('/remove-coupon', isLogin, removeCoupon)




module.exports = cartRouter