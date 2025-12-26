import React, { useRef } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"


const StatCard = ({ number, label, delay }) => {

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <div className="text-5xl md:text-6xl font-bold text-orange-500 mb-2">{number}</div>
      <p className="text-gray-600 text-lg">{label}</p>
    </motion.div>
  )
}

export default function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-16 text-gray-900"
        >
          Trusted by Thousands
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard number="5K+" label="Active Members" delay={0} />
          <StatCard number="1200+" label="Premium Products" delay={0.1} />
          <StatCard number="2.5+" label="Years Experience" delay={0.2} />
          <StatCard number="95%" label="Customer Satisfaction" delay={0.3} />
        </div>
      </div>
    </section>
  )
}
