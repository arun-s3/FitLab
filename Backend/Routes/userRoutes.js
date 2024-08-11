const express = require('express')
const userRouter = express.Router()
const {isLogin, isLogout} = require('../Middlewares/Authentication')
const {tester, createUser, loginUser, logout} = require('../Controllers/userController')

userRouter.get('/test', tester)

userRouter.post('/signup', isLogout, createUser)
userRouter.post('/signin', isLogout, loginUser)
userRouter.get('/signout', isLogin, logout)


module.exports = userRouter 