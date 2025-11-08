import React, {useState, useEffect} from "react"
import { motion } from "framer-motion"

import {toast as sonnerToast} from 'sonner'


export default function ReviewForm({onSubmit, editReview = null, onEditSubmission,  containerStyle = null}) {    

  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")

  const [error, setError] = useState(false)

  const [selectInput, setSelectInput] = useState({title: false, comment: false})

  const [hoveredRating, setHoveredRating] = useState(0)

  useEffect(()=> {
    console.log("ReviewForm Mounted....")
  }, [])

  useEffect(()=> {
    if(editReview){
      setRating(editReview.rating)
      setTitle(editReview.title)
      setComment(editReview.comment)
    }
  }, [editReview])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Inside handleSubmit()...")

    if (!title.trim() || !comment.trim()) {
      !title.trim() ? setSelectInput({title: true, comment: false}) : setSelectInput({title: false, comment: true})
      sonnerToast.warning("Please fill in all fields")
      return
    }

    editReview ? onEditSubmission({...editReview, rating, title, comment}) : onSubmit({rating, title, comment})

    setRating(5)
    setTitle("")
    setComment("")
    setSelectInput({title: false, comment: false})
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`bg-gray-50 dark:bg-zinc-900 p-8 rounded-lg border 
        border-gray-200 dark:border-gray-800 ${containerStyle ? containerStyle : ''}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="mb-6" variants={itemVariants}>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className={`w-8 h-8 transition-all ${
                  star <= (hoveredRating || rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div className="mb-6" variants={itemVariants}>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Review Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief title for your review"
          className={`w-full px-4 py-[7px] text-[14px] bg-white dark:bg-zinc-800 border 
            ${selectInput.title ? 'border-red-500' : 'border-gray-300'} 
           dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 
           dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition`}
        />
      </motion.div>

      <motion.div className="mb-6" variants={itemVariants}>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Your Review</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          rows="5"
          className={`w-full px-4 py-[7px] text-[14px] bg-white dark:bg-zinc-800 border dark:border-gray-700 
            ${selectInput.comment ? 'border-red-500' : 'border-gray-300'} 
            rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 
            focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none`}
        />
      </motion.div>

      <motion.button
        type="submit"
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800
         text-white font-semibold rounded-lg transition transform"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        variants={itemVariants}
      >
        Submit Review
      </motion.button>
          
      <motion.p 
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        exit={{opacity: 0, y: 10}}
        transition={{duration: 0.25, ease: 'easeOut'}}
        className="h-[7px] text-[12px] text-red-500 tracking-[0.3px]"
    >
            {error && error} 
        </motion.p>

    </motion.form>
  )
}
