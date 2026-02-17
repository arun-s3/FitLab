import React, {useContext, useState, useEffect} from 'react'
import './componentsStyle.css'
import { motion, AnimatePresence } from "framer-motion"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { Tag, Percent, TrendingUp, ArrowUp, ChevronUp, ChevronDown, TrendingDown } from "lucide-react"
import axios from 'axios'

import {OperationsAnalyticsContext} from '../AdminDashboardPage'
import {useTogglerEnabled} from "../../../../Hooks/ToggleEnabler"
import ChartError from './ChartError'


export default function CouponsOffersInsightsSection() {

  const {dashboardQuery, showOperationsAnalytics, setShowOperationsAnalytics} = useContext(OperationsAnalyticsContext)

  const togglerEnabled = useTogglerEnabled(showOperationsAnalytics, 'coupons')

  const [couponStats, setCouponStats] = useState([])
  const [orderedStats, setOrderedStats] = useState([])
  const [couponRedemptionsDatas, setCouponRedemptionsDatas] = useState([])
  const [discountImpactDatas, setDiscountImpactDatas] = useState([])

  const [fetchChartData, setFetchChartData] = useState(true)
  
  const [status, setStatus] = useState({
      stats: "loading",
      couponRedemptionsDatas: "loading",
      discountImpactDatas: "loading",
  })

  const fetchAllStats = async () => {
      const newStats = []

      const [couponRevenueResponse, couponStatsResponse, couponRedemptionRes, discountImpactRes] =
          await Promise.allSettled([
              axios.get(`/admin/dashboard/coupons/revenue`, { withCredentials: true }),
              axios.get(`/admin/dashboard/coupons/stats`, { withCredentials: true }),
              axios.get(`/admin/dashboard/coupons/redemptions`, { withCredentials: true }),
              axios.get(`/admin/dashboard/coupons/impact`, { withCredentials: true }),
          ])

      let statsError = false

      if (couponRevenueResponse.status === "fulfilled") {
          const response = couponRevenueResponse.value
          console.log("couponRevenueResponse----->", response.data) || response.data.changePercentage === "N/A"

          const changeValue =
              response.data.changePercentage && response.data.changePercentage !== "N/A"
                  ? (response.data.changePercentage > 0 ? "+" : "-") + " " + response.data.changePercentage + "%"
                  : "N/A"

          newStats.push({
              name: "couponDiscountRevenue",
              title: "Coupon Discount Revenue",
              value: "₹" + response.data.totalCouponRevenue,
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

      if (couponStatsResponse.status === "fulfilled") {
          const response = couponStatsResponse.value
          newStats.push(
              {
                  name: "activeCoupons",
                  title: "Active Coupons",
                  value: response.data.activeCouponCount,
                  icon: Tag,
                  color: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
              },
              {
                  name: "couponRedemptions",
                  title: "Coupon Redemptions",
                  value: response.data.couponRedemptions,
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

      setCouponStats((prev) => {
          const existingNames = new Set(prev.map((stat) => stat.name))
          const filtered = newStats.filter((stat) => !existingNames.has(stat.name))
          return [...prev, ...filtered]
      })

      if (couponRedemptionRes.status === "fulfilled") {
          const response = couponRedemptionRes.value
          setCouponRedemptionsDatas(response.data)
          setStatus((status) => ({ ...status, couponRedemptionsDatas: "success" }))
      } else {
          setStatus((status) => ({ ...status, couponRedemptionsDatas: "error" }))
      }

      if (discountImpactRes.status === "fulfilled") {
          const response = discountImpactRes.value
          setDiscountImpactDatas(response.data)
          setStatus((status) => ({ ...status, discountImpactDatas: "success" }))
      } else {
          setStatus((status) => ({ ...status, discountImpactDatas: "error" }))
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
            ordersOverTime: "loading",
            mostPurchasedProducts: "loading",
            orderStatusDistribution: "loading",
        })
        setFetchChartData(true)
    }
    useEffect(()=> {
      const priorityOrder = ['couponDiscountRevenue', 'activeCoupons', 'couponRedemptions']
  
      const orderedStats = couponStats.sort(
        (a, b)=> priorityOrder.indexOf(a.name) - priorityOrder.indexOf(b.name)
      )
      setOrderedStats(orderedStats)
    },[couponStats])

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
        <span className={`w-fit whitespace-nowrap ${!showOperationsAnalytics.coupons && 'text-muted'}`}> Coupon Usage </span>
        <div className={`w-full flex items-center justify-between gap-[10px] rounded-[4px] cursor-pointer`}
            onClick={()=> togglerEnabled && setShowOperationsAnalytics(status=> ({...status, coupons: !status.coupons}))}>
          <hr className={`mt-[2px] w-full h-[2px] border-t border-inputBorderSecondary border-dashed shadow-sm
              ${!showOperationsAnalytics.coupons && 'border-muted'}`}/>
          {
            showOperationsAnalytics.coupons ?
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
          showOperationsAnalytics.coupons &&
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border
                     ${index === 0 && 'border-primary'}`}
                >
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full ${stat?.color} mr-4`}>
                      <stat.icon size={17} />
                    </div>
                    <div>
                      <p className="text-[13px] text-gray-500 dark:text-gray-400">{stat?.title}</p>
                      <h3 className="text-[20px] font-bold mt-1">{stat?.value}</h3>
                      {stat.change && (
                        <div className="flex items-center mt-1">
                          <span className="flex items-center text-[12px] text-green-500">
                            <ArrowUp size={14} />
                            {stat?.change}
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
                    className={`flex items-center bg-white dark:bg-gray-800 p-4
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
                ${dashboardQuery.trim() && !"Coupon Redemptions".toLowerCase().trim().includes(dashboardQuery.trim()) ? "hidden" : "inline-block"}`}>
              <h3 className="text-[17px] font-semibold mb-6">Coupon Redemptions</h3>
              <div className={`${status.couponRedemptionsDatas !== "error" ? "h-80" : "h-40"} relative`}>
                {
                  status.couponRedemptionsDatas !== 'loading' ?
                    <ResponsiveContainer width="100%" height="100%">
                        {
                            status.couponRedemptionsDatas !== 'error' ?
                                <BarChart
                                    data={couponRedemptionsDatas}
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
                                    <YAxis yAxisId="right" orientation="right" stroke="#6366f1" tick={{fontSize: 13}}/>
                                    <Tooltip
                                      contentStyle={{
                                        fontSize: '13px',
                                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                                        borderRadius: "6px",
                                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                        border: "none",
                                      }}
                                    />
                                    {
                                      status.couponRedemptionsDatas !== 'error' && couponRedemptionsDatas && 
                                      !couponRedemptionsDatas.every(data=> data.redemptions === 0) &&
                                          <Legend  formatter={(value, entry, index)=> (
                                              <span style={{ fontSize: '13px', color: '#333' }}>{value}</span>
                                    )}     />
                                    }
                                    <Bar yAxisId="left" dataKey="redemptions" name="Redemptions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                    <Bar yAxisId="right" dataKey="revenue" name="Revenue (₹)" fill="#d7f148" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            :
                                <ChartError refreshCharts={refreshCharts} />
                        }
                        {
                          status.couponRedemptionsDatas !== 'error' && couponRedemptionsDatas && 
                          ( couponRedemptionsDatas.length === 0 || couponRedemptionsDatas.every(data=> data.redemptions === 0) ) &&
                              <p className='absolute -top-[10.5rem] sm:top-0 w-full h-full flex items-center 
                                    justify-center text-muted text-[13px] sm:text-[16px] font-medium tracking-[0.3px]'>
                                 No coupons redeemed! 
                              </p>
                        }
                    </ResponsiveContainer>
                : 
                    <div className="w-full h-full skeleton-loader"/>
                }
              </div>
            </motion.div>

            <motion.div {...fadeInUp} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border
                ${dashboardQuery.trim() && !"Discount Impact on Sales".toLowerCase().trim().includes(dashboardQuery.trim()) ? "hidden" : "inline-block"}`}>
              <h3 className="text-[17px] font-semibold mb-6">Discount Impact on Sales</h3>
              <div className={`${status.discountImpactDatas !== "error" ? "h-80" : "h-40"} relative`}>
                {
                  status.discountImpactDatas !== 'loading' ?
                    <ResponsiveContainer width="100%" height="100%">
                        {
                            status.discountImpactDatas !== 'error' ?
                                <LineChart
                                  data={discountImpactDatas}
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
                                    formatter={(value)=> [`₹${value.toLocaleString()}`, ""]}
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
                                  <ReferenceLine y={0} stroke="#000" />
                                  <Line
                                    type="monotone"
                                    dataKey="withDiscount"
                                    name="With Discount"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="withoutDiscount"
                                    name="Without Discount"
                                    stroke="#f59e0b"
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                  />
                                </LineChart>
                            :
                                <ChartError refreshCharts={refreshCharts} />
                        }
                        {
                          status.discountImpactDatas !== 'error' && discountImpactDatas && 
                          ( discountImpactDatas.length === 0 || discountImpactDatas.every(data=> 
                            data.withDiscount === 0 && data.withoutDiscount === 0
                          ) ) &&
                              <p className='absolute -top-[10.5rem] sm:top-0 w-full h-full flex items-center 
                                    justify-center text-muted  text-[13px] sm:text-[16px] font-medium tracking-[0.3px]'>
                                 No impact of discounts on sales! 
                              </p>
                        }
                    </ResponsiveContainer>
                : 
                    <div className="w-full h-full skeleton-loader"/>
                }
              </div>
            </motion.div>

          </motion.div>
        }
      </AnimatePresence>

    </motion.section>
  )
}
