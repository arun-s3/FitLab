

const CoachSessionStateSchema = {
  focus: [
    "workout",
    "recovery",
    "nutrition",
    "shopping",
    "motivation",
    "general_guidance"
  ],

  lastRecommendation: [
    "increase_intensity",
    "maintain_intensity",
    "reduce_intensity",
    "rest_day",
    "mobility",
    "product_exploration",
    null
  ],

  intensity: ["low", "moderate", "high", null],
  timeScope: ["today", "week", null],
  riskFlag: ["none", "fatigue", "overtraining", "injury_risk"],
  confidence: ["low", "medium", "high"]
}

const DEFAULT_COACH_STATE = {
  focus: "general_guidance",
  lastRecommendation: null,
  intensity: null,
  timeScope: null,
  riskFlag: "none",
  confidence: "medium"
}

module.exports = { CoachSessionStateSchema,  DEFAULT_COACH_STATE }
