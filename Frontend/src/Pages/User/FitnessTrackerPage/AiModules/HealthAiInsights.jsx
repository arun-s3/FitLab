import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"

import {SquareActivity, HeartPulse, BicepsFlexed} from "lucide-react"
import {RiSkull2Line} from "react-icons/ri"
import {RiBodyScanLine} from "react-icons/ri"
import {GiStrongMan} from "react-icons/gi"
import apiClient from '../../../../Api/apiClient'

import AiInsightCards from "../../../../Components/AiInsightCards/AiInsightCards"


export default function HealthAiInsights() { 

    const [latestHealthDatas, setLatestHealthDatas] = useState(null)
    const [latestHealthInsights, setLatestHealthInsights] = useState(null)
    
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState(null)

    const baseApiUrl = import.meta.env.VITE_API_BASE_URL

    const insightsTemplates = [
        {
          id: 1,
          icon: SquareActivity,
          title: "Health Overview", 
          description: "",
          color: "bg-lime-500",
          textColor: "text-lime-500",
          bgLight: "bg-lime-50",
          bgDark: "dark:bg-lime-950/30",
        },
        {
          id: 2,
          icon: RiSkull2Line,
          title: "Potential Risk Patterns",
          description: "",
          color: "bg-orange-500",
          textColor: "text-orange-500",
          bgLight: "bg-orange-50",
          bgDark: "dark:bg-orange-950/30",
        },
        {
          id: 3,
          icon: RiBodyScanLine,
          title: "Body Composition Insight",
          description: "",
          color: "bg-slate-500",
          textColor: "text-slate-500",
          bgLight: "bg-slate-50",
          bgDark: "dark:bg-slate-950/30",
        },
        {
          id: 4,
          icon: HeartPulse,
          title: "Cardiovascular Health Insight",
          description: "",
          color: "bg-purple-500",
          textColor: "text-purple-500",
          bgLight: "bg-purple-50",
          bgDark: "dark:bg-purple-950/30",
        },
        {
          id: 5,
          icon: GiStrongMan,
          title: "Lifestyle Indicators",
          description: "",
          color: "bg-green-500",
          textColor: "text-green-500",
          bgLight: "bg-green-50",
          bgDark: "dark:bg-green-950/30",
        },
        {
          id: 5,
          icon: BicepsFlexed,
          title: "Personalized Focus Areas",
          description: "",
          color: "bg-purple-500",
          textColor: "text-purple-500",
          bgLight: "bg-purple-50",
          bgDark: "dark:bg-purple-950/30",
        },
    ]

    const getInsightDataSources = async()=> {
        setLoading(true)
        try { 
          const latestHealthResponse = await apiClient.get(`${baseApiUrl}/fitness/tracker/health`)

          if(latestHealthResponse.status === 200){ 
            const { latestProfile, prevProfile } = latestHealthResponse.data

            const hasPrevProfile = Boolean(prevProfile)
            const hasAIAnalysis = latestProfile?.aiAnalysis && Object.keys(latestProfile.aiAnalysis).length > 0

            const isRelativeAnalysis = Boolean(latestProfile?.relativeAnalysis)

            const canUseCachedAnalysis = hasAIAnalysis && ((!hasPrevProfile && !isRelativeAnalysis) || (hasPrevProfile && isRelativeAnalysis))
            
            if (canUseCachedAnalysis) {
              setLatestHealthInsights(latestProfile.aiAnalysis)
              return
            }
          
            const healthDatas = {analysisType: "latestHealthProfile", latestProfile, prevProfile: prevProfile || null}
          
            setLatestHealthDatas(healthDatas)
          }
        }catch (error) {
          setError("Something went wrong while finding your health profiles! Please check your network and retry later")
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
                    requiredSourceDatas={latestHealthDatas}
                    existingAiInsights={latestHealthInsights}
                    sectionTitle="AI Health Insights"
                    sectionSubtitle="Personalized insights generated from your recent health metrics"
                    sourceDatasLoading={loading}
                    parentFetchError={error}
                />

            }
        </>

    )
}
