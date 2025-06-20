import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, Users, Wifi, CheckCircle } from "lucide-react"
// import { socket } from "@/lib/socket"

export default function WaitingRoom({ onCallStart }) {
  const [waitTime, setWaitTime] = useState(0)
  const [queuePosition, setQueuePosition] = useState(null)

  useEffect(() => {
    // Connect to socket when entering waiting room
    socket.connect()

    // Request to join the queue
    socket.emit("joinQueue", { userId: "user-123" }) // In a real app, use actual user ID

    // Listen for queue updates
    socket.on("queueUpdate", (data) => {
      setQueuePosition(data.position)
      setWaitTime(data.estimatedWaitTime)
    })

    // Listen for call ready event
    socket.on("callReady", (data) => {
      onCallStart(data.sessionId)
    })

    // Cleanup on unmount
    return () => {
      socket.off("queueUpdate")
      socket.off("callReady")
    }
  }, [onCallStart])

  // For demo purposes, simulate a call after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onCallStart("demo-session-123")
    }, 10000)

    return () => clearTimeout(timer)
  }, [onCallStart])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl"></div>

      {/* Main content */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 text-center">
        {/* Animated background elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-purple-200/30 rounded-full blur-xl"></div>

        {/* Status indicator */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          className="relative w-32 h-32 mx-auto mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full"></div>
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Clock className="h-12 w-12 text-blue-600" />
            </motion.div>
          </div>

          {/* Pulse rings */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="absolute inset-0 bg-blue-400 rounded-full"
          ></motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
        >
          You're in the waiting room
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8 text-lg leading-relaxed"
        >
          An expert will join you shortly. Please stay on this page while we connect you.
        </motion.p>

        {/* Status cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {queuePosition && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl border border-blue-200/50"
            >
              <div className="flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-blue-600 mr-2" />
                <span className="text-blue-800 font-semibold">Queue Position</span>
              </div>
              <div className="text-3xl font-bold text-blue-600">{queuePosition}</div>
              <p className="text-blue-700/70 text-sm mt-1">in line</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border border-green-200/50"
          >
            <div className="flex items-center justify-center mb-3">
              <Clock className="h-6 w-6 text-green-600 mr-2" />
              <span className="text-green-800 font-semibold">Estimated Wait</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{waitTime || "~2"}</div>
            <p className="text-green-700/70 text-sm mt-1">minutes</p>
          </motion.div>
        </div>

        {/* Connection status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center space-x-2 mb-8 text-green-600"
        >
          <Wifi className="h-5 w-5" />
          <span className="font-medium">Connected and ready</span>
          <CheckCircle className="h-5 w-5" />
        </motion.div>

        {/* Cancel button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center"
        >
          <button className="group relative overflow-hidden bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-500 hover:to-pink-500 text-red-600 hover:text-white py-3 px-8 rounded-full font-semibold border border-red-200 hover:border-transparent transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <span className="relative z-10">Cancel Request</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}
