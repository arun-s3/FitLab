const waitingQueue = []
const activeSessions = new Map()
const adminSessions = new Map()

async function videoChatBoxSocket(io){


  if(io){
    io.on("connection", (socket)=> {
      console.log("Client for video chat connected:", socket.id);
      
      socket.on("joinQueue", ({ userId, username}) => {
        
        console.log("Emiting checkAdminStatus to admin...")
        io.to("admin-room").emit("checkAdminStatus", {userId, socketId: socket.id})

        const isUserWaiting = waitingQueue.some(user=> user.userId === userId)
        const isUserInSession = Object.values(Object.fromEntries(activeSessions)).some(user=> user.userId === userId)
        if(!isUserWaiting && !isUserInSession){
          console.log("Inside on joinQueue,")
          const queuePosition = waitingQueue.length + 1;
          const userQueueData = {
            userId,
            username,
            socketId: socket.id,
            joinTime: Date.now(),
            requestType: "Immediate Support"
          }

          waitingQueue.push(userQueueData)

          socket.emit("JoinedQueue")


          console.log("Emiting queueUpdate....")
          socket.emit("queueUpdate", {
            position: queuePosition,
            estimatedWaitTime: queuePosition * 3,
          })

          io.to("admin-room").emit("queueUpdate", { queue: waitingQueue })
        }
      })

      socket.on("adminStatusChecked", ({userId, socketId, status})=> {
        console.log("Inside on adminStatusChecked and emiting currentAdminStatus to user...")
        console.log("status---->", status)
        io.to(socketId).emit("currentAdminStatus", {adminId: "admin-room", status})
      })

      socket.on("adminJoin", ({ adminId }) => {
        adminSessions.set(adminId, {
          socketId: socket.id,
          status: "available",
          currentSession: null
        });

        socket.emit("queueUpdate", {
          queue: waitingQueue,
        });

        console.log("Object.values(Object.fromEntries(activeSessions))------>", Object.values(Object.fromEntries(activeSessions)))

        socket.emit("activeSessionsUpdate", {
          sessions: Array.from(activeSessions.values()),
        });
      });

      socket.on("acceptCall", ({ adminId, userId, username }) => {
        console.log("Inside acceptCall....")
        const userIndex = waitingQueue.findIndex(user => user.userId === userId);

        if (userIndex !== -1) {
          const user = waitingQueue[userIndex];
          const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          console.log("sessionId generated--->", sessionId)
          waitingQueue.splice(userIndex, 1);

          const sessionData = {
            sessionId,
            adminId,
            userId,
            username,
            adminSocketId: socket.id,
            userSocketId: user.socketId,
            startTime: Date.now(),
            requestType: user.requestType
          };

          activeSessions.set(sessionId, sessionData);
          console.log("activeSessions now--->", activeSessions)
          const adminData = adminSessions.get(adminId);
          if (adminData) {
            adminData.status = "busy";
            adminData.currentSession = sessionId;
          }

          console.log("Emiting callReady....")
          io.to(user.socketId).emit("callReady", { sessionId });

          console.log("Emiting sessionStarted....")
          socket.emit("sessionStarted", sessionData);

          socket.join(sessionId);
          io.sockets.sockets.get(user.socketId)?.join(sessionId);

          io.to("admin-room").emit("queueUpdate", {
            queue: waitingQueue,
          });

          io.to("admin-room").emit("activeSessionsUpdate", {
            sessions: Array.from(activeSessions.values()),
          });
        }
      });

      socket.on("startScheduledCall", ({ adminId, adminSocketId, userSocketId, currentScheduledSession }) => {
        console.log("Inside startScheduledCall....")
        const userIndex = waitingQueue.findIndex(user => user.userId === currentScheduledSession.userId);

        // if (userIndex !== -1) {
          const user = waitingQueue[userIndex];
          const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          console.log("sessionId generated--->", sessionId)
          waitingQueue.splice(userIndex, 1);

          const sessionData = {
            sessionId,
            adminId,
            userId: currentScheduledSession.userId,
            username: currentScheduledSession.username,
            adminSocketId,
            userSocketId,
            startTime: Date.now(),
            requestType: currentScheduledSession.requestType
          };

          activeSessions.set(sessionId, sessionData);
          console.log("activeSessions now--->", activeSessions)
          const adminData = adminSessions.get(adminId);
          if (adminData) {
            adminData.status = "busy";
            adminData.currentSession = sessionId;
          }

          console.log("Emiting notifySupportCalling....")
          io.to(userSocketId).emit("notifySupportCalling", sessionId, currentScheduledSession);

          // console.log("Emiting callReady....")
          // io.to(userSocketId).emit("callReady", { sessionId });

          // console.log("Emiting sessionStarted....")
          // socket.emit("sessionStarted", sessionData);

          // socket.join(sessionId);
          // io.sockets.sockets.get(userSocketId)?.join(sessionId);

          // io.to("admin-room").emit("queueUpdate", {
          //   queue: waitingQueue,
          // });

          // io.to("admin-room").emit("activeSessionsUpdate", {
          //   sessions: Array.from(activeSessions.values()),
          // });
        // }
      });

      socket.on("startScheduledSession", (sessionId)=> {
        console.log("Inside startScheduledSession...")
        const sessionData = activeSessions.get(sessionId) 
        io.to("admin-room").emit("sessionStarted", sessionData)
      })

      socket.on("declineCall", ({ adminId, userId }) => {
        const userIndex = waitingQueue.findIndex(user => user.userId === userId);

        if (userIndex !== -1) {
          const user = waitingQueue[userIndex];

          io.to(user.socketId).emit("callDeclined", {
            message: "Admin is currently busy. Please try again later or schedule a session."
          });

        }
      });

      socket.on("leaveQueue", ()=> {
        const queueIndex = waitingQueue.findIndex(user=> user.socketId === socket.id);
        if (queueIndex !== -1) {
          waitingQueue.splice(queueIndex, 1);
          io.to("admin-room").emit("queueUpdate", {
            queue: waitingQueue,
          });
        }
      })

      socket.on("adminStatusChange", ({ adminId, status }) => {
        console.log("Inside on adminStatusChange...")
        const adminData = adminSessions.get(adminId);
        if (adminData) {
          adminData.status = status;
          console.log("Emiting currentAdminStatus...")
          console.log("current status--->", status)
          waitingQueue.forEach(queue=> {
            io.to(queue.socketId).emit("currentAdminStatus", {adminId, status})
          })
        }
      }); 


      socket.on("joinSession", ({ sessionId }) => {
        console.log("Inside on joinSession")
        socket.join(sessionId);
      });

      socket.on("offer", ({ sessionId, offer }) => {
        socket.to(sessionId).emit("offer", offer);
      });

      socket.on("answer", ({ sessionId, answer }) => {
        socket.to(sessionId).emit("answer", answer);
      });

      socket.on("iceCandidate", ({ sessionId, candidate }) => {
        socket.to(sessionId).emit("iceCandidate", candidate);
      });

      socket.on("chatMessage", ({ sessionId, text, sender }) => {
        socket.to(sessionId).emit("chatMessage", { text, sender });
      });

      socket.on("endSession", ({ sessionId }) => {
        console.log("Inside on endSession...")
        const session = activeSessions.get(sessionId);

        if (session) {
          console.log("Emiting sessionEnded...")
          socket.to(sessionId).emit("sessionEnded");

          const adminData = adminSessions.get(session.adminId);
          console.log("adminData on endSession--->",adminData)
          if (adminData) {
            adminData.status = "available";
            adminData.currentSession = null;
          }

          console.log("activeSessions before deleting sessionId---->", activeSessions)
          activeSessions.delete(sessionId);
          console.log("activeSessions before deleting sessionId---->", activeSessions)

          console.log("Emiting activeSessionsUpdate...")
          io.to("admin-room").emit("activeSessionsUpdate", {
            sessions: Array.from(activeSessions.values()),
          });
        }

        socket.leave(sessionId);
      });

      socket.on("leaveSession", ({ sessionId }) => {
        const session = activeSessions.get(sessionId);

        if (session) {
          socket.to(sessionId).emit("sessionEnded");

          if (session.adminSocketId === socket.id) {
            const adminData = adminSessions.get(session.adminId);
            if (adminData) {
              adminData.status = "available";
              adminData.currentSession = null;
            }
          }

          activeSessions.delete(sessionId);

          io.to("admin-room").emit("activeSessionsUpdate", {
            sessions: Array.from(activeSessions.values()),
          });
        }

        socket.leave(sessionId);
      });

      socket.on("disconnect", () => {
        const queueIndex = waitingQueue.findIndex(user => user.socketId === socket.id);
        if (queueIndex !== -1) {
          waitingQueue.splice(queueIndex, 1);

          io.to("admin-room").emit("queueUpdate", {
            queue: waitingQueue,
          });
        }

        for (const [adminId, adminData] of adminSessions.entries()) {
          if (adminData.socketId === socket.id) {
            if (adminData.currentSession) {
              const session = activeSessions.get(adminData.currentSession);
              if (session) {
                socket.to(adminData.currentSession).emit("sessionEnded");
                activeSessions.delete(adminData.currentSession);
              }
            }

            adminSessions.delete(adminId);
            break;
          }
        }

        for (const [sessionId, session] of activeSessions.entries()) {
          if (session.adminSocketId === socket.id || session.userSocketId === socket.id) {
            socket.to(sessionId).emit("sessionEnded");

            const adminData = adminSessions.get(session.adminId);
            if (adminData) {
              adminData.status = "available";
              adminData.currentSession = null;
            }

            activeSessions.delete(sessionId);
          }
        }

        io.to("admin-room").emit("queueUpdate", {
          queue: waitingQueue,
        });

        io.to("admin-room").emit("activeSessionsUpdate", {
          sessions: Array.from(activeSessions.values()),
        });
      });
    });
  }
}


module.exports = videoChatBoxSocket




