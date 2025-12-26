import React, { useRef } from "react"
import { motion, useInView } from "framer-motion"


const TimelineEvent = ({ year, title, description, isActive, delay }) => {

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.6, delay }}
      className="flex items-start gap-4"
    >
      <div className="relative flex flex-col items-center">
        <motion.div
          className={`w-6 h-6 rounded-full border-2 transition-all ${
            isActive ? "bg-orange-500 border-orange-500 scale-125" : "border-gray-300 bg-white"
          }`}
        />
        <div className="h-20 w-1 bg-gradient-to-b from-orange-500 to-transparent mt-2" />
      </div>

      <div className="pb-8">
        <div className="font-bold text-2xl text-orange-500 mb-2">{year}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 max-w-md">{description}</p>
      </div>
    </motion.div>
  )
}

export default function TimelineSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const events = [
  {
    year: "2023",
    title: "FitLab Concept & MVP Launch",
    description:
      "Launched the first version of FitLab as a foundational website, validating the concept and establishing the core fitness-first vision.",
  },
  {
    year: "Oct 2024",
    title: "Full Platform Build",
    description:
      "Developed FitLab into a complete, production-ready platform with advanced ecommerce, AI-powered coaching, fitness tracking, smart payments, and real-time support.",
  },
  {
    year: "Dec 2025",
    title: "First Physical Store Opening",
    description:
      "Expanding FitLab beyond digital by opening our first physical store, creating a seamless online-to-offline fitness experience.",
  },
]


  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-8 bg-orange-500" />
            <span className="text-orange-500 font-semibold tracking-widest">OUR JOURNEY</span>
          </div>
          <h2 className="text-[28px] md:text-[50px] font-bold text-gray-900 max-w-3xl">Building the Future of Fitness, Step by Step</h2>
        </motion.div>

        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[17px] text-gray-600 max-w-3xl mb-16"
        >
          From a simple idea to a full-scale fitness ecosystem, FitLab’s journey reflects continuous innovation—uniting technology, 
          commerce, coaching, and community to help people train smarter and live healthier.
        </motion.p>
        <div className="flex justify-between">
          <div className="relative">
            {events.map((event, idx) => (
              <TimelineEvent
                key={idx}
                year={event.year}
                title={event.title}
                description={event.description}
                isActive={idx === 0}
                delay={idx * 0.1}
              />
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <img className="w-[26rem] object-cover rounded-[9px]" src='/AboutUs/office3.jpg'/>
            <img className="w-[26rem] object-cover rounded-[9px]" src='/AboutUs/office2.jpg'/>
          </div>
        </div>
      </div>
    </section>
  )
}
