const openai = require("../Utils/openai")
const FitnessTracker = require("../Models/fitnessTrackerModel")
const ExerciseTemplate = require("../Models/exerciseTemplateModel")
const {buildLastWorkoutPrompt} = require("../AI/buildLastWorkoutPrompts")
const axios = require("axios")

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent"


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
    const res = await axios.post(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        timeout: 8000
      }
    )

    return res.data.candidates[0].content.parts[0].text
  }
  catch (error) {
    error.isGeminiError = true
    throw error
  }
}


async function callOpenRouter(prompt, model = "anthropic/claude-3.5-sonnet") {
  const res = await axios.post("https://openrouter.ai/api/v1/chat/completions",
    {
      model,
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        // "HTTP-Referer": process.env.OPENROUTER_SITE_URL,
        // "X-Title": process.env.OPENROUTER_APP_NAME,
      },
      timeout: 10000,
    }
  )

  return res.data.choices[0].message.content
}


async function generateAIResponse(prompt) {
  try {
    return await callGemini(prompt)
  }
  catch (error) {
    console.error("Gemini failed, switching to fallback...")

    const fallbackModels = [
      "openai/gpt-4.1-mini",
      "anthropic/claude-3.5-sonnet",
      "mistralai/mistral-large"
    ]

    for (const model of fallbackModels) {
      try {
        return await callOpenRouter(prompt, model)
      } catch (err) {
        console.error(`Fallback model failed: ${model}`)
      }
    }

    throw new Error("All AI providers failed")
  }
}


const askAI = async (req, res, next) => {
  try {
    console.log("Inside askAI...")

    const userId = req.user._id

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const result = await FitnessTracker.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      { $unwind: "$exercises" },
      {
        $addFields: {
          activityTime: {
            $ifNull: [
              "$exercises.exerciseCompletedAt",
              "$updatedAt"
            ]
          }
        }
      },
      {
        $sort: {
          activityTime: -1
        }
      },
      { $limit: 1 },
      {
        $project: {
          _id: 0,
          exercise: "$exercises",
          workoutDate: "$date",
          activityTime: 1
        }
      }
    ]);

    if (!result.length) {
      return res.status(200).json({success: true, message: "No exercise found for today", data: null});
    }
 
    console.log("result[0]---->", JSON.stringify(result[0]))

    const lastWorkout = result[0].exercise
    console.log("lastWorkout---->", JSON.stringify(lastWorkout))

    const prompt = buildLastWorkoutPrompt(lastWorkout)
    const aiResponse = await callGemini(prompt)

    console.log("aiResponse---->", JSON.stringify(aiResponse))

    res.status(200).json({success: true, aiResponse});
  }
  catch (error) {
    next(error)
    console.error("Error getting latest health profile:", error.message)
  }
}



module.exports = {chatWithAI, askAI}
