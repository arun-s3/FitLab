const mongoose = require("mongoose")
const User = require('../Models/userModel')
const Fitness = require('../Models/fitnessModel')
const FitnessTracker = require("../Models/fitnessTrackerModel")
const ExerciseTemplate = require("../Models/exerciseTemplateModel")
const HealthProfile = require("../Models/healthProfileModel")

const {calculateHealthScore} = require('./controllerUtils/fitnessUtils')
const {errorHandler} = require('../Utils/errorHandler')



const calculateStreak = async (userId) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let streak = 0

  const trackers = await FitnessTracker.find({ userId })
    .sort({ date: -1 }) 
    .lean();

  let checkDate = new Date(today)

  for (const tracker of trackers) {
    const trackerDate = new Date(tracker.date)
    trackerDate.setHours(0, 0, 0, 0)

    if (trackerDate.getTime() === checkDate.getTime()) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else if (trackerDate < checkDate) {
      break
    }
  }

  return streak;
}


const getMonthlyStats = async (req, res, next) => {
  try {
    console.log("Inside getMonthlyStats...")
    const userId = req.user._id

    const today = new Date()
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    monthStart.setHours(0, 0, 0, 0)

    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    monthEnd.setHours(23, 59, 59, 999)

    const entries = await FitnessTracker.find({userId, date: { $gte: monthStart, $lte: monthEnd }});

    const workoutsThisMonth = entries.filter(e => e.exercises.length > 0).length
    const totalVolumeMonth = entries.reduce( (acc, e) => acc + (e.totalWorkoutVolume || 0), 0 )
    const caloriesBurned = entries.reduce( (acc, e) => acc + (e.totalCalories || 0), 0 )

    const currentStreak = await calculateStreak(userId)

    return res.status(200).json({
      success: true,
      stats: {
        totalWorkouts: workoutsThisMonth,
        totalVolumes: totalVolumeMonth,
        totalCaloriesBurned: caloriesBurned,
        currentStreak,
      },
    });
  }
  catch (error) {
    console.error("Error in getMonthlyStats:", error.message)
    next(error)
  }
}


const getWeeklyStats = async (req, res, next) => {
  try {
    console.log("Inside getWeeklyStats...")
    const userId = req.user._id

    const today = new Date()
    const dayOfWeek = today.getDay() 
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() + mondayOffset)
    weekStart.setHours(0, 0, 0, 0)

    const weekEnd = new Date()
    weekEnd.setHours(23, 59, 59, 999)

    const entries = await FitnessTracker.find({
      userId,
      createdAt: { $gte: weekStart, $lte: weekEnd },
    });

    const workoutsThisWeek = entries.filter(e => e.exercises.length > 0).length
    const totalVolumeWeek = entries.reduce((acc, e) => acc + (e.totalWorkoutVolume || 0), 0)
    const caloriesBurned = entries.reduce((acc, e) => acc + (e.totalCalories || 0), 0)

    const currentStreak = await calculateStreak(userId)

    return res.status(200).json({
      success: true,
      stats: {
        totalWorkouts: workoutsThisWeek,
        totalVolumes: totalVolumeWeek,
        totalCaloriesBurned: caloriesBurned,
        currentStreak,
      },
    });
  }
  catch (error) {
    console.error("Error in getWeeklyStats:", error.message)
    next(error)
  }
}


