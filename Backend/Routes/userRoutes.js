const express = require('express')
const userRouter = express.Router()
const {isLogin} = require('../Middlewares/Authentication')
const {tester, createUser, loginUser} = require('../Controllers/userController')

userRouter.get('/test', tester)

userRouter.post('/signup', createUser)
userRouter.post('/signin', loginUser)



module.exports = userRouter 