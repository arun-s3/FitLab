const express = require('express')
const fitnessRouter = express.Router()
const {isLogin, isLogout} = require('../Middlewares/Authentication')
const {getExerciseThumbnail, getExerciseVideos, addExercise, updateExerciseTemplate, getUserExerciseLibrary, deleteExerciseTemplate
    } = require('../Controllers/fitnessController')


fitnessRouter.get('/thumbnail/:name', getExerciseThumbnail)
fitnessRouter.get('/videos/:name', getExerciseVideos)
fitnessRouter.post('/tracker/exercise-library/add', isLogin, addExercise)
fitnessRouter.get('/tracker/exercise-library/list', isLogin, getUserExerciseLibrary)
fitnessRouter.put('/tracker/exercise-library/update', isLogin, updateExerciseTemplate)
fitnessRouter.delete('/tracker/exercise-library/delete/:exerciseTemplateId', isLogin, deleteExerciseTemplate)

// fitnessRouter.get('/exercises', getAllExercises)



module.exports = fitnessRouter

