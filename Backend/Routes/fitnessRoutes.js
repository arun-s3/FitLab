const express = require('express')
const fitnessRouter = express.Router()
const {getExerciseThumbnail} = require('../Controllers/fitnessController')


fitnessRouter.get('/thumbnail/:name', getExerciseThumbnail)
// fitnessRouter.get('/exercises', getAllExercises)



module.exports = fitnessRouter

