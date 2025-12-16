// import { LAST_WORKOUT_PROMPT } from "./Prompts/lastWorkoutPrompts"
const {LAST_WORKOUT_PROMPT} = require("./Prompts/lastWorkoutPrompts")

function buildLastWorkoutPrompt(workout) {

    return `
        ${LAST_WORKOUT_PROMPT}

        Analyze the following workout session and return structured insights.

        WORKOUT DATA:
        ${JSON.stringify(workout, null, 2)}

        ANALYSIS REQUIREMENTS:

        1. Workout Summary
        - Total duration
        - Total workout volume
        - Calories burned (if available)
        - Completion quality (completed vs planned sets)
        - Overall workout intensity (low / moderate / high)

        2. Performance & Effort Quality
        - Average effort level using RPE
        - Effort consistency across sets
        - Signs of early or late fatigue
        - Rep or weight drop-offs

        3. Volume & Efficiency
        - Volume per minute
        - Time efficiency (fast / moderate / slow pacing)
        - Any excessive rest or delays inferred from timestamps

        4. Overall Workout Score
        - Rate this workout from 1–10
        - Brief justification in one sentence

        5. Suggestions

        OUTPUT FORMAT (STRICT): Should be in the format of JSON with each key being the requirement title and value being the insight

        `
}

module.exports = {buildLastWorkoutPrompt}