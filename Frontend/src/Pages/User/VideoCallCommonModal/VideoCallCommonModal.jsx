import React, { useState, useEffect, useContext } from "react"
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from "framer-motion"

import { PhoneOff, Video, Headset, Clock, Calendar, X, Dumbbell, Weight } from "lucide-react"

import {SocketContext} from '../../../Components/SocketProvider/SocketProvider'



export default function VideoCallModal({videoSessionInfo, onClose}) {

  const [isVisible, setIsVisible] = useState(true)
  const [callState, setCallState] = useState("incoming")
  const [isScheduled, setIsScheduled] = useState(true)
  const [callerInfo, setCallerInfo] = useState({})

  const navigate = useNavigate()
  const location = useLocation()

  const socketContextItems = useContext(SocketContext)
  const {socket, forceEndScheduledSession, setForceEndScheduledSession, scheduledVideoCallSessionId} = socketContextItems
  

  useEffect(()=> {
    console.log("videoSessionInfo---->", videoSessionInfo)
    if(videoSessionInfo && Object.keys(videoSessionInfo).length > 0){
      setCallerInfo({
        name: "Fitness Expert",
        subjectLine: videoSessionInfo?.subjectLine || "",
        customerNotes: videoSessionInfo?.notes || ""
      })
    }
  }, [videoSessionInfo])

  useEffect(()=> {
    console.log("callerInfo--->", callerInfo)
    if(location.pathname === '/support'){
      onClose()
    }
  }, [callerInfo, location])

  const showIncomingCall = (scheduled = true) => {
    setIsScheduled(scheduled)
    setCallState("incoming")
    setIsVisible(true)
  }

  const handleAcceptCall = () => {
    navigate('/support')
    onClose()
  }

  const handleDeclineCall = () => {
    console.log("Emiting leaveScheduledSession...")
    socket.emit("leaveScheduledSession", { sessionId: scheduledVideoCallSessionId })
    setForceEndScheduledSession(true)
    setCallState("declined")
    setTimeout(() => {
      setIsVisible(false)
      setCallState("incoming")
      onClose()
    }, 2500)
  }

  const handleScheduleCall = () => {
    window.location.href = "/schedule-call"
  }

  const handleCloseModal = () => {
    setCallState("incoming")
  }


  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={callState === "declined" ? handleCloseModal : undefined}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {callState === "incoming" && (
                <div className="relative">
                  {!isScheduled && (
                    <button
                      onClick={handleCloseModal}
                      className="absolute top-4 right-4 z-10 w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  )}

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 px-6 pt-8 pb-6 text-white relative overflow-hidden">
                    <motion.div
                      animate={{
                        y: [-10, 10, -10],
                        rotate: [0, 5, -5, 0],
                        opacity: [0.1, 0.2, 0.1],
                      }}
                      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                      className="absolute -top-5 -right-8 text-white opacity-10"
                    >
                      <Dumbbell className="w-16 h-16" />
                    </motion.div>

                    <motion.div
                      animate={{
                        y: [10, -10, 10],
                        rotate: [0, -5, 5, 0],
                        opacity: [0.1, 0.15, 0.1],
                      }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                      className="absolute -bottom-3 -left-6 text-white opacity-10"
                    >
                      <Dumbbell className="w-12 h-12" />
                    </motion.div>

                    <motion.div
                      className="absolute top-1/2 left-0 right-0 h-0.5 bg-white opacity-20"
                      animate={{
                        scaleX: [0, 1, 0],
                        opacity: [0, 0.3, 0],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />


                    <div className="relative z-10 text-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="relative inline-block mb-4"
                      >
                        <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Headset className="w-10 h-10 text-white" />
                        </div>
                        <motion.div
                          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          className="absolute inset-0 border-2 border-white rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                          className="absolute inset-0 border border-white rounded-full"
                        />
                      </motion.div>

                          <h2 className="text-2xl font-bold mb-1">{callerInfo.name}</h2>
                          <p className="text-blue-100 mb-3">{callerInfo.subjectLine}</p>

                      <div className="inline-flex items-center space-x-1 bg-white bg-opacity-20 rounded-full px-3 py-1 backdrop-blur-sm">
                        {isScheduled ? (
                          <>
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">Scheduled Consultation</span>
                          </>
                        ) : (
                          <>
                            <Video className="w-4 h-4" />
                            <span className="text-sm font-medium">Fitness Support Call</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50">
                    <div className="text-center">
                      <p className="text-gray-600 text-sm mb-1">
                        {isScheduled 
                          ? `Your scheduled call on ${callerInfo.subjectLine} is ready to begin`
                          : "Our customer expert would like to help you with your concerns"
                        }
                      </p>
                      {isScheduled && (
                        <div className={`${callerInfo.customerNotes ? 'flex flex-col gap-4' : 'mt-4'}`}>
                          <p className={`text-xs text-muted`}>Get personalized advice for all your concerns!</p>
                          {
                            callerInfo?.customerNotes &&
                            <p className="ml-[18px] text-left text-xs text-gray-400">
                              <span className="text-secondary"> Your Notes: </span>
                                 { callerInfo.customerNotes.length > 40 ? callerInfo.customerNotes.slice(0,40) + '...' : callerInfo.customerNotes } 
                            </p> 
                          }
                        </div>
                      )} 
                    </div>
                  </div>

                  <div className="px-6 py-6 bg-white">
                    <div className="flex space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDeclineCall}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <PhoneOff className="w-5 h-5" />
                        <span>Decline</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        animate={{
                          boxShadow: [
                            "0 0 0 0 rgba(34, 197, 94, 0.4)",
                            "0 0 0 10px rgba(34, 197, 94, 0)",
                            "0 0 0 0 rgba(34, 197, 94, 0)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        onClick={handleAcceptCall}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <Video className="w-5 h-5" />
                        <span>Join Call</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

              {callState === "declined" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PhoneOff className="w-8 h-8 text-red-500" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Declined</h3>
                  <p className="text-gray-600 mb-6">
                    You've declined the call from our {callerInfo.name} team.
                    {!isScheduled &&
                      " If you'd like to schedule a fitness consultation for later, you can book one below."}
                  </p>

                  <div className="space-y-3">
                    {!isScheduled && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleScheduleCall}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <Calendar className="w-5 h-5" />
                        <span>Schedule Fitness Consultation</span>
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCloseModal}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors"
                    >
                      Close
                    </motion.button>
                  </div>

                  {/* Auto close indicator */}
                  <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-3 h-3 border border-gray-300 border-t-gray-500 rounded-full"
                    />
                    <span>This will close automatically in a few seconds</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
