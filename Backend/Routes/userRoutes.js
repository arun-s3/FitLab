const express = require('express')
const userRouter = express.Router()
const {isLogin, isLogout} = require('../Middlewares/Authentication')
const {tester, createUser, sendOtp, verifyOtp, loginUser, updateForgotPassword, resetPassword, updateUserDetails, googleSignin,
     signout, googleSignout} = require('../Controllers/userController')

userRouter.get('/test', tester)

userRouter.post('/signup', isLogout, createUser)
userRouter.post('/sendOtp', sendOtp)                                                                                                         //isLogout, 
userRouter.post('/verifyOtp', verifyOtp)                                                                                                     //isLogout,
userRouter.post('/signin', isLogout, loginUser)
userRouter.post('/update', isLogin, updateUserDetails)
userRouter.post('/password/reset', isLogin, updateForgotPassword)
userRouter.post('/password/update', isLogin, resetPassword)
userRouter.get('/signout', isLogin, signout)
userRouter.post('/googleSignin', googleSignin)
userRouter.get('/googlesignout', signout) 

module.exports = userRouter 