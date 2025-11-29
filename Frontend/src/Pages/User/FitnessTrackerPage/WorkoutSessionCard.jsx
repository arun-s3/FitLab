import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

import axios from 'axios'
import {toast as sonnerToast} from 'sonner'

import Timer from "./Timer"
import ExerciseForm from "./ExerciseForm"
import WorkoutSummaryModal from "./WorkoutSummaryModal"

const PlayIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
)

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export default function WorkoutSessionCard() {

  const [startTime, setStartTime] = useState(null)
  const [exercises, setExercises] = useState([])
  const [selectedExerciseId, setSelectedExerciseId] = useState(null)
  const [currentSet, setCurrentSet] = useState(0)
  const [showSummary, setShowSummary] = useState(false)
  const [sessionStats, setSessionStats] = useState(null)
  const [missedSets, setMissedSets] = useState([])

  const limit = 5
  const [currentPage, setCurrentPage] = useState(1)


  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  const getExercises = async()=> {
    console.log("Inside getExercises...")
    try { 
      const response = await axios.get(`${baseApiUrl}/fitness/tracker/list?page=${currentPage}&limit=${limit}`, { withCredentials: true })
      if(response.status === 200){
        console.log("response.data.exercises----------->", response.data.exercises)
        setExercises(response.data.exercises)
        sonnerToast.success("New exercise succesfully added!")
        onAddExercise()
      }
      if(response.status === 404){
        setExercises([])
      }
    }catch (error) {
      console.error("Error during ading exercise", error.message)
    }
  }

  useEffect(()=> {
    getExercises()
  }, [])

  const handleAddExercise = async(exercise) => {
    getExercises()
  }

  const handleRemoveExercise = (id) => {
    setExercises(exercises.filter((e) => e.id !== id))
    if (selectedExerciseId === id) {
      setSelectedExerciseId(null)
      setCurrentSet(0)
    }
  }

  const handleSelectExercise = (id) => {
    setSelectedExerciseId(id)
    setStartTime(Date.now())
    setCurrentSet(0)
  }

  const handleCompleteSet = () => {
    const selectedExercise = exercises.find((e) => e.id === selectedExerciseId)
    if (selectedExercise && currentSet < selectedExercise.sets - 1) {
      setCurrentSet(currentSet + 1)
    } else {
      setSelectedExerciseId(null)
      setCurrentSet(0)
    }
  }

  const handleStopExercise = () => {
    const selectedExercise = exercises.find((e) => e.id === selectedExerciseId)
    if (selectedExercise && currentSet < selectedExercise.sets) {
      const missed = []
      for (let i = currentSet; i < selectedExercise.sets; i++) {
        missed.push({
          exerciseName: selectedExercise.name,
          set: i + 1,
          totalSets: selectedExercise.sets,
        })
      }
      setMissedSets([...missedSets, ...missed])
    }
    setSelectedExerciseId(null)
    setCurrentSet(0)
  }

  const handleFinishWorkout = () => {
    const duration = Math.floor((Date.now() - startTime) / 1000)
    const totalVolume = exercises.reduce((acc, e) => acc + e.weight * e.reps * e.sets, 0)
    const estimatedCalories = Math.round((duration / 60) * 8 + totalVolume * 0.1)

    setSessionStats({
      duration,
      totalVolume,
      estimatedCalories,
      exerciseCount: exercises.length,
      totalReps: exercises.reduce((acc, e) => acc + e.reps * e.sets, 0),
      missedSets: missedSets,
    })

    setShowSummary(true)
    setExercises([])
    setMissedSets([])
  }

  const selectedExercise = exercises.find((e) => e.id === selectedExerciseId)

  return (
    <>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ExerciseForm onAddExercise={handleAddExercise} />
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900 font-semibold text-lg">Exercises</h3>
                  <motion.button
                    onClick={() => {
                      setExercises([])
                      setSelectedExerciseId(null)
                      setMissedSets([])
                    }}
                    className="text-red-500 hover:text-red-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    <XIcon />
                  </motion.button>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {exercises.length === 0 ? (
                    <p className="text-gray-400 text-center py-6">No exercises added yet</p>
                  ) : (
                    exercises.map((ex) => (
                      <motion.div
                        key={ex.workoutId}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className={`rounded-lg p-4 border-2 cursor-pointer transition-all ${
                          selectedExerciseId === ex.workoutId
                            ? "bg-blue-50 border-blue-500"
                            : "bg-gray-50 border-gray-200 hover:border-gray-300" 
                        }`}
                        onClick={() => handleSelectExercise(ex.workoutId)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-gray-900 font-semibold">{ex.name}</p>
                            {
                              ex.sets.map((set, index)=> (
                                <p className="text-gray-600 text-sm">
                                  {index + 1} × {set.reps} @ {set.weight}kg ({set.rpe}/10 RPE)
                                </p>
                              ))
                            }
                            {ex.notes && <p className="text-gray-500 text-xs mt-1">{ex.notes}</p>}
                          </div>
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveExercise(ex.workoutId)
                            }}
                            className="text-red-500 hover:text-red-600 ml-2"
                            whileHover={{ scale: 1.1 }}
                          >
                            <XIcon />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-1 space-y-4">
              <AnimatePresence>
                {selectedExercise && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
                  >
                    <p className="text-gray-600 text-sm font-medium mb-2">Current Exercise</p>
                    <p className="text-gray-900 font-bold text-lg mb-4">{selectedExercise.name}</p>

                    <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                      <p className="text-blue-900 text-sm font-semibold">
                        Set {currentSet + 1} of {selectedExercise.sets}
                      </p>
                    </div>

                    <Timer onSetComplete={handleCompleteSet} />

                    <div className="flex gap-2 mt-4">
                      <motion.button
                        onClick={handleCompleteSet}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Set Complete
                      </motion.button>

                      <motion.button
                        onClick={handleStopExercise}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Stop
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                onClick={handleFinishWorkout}
                disabled={exercises.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Finish Workout
              </motion.button>
            </div>
          </div>
      </motion.div>

      {showSummary && <WorkoutSummaryModal stats={sessionStats} onClose={() => setShowSummary(false)} />}
    </>
  )
}
