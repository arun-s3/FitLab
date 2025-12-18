const {LATEST_HEALTH_PROMPT} = require("./Prompts/latestHealthProfilePrompts")

function buildLatestHealthPrompt(profile, prevProfile) {

    console.log("health profile from buildLatestHealthPrompt---->", JSON.stringify(profile))
    console.log("LATEST_HEALTH_PROMPT---->", LATEST_HEALTH_PROMPT)

    return `
        ${LATEST_HEALTH_PROMPT}

        Analyze the following health profiles. If PREVIOUS profile data is provided (not null), include a brief comparison
        Return structured insights. 

        LATEST HEALTH PROFILE DATAS:
        ${JSON.stringify(profile, null, 2)}

        PREVIOUS HEALTH PROFILE DATAS:
        ${prevProfile ? JSON.stringify(prevProfile, null, 2) : null}

        ANALYSIS REQUIREMENTS:   

        1. Health Overview
        - Overall condition based on the current values
        - If previous profile exists: add a short comparison

        2. Potential Risk Patterns
        - Highlight any values that may need attention ie the potential issues
        - If previous profile exists: note improvement or decline

        3. Body Composition Insight
        - Weight and body fat related observations
        - If previous profile exists: mention visible change direction

        4. Cardiovascular Health Insight
        - Blood pressure related observation
        - Keep tone calm and non-alarming
        - If previous profile exists: briefly compare

        5. Lifestyle Indicators
        - What the values suggest about daily habits
        - Energy, balance, or recovery signals

        6. Personalized Focus Areas
        - Practical areas to focus on next
        - Keep suggestions realistic and simple

        Each analysis should have upto 3 or less sentence.
        
        OUTPUT FORMAT (STRICT): Should be in the format of JSON with each key being the requirement title and value being the insight.
            Replace the requirement's subtitle with the corresponding outputs. Hence in brief it should looke like key(requirement title)
            and value is the array of outputs/insights
        
        Schema:
            {
              "Health Overview": [string, string?],
              "Potential Risk Patterns": [string, string?],
              "Body Composition Insight": [string, string?],
              "Cardiovascular Health Insight": [string],
              "Lifestyle Indicators": [string, string?, string?]
              "Personalized Focus Areas": [string, string?, string?]
            }

        `
}

module.exports = {buildLatestHealthPrompt}