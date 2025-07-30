const express = require('express')
const sessionRouter = express.Router()
const {bookSession, getAllSessions} = require('../Controllers/videoSupportSessionsController')
const {isLogin, isLogout} = require('../Middlewares/Authentication')



sessionRouter.post('/book', isLogin, bookSession)
sessionRouter.get('/sessions', isLogin, getAllSessions)



module.exports = sessionRouter
