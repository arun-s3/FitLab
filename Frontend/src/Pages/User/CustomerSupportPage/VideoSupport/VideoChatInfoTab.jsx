import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { PhoneOff, Video, VideoOff, Mic, MicOff, Minimize2, Maximize2, User, Clock } from "lucide-react"


export default function VideoChatInfoTab({ startVideoCall, declineVideoCall }) {

  const [callState, setCallState] = useState("incoming")
  const [isMinimized, setIsMinimized] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScheduled, setIsScheduled] = useState(true)

  useEffect(() => {
    let interval
    if (callState === "active") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callState])

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAcceptCall = () => {
    setCallState("active")
    setCallDuration(0)
    startVideoCall()
  }

  const handleDeclineCall = () => {
    declineVideoCall()
    setCallState("ended")
    setTimeout(() => setCallState("hidden"), 2000)
  }

  const handleEndCall = () => {
    setCallState("ended")
    setTimeout(() => setCallState("hidden"), 2000)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const showIncomingCall = () => {
    setCallState("incoming")
    setCallDuration(0)
    setIsMinimized(false)
    setIsMuted(false)
    setIsVideoOff(false)
  }


  return (
    <AnimatePresence>
      {callState !== "hidden" && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="z-50 bg-white shadow-lg border-b"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              animate={{ height: isMinimized ? 60 : "auto" }}
              transition={{ duration: 0.3 }}
            >
              {callState === "incoming" && (
                <div className="py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                        className="relative"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <motion.div
                          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          className="absolute inset-0 bg-purple-300 rounded-full"
                        />
                      </motion.div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-[17px] font-semibold text-gray-900">Customer Care</h3>
                          {isScheduled && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Scheduled
                            </span>
                          )}
                        </div>
                        <p className="text-[14px] text-gray-600">
                          {isScheduled ? "Your scheduled support call" : "Incoming support call"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDeclineCall}
                        className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors z-[100]"
                      >
                        <PhoneOff className="w-5 h-5" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                        onClick={handleAcceptCall}
                        className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white transition-colors"
                      >
                        <Video className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

              {callState === "active" && (
                <div className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-base font-semibold text-gray-900">Customer Care</h3>
                          <div className="flex items-center space-x-1">
                            <motion.div
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                              className="w-2 h-2 bg-green-500 rounded-full"
                            />
                            <span className="text-sm text-gray-600">{formatDuration(callDuration)}</span>
                          </div>
                        </div>
                        {!isMinimized && <p className="text-[14px] text-gray-500">Call in progress</p>}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {callState === "ended" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                      <PhoneOff className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-600">Call ended</span>
                    <span className="text-sm text-gray-500">Duration: {formatDuration(callDuration)}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
