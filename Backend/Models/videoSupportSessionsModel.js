const mongoose = require("mongoose")

const videoSupportSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    scheduledDate: {
      type: Date,
      required: true,
    },

    scheduledTime: {
      type: String, 
      required: true,
    },

    subjectLine: {
      type: String,
      maxlength: 50,
    },

    notes: {
      type: String,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: ["upcoming", "in-progress", "missed", "completed", "declined"],
      default: "upcoming",
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    feedback: {
      type: String,
      maxlength: 1000,
    },
  },
  {
    timestamps: true, 
  }
)

const videoSupportSession = mongoose.model("VideoSupportSession", videoSupportSessionSchema)
module.exports = videoSupportSession
