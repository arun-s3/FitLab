import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

import {Bot} from "lucide-react"
import apiClient from "../../Api/apiClient"

import {CustomHashLoader} from '../Loader/Loader'


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

export default function AiInsightCards({insightsTemplates, requiredSourceDatas, existingAiInsights, sectionTitle, sectionSubtitle, cardStyles,
  sourceDatasLoading, excludeAndReturnItemTitles = null, onReturnExclusiveDatas, parentFetchError = null}){

  const [selectedInsight, setSelectedInsight] = useState(null)

  const [insights, setInsights] = useState([])

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState(null)

  const hasReturnedExclusive = useRef(false)
  const hasCreatedCards = useRef(false)

  const createInsightCards = (aiResponse)=> {
    let aiResponseTopics = Object.keys(aiResponse)

    if(excludeAndReturnItemTitles && !hasReturnedExclusive.current){
        const excludedDatas = aiResponseTopics.reduce((accObj, topic)=> {
          if(excludeAndReturnItemTitles.some(title=> title === topic)){
            accObj[topic] = aiResponse[topic]
          }
          return accObj
        }, {})
        onReturnExclusiveDatas(excludedDatas)
        hasReturnedExclusive.current = true
        aiResponseTopics = aiResponseTopics.filter(topic=> !excludeAndReturnItemTitles.includes(topic))
    }

    const insightsDatas = aiResponseTopics.map(topic=> {
      const insightTemplate = insightsTemplates.find(template=> template.title === topic)
      return {...insightTemplate, description: aiResponse[topic]}
    })

    const filteredInsightData = insightsDatas.filter(data=> data?.title)
    setInsights(filteredInsightData)
  }

  const getAiInsights = async()=> {
      setLoading(true)
      try { 
        const AiInsightResponse = await apiClient.post(`/ai/analyze`, {analysisRequirement: requiredSourceDatas})
        if(AiInsightResponse.status === 200){
          createInsightCards(AiInsightResponse.data.aiResponse)
        }
      }catch (error) {
        if (!error.response) {
          sonnerToast.error("Network error. Please check your internet.")
          setError("Network error. Please check your internet.")
        } else if (error.response?.status === 404 || error.response?.status === 502) {
          sonnerToast.error(error.response.data.message || "Error while loading the insights")
          setError(error.response.data.message || "Error while loading the insights")
        } else {
          sonnerToast.error("Something went wrong! Please retry later!")
          setError("Something went wrong! Please retry later!")
        }
      }finally{
        setLoading(false)
      }
  }

  useEffect(()=> {
    if(insightsTemplates && insightsTemplates.length > 0 && existingAiInsights && !hasCreatedCards.current){
        hasCreatedCards.current = true  
        createInsightCards(existingAiInsights)
    }else if(insightsTemplates && insightsTemplates.length > 0  && requiredSourceDatas && !hasCreatedCards.current){
      hasCreatedCards.current = true  
      getAiInsights()
    }
  }, [insightsTemplates, existingAiInsights, requiredSourceDatas])

  if (sourceDatasLoading || loading) {
    return (
      <div className="w-full bg-whitesmoke mt-6 max-w-7xl mx-auto py-8 sm:px-6 border border-dropdownBorder rounded-xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-[7px] p-2">
                <Bot className="w-[1.8rem] h-[1.8rem] text-white" />
              </div>
              <div>
                <h2 className="text-[21px] font-bold text-gray-900 dark:text-white"> {sectionTitle} </h2>
                <p className="-mt-[3px] text-[14px] text-gray-600 dark:text-gray-400"> {sectionSubtitle} </p>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <p className="text-gray-600 dark:text-gray-400">Our AI is analyzing your workout. This process may take up to a minute...</p>

            </div>
          </div>
          <div className="mr-8">
              <CustomHashLoader loading={sourceDatasLoading || loading} size={30}/>
          </div>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: insightsTemplates.length }).map((_, i) => (
            <div
              key={i+1}
              className={`bg-white min-h-[19rem] dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700
                 ${i+1 === 5 && 'col-span-2'}`}
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
    <div className="w-full bg-whitesmoke mt-6 max-w-7xl mx-auto py-8 sm:px-6 border border-dropdownBorder rounded-xl">
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
            className="bg-gradient-to-br from-purple-500 to-purple-600 flex gap-[8px] rounded-[7px] p-2 shadow-lg"
          >
            <Bot className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-[21px] font-bold text-gray-900 dark:text-white"> {sectionTitle} </h2>
            <p className="text-gray-600 -mt-[3px] text-[14px] dark:text-gray-400"> {sectionSubtitle} </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`${parentFetchError || error 
            ? 'flex justify-center items-center text-[13px] text-red-500 tracking-[0.5px]' 
            : cardStyles 
            ? cardStyles 
            : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`
          }
      >
        {
          !error && insights && insights.length > 0 && insights.map((insight, index) => {
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
                        ? `${insight.textColor?.replace("text-", "border-") || "border-gray-300"} shadow-xl`
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
                      className={`absolute inset-0 rounded-2xl border-2 ${insight?.textColor?.replace("text-", "border-")}`}
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

        {
          parentFetchError || error && 
            <p className="w-full text-[15px] text-red-500 text-center tracking-[0.4px]">
              {parentFetchError || error}
            </p>
        }

      </motion.div>

    </div>
  )
}
