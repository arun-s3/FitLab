const express = require('express')
const couponRouter = express.Router()
const {createCoupon, getAllCoupons, getEligibleCoupons, updateCoupon, deleteCoupon, searchCoupons,
     getBestCoupon, compareCoupons, toggleCouponStatus} = require('../Controllers/couponController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


couponRouter.get('/', isLogin, searchCoupons)
couponRouter.post('/add', isLogin, createCoupon)
couponRouter.post('/list', getAllCoupons)
couponRouter.post('/list-eligible', getEligibleCoupons)
couponRouter.post('/update/:couponId', isLogin, updateCoupon)
couponRouter.delete('/delete/:couponId', isLogin, deleteCoupon)
couponRouter.get('/bestCoupons', isLogin, getBestCoupon)
couponRouter.post('/compare', isLogin, compareCoupons)
couponRouter.patch('/toggle-status/:couponId', toggleCouponStatus)




module.exports = couponRouter