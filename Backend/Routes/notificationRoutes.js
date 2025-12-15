const express = require('express')
const notificationRouter = express.Router()
const {getUserNotifications} = require('../Controllers/notificationController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')


notificationRouter.get('/', isLogin, getUserNotifications)


module.exports = notificationRouter