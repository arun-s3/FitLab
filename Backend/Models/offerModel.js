const mongoose = require("mongoose")

const offerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed", "freeShipping", "buyOneGetOne"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumOrderValue: {
      type: Number,
      default: 0,
    },
    maxDiscount: {
      type: Number,
      default: null,
    },
    targetUserGroup: {
      type: String,
      enum: ["all", "newUsers", "returningUsers", "VIPUsers"],
      default: "all",
    },
    usedBy: [
      {
        userId: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        count: {
          type: Number,
          default: 1,
        }
      }
    ],
    usedCount: {
      type: Number,
      default: 0,
    },
    applicableType: {
      type: String,
      enum: ["allProducts", "products", "categories"],
      default: "allProducts",
      required: true,
    },
    applicableCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
      },
    ],
    applicableProducts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "deactivated"],
      default: "active",
    },    
    recurringOffer: {
      type: Boolean,
      default: false,
    },
    recurringFrequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      default: null
    },
    offerBanner: {
      type:{
        name: {
          type: String,
          required: true
        },
        size: {
          type: Number,
          required: true
        },
        url: {
          type: String,
          required: true
        },
        public_id:{
          type: String,
          required: true
        } 
      },
      required: false
    },
    redemptionCount: {
      type: Number,
      default: 0, 
    },
    conversionRate: {
      type: Number,
      default: 0, // % of users who applied vs. completed order
      min: 0,
      max: 100,
    },
    lastUsedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Offer", offerSchema)
