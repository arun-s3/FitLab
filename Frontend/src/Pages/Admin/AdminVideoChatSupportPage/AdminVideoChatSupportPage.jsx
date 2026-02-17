import React, {useState, useEffect, useContext} from "react"
import {useOutletContext} from 'react-router-dom'

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

  const {setPageBgUrl} = useOutletContext() 
  setPageBgUrl(`linear-gradient(to right,rgba(255,255,255,0.95),rgba(255,255,255,0.95)), url('/Images/admin-bg9.png')`)

  const adminSocketContextItems = useContext(AdminSocketContext)

  const { socket, activeUsers } = adminSocketContextItems

  const endCurrentSession = ()=> {
    setCurrentSession(null)
    setAdminStatus("available")
    setCurrentScheduledSession(null)
  }

  useEffect(() => {
    if(socket){
      socket.emit("adminJoin", {adminId})

      socket.on("queueUpdate", (data) => {
        setWaitingQueue(data.queue || [])
      })

      socket.on("activeSessionsUpdate", (data) => {
        setActiveSessions(data.sessions || [])
      })

      socket.on("checkAdminStatus", ({userId, socketId})=> {
        socket.emit("adminStatusChecked", {userId, socketId, status: adminStatus})
      })

      socket.on("sessionStarted", (data) => {
        setCurrentSession(data)
        setAdminStatus("busy")
      })

      socket.on("sessionEnded", () => {
        endCurrentSession()
      })

      socket.on("userDeclinedScheduledSession", (sessionId) => {
        endCurrentSession()
      })

      return () => {
        socket.off("queueUpdate")
        socket.off("activeSessionsUpdate")
        socket.off("checkAdminStatus")
        socket.off("sessionStarted")
        socket.off("sessionEnded")
      }
    }
  }, [socket, adminStatus])

  const handleAcceptCall = (userId, username) => {
    setAdminStatus("busy")

    setWaitingQueue((prev) => prev.filter((user) => user.userId !== userId))
    socket.emit("acceptCall", { adminId, userId, username})
  }

  const handleDeclineCall = (userId) => {
    setWaitingQueue((prev) => prev.filter((user) => user.userId !== userId))

    socket.emit("declineCall", { adminId: "admin-room", userId })
  }

  const handleEndSession = () => {
    if (currentSession) {
      setCurrentSession(null)
      setAdminStatus("available")
      setCurrentScheduledSession(null)
    }
  }

  const toggleAvailability = () => {
    const newStatus = adminStatus === "available" ? "busy" : "available"
    setAdminStatus(newStatus)
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
    setAdminStatus("busy")

    setWaitingQueue((prev) => prev.filter((user) => user.userId !== session.userId._id))
    // socket.emit("notifyUserForCall")
    const userSocketId = activeUsers.find(user=> user.username === session.userId.username).socketId
    socket.emit("startScheduledCall", { adminId, adminSocketId: socket.id, userSocketId, currentScheduledSession: scheduledSessionNow})
  }

  const handleEndScheduledCall = (session)=> {
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