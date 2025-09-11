import React, {useState, useEffect, useRef, useContext} from "react"
import {motion, AnimatePresence} from "framer-motion"

import VideoChatDashboard from './VideoChatDashboard'
import VideoChatSection from './VideoChatSection'
import AdminTitleSection from '../../../Components/AdminTitleSection/AdminTitleSection'
import {AdminSocketContext} from '../../../Components/AdminSocketProvider/AdminSocketProvider'



export default function AdminVideoChatSupportPage() {

  const [currentSession, setCurrentSession] = useState(null)
  const [waitingQueue, setWaitingQueue] = useState([])
  const [activeSessions, setActiveSessions] = useState([])

  const [currentScheduledSession, setCurrentScheduledSession] = useState(null)

  const adminId = 'admin-room'
  const [adminStatus, setAdminStatus] = useState("available")

  const adminSocketContextItems = useContext(AdminSocketContext)

  const {
        isConnected,
        socket,
        guestCount,
        activeUsers,
        messages, 
        newMessage, 
        typingUsers, 
        unreadCounts,
        setUnreadCounts, 
        notifications,
        setNotifications,
        messagesEndRef, 
        handleTyping,
        handleSendMessage
    } = adminSocketContextItems

    console.log("socket--->", socket)
  
  const endCurrentSession = ()=> {
    setCurrentSession(null)
    setAdminStatus("available")
    setCurrentScheduledSession(null)
  }

  useEffect(() => {
    console.log("socket--->", socket)
    if(socket){
      socket.emit("adminJoin", {adminId})

      socket.on("queueUpdate", (data) => {
        console.log("Inside on queueUpdate....")
        setWaitingQueue(data.queue || [])
      })

      socket.on("activeSessionsUpdate", (data) => {
        setActiveSessions(data.sessions || [])
      })

      socket.on("checkAdminStatus", ({userId, socketId})=> {
        console.log("status--->", adminStatus)
        console.log("Inside on checkAdminStatus and emiting adminStatusChecked...")
        socket.emit("adminStatusChecked", {userId, socketId, status: adminStatus})
      })

      socket.on("sessionStarted", (data) => {
        console.log("Inside on sessionStarted...")
        setCurrentSession(data)
        setAdminStatus("busy")
      })

      socket.on("sessionEnded", () => {
        console.log("Inside on sessionEnded......")
        endCurrentSession()
      })

      socket.on("userDeclinedScheduledSession", (sessionId) => {
        console.log("Inside on userDeclinedScheduledSession......")
        endCurrentSession()
      })

      // socket.on("startingScheduledSession", (data)=> {

      // })

      return () => {
        socket.off("queueUpdate")
        socket.off("activeSessionsUpdate")
        socket.off("checkAdminStatus")
        socket.off("sessionStarted")
        socket.off("sessionEnded")
      }
    }
  }, [socket, adminStatus])

  useEffect(()=> {
    console.log("activeSessions--->", activeSessions)
    console.log("currentSession--->", currentSession)
    console.log("activeUsers--->", activeUsers)
    console.log("waitingQueue--->", waitingQueue)
    console.log("adminStatus--->", adminStatus)
  }, [activeSessions, currentSession, activeUsers, waitingQueue, adminStatus])

  const handleAcceptCall = (userId, username) => {
    console.log("Inside handleAcceptCall..")
    setAdminStatus("busy")

    setWaitingQueue((prev) => prev.filter((user) => user.userId !== userId))

    console.log("Emiting acceptCall...")
    socket.emit("acceptCall", { adminId, userId, username})
  }

  const handleDeclineCall = (userId) => {
    setWaitingQueue((prev) => prev.filter((user) => user.userId !== userId))

    socket.emit("declineCall", { adminId: "admin-room", userId })
  }

  const handleEndSession = () => {
    console.log("Inside handleEndSession() from AdminVideoChatSupportPage")
    if (currentSession) {
      setCurrentSession(null)
      setAdminStatus("available")
      setCurrentScheduledSession(null)
      console.log("set curretSession to null")
    }
  }

  const toggleAvailability = () => {
    const newStatus = adminStatus === "available" ? "busy" : "available"
    console.log('new status-->', newStatus)
    setAdminStatus(newStatus)

    console.log("Emiting adminStatusChange...")
    socket.emit("adminStatusChange", { adminId: "admin-room", status: newStatus })
  }

  
  const handleStartScheduledCall = (session) => {
    const scheduledSessionNow = {
      // sessionId: session.sessionId,
      adminId: "admin-room",
      userId: session.userId._id,
      username: session.userId.username,
      // startTime: Date.now(),
      requestType: "scheduled",
      isScheduled: true,
      scheduledTime: session.scheduledTime, 
      subjectLine: session.subjectLine,
      notes: session.notes
    }
    setCurrentScheduledSession(session)
    console.log("Inside handleStartScheduledCall..")
    setAdminStatus("busy")

    setWaitingQueue((prev) => prev.filter((user) => user.userId !== session.userId._id))

    console.log("Emiting acceptCall...")
    // socket.emit("notifyUserForCall")
    const userSocketId = activeUsers.find(user=> user.username === session.userId.username).socketId
    socket.emit("startScheduledCall", { adminId, adminSocketId: socket.id, userSocketId, currentScheduledSession: scheduledSessionNow})
  }

  const handleEndScheduledCall = (session)=> {
    console.log("Emiting adminStoppedScheduledSession...")
    socket.emit("adminStoppedScheduledSession", { userId: session.userId._id})
    endCurrentSession()
  }


    return (
        <section id='AdminVideoChatSupportPage' className="w-full -ml-[1.5rem] mb-[10rem]">
        
            <header>
    
                <AdminTitleSection heading='Video Chat Support' subHeading="Real-time video assistance allows you to connect face-to-face with customers and resolve their queries."/>
    
            </header>
    
            <main className="">

                <div className="min-h-screen">

                    {currentSession ? (
                      <VideoChatSection adminSocketContextItems={adminSocketContextItems} session={currentSession} 
                          onEndSession={handleEndSession} />
                    ) : (
                      <VideoChatDashboard 
                        adminSocketContextItems={adminSocketContextItems}
                        waitingQueue={waitingQueue}
                        activeSessions={activeSessions}
                        adminStatus={adminStatus}
                        onAcceptCall={handleAcceptCall}
                        onDeclineCall={handleDeclineCall}
                        onToggleAvailability={toggleAvailability}
                        currentScheduledSession={currentScheduledSession}
                        onStartScheduledCall={handleStartScheduledCall}
                        onEndScheduledCall={handleEndScheduledCall}
                      />
                    )}

                </div>

            </main>

        </section>
    )

}