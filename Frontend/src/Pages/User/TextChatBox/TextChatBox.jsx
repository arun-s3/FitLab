import React, {useState, useEffect, useRef} from "react"
import {motion, AnimatePresence} from "framer-motion"
import {MessageSquare, X, Send, User, Headphones, Minimize2, Maximize2} from "lucide-react"
import { io } from "socket.io-client"



export default function TextChatBox() {

  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const [messages, setMessages] = useState([
    {
      id: 1,
      message: "Hello! Welcome to FitLab support. How can we help you today?",
      sender: "Support Team",
      timestamp: new Date().toISOString(),
      isAdmin: true,
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  
  const [userName] = useState(`User_${Math.random().toString(36).substr(2, 9)}`)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const roomId = "support-room" 

  useEffect(() => {
    const socket = io("http://localhost:3000")

    socket.on("connect", () => {
      setIsConnected(true)
      socket.emit("join-room", roomId)
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
    })

    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message])
    })

    socket.on("user-typing", (data) => {
      if (data.sender !== userName) {
        setIsTyping(data.isTyping)
      }
    })

    setSocket(socket)

    return () => {
      socket.disconnect()
    }
  }, [userName])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !socket) return

    const messageData = {
      roomId,
      message: newMessage,
      sender: userName,
      isAdmin: false,
    }

    socket.emit("send-message", messageData)
    setNewMessage("")

    socket.emit("typing", { roomId, isTyping: false, sender: userName })
  }

  const handleTyping = (e) => {
    setNewMessage(e.target.value)

    if (!socket) return

    socket.emit("typing", { roomId, isTyping: true, sender: userName })

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", { roomId, isTyping: false, sender: userName })
    }, 2000)
  }

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
        <button 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.1 }}   
          whileTap={{ scale: 0.9 }}
          className={` ${isOpen ? 'bg-transparent p-0 shadow-none' : 'bg-white p-[1rem] shadow-lg'} rounded-2xl flex items-center gap-[12px] hover:shadow-xl 
            transition-all duration-200 transform hover:-translate-y-px`} onClick={toggleChat}>       {/* onClick={()=> setShowChat(true)} */}
          <div className="w-[2.5rem] h-[2.5rem] flex items-center justify-center bg-gradient-to-r
             from-primary to-[#f3d14b] rounded-full">
            <MessageSquare className="w-[20px] h-[20px] text-white" />
          </div>
          {
            !isOpen &&
            <div className="text-left">
                <h3 className="text-[14px] font-[650] text-gray-800">Send us a message</h3>
                <p className="text-[13px] leading-[20px] text-gray-500">We typically reply within a day</p>
            </div>
          }
          <motion.div
            className={`absolute -top-[7px] -left-[7px] w-[8px] h-[8px] rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          />
        </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? 60 : 384,
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="bg-purple-500 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Headphones size={20} />
                <div>
                  <h3 className="font-semibold text-sm">FitLab Support</h3>
                  <p className="text-xs opacity-90">{isConnected ? "Online" : "Connecting..."}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
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
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      className={`flex ${message.isAdmin ? "justify-start" : "justify-end"}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                          message.isAdmin ? "bg-white text-gray-800 border border-gray-200" : "bg-blue-600 text-white"
                        }`}
                      >
                        <div className="flex items-center space-x-1 mb-1">
                          {message.isAdmin ? <Headphones size={12} /> : <User size={12} />}
                          <span className="text-xs opacity-75">{message.sender}</span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs opacity-75 mt-1">{formatTime(message.timestamp)}</p>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="bg-white text-gray-800 border border-gray-200 px-3 py-2 rounded-lg">
                        <div className="flex items-center space-x-1">
                          <Headphones size={12} />
                          <span className="text-xs opacity-75">Support is typing</span>
                          <motion.div
                            className="flex space-x-1"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                          >
                            <div className="w-1 h-1 bg-gray-400 rounded-full" />
                            <div className="w-1 h-1 bg-gray-400 rounded-full" />
                            <div className="w-1 h-1 bg-gray-400 rounded-full" />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={handleTyping}
                      placeholder="Type your message..."
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2
                       placeholder:text-[12px] focus:ring-blue-500 focus:border-transparent"
                      disabled={!isConnected}
                    />
                    <motion.button
                      type="submit"
                      disabled={!newMessage.trim() || !isConnected}
                      className="w-[2.5rem] flex justify-center items-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Send size={16} />
                    </motion.button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
