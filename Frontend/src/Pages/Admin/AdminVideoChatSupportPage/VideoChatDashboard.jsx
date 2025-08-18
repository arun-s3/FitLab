import React from 'react'
import { motion } from "framer-motion"

import { Users, Clock, Video, Power, PowerOff, Bell, Settings } from "lucide-react"

import UserQueueCard from "./UserQueueCard"
import ScheduledSessions from './ScheduledSessions/ScheduledSessions'



export default function AdminDashboard({
  waitingQueue,
  activeSessions,
  activeUsers,
  adminStatus,
  onAcceptCall,
  onDeclineCall,
  onToggleAvailability,
  currentScheduledSession,
  onStartScheduledCall,
  onEndScheduledCall
}) {
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

  return (
    <div className="p-4 pt-0 -mt-[1rem] relative">
              <motion.div variants={item} className="absolute right-4 mb-8 flex items-center space-x-4 md:mt-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onToggleAvailability}
                  className={`flex items-center space-x-2 px-8 py-[11px] rounded-[11px] font-semibold transition-all duration-300 shadow-lg ${
                    adminStatus === "available"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                      : "bg-gradient-to-r from-primary to-primaryDark text-white hover:from-yellow-300 hover:to-yellow-600"
                  }`}
                >
                  {adminStatus === "available" ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                  <span className='text-[15px]'>{adminStatus === "available" ? "Available" : "Busy"}</span>
                </motion.button>

              </motion.div>

        <motion.div variants={container} initial="hidden" animate="show" className="pt-16 max-w-7xl mx-auto">

        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-blue-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primaryDark rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-primaryDark">{waitingQueue.length}</span>
            </div>
            <h3 className="font-semibold text-[15px] text-yellow-500">Waiting in Queue</h3>
            <p className="text-yellow-400 text-[13px]">Users waiting for support</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500 rounded-xl">
                <Video className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-green-600">{activeSessions.length}</span>
            </div>
            <h3 className="font-semibold text-[15px] text-green-800">Active Sessions</h3>
            <p className="text-green-600 text-[13px]">Ongoing video calls</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-6 border border-purple-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-purple-600">
                {waitingQueue.length > 0 ? `${waitingQueue.length * 3}m` : "0m"}
              </span>
            </div>
            <h3 className="font-semibold text-[15px] text-purple-800">Avg Wait Time</h3>
            <p className="text-purple-600 text-[15px] text-sm">Estimated wait time</p>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Bell className="mr-3 h-6 w-6 text-secondary" />
                User Queue
              </h2>
              {waitingQueue.length > 0 && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {waitingQueue.length} waiting
                </motion.div>
              )}
            </div>

            {waitingQueue.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-[2.5rem] w-[2.5rem] text-gray-400" />
                </div>
                <h3 className="text-[18px] font-semibold text-gray-600 mb-2">No users in queue</h3>
                <p className="text-[15px] text-gray-500">Users requesting support will appear here</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {waitingQueue.map((user, index) => (
                  <UserQueueCard
                    key={user.userId}
                    user={user}
                    position={index + 1}
                    onAccept={()=> onAcceptCall(user.userId, user.username)}
                    onDecline={()=> onDeclineCall(user.userId)}
                    disabled={adminStatus !== "available"}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={item} className='mt-6'>
          <ScheduledSessions currentScheduledSession={currentScheduledSession} onStartScheduledCall={onStartScheduledCall} onEndScheduledCall={onEndScheduledCall}/>
        </motion.div>

      </motion.div>
    </div>
  )
}
