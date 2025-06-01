import React,{ createContext, useState, useEffect, useMemo, useRef } from "react"
import {Outlet} from 'react-router-dom'
import {useSelector} from 'react-redux'


import { io } from "socket.io-client"

import axios from "axios"

import {decryptData} from '../../Utils/decryption'

export const SocketContext = createContext();


export default function SocketProvider(props) {

    // const socket = useMemo(()=> io("http://localhost:3000"), [])

    const {userToken} = useSelector((state)=> state.user)

    const [socket, setSocket] = useState(null)

    const [isConnected, setIsConnected] = useState(false)
    const [username, setUsername] = useState(null)  
    const [roomId, setRoomId] = useState(null) 

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


    const messagesEndRef = useRef(null)             
    const typingTimeoutRef = useRef(null)

    
    useEffect(()=> {
      async function fetchUserId(){
        const response = await axios.get('http://localhost:3000/getUserid', {withCredentials: true})
        console.log("response from fetchUserId--->", response)
        const decryptedUserId = decryptData(response.data.encryptedUserId)
        setRoomId(decryptedUserId)
        setUsername(response.data.username)
      } 
      async function fetchGuestId(){
        const response = await axios.get('http://localhost:3000/guest', {withCredentials: true})
        console.log("response from fetchGuestId--->", response)
        setRoomId(response.data.userId)
        setUsername(response.data.username)
      } 
      if(userToken){
        fetchUserId()
      }else{
        fetchGuestId()
      }
    }, [])
    
    useEffect(()=> {
        console.log("username--->", username)
        console.log("roomId--->", roomId)
    },[username, roomId])

    useEffect(() => {
        const socket = io("http://localhost:3000")
    
        socket.on("connect", () => {
          setIsConnected(true)
          socket.emit("user-login", { userId: roomId, username })
          socket.emit("join-room", roomId)
        })
    
        socket.on("disconnect", () => {
          setIsConnected(false)
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
    

  return (
    <SocketContext.Provider value={{
        isConnected,
        messages,
        newMessage,
        isTyping,
        messagesEndRef,
        typingTimeoutRef,
        handleTyping,
        handleSendMessage
      }}
    >

      <Outlet/>

    </SocketContext.Provider>
  )

}
