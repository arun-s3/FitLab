import React, {useState, useEffect, useContext} from 'react'
import './componentsStyle.css'
import { motion, AnimatePresence } from "framer-motion"

import {BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer} from "recharts"
import { Package, Clock, CheckCircle, ChevronDown, ChevronUp } from "lucide-react"
import axios from 'axios'

import {BusinessAnalyticsContext} from '.././AdminDashboardPage'
import { useTogglerEnabled } from "../../../../Hooks/ToggleEnabler"
import ChartError from './ChartError'


export default function OrdersFulfillmentSection() {

  const {dashboardQuery, showBusinessAnalytics, setShowBusinessAnalytics} = useContext(BusinessAnalyticsContext)

  const togglerEnabled = useTogglerEnabled(showBusinessAnalytics, 'orders')

  const [stats, setStats] = useState([])
  const [ordersOverTimeStats, setOrdersOverTimeStats] = useState([])
  const [topProductDatas, setTopProductDatas] = useState([])
  const [orderStatusDistribution, setOrderStatusDistribution] = useState([])

  const [fetchChartData, setFetchChartData] = useState(true)

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  const [status, setStatus] = useState({
      stats: "loading",
      ordersOverTime: "loading",
      mostPurchasedProducts: "loading",
      orderStatusDistribution: "loading",
  })

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  const fetchAllStats = async () => {
      const newStats = []

      const [orderStatsResponse, ordersOverTimeResponse, topProductsResponse, orderStatusPercentRes] =
          await Promise.allSettled([
              axios.get(`${baseApiUrl}/admin/dashboard/orders/stats`, { withCredentials: true }),
              axios.get(`${baseApiUrl}/admin/dashboard/orders/stats/monthly`, { withCredentials: true }),
              axios.get(`${baseApiUrl}/admin/dashboard/products/top`, { withCredentials: true }),
              axios.get(`${baseApiUrl}/admin/dashboard/orders/status-percent`, { withCredentials: true }),
          ])

      if (orderStatsResponse.status === "fulfilled") {
          const response = orderStatsResponse.value
          console.log("ORDER response.data.stats----->", response.data.stats)

          newStats.push(
              {
                  name: "totalOrders",
                  title: "Total Orders",
                  value: response.data.stats.total,
                  icon: Package,
                  color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
              },
              {
                  name: "pendingOrders",
                  title: "Pending Orders",
                  value: response.data.stats.pending,
                  icon: Clock,
                  color: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
              },
              {
                  name: "fulfillmentRate",
                  title: "Fulfillment Rate",
                  value: response.data.stats.pending + " " + "%",
                  icon: CheckCircle,
                  color: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
              },
          )
          console.log("newStats----->", newStats)

          setStats(newStats)
          setStatus((status) => ({ ...status, stats: "success" }))
      } else {
          console.log("Error in total revenue:", orderStatsResponse.reason.message)
          setStatus((status) => ({ ...status, stats: "error" }))
      }

      if (ordersOverTimeResponse.status === "fulfilled") {
          const response = ordersOverTimeResponse.value
          console.log("ordersOverTimeResponse response----->", response.data.ordersOverTime)
          setOrdersOverTimeStats(response.data.ordersOverTime)
          setStatus((status) => ({ ...status, ordersOverTime: "success" }))
      } else {
          console.log("Error in orders over time:", ordersOverTimeResponse.reason.message)
          setStatus((status) => ({ ...status, ordersOverTime: "error" }))
      }

      if (topProductsResponse.status === "fulfilled") {
          const response = topProductsResponse.value
          console.log("ordersOverTimeResponse response----->", response.data.topProductDatas)
          setTopProductDatas(response.data.topProductDatas)
          setStatus((status) => ({ ...status, mostPurchasedProducts: "success" }))
      } else {
          console.log("Error in orders over time:", topProductsResponse.reason.message)
          setStatus((status) => ({ ...status, mostPurchasedProducts: "error" }))
      }

      if (orderStatusPercentRes.status === "fulfilled") {
          const response = orderStatusPercentRes.value
          console.log("orderStatusPercentRes response----->", response.data.orderStatusDistribution)
          const statusColors = [
              { name: "Delivered", color: "#10b981" },
              { name: "Pending", color: "#f59e0b" },
              { name: "Cancelled", color: "#ef4444" },
              { name: "Shipped", color: "#d7f148" },
              { name: "Refunded", color: "#00e6d4" },
          ]
          const colorMappedStatus = response.data.orderStatusDistribution.map((status) => {
              const color = statusColors.find((statusColor) => statusColor.name === status.name).color
              return { ...status, color }
          })
          console.log("colorMappedStatus--->", colorMappedStatus)
          setOrderStatusDistribution(colorMappedStatus)
          setStatus((status) => ({ ...status, orderStatusDistribution: "success" }))
      } else {
          console.log("Error in orders over time:", orderStatusPercentRes.reason.message)
          setStatus((status) => ({ ...status, orderStatusDistribution: "error" }))
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



  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-6"
    >

      <h2 className="text-xl text-secondary font-bold flex items-center gap-[10px]">
        <span className={`w-fit whitespace-nowrap ${!showBusinessAnalytics.orders && 'text-muted'}`}> Orders & Fulfillment </span>
        <div className={`w-full flex items-center justify-between gap-[10px] rounded-[4px] cursor-pointer`}
            onClick={()=>togglerEnabled && setShowBusinessAnalytics(status=> ({...status, orders: !status.orders}))}>
          <hr className={`mt-[2px] w-full h-[2px] border-t border-inputBorderSecondary border-dashed shadow-sm
              ${!showBusinessAnalytics.orders && 'border-muted'}`}/>
          {
            showBusinessAnalytics.orders ?
            <ChevronUp className={`p-[2px] w-[18px] h-[18px] text-muted border border-secondary rounded-[3px]
             hover:border-purple-800 hover:text-secondary hover:bg-inputBorderSecondary hover:transition
              hover:duration-150 hover:delay-75 hover:ease-in ${!togglerEnabled && 'cursor-not-allowed'} `}/>
            :<ChevronDown className={`p-[2px] w-[18px] h-[18px] text-muted border border-secondary rounded-[3px]
             hover:border-purple-800 hover:text-secondary hover:bg-inputBorderSecondary hover:transition
              hover:duration-150 hover:delay-75 hover:ease-in ${!togglerEnabled && 'cursor-not-allowed'} `}/>
          }
        </div>
      </h2>

      <AnimatePresence>
      {
        showBusinessAnalytics.orders &&
        <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} 
          exit={{opacity: 0, transition: { duration: 0.5, ease: "easeInOut" }}} transition={{type: 'spring', delay:0.2}}
            className="flex flex-col gap-[1.3rem]">
        
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4
                ${status.stats === "error" ? "h-[6.5rem] bg-white rounded-lg shadow-sm border" : ""}`}>
            { status.stats === 'success' ?
                stats.map((stat, index) => (
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
                      </div>
                    </div>
                  </motion.div>
                  ))
                : status.stats === 'loading' ?
                    [...Array(3)].map((_, index)=> (
                      <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className={`flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border 
                        ${index === 0 && 'border-primary'}`}
                      >
                        <div className="flex items-center">
                            <div className="mr-4 p-3 rounded-full skeleton-loader">
                              <div className="w-[17px] h-[17px] p-3" />
                            </div>
                            <div className="space-y-2">
                              <div className="h-[13px] w-24 skeleton-loader rounded" />
                              <div className="h-[25px] w-16 skeleton-loader rounded" />
                            </div>
                        </div>
                      </motion.div>
                    ))
                :
                    <div className="w-full h-full col-span-3">
                        <ChartError refreshCharts={refreshCharts}/> 
                    </div>
            }
          </div>

          <motion.div {...fadeInUp} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border
                ${dashboardQuery.trim() && !"Orders Over Time".toLowerCase().trim().includes(dashboardQuery.trim()) ? "hidden" : "inline-block"}`}>
            <h3 className="text-[17px]  font-semibold mb-6"> Orders Over Time </h3>
            <div className={`${status.mostPurchasedProducts !== "error" ? "h-80" : "h-40"} relative`}>  
              {
                status.ordersOverTime !== "loading" ? 
                <ResponsiveContainer width="100%" height="100%">
                  {
                    status.ordersOverTime !== "error" ?
                        <LineChart data={ordersOverTimeStats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dab3f6" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
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
                            <Line
                              type="monotone"
                              dataKey="delivered"
                              name="Delivered"
                              stroke="#10b981"
                              strokeWidth={2}
                              activeDot={{ r: 6 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="pending"
                              name="Pending"
                              stroke="#f59e0b"
                              strokeWidth={2}
                              activeDot={{ r: 6 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="shipped"
                              name="Shipped"
                              stroke="#d7f148"
                              strokeWidth={2}
                              activeDot={{ r: 6 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="cancelled"
                              name="Cancelled"
                              stroke="#ef4444"
                              strokeWidth={2}
                              activeDot={{ r: 6 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="refunded"
                              name="Refunded"
                              stroke="#7d7c8c"
                              strokeWidth={2}
                              activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    :
                         <ChartError refreshCharts={refreshCharts} />
                  }
                  {   
                      status.ordersOverTime !== "error" && ordersOverTimeStats && 
                      ( ordersOverTimeStats.length === 0 
                        || ordersOverTimeStats.every(data=> 
                            data.delivered === 0 && data.pending === 0 && data.refunded === 0 && data.cancelled === 0 && data.shipped === 0
                        ) ) 
                       &&
                          <p className='absolute -top-[10.5rem] x-sm:top-0 w-full h-full flex items-center justify-center
                            text-muted text-[13px] x-sm:text-[16px] font-medium tracking-[0.3px]'>
                             No orders recorded this year! 
                          </p>
                    }
                </ResponsiveContainer>
                :   
                    <div className="w-full h-full skeleton-loader"/>
              }
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div {...fadeInUp} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border
                ${dashboardQuery.trim() && !"Most Purchased Products".toLowerCase().trim().includes(dashboardQuery.trim()) ? "hidden" : "inline-block"}`}>
              <h3 className="text-[17px] font-semibold mb-6"> Most Purchased Products </h3>
              <div className={`${status.mostPurchasedProducts !== "error" ? "h-64" : "h-40"} relative`}>
                {
                  status.mostPurchasedProducts !== 'loading' ?
                    <ResponsiveContainer width="100%" height="100%">
                      {
                        status.mostPurchasedProducts !== 'error' && topProductDatas.length > 0 ?
                            <BarChart data={topProductDatas} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                              <XAxis type="number" tick={{ fontSize: 12 }}/>
                              <YAxis type="category" dataKey="product" tick={{ fontSize: 12 }} width={150} />
                              <Tooltip
                                formatter={(value) => [`${value} orders`, "Quantity"]}
                                contentStyle={{
                                  fontSize: '13px',
                                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                                  borderRadius: "6px",
                                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                  border: "none",
                                }}
                              />
                              <Bar dataKey="orders" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        : status.mostPurchasedProducts === 'error' &&
                            <ChartError refreshCharts={refreshCharts} />
                      }
                     {topProductDatas && status.mostPurchasedProducts !== "error" &&
                        (topProductDatas.length === 0 || topProductDatas.every((data) => data.orders === 0)) && (
                            <p className='absolute top-0 w-full h-full flex items-center 
                                justify-center text-muted font-medium tracking-[0.3px]'>
                                No orders recorded yet!
                            </p>
                      )}
                    </ResponsiveContainer>
                : 
                    <div className="w-full h-full skeleton-loader"/>
                }
              </div>
            </motion.div>
                    
            <motion.div {...fadeInUp} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border
                ${dashboardQuery.trim() && !"Order Status Distribution".toLowerCase().trim().includes(dashboardQuery.trim()) ? "hidden" : "inline-block"}`}>
              <h3 className="text-[17px] font-semibold mb-6">Order Status Distribution</h3>
              <div className={`${status.orderStatusDistribution !== "error" ? "h-64" : "h-40"} relative`}>
                {
                  status.orderStatusDistribution !== 'loading' ?
                  <ResponsiveContainer width="100%" height="100%">
                    {
                        status.orderStatusDistribution !== 'error' ?
                            <PieChart>
                              <Pie
                                data={orderStatusDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                labelLine={true}
                              >
                                {orderStatusDistribution.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip
                                formatter={(value) => [`${value}%`, "Percentage"]}
                                contentStyle={{
                                  fontSize: '13px',
                                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                                  borderRadius: "6px",
                                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                  border: "none",
                                }}
                              />
                              {
                                orderStatusDistribution && 
                                ( !orderStatusDistribution.every(data=> data.value === 0) ) &&
                                    <Legend  formatter={(value, entry, index)=> (
                                        <span style={{ fontSize: '13px', color: '#333' }}>{value}</span>
                                    )}/>
                              }
                            </PieChart>
                        : 
                              <ChartError refreshCharts={refreshCharts} />
                    }
                    {
                      status.orderStatusDistribution !== 'error' && orderStatusDistribution && 
                      ( orderStatusDistribution.length === 0 || orderStatusDistribution.every(data=> data.value === 0) ) &&
                          <p className='absolute top-0 w-full h-full flex items-center 
                                justify-center text-muted font-medium tracking-[0.3px]'>
                             No orders recorded! 
                          </p>
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
