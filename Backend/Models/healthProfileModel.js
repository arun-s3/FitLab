const mongoose = require("mongoose")

const HealthProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true 
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true
    },

    age: {
      type: Number,
      min: 1,
      max: 120,
      required: true
    },

    height: {  // in cm
      type: Number,
      min: 30,
      max: 250,
      required: true
    },

    weight: {  // in kg
      type: Number,
      min: 1,
      max: 400,
      required: true
    },

    waistCircumference: { // in cm
      type: Number,
      min: 10,
      max: 200,
      default: null
    },

    hipCircumference: { // in cm
      type: Number,
      min: 10,
      max: 200,
      default: null
    },

    bloodPressure: { 
      systolic: { // in mmHg
        type: Number,
        min: 50,
        max: 250,
        default: null
      },
      diastolic: { // in mmHg
        type: Number,
        min: 30,
        max: 150,
        default: null
      }
    },

    bodyFatPercentage: {
      type: Number,
      min: 1,
      max: 70,
      default: null
    },

    glucose: { // in mg/dL
      type: Number,
      min: 40,
      max: 500,
      default: null
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("HealthProfile", HealthProfileSchema)
