import React, { useState, useEffect, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { useTogglerEnabled } from "../../../../Hooks/ToggleEnabler"

import {
  AreaChart,
  Area,
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
import { ArrowUp, ArrowDown, IndianRupee, TrendingUp, ShoppingBag, ChevronDown, ChevronUp } from "lucide-react"

import {AnalyticsContext} from '.././AdminDashboardPage'

const revenueData = [
  { name: "Jan", revenue: 12400 },
  { name: "Feb", revenue: 15600 },
  { name: "Mar", revenue: 14200 },
  { name: "Apr", revenue: 18900 },
  { name: "May", revenue: 21500 },
  { name: "Jun", revenue: 25800 },
  { name: "Jul", revenue: 26100 },
  { name: "Aug", revenue: 28400 },
  { name: "Sep", revenue: 27300 },
  { name: "Oct", revenue: 29800 },
  { name: "Nov", revenue: 32100 },
  { name: "Dec", revenue: 35600 },
]

const categoryData = [
  { name: "Cardio Equipment", value: 35 },
  { name: "Strength Training", value: 30 },
  { name: "Supplements", value: 20 },
  { name: "Accessories", value: 15 },
]

const aovData = [
  { name: "Jan", aov: 85 },
  { name: "Feb", aov: 87 },
  { name: "Mar", aov: 84 },
  { name: "Apr", aov: 92 },
  { name: "May", aov: 95 },
  { name: "Jun", aov: 98 },
  { name: "Jul", aov: 102 },
  { name: "Aug", aov: 105 },
  { name: "Sep", aov: 108 },
  { name: "Oct", aov: 112 },
  { name: "Nov", aov: 115 },
  { name: "Dec", aov: 120 },
]

const COLORS = ["#8b5cf6", "#cb8ef5", "#f1c40f", "#d7f148"]

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name })=> {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#333"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={13} 
      fontWeight="bold"
    >
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};


export default function SalesRevenueSection() {
  const [activeTab, setActiveTab] = useState("daily")

  const {dateRange, showAnalytics, setShowAnalytics} = useContext(AnalyticsContext)

  const togglerEnabled = useTogglerEnabled(showAnalytics, 'sales')

  const stats = [
    {
      title: "Total Revenue",
      value: "₹286,400",
      change: "+12.5%",
      trend: "up",
      icon: IndianRupee,
      color: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      title: "Average Order Value",
      value: "₹98.50",
      change: "+5.2%",
      trend: "up",
      icon: TrendingUp,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      title: "Total Orders",
      value: "2,845",
      change: "-2.3%",
      trend: "down",
      icon: ShoppingBag,
      color: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    },
  ]

  const tabs = [
    { id: "daily", label: "Daily" },
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
  ]

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-xl text-secondary font-bold flex items-center gap-[10px]">
        <span className={`w-fit whitespace-nowrap ${!showAnalytics.sales && 'text-muted'}`}>  Sales & Revenue Analysis  </span>
        <div className={`w-full flex items-center justify-between gap-[10px] rounded-[4px] cursor-pointer`}
            onClick={()=> setShowAnalytics(status=> ({...status, sales: !status.sales}))}>
          <hr className={`mt-[2px] w-full h-[2px] border-t border-inputBorderSecondary border-dashed shadow-sm
              ${!showAnalytics.sales && 'border-muted'} `}/>
          {
             showAnalytics.sales ?
            <ChevronUp className={`p-[2px] w-[18px] h-[18px] text-muted border border-secondary rounded-[3px]
             hover:border-purple-800 hover:text-secondary hover:bg-inputBorderSecondary hover:transition
              hover:duration-150 hover:delay-75 hover:ease-in ${!togglerEnabled && 'hidden'} `}/>
            :<ChevronDown className={`p-[2px] w-[18px] h-[18px] text-muted border border-secondary rounded-[3px]
             hover:border-purple-800 hover:text-secondary hover:bg-inputBorderSecondary hover:transition
              hover:duration-150 hover:delay-75 hover:ease-in ${!togglerEnabled && 'hidden'} `}/>
          }
        </div>
      </h2>
      
      <AnimatePresence>
      {
        showAnalytics.sales &&
        <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} 
          exit={{opacity: 0, transition: { duration: 0.5, ease: "easeInOut" }}} transition={{type: 'spring', delay:0.2}}>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border ${index === 0 && 'border-primary'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400">{stat.title}</p>
                    <h3 className="text-[20px] font-bold mt-1">{stat.value}</h3>
                    <div className="flex items-center mt-1">
                      <span
                        className={`flex items-center text-[12px] ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}
                      >
                        {stat.trend === "up" ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last period</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon size={17} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <h3 className="text-[17px] font-semibold">Revenue Trends</h3>
              <div className="flex mt-2 sm:mt-0 bg-gray-100 dark:bg-gray-700 rounded-md p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      activeTab === tab.id ? "bg-white dark:bg-gray-600 shadow-sm" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${value.toLocaleString()}`} />
                  <Tooltip
                    formatter={(value)=> [`₹${value.toLocaleString()}`, "Revenue"]}
                    contentStyle={{
                      fontSize: '13px',
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "6px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      border: "none",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
                  
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <h3 className="text-[17px] font-semibold mb-6">Revenue by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={true}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
              <h3 className="text-[17p] font-semibold mb-6">Average Order Value</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={aovData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                      domain={["dataMin - 10", "dataMax + 10"]}
                    />
                    <Tooltip
                      formatter={(value) => [`$${value}`, "AOV"]}
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
                      dataKey="aov"
                      // stroke="#d7f148"
                      stroke='#9f2af0'
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
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
