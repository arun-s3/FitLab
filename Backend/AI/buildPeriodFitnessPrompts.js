const {LATEST_FITNESS_PROMPT} = require("./Prompts/periodFitnessProfilePrompts")

function buildPeriodFitnessPrompts(fitnessProfile, period) {

    console.log(`fitnessProfile of this ${period} from buildPeriodFitnessPrompts---->`, JSON.stringify(fitnessProfile))
    console.log("LAST_WORKOUT_PROMPT---->", LATEST_FITNESS_PROMPT)

    return `
        ${LATEST_FITNESS_PROMPT}

        Analyze the following fitness datas. The "stats" key in the fitnessProfile tells about the general stats of the user workout history 
        for the ${period} like total workouts, total volumes, total calories burned and current streak. 
        The rest of the keys tells for the period of months as well as weeks. From that use the ${period} key for the current analysis
        Under the  ${period} key you could find the datas of "workout", "volume", "weight" and "exerciseBreakdown".
        The "workout" key in the fitnessProfile tells about the workout frequency, "volume" key about the workout volume stats, "weight" key 
        about the workout with the weights progression and "exerciseBreakdown" key about the body parts trained datas.
        Return structured insights.
        (The Workout duration if exists is provided in seconds)

        FITNESS PROFILE DATA: 
        ${JSON.stringify(fitnessProfile, null, 2)}

        ANALYSIS REQUIREMENTS:

        1. Training Consistency

        2. Strength Progression

        3. Body Part Balance & Training Distribution

        4. Training Efficiency

        5. Personalized Training Personality

        6. Suggestions and Tips

        Each analysis should have a minimum of 2 and maximum of 3 sentences.
        
        OUTPUT FORMAT (STRICT): Should be in the format of JSON with each key being the requirement title and value being the insight.
            Replace the requirement's subtitle with the corresponding outputs. Hence in brief it should looke like key(requirement title)
            and value is the array of outputs/insights. Atleast there s
        
        Schema:
            {
              "Training Consistency": [string, string?, string?],
              "Strength Progression": [string, string?, string?],
              "Body Part Balance & Training Distribution": [string, string?, string?],
              "Training Efficiency": [string, string?, string?],
              "Personalized Training Personality": [string, string?, string?],
              "Suggestions and Tips": [string, string?, string?]
            }

        `
}

module.exports = {buildPeriodFitnessPrompts}