
async function notificationSocket(io) {

     if (io){

        io.on("connection", (socket) => {
          socket.on("joinFitlab", (userId) => {
            socket.join(userId.toString())
            console.log("User joined Fitlab-backend:", userId)
          })
        })

     }
}

module.exports = notificationSocket

 
