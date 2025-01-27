import React, {useState} from 'react'
import './RatingSlider.css'
import {Star} from "lucide-react"

export default function RatingSlider({rating, setRating}){

  const [isDragging, setIsDragging] = useState(false)

  const handleSliderChange = (e)=> {
    const value = Number.parseFloat(e.target.value)
    setRating(value)
  }

  return (
    <div className="w-full max-w-md" id='ratingSlider'>

      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Star className="w-[15px] h-[15px] text-primaryDark fill-current" />
          <span className="text-lg font-medium text-gray-900"> {rating.toFixed(1)} </span>
          <h3 className="text-[13px] text-secondary font-medium capitaize"> (Average Rating) </h3>
        </div>
      </div>

      <div className="relative w-full">

        <input type="range" min="0" max="5" step="0.1" value={rating} className="w-full h-[4px] appearance-none bg-[#AFD0FF] rounded-[2px] cursor-pointer
             relative z-10  [&::-webkit-slider-thumb]:bg-secondary [&::-webkit-slider-thumb]:transition-transform
                [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:bg-secondary [&::-moz-range-thumb]:border-0
                    [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110" 
                        onChange={handleSliderChange} onMouseDown={() => setIsDragging(true)} onMouseUp={() => setIsDragging(false)} 
                            onTouchStart={() => setIsDragging(true)} onTouchEnd={() => setIsDragging(false)} />
                            
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-all duration-200 
            ${isDragging ? "ring-4 ring-secondary/20" : "" }`} style={{ left: `calc(${(rating / 5) * 100}% - 8px)` }} />
            
      </div>
    </div>
  )
}


