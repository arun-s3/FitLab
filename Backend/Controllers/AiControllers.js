const openai = require("../Utils/openai")
const FitnessTracker = require("../Models/fitnessTrackerModel")
const ExerciseTemplate = require("../Models/exerciseTemplateModel")
const HealthProfile = require("../Models/healthProfileModel")

const {buildLastWorkoutPrompt} = require("../AI/buildLastWorkoutPrompts")
const {buildLatestHealthPrompt} = require("../AI/buildLatestHealthPrompts")
const {parseAIJsonResponse} = require("./controllerUtils/aiUtils")

const axios = require("axios")
                    
// const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
// const GEMINI_URL =
//   "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent"


const chatWithAI = async (req, res, next)=> {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" })
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message }
      ],
      temperature: 0.7,
    })

    return res.status(200).json({success: true, reply: response.choices[0].message.content})
  }
  catch (error) {
    console.error("ChatGPT error:", error.message)
    next(error)
  }
}


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


async function callOpenRouter(prompt, model = "anthropic/claude-3.5-sonnet") {
  const res = await axios.post("https://openrouter.ai/api/v1/chat/completions",
    {
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,  
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        // "HTTP-Referer": process.env.OPENROUTER_SITE_URL,
        // "X-Title": process.env.OPENROUTER_APP_NAME,
      },
      timeout: 50000,
    }
  )

  return res.data.choices[0].message.content
}


async function generateAIResponse(prompt) {
  const openRouterModels = [
    "openai/gpt-4.1-mini",
    "anthropic/claude-3.5-sonnet",
    "mistralai/mistral-large"
  ]

  for (const model of openRouterModels) {
    try {
      console.log(`Trying OpenRouter model: ${model}`)
      const response = await callOpenRouter(prompt, model)
      console.log(`OpenRouter success: ${model}`)
      return response
    }catch (error) {
      console.log(`OpenRouter model failed: ${model}`, error.response?.status, error.response?.data || error.message)
    }
  }

  try {
    console.log("Falling back to Gemini")
    return await callGemini(prompt)
  }catch (error) {
    console.log(`Gemini failed: ${model}`, error.response?.status, error.response?.data || error.message)
  }

  throw new Error("All AI providers failed")
}


const askAIForAnalysis = async (req, res, next) => {
  try {
    console.log("Inside askAIForAnalysis...")

    const {analysisType, trackerId, lastWorkout, prevWorkout, latestProfile, prevProfile} = req.body.analysisRequirement

    console.log("req.body.analysisRequirement---->", JSON.stringify(req.body.analysisRequirement))

    if(analysisType === 'latestWorkout'){
      const isRelativeAnalysis = Boolean(prevWorkout)
      const prompt = buildLastWorkoutPrompt(lastWorkout,  isRelativeAnalysis ? prevWorkout : null)
      console.log("prompt to feed in ths models---->", prompt)

      const aiResponse = await generateAIResponse(prompt)

      const aiAnalysis = parseAIJsonResponse(aiResponse)

      console.log("typeof aiResponse:", typeof aiResponse)
      console.log("aiResponse---->", JSON.stringify(aiAnalysis))

      await FitnessTracker.updateOne(
        {_id: trackerId, "exercises._id": lastWorkout._id},
        {
          $set: {"exercises.$.aiAnalysis": aiAnalysis, "exercises.$.relativeAnalysis": isRelativeAnalysis}
        }
      )

      return res.status(200).json({success: true, aiResponse: aiAnalysis})
    }

    if(analysisType === 'latestHealthProfile'){
      const isRelativeAnalysis = Boolean(prevProfile)
      const prompt = buildLatestHealthPrompt(latestProfile,  isRelativeAnalysis ? prevProfile : null)
      console.log("prompt to feed in ths models---->", prompt)

      const aiResponse = await generateAIResponse(prompt)

      const aiAnalysis = parseAIJsonResponse(aiResponse)

      console.log("typeof aiResponse:", typeof aiResponse)
      console.log("aiResponse---->", JSON.stringify(aiAnalysis))

      await HealthProfile.updateOne(
        { _id: latestProfile._id },
        {
          $set: {aiAnalysis, relativeAnalysis: isRelativeAnalysis}
        }
      )

      return res.status(200).json({success: true, aiResponse: aiAnalysis})
    }
    
    res.status(200).json({success: false, message: "Unsupported analysis type"});
  }
  catch (error) {
    next(error)
    console.error("Error asking AI models:", error.message)
  }
}



module.exports = {chatWithAI, askAIForAnalysis}
