import React, {useState, useEffect, useRef, useContext} from "react"
import {motion, AnimatePresence} from "framer-motion"

import VideoChatDashboard from './VideoChatDashboard'
import VideoChatSection from './VideoChatSection'
import AdminHeader from '../../../Components/AdminHeader/AdminHeader'



export default function AdminVideoChatSupportPage() {

    const [currentSession, setCurrentSession] = useState(null)
    const [waitingQueue, setWaitingQueue] = useState([
        {
          userId: "user-demo-1",
          socketId: "socket-1",
          joinTime: Date.now() - 120000,
          requestType: "Immediate Support",
        },
        {
          userId: "user-demo-2",
          socketId: "socket-2",
          joinTime: Date.now() - 300000,
          requestType: "Workout Form Check",
        },
        {
          userId: "user-demo-3",
          socketId: "socket-3",
          joinTime: Date.now() - 60000,
          requestType: "Nutrition Consultation",
        },
    ])
  const [activeSessions, setActiveSessions] = useState([
        {
          sessionId: "session-demo-1",
          adminId: "admin-456",
          userId: "user-789",
          startTime: Date.now() - 600000,
        },
    ])
  const [adminStatus, setAdminStatus] = useState("available")







  const handleAcceptCall = (userId) => {
    const demoSession = {
      sessionId: `session-${Date.now()}`,
      adminId: "admin-123",
      userId: userId,
      startTime: Date.now(),
      requestType: "Immediate Support",
    }

    setCurrentSession(demoSession)
    setAdminStatus("busy")

    setWaitingQueue((prev) => prev.filter((user) => user.userId !== userId))

  }

  const handleDeclineCall = (userId) => {
    setWaitingQueue((prev) => prev.filter((user) => user.userId !== userId))

  }

  const handleEndSession = () => {
    if (currentSession) {
      setCurrentSession(null)
      setAdminStatus("available")

    }
  }

  const toggleAvailability = () => {
    const newStatus = adminStatus === "available" ? "offline" : "available"
    setAdminStatus(newStatus)

  }


    return (
        <section id='AdminVideoChatSupportPage'>
        
            <header>
    
                <AdminHeader heading='Video Chat Support' subHeading="Real-time video assistance allows you to connect face-to-face with customers and resolve their queries."/>
    
            </header>
    
            <main className="">

                <div className="min-h-screen">

                    {currentSession ? (
                      <VideoChatSection session={currentSession} onEndSession={handleEndSession} />
                    ) : (
                      <VideoChatDashboard
                        waitingQueue={waitingQueue}
                        activeSessions={activeSessions}
                        adminStatus={adminStatus}
                        onAcceptCall={handleAcceptCall}
                        onDeclineCall={handleDeclineCall}
                        onToggleAvailability={toggleAvailability}
                      />
                    )}

                </div>

            </main>

        </section>
    )

}