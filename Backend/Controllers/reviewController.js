const Review = require('../Models/reviewModel')
const Product = require('../Models/productModel')

const {errorHandler} = require('../Utils/errorHandler')


const calculateAverageRating = async (productId)=> {
  const reviews = await Review.find({ productId })

  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      totalReviews: 0,
    })
    return
  }
  const avg = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

  await Product.findByIdAndUpdate(productId, {
    averageRating: avg.toFixed(1),
    totalReviews: reviews.length,
  })
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

    await calculateAverageRating(mainProductId)

    console.log('Review added----->', review)
    res.status(201).json({success: true, message: "Review submitted successfully", review});
  } 
  catch (error){
    console.log("Error in createReview -->", error.message)
    next(error)
  }
}


const updateReview = async (req, res, next)=> {
  try {
    const { reviewId } = req.params
    const { rating, title, comment } = req.body
    const userId = req.user._id

    const review = await Review.findById(reviewId)

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


const getProductReviews = async (req, res, next)=> {
  try {
    const { productId } = req.params

    const reviews = await Review.find({ productId })
      .populate("userId", "username profilePic isVerified") 
      .sort({ createdAt: -1 })

    if (!reviews.length){
      return res.status(200).json({success: true, message: "No reviews yet for this product", reviews: []});
    }
    res.status(200).json({success: true, reviewCounts: reviews.length, reviews})
  } 
  catch (error){
    console.log("Error in getProductReviews -->", error.message)
    next(error)
  }
}


const toggleHelpfulReview = async (req, res, next)=> {
  try {
    const { reviewId } = req.params
    const userId = req.user._id

    const review = await Review.findById(reviewId)
    if (!review) return next(errorHandler(404, "Review not found"))

    const alreadyHelpful = review.helpful.includes(userId)

    if (alreadyHelpful) {
      review.helpful.pull(userId)
      await review.save()
      res.status(200).json({ success: true, message: "Removed from helpful", helpfulCount: review.helpful.length });
    }
    else{
      review.helpful.push(userId)
      await review.save()
      res.status(200).json({ success: true, message: "Marked as helpful", helpfulCount: review.helpful.length });
    }
  }
  catch(error){
    console.log("Error in toggleHelpfulReview -->", error.message)
    next(error)
  }
}




module.exports = {createReview, updateReview, getProductReviews, toggleHelpfulReview }
