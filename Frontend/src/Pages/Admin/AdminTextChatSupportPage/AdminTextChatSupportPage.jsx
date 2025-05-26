import React, {useState, useEffect, useRef} from "react"
import {motion, AnimatePresence} from "framer-motion"
import {Users, Send, Search, Clock, User, Headphones, Circle, MessageSquare, Settings, Bell} from "lucide-react"
import { io } from "socket.io-client"

import AdminHeader from '../../../Components/AdminHeader/AdminHeader'



export default function AdminTextChatSupportPage() {
    
  const [activeUsers, setActiveUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState({})
  const [newMessage, setNewMessage] = useState("")
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [typingUsers, setTypingUsers] = useState({})
  const [unreadCounts, setUnreadCounts] = useState({})
  const messagesEndRef = useRef(null)
  const adminName = "Support Agent"

  useEffect(() => {
    const socket = io("http://localhost:3000")

    socket.on("connect", () => {
      setIsConnected(true)
      socket.emit("admin-login", { adminId: "admin_1", adminName })
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
    })

    socket.on("active-users-update", (users) => {
      setActiveUsers(users)
    })

    socket.on("receive-message", (message) => {
      setMessages((prev) => ({
        ...prev,
        [message.socketId]: [...(prev[message.socketId] || []), message],
      }))

      if (!selectedUser || selectedUser.socketId !== message.socketId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [message.socketId]: (prev[message.socketId] || 0) + 1,
        }))
      }
    })

    socket.on("new-message-notification", (message) => {
      if (!message.isAdmin) {
        console.log("New message from user:", message.sender)
      }
    })

    socket.on("user-typing-admin", (data) => {
      setTypingUsers((prev) => ({
        ...prev,
        [data.userId]: data.isTyping,
      }))

      setTimeout(() => {
        setTypingUsers((prev) => ({
          ...prev,
          [data.userId]: false,
        }))
      }, 3000)
    })

    setSocket(socket)

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, selectedUser])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleUserSelect = (user) => {
    setSelectedUser(user)
    setUnreadCounts((prev) => ({
      ...prev,
      [user.socketId]: 0,
    }))

    if (socket) {
      socket.emit("join-room", "support-room")
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !socket || !selectedUser) return

    const messageData = {
      roomId: "support-room",
      message: newMessage,
      sender: adminName,
      targetSocketId: selectedUser.socketId,
    }

    socket.emit("admin-send-message", messageData)
    setNewMessage("")

    setMessages((prev) => ({
      ...prev,
      [selectedUser.socketId]: [
        ...(prev[selectedUser.socketId] || []),
        {
          id: Date.now(),
          message: newMessage,
          sender: adminName,
          timestamp: new Date().toISOString(),
          isAdmin: true,
        },
      ],
    }))
  }

  const handleTyping = (e) => {
    setNewMessage(e.target.value)

    if (socket && selectedUser) {
      socket.emit("admin-typing", {
        roomId: "support-room",
        isTyping: true,
        sender: adminName,
      })
    }
  }

  const filteredUsers = activeUsers.filter((user) => user.userName.toLowerCase().includes(searchTerm.toLowerCase()))

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatLastSeen = (timestamp) => {

  }

  return (
    <section id='AdminTextChatSupportPage'>
    
        <header>

            <AdminHeader heading='Text Chat Support' subHeading="Manage and respond to customer inquiries in real-time through text chat for user satisfaction."/>

        </header>

        <main className="mr-4 p-4 border border-primaryDark rounded-[7px]">

            <div className="h-screen bg-gray-100 flex">
      <div className="w-80 p-[7px] bg-white border border-dropdownBorder rounded-[5px] flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-purple-500 text-white rounded-[3px]"> {/*rgb(187, 103, 245) */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-semibold"> Admin Chat </h1>
            <div className="flex items-center space-x-2">
              <motion.div
                className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              />
              <span className="text-xs">{isConnected ? "Online" : "Offline"}</span>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondaryLight2" size={16} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 pl-10 pr-4 py-2 bg-white text-secondary text-[13px] placeholder-secondaryLight2 
                placeholder:text-[12px] rounded-lg border border-dropdownBorder focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
        </div>

        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{activeUsers.length}</div>
              <div className="text-xs text-gray-600">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeUsers.filter((u) => u.isOnline).length}</div>
              <div className="text-xs text-gray-600">Online Now</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filteredUsers.map((user) => (
              <motion.div
                key={user.socketId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedUser?.socketId === user.socketId ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                }`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User size={20} className="text-gray-600" />
                      </div>
                      <Circle
                        size={12}
                        className={`absolute -bottom-1 -right-1 ${
                          user.isOnline ? "text-green-500 fill-green-500" : "text-gray-400 fill-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{user.userName}</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {user.isOnline ? "Online" : formatLastSeen(user.lastSeen)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {unreadCounts[user.socketId] > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        {unreadCounts[user.socketId]}
                      </motion.div>
                    )}
                    {typingUsers[user.socketId] && (
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                        className="text-xs text-blue-500"
                      >
                        typing...
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Users size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No users found</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User size={20} className="text-gray-600" />
                    </div>
                    <Circle
                      size={12}
                      className={`absolute -bottom-1 -right-1 ${
                        selectedUser.isOnline ? "text-green-500 fill-green-500" : "text-gray-400 fill-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedUser.userName}</h2>
                    <p className="text-sm text-gray-500">
                      {selectedUser.isOnline ? "Online" : `Last seen ${formatLastSeen(selectedUser.lastSeen)}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {(messages[selectedUser.socketId] || []).map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.isAdmin ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isAdmin ? "bg-blue-600 text-white" : "bg-white text-gray-800 border border-gray-200"
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

              {typingUsers[selectedUser.socketId] && (
                <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <User size={12} />
                      <span className="text-xs opacity-75">{selectedUser.userName} is typing</span>
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
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleTyping}
                  placeholder={`Reply to ${selectedUser.userName}...`}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!isConnected}
                />
                <motion.button
                  type="submit"
                  disabled={!newMessage.trim() || !isConnected}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={16} />
                  <span>Send</span>
                </motion.button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a user from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>

        </main>

    </section>
  )
}
