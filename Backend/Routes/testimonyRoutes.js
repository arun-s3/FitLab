const express = require('express')
const testimonyRouter = express.Router()
const {createOrUpdateTestimony, getTopTestimonies} = require('../Controllers/testimonyController')

const {isLogin, isLogout} = require('../Middlewares/Authentication')


testimonyRouter.post('/add', isLogin, createOrUpdateTestimony)
testimonyRouter.get('/top', getTopTestimonies)


module.exports = testimonyRouter
