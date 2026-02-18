import React, {useContext, useState, useEffect} from 'react'
import './componentsStyle.css'
import { motion, AnimatePresence } from "framer-motion"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar  
} from "recharts"

import { Tag, Percent, TrendingUp, TrendingDown, ArrowUp, Award, Clock, Users, ChevronUp, ChevronDown } from "lucide-react"

import apiClient from '../../../../Api/apiClient'

import {OperationsAnalyticsContext} from '../AdminDashboardPage'
import { useTogglerEnabled } from "../../../../Hooks/ToggleEnabler"
import ChartError from './ChartError'


export default function OffersInsightsSection() {

  const {dashboardQuery, showOperationsAnalytics, setShowOperationsAnalytics} = useContext(OperationsAnalyticsContext)

  const togglerEnabled = useTogglerEnabled(showOperationsAnalytics, 'offers')

  const [offerStats, setOfferStats] = useState([])
  const [orderedStats, setOrderedStats] = useState([])
  const [mostUsedOffersDatas, setMostUsedOffersDatas] = useState([])
  const [monthlyOffersStats, setMonthlyOffersStats] = useState([])
  const [offersByUserTypeStats, setOffersByUserTypeStats] = useState([])

  const [fetchChartData, setFetchChartData] = useState(true)
    
  const [status, setStatus] = useState({
      stats: "loading",
      mostUsedOffersDatas: "loading",
      monthlyOffersStats: "loading",
      offersByUserTypeStats: "loading",
  })

  const radarColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f", "#ff69b4"]

  const fetchAllStats = async () => {
      const newStats = []

      const [offerRevenueResponse, offerStatsResponse, topOffersResponse, monthlyOffersStatsRes, offersUserTypeRes] =
          await Promise.allSettled([
              apiClient.get(`/admin/dashboard/offers/revenue`),
              apiClient.get(`/admin/dashboard/offers/stats`),
              apiClient.get(`/admin/dashboard/offers/top`),
              apiClient.get(`/admin/dashboard/offers/monthly`),
              apiClient.get(`/admin/dashboard/offers/userGroup`),
          ])

      let statsError = false

      if (offerRevenueResponse.status === "fulfilled") {
          const response = offerRevenueResponse.value
          console.log("offerRevenueResponse----->", response.data) || response.data.changePercentage === "N/A"

          const changeValue =
              response.data.changePercentage && response.data.changePercentage !== "N/A"
                  ? (response.data.changePercentage > 0 ? "+" : "-") + " " + response.data.changePercentage + "%"
                  : "N/A"

          newStats.push({
              name: "offersRevenue",
              title: "Offer Revenue",
              value: "₹" + response.data.totalOfferRevenue,
              change: changeValue,
              trend: response.data.changePercentage > 0 || response.data.changePercentage === "N/A" ? "up" : "down",
              icon:
                  response.data.changePercentage > 0 || response.data.changePercentage === "N/A"
                      ? TrendingUp
                      : TrendingDown,
              color:
                  response.data.changePercentage > 0 || response.data.changePercentage === "N/A"
                      ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
          })
      } else {
          statsError = true
      }

      if (offerStatsResponse.status === "fulfilled") {
          const response = offerStatsResponse.value
          newStats.push(
              {
                  name: "activeOffers",
                  title: "Active Offers",
                  value: response.data.activeOffersCount,
                  icon: Tag,
                  color: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
              },
              {
                  name: "expiredOffers",
                  title: "Expired Offers This Month",
                  value: response.data.expiredOffers,
                  icon: Percent,
                  color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
              },
          )
      } else {
          statsError = true
      }

      if (statsError) {
          setStatus((status) => ({ ...status, stats: "error" }))
      } else {
          setStatus((status) => ({ ...status, stats: "success" }))
      }

      setOfferStats((prev) => {
          const existingNames = new Set(prev.map((stat) => stat.name))
          const filtered = newStats.filter((stat) => !existingNames.has(stat.name))
          return [...prev, ...filtered]
      })

      if (topOffersResponse.status === "fulfilled") {
          const response = topOffersResponse.value
          setMostUsedOffersDatas(response.data.mostUsedOffersData)
          setStatus((status) => ({ ...status, mostUsedOffersDatas: "success" }))
      } else {
          setStatus((status) => ({ ...status, mostUsedOffersDatas: "error" }))
      }

      if (monthlyOffersStatsRes.status === "fulfilled") {
          const response = monthlyOffersStatsRes.value
          setMonthlyOffersStats(response.data.monthOffersStats)
          setStatus((status) => ({ ...status, monthlyOffersStats: "success" }))
      } else {
          setStatus((status) => ({ ...status, monthlyOffersStats: "error" }))
      }

      if (offersUserTypeRes.status === "fulfilled") {
          const response = offersUserTypeRes.value
          setOffersByUserTypeStats(response.data.offersByUserGroups)
          setStatus((status) => ({ ...status, offersByUserTypeStats: "success" }))
      } else {
          setStatus((status) => ({ ...status, offersByUserTypeStats: "error" }))
      }
  }

    useEffect(() => {
      if (fetchChartData) {
          fetchAllStats()
          setFetchChartData(false)
      }
    }, [fetchChartData])
      
    const refreshCharts = () => {
        setStatus({
            stats: "loading",
            mostUsedOffersDatas: "loading",
            monthlyOffersStats: "loading",
            offersByUserTypeStats: "loading",
        })
        setFetchChartData(true)
    }
  
    useEffect(()=> {
      const priorityOrder = ['offersRevenue', 'activeOffers', 'expiredOffers']

      const orderedStats = offerStats.sort(
        (a, b)=> priorityOrder.indexOf(a.name) - priorityOrder.indexOf(b.name)
      )
      setOrderedStats(orderedStats)
    },[offerStats])
  
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-6"
    >

      <h2 className="text-xl text-secondary font-bold flex items-center gap-[10px]">
        <span className={`w-fit whitespace-nowrap ${!showOperationsAnalytics.offers && 'text-muted'}`}> Offers Usage </span>
        <div className={`w-full flex items-center justify-between gap-[10px] rounded-[4px] cursor-pointer`}
            onClick={()=> togglerEnabled && setShowOperationsAnalytics(status=> ({...status, offers: !status.offers}))}>
          <hr className={`mt-[2px] w-full h-[2px] border-t border-inputBorderSecondary border-dashed shadow-sm
              ${!showOperationsAnalytics.offers && 'border-muted'}`}/>
          {
            showOperationsAnalytics.offers ?
            <ChevronUp className={`p-[2px] w-[18px] h-[18px] text-muted border border-secondary rounded-[3px]
             hover:border-purple-800 hover:text-secondary hover:bg-inputBorderSecondary hover:transition
              hover:duration-150 hover:delay-75 hover:ease-in ${!togglerEnabled && 'cursor-not-allowed'} `}/>
            :<ChevronDown className={`p-[2px] w-[18px] h-[18px] text-muted border border-secondary rounded-[3px]
             hover:border-purple-800 hover:text-secondary hover:bg-inputBorderSecondary hover:transition
              hover:duration-150 hover:delay-75 hover:ease-in  ${!togglerEnabled && 'cursor-not-allowed'} `}/>
          }
        </div>
      </h2>

      <AnimatePresence>
        {
          showOperationsAnalytics.offers &&
          <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} 
            exit={{opacity: 0, transition: { duration: 0.5, ease: "easeInOut" }}} transition={{type: 'spring', delay:0.2}}
              className="flex flex-col gap-[1.3rem]">

            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4
                ${status.stats === "error" ? "h-[6.5rem] bg-white rounded-lg shadow-sm border" : ""}`}>
              {
               status.stats === 'success' ?
                orderedStats.map((stat, index)=> (
                 <motion.div
                   key={stat.title}
                   className={`flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border
                      ${index === 0 && 'border-primary'}`}
                 >
                   <div className="flex items-center">
                     <div className={`p-3 rounded-full ${stat.color} mr-4`}>
                       <stat.icon size={17} />
                     </div>
                     <div>
                       <p className="text-[13px] text-gray-500 dark:text-gray-400">{stat.title}</p>
                       <h3 className="text-[20px] font-bold mt-1">{stat.value}</h3>
                       {stat.change && (
                         <div className="flex items-center mt-1">
                           <span className="flex items-center text-[12px] text-green-500">
                             <ArrowUp size={14} />
                             {stat.change}
                           </span>
                           <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs yesterday</span>
                         </div>
                       )}
                     </div>
                   </div>
                 </motion.div>
                ))
              : status.stats === 'loading' ?
                [...Array(3)].map((_, index)=> (
                  <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    key={index}
                    className={`skeleton-loader flex items-center bg-white dark:bg-gray-800 p-4
                       rounded-lg shadow-sm border ${index === 0 && 'border-primary'}`}
                  >
                    <div className="flex items-center">
                        <div className="mr-4 p-3 rounded-full skeleton-loader">
                          <div className="w-[17px] h-[17px]" />
                        </div>  
                        <div className="space-y-2">
                          <div className="h-[13px] w-24 skeleton-loader rounded" /> 
                          <div className="h-[25px] w-16 skeleton-loader rounded" /> 
                          <div className="flex items-center gap-2">
                            <div className="h-[12px] w-[32px] skeleton-loader rounded" />
                          </div>
                        </div>
                    </div>
                  </motion.div>
                  </AnimatePresence>
                ))
              :
                <div className="w-full h-full col-span-3">
                    <ChartError refreshCharts={refreshCharts}/> 
                </div>
            }
            </div>

            <motion.div {...fadeInUp} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border
                 ${dashboardQuery.trim() && !"Most Used Offers".toLowerCase().trim().includes(dashboardQuery.trim()) ? "hidden" : "inline-block"}`}>
                <h3 className="text-[17px] font-semibold mb-6">Most Used Offers</h3>
                <div className={`${status.mostUsedOffersDatas !== "error" ? "h-80" : "h-40"} relative`}>
                  {
                    status.mostUsedOffersDatas !== 'loading' ?
                        <ResponsiveContainer width="100%" height="100%">
                            {
                                status.mostUsedOffersDatas !== 'error' && mostUsedOffersDatas.length > 0 ?
                                    <BarChart
                                      data={mostUsedOffersDatas}
                                      margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                      }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                      <XAxis dataKey="name" tick={{fontSize: 13}}/>
                                      <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" tick={{fontSize: 13}}/>
                                      <YAxis yAxisId="right" orientation="right" stroke="#f1c40f" tick={{fontSize: 13}}/>
                                      <Tooltip
                                        contentStyle={{
                                          fontSize: '13px',
                                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                                          borderRadius: "6px",
                                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                          border: "none",
                                        }}
                                      />
                                      <Legend formatter={(value, entry, index)=> (
                                            <span style={{ fontSize: '13px', color: '#333' }}>{value}</span>
                                        )}/>
                                      <Bar yAxisId="left" dataKey="count" name="Usage Count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                      <Bar yAxisId="right" dataKey="percentage" name="% of Total" fill="#d7f148" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                :   status.mostUsedOffersDatas !== 'error' && mostUsedOffersDatas.length === 0 ?
                                        <p className='absolute -top-[10.5rem] sm:top-0 w-full h-full flex items-center 
                                              justify-center text-muted text-[13px] sm:text-[16px] font-medium tracking-[0.3px]'>
                                           No offers available! 
                                        </p>
                                :
                                    <ChartError refreshCharts={refreshCharts} />
                            }
                        </ResponsiveContainer>
                  : 
                    <div className="w-full h-full skeleton-loader"/>
                  }
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <motion.div {...fadeInUp} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border
                    ${dashboardQuery.trim() && !"Expired vs Active Offers Performance".toLowerCase().trim().includes(dashboardQuery.trim()) 
                        ? "hidden" 
                        : "inline-block"}
                    `}
                >
                  <h3 className="text-[17px] font-semibold mb-6">Expired vs Active Offers Performance</h3>
                  <div className={`${status.monthlyOffersStats !== "error" ? "h-80" : "h-40"} relative`}>
                    {
                      status.monthlyOffersStats !== 'loading' ?
                        <ResponsiveContainer width="100%" height="100%">
                            {
                                status.monthlyOffersStats !== 'error' ?
                                    <AreaChart
                                      data={monthlyOffersStats}
                                      margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                      }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                      <XAxis dataKey="name" tick={{fontSize: 13}}/>
                                      <YAxis tickFormatter={(value) => `₹${value / 1000}k`} tick={{fontSize: 13}}/>
                                      <Tooltip
                                        formatter={(value) => [`₹${value.toLocaleString()}`, ""]}
                                        contentStyle={{
                                          fontSize: '13px',
                                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                                          borderRadius: "6px",
                                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                          border: "none",
                                        }}
                                      />
                                      <Legend  formatter={(value, entry, index)=> (
                                          <span style={{ fontSize: '13px', color: '#333' }}>{value}</span>
                                      )}/>
                                      <Area
                                        type="monotone"
                                        dataKey="active"
                                        name="Active Offers"
                                        stroke="#10b981"
                                        fill="#10b981"
                                        fillOpacity={0.6}
                                        strokeWidth={2}
                                      />
                                      <Area
                                        type="monotone"
                                        dataKey="expired"
                                        name="Expired Offers"
                                        stroke="#f59e0b"
                                        fill="#f59e0b"
                                        fillOpacity={0.6}
                                        strokeWidth={2}
                                      />
                                    </AreaChart>
                                :
                                    <ChartError refreshCharts={refreshCharts} />

                            }
                            {
                              status.monthlyOffersStats !== 'error' && monthlyOffersStats && 
                              ( monthlyOffersStats.length === 0 || monthlyOffersStats.every(data=> 
                                data.active === 0 && data.expired === 0
                              ) ) &&
                                  <p className='absolute -top-[10.5rem] sm:top-0 w-full h-full flex items-center 
                                        justify-center text-muted  text-[13px] sm:text-[16px] font-medium tracking-[0.3px]'>
                                     No datas to show! 
                                  </p>
                            }
                        </ResponsiveContainer>
                    : 
                        <div className="w-full h-full skeleton-loader"/>
                    }
                  </div>
                </motion.div>

                <motion.div {...fadeInUp} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border
                    ${dashboardQuery.trim() && !"Offer Usage by User Type".toLowerCase().trim().includes(dashboardQuery.trim()) ? "hidden" : "inline-block"}`}>
                  <h3 className="text-[17px] font-semibold mb-6">Offer Usage by User Type</h3>
                  <div className={`${status.offersByUserTypeStats !== "error" ? "h-80" : "h-40"} relative`}>
                    {
                      status.offersByUserTypeStats !== 'loading' ?
                        <ResponsiveContainer width="100%" height="100%">
                          {
                            status.offersByUserTypeStats !== 'error' && offersByUserTypeStats.length > 0 ?
                                <RadarChart outerRadius={90} data={offersByUserTypeStats}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="type" tick={{ fontSize: 14 }}/>
                                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 13 }}/>
                                    {
                                      offersByUserTypeStats.length > 0 && Object.keys(offersByUserTypeStats[0])
                                        .filter(key=> key !== "type")
                                        .map((offerName, index) => (
                                          <Radar key={offerName} name={offerName} dataKey={offerName} fillOpacity={0.4}
                                            stroke={radarColors[index % radarColors.length]} fill={radarColors[index % radarColors.length]}
                                          />
                                        ))
                                    }
                                    <Legend formatter={(value) => (
                                          <span style={{ fontSize: '13px', color: '#374151' }}>{value}</span>
                                        )}
                                    />

                                    <Tooltip
                                      contentStyle={{
                                        fontSize: '13px',
                                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                                        borderRadius: "6px",
                                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                        border: "none",
                                      }}
                                    />
                                </RadarChart>
                            : status.offersByUserTypeStats !== 'error' && offersByUserTypeStats.length === 0 ?
                                <p className='absolute top-0 w-full h-full flex items-center 
                                        justify-center text-muted text-[16px] font-medium tracking-[0.3px]'>
                                     No offers available! 
                                </p>  
                            :
                                <ChartError refreshCharts={refreshCharts} />
                          }
                        </ResponsiveContainer>
                    : 
                        <div className="w-full h-full skeleton-loader"/>
                    }
                  </div>
                </motion.div>

            </div>

          </motion.div>
        }
      </AnimatePresence>

    </motion.section>
  )
}
