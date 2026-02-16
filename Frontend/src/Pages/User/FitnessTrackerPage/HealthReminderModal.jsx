import React, { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { AlertCircle, TrendingUp, BarChart3, X } from "lucide-react"

import useModalHelpers from '../../../Hooks/ModalHelpers'


export default function HealthReminderModal({isOpen, isNewUser = true, onUpdateHealthMetrics, onClose}) {

  const modalRef = useRef(null)
  useModalHelpers({open: isOpen, onClose, modalRef})

  const benefits = [
    {
      icon: AlertCircle,
      title: "Early Detection",
      description: "Catch health issues before they develop into serious diseases",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your fitness journey and see measurable improvements",
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Get insights from your dashboard to make informed health decisions",
    }
  ]

  const handleSkip = () => {
    onClose()
  }


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleSkip}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <motion.div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-[9px] shadow-2xl overflow-hidden">
              <motion.div
                className="relative bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-8"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.02, type: "spring", stiffness: 50 }}
                >
                  <AlertCircle className="w-[2.8rem] h-[2.8rem] text-white" />
                  <div>
                    <h2 className="text-[22px] font-bold text-white">Health Update Reminder</h2>
                    <p className="text-[#d8ff00] text-sm">Keep your health data current for better insights</p>
                  </div>
                </motion.div>

                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSkip}
                  className="absolute top-4 right-4 text-white hover:text-orange-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </motion.div>

              <div className="px-6 py-6 max-h-[34rem] overflow-y-auto" ref={modalRef}>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 dark:text-gray-300 text-sm mb-6 font-medium"
                >
                    {` ${ !isNewUser 
                            ? 'It appears that your health data hasn’t been updated for over a week. ' 
                            : 'Your health data should be updated atleast once a week. '} 
                      We’ll continue to send weekly reminders so you can keep your metrics current.
                    `}
                  <p className="mt-[10px]">
                    Why you should update your health data every week:
                  </p>
                </motion.p>

                <motion.div
                  className="space-y-3 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {benefits.map((benefit, index) => {
                    const IconComponent = benefit.icon
                    return (
                      <motion.div
                        key={benefit.title}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.08 }}
                        whileHover={{ x: 4 }}
                        className="flex gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-750 rounded-lg p-4 border border-orange-100 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-400 transition-colors cursor-pointer"
                      >
                        <div className="flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-yellow-500 dark:text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{benefit.title}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{benefit.description}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>

                <motion.div
                  className="flex gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSkip}
                    className="flex-1 px-4 py-[11px] text-[15px] rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700
                     dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Skip for Now
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={()=> onUpdateHealthMetrics()}
                    className="flex-1 px-4 py-[11px] text-[15px] rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white
                     font-semibold hover:shadow-lg hover:bg-purple-800 transition-shadow"
                  >
                    Update Now
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
