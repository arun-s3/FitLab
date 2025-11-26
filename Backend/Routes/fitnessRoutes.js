const express = require('express')
const fitnessRouter = express.Router()
const {getExerciseThumbnail, getExerciseVideos} = require('../Controllers/fitnessController')


fitnessRouter.get('/thumbnail/:name', getExerciseThumbnail)

fitnessRouter.get('/videos/:name', getExerciseVideos)

// fitnessRouter.get('/exercises', getAllExercises)



module.exports = fitnessRouter

