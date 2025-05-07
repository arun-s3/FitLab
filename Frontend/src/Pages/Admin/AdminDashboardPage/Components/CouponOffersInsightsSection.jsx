import React, {useContext} from 'react'
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
import { Tag, Percent, TrendingUp, ArrowUp, ChevronUp, ChevronDown } from "lucide-react"

import {OperationsAnalyticsContext} from '.././AdminDashboardPage'
import { useTogglerEnabled } from "../../../../Hooks/ToggleEnabler"


// Sample data
const couponRedemptionsData = [
  { name: "NEWYEAR25", redemptions: 145, revenue: 8700 },
  { name: "SUMMER20", redemptions: 120, revenue: 7200 },
  { name: "FLASH30", redemptions: 95, revenue: 5700 },
  { name: "WELCOME15", redemptions: 85, revenue: 5100 },
  { name: "LOYALTY10", redemptions: 75, revenue: 4500 },
]

const discountImpactData = [
  { name: "Jan", withDiscount: 28500, withoutDiscount: 22800 },
  { name: "Feb", withDiscount: 31200, withoutDiscount: 24960 },
  { name: "Mar", withDiscount: 29800, withoutDiscount: 23840 },
  { name: "Apr", withDiscount: 32500, withoutDiscount: 26000 },
  { name: "May", withDiscount: 35100, withoutDiscount: 28080 },
  { name: "Jun", withDiscount: 38700, withoutDiscount: 30960 },
  { name: "Jul", withDiscount: 42300, withoutDiscount: 33840 },
  { name: "Aug", withDiscount: 45800, withoutDiscount: 36640 },
  { name: "Sep", withDiscount: 48200, withoutDiscount: 38560 },
  { name: "Oct", withDiscount: 52500, withoutDiscount: 42000 },
  { name: "Nov", withDiscount: 58700, withoutDiscount: 46960 },
  { name: "Dec", withDiscount: 65200, withoutDiscount: 52160 },
]

export default function CouponOffersInsightsSection() {

  const {dateRange, showOperationsAnalytics, setShowOperationsAnalytics} = useContext(OperationsAnalyticsContext)

  const togglerEnabled = useTogglerEnabled(showOperationsAnalytics, 'couponOffers')


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
        <span className={`w-fit whitespace-nowrap ${!showOperationsAnalytics.couponOffers && 'text-muted'}`}> Offers & Coupon Usage </span>
        <div className={`w-full flex items-center justify-between gap-[10px] rounded-[4px] cursor-pointer`}
            onClick={()=> togglerEnabled && setShowOperationsAnalytics(status=> ({...status, couponOffers: !status.couponOffers}))}>
          <hr className={`mt-[2px] w-full h-[2px] border-t border-inputBorderSecondary border-dashed shadow-sm
              ${!showOperationsAnalytics.couponOffers && 'border-muted'}`}/>
          {
            showOperationsAnalytics.couponOffers ?
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
          showOperationsAnalytics.couponOffers &&
          <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} 
            exit={{opacity: 0, transition: { duration: 0.5, ease: "easeInOut" }}} transition={{type: 'spring', delay:0.2}}
              className="flex flex-col gap-[1.3rem]">

            {/* Offers stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Discount Revenue",
                  value: "₹31,200",
                  change: "+18.5%",
                  trend: "up",
                  icon: TrendingUp,
                  color: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
                },
                {
                  title: "Active Promotions",
                  value: "8",
                  icon: Tag,
                  color: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
                },
                {
                  title: "Coupon Redemptions",
                  value: "520",
                  icon: Percent,
                  color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
                }
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
                      {stat.change && (
                        <div className="flex items-center mt-1">
                          <span className="flex items-center text-[12px] text-green-500">
                            <ArrowUp size={14} />
                            {stat.change}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last period</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Coupon Redemptions */}
            <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <h3 className="text-[17px] font-semibold mb-6">Coupon Redemptions</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={couponRedemptionsData}
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
              </div>
            </motion.div>

            {/* Discount Impact on Sales */}
            <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <h3 className="text-[17px] font-semibold mb-6">Discount Impact on Sales</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={discountImpactData}
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
              </div>
            </motion.div>

          </motion.div>
        }
      </AnimatePresence>

    </motion.section>
  )
}
