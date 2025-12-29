import React from "react"
import { motion, AnimatePresence } from "framer-motion"


export default function PolicyContentSection({activeSectionIndex, activeSectionData}) {


  const fadeInOut = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4, ease: "easeInOut" },
  }


  return (
        <motion.main
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 lg:min-h-screen"
        >
          <AnimatePresence mode="wait">

            <motion.div
              key={activeSectionIndex}
              variants={fadeInOut}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12"
            >
              <motion.div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  {activeSectionData.icon && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="p-[10px] bg-purple-100 rounded-lg"
                    >
                      <activeSectionData.icon size={20} className="text-purple-600" />
                    </motion.div>
                  )}
                  <h2 className="text-[27px] font-bold text-purple-700 tracking-[0.9px]">{activeSectionData.title}</h2>
                </div>
                <motion.div
                  layoutId="contentUnderline"
                  className="w-16 h-1 bg-purple-600 rounded-full"
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4"
              >
                {activeSectionData.content.split("\n").map(
                  (paragraph, idx) =>
                    paragraph.trim() && (
                      <motion.p
                        key={idx}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.2 + idx * 0.05,
                        }}
                        className="text-base text-gray-600 leading-8"
                      >
                        {paragraph.trim()}
                      </motion.p>
                    ),
                )}
              </motion.div>
            </motion.div>

          </AnimatePresence>
        </motion.main>
  )
}
