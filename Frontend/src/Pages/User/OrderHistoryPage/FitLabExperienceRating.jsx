import React, {useState } from "react"
import {motion} from "framer-motion"

import {Star, X, Heart, Truck, ShoppingBag, Sparkles} from "lucide-react"


export default function FitLabExperienceRating({ onClose, onSubmit }) {
    
  const [rating, setRating] = useState({service: 0, shopping: 0, delivery: 0, overall: 0})
  const [hoveredRating, setHoveredRating] = useState(0)
  const [category, setCategory] = useState(null)

  const handleSubmit = () => {
    if ( Object.values(rating).some(value=> value > 0) ){
      const avgRating = Object.values(rating).reduce((values, sum)=> sum += values, 0) / 4
      onSubmit(Math.ceil(avgRating))
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  }

  const starVariants = {
    hover: { scale: 1.2, rotate: 15 },
    tap: { scale: 0.95 },
  }

  const categoryVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (custom) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, delay: custom * 0.1 },
    }),
  }

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  const categories = [
    { id: "service", label: "Service", icon: Sparkles },
    { id: "shopping", label: "Shopping", icon: ShoppingBag },
    { id: "delivery", label: "Delivery", icon: Truck },
    { id: "overall", label: "Overall", icon: Heart },
  ]


  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mt-6 ml-6 max-w-[35%] bg-gradient-to-r from-purple-50 to-purple-50 border-l-4 border-purple-400 r
        ounded-lg rounded-tl-[8px] rounded-bl-[8px] p-5 md:p-7 shadow-lg"
    >
      <div className="flex items-start justify-between gap-3 md:gap-4 mb-4">
        <div className="flex items-start gap-3 md:gap-4 flex-1">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
          >
            <Star className="w-6 h-6 text-primaryDark flex-shrink-0 mt-0.5 fill-primaryDark" />
          </motion.div>
          <div>
            <p className="text-base md:text-[16px] font-bold text-gray-900 text-secondary">How was your FitLab experience?</p>
            <p className="text-xs md:text-[13px] text-gray-600 ">Help us improve your shopping journey. Rate each aspect:</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-full p-1"
          aria-label="Close rating"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      <div className="">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon
            return (
              <motion.button
                key={cat.id}
                custom={idx}
                variants={categoryVariants}
                initial="hidden"
                animate="visible"
                onClick={() => setCategory(cat.id)}
                className={`relative py-[10px] px-[5px] rounded-lg transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-purple-400 ${
                  category === cat.id
                    ? "bg-purple-100 border-2 border-purple-500 text-purple-700"
                    : rating[cat.id]
                    ? "bg-purple-100 border-2 border-inputBgSecondary"
                    : "bg-white border-2 border-inputBgSecondary text-gray-700 hover:border-purple-300"
                }`}
              >
                <motion.div
                  animate={{ scale: category === cat.id ? 1.1 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <IconComponent className="w-4 h-4 text-primaryDark" />
                  <span className="text-xs font-medium">{cat.label}</span>
                  {
                    rating[cat.id] > 0 &&
                      <span className="text-[10px] font-medium text-purple-600">{rating[cat.id]} / 5</span>
                  }
                </motion.div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {category && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-[10px]">
          <p className="mt-[10px] text-[13px] font-semibold text-gray-800">
            Rate {categories.find((c) => c.id === category)?.label}:
          </p>
          <div className="flex gap-2 md:gap-3 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                variants={starVariants}
                whileHover="hover"
                whileTap="tap"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={()=> setRating(ratings=> ({...ratings, [category]: star}))}
                className="relative focus:outline-none rounded-full transition-all"
                aria-label={`Rate ${star} stars`}
              >
                <motion.div
                  animate={{
                    scale: hoveredRating >= star ? 1.15 : 1,
                    opacity: rating[category] >= star || hoveredRating >= star ? 1 : 0.3,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Star
                    className={`w-8 h-8 md:w-10 md:h-10 transition-colors ${
                      rating[category] >= star
                      || hoveredRating >= star ? "text-primaryDark fill-primaryDark" : "text-gray-300"
                    }`}
                  />
                </motion.div>
              </motion.button>
            ))}
          </div>
          {rating[category] > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-[5px] md:mt-4 text-center text-xs md:text-sm text-gray-600"
            >
              Rated: <span className="font-bold text-purple-600">{rating[category]} / 5</span>
            </motion.div>
          )}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 justify-between md:gap-3">
        {
           Object.values(rating).every(value=> value) &&
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700
                 text-white text-[15px] font-semibold py-[8px] px-[10px] max-w-[45%] rounded-[7px] transition-all duration-200 focus:outline-none focus:ring-2 
                 focus:ring-purple-400 focus:ring-offset-2 shadow-md hover:shadow-lg"
            >
              Submit
            </button>
        }
        {
          Object.values(rating).some(value=> value) &&
            <button
              onClick={()=> setRating(ratings=> ({...ratings, [category]: 0}))}
              className={`flex-1 bg-gray-200 ${rating[category] && 'hover:bg-gray-300'} text-gray-800 font-semibold py-[8px] px-[10px] 
                rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 disabled:cursor-not-allowed
                focus:ring-gray-400 focus:ring-offset-2 ${!Object.values(rating).every(value=> value) ? 'w-full' : 'max-w-[45%] '}`}
              disabled={!rating[category]}
            >
              Clear
            </button>
        }
        </motion.div>

    </motion.div>
  )
}
