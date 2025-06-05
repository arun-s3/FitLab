import React, {useState, useEffect, useRef, createContext} from "react"
import {Outlet} from 'react-router-dom'
import { io } from "socket.io-client"


export const AdminSocketContext = createContext();


export default function AdminSocketProvider() {

  const [isConnected, setIsConnected] = useState(false)
    
  const [activeUsers, setActiveUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
 
  const [guestCount, setGuestCount] = useState(0)

  const [messages, setMessages] = useState({})
  const [newMessage, setNewMessage] = useState("")
  const [socket, setSocket] = useState(null)

  const [typingUsers, setTypingUsers] = useState({})
  const [unreadCounts, setUnreadCounts] = useState({})

  const [notifications, setNotifications] = useState([])

  const messagesEndRef = useRef(null)
  const adminName = "Support Agent"

  const [textOrReply, setTextOrReply] = useState('Text')

  const [lastSeen, setLastSeen] = useState('')


  const handleUserSelect = (user)=> {
    setSelectedUser(user)
    setLastSeen(user.lastSeen)
    setUnreadCounts((prev) => ({
      ...prev,
      [user.socketId]: 0,
    }))

    // if (socket) {
    //   socket.emit("user-join-room", user.userId)
    // }
  }


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

    socket.on("updated-activeUsers", (updater) => {
      console.log("Inside updated-activeUsers")
      setActiveUsers(updater.users)
      handleUserSelect(updater.user)
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
        console.log(`Now message.sender is ${message.sender} and selectedUser.username is ${selectedUser?.username}`)
        if(message.sender !== adminName && ( selectedUser == null || message.sender !== selectedUser.username)){
          console.log("Setting notification....")
          setNotifications(notifications=> {
            const userExists = notifications.some(statusObj=> statusObj.sender === message.sender)
            if(userExists){
              return notifications.map(statusObj=> {
                if(statusObj.sender === message.sender){
                  return { ...statusObj, msgCount: statusObj.msgCount + 1 }
                }
                return statusObj
              })
            }else{
              return [...notifications, {sender: message.sender, msgCount: 1}]
            }
          })
        } 

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

    socket.on('reconnect-if-user-selected', (user)=> {
      if(selectedUser.username === user.username){
        handleUserSelect(user)
      }
    })

    socket.on('update-last-seen', (user)=> {
      console.log("Inside update-last-seen")
      console.log("selectedUser--->", selectedUser)
      if(selectedUser && selectedUser.username === user.username){
        setLastSeen(user.lastSeen)
      }
    })

    setSocket(socket)

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(()=> {
    scrollToBottom()

    console.log("Messages--->", messages)
    if(selectedUser && messages?.[selectedUser.username]?.length > 0){
      console.log("messages[messages.length - 1]---->", messages[selectedUser.username][messages.length - 1])
      const lastMsg = messages[selectedUser.username][messages[selectedUser.username].length - 1]
      const isLastMsgByAdmin = lastMsg.isAdmin
      if(!isLastMsgByAdmin){
        setTextOrReply('Reply')
      }else setTextOrReply('Text')
    }
  }, [messages, selectedUser])

  useEffect(()=> {
    console.log("typingUsers--->", typingUsers)
    if(selectedUser){
      console.log("selectedUser.username--->", selectedUser.username)
      setLastSeen(selectedUser.lastSeen)
    }
    if(notifications){
      console.log("notifications--->", notifications)
    }
  },[typingUsers, selectedUser, activeUsers, notifications])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e) => {
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

  const handleTyping = (e) => {
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
          selectedUser,
          setSelectedUser,
          messages, 
          newMessage, 
          typingUsers, 
          unreadCounts, 
          notifications,
          setNotifications,
          lastSeen,
          setLastSeen,
          setUnreadCounts,
          messagesEndRef, 
          textOrReply,
          handleTyping,
          handleSendMessage,
        }}
      >
  
        <Outlet/>
  
      </AdminSocketContext.Provider>
    )
  

}

