import React, { useState } from "react"
import {useSelector} from 'react-redux'
import { motion } from "framer-motion"

import {Check, UserPen} from "lucide-react"
import { FaRegThumbsUp } from "react-icons/fa6";
import { FaThumbsUp } from "react-icons/fa6";

import {toast as sonnerToast} from 'sonner'
import apiClient from '../../../Api/apiClient'


export default function ReviewCard({ review, index, onEdit }){

  const {user} = useSelector(state=> state.user)

  const [helpfulCount, setHelpfulCount] = useState(review.helpful.length)
  const [isHelpful, setIsHelpful] = useState(review.helpful.includes(user._id))

  const [editTooltip, setEditTooltip] = useState(false)
  const [editingReview, setEditingReview] = useState(false)

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  const handleHelpful = async() => {
    try{
      const response = await apiClient.get(`${baseApiUrl}/review/toggleHelpful/${review._id}`)
      if(response?.data?.success){ 
        setIsHelpful(response.data.helpfulStatus)
        setHelpfulCount(response.data.helpfulCount)
      }
    }
    catch(error){
      if (!error.response) {
        sonnerToast.error("Network error. Please check your internet.")
      }else {
        sonnerToast.error("Something went wrong! Please retry later.")
      }
    }
  }
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut", delay: index * 0.1 },
    },
  }

  return (
    <motion.div
      className={`bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 
        hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-gray-900/50 transition ${editingReview && 'hidden'}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <motion.div
            className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0"
            whileHover={{ scale: 1.1 }}
          >
            <img src={review.userId.profilePic || "/placeholder.svg"} alt={review.userId.username} className="w-full h-full object-cover" />
          </motion.div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white">{review.userId.username}</h3>
              {review.userId.isVerified && (
                <motion.div
                  className="flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 
                    dark:text-green-300 px-2 py-1 rounded"
                  whileHover={{ scale: 1.05 }}
                >
                  <Check size={12} />
                  Verified
                </motion.div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-[12px] text-gray-500 dark:text-gray-400">
                {new Date(review.updatedAt).toLocaleDateString("en-US", { 
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <h4 className="relative font-semibold text-gray-900 dark:text-white mb-3 text-[16px] flex items-start gap-[10px]">
        <span className="max-w-[90%]"> {review.title} </span>
        {
          review.userId.username === user.username &&
          <>
            <UserPen 
              className="mt-[4px] w-[15px] h-[15px] text-secondary cursor-pointer" 
              onMouseEnter={()=> setEditTooltip(true)}
              onMouseLeave={()=> setEditTooltip(false)}
              onClick={()=> {
                setEditingReview(true)
                onEdit(review)
              }}
            />
            {
              editTooltip &&
              <motion.span 
                initial={{x: -10, opacity: 0}}
                animate={{x: 0, opacity: 1}}
                transition={{ease: 'easeOut', delay: 0.1, duration:0.3}}
                className='absolute left-[28%] top-0 px-[10px] text-[11px] text-muted font-medium bg-whitesmoke rounded-[3px]'>
                 Edit 
              </motion.span>
            }
          </>
        }
      </h4>

      <p className="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{review.comment}</p>

      <motion.div
        className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.button
          onClick={handleHelpful}
          className={`flex items-center gap-2 text-sm font-medium transition ${
            isHelpful
              ? "text-purple-600 dark:text-purple-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {
            isHelpful   
              ? <FaThumbsUp scale={15}/>
              : <FaRegThumbsUp scale={15}/>
          }
          Helpful ({helpfulCount})
        </motion.button>

        <motion.button
          className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition"
          whileHover={{ scale: 1.05 }}
        >
          Report
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
