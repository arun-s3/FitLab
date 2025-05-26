const Server = require("socket.io").Server


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
      console.log("User connected:", socket.id)

      socket.on("join-room", (roomId) => {
        socket.join(roomId)
        console.log(`User ${socket.id} joined room ${roomId}`)
      })

      socket.on("send-message", (data) => {
        io.to(data.roomId).emit("receive-message", {
          id: Date.now(),
          message: data.message,
          sender: data.sender,
          timestamp: new Date().toISOString(),
          isAdmin: data.isAdmin || false,
        })
      })

      socket.on("typing", (data) => {
        socket.to(data.roomId).emit("user-typing", {
          userId: socket.id,
          isTyping: data.isTyping,
          sender: data.sender,
        })
      })

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id)
      })
    })
  }
}

module.exports = textChatBoxSocket




