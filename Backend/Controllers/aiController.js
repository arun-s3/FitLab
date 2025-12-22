const openai = require("../Utils/openai")
const FitnessTracker = require("../Models/fitnessTrackerModel")
const ExerciseTemplate = require("../Models/exerciseTemplateModel") 
const HealthProfile = require("../Models/healthProfileModel")
const Order = require("../Models/orderModel")
const Wishlist = require("../Models/wishlistModel")

const {generateAIResponse} = require("../AI/aiOrchestrator")
const AiFitnessInsight = require("../Models/aiFitnessInsightModel")
const AiBusinessInsight = require("../Models/aibusinessInsightsModel") 
const AiCoachSession = require("../Models/aiCoachSessionModel") 

const {errorHandler} = require('../Utils/errorHandler') 

const {buildLastWorkoutPrompt} = require("../AI/buildLastWorkoutPrompts") 
const {buildLatestHealthPrompt} = require("../AI/buildLatestHealthPrompts")
const {buildPeriodFitnessPrompts} = require("../AI/buildPeriodFitnessPrompts")
const {buildBusinessPrompts} = require("../AI/buildBusinessPrompts")
const {parseAIJsonResponse, getPeriodRange, DEFAULT_COACH_STATE, validateCoachSessionState} = require("./controllerUtils/aiUtils")

const axios = require("axios")
                    
// const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
// const GEMINI_URL =
//   "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"

// const GEMINI_URL =
//   "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent"


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


// async function callGemini(prompt) {
//   try {
//     console.log("Inside callGemini...")

//     const res = await axios.post(
//       `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             role: "user",
//             parts: [{ text: prompt }]
//           }
//         ],
//         generationConfig: {
//           maxOutputTokens: 512,
//           temperature: 0.7
//         }
//       },
//       {
//         timeout: 50000 
//       }
//     )

//     return res.data.candidates[0].content.parts[0].text
//   }
//   catch (error) {
//     console.error("Gemini error:", error.response?.status, error.response?.data || error.message)
//     error.isGeminiError = true
//     throw error
//   }
// }


// async function callOpenRouter(prompt, model = "anthropic/claude-3.5-sonnet") {
//   const res = await axios.post("https://openrouter.ai/api/v1/chat/completions",
//     {
//       model,
//       messages: [{ role: "user", content: prompt }],
//       max_tokens: 1500,  
//       temperature: 0.7
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         // "HTTP-Referer": process.env.OPENROUTER_SITE_URL,
//         // "X-Title": process.env.OPENROUTER_APP_NAME,
//       },
//       timeout: 50000,
//     }
//   )

//   return res.data.choices[0].message.content
// }


// async function generateAIResponse(prompt) {
//   const openRouterModels = [
//     "openai/gpt-4.1-mini",
//     "anthropic/claude-3.5-sonnet",
//     "mistralai/mistral-large"
//   ]

//   for (const model of openRouterModels) {
//     try {
//       console.log(`Trying OpenRouter model: ${model}`)
//       const response = await callOpenRouter(prompt, model)
//       console.log(`OpenRouter success: ${model}`)
//       return response
//     }catch (error) {
//       console.log(`OpenRouter model failed: ${model}`, error.response?.status, error.response?.data || error.message)
//     }
//   }

//   try {
//     console.log("Falling back to Gemini")
//     return await callGemini(prompt)
//   }catch (error) {
//     console.log(`Gemini failed: ${model}`, error.response?.status, error.response?.data || error.message)
//   }

//   throw new Error("All AI providers failed")
// }


