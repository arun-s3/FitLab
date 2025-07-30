import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Mic, MicOff, Video, VideoOff, Phone, MessageSquare, Users, Monitor, Settings } from "lucide-react"

export default function AdminVideoChat({ adminSocketContextItems, session, onEndSession }) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [sessionDuration, setSessionDuration] = useState(0)
  const [userInfo, setUserInfo] = useState(null)

  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const peerConnectionRef = useRef(null)

  const {
        socket,
        guestCount,
        activeUsers,
        // messages, 
        newMessage, 
        typingUsers, 
        unreadCounts,
        setUnreadCounts, 
        notifications,
        setNotifications,
        messagesEndRef, 
        handleTyping,
        handleSendMessage
    } = adminSocketContextItems

  // WebRTC configuration
  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
  }

  useEffect(() => {
    let localStream
    let durationInterval

    const initializeMedia = async () => {
      try {
        // Get local media stream
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        console.log("localStream-->", localStream)

        // Display local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream
        }

        // Initialize WebRTC peer connection
        peerConnectionRef.current = new RTCPeerConnection(configuration)

        // Add local tracks to peer connection
        localStream.getTracks().forEach((track) => {
          peerConnectionRef.current.addTrack(track, localStream)
        })

        // Handle remote tracks
        peerConnectionRef.current.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0]
            setIsConnected(true)
          }
        }

        // Connect to signaling server
        // socket.connect()
        console.log("Emiting joinSession....")
        socket.emit("joinSession", { sessionId: session.sessionId })

        // Handle signaling
        socket.on("offer", async (offer) => {
          console.log("Inside on offer....")
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer))
          const answer = await peerConnectionRef.current.createAnswer()
          await peerConnectionRef.current.setLocalDescription(answer)
          console.log("Emiting answer....")
          socket.emit("answer", { sessionId: session.sessionId, answer })
        })

        socket.on("answer", async (answer) => {
          console.log("Inside on answer....")
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer))
        })

        socket.on("iceCandidate", async (candidate) => {
          console.log("Inside on iceCandidate....")
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate))
        })

        // Handle ICE candidates
        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
             console.log("Emiting iceCandidate....")
             socket.emit("iceCandidate", { sessionId: session.sessionId, candidate: event.candidate })
          }
        }

        socket.off("chatMessage")
        socket.on("chatMessage", (msg) => {
          if(msg.sender !== 'admin'){
            console.log("Inside on chatMessage, msg-->", msg)
            setMessages((prev) => [...prev, { sender: "user", text: msg.text, timestamp: Date.now() }])
          }
        })

        // Get user info
        setUserInfo({
          userId: session.userId,
          username: session.username,
          joinTime: session.startTime,
          requestType: session.requestType || "Immediate Support",
        })

        // Start session duration timer
        durationInterval = setInterval(() => {
          setSessionDuration((prev) => prev + 1)
        }, 1000)

        // Auto-connect after 1 second (admin initiates)
        setTimeout(async () => {
          const offer = await peerConnectionRef.current.createOffer()
          await peerConnectionRef.current.setLocalDescription(offer)
          console.log("Emiting offer....")
          socket.emit("offer", { sessionId: session.sessionId, offer })
        }, 1000)
      } catch (error) {
        console.error("Error accessing media devices:", error)
      }
    }

    if(socket && session){
      initializeMedia()

    // Cleanup function
      return () => {
        if (localStream) {
          localStream.getTracks().forEach((track) => track.stop())
        }

        if (peerConnectionRef.current) {
          peerConnectionRef.current.close()
        }

        if (durationInterval) {
          clearInterval(durationInterval)
        }

        socket.off("offer")
        socket.off("answer")
        socket.off("iceCandidate")
        socket.off("chatMessage")
      }
    }
  }, [session, socket])

    useEffect(()=> {
      console.log("isConnected--->", isConnected)
      console.log("message--->", message)
      console.log("messages--->", messages)
      console.log("localVideoRef--->", localVideoRef)
      console.log("peerConnectionRef--->", peerConnectionRef)
      console.log("remoteVideoRef--->", remoteVideoRef)
      console.log("isChatOpen--->", isChatOpen)
    }, [isConnected, message, messages, localVideoRef, peerConnectionRef, isChatOpen])

  const toggleMute = () => {
    const localStream = localVideoRef.current?.srcObject
    if (localStream) {
      const audioTracks = localStream.getAudioTracks()
      audioTracks.forEach((track) => {
        track.enabled = isMuted
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    const localStream = localVideoRef.current?.srcObject
    if (localStream) {
      const videoTracks = localStream.getVideoTracks()
      videoTracks.forEach((track) => {
        track.enabled = isVideoOff
      })
      setIsVideoOff(!isVideoOff)
    }
  }

  const handleEndSession = () => {
    // Close peer connection and stop tracks
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }

    const localStream = localVideoRef.current?.srcObject
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
    }

    console.log("Emiting endSession...")
    socket.emit("endSession", { sessionId: session.sessionId })
    console.log("calling  =onEndSession()...")
    onEndSession()
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (message.trim()) {
      socket.emit("chatMessage", { sessionId: session.sessionId, text: message, timestamp: Date.now() })
      setMessages((prev) => [...prev, { sender: "admin", text: message, timestamp: Date.now() }])
      setMessage("")
    }
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className={`${isChatOpen && 'flex gap-4'} h-full`}>
    <div className={`h-screen flex flex-col bg-gray-900 ${isChatOpen && 'basis-[65%]'}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg p-4 flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-700 rounded-full flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 flex items-center gap-[5px]">
              <span> User #{userInfo?.username} </span>
              {
                 userInfo?.username.includes('guest') && 
                 <span className='text-[14px] italic text-secondary'> (Guest) </span> 
              }
            </h2>
            <p className="text-sm text-gray-500">{userInfo?.requestType}</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              { `${userInfo?.username.includes('guest') ? 'Guest' : ''} Session Duration` }
            </p>
            <p className="font-semibold text-gray-800">{formatDuration(sessionDuration)}</p>
          </div>

          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-yellow-500"} animate-pulse`}
            ></div>
            <span className="text-sm text-gray-600">{isConnected ? "Connected" : "Connecting..."}</span>
          </div>
        </div>
      </motion.div>

      {/* Video Area */}
      <div className="flex-1 relative bg-gray-900">
        {/* Remote video (main) */}
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-[600px] object-cover" />

        {!isConnected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              className="text-white text-xl font-medium"
            >
              Connecting to user...
            </motion.div>
          </div>
        )}

        {/* Local video (picture-in-picture) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className={`absolute top-4 right-4 w-1/4 h-1/4 rounded-lg overflow-hidden border-2 border-white shadow-lg`}
        >
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

          {isVideoOff && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <Monitor className="h-8 w-8 text-white opacity-70" />
            </div>
          )}
        </motion.div>

        {/* Session Info Overlay */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white"
        >
          <p className="text-sm">Admin Session</p>
          <p className="text-xs opacity-75">Session ID: {session.sessionId?.slice(-8)}</p>
        </motion.div>
      </div>

      
      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 flex items-center justify-between border-t border-gray-200"
      >
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMute}
            className={`p-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl ${
              isMuted
                ? "bg-gradient-to-br from-red-100 to-red-200 text-red-600 border border-red-300"
                : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 border border-gray-300 hover:from-gray-200 hover:to-gray-300"
            }`}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleVideo}
            className={`p-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl ${
              isVideoOff
                ? "bg-gradient-to-br from-red-100 to-red-200 text-red-600 border border-red-300"
                : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 border border-gray-300 hover:from-gray-200 hover:to-gray-300"
            }`}
          >
            {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`p-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl ${
              isChatOpen
                ? "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 border border-blue-300"
                : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 border border-gray-300 hover:from-gray-200 hover:to-gray-300"
            }`}
          >
            <MessageSquare className="h-5 w-5" />
          </motion.button>

          {/* <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 border border-gray-300 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Settings className="h-5 w-5" />
          </motion.button> */}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleEndSession}
          className="p-4 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transition-all duration-300"
        >
          <Phone className="h-5 w-5 transform rotate-135" />
        </motion.button>
      </motion.div>
    </div>

        {/* Chat panel */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isChatOpen ? '680px' : 0 }}
        className="w-[35%] basis-[35%] h-full bg-white overflow-hidden rounded-[6px] border border-dropdownBorder"
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[15px] text-gray-800">Session Chat</h3>
            <span className="text-[13px] text-gray-500">{messages.length} messages</span>
          </div>

          <div className="flex-1 overflow-y-auto mb-4 space-y-3">
            {messages.map((msg, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={index}
                className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 text-[14px] border border-gray-300 rounded-[5px] shadow-sm ${
                    msg.sender === "admin"
                      ? "bg-gray-200 text-black"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-[10px] opacity-75 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message to the user..."
              className="flex-1 px-4 py-[10px] text-[14px] placeholder:text-[13px] border border-gray-300 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white shadow-sm"
            />
            <button
              type="submit"
              className="bg-primary text-[#6C6C77] px-6 py-3 rounded-[7px] hover:bg-primaryDark transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Send
            </button>
          </form>
        </div>
      </motion.div>


    </div>
  )
}
