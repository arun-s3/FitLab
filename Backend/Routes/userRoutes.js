const express = require('express')
const userRouter = express.Router()
const {tester} = require('../Controllers/userController')

userRouter.get('/test', tester)



module.exports = userRouter 