const askAIForAnalysis = async (req, res, next) => {
  try {
    console.log("Inside askAIForAnalysis...")

    const userId = req.user._id

    const {
      analysisType, trackerId, lastWorkout, prevWorkout, latestProfile, prevProfile, fitnessProfile, periodType, dashboardDatas
    } = req.body.analysisRequirement

    // console.log("req.body.analysisRequirement---->", JSON.stringify(req.body.analysisRequirement))

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

      if (!aiAnalysis || typeof aiAnalysis !== "object") {
        return next(errorHandler(502, "Failed to analyze workout"))
      }

      await HealthProfile.updateOne(
        { _id: latestProfile._id },
        {
          $set: {aiAnalysis, relativeAnalysis: isRelativeAnalysis}
        }
      )

      return res.status(200).json({success: true, aiResponse: aiAnalysis})
    } 

    if(analysisType === 'periodFitnessProfile'){
      const prompt = buildPeriodFitnessPrompts(fitnessProfile, periodType)
      // console.log("prompt to feed in ths models---->", prompt)

      const aiResponse = await generateAIResponse(prompt)

      const aiAnalysis = parseAIJsonResponse(aiResponse)

      console.log("SUCCESSFUL----typeof aiResponse:", typeof aiResponse)
      console.log("aiResponse---->", JSON.stringify(aiAnalysis))

      if (!aiAnalysis || typeof aiAnalysis !== "object") {
        return next(errorHandler(502, "Failed to health profile"))
      }

      const {periodStart, periodEnd} = getPeriodRange(periodType)

      const insightDoc = await AiFitnessInsight.findOneAndUpdate(
        {userId, periodType, periodStart},
        {
          $set: {userId, periodType, periodStart, periodEnd, insights: aiAnalysis}
        },
        {upsert: true, new: true}
      )

      return res.status(200).json({success: true, aiResponse: aiAnalysis})
    }
    
    if(analysisType === 'fitlabDashboardDatas'){
      const prompt = buildBusinessPrompts(dashboardDatas)
      console.log("prompt to feed in ths models---->", prompt)

      const aiResponse = await generateAIResponse(prompt)

      const aiAnalysis = parseAIJsonResponse(aiResponse)

      console.log("typeof aiResponse:", typeof aiResponse)
      console.log("aiResponse---->", JSON.stringify(aiAnalysis))

      if (!aiAnalysis || typeof aiAnalysis !== "object") {
        return next(errorHandler(502, "Failed to analyze the business"))
      }

      const {periodStart, periodEnd} = getPeriodRange("month")

      const insightDoc = await AiBusinessInsight.findOneAndUpdate(
        { periodStart },
        {
          $set: {periodStart, periodEnd, insights: aiAnalysis}
        },
        { upsert: true, new: true }
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


const askAICoach = async (req, res, next) => {
  try {
    console.log("Inside askAICoach...")

    const userId = req.user._id
    const { query } = req.body

    if (!query || typeof query !== "string") {
      return next(errorHandler(400, "Invalid coach query"))
    }

    const sessionDoc = await AiCoachSession.findOne({ userId }).lean()
    const coachSessionState = sessionDoc?.state || DEFAULT_COACH_STATE

    const recentWorkouts = await FitnessTracker.find({ userId }) 
      .sort({ date: -1 })
      .limit(4)
      .select({
        date: 1,
        totalDuration: 1,
        totalCalories: 1,
        totalWorkoutVolume: 1,
        exercises: 1
      })
      .lean()
    
    const healthProfile = await HealthProfile.find({ userId })
      .sort({ date: -1 }) 
      .limit(1)
      .lean();

    const recentOrders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(4)
      .select({
        createdAt: 1,
        orderStatus: 1,
        orderTotal: 1,
        products: {
          title: 1,
          category: 1,
          quantity: 1
        }
      })
      .lean()

    const wishlistDoc = await Wishlist.findOne({ userId })
      .select({
        lists: { $slice: -3 }
      })
      .populate({
        path: "lists.products.product",
        select: "title"
      })
      .lean()
    
    const wishlistItems = (wishlistDoc?.lists || []).map(list => ({
      name: list.name,
      description: list.description,
      products: (list.products || [])
        .slice(-3)
        .map(item => ({
          title: item.product?.title
        }))
    }))

    const ALLOWED_GOALS = new Set([
      "weight_loss", "muscle_gain", "general_fitness", "endurance", "strength", "flexibility", "recovery", "not_set"
    ])

    let userGoal = req.user.fitnessGoal

    if (!ALLOWED_GOALS.has(userGoal)) {
      userGoal = "not_set"
    }

    const prompt = buildAICoachPrompt({
      userQuery: query,
      coachSessionState,
      recentWorkouts,
      healthProfile,
      recentOrders,
      wishlistItems,
      userGoal
    })

    const aiResponse = await generateAIResponse(prompt)
    const parsedResponse = parseAIJsonResponse(aiResponse)

    if (!parsedResponse ||  typeof parsedResponse !== "object" || !parsedResponse.responseText) {
      return next(errorHandler(502, "Invalid AI coach response"))
    }

    const validatedSessionState = validateCoachSessionState( parsedResponse.updatedCoachSessionState ) 

    await AiCoachSession.findOneAndUpdate(
      {userId},
      {state: validatedSessionState, updatedAt: new Date()},
      {upsert: true, new: true}
    )

    return res.status(200).json({
      success: true,
      message: parsedResponse.responseText,
      coachSessionState: validatedSessionState
    })
  }
  catch (error) {
    console.error("AI Coach error:", error.message)
    next(error)
  }
}


const getTodayAiFitnessInsights = async (req, res, next) => {
  try {
    console.log("Inside getTodayAiFitnessInsights...")

    const userId = req.user._id

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const insights = await AiFitnessInsight.find({
      userId,
      periodStart: { $lte: today },
      periodEnd: { $gte: today },
      periodType: { $in: ["week", "month"] }
    })
      .lean()

    const weeklyInsight = insights.find(i => i.periodType === "week") || null
    const monthlyInsight = insights.find(i => i.periodType === "month") || null

    console.log(`weeklyInsight----->${weeklyInsight} and monthlyInsight----->${monthlyInsight}`)

    return res.status(200).json({
      success: true,
      week: weeklyInsight,
      month: monthlyInsight
    })
  }
  catch (error) {
    console.error("Error fetching AI fitness insights:", error.message)
    next(error)
  }
}


const getTodayBusinessInsight = async (req, res, next) => {
  try {
    console.log("Inside getTodayBusinessInsight...")

    const today = new Date()

    const businessInsightDoc = await AiBusinessInsight.findOne({
      periodStart: { $lte: today },
      periodEnd: { $gte: today }
    }).lean()

    return res.status(200).json({success: true, businessInsightDoc});
  }
  catch (error) {
    console.error("Error fetching today's business insights:", error.message)
    next(error)
  }
}



module.exports = {chatWithAI, askAIForAnalysis, askAICoach, getTodayAiFitnessInsights, getTodayBusinessInsight}
