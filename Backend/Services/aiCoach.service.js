const FitnessTracker = require("../Models/fitnessTrackerModel")
const HealthProfile = require("../Models/healthProfileModel")
const Order = require("../Models/orderModel")
const Wishlist = require("../Models/wishlistModel")

const {generateAIResponse} = require("../AI/aiOrchestrator")
const {buildAICoachPrompt} = require("../AI/buildAICoachPrompt")

const AiCoachSession = require("../Models/aiCoachSessionModel") 

const {parseAIJsonResponse, validateCoachSessionState} = require("../Controllers/controllerUtils/aiUtils")

const {DEFAULT_COACH_STATE} = require("../AI/Constants/coachSessionState")


async function runAICoach({ userId, query, userGoal }) {

  console.log("Inside runAICoach()...")

  if (!query || typeof query !== "string") {
    throw new Error("Invalid coach query")
  }

  const sessionDoc = await AiCoachSession.findOne({ userId }).lean()
  const coachSessionState = sessionDoc?.state || DEFAULT_COACH_STATE

  console.log("coachSessionState-------->", JSON.stringify(coachSessionState))

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
    .lean()

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
    .select({ lists: { $slice: -3 } })
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
      .map(item => ({ title: item.product?.title }))
  }))

  const ALLOWED_GOALS = new Set([
    "weight_loss",
    "muscle_gain",
    "general_fitness",
    "endurance",
    "strength",
    "flexibility",
    "recovery",
    "not_set"
  ])

  if (!ALLOWED_GOALS.has(userGoal)) userGoal = "not_set"

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
  console.log("typeof aiResponse:", typeof aiResponse)

  const parsed = parseAIJsonResponse(aiResponse)

  console.log("parsed-------->", JSON.stringify(parsed))

  if (!parsed?.responseText) {
    throw new Error("Invalid AI response")
  }

  const validatedState = validateCoachSessionState(parsed.updatedCoachSessionState)
    ? parsed.updatedCoachSessionState
    : coachSessionState

  console.log("validatedState-------->", JSON.stringify(validatedState))


  await AiCoachSession.findOneAndUpdate(
    { userId },
    { state: validatedState, updatedAt: new Date() },
    { upsert: true }
  ) 

  return {
    message: parsed.responseText,
    coachSessionState: validatedState
  }
}


module.exports = { runAICoach }
