import React from "react"
import { motion, AnimatePresence } from "framer-motion" 


export default function TermsAndConditionContent({termsAndConditions, activeSection}) {

  const contentVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
    exit: {
      opacity: 0,
      y: -15,
      transition: { duration: 0.2 },
    },
  }

  const bulletVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, delay: i * 0.08 },
    }),
  }


  return (
          <motion.div
            className="md:col-span-3 pl-16"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <motion.h3
                    className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Summary:
                  </motion.h3>

                  <motion.ul className="space-y-4">
                    {termsAndConditions[activeSection].content.map((line, idx) => (
                      <motion.li
                        key={idx}
                        custom={idx}
                        variants={bulletVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex gap-4 items-center group"
                      >
                        <div className="flex-shrink-0 w-2 h-2 bg-secondary rounded-full group-hover:scale-125 transition-transform duration-300" />
                        <span className="text-gray-700 leading-relaxed text-base group-hover:text-gray-900 transition-colors duration-300">
                          {line}
                        </span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
  )
}
