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
import axios from 'axios'

import {OperationsAnalyticsContext} from '../AdminDashboardPage'
import { useTogglerEnabled } from "../../../../Hooks/ToggleEnabler"



export default function OffersInsightsSection() {

  const {dateRange, showOperationsAnalytics, setShowOperationsAnalytics} = useContext(OperationsAnalyticsContext)

  const togglerEnabled = useTogglerEnabled(showOperationsAnalytics, 'offers')

  const [offerStats, setOfferStats] = useState([])
  const [orderedStats, setOrderedStats] = useState([])
  const [mostUsedOffersDatas, setMostUsedOffersDatas] = useState([])
  const [monthlyOffersStats, setMonthlyOffersStats] = useState([])
  const [offersByUserTypeStats, setOffersByUserTypeStats] = useState([])

  const radarColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f", "#ff69b4"]


  useEffect(()=> {
            const fetchAllStats = async ()=> {
              const newStats = []
                
              const [offerRevenueResponse, offerStatsResponse, topOffersResponse, monthlyOffersStatsRes, offersUserTypeRes] = 
                await Promise.allSettled([ 
                  axios.get('http://localhost:3000/admin/dashboard/offers/revenue', { withCredentials: true }), 
                  axios.get('http://localhost:3000/admin/dashboard/offers/stats', { withCredentials: true }), 
                  axios.get('http://localhost:3000/admin/dashboard/offers/top', { withCredentials: true }),
                  axios.get('http://localhost:3000/admin/dashboard/offers/monthly', { withCredentials: true }),
                  axios.get('http://localhost:3000/admin/dashboard/offers/userGroup', { withCredentials: true })
                ])
              
              if (offerRevenueResponse.status === 'fulfilled'){
                const response = offerRevenueResponse.value
                console.log("offerRevenueResponse----->", response.data)
                || response.data.changePercentage === 'N/A'
  
                const changeValue = response.data.changePercentage && response.data.changePercentage !== 'N/A' ? 
                                        (response.data.changePercentage > 0  ? "+" : "-") + " " + response.data.changePercentage + '%'
                                          : 'N/A'
      
                newStats.push({
                  name: "offersRevenue",
                  title: "Offer Revenue",
                  value: "₹" + response.data.totalOfferRevenue ,
                  change: changeValue,
                  trend: response.data.changePercentage > 0 || response.data.changePercentage === 'N/A' ? 'up' : 'down',
                  icon: response.data.changePercentage > 0 || response.data.changePercentage === 'N/A' ? TrendingUp : TrendingDown,
                  color: response.data.changePercentage > 0 || response.data.changePercentage === 'N/A' 
                          ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                })
                console.log('newStats----->', newStats)
      
              }
              else{
                console.log("Error in Coupon Revenue:", couponRevenueResponse.reason.message)
              }
  
              if (offerStatsResponse.status === 'fulfilled'){
                const response = offerStatsResponse.value
                console.log("offerStatsResponse----->", response.data)
  
                newStats.push({
                  name: "activeOffers",
                  title: "Active Offers",
                  value: response.data.activeOffersCount,
                  icon: Tag,
                  color: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                },
                {
                  name: "expiredOffers",
                  title: "Expired Offers This Month",
                  value: response.data.expiredOffers,
                  icon: Percent,
                  color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
                })
                console.log('newStats now----->', newStats)
              }else{
                console.log("Error in Offer Stats:", offerStatsResponse.reason.message)
              }
  
              setOfferStats(prev=> {
                const existingNames = new Set(prev.map(stat => stat.name))
                const filtered = newStats.filter(stat => !existingNames.has(stat.name))
                return [...prev, ...filtered]
              })
  
              if (topOffersResponse.status === 'fulfilled'){
                const response = topOffersResponse.value
                console.log("mostUsedOffersDatas----->", response.data.mostUsedOffersData) 
                setMostUsedOffersDatas(response.data.mostUsedOffersData)
              }
              else{
                console.log("Error in user top Offers response:", topOffersResponse.reason.message)
              }

              if (monthlyOffersStatsRes.status === 'fulfilled'){
                const response = monthlyOffersStatsRes.value
                console.log("monthlyOffersStatsRes response----->", response.data.monthOffersStats) 
                setMonthlyOffersStats(response.data.monthOffersStats)
              }
              else{
                console.log("Error in user top Offers response:", monthlyOffersStatsRes.reason.message)
              }
              
              if (offersUserTypeRes.status === 'fulfilled'){
                const response = offersUserTypeRes.value
                console.log("offersUserTypeRes response----->", response.data.offersByUserGroups) 
                setOffersByUserTypeStats(response.data.offersByUserGroups)
                // setOffersByUserTypeStats([{ type: 'All Users', GET20: 0, GET15: 0, get25: 400 }, { type: 'Returning Users', GET20: 500, GET15: 0, get25: 7 }])
              }
              else{
                console.log("Error in user top Offers response:", offersUserTypeRes.reason.message)
              }
            }
    
            fetchAllStats();
        }, [])
  
      useEffect(()=> {
        console.log("offerStats--->", offerStats)
        const priorityOrder = ['offersRevenue', 'activeOffers', 'expiredOffers']
    
        const orderedStats = offerStats.sort(
          (a, b)=> priorityOrder.indexOf(a.name) - priorityOrder.indexOf(b.name)
        )
        setOrderedStats(orderedStats)
      },[offerStats])
  
      useEffect(()=> {
        console.log("orderedStats--->", orderedStats)
        console.log("mostUsedOffersDatas--->", mostUsedOffersDatas)
      },[orderedStats, mostUsedOffersDatas])
  


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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {
               orderedStats && orderedStats.length > 0 ?
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
              :
                [...Array(3)].map((_, index)=> (
                  <AnimatePresence>
                  <div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    key={index}
                    className={`skeleton-loader flex items-center bg-white dark:bg-gray-800 p-4
                       rounded-lg shadow-sm border ${index === 0 && 'border-primary'}`}
                  >
                    <div className="flex items-center">
                    <div className='invisible w-[17px] h-[17px] p-3 rounded-full mr-4'>
                      Insight Icon
                    </div>
                    <div>
                      <p className="invisible text-[13px] text-gray-500 dark:text-gray-400"> Insight Icon </p>
                      <h3 className="invisible text-[20px] font-bold mt-1">  Insight Value </h3>
                        <div className="flex items-center mt-1">
                          <span className="invisible w-[14px] h-[14px] flex items-center text-[12px] text-green-500">
                            Insight Change
                          </span>
                          <span className="invisible text-xs text-gray-500 dark:text-gray-400 ml-1">vs yesterday</span>
                        </div>
                    </div>
                  </div>
                  </div>
                  </AnimatePresence>
                ))
            }
            </div>

            <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
                <h3 className="text-[17px] font-semibold mb-6">Most Used Offers</h3>
                <div className="h-80">
                  {
                    mostUsedOffersDatas && mostUsedOffersDatas.length > 0 ?
                    <ResponsiveContainer width="100%" height="100%">
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
                  </ResponsiveContainer>
                  : <div className="w-full h-full skeleton-loader"/>
                  }
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
                  <h3 className="text-[17px] font-semibold mb-6">Expired vs Active Offers Performance</h3>
                  <div className="h-80">
                    {
                      monthlyOffersStats && monthlyOffersStats.length > 0 ?
                      <ResponsiveContainer width="100%" height="100%">
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
                    </ResponsiveContainer>
                    : <div className="w-full h-full skeleton-loader"/>
                    }
                  </div>
                </motion.div>

                <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
                  <h3 className="text-[17px] font-semibold mb-6">Offer Usage by User Type</h3>
                  <div className="h-80">
                    {
                      offersByUserTypeStats && offersByUserTypeStats.length > 0 ?
                      offersByUserTypeStats.length > 1 ?
                      <ResponsiveContainer width="100%" height="100%">
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
                    </ResponsiveContainer>
                    : <p className='w-full h-full flex justify-center items-center text-[14px] text-muted tracking-[0.3px]'> 
                        Not enough data to display the graph!
                      </p>
                    : <div className="w-full h-full skeleton-loader"/>
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
