const mongoose = require("mongoose");

const ContactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },

    status: {
      type: String,
      enum: ["in_progress", "resolved"],
      default: "in_progress"
    },

    respondedAt: {
      type: Date,
      default: null
    }
  },
  {timestamps: true}
);

module.exports = mongoose.model("ContactMessage", ContactMessageSchema);
