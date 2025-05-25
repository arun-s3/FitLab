const mongoose = require("mongoose")


const textChatBoxSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  sender: {
    type: String,
    enum: ["user", "admin"],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
})

module.exports = mongoose.model("TextChatBox", textChatBoxSchema)
