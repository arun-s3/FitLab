import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import {ArrowLeft, ArrowRight} from "lucide-react"


export default function TestimonialSection(){
    
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      id: 1,
      text: '"I recently ordered some equipment including a squat rack, barbell, weighted plates and a at bench. Having used them over the last few weeks, I have to say that the quality and finish of all the products is absolutely fantastic.totally satisfied "',
      author: "Jacob Vargeese",
      location: "Ernakuiam",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    },
    {
      id: 2,
      text: '"The make, the quality & the durability is incredible. I have been using their products for over 18 months & am extremely happy & have no complaints whatsoever."',
      author: "Aman Prakat",
      location: "Pune",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    },
    {
      id: 3,
      text: '"Outstanding service and exceptional quality. The attention to detail is remarkable and the customer support team is always ready to help. Highly recommended!"',
      author: "Priya Singh",
      location: "Mumbai",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    },
    {
      id: 4,
      text: "\"Best purchase I've made in years. The durability and build quality are unmatched. Worth every penny and I've already recommended to all my friends.\"",
      author: "Rajesh Kumar",
      location: "Delhi",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    },
  ]

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const getVisibleTestimonials = () => {
    const visible = []
    for (let i = 0; i < 2; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length])
    }
    return visible
  }

  const visibleTestimonials = getVisibleTestimonials()

  return (
    <section className="w-full bg-black py-12 md:py-16 px-4 md:px-8 mb-[10px]">
      <div className="max-w-7xl mx-auto">
        {/* Header with Navigation */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[25px] md:text-[37px] font-bold text-white mb-8 md:mb-0"
          >
            What our customers say about us
          </motion.h2>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevSlide}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white hover:bg-primary text-black 
                flex items-center justify-center transition-colors duration-300 flex-shrink-0 shadow-[0_0_8px_2px_var(--PRIMARY)]"
            >
              <ArrowLeft size={24} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextSlide}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white hover:bg-primary text-black 
                flex items-center justify-center transition-colors duration-300 flex-shrink-0 shadow-[0_0_8px_2px_var(--PRIMARY)]"
            >
              <ArrowRight size={24} />
            </motion.button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <AnimatePresence mode="wait">
            {visibleTestimonials.map((testimonial, index) => (
              <motion.div
                key={`${currentIndex}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white bg-opacity-95 rounded-2xl p-8 md:p-10 relative overflow-hidden"
              >
                {/* Left Border Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-muted"></div>

                {/* Quotation Mark Watermark */}
                <div className="absolute bottom-4 right-8 text-muted text-9xl md:text-10xl font-bold opacity-15 
                   leading-none pointer-events-none">
                    "
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 relative z-10 pr-8 pl-4 
                    border-l-[3px] border-secondary">
                  {testimonial.text}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4 relative z-10">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-base md:text-lg">{testimonial.author}</p>
                    <p className="text-gray-500 text-sm md:text-base">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center gap-2 mt-12 md:mt-16"
        >
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-primary w-8" : "bg-gray-600 w-2 hover:bg-gray-500"
              }`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

