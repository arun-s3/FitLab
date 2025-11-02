const express = require('express')
const reviewRouter = express.Router()
const {createReview, getProductReviews} = require('../Controllers/reviewController')

const {isLogin, isLogout} = require('../Middlewares/Authentication')


reviewRouter.get('/:productId', isLogin, getProductReviews)
reviewRouter.post('/add', isLogin, createReview)



module.exports = reviewRouter
