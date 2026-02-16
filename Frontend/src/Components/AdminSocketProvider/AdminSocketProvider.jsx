import React, {useState, useEffect, useRef, createContext} from "react"
import {Outlet} from 'react-router-dom'
import { io } from "socket.io-client"

import {toast as sonnerToast} from 'sonner'


export const AdminSocketContext = createContext();


export default function AdminSocketProvider() {

  const [isConnected, setIsConnected] = useState(false)
    
  const [activeUsers, setActiveUsers] = useState([])
 
  const [guestCount, setGuestCount] = useState(0)

  const [messages, setMessages] = useState({})
  const [newMessage, setNewMessage] = useState("")
  const [socket, setSocket] = useState(null)

  const [typingUsers, setTypingUsers] = useState({})
  const [unreadCounts, setUnreadCounts] = useState({})

  const [notifications, setNotifications] = useState([])

  const messagesEndRef = useRef(null)
  const adminName = "Support Agent"

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  
  useEffect(() => {
    const socket = io(baseApiUrl, {
        withCredentials: true, 
    })

    socket.on("connect", () => {
      setIsConnected(true)
      socket.emit("admin-login", { adminId: "admin_1", adminName })
      socket.emit("admin-joins-every-rooms")

      socket.emit('count-all-guests')
    })

    socket.on("disconnect", () => {
      setIsConnected(false) 
    })

    socket.on("let-user-connect-admin", (roomId)=> {
      socket.emit("admin-permits-user-connection", roomId)
    })

    socket.on("chat-history-with-user", (messages) => {
      if(messages.length > 0){
        setMessages(msgs=> ({...msgs, [messages[0].sender]: messages}))
      }
    })

    socket.on("active-users-update", (users) => {
        setActiveUsers(users)
        const now = Date.now()

        const offlineUsers = users.filter((user) => user.lastSeen && now > user.lastSeen)

        setTypingUsers((prev) => {
            const updated = { ...prev }
            offlineUsers.forEach((user) => {
                updated[user.username] = false
            })
            return updated
        })
    })


    // socket.on("user-selected", (user) => {
    //   if(!selectedUser){
    //     console.log("Inside on- user-selected")
    //     handleUserSelect(user)
    //   }
    // }) ---> Test this later for admin multiple tab synchronous

    // socket.on("admin-message-sent", (message) => {
    //   console.log("Inside on- admin-message-sent....selectedUser--->", selectedUser)
    //   if(selectedUser?.username && selectedUser.username === message.username){
    //     console.log("Message sent by admin--->", message)
    //     setMessages((prev) => ({
    //     ...prev,
    //     [selectedUser.username]: [...(prev[selectedUser?.username] || []), message],
    //     }))
    //   }
    // }) ---> Test this later for admin multiple tab synchronous

    socket.on("receive-message", (message) => {
        setMessages((prev) => ({
          ...prev,
          [message.sender]: [...(prev[message.sender] || []), message],
        }))
    })

    // socket.on("new-message-notification", (message) => {
    //   if (!message.isAdmin) {
    //     console.log("New message from user:", message.sender)
    //   }
    // })

    socket.on("user-typing-admin", (data) => {
      setTypingUsers((prev) => ({
        ...prev,
        [data.sender]: data.isTyping,
      }))

      setTimeout(() => {
        setTypingUsers((prev) => ({
          ...prev,
          [data.sender]: false,
        }))
      }, 3000)
    })

    socket.on('guest-counts', (count)=> {
      setGuestCount(count)
    }) 

    socket.on('notification-sent', (data)=> {
      sonnerToast.success("Notification sent to the user!")
    }) 

    socket.on('notification-error', (message)=> {
      sonnerToast.error(message)
    }) 

    setSocket(socket)

    return () => {
      socket.disconnect()
    }
  }, [])

  const handleSendMessage = (e, selectedUser) => {
    e.preventDefault()
    if (!newMessage.trim() || !socket || !selectedUser) return

    const messageData = {
      roomId: selectedUser.userId,
      message: newMessage,
      sender: adminName,
      targetSocketId: selectedUser.socketId,
    }

    socket.emit("admin-send-message", messageData)
    setNewMessage("")

    setMessages((prev) => ({
      ...prev,
      [selectedUser.username]: [...(prev[selectedUser.username] || []),
        {
          id: Date.now(),
          message: newMessage,
          sender: adminName,
          timestamp: new Date().toISOString(),
          isAdmin: true,
        },
      ],
    }))

    socket.emit("admin-typing", {
        roomId: selectedUser.userId,
        isTyping: false,
        sender: adminName,
      })
  }

  const handleTyping = (e, selectedUser) => {
    setNewMessage(e.target.value)

    if (socket && selectedUser) {
      socket.emit("admin-typing", {
        roomId: selectedUser.userId,
        isTyping: true,
        sender: adminName,
      })
    }
  }

  const handleSendOfflineMessage = (e, selectedUser)=> {
    e.preventDefault()
    const messageData = {
      roomId: selectedUser.userId,
      message: newMessage,
      sender: adminName,
      targetSocketId: null,
    }

    socket.emit("admin-send-message", messageData)
    setNewMessage("")

    setMessages((prev) => ({
      ...prev,
      [selectedUser.username]: [...(prev[selectedUser.username] || []),
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

  const sendUserNotification = (data)=> {
    socket.emit("admin-send-notification", data)
  }


  return (
      <AdminSocketContext.Provider value={{
          isConnected,
          socket,
          guestCount,
          activeUsers,
          setActiveUsers,
          messages, 
          setMessages,
          newMessage, 
          typingUsers, 
          unreadCounts, 
          notifications,
          setNotifications,
          setUnreadCounts,
          messagesEndRef, 
          handleTyping,
          handleSendMessage,
          handleSendOfflineMessage,
          sendUserNotification
        }}
      >
  
        <Outlet/>
  
      </AdminSocketContext.Provider>
    )
  

}

