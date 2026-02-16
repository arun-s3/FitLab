import React,{useState, useEffect, useRef} from "react"
import { motion } from "framer-motion"

import apiClient from '../../../Api/apiClient'
import {toast as sonnerToast} from 'sonner'

import ReviewsStats from "./ReviewStats"
import ReviewForm from '../../../Components/ReviewForm/ReviewForm'
import ReviewCard from "./ReviewCard"
import PaginationV2 from '../../../Components/PaginationV2/PaginationV2'


export default function ReviewsPanel({ productId, productRating, totalReviews }) {

  const [reviews, setReviews] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [sortBy, setSortBy] = useState("newest")

  const [rating, setRating] = useState(productRating)
  const [totalReviewCount, setTotalReviewCount] = useState(totalReviews)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(20)  
  const limit = 6

  const [editReview, setEditReview] = useState(null)

  const [reviewSet, setReviewSet] = useState({firstIndex: 0, lastIndex: 3})  

  const reviewFormRef = useRef(null)

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  async function loadReviews(){  
    try{ 
      const response = await apiClient.get(`${baseApiUrl}/review/${productId}?sort=${sortBy}&page=${currentPage}`)
      if(response.data.success){
        setReviews(response.data.reviews)
        setRating(response.data.productAvgReview)
        setTotalReviewCount(response.data.productTotalReview)
        setTotalPages(response.data.totalPages)
      }
    }
    catch(error){
        sonnerToast.error("Error while loading the reviews.")
    }
  }

  useEffect(()=> {
    loadReviews()
  }, [])

  useEffect(()=> {
    if(reviews && totalReviews && totalPages && limit){
      loadReviews()
      setTotalPages(Math.ceil(totalReviews/limit))
    }
  }, [currentPage])   

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  const handleAddReview = async(newReview) => {
    setShowForm(false)
      try{
        const response = await apiClient.post(`${baseApiUrl}/review/add`, {productId, ...newReview})
        if(response?.data?.success){
          sonnerToast.success("Your review has been submitted successfully!")
          loadReviews()
        }
      }
      catch(error){
        if (!error.response) {
          sonnerToast.error("Network error. Please check your internet.")
        } else if (error.response.status === 400 || error.response.status === 404) {
          sonnerToast.error(error.response.data.message || "Error while submitting your review. Please try again later!")
        } else{
          sonnerToast.error("Internal server error")
        }
      }
  }

  const handleReviewSort = (value)=> {
    setSortBy(value)
    loadReviews()
  }

  const openEditReviewForm = (review)=> {
    setShowForm(true)
    setEditReview(review)
  }

   const handleEditReview = async(review) => {
    setShowForm(false)
      try{
        const response = await apiClient.post(`${baseApiUrl}/review/update/${review._id}`, {productId, ...review})
        if(response.data.success){
          sonnerToast.success("Your review has been updated successfully!")
          loadReviews()
        }
      }
      catch(error){
        if (!error.response) {
          sonnerToast.error("Network error. Please check your internet.")
        } else if (error.response.status === 400 || error.response.status === 404) {
          sonnerToast.error(error.response.data.message || "Error while updating your review. Please try again later!")
        } else{
          sonnerToast.error("Internal server error")
        }
      }
   }


  return (
    <motion.section
      className=""
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      ref={reviewFormRef}
    >
      <motion.div className="mb-12" variants={itemVariants}>
        <h2 className="text-[20px] md:text-[24px] font-bold text-gray-900 dark:text-white">Customer Reviews</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {
            (totalReviewCount > 0 || totalReviews > 0) 
              ? 'See what our customers think about this product'
              : 'Be the first to review the product!'
          }
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">

        {
          (totalReviewCount > 0 || totalReviews > 0) &&
            <motion.div variants={itemVariants} className="lg:col-span-1">
              {
                reviews && rating && totalReviewCount &&
                  <ReviewsStats productId={productId} rating={rating} totalReviews={totalReviewCount} />
              }
            </motion.div>
        }

        <motion.div className="lg:col-span-3" variants={containerVariants}>
          <motion.button
            onClick={() => setShowForm(status=> !status)}
            className="w-full mb-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 
              hover:to-purple-800 text-white font-semibold rounded-lg transition transform"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={itemVariants}
          >
            {showForm ? "Cancel" : "Write a Review"}
          </motion.button>

          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <ReviewForm onSubmit={handleAddReview} editReview={editReview} onEditSubmission={handleEditReview}/>
            </motion.div>
          )}

          {
            (totalReviewCount > 0 || totalReviews > 0) &&
              <motion.div className="mb-6 flex items-center gap-4" variants={itemVariants}>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sort by:</span>
                <select
                  value={sortBy}    
                  onChange={(e)=> handleReviewSort(e.target.value)}
                  className="!w-40 px-4 py-[4px] text-[14px] bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-700 
                    rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                >
                  <option value="most-helpful">Most Helpful</option>
                  <option value="newest">Newest</option>
                  <option value="highest-rating">Highest Rating</option>
                  <option value="lowest-rating">Lowest Rating</option>
                  <option value="oldest">Oldest</option>
                </select>
              </motion.div>
          }

          <motion.div className="space-y-4" variants={containerVariants}>
            {
              reviews &&
                reviews.slice(reviewSet.firstIndex, reviewSet.lastIndex).map((review, index) => (
                  <ReviewCard key={review._id} 
                    review={review} 
                    index={index} 
                    onEdit={(review)=> {
                      reviewFormRef.current?.scrollIntoView({ behavior: "smooth" })
                      openEditReviewForm(review)
                    }}
                  />
              ))
            }
          </motion.div>

          {reviews && reviews.length > 0 && (
            <motion.button
              className="w-full mt-8 px-6 py-3 border border-gray-300 text-secondary 
                font-semibold rounded-lg hover:bg-gray-100 transition"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
              onClick={()=> {
                reviewSet.lastIndex === 3 ? setReviewSet({firstIndex: 0, lastIndex: 6}) : setReviewSet({firstIndex: 0, lastIndex: 3})
              }}
            >
               {
                reviewSet.lastIndex === 3 
                  ? <span> Load More Reviews </span> 
                  : <span> See Less Reviews </span>
               }
            </motion.button>
          )}

          {
            totalReviews > 0 && totalPages &&
              <PaginationV2 currentPage={currentPage} totalPages={totalPages} onPageChange={(page)=> setCurrentPage(page)} />
          }

        </motion.div>

      </div>
    </motion.section>
  )
}
