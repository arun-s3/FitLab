import React, {useState, useEffect} from 'react'
import './RatingSlider.css'
import {motion, AnimatePresence} from "framer-motion"

import {Star} from "lucide-react"
import {MdToggleOff, MdToggleOn} from "react-icons/md"


export default function RatingSlider({rating, setRating, indentSlider = null}){

  const [isDragging, setIsDragging] = useState(false)

  const [enableSliderRate, setEnableSliderRate] = useState(false)
  const [enableRadioRate, setEnableRadioRate] = useState(false)

  const [sliderRate, setSliderRate] = useState(0)
  const [radioRate, setRadioRate] = useState(0)

  const handleSliderToggle = (e)=> {
    if(enableSliderRate){
      const rating = Number.parseFloat(e.target.value)
      setSliderRate(rating)
      setRating(rating)
    }
  }

  const handleRadioToggle = (rating) => {
    if(enableRadioRate){
      setRadioRate(rating)
      setRating(rating)
    }
  }

  const toggleRadioRate = (status)=> {
    setEnableRadioRate(status)
    setEnableSliderRate(!status)
    setIsDragging(!status)
  }

  const toggleSlideRate = (status)=> {
    setEnableSliderRate(status)
    setEnableRadioRate(!status)
    setIsDragging(status)
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

        <div className='mt-[10px] w-full flex items-center justify-between'>
          <div className="flex items-center gap-2">
            <Star className="w-[15px] h-[15px] text-primaryDark fill-current" />
            <span className="text-lg font-medium text-gray-900"> {rating.toFixed(1)} </span>
            <h3 className="text-[13px] text-secondary font-medium capitaize"> (Average Rating) </h3>
          </div>
        </div>
        <div className="mt-[10px] overflow-visible ml-[10px] flex items-start justify-between gap-4" >
          <div className='flex flex-col gap-2'>
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={radioRate === rating}
                  onChange={()=> handleRadioToggle(rating)}
                  className={`w-4 h-4 ${!enableRadioRate ? 'text-muted' : 'text-purple-600'} border-gray-300 focus:ring-0
                   ${!enableRadioRate && 'cursor-not-allowed'}`}
                  disabled={!enableRadioRate}
                />
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-sm ${!enableRadioRate ? 'text-muted' : i < rating ? "text-yellow-400" : "text-gray-300"} `}>
                      ★
                    </span>
                  ))}
                </div>
              </label>
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
              {enableRadioRate ? (
                <motion.div
                  key="on"
                  initial={{ opacity: 0, x: -3 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 3 }}
                  transition={{ duration: 0.1 }}
                  onClick={()=> toggleRadioRate(false)}
                  className="mt-[-5px] inline-block cursor-pointer"
                >
                  <MdToggleOn className="w-[28px] h-[28px] text-red-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="off"
                  initial={{ opacity: 0, x: 3 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -3 }}
                  transition={{ duration: 0.1 }}
                  onClick={()=> toggleRadioRate(true)}
                  className="inline-block cursor-pointer"
                >
                  <MdToggleOff className="w-[28px] h-[28px] text-green-500" />
                </motion.div>
              )}
          </AnimatePresence>
        </div>

      </div>

      <div className={`mb-8 relative w-full ${indentSlider ? `ml-[${indentSlider}]` : null}`}>

        <input type="range" 
          min="0"
          max="5" 
          step="0.1" 
          value={sliderRate}
          disabled={!enableSliderRate}
          className={`w-full h-[4px] appearance-none ${!enableSliderRate ? 'bg-muted' : ' bg-[#AFD0FF]'} rounded-[2px] cursor-pointer
            relative z-10  ${!enableSliderRate ? '[&::-webkit-slider-thumb]:bg-muted' : '[&::-webkit-slider-thumb]:bg-secondary'} 
            [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 
            ${!enableSliderRate ? '[&::-moz-range-thumb]:bg-muted' : '[&::-moz-range-thumb]:bg-secondary'} [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110
            ${!enableSliderRate ? 'cursor-not-allowed' : 'cursor-grabbing'}`} 
          onChange={handleSliderToggle} 
          onMouseDown={()=> setIsDragging(true)} 
          onMouseUp={()=> setIsDragging(false)} 
          onTouchStart={()=> setIsDragging(true)} 
          onTouchEnd={()=> setIsDragging(false)} 
        />
                            
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-all duration-200 
            ${isDragging ? "ring-4 ring-secondary/20" : "" }`} style={{ left: `calc(${(sliderRate / 5) * 100}% - 8px)` }} />
        <div className='mt-[10px] absolute top-[12px] w-full flex items-center justify-between'>
          <span className="text-[12px] font-medium text-muted"> {`(${sliderRate})`} </span>
          <AnimatePresence mode="wait" initial={false}>
            {enableSliderRate ? (
              <motion.div
                key="on"
                initial={{ opacity: 0, x: -3 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 3 }}
                transition={{ duration: 0.1 }}
                onClick={()=> toggleSlideRate(false)}
                className="inline-block cursor-pointer"
              >
                <MdToggleOn className="w-[28px] h-[28px] text-red-500" />
              </motion.div>
            ) : (
              <motion.div
                key="off"
                initial={{ opacity: 0, x: 3 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -3 }}
                transition={{ duration: 0.1 }}
                onClick={()=> toggleSlideRate(true)}
                className="inline-block cursor-pointer"
              >
                <MdToggleOff className="w-[28px] h-[28px] text-green-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
            
      </div>
    </motion.div>
  )
}


