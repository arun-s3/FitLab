import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

import {ArrowLeft, ArrowRight} from "lucide-react"
import axios from 'axios'


export default function TestimonialSection(){
  
  const [testimonials, setTestimonials] = useState([])
  const [visibleTestimonials, setVisibleTestimonials] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  const extraTestimonials = [
    {
      _id: 1,
      comment: 'I recently ordered some equipment including a squat rack, barbell, weighted plates and a at bench. Having used them over the last few weeks, I have to say that the quality and finish of all the products is absolutely fantastic.totally satisfied',
      name: "Jacob Vargeese",
      location: "Ernakuiam",
      profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    },
    {
      _id: 2,
      comment: 'The make, the quality & the durability is incredible. I have been using their products for over 18 months & am extremely happy & have no complaints whatsoever.',
      name: "Aman Prakat",
      location: "Pune",
      profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    },
    {
      _id: 3,
      comment: 'Outstanding service and exceptional quality. The attention to detail is remarkable and the customer support team is always ready to help. Highly recommended!',
      name: "Priya Singh",
      location: "Mumbai",
      profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    },
    {
      _id: 4,
      comment: "Best purchase I've made in years. The durability and build quality are unmatched. Worth every penny and I've already recommended to all my friends.",
      name: "Rajesh Kumar",
      location: "Delhi",
      profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    },
  ]

  const getVisibleTestimonials = (requiredTestimonials) => {
    const visible = []
    for (let i = 0; i < 2; i++) {
      visible.push(requiredTestimonials[(currentIndex + i) % requiredTestimonials.length])
    }
    return visible
  }

  useEffect(() => {
    async function loadTestimonials() {
      try {   
        console.log("Inside loadTestimonials()")
        const response = await axios.get(`${baseApiUrl}/testimony/top`, { withCredentials: true })
        console.log("response.data.testimonies---->", response.data.testimonies)

        const fetchedTestimonials = response.data.testimonies.map((testimony) => {
          const { userId, ...rest } = testimony
          const fullName = userId?.firstName && userId?.lastName 
            ? `${userId.firstName} ${userId.lastName}` 
            : userId?.username 

          return {
            name: fullName,
            profilePic: userId?.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
              || '/default-avatar.png',
            rating: testimony.rating,
            title: testimony.title,
            comment: testimony.comment,
            createdAt: testimony.createdAt,
            location: testimony.district || 'Not specified',
          }
        })
        console.log("fetchedTestimonials-------------->", fetchedTestimonials)
        if(fetchedTestimonials.length > 0){
          setTestimonials([...fetchedTestimonials, ...extraTestimonials])
          const visibleTestimonials = getVisibleTestimonials([...fetchedTestimonials, ...extraTestimonials])
          setVisibleTestimonials(visibleTestimonials)
        }else{
          setTestimonials(extraTestimonials)
          const visibleTestimonials = getVisibleTestimonials(extraTestimonials)
          setVisibleTestimonials(visibleTestimonials)
        }
      }
      catch (error) {
        console.log("Error fetching top testimonies:", error)
      }
    }

    loadTestimonials()
  }, [])

  useEffect(()=> {
    console.log("testimonials-------------->", testimonials)
    console.log("visibleTestimonials-------------->", visibleTestimonials)
  }, [testimonials, visibleTestimonials])

  useEffect(()=> {
    if(testimonials && testimonials.length > 0){
      const visibleTestimonials = getVisibleTestimonials(testimonials)
      setVisibleTestimonials(visibleTestimonials)
    }
  }, [currentIndex])


  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }


  return (
    <section className="w-full bg-black py-12 md:py-16 px-4 md:px-8 mb-[10px]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[25px] md:text-[37px] font-bold text-white mb-8 md:mb-0"
          >
            What our customers say about us
          </motion.h2>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <AnimatePresence mode="wait">
            {visibleTestimonials && visibleTestimonials.length > 0 &&
              visibleTestimonials.map((testimonial, index) => (
              <motion.div
                key={`${currentIndex}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white bg-opacity-95 rounded-2xl p-8 md:p-10 relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-muted"></div>

                <div className="absolute bottom-4 right-8 text-muted text-9xl md:text-10xl font-bold opacity-15 
                   leading-none pointer-events-none">
                    "
                </div>

                <div className="h-full flex flex-col justify-between gap-8">
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 relative z-10 pr-8 pl-4 
                      border-l-[3px] border-secondary line-clamp-3 break-words overflow-hidden">
                    {`" ${testimonial.comment} "`}
                  </p>
                
                  <div className="flex items-center gap-4 relative z-10">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      src={testimonial.profilePic}
                      alt={testimonial.name}
                      className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-base md:text-lg">{testimonial.name}</p>
                      <p className="text-gray-500 text-sm md:text-base">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

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

