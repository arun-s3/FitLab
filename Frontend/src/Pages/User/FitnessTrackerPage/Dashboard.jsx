import React, {useState} from "react"
import {motion} from "framer-motion"

import MonthlyWeeklyChart from "./MonthlyWeeklyCharts"
import StatsGrid from "./StatsGrid"
import DashboardAiInsights from "./AiModules/DashboardAiInsights"


export default function Dashboard() {

  const [timeRange, setTimeRange] = useState("week")

  const [dashboardDatas, setDashboardDatas] = useState(null)

  const tempSaveForAiInsight = (dataType, datas)=> {
    setDashboardDatas(dashboardDatas=> (
      {...dashboardDatas, [dataType]: datas}
    ))
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.div
        className="flex gap-3"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <button
          onClick={() => setTimeRange("week")}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            timeRange === "week"
              ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => setTimeRange("month")}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            timeRange === "month"
              ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          This Month 
        </button>
      </motion.div>

      <StatsGrid timeRange={timeRange} />

      <motion.div  
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <MonthlyWeeklyChart title="Workout Frequency" dataKey="workouts" timeRange={timeRange} onFetchedDatas={tempSaveForAiInsight}/>
        <MonthlyWeeklyChart title="Total Volume Lifted" dataKey="volume" timeRange={timeRange} onFetchedDatas={tempSaveForAiInsight}/>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <MonthlyWeeklyChart title="Calories Burned Over Time" dataKey="calories" timeRange={timeRange} />
        <MonthlyWeeklyChart title="Weight Progress" dataKey="weight" timeRange={timeRange} onFetchedDatas={tempSaveForAiInsight}/>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <MonthlyWeeklyChart title="Health Progress" dataKey="health" timeRange={timeRange} />
        <MonthlyWeeklyChart title="Exercise Breakdown" dataKey="exerciseBreakdown" timeRange={timeRange} onFetchedDatas={tempSaveForAiInsight}/>
      </motion.div>

      <div className="mt-6">
      
        <DashboardAiInsights receivedSourceDatas={dashboardDatas}/>
      
      </div>

    </motion.div>
  )
}
