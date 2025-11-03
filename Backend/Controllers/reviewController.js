const mongoose = require("mongoose")
const Review = require('../Models/reviewModel')
const Product = require('../Models/productModel')

const {errorHandler} = require('../Utils/errorHandler')


const calculateAverageRating = async (productId)=> {
  console.log("Inside calculateAverageRating...")
  const reviews = await Review.find({ productId })

  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      totalReviews: 0,
    })
    return
  }
  const avg = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

  const averageRating = avg.toFixed(1)
  const totalReviews = reviews.length
  console.log(`averageRating---->${averageRating} and totalReviews---->${totalReviews}`)

  await Product.findByIdAndUpdate(productId, {averageRating, totalReviews})
  return {averageRating, totalReviews}
}


const createReview = async (req, res, next)=> {
  try {
    console.log("Inside createReview...")

    const {productId, rating, title, comment} = req.body
    console.log(JSON.stringify({productId, rating, title, comment}))

    const userId = req.user._id

    const product = await Product.findById(productId)
    if (!product) {
      return next(errorHandler(404, "Product not found"))
    }

    const mainProductId = product.variantOf ? product.variantOf : product._id

    const existingReview = await Review.findOne({
      productId: mainProductId,
      userId,
    })

    if (existingReview) {
      return next(errorHandler(400, "You have already reviewed this product"));
    }

    const review = await Review.create({
      productId: mainProductId,
      userId,
      rating,
      title,
      comment,
    })

    const reviewStats = await calculateAverageRating(mainProductId)

    console.log('Review added----->', review)
    res.status(201).json({success: true, message: "Review submitted successfully", review, productAvgReview: reviewStats.averageRating, productTotalReview: reviewStats.totalReviews});
  } 
  catch (error){
    console.log("Error in createReview -->", error.message)
    next(error)
  }
}


const updateReview = async (req, res, next)=> {
  try {
    console.log("Inside updateReview...")
    const { reviewId } = req.params
    const { rating, title, comment } = req.body
    const userId = req.user._id

    const review = await Review.findById(reviewId)
    console.log("Review found--->", review)

    if (!review) return next(errorHandler(404, "Review not found"))
    if (review.userId.toString() !== userId.toString()){
        return next(errorHandler(403, "You can only edit your own review"))
    }

    const daysSinceCreated = (Date.now() - new Date(review.createdAt)) / (1000 * 60 * 60 * 24)
    if (daysSinceCreated > 30) {
      return next(errorHandler(400, "You can edit your review within 30 days only"))
    }

    review.title = title
    review.rating = rating
    review.comment = comment
    await review.save()

    await calculateAverageRating(review.productId)

    res.status(200).json({success: true, message: "Review updated successfully", review});
  }
  catch (error) {
    console.log("Error in createReview -->", error.message)
    next(error)
  }
}


const getProductReviews = async (req, res, next) => {
  try {
    console.log("Inside getProductReviews...")

    const {productId} = req.params
    const {sort = "newest", page = 1} = req.query 
    const limit = 6

    console.log(`sort--> ${sort} and page--> ${page}`)
    const currentPage = Math.max(parseInt(page), 1)
    const perPage = Math.max(parseInt(limit), 1)
    const skip = (currentPage - 1) * perPage

    let sortOption = {}

    switch (sort) {
      case "most-helpful":
        sortOption = { helpfulCount: -1, createdAt: -1 }
        break
      case "highest-rating":
        sortOption = { rating: -1, createdAt: -1 }
        break
      case "lowest-rating":
        sortOption = { rating: 1, createdAt: -1 }
        break
      case "oldest":
        sortOption = { createdAt: 1 }
        break
      default:
        sortOption = { createdAt: -1 } // newest
        break
    }

    const reviews = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      {
        $addFields: {
          helpfulCount: { $size: "$helpful" }
        }
      },
      { $sort: sortOption },
      { $skip: skip },
      { $limit: perPage }
    ])

    const populatedReviews = await Review.populate(reviews, {
      path: "userId",
      select: "username profilePic isVerified"
    })

    const totalReviews = await Review.countDocuments({ productId })

    const reviewStats = await calculateAverageRating(productId)

    if (!populatedReviews.length) {
      return res.status(200).json({
        success: true,
        message: "No reviews yet for this product",
        reviews: [],
        currentPage,
        totalPages: 0,
        productAvgReview: reviewStats.averageRating,
        productTotalReview: reviewStats.totalReviews,
      })
    }

    res.status(200).json({
      success: true,
      sortBy: sort,
      currentPage,
      totalPages: Math.ceil(totalReviews / perPage),
      totalReviews,
      reviews: populatedReviews,
      productAvgReview: reviewStats.averageRating,
      productTotalReview: reviewStats.totalReviews,
    })
  }
  catch (error) {
    console.log("Error in getProductReviews -->", error.message)
    next(error)
  }
}



const toggleHelpfulReview = async (req, res, next)=> {
  try {
    console.log("Inside toggleHelpfulReview...")
    const { reviewId } = req.params
    const userId = req.user._id

    const review = await Review.findById(reviewId)
    if (!review) return next(errorHandler(404, "Review not found"))

    const alreadyHelpful = review.helpful.includes(userId)
    console.log("alreadyHelpful---->", alreadyHelpful)

    if (alreadyHelpful) {
      review.helpful.pull(userId)
      await review.save()
      res.status(200).json({ success: true, helpfulStatus: false, helpfulCount: review.helpful.length });
    }
    else{
      review.helpful.push(userId)
      await review.save()
      res.status(200).json({ success: true, helpfulStatus: true, helpfulCount: review.helpful.length });
    }
  }
  catch(error){
    console.log("Error in toggleHelpfulReview -->", error.message)
    next(error)
  }
}


const getProductRatingStats = async (req, res, next) => {
  try {
    console.log("Inside getProductRatingStats...")
    const { productId } = req.params

    const breakdown = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: -1 } } 
    ])

    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    let total = 0
    let totalWeighted = 0

    breakdown.forEach(item => {
      ratingCounts[item._id] = item.count
      total += item.count
      totalWeighted += item._id * item.count
    })
    console.log("Breakdown----->", JSON.stringify(breakdown))
    const averageRating = total > 0 ? (totalWeighted / total).toFixed(1) : 0

    res.status(200).json({success: true, averageRating, totalReviews: total, ratingCounts})
  }
  catch (error) {
    console.log("Error in getProductRatingBreakdown -->", error.message)
    next(error)
  }
}



module.exports = {createReview, updateReview, getProductReviews, toggleHelpfulReview, getProductRatingStats}
