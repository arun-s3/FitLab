import React from 'react'
import { motion } from "framer-motion"

import { User, Clock, Phone, PhoneOff, MessageSquare } from "lucide-react"


export default function UserQueueCard({ user, position, onAccept, onDecline, disabled }) {
  const waitTime = Math.floor((Date.now() - (user.joinTime || Date.now())) / 1000 / 60)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mr-4">
          <User className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 flex items-center gap-[5px]">
            <span> User #{user.username} </span>
            {user.username.includes('guest') && <span className='italic text-[14px] text-secondary'> (Guest) </span>}
          </h3>
          <p className="text-sm text-gray-500">Position #{position}</p>
        </div>
      </div>

      <div className="flex items-center mb-4 text-sm text-gray-600">
        <Clock className="h-[14px] w-[14px] mr-2" />
        <span className='text-[13px]'>Waiting: {waitTime > 0 ? `${waitTime}m` : "Just joined"}</span>
      </div>

      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <p className="text-sm text-purple-800 font-medium">Request Type:</p>
        <p className="text-sm text-purple-600">{user.requestType || "Immediate Support"}</p>
      </div>

      <div className="flex space-x-3">
        <motion.button
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          onClick={onAccept}
          disabled={disabled}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
            disabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl"
          }`}
        >
          <Phone className="h-4 w-4" />
          <span>Accept</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDecline}
          className="flex items-center justify-center p-3 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-300"
        >
          <PhoneOff className="h-4 w-4" />
        </motion.button>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-secondary transition-colors duration-200">
          <MessageSquare className="h-4 w-4" />
          <span>Send message</span>
        </button>
      </div>
    </motion.div>
  )
}
