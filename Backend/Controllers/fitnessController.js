const Fitness = require('../Models/fitnessModel')
// const axios = require("axios")
const fs = require('fs')
const path = require('path')
const axios = require("axios")
// const fetch = require("node-fetch")
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

    let finalThumbnail = null

    // finalThumbnail = await fetchFromBrave(name)
    // if (!finalThumbnail) {
      // 3. Try SerpApi next 
      finalThumbnail = await fetchFromGoogle(name)
    // }
    if (!finalThumbnail) {
      finalThumbnail = await fetchFromSerpApi(name)
    }

    // if (!finalThumbnail) {
    //   finalThumbnail = "/fitness_placeholder.jpg"
    // }
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


// ExerciseDB Base URL (no API key needed for public endpoints)
const API_BASE = "https://www.exercisedb.dev/api/v1";

// Delay helper (5-10 seconds)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/*
 Retry wrapper:
 - Retries 3 times if status is 429 or network error
 - Uses exponential backoff
*/
const safeRequest = async (url, attempt = 1) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    const status = err?.response?.status;

    // Only retry on 429 or network issues
    if ((status === 429 || !status) && attempt <= 3) {
      const wait = attempt * 5000; // 5s, 10s, 15s
      console.log(`⚠️  Retry ${attempt} for ${url} after ${wait / 1000}s...`);
      await sleep(wait);
      return safeRequest(url, attempt + 1);
    }

    // Hard fail
    throw err;
  }
};

// Delay utility
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// API Base
const BASE_URL = "https://www.exercisedb.dev/api/v1";

// Retry wrapper
async function axiosWithRetry(url, retries = 5, delayMs = 3000) {
    let attempt = 0;

    while (attempt < retries) {
        try {
            const response = await axios.get(url);
            if (response.status === 200) return response;
        } catch (err) {
            console.log(`⚠️ Request failed (Attempt ${attempt + 1}/${retries}) - ${url}`);
        }

        attempt++;
        await delay(delayMs);
    }

    throw new Error(`Failed to fetch after ${retries} attempts → ${url}`);
}

const getAllExercises = async (req, res, next) => {
    try {
        console.log("🔥 Starting full exercise sync...");

        // STEP 1 — Fetch all body parts
        const bodyPartsUrl = `${BASE_URL}/bodyparts`;
        console.log("Fetching body parts:", bodyPartsUrl);

        const bodyPartsResponse = await axiosWithRetry(bodyPartsUrl);
        const bodyPartsRaw = bodyPartsResponse.data;

        console.log("Body parts returned:", bodyPartsRaw);

        // Validate structure
        if (!bodyPartsRaw || !Array.isArray(bodyPartsRaw.data)) {
            throw new Error("API returned invalid bodyParts format");
        }

        const bodyParts = bodyPartsRaw.data.map((bp) => bp.name);
        console.log(`✔ Found ${bodyParts.length} body parts`);

        // Store exercises uniquely
        const allExercises = new Map();

        // STEP 2 — Fetch all exercises for each bodypart
        for (const bodyPart of bodyParts) {
            console.log(`\n📌 Fetching exercises for: ${bodyPart}`);

            let offset = 0;
            const limit = 50;

            while (true) {
                const url = `${BASE_URL}/bodyparts/${bodyPart}/exercises?offset=${offset}&limit=${limit}`;
                console.log(`⏳ Fetching batch → offset: ${offset}`);

                let response;

                try {
                    response = await axiosWithRetry(url);
                } catch (err) {
                    console.log(`❌ Failed batch for ${bodyPart} at offset ${offset}`);
                    break;
                }

                const exercises = response.data?.data;

                if (!Array.isArray(exercises)) {
                    console.log(`❌ Invalid exercise list at offset: ${offset}`);
                    break;
                }

                if (exercises.length === 0) {
                    console.log(`✔ Completed ${bodyPart} — no more exercises`);
                    break;
                }

                // Store minimal format → ONLY the name
                for (const ex of exercises) {
                    allExercises.set(ex.exerciseId, {
                        name: ex.name
                    });
                }

                console.log(`   → Retrieved ${exercises.length} exercises`);

                offset += limit;

                // Rate-limit protection
                await delay(10000); // 10s
            }
        }

        // STEP 3 — Convert to array
        const finalList = Array.from(allExercises.values());
        console.log(`\n✅ TOTAL UNIQUE EXERCISES: ${finalList.length}`);

        // STEP 4 — Save file
        const outputDir = path.join(__dirname, "../Data");
        const filePath = path.join(outputDir, "exercises.json");

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        fs.writeFileSync(filePath, JSON.stringify(finalList, null, 2));

        console.log(`💾 Saved to: ${filePath}`);

        return res.status(200).json({
            success: true,
            total: finalList.length,
            message: "Exercise database synced successfully",
            data: finalList,
        });

    } catch (error) {
        console.log("❌ Error in getAllExercises:", error);
        next(error);
    }
};



module.exports = {getExerciseThumbnail, getAllExercises}