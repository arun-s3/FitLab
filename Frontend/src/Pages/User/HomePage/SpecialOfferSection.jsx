import React from 'react'
import { motion } from "framer-motion"

import { ArrowRight } from "lucide-react"

export default function SpecialOfferSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  }

  const buttonHoverVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    },
  }

  return (
    <motion.section
      className="w-full mb-8  bg-inputBorderLow px-6 py-12 md:py-16 lg:px-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div className="flex justify-center md:justify-start" variants={imageVariants}>
            <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="./TopOfferSection.png"
                alt="Dumbbells"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>

          <motion.div className="flex flex-col justify-center space-y-6" variants={containerVariants}>
            <motion.p className="text-sm md:text-base text-secondary font-medium tracking-wide" variants={itemVariants}>
              Special Offer
            </motion.p>

            <motion.h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary" variants={itemVariants}>
              20% OFF ON DUMBBELLS
            </motion.h2>

            <motion.p className="text-sm md:text-base leading-relaxed" variants={itemVariants}>
              With the industrial experience of more than 15 years, we are able to maintain top position in the field of
              manufacturing, supplying and exporting a comprehensive range of Fitness, Gym Equipment, Cardio Equipment
              and Sports Goods. We have state-of-the-art infrastructure where all the manufacturing processes are
              carried out in a systematic manner.
            </motion.p>

            <motion.button
              className="w-fit px-8 py-3 md:px-10 md:py-4 bg-primary text-black font-semibold rounded-full
                hover:bg-yellow-300 transition-colors duration-300 flex items-center gap-2 group"
              whileHover="hover"
              variants={buttonHoverVariants}
            >
              Register Now!
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
