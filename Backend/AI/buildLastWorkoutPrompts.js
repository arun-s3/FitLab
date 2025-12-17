// import { LAST_WORKOUT_PROMPT } from "./Prompts/lastWorkoutPrompts"
const {LAST_WORKOUT_PROMPT} = require("./Prompts/lastWorkoutPrompts")

function buildLastWorkoutPrompt(workout) {

    console.log("workout from buildLastWorkoutPrompt---->", JSON.stringify(workout))
    console.log("LAST_WORKOUT_PROMPT---->", LAST_WORKOUT_PROMPT)

    return `
        ${LAST_WORKOUT_PROMPT}

        Analyze the following workout session and return structured insights. (The Workout duration provided is in seconds)

        WORKOUT DATA:
        ${JSON.stringify(workout, null, 2)}

        ANALYSIS REQUIREMENTS:

        1. Performance & Effort Quality
        - Effort consistency across sets
        - Signs of early or late fatigue
        - Rep or weight drop-offs

        2. Volume & Efficiency
        - Volume per minute and Time efficiency (fast / moderate / slow pacing)
        - Any excessive rest or delays inferred from timestamps

        4. Workout Duration
        - Whether the duration is short, average, or long relative to: the amount of work performed (total volume), the number of exercises and sets
        - Indicate if the workout appears: Efficient (good work completed in reasonable time), Extended (long duration with moderate work output), Compressed (high work output in short time)
        - Mention if duration suggests: High focus, excessive rest, fatigue accumulation

        3. Overall Workout Score
        - Rate this workout from 1–10 and brief justification, everything in just one sentence

        4. Suggestions

        Each analysis should have upto 3 or less sentence.
        
        OUTPUT FORMAT (STRICT): Should be in the format of JSON with each key being the requirement title and value being the insight.
            Replace the requirement's subtitle with the corresponding outputs. Hence in brief it should looke like key(requirement title)
            and value is the array of outputs/insights

        `
}

module.exports = {buildLastWorkoutPrompt}