const express = require('express')
const fitnessRouter = express.Router()
const {isLogin, isLogout} = require('../Middlewares/Authentication')
const {getExerciseThumbnail, getExerciseVideos, addExercise, listExercises} = require('../Controllers/fitnessController')


fitnessRouter.get('/thumbnail/:name', getExerciseThumbnail)
fitnessRouter.get('/videos/:name', getExerciseVideos)
fitnessRouter.post('/tracker/add', isLogin, addExercise)
fitnessRouter.get('/tracker/list', isLogin, listExercises)

// fitnessRouter.get('/exercises', getAllExercises)



module.exports = fitnessRouter

