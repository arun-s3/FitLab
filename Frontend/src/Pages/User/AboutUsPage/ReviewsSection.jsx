import React, { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"

import axios from 'axios'


const ReviewCard = ({ avatar, name, title, review, rating, delay }) => {

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })


  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white p-8 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <img 
            className="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full"
            src={avatar}
            alt={name}
            />
          <div>
            <h3 className="font-bold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">{title}</p>
          </div>
        </div>
        <div className="flex gap-2">
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
      </div>

      <p className="text-gray-700 mb-6 leading-relaxed">{review}</p>
      
    </motion.div>
  )
}

export default function ReviewsSection() {

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const [testimonials, setTestimonials] = useState([])

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL
    
  useEffect(() => {
    async function loadTestimonials() {
      try {   
        console.log("Inside loadTestimonials()")
        const response = await axios.get(`${baseApiUrl}/testimony/top`, { withCredentials: true })
        console.log("response.data.testimonies---->", response.data.testimonies)

        if(response.status === 200){
          const fetchedTestimonials = response.data.testimonies.slice(0,4).map((testimony) => {
            const { userId, ...rest } = testimony
            const fullName = userId?.firstName && userId?.lastName 
              ? `${userId.firstName} ${userId.lastName}` 
              : userId?.username 

            return {
              name: fullName,
              avatar: userId?.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                || '/default-avatar.png',
              rating: testimony.rating,
              title: testimony.title,
              review: testimony.comment,
            }
          })
          console.log("fetchedTestimonials-------------->", fetchedTestimonials)
          setTestimonials(fetchedTestimonials)
        }
      }
      catch (error) {
        console.log("Error fetching top testimonies:", error)
      }
    }
    
      loadTestimonials()
  }, [])


  return (
    <section ref={ref} className="py-10 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-[28px] md:text-[50px] font-bold text-gray-900"
        >
          What Our Customers Say
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[18px] text-gray-600 mb-12"
        >
          Real stories from real fitness enthusiasts
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {
            testimonials && testimonials.map((testimony, index)=> (
              <ReviewCard
                avatar={testimony.avatar}
                name={testimony.name}
                title={testimony.title}
                review={testimony.review}
                rating={testimony.rating}
                delay={index/10}
              />
            ))
          }
        </div>
      </div>
    </section>
  )
}
