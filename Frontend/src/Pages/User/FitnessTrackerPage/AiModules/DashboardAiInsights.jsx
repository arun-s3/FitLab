import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"

import {SquareActivity, HeartPulse, BicepsFlexed} from "lucide-react"
import {RiSkull2Line} from "react-icons/ri"
import {RiBodyScanLine} from "react-icons/ri"
import {GiStrongMan} from "react-icons/gi"
import axios from 'axios'

import AiInsightCards from "../../../../Components/AiInsightCards/AiInsightCards"


export default function DashboardAiInsights({receivedSourceDatas}) { 

    // const [latestHealthDatas, setLatestHealthDatas] = useState(null)
    const [dashboardDatas , setDashboardInsights] = useState(null)
    
    const [loading, setLoading] = useState(false)

    const baseApiUrl = import.meta.env.VITE_API_BASE_URL

    const insightsTemplates = [  ["workouts", "volume", "weight", "exerciseBreakdown"]
        {
          id: 1,
          icon: SquareActivity,
          title: "Workout frequency", 
          description: "",
          color: "bg-lime-500",
          textColor: "text-lime-500",
          bgLight: "bg-lime-50",
          bgDark: "dark:bg-lime-950/30",
        },
        {
          id: 2,
          icon: RiSkull2Line,
          title: "Volume Trends",
          description: "",
          color: "bg-orange-500",
          textColor: "text-orange-500",
          bgLight: "bg-orange-50",
          bgDark: "dark:bg-orange-950/30",
        },
        {
          id: 3,
          icon: RiBodyScanLine,
          title: "Weight Trends",
          description: "",
          color: "bg-slate-500",
          textColor: "text-slate-500",
          bgLight: "bg-slate-50",
          bgDark: "dark:bg-slate-950/30",
        },
        {
          id: 4,
          icon: HeartPulse,
          title: "Workout Bodypart analysis",
          description: "",
          color: "bg-purple-500",
          textColor: "text-purple-500",
          bgLight: "bg-purple-50",
          bgDark: "dark:bg-purple-950/30",
        },
    ]

    
    // useEffect(()=> {
    //   getInsightDataSources()
    // }, [])
    
    useEffect(()=> {
        const insightDatatypes = ["workouts", "volume", "weight", "exerciseBreakdown"]
        const everyInsightDatatypesExists = insightDatatypes.every(datatype=> Object.keys(receivedSourceDatas).includes(datatype))
        if(everyInsightDatatypesExists){

        }
    }, [receivedSourceDatas])


    return ( 
      
        <>
            {
                <AiInsightCards 
                    insightsTemplates={insightsTemplates}
                    existingAiInsights={dashboardDatas}
                    sectionTitle="AI Insights"
                    sectionSubtitle="Personalized insights generated from your workout history"
                    sourceDatasLoading={loading}
                />

            }
        </>

    )
}
