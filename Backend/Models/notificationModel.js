const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["order", "coupon", "offer", "admin", "stock"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 150,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    referenceModel: {
      type: String,
      enum: ["Order", "Product", "Offer", "Coupon", "Admin", "Other"],
      default: "Other", 
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } 
)

module.exports = mongoose.model("Notification", notificationSchema)
