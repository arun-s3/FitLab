import React from "react"
import { motion } from "framer-motion"


export default function FitnessLayout({children}) {

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-15"
          animate={{ y: [0, -50, 0], x: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-15"
          animate={{ y: [0, 50, 0], x: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-8 pt-4">

          <div className="pb-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
