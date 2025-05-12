import React, {useState, useEffect, useContext} from 'react'
import './componentsStyle.css'
import { motion, AnimatePresence } from "framer-motion"

import {BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer} from "recharts"
import { Package, Clock, CheckCircle, ChevronDown, ChevronUp } from "lucide-react"
import axios from 'axios'

import {BusinessAnalyticsContext} from '.././AdminDashboardPage'
import { useTogglerEnabled } from "../../../../Hooks/ToggleEnabler"



export default function OrdersFulfillmentSection() {

  const {dateRange, showBusinessAnalytics, setShowBusinessAnalytics} = useContext(BusinessAnalyticsContext)

  const togglerEnabled = useTogglerEnabled(showBusinessAnalytics, 'orders')

  const [stats, setStats] = useState([])
  const [ordersOverTimeStats, setOrdersOverTimeStats] = useState([])
  const [topProductDatas, setTopProductDatas] = useState([])
  const [orderStatusDistribution, setOrderStatusDistribution] = useState([])

  const [loading, setLoading] = useState({
      totalOrders: false,
      pendingOrders: false,
      fulfillmentRate: false,
      ordersOverTime: false,
      mostPurchasedProducts: false,
      orderStatusDistribution: false,
  })

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  useEffect(() => {
      const fetchAllStats = async ()=> {
        const newStats = []
    
        setLoading(status => ({...status, totalOrders: true, pendingOrders: true, fulfillmentRate: true})) 
    
        const [orderStatsResponse, ordersOverTimeResponse, topProductsResponse, orderStatusPercentRes] = await Promise.allSettled([
          axios.get('http://localhost:3000/admin/dashboard/orders/stats', { withCredentials: true }), 
          axios.get('http://localhost:3000/admin/dashboard/orders/stats/monthly', { withCredentials: true }),
          axios.get('http://localhost:3000/admin/dashboard/products/top', { withCredentials: true }),
          axios.get('http://localhost:3000/admin/dashboard/orders/status-percent', { withCredentials: true }),
        ])
        
        if (orderStatsResponse.status === 'fulfilled'){
          const response = orderStatsResponse.value
          console.log("ORDER response.data.stats----->", response.data.stats)

          newStats.push({
            name: "totalOrders",
            title: "Total Orders",
            value: response.data.stats.total,
            icon: Package,
            color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          },
          {
            name: "pendingOrders",
            title: "Pending Orders",
            value: response.data.stats.pending,
            icon: Clock,
            color: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
          },
          {
            name: "fulfillmentRate",
            title: "Fulfillment Rate",
            value: response.data.stats.pending + ' ' + '%',
            icon: CheckCircle,
            color: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          })
          console.log('newStats----->', newStats)

          setStats(newStats)
          setLoading(status => ({...status, totalOrders: false, pendingOrders: false, fulfillmentRate: false})) 
        }
        else{
          console.log("Error in total revenue:", orderStatsResponse.reason.message)
        }
        
        if (ordersOverTimeResponse.status === 'fulfilled'){ 
          const response = ordersOverTimeResponse.value
          console.log("ordersOverTimeResponse response----->", response.data.ordersOverTime) 
          setOrdersOverTimeStats(response.data.ordersOverTime)
        }
        else{
          console.log("Error in orders over time:", ordersOverTimeResponse.reason.message)
        }

        if (topProductsResponse.status === 'fulfilled'){
          const response = topProductsResponse.value
          console.log("ordersOverTimeResponse response----->", response.data.topProductDatas) 
          setTopProductDatas(response.data.topProductDatas)
        }
        else{
          console.log("Error in orders over time:", topProductsResponse.reason.message)
        }

        if (orderStatusPercentRes.status === 'fulfilled'){
          const response = orderStatusPercentRes.value
          console.log("orderStatusPercentRes response----->", response.data.orderStatusDistribution) 
          const statusColors = [
            { name: "Delivered", color: "#10b981" },
            { name: "Pending", color: "#f59e0b" },
            { name: "Cancelled", color: "#ef4444" },
            { name: "Shipped", color: "#d7f148" },
            { name: "Refunded", color: "#00e6d4" }
          ]
          const colorMappedStatus = response.data.orderStatusDistribution.map(status=> {
            const color = statusColors.find(statusColor=> statusColor.name === status.name).color
            return {...status, color}
          })
          setOrderStatusDistribution(colorMappedStatus)
          setLoading(status => ({...status, orderStatusDistribution: false})) 
        }
        else{
          console.log("Error in orders over time:", orderStatusPercentRes.reason.message)
        }
      }
    
      fetchAllStats();
  }, [])

  useEffect(()=> {
    console.log('ORDER stats---->', stats)
  },[stats])



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
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            { stats && stats.length > 0 ?
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
                :
                [...Array(3)].map((_, index)=> (
                  <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`skeleton-loader flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border 
                    ${index === 0 && 'border-primary'}`}
                  >
                    <div className="flex items-center">
                      <div className='invisible p-3 rounded-full mr-4'> Insight Icon </div>
                      <div>
                        <p className="invisible text-[13px] text-gray-500 dark:text-gray-400"> Insight </p>
                        <h3 className="invisible w-[17px] h-[17px] text-[20px] font-bold mt-1"> Value </h3>
                      </div>
                    </div>
                  </motion.div>
                ))
            }
          </div>

          <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
            <h3 className="text-[17px]  font-semibold mb-6"> Orders Over Time </h3>
            <div className="h-80">  
              {
                ordersOverTimeStats && ordersOverTimeStats.length > 0 ?
                <ResponsiveContainer width="100%" height="100%">
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
                </ResponsiveContainer>
                : <div className="w-full h-full skeleton-loader"/>
              }
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <h3 className="text-[17px] font-semibold mb-6"> Most Purchased Products </h3>
              <div className="h-64">
                {
                  topProductDatas && topProductDatas.length > 0 ?
                  <ResponsiveContainer width="100%" height="100%">
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
                </ResponsiveContainer>
                : <div className="w-full h-full skeleton-loader"/>
                }
              </div>
            </motion.div>
                    
            <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <h3 className="text-[17px] font-semibold mb-6">Order Status Distribution</h3>
              <div className="h-64">
                {
                  orderStatusDistribution && orderStatusDistribution.length > 0 &&
                    !orderStatusDistribution.every(data=> data.value === 0) ?
                  <ResponsiveContainer width="100%" height="100%">
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
                    <Legend  formatter={(value, entry, index)=> (
                        <span style={{ fontSize: '13px', color: '#333' }}>{value}</span>
                    )}/>
                  </PieChart>
                </ResponsiveContainer>
                : orderStatusDistribution && orderStatusDistribution.length > 0 &&
                    orderStatusDistribution.every(data=> data.value === 0) ?
                  <p className="w-full h-full flex items-center justify-center text-muted font-medium tracking-[0.3px]"
                    style={{wordSpacing: '2px'}}>
                     No Orders made yet! 
                   </p>
                :  orderStatusDistribution && orderStatusDistribution.length === 0 &&
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
