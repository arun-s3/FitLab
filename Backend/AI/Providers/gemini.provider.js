
const axios = require("axios")

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent"


async function callGemini(prompt) {
  try {
    console.log("Inside callGemini...")

    const res = await axios.post(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          maxOutputTokens: 512,
          temperature: 0.7
        }
      },
      {
        timeout: 50000 
      }
    )

    return res.data.candidates[0].content.parts[0].text
  }
  catch (error) {
    console.error("Gemini error:", error.response?.status, error.response?.data || error.message)
    error.isGeminiError = true
    throw error
  }
}


module.exports = {callGemini}
