import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"


const testimonials = [
  {
    id: 1,
    text: "The adjustable dumbbells I ordered are incredible! Perfect for my home gym setup. Great quality and the delivery was super fast. Highly recommend for anyone serious about strength training.",
    author: "Somnath Tp",
    role: "Fitness Enthusiast",
    image: "https://i.pravatar.cc/300?img=67",
  },
  {
    id: 2,
    text: "Amazing selection of cardio equipment! Got my treadmill at an unbeatable price. The customer service team helped me choose the perfect model for my space and budget.",
    author: "Rohini Varma",
    role: "Home Gym Owner",
    image: "https://i.pravatar.cc/300?img=42",
  },
  {
    id: 3,
    text: "Best supplement store online! Their whey protein is top quality and the pre-workout gives me incredible energy. Fast shipping and authentic products every time.",
    author: "Rahul Kp",
    role: "Personal Trainer",
    image: "https://i.pravatar.cc/300?img=68",
  },
  {
    id: 4,
    text: "Love the yoga mats and resistance bands I purchased. Perfect quality for my studio classes. The accessories section has everything I need at competitive prices.",
    author: "Nikhila K",
    role: "Yoga Instructor",
    image: "https://i.pravatar.cc/300?img=49",
  },
  {
    id: 5,
    text: "Ordered a complete power rack setup and couldn't be happier. Professional grade equipment at home gym prices. This store has transformed my training routine completely.",
    author: "Mohit R",
    role: "Powerlifter",
    image: "https://i.pravatar.cc/300?img=56",
  },
]


export default function TestimonialCarousel() {

  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial()
    }, 5000) 

    return () => clearInterval(interval) 
  }, [currentIndex])

  const currentTestimonial = testimonials[currentIndex]

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="h-[20.5rem] relative bg-white rounded-lg border border-[#f4ebc9] p-6 shadow-sm">
        <button
          onClick={prevTestimonial}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 z-10"
        >
          <ChevronLeft className="w-5 h-5 text-primaryDark" />
        </button>

        <button
          onClick={nextTestimonial}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 z-10"
        >
          <ChevronRight className="w-5 h-5 text-primaryDark" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`image-${currentTestimonial.id}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <img
                src={currentTestimonial.image || "/placeholder.svg"}
                alt={currentTestimonial.author}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${currentTestimonial.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-4"
            >
              <p className="text-gray-700 text-sm leading-relaxed px-4">{currentTestimonial.text}</p>

              <div className="space-y-1">
                <h4 className="font-semibold text-gray-900 text-sm">{currentTestimonial.author}</h4>
                <p className="text-gray-500 text-xs">{currentTestimonial.role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center space-x-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex ? "bg-gray-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
