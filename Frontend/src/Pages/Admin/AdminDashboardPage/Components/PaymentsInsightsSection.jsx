import React, {useContext} from 'react'
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

import {OperationsAnalyticsContext} from '.././AdminDashboardPage'
import { useTogglerEnabled } from "../../../../Hooks/ToggleEnabler"


// Sample data
const paymentMethodsData = [
  { name: "Stripe", value: 45, color: "#9f2af0" },
  { name: "PayPal", value: 25, color: "#dab3f6" },
  { name: "Razorpay", value: 15, color: "#d7f148" },
  { name: "Wallet", value: 10, color: "#f1c40f" },
  { name: "Cash On Delivery", value: 5, color: "#7d7c8c" },
]

const refundRequestsData = [
  { name: "Jan", requests: 12, amount: 720 },
  { name: "Feb", requests: 15, amount: 900 },
  { name: "Mar", requests: 10, amount: 600 },
  { name: "Apr", requests: 14, amount: 840 },
  { name: "May", requests: 18, amount: 1080 },
  { name: "Jun", requests: 16, amount: 960 },
  { name: "Jul", requests: 20, amount: 1200 },
  { name: "Aug", requests: 22, amount: 1320 },
  { name: "Sep", requests: 18, amount: 1080 },
  { name: "Oct", requests: 16, amount: 960 },
  { name: "Nov", requests: 14, amount: 840 },
  { name: "Dec", requests: 12, amount: 720 },
]

const recentRefundsData = [
  {
    id: "REF-001",
    customer: "John D.",
    product: "Premium Dumbbells Set",
    amount: 129.99,
    date: "2023-05-12",
    status: "Approved",
  },
  {
    id: "REF-002",
    customer: "Sarah M.",
    product: "Fitness Tracker",
    amount: 89.99,
    date: "2023-05-10",
    status: "Pending",
  },
  {
    id: "REF-003",
    customer: "Robert K.",
    product: "Protein Powder (2kg)",
    amount: 59.99,
    date: "2023-05-08",
    status: "Approved",
  },
  {
    id: "REF-004",
    customer: "Emily L.",
    product: "Yoga Mat Pro",
    amount: 45.99,
    date: "2023-05-05",
    status: "Rejected",
  },
]

export default function PaymentsInsightsSection() {

  const {dateRange, showOperationsAnalytics, setShowOperationsAnalytics} = useContext(OperationsAnalyticsContext)

  const togglerEnabled = useTogglerEnabled(showOperationsAnalytics, 'payments')
  

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-500 bg-green-50 dark:bg-green-900/20"
      case "Pending":
        return "text-amber-500 bg-amber-50 dark:bg-amber-900/20"
      case "Rejected":
        return "text-red-500 bg-red-50 dark:bg-red-900/20"
      default:
        return "text-gray-500 bg-gray-50 dark:bg-gray-900/20"
    }
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
              className="flex flex-col gap-[1.3rem]">

            {/* Payment stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Total Payments",
                  value: "₹286,400",
                  icon: IndianRupee,
                  color: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
                },
                {
                  title: "Refund Amount",
                  value: "₹10,220",
                  change: "-2.5%",
                  trend: "down",
                  icon: RefreshCcw,
                  color: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
                },
                {
                  title: "Refund Rate",
                  value: "3.6%",
                  icon: CreditCard,
                  color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
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
                      {stat.change && (
                        <div className="flex items-center mt-1">
                          <span className="flex items-center text-sm text-green-500">
                            <ArrowDown size={14} className="text-red-500" />
                            <span className="text-[12px] text-red-500">{stat.change}</span>
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last period</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Methods Usage */}
              <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
                <h3 className="text-[17px] font-semibold mb-6">Payment Methods Usage</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {paymentMethodsData.map((entry, index) => (
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
                    
              {/* Refund Requests */}
              <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
                <h3 className="text-[17px] font-semibold mb-6">Refund Requests</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={refundRequestsData}
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
                </div>
              </motion.div>
            </div>

            {/* Recent Refunds */}
            <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <h3 className="text-[17px] font-semibold mb-6">Recent Refund Requests</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-sm">ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Product</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRefundsData.map((refund, index) => (
                      <motion.tr
                        key={refund.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="py-3 px-4 text-[15px] font-medium">{refund.id}</td>
                        <td className="py-3 px-4 text-[15px]">{refund.customer}</td>
                        <td className="py-3 px-4 text-[15px]">{refund.product}</td>
                        <td className="py-3 px-4 text-[15px]">₹{refund.amount}</td>
                        <td className="py-3 px-4 text-[15px]">{refund.date}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              refund.status,
                            )}`}
                          >
                            {refund.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium">
                            View Details
                          </button>
                        </td>
                      </motion.tr>
                    ))}
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
