const express = require('express')
const userRouter = express.Router()
const {isLogin, isLogout} = require('../Middlewares/Authentication')
const {tester, createUser, sendOtp, verifyOtp, loginUser, googleSignin, signout, googleSignout} = require('../Controllers/userController')

userRouter.get('/test', tester)

userRouter.post('/signup', isLogout, createUser)
userRouter.post('/sendOtp', sendOtp) //isLogout, 
userRouter.post('/verifyOtp', verifyOtp) //isLogout,
userRouter.post('/signin', isLogout, loginUser)
userRouter.get('/signout', isLogin, signout)
userRouter.post('/googleSignin', googleSignin)
userRouter.get('/googlesignout', signout)

module.exports = userRouter 