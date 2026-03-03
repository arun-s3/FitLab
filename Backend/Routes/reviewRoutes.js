const express = require('express')
const reviewRouter = express.Router()
const {createReview, updateReview, getProductReviews, toggleHelpfulReview, getProductRatingStats} = require('../Controllers/reviewController')

const {isLogin, optionalAuth} = require('../Middlewares/Authentication')


reviewRouter.get('/:productId', optionalAuth, getProductReviews)
reviewRouter.post('/add', isLogin, createReview)
reviewRouter.post('/update/:reviewId', isLogin, updateReview)
reviewRouter.get('/toggleHelpful/:reviewId', isLogin, toggleHelpfulReview)
reviewRouter.get('/stats/:productId', optionalAuth, getProductRatingStats)



module.exports = reviewRouter
