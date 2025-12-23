const {AI_COACH_PROMPT} = require("./Prompts/aiCoachPrompt")

function buildAICoachPrompt({
    userQuery,
    coachSessionState,
    recentWorkouts,
    healthProfile,
    recentOrders,
    wishlistItems,
    userGoal
}) {

    console.log("userQuery from buildAICoachPrompt---->", userQuery)
    console.log("AI_COACH_PROMPT---->", AI_COACH_PROMPT)

    return `
        ${AI_COACH_PROMPT}

        COACHING STYLE:
        - Practical
        - Conservative
        - Evidence-based
        - Encouraging, not authoritative

        SESSION CONTEXT (short-term, structured – NOT chat history):
        ${JSON.stringify(coachSessionState, null, 2)}

        USER FITNESS DATA (ground truth):
        Recent Workout History (last 4 sessions):
        ${JSON.stringify(recentWorkouts, null, 2)}

        USER HEALTH PROFILE:
        ${JSON.stringify(healthProfile, null, 2)}

        Order History (last 4 orders):
        ${JSON.stringify(recentOrders, null, 2)}

        Wishlist Items:
        ${JSON.stringify(wishlistItems, null, 2)}

        User Goal:
        ${userGoal}

        USER QUERY:
        ${userQuery}

        ALLOWED CoachSessionState VALUES (STRICT):
        focus: workout | recovery | nutrition | shopping | motivation | general_guidance
        lastRecommendation: increase_intensity | maintain_intensity | reduce_intensity | rest_day | mobility | product_exploration | null
        intensity: low | moderate | high | null
        timeScope: today | week | null
        riskFlag: none | fatigue | overtraining | injury_risk
        confidence: low | medium | high

        OUTPUT FORMAT (MANDATORY VALID JSON ONLY):
        {
          "responseText": "string",
          "updatedCoachSessionState": {
            "focus": "one of allowed values",
            "lastRecommendation": "one of allowed values or null",
            "intensity": "low | moderate | high | null",
            "timeScope": "today | week | null",
            "riskFlag": "none | fatigue | overtraining | injury_risk",
            "confidence": "low | medium | high"
          }
        }

        IMPORTANT RULES:
        - If the query is a follow-up, rely on coachSessionState instead of chat history.
        - If the topic changes, reset focus and related fields conservatively.
        - If riskFlag is not "none", reduce intensity and suggest rest or clarification.
        - If unsure, choose safer defaults.
        
      `
}

module.exports = {buildAICoachPrompt}