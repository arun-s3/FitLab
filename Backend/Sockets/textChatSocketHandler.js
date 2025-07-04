
const activeUsers = new Map()
const adminSessions = new Set() 


async function textChatBoxSocket(io) {
  if (io){

      io.on("connection", (socket) => {

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
            io.to("admin-room").emit('reconnect-if-user-selected', newUserData)
          }
        }
        io.to("admin-room").emit("active-users-update", Array.from(activeUsers.values()))
      })

      socket.on("user-join-room", (roomId) => {
        console.log("Inside on user-join-room...")
        socket.join(roomId)
        console.log(`User ${socket.id} joined room ${roomId}`)
        const isAdminJoined = adminSessions.size > 0
        console.log("isAdminJoined--->", isAdminJoined)
        if(isAdminJoined){
          console.log("Emiting let-user-connect-admin...")
          io.to("admin-room").emit('let-user-connect-admin', roomId)
        }
      })

      socket.on("admin-permits-user-connection", (roomId)=> {
        console.log("Inside on admin-permits-user-connection...")
        socket.join(roomId)
      })

      socket.on("admin-joins-every-rooms", ()=> {
        console.log("Inside on join-every-rooms...")
        if(activeUsers.size > 0){
          activeUsers.forEach((userData, socketId)=> {
          socket.join(userData.userId)
          console.log(`Admin joined room ${userData.userId}`)
        })
        }
      })

      socket.on("delete-guest", (user)=> {
        if(user){
          console.log('Inside delete-guest..., guest details--->', user)
          const joinedUserDatas = Object.values(Object.fromEntries(activeUsers))
          const guestUser = joinedUserDatas.find(data=> (data.username === user.username))
          console.log("guestUser-->", guestUser)
          activeUsers.delete(guestUser.socketId)
          console.log("guestUser deleted")
          const guestCount = guestCounter()
          io.to("admin-room").emit('guest-counts', guestCount)
          io.to("admin-room").emit("active-users-update", Array.from(activeUsers.values()))
        }
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




