import React, {useState, useEffect, useContext} from 'react'
import './componentsStyle.css'
import { motion, AnimatePresence } from "framer-motion"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Package, Clock, CheckCircle, ChevronDown, ChevronUp } from "lucide-react"
import axios from 'axios'

import {AnalyticsContext} from '.././AdminDashboardPage'
import { useTogglerEnabled } from "../../../../Hooks/ToggleEnabler"

const ordersTimeData = [
  { name: "Jan", completed: 145, pending: 23, canceled: 12 },
  { name: "Feb", completed: 158, pending: 25, canceled: 10 },
  { name: "Mar", completed: 162, pending: 28, canceled: 14 },
  { name: "Apr", completed: 175, pending: 30, canceled: 15 },
  { name: "May", completed: 182, pending: 32, canceled: 13 },
  { name: "Jun", completed: 195, pending: 35, canceled: 16 },
  { name: "Jul", completed: 210, pending: 38, canceled: 18 },
  { name: "Aug", completed: 222, pending: 40, canceled: 15 },
  { name: "Sep", completed: 235, pending: 42, canceled: 17 },
  { name: "Oct", completed: 248, pending: 45, canceled: 19 },
  { name: "Nov", completed: 260, pending: 48, canceled: 20 },
  { name: "Dec", completed: 275, pending: 50, canceled: 22 },
]

const topProductsData = [
  { name: "Premium Dumbbells Set", value: 120 },
  { name: "Resistance Bands Pack", value: 98 },
  { name: "Protein Powder (2kg)", value: 86 },
  { name: "Yoga Mat Pro", value: 72 },
  { name: "Fitness Tracker", value: 65 },
]

const orderStatusData = [
  { name: "Completed", value: 68, color: "#10b981" },
  { name: "Processing", value: 17, color: "#6366f1" },
  { name: "Pending", value: 10, color: "#f59e0b" },
  { name: "Canceled", value: 5, color: "#ef4444" },
]

export default function OrdersFulfillmentSection() {

  const {dateRange, showAnalytics, setShowAnalytics} = useContext(AnalyticsContext)

  const togglerEnabled = useTogglerEnabled(showAnalytics, 'orders')

  const [stats, setStats] = useState([])

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

  // useEffect(() => {
  //     const fetchAllStats = async ()=> {
  //       const newStats = []
    
  //       setLoading(status => ({...status, totalOrders: true, pendingOrders: true, fulfillmentRate: true})) 
    
  //       const [orderStatsResponse] = await Promise.allSettled([
  //         axios.get('http://localhost:3000/admin/dashboard/orders/stats', { withCredentials: true }),
  //       ])
    
  //       if (orderStatsResponse.status === 'fulfilled'){
  //         const response = revenueResponse.value
  //         newStats.concat({
  //           name: "totalOrders",
  //           title: "Total Orders",
  //           value: response.data.stats.total,
  //           icon: Package,
  //           color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
  //         })
  //         .concat({
  //           name: "pendingOrders",
  //           title: "Pending Orders",
  //           value: response.data.stats.pending,
  //           icon: Clock,
  //           color: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
  //         })
  //         .concat({
  //           name: "fulfillmentRate",
  //           title: "Fulfillment Rate",
  //           value: response.data.stats.pending,
  //           icon: CheckCircle,
  //           color: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
  //         })

  //       }else{
  //         console.log("Error in total revenue:", revenueResponse.reason.message)
  //       }
    
  //       if (avgOrdersResponse.status === 'fulfilled'){
  //         const response = avgOrdersResponse.value
  //         newStats.push({
  //           name: "avgOrders",
  //           title: "Average Order Value",
  //           value: response.data.averageOrderTotal,
  //           change: response.data.changePercentage,
  //           trend: response.data.changePercentage > 0 || response.data.changePercentage === 'N/A' ? 'up' : 'down',
  //           icon: TrendingUp,
  //           color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
  //         })
  //       }else{
  //         console.log("Error in avg orders:", avgOrdersResponse.reason.message)
  //       } 
        
  //       if (totalOrdersResponse.status === 'fulfilled') {
  //         const response = totalOrdersResponse.value
  //         newStats.push({
  //           name: "totalOrders",
  //           title: "Total Orders",
  //           value: response.data.totalOrders,
  //           change: response.data.changePercentage,
  //           trend: response.data.changePercentage > 0 || response.data.changePercentage === 'N/A' ? 'up' : 'down',
  //           icon: ShoppingBag,
  //           color: "bg-orange-50 text-primaryDark dark:bg-orange-900/30 dark:text-orange-400"
  //         })
  //       }else{
  //         console.log("Error in total orders:", totalOrdersResponse.reason.message) 
  //       }
    
  //       setLoading(status => ({...status, totalRevenue: false, avgOrders: false, totalOrders: false}))
    
  //       setStats(prev => {
  //         const existingNames = new Set(prev.map(stat => stat.name));
  //         const filtered = newStats.filter(stat => !existingNames.has(stat.name));
  //         return [...prev, ...filtered];
  //       });
  
  //       if (categoryDatasResponse.status === 'fulfilled') {
  //         const value = categoryDatasResponse.value.data.categoryDatas
  //         console.log("setting categoryDatas--->", categoryDatasResponse.value.data.categoryDatas)
  //         setCategoryDatas(value)
  //       }else{
  //         console.log("Error in total orders:", categoryDatasResponse.reason.message) 
  //       }
  
  //     }
    
  //     fetchAllStats();
  // }, [])




  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-6"
    >

      <h2 className="text-xl text-secondary font-bold flex items-center gap-[10px]">
        <span className={`w-fit whitespace-nowrap ${!showAnalytics.orders && 'text-muted'}`}> Orders & Fulfillment </span>
        <div className={`w-full flex items-center justify-between gap-[10px] rounded-[4px] cursor-pointer`}
            onClick={()=>togglerEnabled && setShowAnalytics(status=> ({...status, orders: !status.orders}))}>
          <hr className={`mt-[2px] w-full h-[2px] border-t border-inputBorderSecondary border-dashed shadow-sm
              ${!showAnalytics.orders && 'border-muted'}`}/>
          {
            showAnalytics.orders ?
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
        showAnalytics.orders &&
        <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} 
          exit={{opacity: 0, transition: { duration: 0.5, ease: "easeInOut" }}} transition={{type: 'spring', delay:0.2}}
            className="flex flex-col gap-[1.3rem]">
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Total Orders",
                value: "2,845",
                icon: Package,
                color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
              },
              {
                title: "Pending Orders",
                value: "42",
                icon: Clock,
                color: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
              },
              {
                title: "Fulfillment Rate",
                value: "98.2%",
                icon: CheckCircle,
                color: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border ${index === 0 && 'border-primary'}`}
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
            ))}
          </div>

          <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
            <h3 className="text-[17px]  font-semibold mb-6"> Orders Over Time </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ordersTimeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                    dataKey="completed"
                    name="Completed"
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
                    dataKey="canceled"
                    name="Canceled"
                    stroke="#ef4444"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <h3 className="text-[17px] font-semibold mb-6"> Most Purchased Products </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProductsData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" tick={{ fontSize: 12 }}/>
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={150} />
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
                    <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
                    
            <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <h3 className="text-[17px] font-semibold mb-6">Order Status Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
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
              </div>
            </motion.div>
          </div>
    
        </motion.div>

      }
      </AnimatePresence>

    </motion.section>

  )
}
