const mongoose = require("mongoose")


const textChatBoxSchema = new mongoose.Schema({
  roomId: {
    type: String, // userId or guestId
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  isGuest: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
})

module.exports = mongoose.model("TextChatBox", textChatBoxSchema)
