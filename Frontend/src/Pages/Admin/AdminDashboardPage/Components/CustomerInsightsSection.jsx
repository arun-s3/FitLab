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
import { Users, UserPlus, UserCheck, Award, ChevronDown, ChevronUp } from "lucide-react"

import {AnalyticsContext} from '.././AdminDashboardPage'
import { useTogglerEnabled } from "../../../../Hooks/ToggleEnabler"

const customerTypeData = [
  { name: "New Customers", value: 35, color: "#d7f148" },
  { name: "Returning Customers", value: 65, color: "#8b5cf6" },
]

const customerGrowthData = [
  { name: "Jan", customers: 1250 },
  { name: "Feb", customers: 1380 },
  { name: "Mar", customers: 1490 },
  { name: "Apr", customers: 1620 },
  { name: "May", customers: 1740 },
  { name: "Jun", customers: 1890 },
  { name: "Jul", customers: 2050 },
  { name: "Aug", customers: 2180 },
  { name: "Sep", customers: 2340 },
  { name: "Oct", customers: 2490 },
  { name: "Nov", customers: 2650 },
  { name: "Dec", customers: 2820 },
]

const vipCustomersData = [
  { name: "John D.", orders: 24, spent: 4850 },
  { name: "Sarah M.", orders: 18, spent: 3720 },
  { name: "Robert K.", orders: 15, spent: 3150 },
  { name: "Emily L.", orders: 12, spent: 2640 },
  { name: "Michael P.", orders: 10, spent: 2100 },
]

export default function CustomerInsightsSection() {

  const {dateRange, showAnalytics, setShowAnalytics} = useContext(AnalyticsContext)

  const togglerEnabled = useTogglerEnabled(showAnalytics, 'customers')
  

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
        <span className={`w-fit whitespace-nowrap ${!showAnalytics.customers && 'text-muted'}`}> Customer Insights </span>
        <div className={`w-full flex items-center justify-between gap-[10px] rounded-[4px] cursor-pointer`}
            onClick={()=> togglerEnabled && setShowAnalytics(status=> ({...status, customers: !status.customers}))}>
          <hr className={`mt-[2px] w-full h-[2px] border-t border-inputBorderSecondary border-dashed shadow-sm
              ${!showAnalytics.customers && 'border-muted'}`}/>
          {
            showAnalytics.customers ?
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
        showAnalytics.customers &&
        <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} 
          exit={{opacity: 0, transition: { duration: 0.5, ease: "easeInOut" }}} transition={{type: 'spring', delay:0.2}}
            className="flex flex-col gap-[1.3rem]">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Total Customers",
                value: "2,820",
                icon: Users,
                color: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
              },
              {
                title: "New Customers",
                value: "168",
                icon: UserPlus,
                color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
              },
              {
                title: "Returning Rate",
                value: "65%",
                icon: UserCheck,
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <h3 className="text-[17px] font-semibold mb-6">New vs Returning Customers</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {customerTypeData.map((entry, index) => (
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
                  
            <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <h3 className="text-[17px] font-semibold mb-6">Customer Growth Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={customerGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
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
                  {vipCustomersData.map((customer, index) => (
                    <motion.tr
                      key={customer.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-[20px] h-[20px] rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium mr-3">
                            {customer.name.split(" ")[0][0]}
                            {customer.name.split(" ")[1][0]}
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
