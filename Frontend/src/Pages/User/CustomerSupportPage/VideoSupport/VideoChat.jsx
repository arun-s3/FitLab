import React,{ useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

import { Mic, MicOff, Video, VideoOff, Phone, MessageSquare, Users } from "lucide-react"
import {toast as sonnerToast} from 'sonner'

import VideoChatInfoTab from './VideoChatInfoTab' 


export default function VideoChat({ socketContextItems, ImmediateVideoCallsessionId = null, scheduledCallReceived = false, scheduledVideoCallSessionId = null, onEndCall }) {

  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [isChatOpen, setIsChatOpen] = useState(false)

  const [sessionId, setSessionId] = useState(null)

  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const peerConnectionRef = useRef(null)

  const {socket, newMessage, isTyping, messagesEndRef, handleSendMessage, handleTyping} = socketContextItems

  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
  }

  useEffect(()=> {
    if(ImmediateVideoCallsessionId){
      setSessionId(ImmediateVideoCallsessionId)
    }
  }, [ImmediateVideoCallsessionId])

  useEffect(() => {
    let localStream

    const initializeMedia = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream
        }

        peerConnectionRef.current = new RTCPeerConnection(configuration)

        localStream.getTracks().forEach((track) => {
          peerConnectionRef.current.addTrack(track, localStream)
        })

        peerConnectionRef.current.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0]
            setIsConnected(true)
          }
        }
        socket.emit("joinSession", { sessionId })

        socket.on("offer", async (offer) => {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer))
          const answer = await peerConnectionRef.current.createAnswer()
          await peerConnectionRef.current.setLocalDescription(answer)
          socket.emit("answer", { sessionId, answer })
        })

        socket.on("answer", async (answer) => {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer))
        })

        socket.on("iceCandidate", async (candidate) => {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate))
        })

        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("iceCandidate", { sessionId, candidate: event.candidate })
          }
        }

        setTimeout(async () => {
          const offer = await peerConnectionRef.current.createOffer()
          await peerConnectionRef.current.setLocalDescription(offer)
          socket.emit("offer", { sessionId, offer })
        }, 2000)

        socket.off("chatMessage")
        socket.on("chatMessage", (msg) => {
          if(msg.sender !== 'user'){
            setMessages((prev) => [...prev, { sender: "admin", text: msg.text, timestamp: Date.now() }])
          }
        })

      } catch (error) {
        sonnerToast.error("Error accessing media devices. Please check your browser settings and give us required permissions")
      }
    }

    if(socket && sessionId){
      initializeMedia()

      return () => {
        if (localStream) {
          localStream.getTracks().forEach((track) => track.stop())
        }
      
        if (peerConnectionRef.current) {
          peerConnectionRef.current.close()
        }
      
        socket.off("offer")
        socket.off("answer")
        socket.off("iceCandidate")
        socket.off("chatMessage")
      }
    }
  }, [sessionId, socket])

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

  const handleEndCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }

    const localStream = localVideoRef.current?.srcObject
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
    }

    socket.emit("leaveSession", { sessionId })
    onEndCall()
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (message.trim()) {
      socket.emit("chatMessage", { sessionId, text: message, timestamp: Date.now() })
      setMessages((prev) => [...prev, { sender: "user", text: message, timestamp: Date.now()   }])
      setMessage("")
    }
  }

  const startScheduledVideoCall = ()=> {
    if(scheduledVideoCallSessionId){
      socket.emit('startScheduledSession', scheduledVideoCallSessionId)
      setSessionId(scheduledVideoCallSessionId)
    }
  }

  const declineScheduledVideoCall = ()=> {
    socket.emit("leaveScheduledSession", { sessionId: scheduledVideoCallSessionId })
    onEndCall()
  }


  return (
    <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white">
      <div className="absolute inset-0 opacity-95 rounded-3xl"></div>

      <div className="relative h-[60vh] bg-gradient-to-br from-gray-900 to-black rounded-t-3xl">
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />

        {!isConnected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              className="text-white text-xl font-medium"
            >
              { scheduledCallReceived ? 'Expert calling you...' : 'Connecting to expert...' }
            </motion.div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-4 right-4 w-1/4 h-1/4 rounded-lg overflow-hidden border-2 border-white shadow-lg"
        >
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

          {isVideoOff && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <Users className="h-8 w-8 text-white opacity-70" />
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isChatOpen ? "280px" : 0 }}
        className="bg-gradient-to-br from-gray-50 to-white overflow-hidden border-t border-gray-200"
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex-1 overflow-y-auto mb-4 space-y-3 z-50">
            {messages.map((msg, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 text-[14px] border border-gray-300 rounded-[5px] shadow-sm ${
                    msg.sender === "user"
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
          <form onSubmit={sendMessage} className="flex gap-3 z-20">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
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

      {
        sessionId &&
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gradient-to-r from-white to-gray-50 flex items-center justify-between rounded-b-3xl border-t border-gray-200"
        >
          <div className="flex space-x-3 z-20">
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
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleEndCall}
            className="p-4 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transition-all duration-300"
          >
            <Phone className="h-5 w-5 transform rotate-135" />
          </motion.button>
        </motion.div>
      }

      {
        !sessionId && scheduledCallReceived &&
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        // className="p-6 bg-gradient-to-r from-white to-gray-50 rounded-b-3xl border-t border-gray-200"
        >

          <VideoChatInfoTab startVideoCall={()=> startScheduledVideoCall()} declineVideoCall={()=> declineScheduledVideoCall()}/>

        </motion.div>
      }

    </div>
  )
}
