import React, { useRef } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"

import BrandMarquee from "./BrandMarquee"

const VisionCard = ({ image, number, title, description, delay }) => {

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
      className="relative bg-white rounded-2xl overflow-hidden group cursor-pointer"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
      </div>

      <div className="p-6">
        <div className="text-4xl font-bold text-orange-500 mb-2">{number}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  )
}

export default function VisionSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="">
        <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-8 bg-orange-500" />
            <span className="text-orange-500 font-semibold tracking-widest">OUR VISION</span>
          </div>
          <h2 className="text-[28px] md:text-[50px] font-bold text-gray-900 max-w-3xl">Transform Your Fitness Journey</h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[17px] text-gray-600 max-w-3xl mb-16"
        >
          We believe fitness is not just about buying equipment — it’s about building sustainable habits, informed training, and 
          measurable progress. FitLab brings together intelligent shopping, personalized coaching, real-time insights, and a connected 
          fitness community to help every individual train smarter, grow stronger, and stay committed for life.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <VisionCard
            image="/AboutUs/fitnessProducts.jpg"
            number="2000+"
            title="Fitness Products"
            description="Strength, cardio, accessories, and supplements across deeply nested categories for every training need."
            delay={0}
          />
          <VisionCard 
            image="/AboutUs/personalizedCoach.jpg"
            number="1 AI"
            title="Personalized Coach+"
            description="An intelligent fitness coach delivering goal-based workouts, insights, and real-time guidance."
            delay={0.1}
          />
          <VisionCard
            image="/AboutUs/smartFitnessModules.png"
            number="10+"
            title="Smart Fitness Modules"
            description="Wishlists, wallets, lending, tracking, dashboards, chat, video support, and social fitness tools."
            delay={0.2}
          />
          <VisionCard 
            image="/AboutUs/fitnessEcosystem.png"
            number="100%"
            title="Fitness Ecosystem"
            description="Shopping, training, health tracking, AI insights, and payments—unified in one seamless platform."
            delay={0.3}
          />
        </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="ml-8 text-[15px] font-[700] text-gray-500 mb-6">TRUSTED BRANDS AND PARTNERS</p>
          <BrandMarquee />
        </motion.div>
      </div>
    </section>
  )
}
