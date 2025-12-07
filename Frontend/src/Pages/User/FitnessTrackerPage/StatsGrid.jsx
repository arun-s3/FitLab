import React, {useState, useEffect} from "react"
import './FitnessTrackerStyles.css'
import {motion, AnimatePresence} from "framer-motion"

import axios from 'axios'

const TrendingIcon = () => (
  <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const ZapIcon = () => (
  <svg className="w-5 h-5 text-white/50" fill="currentColor" viewBox="0 0 24 24">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
)

const AwardIcon = () => (
  <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
    />
  </svg>
)

const CalendarIcon = () => (
  <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)

export default function StatsGrid({ timeRange }) {

  const [loading, setLoading] = useState(false)

  const [statCards, setStatCards] = useState([
    {
      label: "Workouts",
      value: null,
      icon: CalendarIcon,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Total Volume",
      value: null,
      icon: TrendingIcon,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Calories Burned",
      value: null,
      icon: ZapIcon,
      color: "from-primaryDark to-orange-400",
    },
    {
      label: "Current Streak",
      value: null,
      icon: AwardIcon,
      color: "from-green-500 to-green-600",
    },
  ])

    const baseApiUrl = import.meta.env.VITE_API_BASE_URL
  
    useEffect(() => {
      const fetchAllStats = async ()=> {
        console.log("Inside fetchAllStats()..")
    
        setLoading(true) 
        try{
          const response = await axios.get(`${baseApiUrl}/fitness/tracker/stats/${timeRange}`, { withCredentials: true })
          if(response.status === 200){
            console.log("response.data.weekStats------->", response.data.weekStats)
            const {totalWorkouts, totalVolumes, totalCaloriesBurned, currentStreak} = response.data.stats
            setStatCards((prev) =>
              prev.map((card) => {
                if (card.label === "Workouts") {
                  return { ...card, value: totalWorkouts };
                }
                if (card.label === "Total Volume") {
                  return { ...card, value: totalVolumes };
                }
                if (card.label === "Calories Burned") {
                  return { ...card, value: `${totalCaloriesBurned} kcal` };
                }
                if (card.label === "Current Streak") {
                  return { ...card, value: `${currentStreak} days` };
                }
                return card;
              })
            )
            setLoading(false)
          }
          if(response.status === 400 || response.status === 404){
            console.log("Error---->", error.response.data.message)
            setLoading(false)
          }
        }catch(error){
          console.error("Error during saving workoutInfo", error.message)
          setLoading(false)
        }
      }
    
      fetchAllStats();
    }, [timeRange])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {
        !loading ?
          statCards.map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`bg-gradient-to-br ${card.color} rounded-xl p-6 border shadow-lg text-white 
                 ${index === 0 ? 'border-primary' : 'border-white/10'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white/70 font-semibold">{card.label}</h3>
                  <Icon />
                </div>
                <p className="text-3xl font-bold">{card.value}</p>
              </motion.div>
            )
          })
        :
          statCards.map((card, index) => {
            return (
              <AnimatePresence>
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`skeleton-loader ${card.color} rounded-xl p-6 border shadow-lg text-white
                    ${index === 0 ? 'border-primary' : 'border-white/10'} `}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white/70 font-semibold invisible">{card.label}</h3>
                    <div className={`invisible h-[15px] w-[15px] p-3 rounded-full `}></div>
                  </div>
                  <p className="text-3xl font-bold invisible">{card.value}</p>
                </motion.div>
              </AnimatePresence>
            )
          })
      }
    </motion.div>
  )
}
