import React from "react"
import { motion } from "framer-motion"

import {X} from "lucide-react"


const ClockIcon = () => (
  <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const DumbbellIcon = () => (
  <svg className="w-6 h-6 text-primaryDark" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4 6h2v12H4V6zm14 0h2v12h-2V6zM8 7h8v10H8V7z" />
  </svg>
)

const FlameIcon = () => (
  <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2c-1.1 0-2 .9-2 2 0 2.3 1.97 4.9 2 5 .03-.1 2-2.7 2-5 0-1.1-.9-2-2-2zm0 10c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z" />
  </svg>
)

const TrendingIcon = () => (
  <svg className="w-6 h-6 text-primaryDark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const WarningIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </svg>
)

export default function WorkoutSummaryModal({ stats, onClose }) {
    
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
  }

  const modalVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { delay: 0.1, duration: 0.3 },
    },
  }

  const statVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: { delay: 0.2 + i * 0.1 },
    }),
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-[12px] p-8 border border-gray-200 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[28px] tacking-[0.5px] font-bold text-gray-900">Workout Complete!</h2>
          <motion.button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            whileHover={{ rotate: 90, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <X className="size-5 text-slate-600 dark:text-slate-400" />
          </motion.button>
        </div>

        <div className="mb-6">
          <StatCard
            icon={ClockIcon}
            label="Duration"
            value={formatTime(stats.duration)}
            textColor="text-secondary"
            iconBg="bg-purple-50"
            custom={0}
            variants={statVariants}
          />
          <StatCard
            icon={DumbbellIcon}
            label="Total Volume"
            value={`${stats.totalVolume.toLocaleString()} kg`}
            textColor="text-primaryDark"
            iconBg="bg-yellow-50"
            custom={1}
            variants={statVariants}
          />
          <StatCard
            icon={FlameIcon}
            label="Est. Calories"
            value={`~ ${stats.estimatedCalories} kcal`}
            textColor="text-secondary"
            iconBg="bg-purple-50"
            custom={2}
            variants={statVariants}
          />
          <StatCard
            icon={TrendingIcon}
            label="Total Reps"
            value={stats.totalReps}
            textColor="text-primaryDark"
            iconBg="bg-yellow-50"
            custom={3}
            variants={statVariants}
          />
        </div>

        {stats.missedSets && stats.missedSets.length > 0 && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-amber-50 rounded-lg p-4 border border-amber-200 mb-6"
          >
            <div className="flex items-start gap-2 mb-3">
              <WarningIcon className="text-amber-600 flex-shrink-0 mt-0.5" />
              <h3 className="text-amber-900 font-semibold text-sm">Incomplete Sets</h3>
            </div>
            <div className="space-y-1">
              {stats.missedSets.map((missed, idx) => (
                <p key={idx} className="text-amber-700 text-xs capitalize">
                  {missed.exerciseName} - Set {missed.set} of {missed.totalSets}
                </p>
              ))}
            </div>
          </motion.div>
        )}

        <motion.button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

function StatCard({ icon: Icon, label, value, textColor, iconBg, custom, variants }) {
  return (
    <motion.div
      custom={custom}
      variants={variants}
      initial="hidden"
      animate="visible"
      className={`bg-gradient-to-r rounded-lg p-[12px] flex items-center gap-4`}
    >
      <div className={`rounded-lg p-3 flex-shrink-0 ${iconBg && iconBg}`}>
        <Icon className={`${textColor && textColor}`}/>
      </div>
      <div>
        <p className="text-muted text-sm">{label}</p>
        <p className={`text-lg ${textColor && textColor} font-bold`}>{value}</p>
      </div>
    </motion.div>
  )
}
