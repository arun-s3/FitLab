import React, {useContext, useState, useEffect} from 'react'
import './componentsStyle.css'
import { motion, AnimatePresence } from "framer-motion"

import {PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts"

import { Users, UserPlus, UserCheck, Award, ChevronDown, ChevronUp } from "lucide-react"

import apiClient from '../../../../Api/apiClient'

import {BusinessAnalyticsContext} from '.././AdminDashboardPage'
import { useTogglerEnabled } from "../../../../Hooks/ToggleEnabler"
import ChartError from './ChartError'


export default function CustomerInsightsSection() {

  const {dashboardQuery, showBusinessAnalytics, setShowBusinessAnalytics } = useContext(BusinessAnalyticsContext)

  const togglerEnabled = useTogglerEnabled(showBusinessAnalytics, 'customers')

  const [userMetrics, setUserMetrics] = useState([])
  const [userTypeDatas, setuserTypeDatas] = useState([])
  const [monthlyUserGrowthDatas, setMonthlyUserGrowthDatas] = useState([])
  const [vipCustomersDatas, setVipCustomersDatas] = useState([])

  const [fetchChartData, setFetchChartData] = useState(true)

  const [status, setStatus] = useState({
      stats: "loading",
      userTypeDatas: "loading",
      monthlyUserGrowthDatas: "loading",
      vipCustomersDatas: "loading",
  })

  const fetchAllStats = async () => {
      const newMetrics = []

      const [usersMetricsResponse, userTypesResponse, userGrowthResponse, vipCustomersRes] = await Promise.allSettled([
          apiClient.get(`/admin/dashboard/customers/metrics`),
          apiClient.get(`/admin/dashboard/customers/types`),
          apiClient.get(`/admin/dashboard/customers/monthly`),
          apiClient.get(`/admin/dashboard/customers/vip`),
      ])

      if (usersMetricsResponse.status === "fulfilled") {
          const response = usersMetricsResponse.value
          newMetrics.push(
              {
                  name: "totalCustomers",
                  title: "Total Customers",
                  value: response.data.totalUsers,
                  icon: Users,
                  color: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
              },
              {
                  name: "newCustomers",
                  title: "New Customers",
                  value: response.data.newUsers,
                  icon: UserPlus,
                  color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
              },
              {
                  name: "returningRate",
                  title: "Returning Rate",
                  value: response.data.returningRate + " " + "%",
                  icon: UserCheck,
                  color: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
              },
          )
          setUserMetrics(newMetrics)
          setStatus((status) => ({ ...status, stats: "success" }))
      } else {
          setStatus((status) => ({ ...status, stats: "error" }))
      }

      if (userTypesResponse.status === "fulfilled") {
          const response = userTypesResponse.value
          const userTypeColors = [
              { name: "New Customers", color: "#d7f148" },
              { name: "Returning Customers", color: "#8b5cf6" },
              { name: "VIP Customers", color: "#f59e0b" },
          ]
          const colorMappedUserTypes = response.data.userTypesDatas.map((type) => {
              const color = userTypeColors.find((userTypeColor) => userTypeColor.name === type.name).color
              return { ...type, color }
          })
          setuserTypeDatas(colorMappedUserTypes)
          setStatus((status) => ({ ...status, userTypeDatas: "success" }))
      } else {
          setStatus((status) => ({ ...status, userTypeDatas: "error" }))
      }

      if (userGrowthResponse.status === "fulfilled") {
          const response = userGrowthResponse.value
          setMonthlyUserGrowthDatas(response.data.monthlyUserGrowthData)
          setStatus((status) => ({ ...status, monthlyUserGrowthDatas: "success" }))
      } else {
          setStatus((status) => ({ ...status, monthlyUserGrowthDatas: "error" }))
      }

      if (vipCustomersRes.status === "fulfilled") {
          const response = vipCustomersRes.value
          setVipCustomersDatas(response.data.vipCustomerDatas)
          setStatus((status) => ({ ...status, vipCustomersDatas: "success" }))
      } else {
          setStatus((status) => ({ ...status, vipCustomersDatas: "error" }))
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
          userTypeDatas: "loading",
          monthlyUserGrowthDatas: "loading",
          vipCustomersDatas: "loading",
      })
      setFetchChartData(true)
  }
  
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >

      <h2 className="text-xl text-secondary font-bold flex items-center gap-[10px]">
        <span className={`w-fit whitespace-nowrap ${!showBusinessAnalytics.customers && 'text-muted'}`}> Customer Insights </span>
        <div className={`w-full flex items-center justify-between gap-[10px] rounded-[4px] cursor-pointer`}
            onClick={()=> togglerEnabled && setShowBusinessAnalytics(status=> ({...status, customers: !status.customers}))}>
          <hr className={`mt-[2px] w-full h-[2px] border-t border-inputBorderSecondary border-dashed shadow-sm
              ${!showBusinessAnalytics.customers && 'border-muted'}`}/>
          {
            showBusinessAnalytics.customers ?
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
        showBusinessAnalytics.customers &&
        <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} 
          exit={{opacity: 0, transition: { duration: 0.5, ease: "easeInOut" }}} transition={{type: 'spring', delay:0.2}}
            className="flex flex-col gap-[1.3rem]">

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4
                ${status.stats === "error" ? "h-[6.5rem] bg-white rounded-lg shadow-sm border" : ""}`}>
            {
              status.stats === 'success' ?
                userMetrics.map((stat, index)=> (
                    <motion.div
                      key={stat.title}
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div {...fadeInUp} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border
                ${dashboardQuery.trim() && 
                    !"New Customers vs Returning Customers vs VIP Customers".toLowerCase().trim().includes(dashboardQuery.trim()) 
                        ? "hidden" 
                        : "inline-block"}`}
            >
              <h3 className="text-[17px] font-semibold mb-6">New Customers vs Returning Customers vs VIP Customers</h3>
              <div className={`${status.userTypeDatas !== "error" ? "h-64" : "h-40"} relative`}>
                {
                  status.userTypeDatas !== 'loading'  ?
                    <ResponsiveContainer width="100%" height="100%">
                        {
                            status.userTypeDatas !== 'error' ?
                                <PieChart>
                                    <Pie
                                      data={userTypeDatas}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={60}
                                      outerRadius={80}
                                      fill="#8884d8"
                                      paddingAngle={5}
                                      dataKey="value"
                                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                      {userTypeDatas.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                      ))}
                                    </Pie>
                                    <Tooltip
                                      formatter={(value)=> [`${value}%`, "Percentage"]}
                                      contentStyle={{
                                        fontSize: '13px',
                                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                                        borderRadius: "6px",
                                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                        border: "none",
                                      }}
                                    />
                                    {
                                      userTypeDatas && 
                                      !userTypeDatas.every(data=> data.value === 0) &&
                                              <Legend  formatter={(value, entry, index)=> (
                                            <span style={{ fontSize: '13px', color: '#333' }}>{value}</span>
                                        )}/>
                                    }
                                </PieChart>
                            :
                                <ChartError refreshCharts={refreshCharts} />
                        }
                        {
                          status.userTypeDatas !== 'error' && userTypeDatas && 
                          ( userTypeDatas.length === 0 || userTypeDatas.every(data=> data.value === 0) ) &&
                              <p className='absolute top-0 w-full h-full flex items-center 
                                    justify-center text-muted font-medium tracking-[0.3px]'>
                                 No customers recorded! 
                              </p>
                        }
                    </ResponsiveContainer>
                    :   
                        <div className="w-full h-full skeleton-loader"/>
                }
              </div>
            </motion.div>
                  
            <motion.div {...fadeInUp} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border
                ${dashboardQuery.trim() && !"Customer Growth Over Time".toLowerCase().trim().includes(dashboardQuery.trim()) ? "hidden" : "inline-block"}`}>
              <h3 className="text-[17px] font-semibold mb-6">Customer Growth Over Time</h3>
              <div className={`${status.monthlyUserGrowthDatas !== "error" ? "h-64" : "h-40"} relative`}>
                {
                  status.monthlyUserGrowthDatas !== 'loading'  ?
                  <ResponsiveContainer width="100%" height="100%">
                    {
                        status.monthlyUserGrowthDatas !== 'error' ?
                            <LineChart data={monthlyUserGrowthDatas} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                              <YAxis tick={{ fontSize: 12 }} />
                              <Tooltip
                                formatter={(value) => [`${value.toLocaleString()}`, "Customers"]}
                                contentStyle={{
                                  fontSize: '13px',
                                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                                  borderRadius: "6px",
                                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                  border: "none",
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="customers"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                dot={{ r: 4, strokeWidth: 2 }}
                                activeDot={{ r: 6 }}
                              />
                            </LineChart>
                        :
                            <ChartError refreshCharts={refreshCharts} />
                    }
                    {monthlyUserGrowthDatas &&
                        status.monthlyUserGrowthDatas !== "error" &&
                        (monthlyUserGrowthDatas.length === 0 ||
                            monthlyUserGrowthDatas.every((data) => data.customers === 0)) && (
                            <p
                                className='absolute top-0 w-full h-full flex items-center justify-center
                              text-muted text-[13px] x-sm:text-[16px] font-medium tracking-[0.3px]'>
                                No new customers this year!
                        </p>
                    )}
                  </ResponsiveContainer>
                : 
                    <div className="w-full h-full skeleton-loader"/>
                }
              </div>
            </motion.div>
          </div>

          <motion.div {...fadeInUp} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border
                ${dashboardQuery.trim() && !"VIP Customers".toLowerCase().trim().includes(dashboardQuery.trim()) ? "hidden" : "inline-block"}`}>
            <div className="flex items-center mb-6">
              <Award className="text-amber-500 mr-2" size={20} />
              <h3 className="text-[17px] font-semibold">VIP Customers</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-sm">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Orders</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Total Spent</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  { status.vipCustomersDatas === 'success' && vipCustomersDatas.length > 0 ?
                        vipCustomersDatas.map((customer, index) => (
                          <motion.tr
                          className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="w-[20px] h-[20px] rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium mr-3">
                                {/* {customer.name.split(" ")[0][0]}
                                {customer.name.split(" ")[1][0]} */}
                                JJ
                              </div>
                              <span className='text-[15px]'>{customer.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-[15px]">{customer.orders}</td>
                          <td className="py-3 px-4 text-[15px]">${customer.spent.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <button className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium">
                              View Details
                            </button>
                          </td>
                        </motion.tr>
                        ))
                        : status.vipCustomersDatas === 'loading' ?
                            [...Array(5)].map((_, index)=> (
                              <motion.tr
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05, duration: 0.3 }}
                              className="skeleton-loader border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                              >
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <div className="invisible w-[20px] h-[20px] rounded-full bg-purple-100 flex items-center justify-center
                                   text-purple-600 font-medium mr-3">
                                    Customer profile
                                  </div>
                                  <span className='invisible text-[15px]'>Customer name</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-[15px]">
                                <span className='invisible'> customer total orders </span>
                              </td>
                              <td className="py-3 px-4 text-[15px]">
                                <span className='invisible'> customer total spent </span>  
                              </td>
                              <td className="py-3 px-4">
                                <button className="invisible text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400
                                 dark:hover:text-purple-300 font-medium">
                                  View Details
                                </button>
                              </td>
                            </motion.tr>
                            ))
                        : status.vipCustomersDatas === 'error' ?
                            <tr>
                                <td colSpan={4} >
                                    <div className='mt-[5rem]'>
                                        <ChartError refreshCharts={refreshCharts} />
                                    </div>
                                </td>
                            </tr>
                        : status.vipCustomersDatas !== 'loading' && status.vipCustomersDatas !== 'error' && vipCustomersDatas.length === 0 &&
                            <tr> 
                              <td colSpan={4} className='w-full h-[5rem] text-[15px] text-muted text-center font-medium tracking-[0.3px]'
                                style={{wordSpacing: '1px'}}>
                                  No VIP Customers Found!
                              </td>
                            </tr>
                            
                  }
                </tbody>
              </table>
            </div>
          </motion.div>

        </motion.div>
      }

      </AnimatePresence>
      
    </motion.section>
  )
}
