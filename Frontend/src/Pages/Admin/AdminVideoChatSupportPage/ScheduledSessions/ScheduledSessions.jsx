import React, { useState, useEffect, useContext } from "react"
import { motion } from "framer-motion"

import { Calendar, Filter } from "lucide-react"
import axios from 'axios'
import {intervalToDuration, formatDuration} from 'date-fns'

import ScheduledSessionCard from "./ScheduledSessionCard"
import {AdminSocketContext} from '../../../../Components/AdminSocketProvider/AdminSocketProvider'



export default function ScheduledSessions({ currentScheduledSession, onStartScheduledCall, onEndScheduledCall }) {


  const [selectedDate, setSelectedDate] = useState("today")
  const [filterStatus, setFilterStatus] = useState("all")

  const [stats, setStats] = useState({})

  const adminSocketContextItems = useContext(AdminSocketContext)
  
  const { activeUsers, socket } = adminSocketContextItems

  const [updatedSessions, setUpdatedSessions] = useState([])

  const [scheduledSessions, setScheduledSessions] = useState([])
  const [filteredSessions, setFilteredSessions] = useState([])

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  const checkUserActive = (username)=> {
    console.log("Inside checkUserActive")
    return activeUsers.some(user=> user.username === username && user.isOnline)
  }

  useEffect(()=> {
    async function fetchSessions(){
      try{
        const response = await axios.get(`${baseApiUrl}/video-chat/`, {withCredentials: true})
        if(response.status === 200){
          console.log("Fetched Session---->", response.data.sessions)
          const sessions = response.data.sessions
          if(sessions && sessions.length > 0){
            console.log("Users booked some sessions")
            const sessionsWithDetails = sessions.map(session=> {
              const today = new Date()
              const sessionDate = new Date(session.scheduledDate)  
              console.log("sessionDate.toDateString() === today.toDateString()---->", sessionDate.toDateString() === today.toDateString())         
              if(sessionDate.toDateString() === today.toDateString()){
                console.log("Today's sessions..")
                const timeNow = today.getTime()
                let sessionHourPart  = Number.parseInt(session.scheduledTime.split(':')[0])
                if(session.scheduledTime.includes('PM')){
                  sessionHourPart += 12
                  console.log("sessionHourPart--->", sessionHourPart)
                }
                const sessionHour = new Date(today)
                sessionHour.setHours(sessionHourPart, 0, 0, 0)
                let timeRemaining =  sessionHour.getTime() - timeNow
                console.log(`timeRemaining from ${session.scheduledTime} on ${session.scheduledDate}----> ${timeRemaining}`)
                if(timeRemaining < 0 && session.status !== 'completed'){
                  session.status = 'missed'
                }else{
                  session.timeRemainingMs = timeRemaining
                  timeRemaining = intervalToDuration({
                    start: 0,
                    end: timeRemaining
                  }) 
                  console.log("timeRemaining now---->", timeRemaining)
                  session.timeRemaining = formatDuration(timeRemaining)
                }
              }
              return session
            })
            setUpdatedSessions(sessionsWithDetails)
          }
          else setUpdatedSessions(sessions)
        }
      }
      catch(error){
        console.log("Error in fetchSessions:", error.message)
      }
    }
    fetchSessions()
  }, [])

  useEffect(()=> {
    console.log("activeUsers---->", activeUsers)
    console.log("updatedSessions.length---->", updatedSessions?.length)
    if(updatedSessions && updatedSessions?.length > 0 && activeUsers && activeUsers?.length > 0){
      const updateSessions = updatedSessions.map(session=> {
        const isActive = checkUserActive(session.userId.username) 
        console.log("isActive---->", isActive)
        session.isUserActive = isActive
        return session
      })
      setScheduledSessions(updateSessions)
    }
  }, [activeUsers, updatedSessions])

  useEffect(()=> {
    console.log("currentScheduledSession--->", currentScheduledSession)
  }, [currentScheduledSession])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  function requiredSessions(sessions, date = 'today', status = 'all'){
    return sessions.filter((session) => {
      const sessionDateOnly = new Date(session.scheduledDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const weekFromNow = new Date(today)
      weekFromNow.setDate(weekFromNow.getDate() + 7)

      let dateMatch = false
      if(date){
        if (date === "today") {
          dateMatch = sessionDateOnly.toDateString() === today.toDateString()
        } else if (date === "tomorrow") {
          dateMatch = sessionDateOnly.toDateString() === tomorrow.toDateString()
        } else if (date === "week") {
          dateMatch = sessionDateOnly >= today && sessionDateOnly <= weekFromNow
        }
      }

      let statusMatch = false
      if(status){
        if (filterStatus === "all") {
          statusMatch = true
        } else if (filterStatus === "active") {
          statusMatch = session.isUserActive
        } else if (filterStatus === "inactive") {
          statusMatch = !session.isUserActive
        }
      }

      return dateMatch && statusMatch
    })
  }

  const getSessionStats = () => {
      const todaySessions = scheduledSessions.filter((session) => {
      const sessionDate = new Date(session.scheduledDate)
      const today = new Date()
      return sessionDate.toDateString() === today.toDateString()
    })

    return {
      total: todaySessions.length,
      active: todaySessions.filter((s) => s.isUserActive).length,
      upcoming: todaySessions.filter((s) => s.status === "upcoming").length,
      missed: todaySessions.filter((s) => s.status === "missed").length,
    }
  }

  const filterHandler = (date, status)=> {
    setSelectedDate(date)
    setFilterStatus(status)
    const sessions = requiredSessions(scheduledSessions, date, status)
    console.log("filteredSessions now------>", sessions)
    setFilteredSessions(sessions)
  }

  useEffect(()=> {
    if(scheduledSessions && scheduledSessions.length > 0){
      console.log("scheduledSessions---->", scheduledSessions)
      const statsInfo = getSessionStats()
      setStats(statsInfo)
      filterHandler(selectedDate || 'today', filterStatus || 'all')
    }
  }, [scheduledSessions])

  useEffect(()=> {
    console.log("filteredSessions atlast----------->", filteredSessions)
  }, [filteredSessions])

    useEffect(()=> {
    console.log(`selectedDate is ${selectedDate} and filterStatus is ${filterStatus}`)
  }, [selectedDate, filterStatus])




  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8"
    >
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-2">
            <Calendar className="mr-3 h-6 w-6 text-purple-600" />
            Scheduled Sessions
          </h2>
          <p className="text-[14px] text-gray-600">Manage and monitor your scheduled consultations</p>
        </div>

        <div className="flex items-center gap-[2rem] space-x-4 mt-4 md:mt-0">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
            <div className="text-xs text-gray-500">Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-xs text-gray-500">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primaryDark">{stats.upcoming}</div>
            <div className="text-xs text-gray-500">Upcoming</div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 mb-[2.5rem]">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <select
            value={selectedDate}
            onChange={(e)=> filterHandler(e.target.value, filterStatus)}
            className="bg-gray-50 w-[8rem] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="week">This Week</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e)=> filterHandler(selectedDate, e.target.value)}
            className="bg-gray-50 w-[8rem] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Users</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </motion.div>

      {filteredSessions.length === 0 ? (
        <motion.div variants={item} className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No sessions found</h3>
          <p className="text-gray-500">No scheduled sessions match your current filters</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredSessions && filteredSessions.length > 0 &&
            filteredSessions.map((session, index) => (
             <motion.div key={session.sessionId} variants={item} transition={{ delay: index * 0.1 }}>
               <ScheduledSessionCard session={session} onStartCall={() => onStartScheduledCall(session)} onEndCall={()=> onEndScheduledCall(session)} socket={socket} 
                   currentScheduledSession={currentScheduledSession}/>
             </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
