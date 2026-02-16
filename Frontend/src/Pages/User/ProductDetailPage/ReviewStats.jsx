import React, {useState, useEffect} from "react"
import { motion } from "framer-motion"

import apiClient from '../../../Api/apiClient'


export default function ReviewsStats({ productId, rating, totalReviews }) {

  const [ratingDistribution, setRatingDistribution] = useState({})

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  useEffect(()=> {
    async function loadReviewStats(){  
        try{ 
          const response = await apiClient.get(`${baseApiUrl}/review/stats/${productId}`)
          if(response?.data?.success){
            setRatingDistribution(response.data.ratingCounts)
          }
        }
        catch(error){
          console.error(error)
        }
      }
    loadReviewStats()
  }, [rating, totalReviews])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <motion.div
      className="bg-gray-50 dark:bg-zinc-900 p-8 rounded-lg"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.div className="text-center mb-8" variants={itemVariants}>
        <div className="flex justify-center mb-[5px]">
          <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <span className="text-5xl font-bold text-gray-900 dark:text-white">{rating}</span>
          </motion.div>
        </div>

        <div className="flex justify-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <svg
                className={`w-5 h-5 ${
                  i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            </motion.div>
          ))}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">Based on {totalReviews} reviews</p>
      </motion.div>

      <motion.div className="space-y-3" variants={containerVariants}>
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = ratingDistribution[stars]
          const percentage = (count / totalReviews) * 100

          return (
            <motion.div key={stars} className="flex items-center gap-3" variants={itemVariants}>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">{stars} ⭐</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 w-10 text-right">{count}</span>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700" variants={itemVariants}>
        <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
          ✓ All reviews are from verified purchases
        </p>
      </motion.div>
    </motion.div>
  )
}
