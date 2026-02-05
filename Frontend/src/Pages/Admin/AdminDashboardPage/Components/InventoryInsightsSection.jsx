import React, {useContext, useState, useEffect} from 'react'
import './componentsStyle.css'
import {motion, AnimatePresence} from "framer-motion"

import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts"
import {Package, AlertTriangle, BarChart3, ChevronDown, ChevronUp} from "lucide-react"
import axios from 'axios'

import {OperationsAnalyticsContext} from '.././AdminDashboardPage'
import {useTogglerEnabled} from "../../../../Hooks/ToggleEnabler"
import ChartError from './ChartError'


export default function InventoryInsightsSection() {

  const {dashboardQuery, showOperationsAnalytics, setShowOperationsAnalytics} = useContext(OperationsAnalyticsContext)

  const togglerEnabled = useTogglerEnabled(showOperationsAnalytics, 'inventory')

  const [productStats, setProductStats] = useState([])
  const [lowStockDatas, setLowStockDatas] = useState([])
  const [categoryStockDatas, setCategoryStockDatas] = useState([])

  const [fetchChartData, setFetchChartData] = useState(true)

  const [status, setStatus] = useState({
      stats: "loading",
      lowStockDatas: "loading",
      categoryStockDatas: "loading",
  })

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL
  

  const fetchAllStats = async () => {
      const newStats = []

      const [productStockResponse, productLowStockResponse, categoryStockDatasResponse] = await Promise.allSettled([
          axios.get(`${baseApiUrl}/admin/dashboard/products/stock`, { withCredentials: true }),
          axios.get(`${baseApiUrl}/admin/dashboard/products/stock/low`, { withCredentials: true }),
          axios.get(`${baseApiUrl}/admin/dashboard/category/stock`, { withCredentials: true }),
      ])

      if (productStockResponse.status === "fulfilled") {
          const response = productStockResponse.value
          console.log("productStockResponse totalProducts----->", response.data.totalProducts)

          newStats.push(
              {
                  name: "totalProducts",
                  title: "Total Products",
                  value: response.data.totalProducts,
                  icon: Package,
                  color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
              },
              {
                  name: "lowStockItems",
                  title: "Low Stock Items",
                  value: response.data.outOfStockProducts,
                  icon: AlertTriangle,
                  color: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
              },
              {
                  name: "outOfStock",
                  title: "Out of Stock",
                  value: response.data.outOfStockProducts,
                  icon: BarChart3,
                  color: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
              },
          )
          console.log("newStats----->", newStats)

          setProductStats(newStats)
          setStatus((status) => ({ ...status, stats: "success" }))
      } else {
          console.log("Error in product stock response:", productStockResponse.reason.message)
          setStatus((status) => ({ ...status, stats: "error" }))
      }

      if (productLowStockResponse.status === "fulfilled") {
          const response = productLowStockResponse.value
          console.log("productLowStockResponse----->", response.data.lowStockDatas)
          setLowStockDatas(response.data.lowStockDatas)
          setStatus((status) => ({ ...status, lowStockDatas: "success" }))
      } else {
          console.log("Error in productLowStockResponse:", productLowStockResponse.reason.message)
          setStatus((status) => ({ ...status, lowStockDatas: "error" }))
      }

      if (categoryStockDatasResponse.status === "fulfilled") {
          const response = categoryStockDatasResponse.value
          console.log("categoryStockDatasResponse ----->", response.data.categoryStockDatas)
          setCategoryStockDatas(response.data.categoryStockDatas)
          setStatus((status) => ({ ...status, categoryStockDatas: "success" }))
      } else {
          console.log("Error in categoryStockDatas response:", categoryStockDatasResponse.reason.message)
          setStatus((status) => ({ ...status, categoryStockDatas: "error" }))
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
          ordersOverTime: "loading",
          mostPurchasedProducts: "loading",
          orderStatusDistribution: "loading",
      })
      setFetchChartData(true)
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  const getStockPercentage = (stock, threshold)=> {
    return Math.min((stock / threshold) * 100, 100)
  }

  const getStockColor = (stock, threshold) => {
    const percentage = (stock / threshold) * 100
    if (percentage <= 25) return "#ef4444" 
    if (percentage <= 50) return "#f59e0b" 
    return "#10b981" 
  }


  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-6"
    >

      <h2 className="text-xl text-secondary font-bold flex items-center gap-[10px]">
        <span className={`w-fit whitespace-nowrap ${!showOperationsAnalytics.inventory && 'text-muted'}`}> Inventory & Stock </span>
        <div className={`w-full flex items-center justify-between gap-[10px] rounded-[4px] cursor-pointer`}
            onClick={()=> togglerEnabled && setShowOperationsAnalytics(status=> ({...status, inventory: !status.inventory}))}>
          <hr className={`mt-[2px] w-full h-[2px] border-t border-inputBorderSecondary border-dashed shadow-sm
              ${!showOperationsAnalytics.inventory && 'border-muted'}`}/>
          {
            showOperationsAnalytics.inventory ?
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
          showOperationsAnalytics.inventory &&
          <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} 
            exit={{opacity: 0, transition: { duration: 0.5, ease: "easeInOut" }}} transition={{type: 'spring', delay:0.2}}
              className="flex flex-col gap-[1.3rem]">

            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4
                ${status.stats === "error" ? "h-[6.5rem] bg-white rounded-lg shadow-sm border" : ""}`}>
              {
                status.stats === 'success' ?
                    productStats.map((stat, index)=> (
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

            <motion.div {...fadeInUp} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border
                ${dashboardQuery.trim() && !"Low Stock Alerts".toLowerCase().trim().includes(dashboardQuery.trim()) ? "hidden" : "inline-block"}`}>
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
                      <th className="text-left py-3 px-4 font-semibold text-sm">Stock Level</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      status.lowStockDatas === 'success' && lowStockDatas.length > 0 ?
                        lowStockDatas.map((product, index)=> (
                          <motion.tr
                            key={product.name}
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
                            <td className="py-3 px-4 w-48">
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                                  <div
                                    className="h-2.5 rounded-full"
                                    style={{
                                      width: `${getStockPercentage(product.stock, 5)}%`,
                                      backgroundColor: getStockColor(product.stock, 5),
                                    }}
                                  ></div>
                                </div>
                                <span
                                  className="text-xs font-medium"
                                  style={{ color: getStockColor(product.stock, 5) }}
                                >
                                  {getStockPercentage(product.stock, 5).toFixed(0)}%
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <button className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium">
                                Restock
                              </button>
                            </td>
                          </motion.tr>
                        ))
                      : status.lowStockDatas === 'loading' ?
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
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 
                                      font-medium mr-3">
                                      <div className=' w-[16px] h-[16px]'/>
                                    </div>
                                    <span className='invisible text-[15px]'> Product name </span>
                                  </div>
                                </td>
                                <td className="invisible py-3 px-4 text-[15px]"> Product stock </td>
                                <td className="py-3 px-4 w-48">
                                  <div className="flex items-center">
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                                      <div className="h-2.5 rounded-full"></div>
                                    </div>
                                    <span className="invisible text-xs font-medium" >
                                      Product stock %
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <button className="invisible text-sm font-medium">
                                    Restock
                                  </button>
                                </td>
                              </motion.tr>
                            ))
                      : status.lowStockDatas === 'error' ?
                            <tr>
                                <td colSpan={4} >
                                    <div className='mt-[5rem]'>
                                        <ChartError refreshCharts={refreshCharts} />
                                    </div>
                                </td>
                            </tr>
                      : status.lowStockDatas !== 'loading' && status.lowStockDatas !== 'error' && lowStockDatas.length === 0 &&
                            <tr> 
                              <td colSpan={4} className='w-full h-[5rem] text-[15px] text-muted text-center font-medium tracking-[0.3px]'
                                style={{wordSpacing: '1px'}}>
                                  No low stock products found!
                              </td>
                            </tr>
                    }
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border
                ${dashboardQuery.trim() && !"Stock Distribution by Category".toLowerCase().trim().includes(dashboardQuery.trim()) 
                    ? "hidden" 
                    : "inline-block"}
                `}
            >
              <h3 className="text-[17px] font-semibold mb-6"> Stock Distribution by Category </h3>
              <div className={`${status.categoryStockDatas !== "error" ? "h-80" : "h-40"} relative`}>
                {
                  status.categoryStockDatas !== 'loading' ?
                    <ResponsiveContainer width="100%" height="100%">
                        {
                            status.categoryStockDatas !== 'error' ?
                                <BarChart
                                  data={categoryStockDatas}
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
                            :
                                <ChartError refreshCharts={refreshCharts} />
                        }
                    </ResponsiveContainer>
                : 
                    <div className="w-full h-full skeleton-loader"/>
                }
              </div>
            </motion.div>

          </motion.div>
        } 
       </AnimatePresence>

    </motion.section>
  )
}
