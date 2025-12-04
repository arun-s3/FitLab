import React from "react"
import {motion} from "framer-motion"

const TrendingIcon = () => (
  <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const ZapIcon = () => (
  <svg className="w-5 h-5 text-white/50" fill="currentColor" viewBox="0 0 24 24">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
)

const AwardIcon = () => (
  <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
    />
  </svg>
)

const CalendarIcon = () => (
  <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)

const mockStats = {
  week: {
    workoutsThisWeek: 4,
    totalVolumeWeek: 12500,
    caloriesBurned: 1840,
    currentStreak: 4,
  },
  month: {
    workoutsThisMonth: 16,
    totalVolumeMonth: 52000,
    caloriesBurned: 8200,
    currentStreak: 4,
  },
}

export default function StatsGrid({ timeRange }) {
    
  const stats = mockStats[timeRange]

  const statCards = [
    {
      label: "Workouts",
      value: timeRange === "week" ? stats.workoutsThisWeek : stats.workoutsThisMonth,
      icon: CalendarIcon,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Total Volume",
      value: `${(timeRange === "week" ? stats.totalVolumeWeek : stats.totalVolumeMonth) / 1000}k kg`,
      icon: TrendingIcon,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Calories Burned",
      value: stats.caloriesBurned,
      icon: ZapIcon,
      color: "from-orange-500 to-orange-600",
    },
    {
      label: "Current Streak",
      value: `${stats.currentStreak} days`,
      icon: AwardIcon,
      color: "from-green-500 to-green-600",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {statCards.map((card, i) => {
        const Icon = card.icon
        return (
          <motion.div
            key={i}
            variants={itemVariants}
            className={`bg-gradient-to-br ${card.color} rounded-xl p-6 border border-white/10 shadow-lg text-white`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white/70 font-semibold">{card.label}</h3>
              <Icon />
            </div>
            <p className="text-3xl font-bold">{card.value}</p>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
