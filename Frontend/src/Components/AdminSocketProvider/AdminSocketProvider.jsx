import React, {useState, useEffect, useRef, createContext} from "react"
import {Outlet} from 'react-router-dom'
import { io } from "socket.io-client"


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


  // const handleUserSelect = (user)=> {
  //   setSelectedUser(user)
  //   setLastSeen(user.lastSeen)
  //   setUnreadCounts((prev) => ({
  //     ...prev,
  //     [user.socketId]: 0,
  //   }))

    // if (socket) {
    //   socket.emit("user-join-room", user.userId)
    // }
  // }


  useEffect(() => {
    const socket = io("http://localhost:3000")

    socket.on("connect", () => {
      setIsConnected(true)
      socket.emit("admin-login", { adminId: "admin_1", adminName })
      console.log("Admin going to join all rooms...")
      socket.emit("admin-joins-every-rooms")

      socket.emit('count-all-guests')
    })

    socket.on("disconnect", () => {
      setIsConnected(false) 
    })

    socket.on("let-user-connect-admin", (roomId)=> {
      console.log("Inside let-user-connect-admin and Emiting admin-permits-user-connection...")
      socket.emit("admin-permits-user-connection", roomId)
    })

    socket.on("active-users-update", (users) => {
      setActiveUsers(users)
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
      // if(message.sender !== adminName){
        console.log("Message received from user--->", message)
        setMessages((prev) => ({
          ...prev,
          [message.sender]: [...(prev[message.sender] || []), message],
        }))
    })

    socket.on("new-message-notification", (message) => {
      if (!message.isAdmin) {
        console.log("New message from user:", message.sender)
      }
    })

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
      console.log("Guest count-->", count)
      setGuestCount(count)
    }) 

    setSocket(socket)

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(()=> {
    console.log("activeUsers--->", activeUsers)
  }, [activeUsers])

  const handleSendMessage = (e, selectedUser) => {
    e.preventDefault()
    if (!newMessage.trim() || !socket || !selectedUser) return

    console.log()

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



  return (
      <AdminSocketContext.Provider value={{
          isConnected,
          socket,
          guestCount,
          activeUsers,
          setActiveUsers,
          messages, 
          newMessage, 
          typingUsers, 
          unreadCounts, 
          notifications,
          setNotifications,
          setUnreadCounts,
          messagesEndRef, 
          handleTyping,
          handleSendMessage,
        }}
      >
  
        <Outlet/>
  
      </AdminSocketContext.Provider>
    )
  

}

