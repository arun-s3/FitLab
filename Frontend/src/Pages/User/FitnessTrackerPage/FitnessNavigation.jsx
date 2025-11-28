import React from "react"
import { motion } from "framer-motion"

import {Zap, Heart, ChartLine, ChartNoAxesCombined} from 'lucide-react'



export default function FitnessNav({ currentPage, setCurrentPage }) {
    
  const tabs = [
    { id: "tracker", label: "Workout", icon: Zap },
    { id: "dashboard", label: "Dashboard", icon: ChartNoAxesCombined  },
    { id: "bmi", label: "Health", icon: Heart },
  ]

  return (
    <motion.div
      className="ml-10 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl px-4">
        <div className="flex items-center justify-between py-4">
          {/* <h2 className="text-xl font-bold text-gray-900">Fitness Tracker</h2> */}
          {/* <img 
            src='/fitness-tracker.png'
            className="w-[25px] h-[25px]"
          /> */}
            {/* <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <p className="text-gray-600 text-[16px] text-secondary">Track your progress, crush your goals</p>
            </motion.div> */}

          <div className="px-[10px] py-[7px] flex items-center gap-1 bg-gray-100 p-1 rounded-[9px]">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = currentPage === tab.id

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setCurrentPage(tab.id)}
                  className="relative px-4 py-2 flex items-center gap-2 font-medium text-sm rounded-full transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-white rounded-[8px] shadow-md shadow-gray-300/50"
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <motion.div
                    className={`relative flex items-center gap-2 z-10 ${
                      isActive ? "text-purple-600" : "text-gray-600 hover:text-gray-900"
                    }`}
                    animate={{ scale: isActive ? 1 : 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="w-[20px] h-[20px]"/>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </motion.div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
