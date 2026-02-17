import React, { useState, useEffect, useContext } from "react"
import './componentsStyle.css'
import { motion, AnimatePresence } from "framer-motion"

import {AreaChart, Area, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer} from "recharts"
import { ArrowUp, ArrowDown, IndianRupee, TrendingUp, ShoppingBag, ChevronDown, ChevronUp, TriangleAlert, TrendingDown } from "lucide-react"
import axios from 'axios'

import {useTogglerEnabled} from "../../../../Hooks/ToggleEnabler"
import {BusinessAnalyticsContext} from '.././AdminDashboardPage'
import ChartError from "./ChartError"


export default function SalesRevenueSection() {
    
  const [activeTab, setActiveTab] = useState("monthly")

  const [salesDate, setSalesDate] = useState(new Date())
  const [hourlySalesDatas, setHourlySalesDatas] = useState([])

  const [categoryDatas, setCategoryDatas] = useState([])

  const {dashboardQuery, showBusinessAnalytics, setShowBusinessAnalytics} = useContext(BusinessAnalyticsContext)

  const [stats, setStats] = useState([])
  const [orderedStats, setOrderedStats] = useState([])

  const [status, setStatus] = useState({
      stats: "loading",
      revenueTrendsData: "loading",
      revenueByCategory: "loading",
      hourlySalesDatas: "loading",
      avgOrderValue: "loading",
  })

  const [fetchChartData, setFetchChartData] = useState(true)

  const [revenueDatas, setRevenueDatas] = useState([])

  const togglerEnabled = useTogglerEnabled(showBusinessAnalytics, 'sales')

  const COLORS = ["#8b5cf6", "#cb8ef5", "#f1c40f", "#d7f148"]

  const fetchAllStats = async () => {
      const newStats = []

      const [revenueResponse, avgOrdersResponse, totalOrdersResponse, categoryDatasResponse] = await Promise.allSettled(
          [
              axios.get(`/admin/dashboard/revenue/total`, { withCredentials: true }),
              axios.get(`/admin/dashboard/orders/average`, { withCredentials: true }),
              axios.get(`/admin/dashboard/orders/total`, { withCredentials: true }),
              axios.get(`/admin/dashboard/revenue/category`, { withCredentials: true }),
          ],
      )

      let statsError = false

      if (revenueResponse.status === "fulfilled") {
          const response = revenueResponse.value
          newStats.push({
              name: "totalRevenue",
              title: "Total Revenue",
              value: response.data.currentYear.revenue,
              change: response.data.changePercentage,
              trend: response.data.changePercentage > 0 || response.data.changePercentage === "N/A" ? "up" : "down",
              icon: IndianRupee,
              color: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
          })
      } else {
          statsError = true
      }

      if (avgOrdersResponse.status === "fulfilled") {
          const response = avgOrdersResponse.value
          newStats.push({
              name: "avgOrders",
              title: "Average Order Value",
              value: response.data.averageOrderTotal,
              change: response.data.changePercentage,
              trend: response.data.changePercentage > 0 || response.data.changePercentage === "N/A" ? "up" : "down",
              icon: TrendingUp,
              color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
          })
      } else {
          statsError = true
      }

      if (totalOrdersResponse.status === "fulfilled") {
          const response = totalOrdersResponse.value
          newStats.push({
              name: "totalOrders",
              title: "Total Orders",
              value: response.data.totalOrders,
              change: response.data.changePercentage,
              trend: response.data.changePercentage > 0 || response.data.changePercentage === "N/A" ? "up" : "down",
              icon: ShoppingBag,
              color: "bg-orange-50 text-primaryDark dark:bg-orange-900/30 dark:text-orange-400",
          })
      } else {
          statsError = true
      }

      if (statsError) {
          setStatus((status) => ({ ...status, stats: "error" }))
      } else {
          setStatus((status) => ({ ...status, stats: "success" }))
      }

      setStats((prev) => {
          const existingNames = new Set(prev.map((stat) => stat.name))
          const filtered = newStats.filter((stat) => !existingNames.has(stat.name))
          return [...prev, ...filtered]
      })

      if (categoryDatasResponse.status === "fulfilled") {
          const value = categoryDatasResponse.value.data.categoryDatas
          setCategoryDatas(value)
          setStatus((status) => ({ ...status, revenueByCategory: "success" }))
      } else {
          setStatus((status) => ({ ...status, revenueByCategory: "error" }))
      }
  }

  useEffect(() => {
    if (fetchChartData) {
        fetchAllStats()
        setFetchChartData(false)
    }
  }, [fetchChartData])
  
  useEffect(()=> {
    const priorityOrder = ['totalRevenue', 'avgOrders', 'totalOrders']

    const orderedStats = stats.sort(
      (a, b) => priorityOrder.indexOf(a.name) - priorityOrder.indexOf(b.name)
    )
    setOrderedStats(orderedStats)
  },[stats])

  useEffect(()=> { 
    const loadRevenueDatas = async()=> {
      try{
        let response = null
        if(activeTab === 'monthly'){
          response = await axios.get(`/admin/dashboard/revenue/monthly`, { withCredentials: true })
        }
        if(activeTab === 'weekly'){
          response = await axios.get(`/admin/dashboard/revenue/weekly`, { withCredentials: true })
        }
        if(response?.data){
          setStatus((status) => ({ ...status, revenueTrendsData: "success" }))
          setRevenueDatas(response.data.revenueDatas) 
        }
      }
      catch(error){
        setStatus((status) => ({ ...status, revenueTrendsData: "error" }))
      }
    }
    if(activeTab){
      loadRevenueDatas(activeTab)
    }
    const loadHourlyRevenue = async()=> {
      try{
        const response = await axios.get(`/admin/dashboard/revenue/hourly/:${salesDate}`, { withCredentials: true })
        if(response.data){
            setHourlySalesDatas(response.data.daySalesDatas)
            setStatus((status) => ({ ...status, hourlySalesDatas: "success" }))
        }
      }
      catch(error){
        setStatus((status) => ({ ...status, hourlySalesDatas: "error" }))
      }
    }
    if(salesDate){
      loadHourlyRevenue()
    }
  },[activeTab, salesDate])

  const tabs = [
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
  ]

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  const refreshCharts = ()=> {
    setStatus({
        stats: "loading",
        revenueTrendsData: "loading",
        revenueByCategory: "loading",
        hourlySalesDatas: "loading",
        avgOrderValue: "loading",
    })
    setFetchChartData(true)
  }


  return (
      <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='space-y-6'>
          <h2 className='text-xl text-secondary font-bold flex items-center gap-[10px]'>
              <span className={`w-fit whitespace-nowrap ${!showBusinessAnalytics.sales && "text-muted"}`}>
                  {" "}
                  Sales & Revenue Analysis{" "}
              </span>
              <div
                  className={`w-full flex items-center justify-between gap-[10px] rounded-[4px] cursor-pointer`}
                  onClick={() =>
                      togglerEnabled && setShowBusinessAnalytics((status) => ({ ...status, sales: !status.sales }))
                  }>
                  <hr
                      className={`mt-[2px] w-full h-[2px] border-t border-inputBorderSecondary border-dashed shadow-sm
              ${!showBusinessAnalytics.sales && "border-muted"} `}
                  />
                  {showBusinessAnalytics.sales ? (
                      <ChevronUp
                          className={`p-[2px] w-[18px] h-[18px] text-muted border border-secondary rounded-[3px]
             hover:border-purple-800 hover:text-secondary hover:bg-inputBorderSecondary hover:transition
              hover:duration-150 hover:delay-75 hover:ease-in ${!togglerEnabled && "cursor-not-allowed"} `}
                      />
                  ) : (
                      <ChevronDown
                          className={`p-[2px] w-[18px] h-[18px] text-muted border border-secondary rounded-[3px]
             hover:border-purple-800 hover:text-secondary hover:bg-inputBorderSecondary hover:transition
              hover:duration-150 hover:delay-75 hover:ease-in ${!togglerEnabled && "cursor-not-allowed"} `}
                      />
                  )}
              </div>
          </h2>

          <AnimatePresence>
              {showBusinessAnalytics.sales && (
                  <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className='flex flex-col gap-[1.3rem]'>
                      <div
                          className={`grid grid-cols-1 md:grid-cols-3 gap-4 
                ${status.stats === "error" ? "h-[6.5rem] bg-white rounded-lg shadow-sm border" : ""}`}>
                          {status.stats === "success" ? (
                              orderedStats.map((stat, index) => (
                                  <motion.div
                                      key={stat.title}
                                      className={`flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border ${index === 0 && "border-primary"}`}>
                                      <div className='w-full flex items-center justify-between'>
                                          <div>
                                              <p className='text-[13px] text-gray-500 dark:text-gray-400'>
                                                  {stat.title}
                                              </p>
                                              <h3 className='text-[20px] font-bold mt-1'>
                                                  {stat.name !== "totalOrders" ? "₹" + " " + stat.value : stat.value}
                                              </h3>
                                              <div className='flex items-center mt-1'>
                                                  <span
                                                      className={`flex items-center text-[12px] ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                                                      {stat.trend === "up" ? (
                                                          <ArrowUp size={14} />
                                                      ) : (
                                                          <ArrowDown size={14} />
                                                      )}
                                                      {stat.change}
                                                  </span>
                                                  <span className='text-xs text-gray-500 dark:text-gray-400 ml-1'>
                                                      vs yesterday
                                                  </span>
                                              </div>
                                          </div>
                                          <div className={`p-3 rounded-full ${stat.color}`}>
                                              <stat.icon size={17} />
                                          </div>
                                      </div>
                                  </motion.div>
                              ))
                          ) : status.stats === "loading" ? (
                              [...Array(3)].map((_, index) => (
                                  <AnimatePresence>
                                      <motion.div
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          // type='tween'
                                          // ease='circInOut'
                                          transition={{ delay: index * 0.1, duration: 0.5 }}
                                          key={index}
                                          className={`flex items-center bg-white dark:bg-gray-800 p-4
                                            rounded-lg shadow-sm border ${index === 0 && "border-primary"}`}>
                                          <div className='flex items-center'>
                                              <div className='mr-4 p-3 rounded-full skeleton-loader'>
                                                  <div className='w-[17px] h-[17px]' />
                                              </div>
                                              <div className='space-y-2'>
                                                  <div className='h-[13px] w-24 skeleton-loader rounded' />
                                                  <div className='h-[25px] w-16 skeleton-loader rounded' />
                                                  <div className='flex items-center gap-2'>
                                                      <div className='h-[12px] w-[32px] skeleton-loader rounded' />
                                                  </div>
                                              </div>
                                          </div>
                                      </motion.div>
                                  </AnimatePresence>
                              ))
                          ) : (
                              <div className='w-full h-full col-span-3'>
                                  <ChartError refreshCharts={refreshCharts} />
                              </div>
                          )}
                      </div>

                      <motion.div
                          {...fadeInUp}
                          className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border
                         ${dashboardQuery.trim() && !"Revenue Trends".toLowerCase().trim().includes(dashboardQuery.trim()) ? "hidden" : "inline-block"}`}>
                          <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6'>
                              <h3 className='text-[17px] font-semibold'>Revenue Trends</h3>
                              <div className='flex mt-2 sm:mt-0 bg-gray-100 dark:bg-gray-700 rounded-md p-1'>
                                  {tabs.map((tab) => (
                                      <button
                                          key={tab.id}
                                          onClick={() => setActiveTab(tab.id)}
                                          className={`px-3 py-1 text-sm rounded-md ${
                                              activeTab === tab.id
                                                  ? "bg-white dark:bg-gray-600 shadow-sm"
                                                  : "text-gray-500 dark:text-gray-400"
                                          }`}>
                                          {tab.label}
                                      </button>
                                  ))}
                              </div>
                          </div>
                          <div className={`${status.revenueTrendsData !== "error" ? "h-80" : "h-40"} relative`}>
                              {status.revenueTrendsData !== "loading" ? (
                                  <ResponsiveContainer width='100%' height='100%'>
                                      {status.revenueTrendsData !== "error" ? (
                                          <AreaChart
                                              data={revenueDatas}
                                              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                              <defs>
                                                  <linearGradient id='colorRevenue' x1='0' y1='0' x2='0' y2='1'>
                                                      <stop offset='5%' stopColor='#8b5cf6' stopOpacity={0.8} />
                                                      <stop offset='95%' stopColor='#8b5cf6' stopOpacity={0} />
                                                  </linearGradient>
                                              </defs>
                                              <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#e5e7eb' />
                                              <XAxis dataKey='name' tick={{ fontSize: 12 }} />
                                              <YAxis
                                                  tick={{ fontSize: 12 }}
                                                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                                              />
                                              <Tooltip
                                                  formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
                                                  contentStyle={{
                                                      fontSize: "13px",
                                                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                                                      borderRadius: "6px",
                                                      boxShadow:
                                                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                                      border: "none",
                                                  }}
                                              />
                                              <Area
                                                  type='monotone'
                                                  dataKey='revenue'
                                                  stroke='#8b5cf6'
                                                  fillOpacity={1}
                                                  fill='url(#colorRevenue)'
                                                  strokeWidth={2}
                                                  activeDot={{ r: 6 }}
                                              />
                                          </AreaChart>
                                      ) : (
                                          <ChartError refreshCharts={refreshCharts} />
                                      )}
                                      {revenueDatas &&
                                          status.revenueTrendsData !== "error" &&
                                          (revenueDatas.length === 0 ||
                                              revenueDatas.every((data) => data.revenue === 0)) && (
                                              <p
                                                  className='absolute top-[10.5rem] x-sm:top-0 w-full h-full flex items-center justify-center
                                                text-muted text-[13px] x-sm:text-[16px] font-medium tracking-[0.3px]'>
                                                  No revenues recorded over this period!
                                              </p>
                                          )}
                                  </ResponsiveContainer>
                              ) : (
                                  <div className='w-full h-full skeleton-loader' />
                              )}
                          </div>
                      </motion.div>

                      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6`}>
                          <motion.div
                              className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border
                                ${dashboardQuery.trim() 
                                    && !"Revenue by Category".toLowerCase().trim().includes(dashboardQuery.trim()) 
                                    ? "hidden" 
                                    : "inline-block"}`}
                           >
                              <h3 className='text-[17px] font-semibold mb-6'>Revenue by Category</h3>
                              <div className={`${status.revenueByCategory !== "error" ? "h-64" : "h-40"} relative`}>
                                  {status.revenueByCategory !== "loading" ? (
                                      <ResponsiveContainer width='100%' height='100%'>
                                          {status.revenueByCategory !== "error" ? (
                                              <PieChart>
                                                  <Pie
                                                      data={categoryDatas}
                                                      cx='50%'
                                                      cy='50%'
                                                      innerRadius={60}
                                                      outerRadius={80}
                                                      fill='#8884d8'
                                                      paddingAngle={5}
                                                      dataKey='revenue'
                                                      label={({ name, percent }) =>
                                                          `${name} ${(percent * 100).toFixed(0)}%`
                                                      }
                                                      labelLine={true}>
                                                      {categoryDatas.map((entry, index) => (
                                                          <Cell
                                                              key={`cell-${index}`}
                                                              fill={COLORS[index % COLORS.length]}
                                                          />
                                                      ))}
                                                  </Pie>
                                                  <Tooltip
                                                      formatter={(value) => [`${value}%`, "Percentage"]}
                                                      contentStyle={{
                                                          fontSize: "13px",
                                                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                                                          borderRadius: "6px",
                                                          boxShadow:
                                                              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                                          border: "none",
                                                      }}
                                                  />
                                                  {categoryDatas &&
                                                      categoryDatas.length > 0 &&
                                                      !categoryDatas.every((data) => data.revenue === 0) && (
                                                          <Legend
                                                              formatter={(value, entry, index) => (
                                                                  <span style={{ fontSize: "13px", color: "#333" }}>
                                                                      {value}
                                                                  </span>
                                                              )}
                                                          />
                                                      )}
                                              </PieChart>
                                          ) : (
                                              <ChartError refreshCharts={refreshCharts} />
                                          )}
                                          {categoryDatas &&
                                              status.revenueByCategory !== "error" &&
                                              (categoryDatas.length === 0 ||
                                                  categoryDatas.every((data) => data.revenue === 0)) && (
                                                  <p
                                                      className='absolute top-0 w-full h-full flex items-center 
                                                    justify-center text-muted font-medium tracking-[0.3px]'>
                                                      No revenues recorded yet!
                                                  </p>
                                              )}
                                      </ResponsiveContainer>
                                  ) : (
                                      <div className='w-full h-full skeleton-loader' />
                                  )}
                              </div>
                          </motion.div>

                          <motion.div
                              {...fadeInUp}
                              className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border
                                ${dashboardQuery.trim() && !"Hourly Sales Data".toLowerCase().trim().includes(dashboardQuery.trim()) 
                                    ? "hidden" 
                                    : "inline-block"}`}
                           >
                              <h3 className='w-full flex items-center justify-between text-[17p] font-semibold mb-6'>
                                  <span>Hourly Sales Data</span>
                                  {salesDate && (
                                      <input
                                          type='date'
                                          id='date'
                                          name='date'
                                          value={
                                              salesDate instanceof Date
                                                  ? salesDate.toISOString().split("T")[0]
                                                  : salesDate
                                          }
                                          onChange={(e) => setSalesDate(e.target.value)}
                                          className='w-[8.5rem] h-[2.1rem] text-[11px] text-secondary capitalize border border-primary rounded-[6px]
                                            cursor-pointer focus:ring-2 focus:ring-primaryDark focus:outline-none'
                                      />
                                  )}
                              </h3>
                              <div className={`${status.hourlySalesDatas !== "error" ? "h-64" : "h-40"} relative`}>
                                  {status.hourlySalesDatas !== "loading" ? (
                                      <ResponsiveContainer width='100%' height='100%'>
                                          {status.hourlySalesDatas !== "error" ? (
                                              <LineChart
                                                  data={hourlySalesDatas}
                                                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                  <CartesianGrid
                                                      strokeDasharray='3 3'
                                                      vertical={false}
                                                      stroke='#e5e7eb'
                                                  />
                                                  <XAxis dataKey='hour' tick={{ fontSize: 12 }} />
                                                  <YAxis
                                                      tick={{ fontSize: 12 }}
                                                      tickFormatter={(value) => `₹${value}`}
                                                      domain={["dataMin - 10", "dataMax + 10"]}
                                                  />
                                                  <Tooltip
                                                      formatter={(value) => [`₹ ${value}`, "Total Order Value"]}
                                                      contentStyle={{
                                                          fontSize: "13px",
                                                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                                                          borderRadius: "6px",
                                                          boxShadow:
                                                              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                                          border: "none",
                                                      }}
                                                  />
                                                  <Line
                                                      type='monotone'
                                                      dataKey='totalSales'
                                                      // stroke="#d7f148"
                                                      stroke='#9f2af0'
                                                      strokeWidth={3}
                                                      dot={{ r: 4, strokeWidth: 2 }}
                                                      activeDot={{ r: 6 }}
                                                  />
                                              </LineChart>
                                          ) : (
                                              <ChartError refreshCharts={refreshCharts} />
                                          )}
                                          {hourlySalesDatas &&
                                              status.hourlySalesDatas !== "error" &&
                                              (hourlySalesDatas.length === 0 ||
                                                  hourlySalesDatas.every((data) => data.totalSales === 0)) && (
                                                  <p
                                                      className='absolute top-[8.5rem] xs-sm:-top-[8rem] w-full h-full flex items-center
                                                        justify-center text-muted text-[13px] font-medium tracking-[0.3px]'>
                                                      No sales recorded yet!
                                                  </p>
                                              )}
                                      </ResponsiveContainer>
                                  ) : (
                                      <div className='w-full h-full skeleton-loader' />
                                  )}
                              </div>
                          </motion.div>
                      </div>
                  </motion.div>
              )}
          </AnimatePresence>
      </motion.section>
  )
}
