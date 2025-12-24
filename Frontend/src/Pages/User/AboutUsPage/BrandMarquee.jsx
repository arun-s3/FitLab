import React from "react"
import { motion } from "framer-motion"


export default function BrandMarquee() {
    
  const brands = [
    "Fitbit",
    "Whey Gold",
    "ProLift",
    "TechFit",
    "PowerZone",
    "FitTrack",
    "Fitbit",
    "Whey Gold",
    "ProLift",
    "TechFit",
  ]

  return (
    <div className="relative overflow-hidden bg-white py-8 border-y border-gray-200">
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="flex gap-16"
        >
          {brands.map((brand, idx) => (
            <div key={idx} className="flex-shrink-0 text-lg font-semibold text-gray-700">
              {brand}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
