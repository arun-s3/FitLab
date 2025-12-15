const Notification = require("../Models/notificationModel")

const onlineUsers = new Map()

async function notificationSocket(io) {

    if (io){

        io.on("connection", (socket) => {
          socket.on("joinFitlab", (userData) => {
            console.log("User joined Fitlab-backend:", userData)
            // socket.join(userId.toString())
            onlineUsers.set(socket.id, {
              socketId: socket.id,
              userId: userData.userId,
              username: userData.username,
            })
          
            console.log("Active users:", Array.from(onlineUsers.values()))
          })

          socket.on("admin-send-notification", async (data) => {
            try {
              console.log("Inside admin-send-notification...")
              const {userId, title, message, type, referenceModel = null, referenceId = null} = data
            
              // 1️⃣ Save notification (offline-safe)
              const notification = await Notification.create({userId, title, message, type, referenceModel, referenceId, isRead: false})
            
              // 2️⃣ Emit if user is online
              // for (const user of onlineUsers.values()) {
              //   if (String(user.userId) === String(userId)) {
              //     console.log("Emiting receive-notification...")
              //     io.to(user.socketId).emit("receive-notification", notification)
              //   }
              // }
              io.to(userId.toString()).emit("receive-notification", notification)
            
              socket.emit("notification-sent", { success: true })
            }
            catch (error) {
              console.error("Notification error:", error.message)
              socket.emit("notification-error", "Failed to send notification. Please try after sometime.")
            }
          }) 

          socket.on("mark-notification-read", async ({ notificationId, userId }) => {
            try {
              const updated = await Notification.findOneAndUpdate(
                { _id: notificationId, userId },
                { $set: { isRead: true } },
                { new: true }
              )
              if (!updated) return
            
              io.to(userId.toString()).emit("notification-marked-read", notificationId)
            }
            catch (error) {
              console.error("Notification error:", error.message)
            }
          })

          socket.on("mark-all-notifications-read", async (userId) => {
            try {
              await Notification.updateMany(
                { userId, isRead: false },
                { $set: { isRead: true } }
              )
            
              io.to(userId.toString()).emit("all-notifications-marked-read")
            }
            catch (error) {
              console.error("Notification error:", error.message)
            }
          })

          socket.on("disconnect", () => {
            onlineUsers.delete(socket.id)
            console.log("Notification socket disconnected:", socket.id)
          })

        })

    }
}

module.exports = notificationSocket

 
