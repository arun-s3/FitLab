const User = require('../Models/userModel')
const Fitness = require('../Models/fitnessModel')
const FitnessTracker = require("../Models/fitnessTrackerModel")
const ExerciseTemplate = require("../Models/exerciseTemplateModel")
const HealthProfile = require("../Models/healthProfileModel")


const fs = require('fs')
const fsPromise = require("fs/promises")
const path = require('path')
const axios = require("axios")

const {errorHandler} = require('../Utils/errorHandler')

const EXERCISE_API_URL = process.env.EXERCISEDB_URL


const fetchFromSerpApi = async (query) => {
  console.log("Inside fetchFromSerpApi()")
  try {
    const res = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "google_images",
        q: `${query} JEFIT`,
        api_key: process.env.SERP_API_KEY,
      },
    })
    console.log("SerpApi image url---->", res.data?.images_results?.[0]?.original)

    return res.data?.images_results?.[0]?.original || null;
  } catch (error) {
    console.log("SerpApi error:", error.response?.data || error.message)
    return null
  }
}


const fetchFromGoogle = async (query) => {
  try {
    console.log("Inside fetchFromGoogle()")
    const res = await axios.get("https://www.googleapis.com/customsearch/v1", {
      params: {
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_SE_ID,
        q: `${query} JEFIT`,
        searchType: "image",
      },
    })
    console.log("Google image url---->", res.data?.items?.[0]?.link)

    return res.data?.items?.[0]?.link || null;
  } catch (err) {
    console.log("Google CSE error:", err.response?.data || err.message)
    return null
  }
}


const getExerciseThumbnail = async (req, res, next)=> {
  try {
    console.log("Inside getExerciseThumbnail function of fitnessController...")

    const name = req.params.name.trim().toLowerCase()
    console.log("Thumbnail requested for:", name)

    let existing = await Fitness.findOne({ name })
    if (existing) {
      console.log("Getting thumbnail from database....")
      return res.json({ thumbnail: existing.thumbnailUrl })
    }

    let finalThumbnail = await fetchFromGoogle(name)

    if (!finalThumbnail) {
      finalThumbnail = await fetchFromSerpApi(name)
    }

    console.log("finalThumbnail----->", finalThumbnail)
    if (finalThumbnail) {
      console.log("Storing in db----->", finalThumbnail)
      await Fitness.create({
        name,
        thumbnailUrl: finalThumbnail,
      });
    }

    return res.status(200).json({ thumbnail: finalThumbnail })
  } catch (error) {
    console.log("Error in getExerciseThumbnail:", error.message)
    next(error)
  }
}


