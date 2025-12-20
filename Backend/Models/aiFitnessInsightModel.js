const mongoose = require("mongoose");

const AiFitnessInsightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    periodType: {
      type: String,
      enum: ["week", "month"],
      required: true,
      index: true
    },

    periodStart: {
      type: Date,
      required: true
    },

    periodEnd: {
      type: Date,
      required: true
    },

    insights: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  { timestamps: true }
);

AiFitnessInsightSchema.index(
  { userId: 1, periodType: 1, periodStart: 1 },
  { unique: true }
);

module.exports = mongoose.model("AiFitnessInsight", AiFitnessInsightSchema);
