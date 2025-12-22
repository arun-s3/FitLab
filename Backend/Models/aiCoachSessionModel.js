const mongoose = require("mongoose")

const AiCoachSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  state: {
    focus: {
      type: String,
      enum: ["workout", "recovery", "nutrition", "shopping", "motivation", "general_guidance"],
      required: true
    },
    lastRecommendation: {
      type: String,
      enum: [
        "increase_intensity",
        "maintain_intensity",
        "reduce_intensity",
        "rest_day",
        "mobility",
        "product_exploration"
      ],
      default: null
    },
    intensity: {
      type: String,
      enum: ["low", "moderate", "high"],
      default: null
    },
    timeScope: {
      type: String,
      enum: ["today", "week"],
      default: null
    },
    riskFlag: {
      type: String,
      enum: ["none", "fatigue", "overtraining", "injury_risk"],
      default: "none"
    },
    confidence: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    }
  }
}, { timestamps: true })


module.exports = mongoose.model("AiCoachSession", AiCoachSessionSchema)
