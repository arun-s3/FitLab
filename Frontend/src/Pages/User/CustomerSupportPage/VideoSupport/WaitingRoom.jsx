import React, { useState, useEffect } from "react"
import {useSelector} from 'react-redux'
import { motion } from "framer-motion"

import { Clock, Users, ChevronsLeftRightEllipsis, CheckCircle } from "lucide-react"


export default function WaitingRoom({ socketContextItems, onCallStart, onEndCall}) {
  const [waitTime, setWaitTime] = useState(0)
  const [queuePosition, setQueuePosition] = useState(null)

  const [isConnected, setIsConnected] = useState(false)

  const {userToken} = useSelector((state)=> state.user)

  const {socket, userId, username, messages, newMessage, isTyping, messagesEndRef, handleSendMessage, handleTyping} = socketContextItems
  console.log("socket--->", socket)



  useEffect(() => {
    console.log("socket from WaitingRoom-->", socket)
    if(socket){

      if(userId){
        console.log("Emiting joinQueue,  userId-->", userId)
        socket.emit("joinQueue", {userId, username})

        socket.on("JoinedQueue", ()=> setIsConnected(true))

        socket.on("queueUpdate", (data) => {
          console.log("Inside on queueUpdate...")
          setQueuePosition(data.position)
          setWaitTime(data.estimatedWaitTime)
        })

        socket.on("callReady", (data) => {
          console.log("Inside on callReady...")
          onCallStart(data.sessionId)
        })

      }
      return () => {
        socket.off("queueUpdate")
        socket.off("callReady")
      }
    }
  }, [onCallStart, socket])

  const cancelCall = ()=> {
     socket.emit("leaveQueue")
     onEndCall()
  }
  

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl"></div>

      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 text-center">
        <div className="absolute top-4 right-4 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-purple-200/30 rounded-full blur-xl"></div>

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
          className="text-[30px] font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
        >
          You're in the waiting room
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8 text-[15px] leading-relaxed"
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
              className="bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-4 rounded-2xl border border-blue-200/50"
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
            className="bg-gradient-to-br from-green-50 to-emerald-100 px-6 py-4 rounded-2xl border border-green-200/50"
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
          className="flex items-center justify-center space-x-2 mb-[1.3rem] text-green-600"
        >
          <ChevronsLeftRightEllipsis className={`h-[27px] w-[27px] ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
          <span className="text-[14px] font-medium"> 
            {isConnected ? 'Connected and ready' : 'Connection Error'} 
          </span>
          <CheckCircle className="h-[17px] w-[17px]" />
        </motion.div>

        {/* Cancel button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center"
        >
            <button className="group relative overflow-hidden bg-red-50 text-red-600 hover:bg-gradient-to-r
             hover:from-red-500 hover:to-red-400 hover:text-white py-3 px-8 rounded-full font-semibold
               border border-red-200 hover:border-transparent transition-all duration-300
                transform hover:scale-105 shadow-lg hover:shadow-xl">

            <span className="relative z-10" onClick={cancelCall}> Cancel Request </span>
            {/* <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}
