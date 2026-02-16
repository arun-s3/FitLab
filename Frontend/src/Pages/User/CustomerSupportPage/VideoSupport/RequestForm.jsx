import React from 'react'
import { motion } from "framer-motion"

import { Calendar, Video, Clock, Star } from "lucide-react"


export default function RequestForm({ onImmediateRequest, onScheduleRequest }) {

  const bgImg = {
    backgroundImage:"url('/Images/videoSupport-bg.jpg')",
    backgroundSize:"cover", 
  }
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  }


  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-8" id='RequestForm-videochat'>
      <motion.div variants={item} id='videoChat'>
        <div className="group relative overflow-hidden">
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 rounded-2xl"></div>
          <button onClick={onImmediateRequest} className="relative w-full rounded-2xl border border-t-[10px] border-primary
              before:content-[''] before:absolute before:top-0 before:left-0 before:h-full before:w-full before:rounded-2xl 
                before:[background-image:linear-gradient(rgba(255,255,255,0.8),rgba(75,61,86,0.8))] before:backdrop-blur-[2px]" 
                  style={bgImg}>
            <div className='transition-all duration-500 p-8 flex flex-col items-center justify-center rounded-2xl 
             z-20 group-hover:border-transparent group-hover:text-secondary transform group-hover:scale-[1.02]'>
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-full transition-all duration-500">
                <Video className="h-10 w-10 text-blue-600 transition-colors duration-500" />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-3 transition-colors duration-500">
              Talk to an Expert Now
            </h2>

            <p className="text-white text-center mb-6 leading-relaxed transition-colors duration-500">
              Connect instantly with our fitness professionals for immediate support and guidance
            </p>

            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6 transition-colors duration-500">
              <Clock className="h-4 w-4 text-primaryDark" />
              <span className='text-[#e7e3e3]'> Usually available within 2-5 minutes </span>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-full font-semibold shadow-lg transition-all duration-500 transform">
              Join Waiting Room
            </div>

            <div className="flex items-center mt-4 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-primaryDark fill-current" />
              ))}
              <span className="text-sm text-white ml-2 transition-colors duration-500">
                4.1/5 rating
              </span>
            </div>
            </div>
          </button>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div className="group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 opacity-0 transition-opacity duration-500 rounded-2xl"></div>
          <button
            onClick={onScheduleRequest}
            className="relative w-full bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500
             p-8 flex flex-col items-center justify-center border border-t-green-600 border-t-[10px] border-gray-100 
             group-hover:border-transparent group-hover:border-t-green-600 group-hover:rounded-t-none
              group-hover:text-primaryDark transform group-hover:scale-[1.02] ">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-green-100 to-emerald-200 p-6 rounded-full transition-all duration-500">
                <Calendar className="h-10 w-10 text-green-600 transition-colors duration-500" />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-3 transition-colors duration-500">
              Schedule a Session
            </h2>

            <p className="text-gray-600 text-center mb-6 leading-relaxed transition-colors duration-500">
              Book a personalized consultation at your preferred time with our expert trainers
            </p>

            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6 transition-colors duration-500">
              <Calendar className="h-4 w-4" />
              <span>Available 7 days a week, 9 AM - 6 PM</span>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-8 rounded-full font-semibold shadow-lg transition-all duration-500 transform">
              View Available Slots
            </div>

            <div className="flex items-center mt-4 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
              <span className="text-sm text-gray-500 ml-2 transition-colors duration-500">
                4.8/5 rating
              </span>
            </div>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
