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



export default function CouponsOffersInsightsSection() {

  const {dateRange, showOperationsAnalytics, setShowOperationsAnalytics} = useContext(OperationsAnalyticsContext)

  const togglerEnabled = useTogglerEnabled(showOperationsAnalytics, 'coupons')

  const [couponStats, setCouponStats] = useState([])
  const [orderedStats, setOrderedStats] = useState([])
  const [couponRedemptionsDatas, setCouponRedemptionsDatas] = useState([])
  const [discountImpactDatas, setDiscountImpactDatas] = useState([])

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
          const fetchAllStats = async ()=> {
            const newStats = []
              
            const [couponRevenueResponse, couponStatsResponse, couponRedemptionRes, discountImpactRes] = await Promise.allSettled([ 
              axios.get(`${baseApiUrl}/admin/dashboard/coupons/revenue`, { withCredentials: true }), 
              axios.get(`${baseApiUrl}/admin/dashboard/coupons/stats`, { withCredentials: true }),
              axios.get(`${baseApiUrl}/admin/dashboard/coupons/redemptions`, { withCredentials: true }),
              axios.get(`${baseApiUrl}/admin/dashboard/coupons/impact`, { withCredentials: true })
            ])
            
            if (couponRevenueResponse.status === 'fulfilled'){
              const response = couponRevenueResponse.value
              console.log("couponRevenueResponse----->", response.data)
              || response.data.changePercentage === 'N/A'

              const changeValue = response.data.changePercentage && response.data.changePercentage !== 'N/A' ? 
                                      (response.data.changePercentage > 0  ? "+" : "-") + " " + response.data.changePercentage + '%'
                                        : 'N/A'
    
              newStats.push({
                name: "couponDiscountRevenue",
                title: "Coupon Discount Revenue",
                value: "₹" + response.data.totalCouponRevenue ,
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

            if (couponStatsResponse.status === 'fulfilled'){
              const response = couponStatsResponse.value
              console.log("couponStatsResponse----->", response.data)

              newStats.push({
                name: "activeCoupons",
                title: "Active Coupons",
                value: response.data.activeCouponCount,
                icon: Tag,
                color: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
              },
              {
                name: "couponRedemptions",
                title: "Coupon Redemptions",
                value: response.data.couponRedemptions,
                icon: Percent,
                color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
              })
              console.log('newStats now----->', newStats)
            }else{
              console.log("Error in Coupon Stats:", couponStatsResponse.reason.message)
            }

            setCouponStats(prev=> {
              const existingNames = new Set(prev.map(stat => stat.name))
              const filtered = newStats.filter(stat => !existingNames.has(stat.name))
              return [...prev, ...filtered]
            })

            if (couponRedemptionRes.status === 'fulfilled'){
              const response = couponRedemptionRes.value
              console.log("couponRedemptionRes----->", couponRedemptionRes)
              console.log("couponRedemptionRes response----->", response.data) 
              setCouponRedemptionsDatas(response.data)
            }
            else{
              console.log("Error in user coupon redemption response:", couponRedemptionRes.reason.message)
            }

            if (discountImpactRes.status === 'fulfilled'){
              const response = discountImpactRes.value
              console.log("discountImpactRes----->", discountImpactRes)
              console.log("discountImpactRes response----->", response.data) 
              setDiscountImpactDatas(response.data)
            }
            else{
              console.log("Error in user coupon redemption response:", discountImpactRes.reason.message)
            }
          }
  
          fetchAllStats();
      }, [])

    useEffect(()=> {
      console.log("couponStats--->", couponStats)
      const priorityOrder = ['couponDiscountRevenue', 'activeCoupons', 'couponRedemptions']
  
      const orderedStats = couponStats.sort(
        (a, b)=> priorityOrder.indexOf(a.name) - priorityOrder.indexOf(b.name)
      )
      setOrderedStats(orderedStats)
    },[couponStats])

    useEffect(()=> {
      console.log("orderedStats--->", orderedStats)
    },[orderedStats])



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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {
                orderedStats && orderedStats.length > 0 ?
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
              <h3 className="text-[17px] font-semibold mb-6">Coupon Redemptions</h3>
              <div className="h-80">
                {
                  couponRedemptionsDatas && couponRedemptionsDatas.length > 0 ?
                  <ResponsiveContainer width="100%" height="100%">
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
                    <Legend  formatter={(value, entry, index)=> (
                        <span style={{ fontSize: '13px', color: '#333' }}>{value}</span>
                    )}/>
                    <Bar yAxisId="left" dataKey="redemptions" name="Redemptions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="revenue" name="Revenue (₹)" fill="#d7f148" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                : <div className="w-full h-full skeleton-loader"/>
                }
              </div>
            </motion.div>

            <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <h3 className="text-[17px] font-semibold mb-6">Discount Impact on Sales</h3>
              <div className="h-80">
                {
                  discountImpactDatas && discountImpactDatas.length > 0 ?
                  <ResponsiveContainer width="100%" height="100%">
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
                </ResponsiveContainer>
                : <div className="w-full h-full skeleton-loader"/>
                }
              </div>
            </motion.div>

          </motion.div>
        }
      </AnimatePresence>

    </motion.section>
  )
}
