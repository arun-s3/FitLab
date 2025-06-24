import React from 'react'
import { motion, AnimatePresence } from "framer-motion"

import { MessageCircle, ArrowDown } from "lucide-react"



export default function ChatTooltip({ isVisible, onHide }) {


  return (

    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.8 }}
          transition={{
            duration: 0.4,
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
          className="absolute z-50 pointer-events-none"
          style={{
            top: "calc(100% + 2rem)",
            right: "15%",
            transform: "translateX(-50%)",
          }}
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-whitesmoke px-4 py-[13px] rounded-[8px] border border-dropdownBorder shadow-lg max-w-xs"
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: 2,
                    delay: 0.3,
                  }}
                >
                  <MessageCircle size={18} className='text-secondary'/>
                </motion.div>
                <div>
                  <p className="text-sm text-[13px] font-medium text-secondary">Type your message here!</p>
                  <p className="text-[11px] text-muted">We're here to help you</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mt-2"
            >
              <motion.div
                animate={{
                  y: [0, 8, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="text-secondary"
              >
                <ArrowDown size={24} />
              </motion.div>
            </motion.div>

          </div>
          
        </motion.div>
      )}
    </AnimatePresence>
  )
}