const getWorkoutFrequencyStats = async (req, res, next) => {
  try {
    console.log("Inside getWorkoutFrequencyStats...")
    const userId = req.user._id
    const today = new Date()

    const startOfWeek = new Date(today)
    const day = today.getDay() // 0 = Sun, 1=Mon
    const mondayOffset = day === 0 ? -6 : 1 - day
    startOfWeek.setDate(today.getDate() + mondayOffset)
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(today)
    endOfWeek.setHours(23, 59, 59, 999)

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    startOfMonth.setHours(0, 0, 0, 0)

    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    endOfMonth.setHours(23, 59, 59, 999)

    const weeklyEntries = await FitnessTracker.find({
      userId,
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });

    const monthlyEntries = await FitnessTracker.find({
      userId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const weeklyWorkouts = weekDays.map((day, idx) => {
      const count = weeklyEntries.filter(entry =>
        new Date(entry.date).getDay() === (idx + 1) % 7
      ).length

      return { day, value: count }
    })

    const weeklyBuckets = [0, 0, 0, 0]
    monthlyEntries.forEach(entry => {
      const date = new Date(entry.date)
      const weekIndex = Math.floor((date.getDate() - 1) / 7) // 0–3
      weeklyBuckets[weekIndex]++
    })

    const monthlyWorkouts = weeklyBuckets.map((count, i) => ({
      day: `Week ${i + 1}`,
      value: count,
    }))

    console.log("weeklyWorkouts------------->", JSON.stringify(weeklyWorkouts, null, 2))
    console.log("monthlyWorkouts------------->", JSON.stringify(monthlyWorkouts, null, 2))

    res.status(200).json({
      success: true,
      weeklyDatas: weeklyWorkouts.every(data=> !data.value) ? [] : weeklyWorkouts,
      monthlyDatas: monthlyWorkouts.every(data=> !data.value) ? [] : monthlyWorkouts
    });
  }
  catch (error) {
    console.log("Error in getWorkoutFrequencyStats:", error.message)
    next(error)
  }
}


const getWorkoutVolumeStats = async (req, res, next) => {
  try {
    console.log("Inside getWorkoutVolumeStats...")
    const userId = req.user._id

    const today = new Date()
    const dayOfWeek = today.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() + mondayOffset)
    weekStart.setHours(0, 0, 0, 0)

    const weekEnd = new Date()
    weekEnd.setHours(23, 59, 59, 999)

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    monthStart.setHours(0, 0, 0, 0)

    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    monthEnd.setHours(23, 59, 59, 999)

    const weeklyEntries = await FitnessTracker.find({
      userId,
      date: { $gte: weekStart, $lte: weekEnd }
    });

    const monthlyEntries = await FitnessTracker.find({
      userId,
      date: { $gte: monthStart, $lte: monthEnd }
    });

    const weeklyVolumeData = [
      { day: "Mon", value: 0 },
      { day: "Tue", value: 0 },
      { day: "Wed", value: 0 },
      { day: "Thu", value: 0 },
      { day: "Fri", value: 0 },
      { day: "Sat", value: 0 },
      { day: "Sun", value: 0 },
    ]

    weeklyEntries.forEach(entry => {
      const dayIndex = (new Date(entry.date).getDay() + 6) % 7 
      weeklyVolumeData[dayIndex].value += entry.totalWorkoutVolume
    })

    const weeklyBuckets = [0, 0, 0, 0]

    monthlyEntries.forEach(entry => {
      const date = new Date(entry.date)
      let weekIndex = Math.floor((date.getDate() - 1) / 7)

      weekIndex = Math.min(3, weekIndex)

      weeklyBuckets[weekIndex] += entry.totalWorkoutVolume
    })

    const monthlyVolumeData = [
      { day: "Week 1", value: weeklyBuckets[0] },
      { day: "Week 2", value: weeklyBuckets[1] },
      { day: "Week 3", value: weeklyBuckets[2] },
      { day: "Week 4", value: weeklyBuckets[3] },
    ]

    console.log("weeklyVolumeData------------->", JSON.stringify(weeklyVolumeData, null, 2))
    console.log("monthlyVolumeData------------->", JSON.stringify(monthlyVolumeData, null, 2))

    return res.status(200).json({
      success: true,
      weeklyDatas: weeklyVolumeData.every(data=> !data.value) ? [] : weeklyVolumeData,
      monthlyDatas: monthlyVolumeData.every(data=> !data.value) ? [] : monthlyVolumeData,
    });

  }
  catch (error) {
    console.log("Error in getWorkoutVolumeStats:", error)
    next(error)
  }
}


const getCaloriesStats = async (req, res, next) => {
  try {
    console.log("Inside getCaloriesStats...")
    const userId = req.user._id

    const today = new Date()
    const dayOfWeek = today.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() + mondayOffset)
    weekStart.setHours(0, 0, 0, 0)

    const weekEnd = new Date()
    weekEnd.setHours(23, 59, 59, 999)

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    monthStart.setHours(0, 0, 0, 0)

    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    monthEnd.setHours(23, 59, 59, 999)

    const weeklyEntries = await FitnessTracker.find({
      userId,
      date: { $gte: weekStart, $lte: weekEnd },
    });

    const monthlyEntries = await FitnessTracker.find({
      userId,
      date: { $gte: monthStart, $lte: monthEnd },
    });

    const weeklyCaloriesData = [
      { day: "Mon", value: 0 },
      { day: "Tue", value: 0 },
      { day: "Wed", value: 0 },
      { day: "Thu", value: 0 },
      { day: "Fri", value: 0 },
      { day: "Sat", value: 0 },
      { day: "Sun", value: 0 },
    ]

    weeklyEntries.forEach(entry => {
      const dayIndex = (new Date(entry.date).getDay() + 6) % 7 // Converts Sun(0)-->6
      weeklyCaloriesData[dayIndex].value += entry.totalCalories
    })

    const weekBuckets = [0, 0, 0, 0]

    monthlyEntries.forEach(entry => {
      const date = new Date(entry.date)
      let weekIndex = Math.floor((date.getDate() - 1) / 7)
      weekIndex = Math.min(3, weekIndex) // ensure it stays within range

      weekBuckets[weekIndex] += entry.totalCalories
    })

    const monthlyCaloriesData = [
      { day: "Week 1", value: weekBuckets[0] },
      { day: "Week 2", value: weekBuckets[1] },
      { day: "Week 3", value: weekBuckets[2] },
      { day: "Week 4", value: weekBuckets[3] },
    ]

    console.log("weeklyCaloriesData------------->", JSON.stringify(weeklyCaloriesData, null, 2))
    console.log("monthlyCaloriesData------------->", JSON.stringify(monthlyCaloriesData, null, 2))

    return res.status(200).json({
      success: true,
      weeklyDatas: weeklyCaloriesData.every(data=> !data.value) ? [] : weeklyCaloriesData,
      monthlyDatas: monthlyCaloriesData.every(data=> !data.value) ? [] : monthlyCaloriesData
    });
  }
  catch (error) {
    console.error("Error in getCaloriesStats:", error)
    next(errorHandler(500, "Failed to fetch calories stats"))
  }
}


