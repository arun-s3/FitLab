const express = require('express')
const couponRouter = express.Router()
const {createCoupon, getAllCoupons, updateCoupon, deleteCoupon, searchCoupons,
     getBestCoupon, compareCoupons} = require('../Controllers/couponController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


couponRouter.get('/', isLogin, searchCoupons)
couponRouter.post('/add', isLogin, createCoupon)
couponRouter.post('/list', isLogin, getAllCoupons)
couponRouter.post('/update/:couponId', isLogin, updateCoupon)
couponRouter.delete('/delete/:couponId', isLogin, deleteCoupon)
couponRouter.get('/bestCoupons', isLogin, getBestCoupon)
couponRouter.post('/compare', isLogin, compareCoupons)




module.exports = couponRouter