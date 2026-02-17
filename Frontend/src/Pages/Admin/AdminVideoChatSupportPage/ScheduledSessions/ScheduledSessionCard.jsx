import React, {useState, useEffect} from "react"
import { motion } from "framer-motion"

import { User, Clock, Video, Circle, PhoneOff, MessageSquare, Calendar, AlertCircle } from "lucide-react"


export default function ScheduledSessionCard({ session, onStartCall, onEndCall, socket, currentScheduledSession }) {

  const [canStartCall, setCanStartCall] = useState(false)
  const [isUrgent, setIsUrgent] = useState(false)

  const [timeInfo, setTimeInfo] = useState({})

  const [isCalling, setIsCalling] = useState(false) 

  const [disableCall, setDisableCall] = useState(false)

  const formatDate = (date)=> {
    return new Date(date).toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const getTimeUntilSession = () => {
    const diffMins = Math.floor(session.timeRemainingMs / (1000 * 60))
    if (diffMins < 0) {
      return { text: `${Math.abs(diffMins)}m ago`, color: "text-red-600", urgent: true }
    } else if (diffMins < 15) {
      return { text: `in ${diffMins}m`, color: "text-orange-600", urgent: true }
    } else if (diffMins < 60) {
      return { text: `in ${diffMins}m`, color: "text-blue-600", urgent: false }
    } else {
      const hours = Math.floor(diffMins / 60)
      return { text: `in ${hours}h ${diffMins % 60}m`, color: "text-gray-600", urgent: false }
      }
  }

  useEffect(()=> {
    if(socket){
      socket.on("stoppedSupportCalling", ()=> {
        setIsCalling(false)
      })
      socket.on("userDeclinedScheduledSession", (sessionId) => {
        setIsCalling(false)
      })
    }
    return ()=> {
      socket.off("stoppedSupportCalling")
      socket.off("userDeclinedScheduledSession")
    }
  }, [socket])

  useEffect(()=> {
    if(Object.keys(session).length > 0){
      if(session?.timeRemaining){
        const timeInfoObj = getTimeUntilSession()
        setTimeInfo(timeInfoObj)
        if(session.isUserActive && session.timeRemainingMs){
          setCanStartCall(true)
        }
        if(timeInfoObj && timeInfoObj?.urgent && session.status === "upcoming"){
          setIsUrgent(true)
        }
        setIsUrgent(Object.keys(timeInfoObj).length > 0 ? timeInfo.urgent && session.status === "upcoming" : false)
      }
    }

    return ()=> setTimeInfo({})
  }, [session.scheduledDate])

  useEffect(()=> {
    if(currentScheduledSession && currentScheduledSession._id !== session._id){
      setDisableCall(true)
    }else setDisableCall(false)
  }, [currentScheduledSession])

  useEffect(()=> {
  }, [disableCall])

  const getStatusColor = () => {
    switch (session.status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "missed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const startOrStopCall = ()=> {
    if(!isCalling){
      onStartCall()
      setIsCalling(true)
    }else{
      onEndCall()
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.1 }}
      className={`bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border-2 transition-all duration-300 ${
        isUrgent
          ? "border-orange-200 shadow-lg shadow-orange-100"
          : isCalling ? "border-green-300 shadow-green-100" : "border-gray-200 hover:border-purple-300 hover:shadow-lg"
      } `}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-inputBorderLow rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    session.isUserActive ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 flex items-center">
                  {session.userId.username}
                  {session.isUserActive && <Circle className="ml-2 h-2 w-2 text-green-500 fill-current" />}
                </h3>
                <p className="text-[13px] text-gray-600">{session.userId.email}</p>
                <div className="flex items-center gap-[10px] mt-1">
                  {session.subjectLine && <span className="text-[13px] text-purple-600 font-medium">{session.subjectLine}</span> }
                  {
                    (
                      ()=> {
                        const statusColor = getStatusColor()
                        return(
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                            {session.status}
                          </span>
                        )
                      }
                    )()
                  }
                </div>
              </div>
            </div>

            {isUrgent && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                className="flex items-center space-x-1 bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium"
              >
                <AlertCircle className="h-3 w-3" />
                <span>Starting Soon</span>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(session.scheduledDate)}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{session.scheduledTime}</span>
            </div>
            {
              timeInfo && Object.keys(timeInfo).length > 0 &&
              <div className={`flex items-center space-x-2 text-sm font-medium ${timeInfo.color}`}>
                <Clock className="h-4 w-4" />
                <span>{timeInfo.text}</span>
              </div>
            }
          </div>

          {session.notes && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-[13px] text-gray-700">
                <span className="font-medium">Notes:</span> {session.notes.length > 60 ? session.notes.slice(0,50) + '...' : session.notes}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-8 space-x-3 mt-4 lg:mt-0 lg:ml-6">
          <div className="text-center">
            <div
              className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                session.isUserActive ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`}
            ></div>
            <span className="text-[11px] text-gray-500">{session.isUserActive ? "Online" : "Offline"}</span>
          </div>

          <div className="flex gap-[5px] space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-300"
            >
              <MessageSquare className="h-4 w-4" />
            </motion.button>

            {session.timeRemainingMs &&
              <motion.button
                whileHover={{ scale: session.isUserActive ? 1.05 : 1 }}
                whileTap={{ scale: session.isUserActive ? 0.95 : 1 }}
                onClick={session.isUserActive ? startOrStopCall : undefined}
                disabled={!session.isUserActive ? true : disableCall ? true : false}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  !session.isUserActive
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : disableCall 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : `bg-gradient-to-r ${isCalling ? 'from-red-400 to-red-500 hover:from-red-500 hover:to-red-600' : 'from-green-500 to-emerald-600 hover:from-green-500 hover:to-emerald-600'} text-white  shadow-lg hover:shadow-xl`
                }`}
              >
                {
                  isCalling ? <PhoneOff className="h-[23px] w-[23px]" /> : <Video className="h-[23px] w-[23px]" />
                }
                <span className="hidden sm:inline text-[14px] tracking-[0.3px]">{session.isUserActive && isCalling ? "End Call" : session.isUserActive ? "Start Call" : "User Offline"}</span>
              </motion.button>
            }
          </div>
        </div>
      </div>
    </motion.div>
  )
}
