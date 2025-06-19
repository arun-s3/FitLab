import React, { useState } from "react"
import { motion } from "framer-motion"
import VideoChat from "./VideoSupport/VideoChat"
import RequestForm from "./VideoSupport/RequestForm"
import WaitingRoom from "./VideoSupport/WaitingRoom"
import ScheduleForm from "./VideoSupport/ScheduleForm"

export default function VideoSupportModule() {
  const [requestType, setRequestType] = useState(null) 
  const [isWaiting, setIsWaiting] = useState(false)
  const [inCall, setInCall] = useState(false)
  const [callData, setCallData] = useState(null)

  const handleImmediateRequest = () => {
    setRequestType("immediate")
    setIsWaiting(true)
  }

  const handleScheduleRequest = (scheduledTime) => {
    setRequestType("scheduled")
    setCallData(scheduledTime)
  }

  const handleCallStart = (sessionId) => {
    setIsWaiting(false)
    setInCall(true)
    setCallData({ sessionId })
  }

  const handleEndCall = () => {
    setInCall(false)
    setRequestType(null)
    setCallData(null)
  }

  return (
    <div className="min-h-screen p-4 md:p-8" id='VideoSupportModule'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <header className="mb-8">
          <motion.h1
            className="text-3xl md:text-4xl text-secondary font-bold text-gray-800 tracking-[0.3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Customer Assistance
          </motion.h1>
          <motion.p
            className="text-gray-600 text-[14px] mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Connect with our 24/7 customer service cell for personalized assistance
          </motion.p>
        </header>

        {!requestType && !inCall && (
          <RequestForm
            onImmediateRequest={handleImmediateRequest}
            onScheduleRequest={() => setRequestType("scheduled")}
          />
        )}

        {requestType === "immediate" && isWaiting && <WaitingRoom onCallStart={handleCallStart} />}

        {requestType === "scheduled" && !inCall && <ScheduleForm onSchedule={handleScheduleRequest} />}

        {inCall && <VideoChat sessionId={callData?.sessionId} onEndCall={handleEndCall} />}
      </motion.div>
    </div>
  )
}
