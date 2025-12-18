import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"

import {Flame, Award, Timer, Battery} from "lucide-react"
import {MdTipsAndUpdates} from "react-icons/md"
import axios from 'axios'

import AiInsightCards from "../../../../Components/AiInsightCards/AiInsightCards"


export default function WorkoutAiInsights() { 

    const [latestWorkoutDatas, setLatestWorkoutDatas] = useState(null)
    const [latestWokoutInsights, setLatestWokoutInsights] = useState(null)
    
    const [loading, setLoading] = useState(false)

    const baseApiUrl = import.meta.env.VITE_API_BASE_URL

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

    const getInsightDataSources = async()=> {
        console.log("Inside getInsightDataSources...") 
        setLoading(true)
        try { 
          const latestWorkoutResponse = await axios.get(`${baseApiUrl}/fitness/tracker/workout/latest`, { withCredentials: true })
          if(latestWorkoutResponse.status === 200){ 
            console.log("latestWorkoutResponse.data------->", latestWorkoutResponse.data) 
            console.log("latestWorkoutResponse.data.prevExercise------->", latestWorkoutResponse.data.prevExercise) 

            const { latestWorkout, prevExercise, trackerId } = latestWorkoutResponse.data

            const hasPrevWorkout = Boolean(prevExercise)
            const hasAIAnalysis = latestWorkout?.aiAnalysis && Object.keys(latestWorkout.aiAnalysis).length > 0

            const isRelativeAnalysis = Boolean(latestWorkout?.relativeAnalysis)

            const canUseCachedAnalysis = hasAIAnalysis && ((!hasPrevWorkout && !isRelativeAnalysis) || (hasPrevWorkout && isRelativeAnalysis))
            
            if (canUseCachedAnalysis) {
              console.log("Returning cached AI response")
              setLatestWokoutInsights(latestWorkout.aiAnalysis)
              return
            }
          
            const workoutDatas = {analysisType: "latestWorkout", trackerId, lastWorkout: latestWorkout, prevWorkout: prevExercise || null}
          
            setLatestWorkoutDatas(workoutDatas)
          }
        }catch (error) {
          console.error("Error while fetching latest workout", error.message)
        }finally{
          setLoading(false)
        }
    }

    useEffect(()=> {
      getInsightDataSources()
    }, [])


    return ( 
      
        <>
            {
                <AiInsightCards 
                    insightsTemplates={insightsTemplates}
                    requiredSourceDatas={latestWorkoutDatas}
                    existingAiInsights={latestWokoutInsights}
                    sectionTitle="AI Workout Insights"
                    sectionSubtitle="Personalized insights generated from your recent workouts"
                    sourceDatasLoading={loading}
                />

            }
        </>

    )
}
