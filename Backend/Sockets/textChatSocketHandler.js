const Server = require("socket.io").Server


const activeUsers = new Map()
const adminSessions = new Set() 

let io

async function textChatBoxSocket(server) {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
      },
    })

      io.on("connection", (socket) => {
      // console.log("User connected:", socket.id)

      socket.on("admin-login", (adminData) => {
        adminSessions.add(socket.id)
        socket.join("admin-room")

        socket.emit("active-users-update", Array.from(activeUsers.values()))
        console.log("Admin connected:", socket.id)
      })

      const guestCounter = ()=> {
        console.log('Getting guest count')
        const currentJoinedUserDatas = Object.values(Object.fromEntries(activeUsers))
        const guestCount = currentJoinedUserDatas.reduce((count, data) => {
          if (data.username.startsWith('guest') && data.isOnline) {
              return count + 1
          }
          return count
        }, 0)
        console.log("guestCount-->", guestCount)
        return guestCount
      }

      socket.on("user-login", (userData)=> {
        console.log('New user comes up-->', userData.username)
        console.log("userData.username.startsWith('guest')-->", userData.username.startsWith('guest'))
        console.log("activeUsers--->", activeUsers)
        const joinedUserDatas = Object.values(Object.fromEntries(activeUsers))
        console.log("joinedUserDatas--->", joinedUserDatas)
        const usernameJoined = joinedUserDatas.some(data=> (data.username === userData.username))
        console.log("usernameJoined--->", usernameJoined)
        
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
            console.log("Deleted old copy of user and put new one....")
            const newUserData =  {
              socketId: socket.id,
              userId: userData.userId,
              username: userData.username,
              joinedAt: new Date().toISOString(),
              lastSeen: new Date().toISOString(),
              isOnline: true,
            }
            activeUsers.set(socket.id, newUserData)
            io.to("admin-room").emit('reconnect-user', newUserData)
            // activeButOfflineUser.isOnline = true
            // activeButOfflineUser.lastSeen = new Date().toISOString()
            // activeButOfflineUser.socketId = socket.id
            // console.log("Updating the online status of the active offline user....")
            // activeUsers.set(socket.id, activeButOfflineUser)
          }
        }
        io.to("admin-room").emit("active-users-update", Array.from(activeUsers.values()))
      })

      socket.on("join-room", (roomId) => {
        socket.join(roomId)
        console.log(`User ${socket.id} joined room ${roomId}`)
      })

      socket.on("count-all-guests", ()=> {
        console.log('Inside count-all-guests...')
        const guestCount = guestCounter()
        io.to("admin-room").emit("guest-counts", guestCount)
      })

      socket.on("send-message", (data) => {
        console.log("Inside send-message..data-->", data)
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

        io.to(data.roomId).emit("receive-message", messageData)

        io.to("admin-room").emit("new-message-notification", messageData)
      })

      socket.on("admin-send-message", (data) => {
        console.log("admin sent message---->", data)
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

        io.to(data.roomId).emit("receive-message", messageData)

        io.to("admin-room").emit("admin-message-sent", messageData)
      })

      socket.on("typing", (data) => {
        // socket.to(data.roomId).emit("user-typing", {
        //   userId: data.roomId,
        //   isTyping: data.isTyping,
        //   sender: data.sender,
        // })

        console.log("Inside typing..data-->", data)
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

      socket.on("update-and-sort-activeUsers", (user)=> {
        console.log("Inside update-and-sort-activeUsers")
        const userData = activeUsers.get(user.socketId)
        activeUsers.delete(user.socketId)
        // const newActiveUsers = new Map()
        // newActiveUsers.set(userSocketId, user)
        reorderedActiveUsers = [[user.socketId, userData], ...activeUsers.entries()]
        activeUsers.clear()
        for(const [key, value] of reorderedActiveUsers){
          activeUsers.set(key, value)
        }
        console.log("activeUsers--->", activeUsers)
        io.to("admin-room").emit("updated-activeUsers", {user, users: Array.from(activeUsers.values())})
      })

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id)

        adminSessions.delete(socket.id)

        if (activeUsers.has(socket.id)) {
          const user = activeUsers.get(socket.id)
          user.isOnline = false
          user.lastSeen = new Date().toISOString()
          console.log('Disconnecting user--->', user)
          activeUsers.set(socket.id, user)

          io.to("admin-room").emit("update-last-seen", user)
          io.to("admin-room").emit("active-users-update", Array.from(activeUsers.values()))
        }
      })
    })

  }
}



module.exports = textChatBoxSocket




