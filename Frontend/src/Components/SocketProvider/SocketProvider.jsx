import React,{ createContext, useState, useEffect, useMemo, useRef } from "react"
import {Outlet} from 'react-router-dom'
import {useSelector} from 'react-redux'


import { io } from "socket.io-client"

import axios from "axios"
import {toast as sonnerToast} from 'sonner'
import {Wallet} from 'lucide-react'

import NotificationModal from "../NotificationModal/NotificationModal"
import {decryptData} from '../../Utils/decryption'
import SemiAutoRechargeModal from "../SemiAutoRechargeModal/SemiAutoRechargeModal"
import VideoCallCommonModal from '../../Pages/User/VideoCallCommonModal/VideoCallCommonModal'

export const SocketContext = createContext();


export default function SocketProvider() {

    const baseApiUrl = import.meta.env.VITE_API_BASE_URL

    // const socket = useMemo(()=> io(baseApiUrl), [])

    const {userToken, user} = useSelector((state)=> state.user)

    const [socket, setSocket] = useState(null)

    const [isConnected, setIsConnected] = useState(false)
    const [username, setUsername] = useState(null)  
    const [roomId, setRoomId] = useState(null) 

    const [isAdminOnline, setIsAdminOnline] = useState(false)

    const [userWasGuest, setUserWasGuest] = useState({wasGuest: false, credentials: {}})

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

    const [coachMessages, setCoachMessages] = useState([
        {
          id: 1,
          message: `👋 Hi! I’m your FitLab Coach+. I’ve reviewed your recent activity and I’m here to help with 
            workouts, recovery, supplements and fitness guidance—based on your activities and goals.
            What would you like to focus on today?`,
          sender: "Coach",
          timestamp: new Date().toISOString(),
          isCoach: true,
        },
    ]) 
    const [newCoachMessage, setNewCoachMessage] = useState("") 
    const [isCoachLoading, setIsCoachLoading] = useState(false)
    const [coachError, setCoachError] = useState("") 

    const [isTyping, setIsTyping] = useState(false)

    const [openVideoCallModal, setOpenVideoCallModal] = useState(false)
    const [scheduledVideoCallSessionId, setScheduledVideoCallSessionId] = useState(null)
    const [videoSessionInfo, setVideoSessionInfo] = useState({})

    const [forceEndScheduledSession, setForceEndScheduledSession] = useState(false)

    const [notifications, setNotifications] = useState([])

    const [openNotificationModal, setOpenNotificationModal] = useState({
      header: null, content: null, icon: null, type: null, duration: 6000, walletRecharged: false
    })

    const [openSemiAutoRechargeModal, setOpenSemiAutoRechargeModal] = useState({
      status: false, walletAmount: null, autoRechargeAmount: null, recharged: false
    })

    const messagesEndRef = useRef(null)             
    const typingTimeoutRef = useRef(null)

    
    useEffect(()=> { 
      async function fetchUserId(){
        const guestVerificationRes = await axios.get(`${baseApiUrl}/guest-check`, {withCredentials: true})
        console.log("guestVerificationRes--->", guestVerificationRes.data)
        if(guestVerificationRes.data.wasGuest){
          const {userId, username} = guestVerificationRes.data.credentials
          setUserWasGuest({wasGuest: true, credentials: {userId, username}})
        }
        const response = await axios.get(`${baseApiUrl}/getUserid`, {withCredentials: true})
        console.log("response from fetchUserId--->", response)
        const decryptedUserId = decryptData(response.data.encryptedUserId)
        setRoomId(decryptedUserId)
        setUsername(response.data.username)
      } 
      async function fetchGuestId(){
        const response = await axios.get(`${baseApiUrl}/guest`, {withCredentials: true})
        console.log("response from fetchGuestId--->", response)
        setRoomId(response.data.userId)
        setUsername(response.data.username)
      } 
      if(userToken){
        fetchUserId()
      }else{
        fetchGuestId()
      }
    }, [userToken])
    
    useEffect(()=> {
        console.log("username--->", username)
        console.log("roomId--->", roomId)
        console.log("userWasGuest--->", userWasGuest)
    },[username, roomId, userWasGuest])

    useEffect(()=> {
      console.log("openSemiAutoRechargeModal--->", openSemiAutoRechargeModal)
    }, [openSemiAutoRechargeModal])

    useEffect(()=> {
      console.log("notifications from SocketProvider--->", notifications)
    }, [notifications])

    useEffect(() => {
        const socket = io(baseApiUrl)
    
        socket.on("connect", () => {
          setIsConnected(true)
          if(userWasGuest.wasGuest){
            console.log("Guest details before emiting delete-guest--->", userWasGuest)
            socket.emit("delete-guest", {userId: userWasGuest.credentials.userId, username: userWasGuest.credentials.username})
            setUserWasGuest({wasGuest: false, credentials: {}})
          }
          if(roomId && username){
            socket.emit("user-login", { userId: roomId, username })
            console.log("User going to join room....")
            socket.emit("user-join-room", roomId)
            socket.emit("joinFitlab", {userId: roomId, username})
          }
        })

        socket.on("admin-status", status=> {
          setIsAdminOnline(status)
        })

        socket.on("connect_error", (error) => {
          console.error("Server unreachable:", error.message)
          setIsConnected(false)
          setIsAdminOnline(false)
        })
    
        socket.on("disconnect", () => {
          setIsConnected(false)
          setIsAdminOnline(false)
        })

        socket.on("chat-history", (messages) => {
          console.log("chat-history receieved----->", messages)
          setMessages(messages)
        })
        
        socket.on("receive-message", (message) => {
        //   if (message.sender !== username) {
            console.log('Message received from admin--->', message)
            setMessages((prev) => [...prev, message])
        //   }
        })

        socket.on("user-typing", (data) => {
          if (data.sender !== username) {
            setIsTyping(data.isTyping)
          }
        })

        socket.on("notifySupportCalling", (sessionId, sessionDetails)=> {
          console.log("Inside on notifySupportCalling....")
          setScheduledVideoCallSessionId(sessionId)
          console.log("sessionDetails----->", sessionDetails)
          setVideoSessionInfo(sessionDetails)
          setOpenVideoCallModal(true)
        })

        socket.on("unNotifySupportCalling", ()=> {
          console.log("Inside on unNotifySupportCalling...")
          setScheduledVideoCallSessionId(null)
          setVideoSessionInfo({})
          setOpenVideoCallModal(false)
          console.log("Emiting unNotifiedSupportCaling...")
          socket.emit("unNotifiedSupportCalling")
        }) 

        socket.on('coach-response', (message)=> {
          console.log("coach-response-->", message)
          setCoachMessages((prev) => [...prev, message]) 
        })
      
        socket.on('coach-loading', (status)=> {
          console.log("coach-loading....")
          setIsCoachLoading(status)
        })
      
        socket.on('coach-error', (message)=> {
          console.log("coach-error-->", message)
          setCoachError(message)
        })

        socket.on("walletRechargeSuccess", (data) => {
          console.log("AUTO-RECHARGE SUCCESS!", data)
          sonnerToast.success('Recharged wallet!', {duration: 2500})
          setOpenNotificationModal({
            header: "Wallet Auto-Recharged", content: `Wallet recharged with ₹${data.amount} through ${data.method}`, icon: Wallet,
            type: "success", duration: 6000, walletRecharged: true
          })
        }) 

        socket.on("warnRazorpayRecharge", (data) => {
          console.log("Warning on Razorpay recharge", data)
          console.log("data.autoRechargeAmount------>", data.amount)
          if(!openSemiAutoRechargeModal.status){
            setOpenSemiAutoRechargeModal({status: true, walletAmount: data.balance, autoRechargeAmount: data.amount})
          }
        }) 

        socket.on("receive-notification", (data) => {
          console.log("Received notification", data)
          setNotifications(prev=> [...prev, data])
        }) 

        socket.on("notification-marked-read", (id) => {
          console.log("Notification id marked read----->", id)
          setNotifications(prev =>
            prev.map(notification=> notification._id === id ? { ...notification, isRead: true } : notification)
          )
        })

        socket.on("all-notifications-marked-read", () => {
          console.log("All Notification marked read")
          setNotifications(prev =>
            prev.map(notification => ({
              ...notification,
              isRead: true,
            }))
          )
          const updatedNotifications = notifications.map(notification=> ({...notification, isRead: true}))
          setNotifications(updatedNotifications)
        }) 

        socket.on("notification-deleted", (id) => {
          console.log("All Notification marked read")
          setNotifications(notifications=> notifications.filter(notification=> notification._id !== id))
        }) 

        socket.on('notification-error', (message)=> {
          console.log("Notification error-->", message)
          sonnerToast.error(message) 
        }) 

        setSocket(socket)

        return () => {
          socket.disconnect()
        }
    }, [roomId])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
      console.log("newCoachMessage-->", newCoachMessage)
      console.log("coachMessages-->", coachMessages)
      console.log("isCoachLoading-->", isCoachLoading)
      console.log("coachError-->", coachError)
    }, [coachMessages, newCoachMessage, isCoachLoading, coachError])
    
    
      const handleSendMessage = (e) => {
        console.log("Inside handleSendMessage...")
        e.preventDefault()
        if (!newMessage.trim() || !socket) return
    
        const messageData = {
          roomId,
          message: newMessage,
          sender: username,
          timestamp: new Date().toISOString(),
          isAdmin: false,
        }
    
        socket.emit("send-message", messageData)
        // setMessages((prev) => [...prev, messageData])
    
        setNewMessage("")
    
    
        // Stop typing indicator
        socket.emit("typing", { roomId, isTyping: false, sender: username })
      }
    
      const handleTyping = (e) => {
        console.log("Inside handleTyping...")
        setNewMessage(e.target.value)
    
        if (!socket) return
    
        // Send typing indicator
        socket.emit("typing", { roomId, isTyping: true, sender: username })
    
        // Clear previous timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }
    
        // Stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
          socket.emit("typing", { roomId, isTyping: false, sender: username })
        }, 2000)
      }

      const handleSendMessageToCoach = (e) => {
        console.log("Inside handleSendMessage...") 
        e.preventDefault()
        if (!newCoachMessage.trim() || !socket) return 
    
        const messageData = {
          roomId,
          message: newCoachMessage,
          sender: username,
          userId: user._id,
          userGoal: user.fitnessGoal, 
          timestamp: new Date().toISOString(),
          isCoach: false,
        }
    
        socket.emit("coach-ask", messageData)
        setCoachMessages((prev) => [...prev, messageData])
    
        setNewCoachMessage("")
      }

      const handleUserTypingForCoach = (e) => { 
        setNewCoachMessage(e.target.value)
      }

      const markNotificationRead = (id, userId)=> {
        socket.emit("mark-notification-read", {notificationId: id, userId} )
      }

      const markAllNotificationRead = (userId)=> {
        socket.emit("mark-all-notifications-read", userId)
      }

      const deleteNotification = (id, userId)=> {
        socket.emit("delete-notification", {notificationId: id, userId} )
      }
    

  return (
    <SocketContext.Provider value={{
        socket,
        isConnected,
        isAdminOnline,
        userId: roomId,
        username,
        messages,
        newMessage,
        isTyping,
        messagesEndRef,
        typingTimeoutRef,
        handleTyping,
        handleSendMessage,
        coachMessages,
        newCoachMessage,
        isCoachLoading,
        coachError,
        handleSendMessageToCoach,
        handleUserTypingForCoach,
        openVideoCallModal,
        setOpenVideoCallModal,
        scheduledVideoCallSessionId,
        videoSessionInfo,
        forceEndScheduledSession,
        setForceEndScheduledSession,
        openSemiAutoRechargeModal, 
        setOpenSemiAutoRechargeModal,
        setOpenNotificationModal,
        openNotificationModal,
        notifications,
        setNotifications,
        markNotificationRead,
        markAllNotificationRead,
        deleteNotification
        // VideoCallCommonModal : <VideoCallCommonModal/>
      }}
    >

      <Outlet/>

      <NotificationModal
        isOpen={openNotificationModal.header}
        onClose={()=> setOpenNotificationModal({header: null, content: null, icon: null, type: null, duration: 6000, walletRecharged: true})}
        header={openNotificationModal.header}
        content={openNotificationModal.content}
        icon={openNotificationModal.icon}
        type={openNotificationModal.type}
        autoClose={true}
        autoCloseDuration={openNotificationModal.duration}
        closeButton={true}
      />

      {
        openSemiAutoRechargeModal && openSemiAutoRechargeModal.status &&
         <SemiAutoRechargeModal 
          isOpen={()=> openSemiAutoRechargeModal.status}
          onClose={()=> setOpenSemiAutoRechargeModal({status: false, walletAmount: null, autoRechargeAmount: null, recharged: false})}
          walletAmount={openSemiAutoRechargeModal.walletAmount}
          autoRechargeAmount={openSemiAutoRechargeModal.autoRechargeAmount}
          onRecharged={()=> {
            setOpenSemiAutoRechargeModal({status: false, walletAmount: null, autoRechargeAmount: null, recharged: true})
          }}
         />
       }

    </SocketContext.Provider>
  )

}
