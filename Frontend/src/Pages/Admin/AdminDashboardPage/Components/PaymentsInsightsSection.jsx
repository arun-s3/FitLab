import React, {useContext, useState, useEffect} from 'react'
import './componentsStyle.css'
import { motion, AnimatePresence } from "framer-motion"

import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

import { CreditCard, RefreshCcw, IndianRupee, ArrowDown, ChevronUp, ChevronDown, ArrowUp } from "lucide-react"

import apiClient from '../../../../Api/apiClient'

import {OperationsAnalyticsContext} from '.././AdminDashboardPage'
import { useTogglerEnabled } from "../../../../Hooks/ToggleEnabler"
import ChartError from './ChartError'


export default function PaymentsInsightsSection() {

  const {dashboardQuery, showOperationsAnalytics, setShowOperationsAnalytics} = useContext(OperationsAnalyticsContext)

  const togglerEnabled = useTogglerEnabled(showOperationsAnalytics, 'payments')

  const [paymentStats, setPaymentStats] = useState([])
  const [paymentMethodsDatas, setPaymentMethodsDatas] = useState([])
  const [refundRequestDatas, setRefundRequestDatas] = useState([])

  const [locationDatas, setLocationDatas] = useState([])

  const [fetchChartData, setFetchChartData] = useState(true)
      
  const [status, setStatus] = useState({
      stats: "loading",
      paymentMethodsDatas: "loading",
      refundRequestDatas: "loading",
  })
  
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  const fetchAllStats = async () => {
      const newStats = []

      const [paymentStatsResponse, paymentMethodResponse, refundRequestRes] = await Promise.allSettled([
          apiClient.get(`/admin/dashboard/payments/stats`),
          apiClient.get(`/admin/dashboard/payments/methods`),
          apiClient.get(`/admin/dashboard/payments/refunds`),
      ])

      if (paymentStatsResponse.status === "fulfilled") {
          const response = paymentStatsResponse.value
          const changePercent = parseInt(response.data.refundChangePercent)

          const changeValue =
              changePercent !== 0 && changePercent !== "N/A"
                  ? (changePercent > 0 ? "+" : "-") + " " + changePercent + "%"
                  : "0 %"
          newStats.push(
              {
                  name: "totalWalletPayments",
                  title: "Total Wallet Payments",
                  value: "₹" + " " + response.data.totalWalletPayments,
                  icon: IndianRupee,
                  color: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
              },
              {
                  name: "refundAmount",
                  title: "Refund Amount",
                  value: "₹" + " " + response.data.totalRefund,
                  change: changeValue,
                  icon: RefreshCcw,
                  trend: changePercent >= 0 || changePercent === "N/A" ? "up" : "down",
                  color:
                      changePercent >= 0 || changePercent === "N/A"
                          ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
              },
              {
                  name: "refundRate",
                  title: "Refund Rate",
                  value: response.data.refundRate + " " + "%",
                  icon: CreditCard,
                  color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
              },
          )
          setPaymentStats(newStats)
          setStatus((status) => ({ ...status, stats: "success" }))
      } else {
          setStatus((status) => ({ ...status, stats: "error" }))
      }

      if (paymentMethodResponse.status === "fulfilled") {
          const response = paymentMethodResponse.value
          setPaymentMethodsDatas(response.data.paymentMethodDatas)
          setStatus((status) => ({ ...status, paymentMethodsDatas: "success" }))
      } else {
          setStatus((status) => ({ ...status, paymentMethodsDatas: "error" }))
      }

      if (refundRequestRes.status === "fulfilled") {
          const response = refundRequestRes.value
          setRefundRequestDatas(response.data.refundRequestDatas)
          setStatus((status) => ({ ...status, refundRequestDatas: "success" }))
      } else {
          setStatus((status) => ({ ...status, refundRequestDatas: "error" }))
      }

      await apiClient
          .get(`/admin/dashboard/payments/customers-by-state`)
          .then((res) => setLocationDatas(res.data))
          .catch((err) => console.error(err))
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
          paymentMethodsDatas: "loading",
          refundRequestDatas: "loading",
      })
      setFetchChartData(true)
  }
  

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="space-y-6"
    >

      <h2 className="text-xl text-secondary font-bold flex items-center gap-[10px]">
        <span className={`w-fit whitespace-nowrap ${!showOperationsAnalytics.payments && 'text-muted'}`}> Payments & Refunds </span>
        <div className={`w-full flex items-center justify-between gap-[10px] rounded-[4px] cursor-pointer`}
            onClick={()=> togglerEnabled && setShowOperationsAnalytics(status=> ({...status, payments: !status.payments}))}>
          <hr className={`mt-[2px] w-full h-[2px] border-t border-inputBorderSecondary border-dashed shadow-sm
              ${!showOperationsAnalytics.payments && 'border-muted'}`}/>
          {
            showOperationsAnalytics.payments ?
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
          showOperationsAnalytics.payments &&
          <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} 
            exit={{opacity: 0, transition: { duration: 0.5, ease: "easeInOut" }}} transition={{type: 'spring', delay:0.2}}
              className={`flex flex-col gap-[1.3rem]`}>

            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4
                ${status.stats === "error" ? "h-[6.5rem] bg-white rounded-lg shadow-sm border" : ""}`}>
              {
                status.stats === 'success' ?
                    paymentStats.map((stat, index)=> (
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
                              <span className="flex items-center text-sm text-green-500">
                                {
                                  parseInt(stat.change) >= 0 ? <ArrowUp size={14} className="text-green-500" /> 
                                    : <ArrowDown size={14} className="text-red-500" />
                                }
                                <span className={`text-[12px] ${parseInt(stat.change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                  {stat.change}
                                </span>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <motion.div {...fadeInUp} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border
                ${dashboardQuery.trim() && !"Payment Methods Usage".toLowerCase().trim().includes(dashboardQuery.trim()) ? "hidden" : "inline-block"}`}>
                <h3 className="text-[17px] font-semibold mb-6">Payment Methods Usage</h3>
                <div className={`${status.paymentMethodsDatas !== "error" ? "h-64" : "h-40"} relative`}>
                  {
                    status.paymentMethodsDatas !== 'loading' ?
                        <ResponsiveContainer width="100%" height="100%">
                            {
                                status.paymentMethodsDatas !== 'error' ?
                                    <PieChart>
                                      <Pie
                                        data={paymentMethodsDatas}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                      >
                                        {paymentMethodsDatas.map((entry, index) => (
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
                                        paymentMethodsDatas && 
                                        !paymentMethodsDatas.every(data=> data.value === 0) &&
                                            <Legend  formatter={(value, entry, index)=> (
                                              <span style={{ fontSize: '13px', color: '#333' }}>{value}</span>
                                        )}   />
                                      }
                                    </PieChart>
                                :
                                    <ChartError refreshCharts={refreshCharts} />
                            }
                            {
                              status.paymentMethodsDatas !== 'error' && paymentMethodsDatas && 
                              ( paymentMethodsDatas.length === 0 || paymentMethodsDatas.every(data=> data.value === 0) ) &&
                                  <p className='absolute top-0 w-full h-full flex items-center 
                                        justify-center text-muted  text-[13px] sm:text-[16px] font-medium tracking-[0.3px]'>
                                     No payments made by any customers yet! 
                                  </p>
                            }
                        </ResponsiveContainer>
                  : 
                    <div className="w-full h-full skeleton-loader"/>
                  }
                </div>
              </motion.div>
                    
              <motion.div {...fadeInUp} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border
                    ${dashboardQuery.trim() && !"Refund Requests".toLowerCase().trim().includes(dashboardQuery.trim()) ? "hidden" : "inline-block"}`}>
                <h3 className="text-[17px] font-semibold mb-6">Refund Requests</h3>
                <div className={`${status.refundRequestDatas !== "error" ? "h-64" : "h-40"} relative`}>
                  {
                    status.refundRequestDatas !== 'loading' ?
                        <ResponsiveContainer width="100%" height="100%">
                            {
                                status.refundRequestDatas !== 'error' ?
                                    <LineChart
                                      data={refundRequestDatas}
                                      margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                      }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                      <XAxis dataKey="name" tick={{fontSize: 13}}/>
                                      <YAxis yAxisId="left" orientation="left" stroke="#ef4444" tick={{fontSize: 13}}/>
                                      <YAxis yAxisId="right" orientation="right" stroke="#f97316" tick={{fontSize: 13}}/>
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
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="requests"
                                        name="Requests"
                                        stroke="#9f2af0"
                                        strokeWidth={3}
                                        dot={{ r: 4, strokeWidth: 2 }}
                                        activeDot={{ r: 6 }}
                                      />
                                      <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="amount"
                                        name="Amount (₹)"
                                        stroke="#f1c40f"
                                        strokeWidth={3}
                                        dot={{ r: 4, strokeWidth: 2 }}
                                        activeDot={{ r: 6 }}
                                      />
                                    </LineChart>
                                :
                                    <ChartError refreshCharts={refreshCharts} />
                            }
                            {
                              status.refundRequestDatas !== 'error' && refundRequestDatas && 
                              ( refundRequestDatas.length === 0 || refundRequestDatas.every(data=> 
                                data.requests === 0 && data.amount === 0
                              ) ) &&
                                  <p className='absolute top-[8.7rem] w-full h-full flex items-center 
                                        justify-center text-muted text-[13px] sm:text-[14px] font-medium tracking-[0.3px]'>
                                     No refunds made by any customers yet this year! 
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
