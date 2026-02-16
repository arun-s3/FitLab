import React, { useState, useEffect, useContext } from "react"
import { motion } from "framer-motion"

import VideoChat from "./VideoSupport/VideoChat"
import RequestForm from "./VideoSupport/RequestForm"
import WaitingRoom from "./VideoSupport/WaitingRoom"
import ScheduleModal from "./VideoSupport/ScheduleModal"
import CallDeclinedModal from "./VideoSupport/CallDeclinedModal"
import {SocketContext} from '../../../Components/SocketProvider/SocketProvider'


export default function VideoSupportModule() {

  const [requestType, setRequestType] = useState(null)
  const [isWaiting, setIsWaiting] = useState(false)
  const [inCall, setInCall] = useState(false)
  const [callData, setCallData] = useState(null)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)

  const [isAdminBusy, setIsAdminBusy] = useState(false)

  const [isCallDeclinedModalOpen, setIsCallDeclinedModalOpen] = useState(false)

  const [scheduledCallReceived, setScheduledCallReceived] = useState(false)

  const socketContextItems = useContext(SocketContext)
  const {socket, userId, openVideoCallModal, scheduledVideoCallSessionId, forceEndScheduledSession, setForceEndScheduledSession} = socketContextItems

  const handleImmediateRequest = () => {
    setRequestType("immediate")
    setIsWaiting(true)
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
    setScheduledCallReceived(false)
  }

  const handleCallDeclined = () => {
    setIsCallDeclinedModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsCallDeclinedModalOpen(false)
  }

  useEffect(()=> {
    if(socket){
      socket.on("sessionEnded", () => {
        handleEndCall()
      })

      socket.on("callDeclined", (message) => {
        handleCallDeclined()
        handleEndCall()
      })

      socket.on("currentAdminStatus", ({adminId, status})=> {
        if(status === 'busy'){
          setIsAdminBusy(true)
        }else setIsAdminBusy(false)
      }) 

      return ()=> {
        socket.off("sessionEnded")
        socket.off("currentAdminStatus")
      }
    }
  }, [socket])

  useEffect(()=> {
    if(scheduledVideoCallSessionId){
      setScheduledCallReceived(true)
    }else setScheduledCallReceived(false)
  }, [isAdminBusy, scheduledVideoCallSessionId])

  useEffect(()=> {
    if(forceEndScheduledSession){
      handleEndCall()
      setForceEndScheduledSession(false)
    }
  }, [forceEndScheduledSession])


  return (
    <div className="min-h-screen w-[56rem] p-4 md:p-8" id='VideoSupportModule'>
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

        {!requestType && !inCall && !scheduledCallReceived && (
          <RequestForm onImmediateRequest={handleImmediateRequest} onScheduleRequest={()=> setIsScheduleModalOpen(true)} />
        )}

        {
          requestType === "immediate" && isWaiting && !scheduledCallReceived &&
          <WaitingRoom socketContextItems={socketContextItems} isAdminBusy={isAdminBusy} onCallStart={handleCallStart} onEndCall={handleEndCall} />
        }

        {
          (inCall || scheduledCallReceived) &&
          <VideoChat socketContextItems={socketContextItems} ImmediateVideoCallsessionId={callData?.sessionId} scheduledCallReceived={scheduledCallReceived}
            scheduledVideoCallSessionId={scheduledVideoCallSessionId} onEndCall={handleEndCall} />
        }

        <ScheduleModal userId={userId} isOpen={isScheduleModalOpen} onClose={()=> setIsScheduleModalOpen(false)} />

        <CallDeclinedModal isOpen={isCallDeclinedModalOpen} onClose={handleCloseModal} />

      </motion.div>
    </div>
  )
}
