const express = require('express')
const fitnessRouter = express.Router()
const {isLogin, isLogout} = require('../Middlewares/Authentication')
const {getExerciseThumbnail, getExerciseVideos, addExercise, updateExerciseTemplate, getUserExerciseLibrary, deleteExerciseTemplate,
    updateWorkoutInfo, getWorkoutHistory} = require('../Controllers/fitnessController')


fitnessRouter.get('/thumbnail/:name', getExerciseThumbnail)
fitnessRouter.get('/videos/:name', getExerciseVideos)
fitnessRouter.post('/tracker/exercise-library/add', isLogin, addExercise)
fitnessRouter.get('/tracker/exercise-library/list', isLogin, getUserExerciseLibrary)
fitnessRouter.put('/tracker/exercise-library/update', isLogin, updateExerciseTemplate)
fitnessRouter.delete('/tracker/exercise-library/delete/:exerciseTemplateId', isLogin, deleteExerciseTemplate)

fitnessRouter.post('/tracker/workout/add', isLogin, updateWorkoutInfo)
fitnessRouter.get('/tracker/workout/list', isLogin, getWorkoutHistory)


// fitnessRouter.get('/exercises', getAllExercises)



module.exports = fitnessRouter

