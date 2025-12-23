import React, { useState, useRef, useEffect, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { Bot, X, Send, User } from "lucide-react"
import {toast as sonnerToast} from 'sonner'

import {SocketContext} from '../../../Components/SocketProvider/SocketProvider'
import AnimatedBotIcon from "./AnimatedBot"


export default function CoachPlus({autoOpen, onCloseChat}) {

  const [isOpen, setIsOpen] = useState(false)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const {isConnected, coachMessages, newCoachMessage, isCoachLoading, coachError, 
        handleSendMessageToCoach, handleUserTypingForCoach} = useContext(SocketContext)


  useEffect(()=> {
    console.log("newCoachMessage--->", newCoachMessage)
  },[newCoachMessage])
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [coachMessages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(()=> {
    if(autoOpen){
      setIsOpen(true)
      console.log("autoOpen--->", autoOpen)
    }
  }, [autoOpen])

  useEffect(() => {
    if(coachError){
      sonnerToast.error(coachError)
    }
  }, [coachError])

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }


  return (
    <>
      <motion.button
        onClick={()=> setIsOpen(status=> !status)}
        className={`fixed ${isOpen ? 'bottom-[10px]' : 'bottom-6'} left-6 z-50 flex h-14 w-14 items-center justify-center 
          rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300`}
        whileHover={!isOpen && { scale: 1.1 }}
        whileTap={!isOpen && { scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isOpen ? 0.9 : 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <AnimatedBotIcon/>
        <motion.div
          className={`absolute -top-[7px] -left-[7px] w-[8px] h-[8px] rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
        />
        {
          !isOpen &&
          <X className={`absolute -top-[0.9rem] x-sm:-top-[1.7rem] -right-[9px] x-sm:right-0 p-1 w-[16px] x-sm:w-[20px] h-[16px] x-sm:h-[20px]
             text-secondary bg-white shadow-sm rounded-full cursor-pointer z-[70] hover:scale-105 hover:transition
              hover:duration-150 hover:ease-in`}
              onClick={()=> onCloseChat()}/>
        }
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed ${isOpen ? 'bottom-16 left-12' : 'bottom-6 left-6'} z-50 flex h-[600px] w-full max-w-[400px] 
              flex-col overflow-hidden rounded-2xl bg-white shadow-2xl`}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 text-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold"> Coach+ </h3>
                  <p className="text-xs text-purple-100">
                    {!isConnected ? "Connecting..." : isConnected ? "Online" : "Coach+ service unavailable"}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <X className="h-5 w-5" />
              </motion.button>
            </motion.div>

            <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
              <AnimatePresence initial={false}>
                {coachMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      delay: index * 0.05,
                    }} 
                    className={`flex ${message.isCoach ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                        message.isCoach ? "bg-white text-gray-800 border border-gray-200" : "bg-purple-600 text-white"
                      }`}
                    >
                      <div className="flex items-center space-x-1 mb-1">
                        {message.isCoach ? <Bot size={12} /> : <User size={12} />}
                        <span className="text-xs opacity-75">{message.sender}</span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                      <p className="text-[10px] opacity-75 mt-1">{formatTime(message.timestamp)}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <AnimatePresence>
                {isCoachLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-start"
                  >
                    <div className="flex gap-2">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="flex items-center gap-1 rounded-2xl bg-white px-4 py-2 border border-gray-200">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 0.6,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatDelay: 0.2,
                          }}
                          className="h-2 w-2 rounded-full bg-gray-400"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 0.6,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatDelay: 0.2,
                            delay: 0.2,
                          }}
                          className="h-2 w-2 rounded-full bg-gray-400"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 0.6,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatDelay: 0.2,
                            delay: 0.4,
                          }}
                          className="h-2 w-2 rounded-full bg-gray-400"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border-t border-gray-200 bg-white p-4"
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={newCoachMessage} 
                  onChange={(e)=> handleUserTypingForCoach(e)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  rows={1}
                  className="flex-1 resize-none !text-[13px] rounded-[7px] border border-gray-300 bg-gray-50 px-4 py-3 text-sm
                   text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  style={{
                    minHeight: "44px",
                    maxHeight: "120px",
                  }}
                />
                <motion.button
                  onClick={handleSendMessageToCoach}
                  disabled={!newCoachMessage.trim() || !isConnected}
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white
                   hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-300
                    disabled:cursor-not-allowed"
                  whileHover={{ scale: newCoachMessage.trim() ? 1.05 : 1 }}
                  whileTap={{ scale: newCoachMessage.trim() ? 0.95 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Send className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

