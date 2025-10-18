import React, { useEffect, useState } from "react"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"


export default function StatCounter({ value, label, index }) {

  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.floor(latest))
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplayValue(v))

    const targetNumber = parseInt(value)
    const controls = animate(count, targetNumber, {
      duration: 3.5,
      ease: [0.17, 0.67, 0.83, 0.67],
      delay: index * 0.3,
    })

    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [count, rounded, value, index])
  

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
    >
      <motion.p
        className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2"
        whileInView={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.8, delay: index * 0.2 }}
      >
        {displayValue.toLocaleString()}
        {value.includes("+") && "+"}
      </motion.p>
      <p className="text-xs md:text-sm text-gray-400">{label}</p>
    </motion.div>
  )
}
