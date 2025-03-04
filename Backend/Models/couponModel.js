const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
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
    usageLimit: {
      type: Number,
      default: null, 
    },
    usageLimitPerCustomer: {
      type: Number,
      default: 1, 
    },
    usedBy: [  
      {
        userId: {
          type: mongoose.Schema.ObjectId,
          ref: "User" 
        },
        count: {
          type: Number,
          default: 1 
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
      default: 'allProducts',
      required: true,
    },
    applicableCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
      }
    ],
    applicableProducts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      }
    ],
    customerSpecific: {
      type: Boolean,
      default: false
    },
    assignedCustomers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    oneTimeUse: {
      type: Boolean,
      default: true,
    },
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
      enum: ["active", "expired", "deactivated", "usedUp"],
      default: "active",
    },
  },
  { timestamps: true }
);


const Coupon = mongoose.model("Coupon", couponSchema)

module.exports = Coupon
