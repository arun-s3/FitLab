import React from "react"
import { motion } from "framer-motion" 


export default function TermsAndConditionTopics({termsAndConditions, onClickTermTopic, activeSection}) {

  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  }


  return (
          <motion.div className="md:col-span-1" variants={sidebarVariants} initial="hidden" animate="visible">
            <nav className="space-y-1 border-l-4 border-gray-200 pl-6">
              {termsAndConditions.map((section, index) => (
                <motion.button
                  key={index}
                  variants={itemVariants}
                  onClick={() => onClickTermTopic(index)}
                  className={`w-full text-left text-[15px] px-0 py-2 font-[600] transition-colors duration-300 ${
                    activeSection === index
                      ? "text-secondary border-l-4 border-secondary -ml-[1.7rem] pl-6"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  <span>{index + 1}.</span> {section.title}
                </motion.button>
              ))}
            </nav>
          </motion.div>
  )
}
