const express = require('express')
const couponRouter = express.Router()
const {createCoupon, getAllCoupons, getEligibleCoupons, updateCoupon, deleteCoupon, searchCoupons,
     getBestCoupon, compareCoupons, toggleCouponStatus} = require('../Controllers/couponController')
const {isLogin, optionalAuth, authorizeAdmin, isLogout} = require('../Middlewares/Authentication')


couponRouter.get('/', optionalAuth, searchCoupons)
couponRouter.post('/add', isLogin, authorizeAdmin, createCoupon)
couponRouter.post('/list', getAllCoupons)
couponRouter.post('/list-eligible', isLogin, getEligibleCoupons)
couponRouter.post('/update/:couponId', isLogin, authorizeAdmin, updateCoupon)
couponRouter.delete('/delete/:couponId', isLogin, authorizeAdmin, deleteCoupon)
couponRouter.get('/bestCoupons', isLogin, getBestCoupon)
couponRouter.post('/compare', isLogin, compareCoupons)
couponRouter.patch('/toggle-status/:couponId', isLogin, authorizeAdmin, toggleCouponStatus)




module.exports = couponRouter