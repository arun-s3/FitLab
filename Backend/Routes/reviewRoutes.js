const express = require('express')
const reviewRouter = express.Router()
const {createReview, updateReview, getProductReviews, toggleHelpfulReview, getProductRatingStats} = require('../Controllers/reviewController')

const {isLogin, isLogout} = require('../Middlewares/Authentication')


reviewRouter.get('/:productId', isLogin, getProductReviews)
reviewRouter.post('/add', isLogin, createReview)
reviewRouter.post('/update/:reviewId', isLogin, updateReview)
reviewRouter.get('/toggleHelpful/:reviewId', isLogin, toggleHelpfulReview)
reviewRouter.get('/stats/:productId', isLogin, getProductRatingStats)



module.exports = reviewRouter
