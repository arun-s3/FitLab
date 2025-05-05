import React, {useContext} from 'react'
import { motion, AnimatePresence } from "framer-motion"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Package, AlertTriangle, BarChart3, ChevronDown, ChevronUp } from "lucide-react"

import {AnalyticsContext} from '.././AdminDashboardPage'
import { useTogglerEnabled } from "../../../../Hooks/ToggleEnabler"

// Sample data
const lowStockData = [
  { name: "Premium Dumbbells Set", stock: 5, threshold: 10 },
  { name: "Resistance Bands Pack", stock: 3, threshold: 15 },
  { name: "Protein Powder (2kg)", stock: 8, threshold: 20 },
  { name: "Yoga Mat Pro", stock: 4, threshold: 10 },
  { name: "Fitness Tracker", stock: 2, threshold: 8 },
]

const stockDistributionData = [
  {
    name: "Cardio Equipment",
    inStock: 45,
    lowStock: 5,
    outOfStock: 2,
  },
  {
    name: "Strength Training",
    inStock: 38,
    lowStock: 8,
    outOfStock: 4,
  },
  {
    name: "Supplements",
    inStock: 65,
    lowStock: 12,
    outOfStock: 3,
  },
  {
    name: "Accessories",
    inStock: 52,
    lowStock: 7,
    outOfStock: 1,
  },
  {
    name: "Apparel",
    inStock: 78,
    lowStock: 10,
    outOfStock: 5,
  },
]

export default function InventoryInsightsSection() {

  const {dateRange, showAnalytics, setShowAnalytics} = useContext(AnalyticsContext)

  const togglerEnabled = useTogglerEnabled(showAnalytics, 'inventory')


  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  // Calculate stock level percentage for the progress bar
  const getStockPercentage = (stock, threshold) => {
    return Math.min((stock / threshold) * 100, 100)
  }

  // Determine color based on stock level
  const getStockColor = (stock, threshold) => {
    const percentage = (stock / threshold) * 100
    if (percentage <= 25) return "#ef4444" // Red for critical
    if (percentage <= 50) return "#f59e0b" // Amber for warning
    return "#10b981" // Green for good
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-6"
    >

      <h2 className="text-xl text-secondary font-bold flex items-center gap-[10px]">
        <span className={`w-fit whitespace-nowrap ${!showAnalytics.inventory && 'text-muted'}`}> Inventory & Stock </span>
        <div className={`w-full flex items-center justify-between gap-[10px] rounded-[4px] cursor-pointer`}
            onClick={()=> togglerEnabled && setShowAnalytics(status=> ({...status, inventory: !status.inventory}))}>
          <hr className={`mt-[2px] w-full h-[2px] border-t border-inputBorderSecondary border-dashed shadow-sm
              ${!showAnalytics.inventory && 'border-muted'}`}/>
          {
            showAnalytics.inventory ?
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
          showAnalytics.inventory &&
          <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} 
            exit={{opacity: 0, transition: { duration: 0.5, ease: "easeInOut" }}} transition={{type: 'spring', delay:0.2}}
              className="flex flex-col gap-[1.3rem]">

                  {/* Inventory stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Total Products",
                  value: "248",
                  icon: Package,
                  color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
                },
                {
                  title: "Low Stock Items",
                  value: "32",
                  icon: AlertTriangle,
                  color: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
                },
                {
                  title: "Out of Stock",
                  value: "15",
                  icon: BarChart3,
                  color: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
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

            {/* Low Stock Alerts */}
            <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-6">
                <AlertTriangle className="text-amber-500 mr-2" size={20} />
                <h3 className="text-[17px] font-semibold">Low Stock Alerts</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-sm">Product</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Current Stock</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Threshold</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Stock Level</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockData.map((product, index) => (
                      <motion.tr
                        key={product.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium mr-3">
                              <Package size={16} />
                            </div>
                            <span className='text-[15px]'>{product.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[15px]">{product.stock}</td>
                        <td className="py-3 px-4 text-[15px]">{product.threshold}</td>
                        <td className="py-3 px-4 w-48">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                              <div
                                className="h-2.5 rounded-full"
                                style={{
                                  width: `${getStockPercentage(product.stock, product.threshold)}%`,
                                  backgroundColor: getStockColor(product.stock, product.threshold),
                                }}
                              ></div>
                            </div>
                            <span
                              className="text-xs font-medium"
                              style={{ color: getStockColor(product.stock, product.threshold) }}
                            >
                              {getStockPercentage(product.stock, product.threshold).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium">
                            Restock
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Stock Distribution by Category */}
            <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <h3 className="text-[17px] font-semibold mb-6">Stock Distribution by Category</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stockDistributionData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{fontSize: 13}}/>
                    <YAxis tick={{fontSize: 13}}/>
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
                    <Bar dataKey="inStock" name="In Stock" stackId="a" fill="#10b981" />
                    <Bar dataKey="lowStock" name="Low Stock" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="outOfStock" name="Out of Stock" stackId="a" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

          </motion.div>
        } 
       </AnimatePresence>

    </motion.section>
  )
}