const getWeightInsights = async (req, res, next) => {
  try {
    const userId = req.user._id

    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay()) 
    startOfWeek.setHours(0, 0, 0, 0)

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const weeklyData = await HealthProfile.find({
      userId,
      date: { $gte: startOfWeek }
    }).sort({ date: 1 });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const weeklyWeight = weekDays.map((day, index) => {
      const matching = weeklyData.find(
        (w) => new Date(w.date).getDay() === index
      )
      return {
        day,
        value: matching ? matching.weight : null,
      }
    })

    const monthlyData = await HealthProfile.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), date: { $gte: startOfMonth } } },
      {
        $group: {
          _id: {
            week: { $ceil: { $divide: [{ $dayOfMonth: "$date" }, 7] } }
          },
          avgWeight: { $avg: "$weight" }
        }
      },
      { $sort: { "_id.week": 1 } }
    ]);

    const monthlyWeight = monthlyData.map((item) => ({
      day: `Week ${item._id.week}`,
      value: parseFloat(item.avgWeight.toFixed(1))
    }))

    console.log("weeklyWeight------------->", JSON.stringify(weeklyWeight, null, 2))
    console.log("monthlyWeight------------->", JSON.stringify(monthlyWeight, null, 2))

    return res.status(200).json({
      success: true,
      weeklyDatas: weeklyWeight.every(data=> !data.value) ? [] : weeklyWeight,
      monthlyDatas: monthlyWeight.every(data=> !data.value) ? [] : monthlyWeight
    });

  }
  catch (error) {
    console.log("Weight Insights Error:", error.message)
    res.status(500).json({success: false, message: "Failed to fetch weight insights"})
  }
}


