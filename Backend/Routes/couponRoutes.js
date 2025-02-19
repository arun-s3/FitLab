const express = require('express')
const couponRouter = express.Router()
const {createCoupon, getAllCoupons, updateCoupon, deleteCoupon, searchCoupons} = require('../Controllers/couponController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


couponRouter.get('/', isLogin, searchCoupons)
couponRouter.post('/add', isLogin, createCoupon)
couponRouter.post('/list', isLogin, getAllCoupons)
couponRouter.post('/update/:couponId', isLogin, updateCoupon)
couponRouter.delete('/delete/:couponId', isLogin, deleteCoupon)



module.exports = couponRouter