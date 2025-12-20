const {PERIOD_BUSINESS_PROMPT} = require("./Prompts/businessPrompts")

function buildBusinessPrompts(businessDashboardDatas) {

    // console.log(`businessDashboardDatas of this from buildPeriodFitnessPrompts---->`, JSON.stringify(businessDashboardDatas))
    // console.log("LAST_WORKOUT_PROMPT---->", PERIOD_BUSINESS_PROMPT)

    return `
        ${PERIOD_BUSINESS_PROMPT}

        Analyze the following business data. 

        BUSINESS DATA:
        ${JSON.stringify(businessDashboardDatas, null, 2)}

        ANALYSIS REQUIREMENTS:

        1. Revenue & Growth Performance Insights
        2. Order Completion Analysis and Rate
        3. Customer Growth & Retention
        4. Discount & Promotion Effectiveness
        5. Customer Trust and Score
        6. Suggestions and Tips
        7. Business Growth Probability

        Each analysis must contain 2–3 concise sentences.

        Additionally, create estimated probable monthly revenue trends for visualization purposes only, covering the next 6 months..

        Revenue trend format:
        An array of objects with the structure:
        { name: string, revenue: number }

        - "name": first 3 letters of the month (e.g., Jan, Feb)
        - "revenue": numeric value only

        OUTPUT FORMAT (STRICT):
        Return ONLY valid JSON. Do not include markdown, explanations, or extra text.
        If space is limited, shorten sentences but NEVER truncate JSON structure.

        Schema:
        {
          "Revenue & Growth Performance Insights": [string, string?, string?],
          "Order Completion Analysis and Rate": [string, string?, string?],
          "Customer Growth & Retention": [string, string?, string?],
          "Discount & Promotion Effectiveness": [string, string?, string?],
          "Customer Trust and Score": [string, string?, string?],
          "Suggestions and Tips": [string, string, string, string],
          "Business Growth Probability": [string, string, string, string],
          "Probable Monthly Revenue Trends": [
            { "name": string, "revenue": number }
          ]
        }
        `

}

module.exports = {buildBusinessPrompts}


