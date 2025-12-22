import React, {useState, useEffect, useRef, useContext} from "react"
import {motion, AnimatePresence} from "framer-motion"

import {SocketContext} from '../../../Components/SocketProvider/SocketProvider'

import {MessageSquare, X, Bot, Send, User, Headphones, Minimize2, Maximize2} from "lucide-react"


export default function CoachPlus({closeable, onCloseChat, boxHeight, boxWidth, focusByDefault = false, isStatic = false, openChats = false}){

  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const inputRef = useRef(null)

  const {isConnected, coachMessages, newCoachMessage, isCoachLoading, coachError, messagesEndRef, 
      handleSendMessageToCoach, handleUserTypingForCoach} = useContext(SocketContext)

  useEffect(()=> {
    console.log("newCoachMessage--->", newCoachMessage)
  },[newCoachMessage])

  useEffect(()=> {
    if(isStatic || openChats){
      setIsOpen(true)
    }
    if(focusByDefault){
      inputRef.current.focus()
    }
  }, [isStatic, focusByDefault, openChats])

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }


  return (
    <>
        <motion.button 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.1 }}   
          whileTap={{ scale: 0.9 }}
          id="CoachPlus"
          className={` ${isOpen ? 'bg-transparent p-0 shadow-none' : 'bg-none x-sm:bg-white p-0 x-sm:p-[1rem] shadow-none x-sm:shadow-lg'} 
            relative rounded-2xl flex items-center gap-[12px] hover:shadow-xl 
              transition-all duration-200 transform hover:-translate-y-px ${isStatic && 'hidden'} `} onClick={toggleChat}>       {/* onClick={()=> setShowChat(true)} */}
            <div className="w-[2.5rem] h-[2.5rem] flex items-center justify-center bg-gradient-to-r
               from-primary to-[#f3d14b] rounded-full">
              <MessageSquare className="w-[20px] h-[20px] text-white" />
            </div>
          {
            !isOpen &&
            <div className="text-left hidden x-sm:inline-block">
                <h3 className="text-[14px] font-[650] text-gray-800">Send us a message</h3>
                <p className="text-[13px] leading-[20px] text-gray-500">We typically reply within a day</p>
            </div>
          }
          <motion.div
            className={`absolute -top-[7px] -left-[7px] w-[8px] h-[8px] rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          />
          {
            closeable && !isOpen &&
            <X className={`absolute -top-[0.9rem] x-sm:-top-[1.7rem] -right-[9px] x-sm:right-0 p-1 w-[16px] x-sm:w-[20px] h-[16px] x-sm:h-[20px]
               text-secondary bg-white shadow-sm rounded-full cursor-pointer z-[70] hover:scale-105 hover:transition
                hover:duration-150 hover:ease-in`}
                onClick={()=> onCloseChat()}/>
          }
        </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={` ${!isStatic && 'fixed bottom-24 left-6'} z-50 ${boxWidth ? `w-[${boxWidth}rem]` : 'w-96'}
              ${boxHeight ? `!h-[${boxHeight}px]` : '!h-96'} bg-white rounded-lg shadow-sm border
               border-gray-200 flex flex-col overflow-hidden`}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? 60 : boxHeight ? boxHeight : 384,
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className={`bg-purple-500 text-white ${isStatic ? 'p-[1.4rem]' : 'p-4'} flex items-center justify-between`}>
              <div className="flex items-center space-x-2">
                <Headphones size={isStatic ? 22 : 20} />
                <div>
                  <h3 className="flex items-center gap-[5px]"> 
                    <span className={`font-semibold ${isStatic ? 'text-[15px]' : 'text-sm'}`}> Coach+ </span>
                    {
                      isStatic &&
                      <motion.div
                      className={`w-[8px] h-[8px] rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                      />
                    }
                  </h3>
                  <p className="text-xs opacity-90">{!isConnected ? "Connecting..." : isConnected ? "Online" : "Coach+ service unavailable"}</p>
                </div>
              </div>
              <div className={`flex items-center space-x-2 ${isStatic && 'hidden'}`}>
                {
                  isMinimized ? 
                    <Maximize2 size={20} className="hover:bg-white hover:text-secondary p-1 rounded transition-colors cursor-pointer"
                       onClick={()=> setIsMinimized(false)}/> 
                    : <Minimize2 size={20} className="hover:bg-white hover:text-secondary p-1 rounded transition-colors cursor-pointer"
                        onClick={()=> setIsMinimized(true)}/>
                  }
                <button onClick={toggleChat} className="hover:bg-white hover:text-secondary p-1 rounded transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {coachMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      className={`flex ${message.isCoach ? "justify-start" : "justify-end"}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                          message.isCoach ? "bg-white text-gray-800 border border-gray-200" : "bg-blue-600 text-white"
                        }`}
                      >
                        <div className="flex items-center space-x-1 mb-1">
                          {message.isCoach ? <Headphones size={12} /> : <User size={12} />}
                          <span className="text-xs opacity-75">{message.sender}</span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                        <p className="text-[10px] opacity-75 mt-1">{formatTime(message.timestamp)}</p>
                      </div>
                    </motion.div>
                  ))}

                  {isCoachLoading && (
                    <motion.div 
                      className="flex justify-start" 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
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
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={(e)=> handleSendMessageToCoach(e)} className={`p-4 border-t border-gray-200 bg-white`}>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newCoachMessage} 
                      onChange={(e)=> handleUserTypingForCoach(e)}
                      placeholder={isConnected ? "Type your message..." : `Type your message (Offline — we’ll reply soon)`}
                      className={`flex-1 border border-gray-300 rounded-lg px-3 ${isStatic ? 'py-[9px]' : 'py-2'} text-[13px] text-black focus:outline-none focus:ring-2
                        ${isStatic ? 'placeholder:text-[13px]' : 'placeholder:text-[12px]'} focus:ring-blue-500 focus:border-transparent`}
                      ref={inputRef}
                    />
                    <motion.button
                      type="submit"
                      disabled={!newCoachMessage.trim() || !isConnected}
                      className={`${isStatic ? 'w-[3rem]' : 'w-[2.5rem]'} flex justify-center items-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors duration-200`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Send size={isStatic ? 18 : 16} />
                    </motion.button>
                  </div>
                </form>
              </>
            )}
{/* 
            {
              closeable && isOpen &&
              <X className="absolute top-[5px] left-[5px] p-1 w-[20px] h-[20px] text-secondary bg-white shadow-sm rounded-full 
              cursor-pointer hover:scale-105 hover:transition hover:duration-150 hover:ease-in"
                onClick={()=> onCloseChat()}/>
            } */}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
