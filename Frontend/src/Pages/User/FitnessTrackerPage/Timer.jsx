import React,{ useState, useEffect } from "react"
import { motion } from "framer-motion"

const PauseIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
)

const PlayIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
)

export default function Timer({ onSetComplete }) {
    
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60

  return (
    <motion.div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-300 text-center">
      <p className="text-gray-600 font-semibold text-sm mb-3">Set Duration</p>
      <motion.div
        className="text-5xl font-bold text-blue-600 mb-4"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
      >
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </motion.div>

      <div className="flex gap-2">
        <motion.button
          onClick={() => setIsRunning(!isRunning)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isRunning ? <PauseIcon /> : <PlayIcon />}
          <span>{isRunning ? "Pause" : "Resume"}</span>
        </motion.button>
      </div>
    </motion.div>
  )
}
