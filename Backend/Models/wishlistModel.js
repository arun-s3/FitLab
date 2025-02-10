const mongoose = require("mongoose")

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  lists: [
    {
      name: {
        type: String,
        required: true 
      },
      description: {
        type: String 
      },
      thumbnail: {
        type: String,
        required: true
      },
      priority: { 
        type: Number,
        enum: [1, 2, 3], // 1-High, 2-Medium, 3-Low
        default: 2 
      }, 
      isPublic: { 
        type: Boolean,
        default: false 
      },
      sharedWith: [
        { 
            type: mongoose.Schema.ObjectId,
            ref: "User" 
        }
      ],
      reminderDate: {
        type: Date 
      },
      priceDropAlert: {
        type: Boolean,
        default: false
      },
      products: [
        {
          product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product" 
          },
          productPriority: {
            type: Number,
            enum: [1, 2, 3], // 1-High, 2-Medium, 3-Low
            default: 2 
          },
          notes: {
            type: String 
          },
          addedAt: {
            type: Date,
            default: Date.now 
          },
        },
      ],
      createdAt: {
        type: Date,
        default: Date.now 
      },
    },
  ],
}, { timestamps: true })

const Wishlist = mongoose.model("Wishlist", wishlistSchema)

module.exports = Wishlist
