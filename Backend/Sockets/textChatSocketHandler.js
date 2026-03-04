const TextChat = require('../Models/textChatBoxModel')
const User = require('../Models/userModel')

const {runAICoach} = require("../Services/aiCoach.service")

const activeUsers = new Map()
const adminSessions = new Set() 


async function textChatBoxSocket(io) {
  if (io){

      io.on("connection", (socket) => {

      socket.on("admin-login", (adminData) => {
        adminSessions.add(socket.id)
        socket.join("admin-room")
        
        socket.emit("active-users-update", Array.from(activeUsers.values()))
        socket.emit("admin-status", true)
      })

      const guestCounter = ()=> {
        const currentJoinedUserDatas = Object.values(Object.fromEntries(activeUsers))
        const guestCount = currentJoinedUserDatas.reduce((count, data) => {
          if (data.username.startsWith('guest') && data.isOnline) {
              return count + 1
          }
          return count
        }, 0)
        return guestCount
      }

      socket.on("user-login", async(userData)=> {
        const joinedUserDatas = Object.values(Object.fromEntries(activeUsers))
        const usernameJoined = joinedUserDatas.some(data=> (data.username === userData.username))
        if(!userData.username.startsWith('guest')){
          await User.findByIdAndUpdate(userData.userId, {lastSeen: new Date()})
        }

        const isAdminJoined = adminSessions.size > 0
        socket.emit("admin-status", isAdminJoined)
        
        if(!usernameJoined){
          activeUsers.set(socket.id, {
              socketId: socket.id,
              userId: userData.userId,
              username: userData.username,
              joinedAt: new Date().toISOString(),
              lastSeen: new Date().toISOString(),
              isOnline: true,
            }
          )
          if(userData.username.startsWith('guest')){
            const guestCount = guestCounter()
            io.to("admin-room").emit('guest-counts', guestCount)
          }
        }else{
          const usernameJoinedButOffline = joinedUserDatas.some(data=> (data.username === userData.username) && !data.isOnline)
          if(usernameJoinedButOffline){
            const activeButOfflineUser = joinedUserDatas.find(data=> (data.username === userData.username) && !data.isOnline)
            activeUsers.delete(activeButOfflineUser.socketId)
            const newUserData =  {
              socketId: socket.id,
              userId: userData.userId,
              username: userData.username,
              joinedAt: new Date().toISOString(),
              lastSeen: new Date().toISOString(),
              isOnline: true,
            }
            activeUsers.set(socket.id, newUserData)
            io.to("admin-room").emit('reconnect-if-user-selected', newUserData)
          }
        }
        io.to("admin-room").emit("active-users-update", Array.from(activeUsers.values()))
      })
-
      socket.on("user-join-room", async(roomId) => {
        socket.join(roomId)
        const isAdminJoined = adminSessions.size > 0
        const messages = await TextChat.find({ roomId }).sort({ createdAt: 1 })
        socket.emit("chat-history", messages)

        if(isAdminJoined){
          io.to("admin-room").emit('let-user-connect-admin', roomId)
          io.to("admin-room").emit('chat-history-with-user', messages)
        }
      })

      socket.on("admin-permits-user-connection", (roomId)=> {
        socket.join(roomId)
      })

      socket.on("admin-joins-every-rooms", async()=> {
        if(activeUsers.size > 0){
          activeUsers.forEach(async (userData)=> {
            socket.join(userData.userId)
            const isAdminJoined = adminSessions.size > 0
            io.to(userData.userId).emit("admin-status", isAdminJoined)

            const messages = await TextChat.find({ roomId: userData.userId }).sort({ createdAt: 1 })

            io.to("admin-room").emit('chat-history-with-user', messages)
        })
        }
      })

      socket.on("delete-guest", (user)=> {
        if(user){
          const joinedUserDatas = Object.values(Object.fromEntries(activeUsers))
          const guestUser = joinedUserDatas.find(data=> (data.username === user.username))
          if(guestUser?.socketId && activeUsers.has(guestUser.socketId)){
            activeUsers.delete(guestUser.socketId)
            const guestCount = guestCounter()
            io.to("admin-room").emit('guest-counts', guestCount)
            io.to("admin-room").emit("active-users-update", Array.from(activeUsers.values()))
          }
        }
      })

      socket.on("count-all-guests", ()=> {
        const guestCount = guestCounter()
        io.to("admin-room").emit("guest-counts", guestCount)
      })

      socket.on("send-message", async(data) => {
        if (activeUsers.has(socket.id)) {
          const user = activeUsers.get(socket.id)
          user.lastSeen = new Date().toISOString()
          activeUsers.set(socket.id, user)
        }

        const messageData = {
          id: Date.now(),
          message: data.message,
          sender: data.sender,
          timestamp: new Date().toISOString(),
          isAdmin: data.isAdmin || false,
          roomId: data.roomId,
          socketId: socket.id,
        }

        const savedMessage = await TextChat.create({
          roomId: data.roomId,
          userId: data.roomId,
          timestamp: messageData.timestamp,
          sender: data.sender,
          message: data.message,
          isAdmin: false,
          isGuest: data.sender.startsWith('guest')
        })
        io.to(data.roomId).emit("receive-message", messageData)

        io.to("admin-room").emit("new-message-notification", messageData)
      })

      socket.on("admin-send-message", async(data) => {
        const messageData = {
          id: Date.now(),
          message: data.message,
          sender: data.sender,
          timestamp: new Date().toISOString(),
          isAdmin: true,
          roomId: data.roomId,
          targetSocketId: data.targetSocketId,
          targetRoomId: data.targetRoomId
        }

        const savedMessage = await TextChat.create({
          roomId: data.roomId,
          userId: data.roomId,
          timestamp: messageData.timestamp,
          sender: "Support Agent",
          message: data.message,
          isAdmin: true,
          isGuest: false
        })
        io.to(data.roomId).emit("receive-message", messageData)

        io.to("admin-room").emit("admin-message-sent", messageData)
      })

      socket.on("typing", (data) => {
        io.to(data.roomId).emit("user-typing-admin", {
          userId: data.roomId,
          isTyping: data.isTyping,
          sender: data.sender,
          roomId: data.roomId,
        })
      })

      socket.on("admin-typing", (data) => {
        socket.to(data.roomId).emit("user-typing", {
          userId: socket.id,
          isTyping: data.isTyping,
          sender: data.sender,
        })
      })

      socket.on("load-chat-history-with-user", async(userId)=> {
        const messages = await TextChat.find({ userId }).sort({ createdAt: 1 })
        io.to("admin-room").emit('chat-history-with-user', messages)
      })

      socket.on("load-chat-history", async ({ roomId, page = 0, limit = 15, isAdmin }) => {
        try {
          const messages = await TextChat
            .find({ roomId })
            .sort({ createdAt: -1 }) 
            .skip(page * limit)
            .limit(limit)

          const messageData =  {
            roomId,
            page,
            messages: messages.reverse(), 
            hasMore: messages.length === limit,
          }
          
          if(isAdmin){
            io.to("admin-room").emit("loaded-chat-history", messageData)
          }else{
            socket.emit("loaded-admin-chat-history", messageData)
          }
        } catch (error) {
          console.error("Error loading chat history", error)
        }
      })

      socket.on("disconnect", async() => {
        if(adminSessions.has(socket.id)){
          activeUsers.forEach(async (userData)=> {
            io.to(userData.userId).emit("admin-status", false)
          })
          adminSessions.delete(socket.id)
        }

        if (activeUsers.has(socket.id)) {
          const user = activeUsers.get(socket.id)
          user.isOnline = false
          user.lastSeen = new Date().toISOString()

          if(!user.username.startsWith('guest')){
            await User.findByIdAndUpdate(user.userId, {lastSeen: new Date()})
          }
          activeUsers.set(socket.id, user)

          io.to("admin-room").emit("update-last-seen", user)
          io.to("admin-room").emit("active-users-update", Array.from(activeUsers.values()))

        }
      })

      socket.on("coach-ask", async (messageData) => {
        try {
          const { message, userGoal, userId } = messageData

          if(!userId) {
            socket.emit("coach-error", { message: "Please sign in to access Coach+" })
          }

          io.to(userId).emit("coach-loading", true)
          const response = await runAICoach({userId, query: message, userGoal})
          const coachMessageToUser = ({
            roomId: messageData.roomId,
            userId: messageData.userId,
            timestamp: messageData.timestamp,
            sender: "Coach+",
            message: response.message,
            isCoach: true,
            isGuest: false
          })
          io.to(userId).emit("coach-response", coachMessageToUser) 
          io.to(userId).emit("coach-loading", false)
        }
        catch (error) {
          socket.emit("coach-error", { message: error.message })
        }
      })

    })

  }
}



module.exports = textChatBoxSocket




