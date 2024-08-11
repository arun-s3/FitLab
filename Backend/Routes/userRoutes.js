const express = require('express')
const userRouter = express.Router()
const {isLogin} = require('../Middlewares/Authentication')
const {tester, createUser, loginUser, logout} = require('../Controllers/userController')

userRouter.get('/test', tester)

userRouter.post('/signup', createUser)
userRouter.post('/signin', loginUser)
userRouter.get('/signout', logout)


module.exports = userRouter 