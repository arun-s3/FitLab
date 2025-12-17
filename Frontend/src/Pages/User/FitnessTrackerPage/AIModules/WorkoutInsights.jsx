import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"

import {TrendingUp, Flame, Award, Zap, Bot, Heart, Dumbbell, Timer, Battery} from "lucide-react"
import {MdTipsAndUpdates} from "react-icons/md"
import axios from 'axios'

import {CustomHashLoader} from '../../../../Components/Loader/Loader'

const insightsTemplates = [
  {
    id: 1,
    icon: Flame,
    title: "Performance & Effort Quality",
    description: "",
    color: "bg-orange-500",
    textColor: "text-orange-500",
    bgLight: "bg-orange-50",
    bgDark: "dark:bg-orange-950/30",
  },
  {
    id: 2,
    icon: Battery,
    title: "Volume & Efficiency",
    description: "",
    color: "bg-lime-500",
    textColor: "text-lime-500",
    bgLight: "bg-lime-50",
    bgDark: "dark:bg-lime-950/30",
  },
  {
    id: 3,
    icon: Timer,
    title: "Workout Duration",
    description: "",
    color: "bg-slate-500",
    textColor: "text-slate-500",
    bgLight: "bg-slate-50",
    bgDark: "dark:bg-slate-950/30",
  },
  {
    id: 4,
    icon: Award,
    title: "Overall Workout Score",
    description: "",
    color: "bg-purple-500",
    textColor: "text-purple-500",
    bgLight: "bg-purple-50",
    bgDark: "dark:bg-purple-950/30",
  },
  {
    id: 5,
    icon: MdTipsAndUpdates,
    title: "Suggestions",
    description: "",
    color: "bg-green-500",
    textColor: "text-green-500",
    bgLight: "bg-green-50",
    bgDark: "dark:bg-green-950/30",
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

export default function WorkoutInsights() {

  const [selectedInsight, setSelectedInsight] = useState(null)

  const [insights, setInsights] = useState([])

  const [loading, setLoading] = useState(false)

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  const createInsightCards = (aiResponse)=> {
    const aiResponseTopics = Object.keys(aiResponse)
    console.log("aiResponseTopics----------->", aiResponseTopics)
    const insightsDatas = aiResponseTopics.map(topic=> {
      const insightTemplate = insightsTemplates.find(template=> template.title === topic)
      return {...insightTemplate, description: aiResponse[topic]}
    })
    console.log("insightsDatas----------->", insightsDatas)
    setInsights(insightsDatas)
  }

  const getAiInsights = async()=> {
      console.log("Inside getAiInsights...") 
      setLoading(true)
      try { 
        const latestWorkoutResponse = await axios.get(`${baseApiUrl}/fitness/tracker/workout/latest`, { withCredentials: true })
        if(latestWorkoutResponse.status === 200){ 
          console.log("latestWorkoutResponse.data------->", latestWorkoutResponse.data) 
          const latestWorkout = latestWorkoutResponse.data.latestWorkout

          if (latestWorkout?.aiAnalysis && Object.keys(latestWorkout.aiAnalysis).length > 0){
            console.log("Returning cached AI response")
            createInsightCards(latestWorkout.aiAnalysis)
          }else{
            const analysisRequirement = {analysisType: 'latestWorkout', trackerId: latestWorkoutResponse.data.trackerId, lastWorkout: latestWorkout} 

            const AiInsightResponse = await axios.post(`${baseApiUrl}/ai/ask`, {analysisRequirement}, { withCredentials: true})

            if(AiInsightResponse.status === 200){
              console.log("AiInsightResponse.data.aiResponse----------->", AiInsightResponse.data.aiResponse)
              createInsightCards(AiInsightResponse.data.aiResponse)
            }
          }
        }
      }catch (error) {
        console.error("Error while fetching insights", error.message)
      }finally{
        setLoading(false)
      }
  }

  useEffect(()=> {
    getAiInsights()
  }, [])

  useEffect(()=> {
    console.log("insights----------->", insights)
  }, [insights])

  if (loading) {
    return (
      <div className="w-full mt-6 max-w-7xl mx-auto py-8 sm:px-6 border border-dropdownBorder rounded-xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-[7px] p-2">
                <Bot className="w-[1.8rem] h-[1.8rem] text-white" />
              </div>
              <div>
                <h2 className="text-[21px] font-bold text-gray-900 dark:text-white">AI Workout Insights</h2>
                <p className="-mt-[3px] text-[14px] text-gray-600 dark:text-gray-400">Personalized insights generated from your recent workout</p>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <p className="text-gray-600 dark:text-gray-400">Our AI is analyzing your workout. This process may take up to a minute...</p>

            </div>
          </div>
          <div className="mr-8">
              <CustomHashLoader loading={loading} size={30}/>
          </div>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`bg-white min-h-[19rem] dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700
                 ${i === 5 && 'col-span-2'}`}
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
    <div className="w-full mt-6 max-w-7xl mx-auto py-8 sm:px-6 border border-dropdownBorder rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 flex gap-[8px] rounded-xl p-2 shadow-lg"
          >
            <Bot className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-[21px] font-bold text-gray-900 dark:text-white">AI Workout Insights</h2>
            <p className="text-gray-600 -mt-[3px] text-[14px] dark:text-gray-400">Personalized insights generated from your workout</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {
          insights && insights.length > 0 && insights.map((insight, index) => {
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
                    relative overflow-hidden min-h-[19rem]
                    bg-white dark:bg-gray-800
                    rounded-2xl p-6
                    border-2 transition-colors duration-300
                    ${index === 5 && 'col-span-2'}
                    ${
                      isSelected
                        ? `${insight.textColor.replace("text-", "border-")} shadow-xl`
                        : "border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg"
                    }
                  `}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isSelected ? 0.1 : 0 }}
                    className={`absolute inset-0 ${insight.color}`}
                  />

                  <motion.div
                    variants={iconVariants}
                    className={`
                      w-12 h-12 rounded-xl mb-4 flex items-center justify-center
                      ${insight.bgLight} ${insight.bgDark}
                    `}
                  >
                    <IconComponent className={`w-6 h-6 ${insight.textColor}`} />
                  </motion.div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{insight.title}</h3>
                  <ul className="ml-[5px] list-disc dark:text-gray-400 text-sm leading-relaxed">
                    {
                      insight.description.map(content=> (
                        <li className="text-gray-600 text-[13px] mt-[5px]"> {content} </li>
                      ))
                    }
                  </ul>

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
          }
        )}
      </motion.div>

    </div>
  )
}
