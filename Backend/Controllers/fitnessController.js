const Fitness = require('../Models/fitnessModel')
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

//     return res.data?.results?.[0]?.thumbnail || null;
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



module.exports = {getExerciseThumbnail, getExerciseVideos}