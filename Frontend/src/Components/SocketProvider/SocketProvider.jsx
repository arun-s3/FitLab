import React,{ createContext, useState, useEffect, useMemo, useRef } from "react"
import {Outlet} from 'react-router-dom'
import {useSelector} from 'react-redux'

import { io } from "socket.io-client"

import apiClient from "../../Api/apiClient"
import {toast as sonnerToast} from 'sonner'
import {Wallet} from 'lucide-react'

import NotificationModal from "../NotificationModal/NotificationModal"
import {decryptData} from '../../Utils/decryption'
import SemiAutoRechargeModal from "../SemiAutoRechargeModal/SemiAutoRechargeModal"
import VideoCallCommonModal from '../../Pages/User/VideoCallCommonModal/VideoCallCommonModal'
import useTermsConsent from "../../Hooks/useTermsConsent"

export const SocketContext = createContext();


export default function SocketProvider() {

    const baseApiUrl = import.meta.env.VITE_API_BASE_URL

    const {user} = useSelector((state)=> state.user)

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

    const {acceptTermsOnFirstAction} = useTermsConsent()

    
    useEffect(()=> { 
      async function fetchUserId(){
        try{
            const guestVerificationRes = await apiClient.get(`${baseApiUrl}/guest-check`)
            if(guestVerificationRes.data.wasGuest){
              const {userId, username} = guestVerificationRes.data.credentials
              setUserWasGuest({wasGuest: true, credentials: {userId, username}})
            }
            const response = await apiClient.get(`${baseApiUrl}/getUserid`)
            const decryptedUserId = decryptData(response.data.encryptedUserId)
            setRoomId(decryptedUserId)
            setUsername(response.data.username)
        }catch(error) {
            console.error(error)
        }
      } 
      async function fetchGuestId(){
        try{
            const response = await apiClient.get(`${baseApiUrl}/guest`)
            setRoomId(response.data.userId)
            setUsername(response.data.username)
        }catch(error){
            console.error(error)
        }
      } 
      if(user){
        fetchUserId()
      }else{
        fetchGuestId()
      }
    }, [user])

    useEffect(() => {
        if (!isAdminOnline) setIsTyping(false)
    }, [isAdminOnline])

    useEffect(() => {
        const socket = io(baseApiUrl, {
            withCredentials: true, 
        })
    
        socket.on("connect", () => {
          setIsConnected(true)
          if(userWasGuest.wasGuest){
            socket.emit("delete-guest", {userId: userWasGuest.credentials.userId, username: userWasGuest.credentials.username})
            setUserWasGuest({wasGuest: false, credentials: {}})
          }
          if(roomId && username){
            socket.emit("user-login", { userId: roomId, username })
            socket.emit("user-join-room", roomId)
            socket.emit("joinFitlab", {userId: roomId, username})
          }
        })

        socket.on("admin-status", status=> {
          setIsAdminOnline(status)
        })

        socket.on("connect_error", (error) => {
          setIsConnected(false)
          setIsAdminOnline(false)
        })
    
        socket.on("disconnect", (reason) => {
            setIsConnected(false)
            setIsAdminOnline(false)
        })

        // socket.on("error", (err) => {
        //     console.error("Socket error:", err)
        // })

        socket.on("chat-history", (messages) => {
          setMessages(messages)
        })
        
        socket.on("receive-message", (message) => {
            setMessages((prev) => [...prev, message])
        })

        socket.on("user-typing", (data) => {
          if (data.sender !== username) {
            setIsTyping(data.isTyping)
          }
        })

        socket.on("notifySupportCalling", (sessionId, sessionDetails)=> {
          setScheduledVideoCallSessionId(sessionId)
          setVideoSessionInfo(sessionDetails)
          setOpenVideoCallModal(true)
        })

        socket.on("unNotifySupportCalling", ()=> {
          setScheduledVideoCallSessionId(null)
          setVideoSessionInfo({})
          setOpenVideoCallModal(false)
          socket.emit("unNotifiedSupportCalling")
        }) 

        socket.on('coach-response', (message)=> {
          setCoachMessages((prev) => [...prev, message]) 
        })
      
        socket.on('coach-loading', (status)=> {
          setIsCoachLoading(status)
        })
      
        socket.on('coach-error', (message)=> {
          setCoachError(message)
          setIsCoachLoading(false)
        })

        socket.on("walletRechargeSuccess", (data) => {
          sonnerToast.success('Recharged wallet!', {duration: 2500})
          setOpenNotificationModal({
            header: "Wallet Auto-Recharged", content: `Wallet recharged with ₹${data.amount} through ${data.method}`, icon: Wallet,
            type: "success", duration: 6000, walletRecharged: true
          })
        }) 

        socket.on("warnRazorpayRecharge", (data) => {
          if(!openSemiAutoRechargeModal.status){
            setOpenSemiAutoRechargeModal({status: true, walletAmount: data.balance, autoRechargeAmount: data.amount})
          }
        }) 

        socket.on("receive-notification", (data) => {
          setNotifications(prev=> [...prev, data])
        }) 

        socket.on("notification-marked-read", (id) => {
          setNotifications(prev =>
            prev.map(notification=> notification._id === id ? { ...notification, isRead: true } : notification)
          )
        })

        socket.on("all-notifications-marked-read", () => {
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
          setNotifications(notifications=> notifications.filter(notification=> notification._id !== id))
        }) 

        socket.on('notification-error', (message)=> {
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
    
      const handleSendMessage = (e) => {
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
    
        setNewMessage("")
    
        socket.emit("typing", { roomId, isTyping: false, sender: username })
      }
    
      const handleTyping = (e) => {
        setNewMessage(e.target.value)
    
        if (!socket) return
    
        socket.emit("typing", { roomId, isTyping: true, sender: username })
    
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }
    
        typingTimeoutRef.current = setTimeout(() => {
          socket.emit("typing", { roomId, isTyping: false, sender: username })
        }, 2000)
      }

      const handleSendMessageToCoach = () => {
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

        acceptTermsOnFirstAction()
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
        setIsCoachLoading,
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
