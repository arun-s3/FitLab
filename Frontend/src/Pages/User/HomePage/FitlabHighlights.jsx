import React from 'react'
import { motion } from "framer-motion"

import { CheckCircle2 } from "lucide-react"

import StatCounter from './StatCounter'


export default function FitlabHighlights() {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
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
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  }

  const bulletPoints = [
    `We constantly embrace innovation in our products each time we bring you something new, or in upgrades, to our existing product line`,
    `Access professional-grade training videos covering every muscle group, cardio routines, and weight loss programs — all 
        designed to help you achieve results efficiently and safely at your own pace`,
    `Get expert help anytime, anywhere. Our dedicated support team is available round the clock through chat or video to guide you`,
    `Stay on top of your progress with our intelligent AI tracker that monitors your workouts, adapts to your performance, 
        and offers personalized insights to help you train smarter and reach your goals faster.`
  ]

  const bulletPointsRight = [
    "Our team is always on standby to help you find the right gym equipment that best fits your specific requirements.",
    "Our advanced logistics process ensures on-time delivery of all fitness products in their prime condition pan India",
  ]

  const stats = [
    { number: "12+", label: "Years of Experience" },
    { number: "1200+", label: "Gym Equipments" },
    { number: "7000+", label: "Satisfied Customers" },
  ]

  return (
    <motion.section
      className="w-full mb-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 md:py-16 px-6 lg:px-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto 
        bg-[radial-gradient(circle_at_center,_rgba(50,17,70,0.9)_0%,_rgba(30,15,60,0.7)_15%,_rgba(10,5,20,0.5)_30%,_rgba(0,0,0,0)_55%)]">
        <motion.div className="mb-12" variants={containerVariants}>
          <motion.p
            className="text-xs md:text-sm font-semibold text-primary tracking-widest uppercase mb-2"
            variants={itemVariants}
          >
            Hit Your Fitness Goals @FitLab
          </motion.p>
          <motion.h2 className="text-3xl md:text-[40px] font-bold text-white" variants={itemVariants}>
            Why choose us?
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16"
          variants={containerVariants}
        >
          <motion.div className="flex flex-col gap-6" variants={containerVariants}>
            <div className="space-y-4">
              {bulletPoints.map((point, index) => (
                <motion.div key={index} className="flex gap-3 items-start" variants={itemVariants}>
                  <span className='mt-[9px] w-[10px] h-[6px] bg-primary rounded-[20px] shadow-[0_0_8px_3px_var(--PRIMARY)]'> </span>
                  <p className="text-sm md:text-base text-gray-300 leading-relaxed">{point}</p>
                </motion.div>
              ))}
            </div>

            <motion.div className="rounded-2xl overflow-hidden shadow-2xl" variants={imageVariants}>
              <img
                src="./FitLabHighlightSectionImg2.png"
                alt="Gym Equipment"
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </motion.div>

          <motion.div className="flex flex-col gap-6" variants={containerVariants}>
            <motion.div className="rounded-2xl overflow-hidden shadow-2xl" variants={imageVariants}>
              <img
                src="./FitLabHighlightSectionImg1.png"
                alt="Fitness Person"
                className="w-full h-auto object-cover"
              />
            </motion.div>

            <div className="space-y-4">
              {bulletPointsRight.map((point, index) => (
                <motion.div key={index} className="flex gap-3 items-start" variants={itemVariants}>
                  <span className='mt-[9px] w-[10px] h-[6px] bg-primary rounded-[20px] shadow-[0_0_8px_3px_var(--PRIMARY)]'> </span>
                  <p className="text-sm md:text-base text-gray-300 leading-relaxed">{point}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 gap-4 md:gap-8 pt-8 md:pt-12 border-t border-gray-700"
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
              <StatCounter
                key={index}
                value={stat.number}
                label={stat.label}
                index={index}
              />
            ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
