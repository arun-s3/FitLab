const express = require("express")
const fitnessRouter = express.Router()

const { isLogin, optionalAuth } = require("../Middlewares/Authentication")

const {
    getExerciseThumbnail,
    getExerciseVideos,
    getExercisesList,
    getExerciseBodyParts,
    getExerciseEquipments,
    getExerciseMuscles,
    addExercise,
    updateExerciseTemplate,
    getUserExerciseLibrary,
    deleteExerciseTemplate,
    updateWorkoutInfo,
    updateCaloriesForExercise,
    getWorkoutHistory,
    getLatestWorkout,
    addOrUpdateDailyHealthProfile,
    getLatestHealthProfile,
    checkWeeklyHealthProfile,
} = require("../Controllers/fitnessController")

const {
    getWeeklyStats,
    getMonthlyStats,
    getWorkoutFrequencyStats,
    getWorkoutVolumeStats,
    getCaloriesStats,
    getWeightInsights,
    getBodyPartInsights,
    getHealthScoreInsights,
} = require("../Controllers/fitnessDashboardController")

fitnessRouter.get("/thumbnail/:name", optionalAuth, getExerciseThumbnail)
fitnessRouter.get("/videos/:name", optionalAuth, getExerciseVideos)
fitnessRouter.post("/exercises/list", optionalAuth, getExercisesList)
fitnessRouter.get("/exercises/bodyparts", optionalAuth, getExerciseBodyParts)
fitnessRouter.get("/exercises/muscles", optionalAuth, getExerciseMuscles)
fitnessRouter.get("/exercises/equipments", optionalAuth, getExerciseEquipments)

fitnessRouter.post("/tracker/exercise-library/add", isLogin, addExercise)
fitnessRouter.get("/tracker/exercise-library/list", isLogin, getUserExerciseLibrary)
fitnessRouter.put("/tracker/exercise-library/update", isLogin, updateExerciseTemplate)
fitnessRouter.delete("/tracker/exercise-library/delete/:exerciseTemplateId", isLogin, deleteExerciseTemplate)

fitnessRouter.post("/tracker/workout/add", isLogin, updateWorkoutInfo)
fitnessRouter.get("/tracker/workout/list", isLogin, getWorkoutHistory)
fitnessRouter.get("/tracker/workout/latest", isLogin, getLatestWorkout)
fitnessRouter.post("/tracker/workout/save-calories", isLogin, updateCaloriesForExercise)

fitnessRouter.post("/tracker/health/update", isLogin, addOrUpdateDailyHealthProfile)
fitnessRouter.get("/tracker/health", isLogin, getLatestHealthProfile)
fitnessRouter.get("/tracker/health/check", optionalAuth, checkWeeklyHealthProfile)

fitnessRouter.get("/tracker/stats/week", isLogin, getWeeklyStats)
fitnessRouter.get("/tracker/stats/month", isLogin, getMonthlyStats)
fitnessRouter.get("/tracker/stats/workouts", isLogin, getWorkoutFrequencyStats)
fitnessRouter.get("/tracker/stats/volume", isLogin, getWorkoutVolumeStats)
fitnessRouter.get("/tracker/stats/calories", isLogin, getCaloriesStats)
fitnessRouter.get("/tracker/stats/weight", isLogin, getWeightInsights)
fitnessRouter.get("/tracker/stats/exerciseBreakdown", isLogin, getBodyPartInsights)
fitnessRouter.get("/tracker/stats/health", isLogin, getHealthScoreInsights)

module.exports = fitnessRouter
