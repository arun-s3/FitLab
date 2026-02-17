import React, {useState, useEffect} from "react"
import { motion } from "framer-motion"

import {Zap, Heart, ChartNoAxesCombined} from 'lucide-react'
import apiClient from '../../../Api/apiClient'

import HealthReminderModal from "./HealthReminderModal"


export default function FitnessNav({ currentPage, setCurrentPage }) {

  const [openReminderModal, setOpenReminderModal] = useState({status: false, isNewUser: true})

  const checkRecentHealthTrackers = async()=> {
    try { 
      const response = await apiClient.get(`/fitness/tracker/health/check`)
      if(response.status === 200){
        if(response.data.shouldShowReminder) setOpenReminderModal({status: true, isNewUser: response.data.isNewUser})
      }
    }catch (error) {
      console.error(error)
      return
    }
  }

  useEffect(()=> {
    setTimeout(()=> checkRecentHealthTrackers(), 5000)
  }, [])
    
  const tabs = [
    { id: "tracker", label: "Workout", icon: Zap },
    { id: "bmi", label: "Health", icon: Heart },
    { id: "dashboard", label: "Dashboard", icon: ChartNoAxesCombined  },
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

      {
        openReminderModal.status && 

          <HealthReminderModal 
            isOpen={openReminderModal.status}
            isNewUser={openReminderModal.isNewUser} 
            onUpdateHealthMetrics={()=> {
              setCurrentPage("bmi")
              setOpenReminderModal(modal=> ({...modal, status: false}))
            }}
            onClose={()=> setOpenReminderModal(modal=> ({...modal, status: false}))}
          />
      }

    </motion.div>
  )
}
