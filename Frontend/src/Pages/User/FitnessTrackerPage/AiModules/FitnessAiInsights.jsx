import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"

import {TrendingUpDown} from "lucide-react"
import {PiBarbellFill} from "react-icons/pi"
import {GiMuscleUp} from "react-icons/gi"
import {FaPersonRays} from "react-icons/fa6"
import {MdOutlineThumbsUpDown} from "react-icons/md"
import {MdTipsAndUpdates} from "react-icons/md"
import axios from 'axios'

import AiInsightCards from "../../../../Components/AiInsightCards/AiInsightCards"


export default function FitnessAiInsights({receivedSourceDatas, periodType}) { 

    const [periodFitnessDatas, setPeriodFitnessDatas] = useState(null)
    const [fitnessInsights, setFitnessInsights] = useState(null)

    const [generateAiInsights, setGenerateAiInsights] = useState(false)

    const [recreateAICards, setRecreateAICards] = useState(false)
    
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState(null)

    const baseApiUrl = import.meta.env.VITE_API_BASE_URL

    const insightsTemplates = [   
        {
          id: 1,
          icon: PiBarbellFill, 
          title: "Training Consistency", 
          description: "",
          color: "bg-lime-500",
          textColor: "text-lime-500",
          bgLight: "bg-lime-50",
          bgDark: "dark:bg-lime-950/30",
        },
        {
          id: 2,
          icon: TrendingUpDown,
          title: "Strength Progression",
          description: "",
          color: "bg-orange-500",
          textColor: "text-orange-500",
          bgLight: "bg-orange-50",
          bgDark: "dark:bg-orange-950/30",
        },
        {
          id: 3,
          icon: GiMuscleUp,
          title: "Body Part Balance & Training Distribution",
          description: "",
          color: "bg-slate-500",
          textColor: "text-slate-500",
          bgLight: "bg-slate-50",
          bgDark: "dark:bg-slate-950/30",
        },
        {
          id: 4,
          icon: MdOutlineThumbsUpDown,
          title: "Training Efficiency",
          description: "",
          color: "bg-purple-500",
          textColor: "text-purple-500",
          bgLight: "bg-purple-50",
          bgDark: "dark:bg-purple-950/30",
        },
        {
          id: 5,
          icon: FaPersonRays,
          title: "Personalized Training Personality",
          description: "",
          color: "bg-lime-500",
          textColor: "text-lime-500",
          bgLight: "bg-lime-50",
          bgDark: "dark:bg-lime-950/30",
        },
        {
          id: 6,
          icon: MdTipsAndUpdates,
          title: "Suggestions and Tips",
          description: "",
          color: "bg-green-500",
          textColor: "text-green-500",
          bgLight: "bg-green-50",
          bgDark: "dark:bg-green-950/30",
        }
    ]

    const getInsightDataSources = async()=> {
        console.log("Inside getInsightDataSources...") 
        setLoading(true)
        try {  
          const latestInsightResponse = await axios.get(`${baseApiUrl}/ai/insights/tracker`, { withCredentials: true })
          if(latestInsightResponse.status === 200){ 
            console.log("latestInsightResponse.data------->", latestInsightResponse.data) 

            const { week, month } = latestInsightResponse.data
            
            if ((week && periodType ==='week') || (month && periodType ==='month')) {
              console.log("Returning cached AI response")
              let insightDatas = null
              if(periodType ==='week'){
                insightDatas = week.insights
              }else{
                insightDatas = month.insights
              }
              console.log("Cached insightDatas------->", insightDatas) 
              setFitnessInsights(insightDatas)
              setRecreateAICards(true)
              return
            }else{
              console.log("Have to generate new insights...")
              setGenerateAiInsights(true) 
              setRecreateAICards(true)
            }
          }
        }catch (error) {
          console.error("Error while fetching latest insight datas", error.message)
          setError("Something went wrong while finding your tracking history! Please check your network and retry later")
        }finally{
          setLoading(false)
        }
    }

    useEffect(()=> {
      setFitnessInsights(null)
      setRecreateAICards(false) 
      getInsightDataSources()
    }, [periodType])
    
    useEffect(()=> {
      if(generateAiInsights && receivedSourceDatas){
        const insightDatatypes = ["stats", "workouts", "volume", "weight", "exerciseBreakdown"]
        const everyInsightDatatypesExists = insightDatatypes.every(datatype=> Object.keys(receivedSourceDatas).includes(datatype))
        if(everyInsightDatatypesExists){
          const fitnessDatas = {analysisType: "periodFitnessProfile", fitnessProfile: receivedSourceDatas, periodType}
          setPeriodFitnessDatas(fitnessDatas)
        }
      }
    }, [receivedSourceDatas, generateAiInsights])


    return ( 
      
        <>
            {   
            recreateAICards &&
                <AiInsightCards 
                    insightsTemplates={insightsTemplates}
                    requiredSourceDatas={periodFitnessDatas}
                    existingAiInsights={fitnessInsights}
                    sectionTitle="AI Fitness Insights"
                    sectionSubtitle={`Personalized insights generated from your recent workouts and fitness profile in this ${periodType}`}
                    sourceDatasLoading={loading}
                    parentFetchError={error}
                />

            }
        </>

    )
}
