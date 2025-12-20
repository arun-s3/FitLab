const mongoose = require("mongoose");

const AiBusinessInsightSchema = new mongoose.Schema(
  {
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

AiBusinessInsightSchema.index(
  { periodStart: 1 },
  { unique: true }
);

module.exports = mongoose.model("AiBusinessInsight", AiBusinessInsightSchema);
