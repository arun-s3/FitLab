const Order = require('../Models/orderModel')
const Session = require("../Models/videoSupportSessionsModel")

const {errorHandler} = require('../Utils/errorHandler') 




const bookSession = async (req, res, next)=> {

  try {
    const { userId, scheduledDate, scheduledTime, subjectLine, notes } = req.body

    if (!userId || !scheduledDate || !scheduledTime) {
      return next(errorHandler(400, "Missing required fields!"))
    }

    if(userId.startsWith('guest')){
      return next(errorHandler(401, "Guest cannot book a session. Please sign up and then book the session!"))
    }

    const existing = await Session.findOne({ userId, scheduledDate, scheduledTime })
    if (existing){
      return next(errorHandler(409, "You already have a session booked for that time!" ))
    }

    const newSession = new Session({
      userId,
      scheduledDate,
      scheduledTime,
      subjectLine,
      notes,
      status: 'upcoming'
    })

    await newSession.save()

    res.status(201).json({ message: "Session booked successfully" })
  }
  catch (error){
    console.error("Error creating session:", error.message)
    next(error)
  }
}


const getAllSessions = async (req, res, next)=> {
  try {
    console.log("Inside getAllSessions of videoSupportSessionsController")
    const sessions = await Session.find().populate("userId", "username email") 
    // const sessionsWithDetails = sessions.map(session=> {
    //   cost
    // })
    console.log("sessions----->", JSON.stringify(sessions))

    res.status(200).json({
      message: "All sessions retrieved successfully",
      sessions
    })
  } 
  catch (error) {
    console.error("Error fetching sessions:", error.message)
    next(error)
  }
}






module.exports = {bookSession, getAllSessions }
