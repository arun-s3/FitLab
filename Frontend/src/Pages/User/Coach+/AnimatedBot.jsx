import React from "react"
import { motion } from "framer-motion"
import { Bot } from "lucide-react"

export default function AnimatedBotIcon() {
  return (
    <motion.div
      className="relative w-8 h-12 flex items-center justify-center rounded-xl backdrop-blur-sm"
      animate={{
        scale: [1, 1.02, 1],
      }}
      transition={{
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      {/* Bot Icon */}
      <motion.div
        className="flex items-center gap-4"
        animate={{
          y: [0, -2, 0],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <Bot className="text-white" size={28} />
        {/* <h2 className="text-white font-semibold text-lg"> Coach+ </h2> */}
      </motion.div>

      {/* Pulse Effect */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-white/10"
        animate={{
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}
