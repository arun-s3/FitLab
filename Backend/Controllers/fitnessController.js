const Fitness = require('../Models/fitnessModel')
const FitnessTracker = require("../Models/fitnessTrackerModel")

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
    console.log("req.body.exercise-------->", JSON.stringify(req.body.exercise))

    if (!name || !bodyPart || !Array.isArray(sets) || sets.length === 0) {
      return next(errorHandler(400, "Exercise name, body part, and at least one set are required!"));
    }

    for (const s of sets) {
      if (!s.reps || isNaN(s.reps)) {
        return next(errorHandler(400, "Each set must include valid reps!"));
      }

      if (s.rpe && (s.rpe < 1 || s.rpe > 10)) {
        return next(errorHandler(400, "RPE must be between 1 and 10!"));
      }
    }

    const totalVolume = sets.reduce((acc, s) => {
      const w = Number(s.weight) || 0
      const r = Number(s.reps) || 0
      return acc + w * r
    }, 0)
    
    console.log("totalVolume-------->", totalVolume)


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
        rpe: s.rpe || null
      })),
      notes: notes || "",
      totalVolume,
    })

    tracker.totalVolume += totalVolume

    await tracker.save();

    return res.status(201).json({
      message: "Exercise added successfully!",
      tracker
    })

  }
  catch (error) {
    console.log("Error adding exercise:", error.message)
    next(error)
  }
}


const listExercises = async (req, res, next) => {
  try {
    console.log("Inside listExercises...")
    const userId = req.user._id

    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.max(parseInt(req.query.limit) || 5, 1)
    const skip = (page - 1) * limit

    const workouts = await FitnessTracker.find({ userId }).sort({ date: -1 })

    if (!workouts.length) {
      return res.status(404).json({ message: "No exercises found" })
    }

    const allExercises = []
    workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        allExercises.push({
          ...ex.toObject(),
          workoutId: workout._id,
          workoutDate: workout.date
        })
      })
    })

    const totalExercises = allExercises.length
    const totalPages = Math.ceil(totalExercises / limit)

    const exercises = allExercises.slice(skip, skip + limit)

    return res.status(200).json({
      message: "Exercises fetched successfully",
      exercises,
      pagination: {
        totalExercises,
        totalPages,
        currentPage: page,
        perPage: limit
      }
    });

  }
  catch (error) {
    console.error("Error fetching exercises:", error.message)
    next(error)
  }
}




module.exports = {getExerciseThumbnail, getExerciseVideos, addExercise, listExercises}