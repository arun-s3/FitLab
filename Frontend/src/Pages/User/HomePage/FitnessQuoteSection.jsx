import React from 'react'
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"


export default function FitnessQuoteSection() {

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
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <section className="w-full bg-black py-4 px-4 md:px-8">
      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div 
            variants={imageVariants} 
            className="relative h-64 md:h-96 rounded-lg overflow-hidden"
        >
          <img src="./Quote-section-pic.png" alt="Fitness workout" className="w-full h-full object-cover" />
        </motion.div>

        <motion.div 
            variants={containerVariants} 
            className="space-y-6"
        >
          <motion.div 
            variants={itemVariants} 
            className="border-l-4 border-purple-500 pl-6"
          >
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold tracking-[0.5px] text-white leading-tight">
              "Take care of your body. It's the only place you have to live." — Jim Rohn
            </h2>
          </motion.div>

          <motion.p 
            variants={itemVariants} 
            className="text-gray-300 text-sm leading-relaxed"
          >
            Working Out Sharpens Your Memory, By Increasing The Production Of Brain Cells. Do You Know That A Pound Of
            Muscle Burns 3 Times More Calories Than A Pound Of Fat? Which Means You Burn Fat While Just Resting. It
            Prevents Signs Of Aging, Boosts Productivity And Self-Confidence., Reduce The Risk Of Disease, Strengthen
            Bones And Muscles, And Improve Your Sleep Cycle.
          </motion.p>

          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary hover:bg-lime-400 text-black font-semibold px-8 py-3 rounded-[8px] transition-colors duration-300 flex items-center gap-2"
            >
              Register Now!
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
