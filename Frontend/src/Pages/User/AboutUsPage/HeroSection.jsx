import React from "react"
import './Herosection.css'
import { motion } from "framer-motion"


export default function HeroSection() {

  return (
    <section id='HeroSection' className="relative h-[23rem] flex items-center justify-center pt-20 overflow-hidden bg-white">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bgImage"
          style={{
            backgroundImage:
              "url(/about1.jpg)",
          }}
        />
        <div className="absolute inset-0" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-[25px] md:text-[54px] font-bold text-white mb-6 leading-tight">
            More Than an Ecommerce Store
            <br />
            <span className="text-orange-500">A Unified Fitness Platform</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-[17px] text-gray-300 max-w-2xl mx-auto mb-8"
        >
          “An all-in-one fitness ecosystem combining smart shopping, intelligent training, real-time insights, 
          personalized coaching, and live text and video support.”
        </motion.p>

      </div>


      <motion.h1
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        className="absolute -bottom-[2.9rem] right-0 px-8 py-6 text-[55px] bg-white text-black font-bold first-letter:text-orange-500  
            overline decoration-[3px] decoration-orange-500 rounded-tl-[23px]"
      >
            About Us
      </motion.h1>

    </section>
  )
}
