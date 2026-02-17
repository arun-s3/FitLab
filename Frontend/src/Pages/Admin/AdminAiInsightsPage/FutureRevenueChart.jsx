import React from "react"
import './FutureRevenueChart.css'
import { motion } from "framer-motion"

import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts"


export default function FutureRevenueChart({monthlyRevenueTrends, parentFetchError}){

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }


  return (

      <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h3 className="text-[17px] font-semibold">Estimated Future Revenue Trends</h3>
        </div>
        <div className={!parentFetchError && 'h-80'}>
        { !parentFetchError && monthlyRevenueTrends && monthlyRevenueTrends.length > 0 ?
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyRevenueTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
          : 
            !parentFetchError &&
              <div className="w-full h-full skeleton-loader"/>
        }

        {
          parentFetchError && 
            <p className="w-full text-[13px] text-red-500 text-center tracking-[0.4px]">
              {parentFetchError}
            </p>
        }

        </div>
      </motion.div>

  )
}


