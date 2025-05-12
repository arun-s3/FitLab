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
import { CreditCard, RefreshCcw, IndianRupee, ArrowDown, ChevronUp, ChevronDown } from "lucide-react"
import axios from 'axios'

import {OperationsAnalyticsContext} from '.././AdminDashboardPage'
import { useTogglerEnabled } from "../../../../Hooks/ToggleEnabler"


export default function PaymentsInsightsSection() {

  const {dateRange, showOperationsAnalytics, setShowOperationsAnalytics} = useContext(OperationsAnalyticsContext)

  const togglerEnabled = useTogglerEnabled(showOperationsAnalytics, 'payments')

  const [paymentStats, setPaymentStats] = useState([])
  const [paymentMethodsDatas, setPaymentMethodsDatas] = useState([])
  const [refundRequestDatas, setRefundRequestDatas] = useState([])
  

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }


  useEffect(()=> {
          const fetchAllStats = async ()=> {
            const newStats = []

            const [paymentStatsResponse, paymentMethodResponse, refundRequestRes] = await Promise.allSettled([
              axios.get('http://localhost:3000/admin/dashboard/payments/stats', { withCredentials: true }), 
              axios.get('http://localhost:3000/admin/dashboard/payments/methods', { withCredentials: true }), 
              axios.get('http://localhost:3000/admin/dashboard/payments/refunds', { withCredentials: true }), 
            ])
  
            if (paymentStatsResponse.status === 'fulfilled'){
              const response = paymentStatsResponse.value
              console.log("paymentStatsResponse totalWalletPayments----->", response.data.totalWalletPayments)

              const changeValue = response.data.refundChangePercent && response.data.refundChangePercent !== 'N/A' ? 
                                        (response.data.refundChangePercent > 0  ? "+" : "-") + " " + response.data.refundChangePercent + '%'
                                          : 'N/A'

              newStats.push({
                name: "totalWalletPayments",
                title: "Total Wallet Payments",
                value: '₹' + ' ' + response.data.totalWalletPayments,
                icon: IndianRupee,
                color: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              },
              {
                name: "refundAmount",
                title: "Refund Amount",
                value: '₹' + ' ' + response.data.totalRefund,
                change: changeValue,
                icon: RefreshCcw,
                trend: response.data.refundChangePercent > 0 || response.data.refundChangePercent === 'N/A' ? 'up' : 'down',
                color: response.data.refundChangePercent > 0 || response.data.refundChangePercent === 'N/A' 
                          ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
              },
              {
                name: "refundRate",
                title: "Refund Rate",
                value: response.data.refundRate + ' ' + '%',
                icon: CreditCard,
                color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              })
              console.log('newStats----->', newStats)
    
              setPaymentStats(newStats)
            }
            else{
              console.log("Error in payment stats response:", paymentStatsResponse.reason.message)
            }

            if(paymentMethodResponse.status === 'fulfilled'){
              const response = paymentMethodResponse.value 
              console.log("paymentMethodResponse----->", response.data.paymentMethodDatas) 
              setPaymentMethodsDatas(response.data.paymentMethodDatas)
            }
            else{
              console.log("Error in paymentMethodResponse:", paymentMethodResponse.reason.message)
            }
  
            if (refundRequestRes.status === 'fulfilled'){
              const response = refundRequestRes.value
              console.log("refundRequestRes ----->", response.data.refundRequestDatas) 
              setRefundRequestDatas(response.data.refundRequestDatas)
            }
            else{
              console.log("Error in refundRequestRes response:", refundRequestRes.reason.message)
            }
          }
        
          fetchAllStats();
  }, [])
  


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
              className="flex flex-col gap-[1.3rem]">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {
                paymentStats && paymentStats.length > 0 ?
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
                            <ArrowDown size={14} className="text-red-500" />
                            <span className="text-[12px] text-red-500">{stat.change}</span>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
                <h3 className="text-[17px] font-semibold mb-6">Payment Methods Usage</h3>
                <div className="h-64">
                  {
                    paymentMethodsDatas && paymentMethodsDatas.length > 0 ?
                    <ResponsiveContainer width="100%" height="100%">
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
                      <Legend  formatter={(value, entry, index)=> (
                          <span style={{ fontSize: '13px', color: '#333' }}>{value}</span>
                      )}/>
                    </PieChart>
                  </ResponsiveContainer>
                  : <div className="w-full h-full skeleton-loader"/>
                  }
                </div>
              </motion.div>
                    
              <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
                <h3 className="text-[17px] font-semibold mb-6">Refund Requests</h3>
                <div className="h-64">
                  {
                    refundRequestDatas && refundRequestDatas.length > 0 ?
                    <ResponsiveContainer width="100%" height="100%">
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
                  </ResponsiveContainer>
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