const getExerciseVideos = async (req, res, next) => {
  try {
    console.log("Inside getExerciseVideos...")

    const name = req.params.name.trim().toLowerCase()
    console.log("Videos requested for:", name)

    let existing = await Fitness.findOne({ name })
    if (existing && existing.videos && existing.videos.length > 0) {
      console.log("Serving videos from database...")
      return res.status(200).json({ videos: existing.videos });
    }

    let videoResults = []

    const response = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(name + " exercise")}&type=video&maxResults=3&key=${process.env.GOOGLE_API_KEY}`

    const YTresponse = await axios.get(response)
    console.log("YouTube API response received")

    videoResults = YTresponse.data.items
      .filter((v) => v.id?.videoId)
      .map((item) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium?.url,
        channel: item.snippet.channelTitle,
      }))
    console.log("videoResults-------->", JSON.stringify(videoResults))

    if (videoResults.length > 0) {
      await Fitness.updateOne(
        { name },
        { $set: { videos: videoResults } },
        { upsert: true }
      )
      console.log("Stored videos in DB")
    }

    return res.status(200).json({ videos: videoResults });
  }
  catch (error) {
    console.log("Error in getExerciseVideos:", error.message)
    next(error)
  }
}


const getExercisesList = async (req, res, next) => {
  try {
    console.log("Inside getExercisesList controller")

    const {
      offset = 0,
      limit = 10,
      muscles,
      bodyParts,
      equipment,
      search,
      sortBy,
      sortOrder
    } = req.body.queryDetails

    console.log("Query params:", req.query)

    const response = await axios.get(
      `${EXERCISE_API_URL}/exercises/filter`,
      {
        params: {
          offset: Number(offset),
          limit: Number(limit),

          muscles: muscles || undefined,
          bodyParts: bodyParts || undefined,
          equipment: equipment || undefined,

          search: search || undefined,

          sortBy: sortBy || undefined,
          sortOrder: sortOrder || undefined
        },
        timeout: 15000
      }
    )

    return res.status(200).json({
      success: true,
      count: response.data?.length || 0,
      data: response.data
    })
  } 
  catch (error) {
    console.error("Error fetching exercises:", error.response?.status, error.response?.data || error.message)
    if (error.response?.status === 429) {
      return next(errorHandler(429, "Too many requests. Please try again later."))
    }
    next(error)
  }
}


const getExerciseBodyParts = async (req, res, next) => {
    try {
        const FILE = path.join(__dirname, "..", "Data", "exerciseBodyParts.json")

        const file = await fsPromise.readFile(FILE, "utf-8")
        const parsed = JSON.parse(file)

        const data = Array.isArray(parsed.data) ? parsed.data : []

        return res.status(200).json({
            success: true,
            data,
        })
    } catch (error) {
        console.error("Error reading body parts:", error.message)
        next(error)
    }
}

const getExerciseEquipments = async (req, res, next) => {
    try {
        const FILE = path.join(__dirname, "..", "Data", "exerciseEquipments.json")

        const file = await fsPromise.readFile(FILE, "utf-8")
        const parsed = JSON.parse(file)

        const data = Array.isArray(parsed.data) ? parsed.data : []

        return res.status(200).json({
            success: true,
            data,
        })
    } catch (error) {
        console.error("Error reading equipments:", error.message)
        next(error)
    }
}


const getExerciseMuscles = async (req, res, next) => {
    try {
        const FILE = path.join(__dirname, "..", "Data", "exerciseMuscles.json")

        const file = await fsPromise.readFile(FILE, "utf-8")
        const parsed = JSON.parse(file)

        const data = Array.isArray(parsed.data) ? parsed.data : []

        return res.status(200).json({
            success: true,
            data,
        })
    } catch (error) {
        console.error("Error reading muscles:", error.message)
        next(error)
    }
}


const addExercise = async (req, res, next) => {
  try {
    console.log("Inside addExercise...")
    const userId = req.user._id

    const { name, bodyPart, equipment, sets, notes } = req.body.exercise

    console.log("req.body.exercise--->", JSON.stringify(req.body.exercise))

    if (!name || !Array.isArray(sets)|| sets.some(set=> !set.reps) || sets.length === 0) {
      return next(errorHandler(400, "Exercise name, and at least one set with reps are required!"))
    }

    const todayStart = new Date(new Date().setHours(0, 0, 0, 0))
    const todayEnd = new Date(new Date().setHours(23, 59, 59, 999))

    let tracker = await FitnessTracker.findOne({
      userId,
      date: { $gte: todayStart, $lte: todayEnd }
    })

    if (!tracker) {
      tracker = new FitnessTracker({
        userId,
        exercises: [],
        totalWorkoutVolume: 0,
      })
    }

    tracker.exercises.push({
      name,
      bodyPart,
      equipment: equipment || null,
      sets: sets.map(s => ({
        weight: s.weight || 0,
        reps: s.reps,
        rpe: s.rpe || null,
        completed: false,
        completedAt: null
      })),
      notes: notes || "",
      duration: 0,
      totalVolume: 0
    })

    await tracker.save();

    let template = await ExerciseTemplate.findOne({ userId, name });

    if (!template) {
      await ExerciseTemplate.create({
        userId,
        name,
        bodyPart,
        equipment,
        sets,
        notes,
        lastUsedAt: new Date()
      })
    } else {
      template.sets = sets
      template.notes = notes
      template.lastUsedAt = new Date()
      await template.save()
    }

    return res.status(201).json({
      message: "Exercise added successfully!",
      tracker
    });

  }
  catch (error) {
    console.log("Error adding exercise:", error.message)
    next(error)
  }
}


const updateExerciseTemplate = async (req, res, next) => {
  try {
    console.log("Inside updateExerciseTemplate...")
    const userId = req.user._id

    const { name, bodyPart, equipment, sets, notes } = req.body.exercise

    console.log("req.body.id--->", JSON.stringify(req.body.id))

    if (!req.body.id) {
      return next(errorHandler(400, "Template ID is required!"))
    }

    const template = await ExerciseTemplate.findOne({_id: req.body.id, userId})

    if (!template) {
      return next(errorHandler(404, "Exercise template not found!"))
    }

    if (sets && Array.isArray(sets)) {
      for (const s of sets) {
        if (s.reps && isNaN(s.reps)) {
          return next(errorHandler(400, "Each set must include valid reps!"))
        }
        if (s.rpe && (s.rpe < 1 || s.rpe > 10)) {
          return next(errorHandler(400, "RPE must be between 1 and 10!"))
        }
      }
    }

    if (name) template.name = name.trim()
    if (bodyPart) template.bodyPart = bodyPart.trim()
    if (equipment !== undefined)
      template.equipment = equipment.trim() || null
    if (notes !== undefined) template.notes = notes

    if (sets && Array.isArray(sets)) {
      template.sets = sets.map(s => ({
        weight: Number(s.weight) || 0,
        reps: Number(s.reps),
        rpe: s.rpe || null
      }))
    }

    template.lastUsedAt = new Date() 

    await template.save();

    res.status(200).json({message: "Exercise template updated successfully!", template});

  }
  catch (error) {
    console.log("Error updating exercise template:", error.message)
    next(error)
  }
}


const updateWorkoutInfo = async (req, res, next) => {
  try {
    console.log("Inside updateWorkoutInfo...")

    const userId = req.user._id
    const { exerciseId, selectedExercise, sets, completedTillIndex, duration } = req.body.workoutInfo

    console.log("req.body.workoutInfo--->", JSON.stringify(req.body.workoutInfo))

    if (!exerciseId) {
      return next(errorHandler(400, "Exercise ID is required!"))
    }

    const todayStart = new Date().setHours(0, 0, 0, 0)
    const todayEnd = new Date().setHours(23, 59, 59, 999)

    let tracker = await FitnessTracker.findOne({
      userId,
      date: { $gte: todayStart, $lte: todayEnd },
    })

    if (!tracker) {
      console.log("No tracker found! Creatine new tracker")
      tracker = await FitnessTracker.create({
        userId,
        exercises: [],
        totalWorkoutVolume: 0,
      })
    }

    let exercise = tracker.exercises.id(exerciseId)

    if (!exercise) {
      console.log("No such exercise found! Pushing new exercise...")
      tracker.exercises.push({
        name: selectedExercise.name,
        bodyPart: selectedExercise.bodyPart,
        equipment: selectedExercise.equipment || null,
        sets: sets.map((s) => ({
          weight: s.weight || 0,
          reps: s.reps,
          rpe: s.rpe || null,
          completed: false,
          completedAt: null,
        })),
        notes: selectedExercise.notes || "",
        duration: 0,
        totalVolume: 0,
      })

      await tracker.save();
      exercise = tracker.exercises[tracker.exercises.length - 1]
    }

    tracker.totalWorkoutVolume -= exercise.totalVolume

    console.log("tracker.totalWorkoutVolume---->", tracker.totalWorkoutVolume)

    if (sets && Array.isArray(sets)) {
      sets.forEach((s, index) => {
        if (exercise.sets[index] && index < completedTillIndex) {
          exercise.sets[index].weight = Number(s.weight) || 0
          exercise.sets[index].reps = Number(s.reps)
          exercise.sets[index].rpe = s.rpe || null
          exercise.sets[index].completed = true
          exercise.sets[index].completedAt = new Date()
        }
      })
    }

    const allCompleted = exercise.sets.every((s) => s.completed)
    exercise.exerciseCompleted = allCompleted

    if (duration !== undefined) {
      const updatedDuration = Number(duration)
      exercise.duration = updatedDuration
      tracker.totalDuration = Number(tracker.totalDuration || 0) + updatedDuration;
    }
    if (allCompleted) {
      exercise.exerciseCompletedAt = new Date()
    }

    exercise.totalVolume = exercise.sets.reduce(
      (acc, s) => acc + (s.weight || 0) * (s.reps || 0),
      0
    )

    tracker.totalWorkoutVolume += exercise.totalVolume

    console.log("tracker.totalWorkoutVolume now---->", tracker.totalWorkoutVolume)

    await tracker.save();

    return res.status(200).json({message: "Exercise progress updated!", exercise, tracker});
  }
  catch (error) {
    console.error("Error updating exercise progress:", error.message)
    next(error)
  }
}


const updateCaloriesForExercise = async (req, res, next) => {
  try {
    console.log("Inside updateCaloriesForExercise...")
    const userId = req.user._id
    const { fitnessTrackerId, exerciseId, calories } = req.body.calorieDetails

    console.log("req.body.calorieDetails--->", JSON.stringify(req.body.calorieDetails))

    if (!fitnessTrackerId || !exerciseId || calories == null) {
      return next(errorHandler(400, "fitnessTrackerId, exerciseId and calories are required"))
    }

    if (calories < 0) {
      return next(errorHandler(400, "Calories must be a positive number"))
    }

    const workout = await FitnessTracker.findOne({_id: fitnessTrackerId, userId})

    if (!workout) {
      return next(errorHandler(404, "Workout not found"))
    }

    const exercise = workout.exercises.id(exerciseId)
    if (!exercise) {
      return next(errorHandler(404, "Exercise not found"))
    }

    exercise.calories = calories

    workout.totalCalories = workout.exercises.reduce( (sum, ex) => sum + (ex.calories || 0), 0 )
    
    console.log("workout.totalCalories now---->", workout.totalCalories)

    await workout.save();

    return res.status(200).json({success: true, message: "Calories updated successfully!", totalCalories: workout.totalCalories});

  }
  catch (error) {
    console.error("Error updating calories:", error)
    next(error)
  }
}



const getUserExerciseLibrary = async (req, res, next) => {
  try {
    console.log("Inside getUserExerciseLibrary...")

    const userId = req.user._id

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const skip = (page - 1) * limit

    const sortQuery = {
      lastUsedAt: -1, 
      updatedAt: -1, 
    }

    const totalExercises = await ExerciseTemplate.countDocuments({ userId })

    const exercises = await ExerciseTemplate.find({ userId })
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)

    console.log(`totalExercises-----------> ${totalExercises} and exercises-----------> ${JSON.stringify(exercises)}`)

    return res.status(200).json({
      success: true,
      page,
      limit,
      totalExercises,
      totalPages: Math.ceil(totalExercises / limit),
      exercises, 
    });

  }
  catch (error) {
    console.error("Error fetching exercise templates:", error)
    next(error)
  }
}


const getWorkoutHistory = async (req, res, next) => {
  try {
    console.log("Inside getWorkoutHistory...")
    const userId = req.user._id

    const page = parseInt(req.query.page) || 1
    const limit = req.query?.limit || 5 
    const skip = (page - 1) * limit

    console.log(`page-----------> ${page} and limit-----------> ${limit}`)

    const todayStart = new Date(new Date().setHours(0, 0, 0, 0))
    const todayEnd = new Date(new Date().setHours(23, 59, 59, 999))

    const todayWorkouts = await FitnessTracker.find({
      userId,
      date: { $gte: todayStart, $lte: todayEnd }
    })
    .sort({ updatedAt: -1 })
    .lean()

    console.log("todayWorkouts---->", JSON.stringify(todayWorkouts))

    const olderWorkouts = await FitnessTracker.find({ userId,
      date: { $lt: todayStart }
    })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const totalOlderCount = await FitnessTracker.countDocuments({
      userId,
      date: { $lt: todayStart }
    });

    const totalPages = Math.ceil(totalOlderCount / limit)

    console.log(`totalPages-----------> ${totalPages} and totalOlderCount-----------> ${totalOlderCount}`)


    return res.status(200).json({
      success: true,
      todayWorkouts,
      olderWorkouts,
      pagination: {
        currentPage: page,
        totalPages,
        totalOlderCount,
        hasMore: page < totalPages
      }
    });

  }
  catch (error) {
    console.error("Error fetching workout history:", error.message)
    next(error)
  }
}


const getLatestWorkout = async (req, res, next) => {
  try {
    console.log("Inside getLatestWorkout...")

    const userId = req.user._id

    const result = await FitnessTracker.aggregate([
      {
        $match: { userId }
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
      { $limit: 2 },
      {
        $project: {
          fitnessTrackerId: "$_id",
          exercise: "$exercises",
          workoutDate: "$date",
          activityTime: 1
        }
      }
    ])

    if (!result.length) {
      return res.status(200).json({
        success: true,
        message: "No workouts found",
        data: null
      })
    }

    const { fitnessTrackerId, exercise } = result[0]
    const prevExercise = result?.[1]?.exercise || null

    return res.status(200).json({
      success: true,
      latestWorkout: exercise,
      trackerId: fitnessTrackerId,
      prevExercise
    })
  }
  catch (error) {
    console.error("Error fetching latest workout:", error.message)
    next(error)
  }
}



const deleteExerciseTemplate = async (req, res, next) => {
  try {
    console.log("Inside deleteExerciseTemplate...")
    const userId = req.user._id
    const { exerciseTemplateId } = req.params

    if (!exerciseTemplateId) {
      return next(errorHandler(400, "Exercise Template ID is required!"));
    }

    const deletedTemplate = await ExerciseTemplate.findOneAndDelete({
      _id: exerciseTemplateId,
      userId
    })

    if (!deletedTemplate) {
      return next(errorHandler(404, "Exercise template not found!"));
    }

    return res.status(200).json({success: true, message: "Exercise removed from library successfully!"});

  }
  catch (error){
    console.error("Error deleting exercise template:", error.message)
    next(error)
  }
}


const addOrUpdateDailyHealthProfile = async (req, res, next) => {
  try {
    console.log("Inside addOrUpdateDailyHealthProfile...")
    const userId = req.user._id

    const {
      gender,
      age,
      height,
      weight,
      waistCircumference,
      hipCircumference,
      bloodPressure,
      bodyFatPercentage,
      glucose,
    } = req.body.healthProfile

    console.log("req.body.healthProfile----->", req.body.healthProfile)

    if (!age || !height || !weight) {
      return next(
        errorHandler(400, "Age, height and weight are required fields")
      )
    }

    if (gender){
      const user = await User.findById(userId).select("gender")
      if (!user) {
        return next(errorHandler(404, "Please sign up or sign in to track your health!"));
      }
      if (!user.gender) {
        await User.findByIdAndUpdate(userId, { gender }, { new: true });
        console.log("User gender set for the first time.")
      } else {
        console.log("User already has gender — not changing it.")
      }
    }
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const latestProfile = await HealthProfile.findOne({ userId }).sort({ date: -1 })

    const profilePayload = {
      userId,
      age,
      height,
      weight,
      waistCircumference: waistCircumference ?? null,
      hipCircumference: hipCircumference ?? null,
      bloodPressure: {
        systolic: bloodPressure?.systolic ?? null,
        diastolic: bloodPressure?.diastolic ?? null,
      },
      bodyFatPercentage: bodyFatPercentage ?? null,
      glucose: glucose ?? null,
    }

    if (latestProfile) {
      const profileDate = new Date(latestProfile.date)
      profileDate.setHours(0, 0, 0, 0)

      if (profileDate.getTime() === today.getTime()) {
        const updatedProfile = await HealthProfile.findByIdAndUpdate( latestProfile._id, profilePayload, { new: true } );

        return res.status(200).json({success: true, message: "Health profile updated for today!"});
      }
    }

    const newProfile = await HealthProfile.create({...profilePayload, date: Date.now()})

    return res.status(201).json({success: true, message: "New daily health profile created!"});
  }
  catch (error) {
    console.error("Error saving daily health profile:", error.message)
    next(error)
  }
}


const getLatestHealthProfile = async (req, res, next) => {
  try {
    console.log("Inside getLatestHealthProfile...")
    const userId = req.user._id
    console.log("IuserId---->", userId)

    const profiles = await HealthProfile.find({ userId })
      .sort({ date: -1 }) 
      .limit(2)
      .lean();
    console.log("profiles---->", JSON.stringify(profiles))

    if (!profiles.length) {
      return next(errorHandler(404, "No health profile found for this user!"))
    }

    return res.status(200).json({
      success: true,
      latestProfile: profiles[0],
      prevProfile: profiles?.[1] || null
    });

  }
  catch (error) {
    console.error("Error getting latest health profile:", error.message)
    next(error)
  }
}


const checkWeeklyHealthProfile = async (req, res, next) => {
  try {
    console.log("Inside checkWeeklyHealthProfile...")
    const userId = req.user._id

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, notAnUser: true })
    }

    const createdAt = new Date(user.createdAt)
    const today = new Date()

    const daysSinceRegistered = Math.floor( (today - createdAt) / (1000 * 60 * 60 * 24) )

    const isNewUser = daysSinceRegistered < 7

    const now = new Date()
    const startOfWeek = new Date(now)

    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const latestEntry = await HealthProfile.findOne({
      userId,
      createdAt: { $gte: startOfWeek },
    }).sort({ createdAt: -1 })

    const hasEntryThisWeek = !!latestEntry

    let shouldShowReminder = false

    const ONE_DAY = 24 * 60 * 60 * 1000
    const lastShown = user.lastHealthReminderShownAt

    if (!hasEntryThisWeek) {
      if (!lastShown || (now - lastShown) > ONE_DAY) {
        shouldShowReminder = true

        user.lastHealthReminderShownAt = now
        await user.save()
      }
    }

    console.log(`hasEntryThisWeek: ${hasEntryThisWeek}, isNewUser: ${isNewUser}, shouldShowReminder: ${shouldShowReminder}`)

    return res.status(200).json({
      success: true,
      isNewUser,
      hasEntryThisWeek,
      shouldShowReminder,
      latestEntry: latestEntry || null,
    })
  }
  catch (error) {
    console.error("checkWeeklyHealthProfile Error:", error.message)
    next(error)
  }
}




module.exports = {getExerciseThumbnail, getExerciseVideos, getExercisesList, getExerciseBodyParts, getExerciseEquipments, getExerciseMuscles,
    addExercise, updateExerciseTemplate, updateWorkoutInfo, updateCaloriesForExercise, getUserExerciseLibrary, getWorkoutHistory, 
    getLatestWorkout, deleteExerciseTemplate, addOrUpdateDailyHealthProfile, getLatestHealthProfile, checkWeeklyHealthProfile}