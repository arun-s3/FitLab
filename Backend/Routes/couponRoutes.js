const express = require('express')
const couponRouter = express.Router()
const {createCoupon, getAllCoupons} = require('../Controllers/couponController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


couponRouter.post('/add', isLogin, createCoupon)
couponRouter.post('/list', isLogin, getAllCoupons)


module.exports = couponRouter