const express = require('express')
const fitnessRouter = express.Router()
const {isLogin, isLogout} = require('../Middlewares/Authentication')
const {getExerciseThumbnail, getExerciseVideos, getExercisesList, getExerciseBodyParts, addExercise, updateExerciseTemplate, getUserExerciseLibrary,
    deleteExerciseTemplate, updateWorkoutInfo, updateCaloriesForExercise, getWorkoutHistory, getLatestWorkout, addOrUpdateDailyHealthProfile, 
    getLatestHealthProfile, checkWeeklyHealthProfile} = require('../Controllers/fitnessController')

const {getWeeklyStats, getMonthlyStats, getWorkoutFrequencyStats, getWorkoutVolumeStats,
     getCaloriesStats, getWeightInsights, getBodyPartInsights, getHealthScoreInsights} = require('../Controllers/fitnessDashboardController')


fitnessRouter.get('/thumbnail/:name', getExerciseThumbnail)
fitnessRouter.get('/videos/:name', getExerciseVideos)
fitnessRouter.post('/exercises/list', getExercisesList)
fitnessRouter.get("/exercises/bodyparts", getExerciseBodyParts)

fitnessRouter.post('/tracker/exercise-library/add', isLogin, addExercise)
fitnessRouter.get('/tracker/exercise-library/list', isLogin, getUserExerciseLibrary)
fitnessRouter.put('/tracker/exercise-library/update', isLogin, updateExerciseTemplate)
fitnessRouter.delete('/tracker/exercise-library/delete/:exerciseTemplateId', isLogin, deleteExerciseTemplate)

fitnessRouter.post('/tracker/workout/add', isLogin, updateWorkoutInfo)
fitnessRouter.get('/tracker/workout/list', isLogin, getWorkoutHistory)
fitnessRouter.get('/tracker/workout/latest', isLogin, getLatestWorkout)
fitnessRouter.post('/tracker/workout/save-calories', isLogin, updateCaloriesForExercise)

fitnessRouter.post('/tracker/health/update', isLogin, addOrUpdateDailyHealthProfile)
fitnessRouter.get('/tracker/health', isLogin, getLatestHealthProfile)
fitnessRouter.get('/tracker/health/check', isLogin, checkWeeklyHealthProfile)

fitnessRouter.get('/tracker/stats/week', isLogin, getWeeklyStats)
fitnessRouter.get('/tracker/stats/month', isLogin, getMonthlyStats)
fitnessRouter.get('/tracker/stats/workouts', isLogin, getWorkoutFrequencyStats)
fitnessRouter.get('/tracker/stats/volume', isLogin, getWorkoutVolumeStats)
fitnessRouter.get('/tracker/stats/calories', isLogin, getCaloriesStats) 
fitnessRouter.get('/tracker/stats/weight', isLogin, getWeightInsights) 
fitnessRouter.get('/tracker/stats/exerciseBreakdown', isLogin, getBodyPartInsights)
fitnessRouter.get('/tracker/stats/health', isLogin, getHealthScoreInsights) 


module.exports = fitnessRouter

