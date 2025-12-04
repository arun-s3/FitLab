const Fitness = require('../Models/fitnessModel')
const FitnessTracker = require("../Models/fitnessTrackerModel")
const ExerciseTemplate = require("../Models/exerciseTemplateModel")
const HealthProfile = require("../Models/healthProfileModel")


const fs = require('fs')
const path = require('path')
const axios = require("axios")

const {errorHandler} = require('../Utils/errorHandler')


// const fetchFromBrave = async (query) => {
//   try {
//     const res = await axios.get("https://api.search.brave.com/res/v1/images/search", {
//       headers: {
//         "X-Subscription-Token": process.env.BRAVE_API_KEY,
//       },
//       params: {
//         q: `${query} JEFIT`,
//         count: 1
//       },
//     })

//     return res.data?.results?.[0]?.thumbnail || null
//   } catch (err) {
//     console.log("Brave fetch error:", err.response?.data || err.message)
//     return null
//   }
// }


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


const updateHealthProfile = async (req, res, next) => {
  try {
    console.log("Inside upsertHealthProfile...")
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

    if (!gender || !age || !height || !weight) {
      return next(errorHandler(400, "Gender, age, height, and weight are required!"))
    }

    let healthProfile = await HealthProfile.findOne({ userId })

    if (!healthProfile) {
      console.log("No health profile found! Creating new one...")
      healthProfile = await HealthProfile.create({
        userId,
        gender,
        age,
        height,
        weight,
        waistCircumference: waistCircumference || null,
        hipCircumference: hipCircumference || null,
        bloodPressure: {
          systolic: bloodPressure?.systolic ?? null,
          diastolic: bloodPressure?.diastolic ?? null,
        },
        bodyFatPercentage: bodyFatPercentage || null,
        glucose: glucose || null,
      })

      return res.status(201).json({
        success: true,
        message: "Health profile created successfully!",
        healthProfile,
      });
    }

    healthProfile.gender = gender
    healthProfile.age = age
    healthProfile.height = height
    healthProfile.weight = weight
    healthProfile.waistCircumference = waistCircumference ?? healthProfile.waistCircumference
    healthProfile.hipCircumference = hipCircumference ?? healthProfile.hipCircumference
    healthProfile.bloodPressure.systolic = bloodPressure?.systolic ?? healthProfile.bloodPressure.systolic
    healthProfile.bloodPressure.diastolic = bloodPressure?.diastolic ?? healthProfile.bloodPressure.diastolic
    healthProfile.bodyFatPercentage = bodyFatPercentage ?? healthProfile.bodyFatPercentage
    healthProfile.glucose = glucose ?? healthProfile.glucose

    await healthProfile.save();

    return res.status(200).json({
      success: true,
      message: "Health profile updated successfully!",
      healthProfile,
    });
  }
  catch (error) {
    console.error("Error updating/creating health profile:", error.message)
    next(error)
  }
}



module.exports = {getExerciseThumbnail, getExerciseVideos, addExercise, updateExerciseTemplate, updateWorkoutInfo,
  getUserExerciseLibrary, getWorkoutHistory, deleteExerciseTemplate, updateHealthProfile}