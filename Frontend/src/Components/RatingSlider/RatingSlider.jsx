import React, {useState} from 'react'
import './RatingSlider.css'
import {motion, AnimatePresence} from "framer-motion"

import {Star} from "lucide-react"


export default function RatingSlider({rating, setRating, highestRating, setHighestRating, indentSlider = null}){

  const [isDragging, setIsDragging] = useState(false)

  const handleSliderChange = (e)=> {
    const value = Number.parseFloat(e.target.value)
    setRating(value)
  }

  return (
    <motion.div className="w-full max-w-md" 
      id='ratingSlider'
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >

      <div className="mb-4">

        <div className="flex items-center gap-2 mb-[5px]">
            <Star className="w-[15px] h-[15px] text-primaryDark fill-current" />
            <span className="text-lg font-medium text-gray-900"> {highestRating} </span>
            <h3 className="text-[13px] text-secondary font-medium capitaize"> (Highest Rating) </h3>
        </div>
        <div className="space-y-2 overflow-visible ml-[10px]" >
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={highestRating === rating}
                onChange={()=> setHighestRating(rating)}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-0"
              />
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-sm ${i < rating ? "text-yellow-400" : "text-gray-300"}`}>
                    ★
                  </span>
                ))}
              </div>
            </label>
          ))}
        </div>

        <div className="mt-[10px] flex items-center gap-2">
          <Star className="w-[15px] h-[15px] text-primaryDark fill-current" />
          <span className="text-lg font-medium text-gray-900"> {rating.toFixed(1)} </span>
          <h3 className="text-[13px] text-secondary font-medium capitaize"> (Average Rating) </h3>
        </div>
      </div>

      <div className={`relative w-full ${indentSlider ? `ml-[${indentSlider}]` : null}`}>

        <input type="range" min="0" max="5" step="0.1" value={rating} className="w-full h-[4px] appearance-none bg-[#AFD0FF] rounded-[2px] cursor-pointer
             relative z-10  [&::-webkit-slider-thumb]:bg-secondary [&::-webkit-slider-thumb]:transition-transform
                [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:bg-secondary [&::-moz-range-thumb]:border-0
                    [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110" 
                        onChange={handleSliderChange} onMouseDown={() => setIsDragging(true)} onMouseUp={() => setIsDragging(false)} 
                            onTouchStart={() => setIsDragging(true)} onTouchEnd={() => setIsDragging(false)} />
                            
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-all duration-200 
            ${isDragging ? "ring-4 ring-secondary/20" : "" }`} style={{ left: `calc(${(rating / 5) * 100}% - 8px)` }} />
            
      </div>
    </motion.div>
  )
}