const getBodyPartInsights = async (req, res, next) => {
  try {
    const userId = req.user._id

    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const formatBreakdown = (data) => {
      const total = data.reduce((sum, item) => sum + item.count, 0)

      return data.map((item) => ({
        name: item._id,
        value: total ? Math.round((item.count / total) * 100) : 0,
      }))
    }

    const weeklyAgg = await FitnessTracker.aggregate([ 
      { $match: { userId: new mongoose.Types.ObjectId(userId), date: { $gte: startOfWeek } } },
      { $unwind: "$exercises" },
      {
        $group: {
          _id: "$exercises.bodyPart",
          count: { $sum: 1 }, 
        },
      },
      { $sort: { count: -1 } }
    ])

    const weeklyBreakdown = formatBreakdown(weeklyAgg)

    const monthlyAgg = await FitnessTracker.aggregate([ 
      { $match: { userId: new mongoose.Types.ObjectId(userId), date: { $gte: startOfMonth } } },
      { $unwind: "$exercises" },
      {
        $group: {
          _id: "$exercises.bodyPart",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } }
    ])

    const monthlyBreakdown = formatBreakdown(monthlyAgg)

    console.log("weeklyBreakdown------------->", JSON.stringify(weeklyBreakdown, null, 2))
    console.log("monthlyBreakdown------------->", JSON.stringify(monthlyBreakdown, null, 2))

    return res.status(200).json({
      success: true,
      weeklyDatas: weeklyBreakdown.every(data=> !data.value) ? [] : weeklyBreakdown,
      monthlyDatas: monthlyBreakdown.every(data=> !data.value) ? [] : monthlyBreakdown,
    });

  }
  catch (error) {
    console.log("Body Part Insights Error:", error)
    next(error)
  }
}


const getHealthScoreInsights = async (req, res, next) => {
  try {
    const userId = req.user._id

    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const weeklyData = await HealthProfile.find({
      userId,
      date: { $gte: startOfWeek }
    }).sort({ date: 1 });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const weeklyMhs = weekDays.map((day, index) => {
      const matching = weeklyData.find(h => new Date(h.date).getDay() === index)
      return {
        day,
        value: matching ? calculateHealthScore(matching) : null
      }
    })

    const monthlyData = await HealthProfile.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), date: { $gte: startOfMonth } } },
      {
        $group: {
          _id: { week: { $ceil: { $divide: [{ $dayOfMonth: "$date" }, 7] } } },
          data: { $push: "$$ROOT" }
        }
      },
      { $sort: { "_id.week": 1 } }
    ])

    const monthlyMhs = monthlyData.map(item => {
      const averageMhs =
        item.data.reduce((acc, h) => acc + calculateHealthScore(h), 0) /
        item.data.length
      return {
        day: `Week ${item._id.week}`,
        value: Math.round(averageMhs)
      }
    })

    return res.status(200).json({
      success: true,
      weeklyDatas: weeklyMhs.every(d => !d.value) ? [] : weeklyMhs,
      monthlyDatas: monthlyMhs.every(d => !d.value) ? [] : monthlyMhs
    });
  }
  catch (error) {
    console.log("Health Insights Error:", error.message)
    next(error)
  }
}



module.exports = {getWeeklyStats, getMonthlyStats, getWorkoutFrequencyStats, getWorkoutVolumeStats, getCaloriesStats, 
  getWeightInsights, getBodyPartInsights, getHealthScoreInsights}