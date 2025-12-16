import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"

import {TrendingUp, Flame, Award, Zap, Heart, Dumbbell, Timer, Battery} from "lucide-react"
import axios from 'axios'

const mockInsights = [
  {
    id: 1,
    icon: TrendingUp,
    title: "Performance Trending Up",
    description: "Your workout intensity has increased by 23% over the last month. Keep pushing!",
    color: "bg-emerald-500",
    textColor: "text-emerald-500",
    bgLight: "bg-emerald-50",
    bgDark: "dark:bg-emerald-950/30",
  },
  {
    id: 2,
    icon: Flame,
    title: "Consistency Streak",
    description: "You've maintained a 15-day workout streak. Your dedication is paying off!",
    color: "bg-orange-500",
    textColor: "text-orange-500",
    bgLight: "bg-orange-50",
    bgDark: "dark:bg-orange-950/30",
  },
  {
    id: 4,
    icon: Award,
    title: "Personal Best Achievement",
    description: "New PR: 225 lbs bench press! You've increased your max by 15 lbs this month.",
    color: "bg-purple-500",
    textColor: "text-purple-500",
    bgLight: "bg-purple-50",
    bgDark: "dark:bg-purple-950/30",
  },
  {
    id: 7,
    icon: Dumbbell,
    title: "Muscle Group Balance",
    description: "Upper body workouts: 65%, Lower body: 35%. Consider adding 2 more leg days per month.",
    color: "bg-indigo-500",
    textColor: "text-indigo-500",
    bgLight: "bg-indigo-50",
    bgDark: "dark:bg-indigo-950/30",
  },
  {
    id: 12,
    icon: Timer,
    title: "Workout Duration",
    description: "Average session: 52 minutes. Optimal range is 45-75 minutes for your goals.",
    color: "bg-slate-500",
    textColor: "text-slate-500",
    bgLight: "bg-slate-50",
    bgDark: "dark:bg-slate-950/30",
  },
  {
    id: 16,
    icon: Battery,
    title: "Energy Levels",
    description: "Morning workouts show 28% higher energy output. Consider scheduling key sessions early.",
    color: "bg-lime-500",
    textColor: "text-lime-500",
    bgLight: "bg-lime-50",
    bgDark: "dark:bg-lime-950/30",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
}

const iconVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10,
    },
  },
}

const cardVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  tap: { scale: 0.98 },
}

export default function WorkoutInsights({ insights = mockInsights, loading = false }) {

  const [selectedInsight, setSelectedInsight] = useState(null)

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  const getAIInsights = async()=> {
      console.log("Inside getAIInsights...") 
      try { 
        const response = await axios.get(`${baseApiUrl}/ai/ask`, { withCredentials: true })
        if(response.status === 200){
          console.log("response.data.aiResponse----------->", response.data.aiResponse)
        }
      }catch (error) {
        console.error("Error while fetching insights", error.message)
      }
  }

  useEffect(()=> {
    getAIInsights()
  }, [])

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-2">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">AI Workout Insights</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Analyzing your workout history...</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="animate-pulse">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 w-3/4" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-2 shadow-lg"
          >
            <Zap className="w-6 h-6 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">AI Workout Insights</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Personalized insights generated from your workout history</p>
      </motion.div>

      {/* Insights Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {insights.map((insight) => {
          const IconComponent = insight.icon
          const isSelected = selectedInsight?.id === insight.id

          return (
            <motion.div
              key={insight.id}
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setSelectedInsight(isSelected ? null : insight)}
              className="cursor-pointer"
            >
              <motion.div
                variants={cardVariants}
                className={`
                  relative overflow-hidden
                  bg-white dark:bg-gray-800
                  rounded-2xl p-6
                  border-2 transition-colors duration-300
                  ${
                    isSelected
                      ? `${insight.textColor.replace("text-", "border-")} shadow-xl`
                      : "border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg"
                  }
                `}
              >
                {/* Background Gradient Effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isSelected ? 0.1 : 0 }}
                  className={`absolute inset-0 ${insight.color}`}
                />

                {/* Icon */}
                <motion.div
                  variants={iconVariants}
                  className={`
                    w-12 h-12 rounded-xl mb-4 flex items-center justify-center
                    ${insight.bgLight} ${insight.bgDark}
                  `}
                >
                  <IconComponent className={`w-6 h-6 ${insight.textColor}`} />
                </motion.div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{insight.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{insight.description}</p>

                {/* Animated Border Pulse */}
                {isSelected && (
                  <motion.div
                    layoutId="selectedBorder"
                    className={`absolute inset-0 rounded-2xl border-2 ${insight.textColor.replace("text-", "border-")}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </motion.div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Overall Progress Summary</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9, type: "spring" }}
              className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1"
            >
              23%
            </motion.div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Intensity Increase</div>
          </div>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.0, type: "spring" }}
              className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1"
            >
              15
            </motion.div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Day Streak</div>
          </div>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.1, type: "spring" }}
              className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1"
            >
              78%
            </motion.div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Goal Complete</div>
          </div>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
              className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-1"
            >
              18%
            </motion.div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Better Recovery</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
