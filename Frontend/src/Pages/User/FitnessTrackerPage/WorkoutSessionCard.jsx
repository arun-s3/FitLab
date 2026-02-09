import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

import axios from 'axios'
import {toast as sonnerToast} from 'sonner'
import {Trash} from "lucide-react"
import {IoIosFitness} from "react-icons/io"
import {IoBarbellSharp} from "react-icons/io5"
import {IoBody} from "react-icons/io5"
import {FiEdit3} from "react-icons/fi"
import {Play, TvMinimal} from 'lucide-react'

import Timer from "./Timer"
import ExerciseForm from "./ExerciseForm"
import WorkoutSummaryModal from "./WorkoutSummaryModal"
import RecentWorkouts from "./RecentWorkouts"
import WorkoutAiInsights from "./AiModules/WorkoutAiInsights"
import DeleteConfirmationModal from "./DeleteConfirmationModal"
import {estimateCalories} from "../../../Utils/exerciseFunctions"
import PaginationV2 from '../../../Components/PaginationV2/PaginationV2'
import useTermsConsent from "../../../Hooks/useTermsConsent"
import TermsDisclaimer from "../../../Components/TermsDisclaimer/TermsDisclaimer"


export default function WorkoutSessionCard() {

  const [exercises, setExercises] = useState([])
  const [selectedExerciseId, setSelectedExerciseId] = useState(null)
  const [selectedExercise, setSelectedExercise] = useState(null)

  const [startTime, setStartTime] = useState(null)
  const [currentSet, setCurrentSet] = useState(0)
  const [restartTimer, setRestartTimer] = useState(false)
  const [startTimerFrom, setStartTimerFrom] = useState(0)
  
  const [sessionStats, setSessionStats] = useState(null)
  
  const [showSummary, setShowSummary] = useState(false)

  const [editingExercise, setEditingExercise] = useState(null)

  const [refreshHistory, setRefreshHistory] = useState(false)

  const [openExerciseDeleteModal, setOpenExerciseDeleteModal] = useState({exercise: null})

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(20) 
  const limit = 3

  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState(null)

  const {acceptTermsOnFirstAction} = useTermsConsent()

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  const getExercises = async()=> {
    console.log("Inside getExercises...") 
    try { 
      const response = await axios.get(`${baseApiUrl}/fitness/tracker/exercise-library/list?page=${currentPage}&limit=${limit}`, { withCredentials: true })
      if(response.status === 200){
        console.log("response.data.exercises----------->", response.data.exercises)
        setExercises(response.data.exercises)
        setTotalPages(response.data.totalPages)
      }
    }catch (error) {
        console.error("Error during fetching exercise", error.message)
        if (error.response?.status === 404) {
          setExercises([])
          sonnerToast.error(error.response.data?.message)
        } 
        else if (!error.response) {
          sonnerToast.error("Network error. Please check your internet.")
          console.log('Settig fetch error...')
          setFetchError("Network error. Please check your internet.")
        }
        else {
          sonnerToast.error("Something went wrong! Please retry later.")
          console.log("Settig fetch error...")
          setFetchError("Something went wrong! Please retry later.")
        }
    }finally {
        setLoading(false)
    }
  }

  useEffect(()=> {
    setLoading(true)
    getExercises()
  }, [])

  const navigateToExerciseGuide = (exerciseName) => {
    const stateValue = {exerciseName}
    const encodedExerciseName = encodeURIComponent(JSON.stringify(stateValue))
    const url = `/fitness/training?name=${encodedExerciseName}`

    window.open(url, "_blank", "noopener,noreferrer")
  }


  const handleExerciseListUpdate = async() => {
    setLoading(true)
    getExercises()
  }

  const handleDeleteExercise = async(exerciseTemplateId)=> { 
    try { 
      const response = await axios.delete(`${baseApiUrl}/fitness/tracker/exercise-library/delete/${exerciseTemplateId}`,{ withCredentials: true })
      if(response.status === 200){
        console.log("response.data.exercises----------->", response.data.exercises)
        sonnerToast.success('Exercise deleted successfully!')
        getExercises()
      }
      if(response.status === 400 || response.status === 404){
        sonnerToast.error(error.response.data.message)
        console.log("Error---->", error.response.data.message)
      }
    }catch (error) {
      console.error("Error during deleting exercise", error.message)
      if (!error.response) {
        sonnerToast.error("Network error. Please check your internet.")
      }
      else {
        sonnerToast.error("Something went wrong! Please retry later.")
      }
    }
  }

  const handleSelectExercise = (id) => {
    acceptTermsOnFirstAction()
    setSelectedExerciseId(id)
    const selectedExercise = exercises ? exercises.find((e) => e._id === id) : null
    setSelectedExercise(selectedExercise)
    setStartTime(Date.now())
    setCurrentSet(0)
  }

  const handleCompleteSet = () => {
    if (selectedExercise && currentSet < selectedExercise.sets.length) {
      setCurrentSet(currentSet + 1)
    } else {
      setSelectedExerciseId(null)
      setCurrentSet(0)
    }
  }

  const handleRestartExercise = () => {
    console.log("Inside handleRestartExercise()")
    setStartTime(Date.now())
    setCurrentSet(0)
    setRestartTimer(true)
  }

  const handleResumeTodayWorkout = (workout, resumeFromSet)=> {
    console.log("Inside handleResumeTodayWorkout()..resumeFromSet--->", resumeFromSet)
    acceptTermsOnFirstAction()
    setSelectedExerciseId(workout._id)
    setSelectedExercise(workout)
    setStartTime(Date.now())
    setCurrentSet(resumeFromSet)
    setStartTimerFrom(workout.duration)
  }

  const saveWorkoutInfos = async(workoutInfo)=> {
    try {   
      console.log("Inside saveWorkoutInfos()..")
      const response = await axios.post(`${baseApiUrl}/fitness/tracker/workout/add`, {workoutInfo}, { withCredentials: true })
      if(response.status === 200){
        console.log("Saved workout details")
        console.log("response.data.tracker------->", response.data.tracker)
        return {trackerId: response.data.tracker._id, exerciseId: response.data.exercise._id}
      }
    }catch (error) {
      console.error("Error during saving workoutInfo", error.message)
      sonnerToast.error('Something went wrong! Please retry later.')
      if (error.response?.status === 400 || error.response?.status === 404) {
        sonnerToast.error("Some error occured while saving the wokout details")
      } 
      else if (!error.response) {
        sonnerToast.error("Network error. Please check your internet.")
      }
      else {
        sonnerToast.error("Something went wrong! Please retry later.")
      }
    }finally {
        setRefreshHistory(true)
    }
  }

  const handleFinishWorkout = async() => {
    acceptTermsOnFirstAction()
    console.log("Inside handleFinishWorkout")
    const missedSets = []
    for (let i = currentSet; i < selectedExercise.sets.length; i++) {
      missedSets.push({
        exerciseName: selectedExercise.name,
        set: i + 1,
        totalSets: selectedExercise.sets.length,
      })
    }
    console.log("missedSets---->", missedSets)
    let duration = Math.floor((Date.now() - startTime) / 1000)
    if(startTimerFrom){
      duration = Math.floor(duration + Number(startTimerFrom))
    }  
    console.log("duration---->", duration)

    const totalVolume = selectedExercise.sets.reduce((acc, set) => acc + set.weight * set.reps, 0)

    const {bodyPart, equipment, sets} = selectedExercise
    const estimatedCalories = estimateCalories(bodyPart, equipment, sets, duration)

    const completedTillIndex = currentSet < selectedExercise.sets.length ? currentSet : null
    console.log("completedTillIndex---->", completedTillIndex)
    const workoutInfo = {exerciseId: selectedExercise._id, selectedExercise, sets, completedTillIndex, duration}

    const {trackerId, exerciseId} = await saveWorkoutInfos(workoutInfo)

    console.log(`trackerId---->${trackerId} and exerciseId---->${exerciseId}`)

    // const estimatedCalories = Math.round((duration / 60) * 8 + totalVolume * 0.1)

    setSessionStats({
      duration,
      totalVolume,
      estimatedCalories,
      exerciseCount: exercises.length,
      totalReps: selectedExercise.sets.reduce((acc, set) => acc + set.reps, 0),
      missedSets,
      exercise: selectedExercise,
      trackerId,
      exerciseId
    })

    setShowSummary(true)

    setSelectedExerciseId(null)
    setSelectedExercise(null)
    setCurrentSet(0)
  }

  
  return (
    <>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">

              <ExerciseForm 
                onAddOrUpdateExercise={handleExerciseListUpdate} 
                editExerciseData={editingExercise}
                onExerciseUpdation={()=> setEditingExercise(null)}
              />

            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900 font-semibold text-lg"> My Exercise Library </h3>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">

                  {
                    loading && 
                    (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-12">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="w-12 h-12 border-4 border-slate-200 border-t-secondary rounded-full"
                        />
                      </motion.div>
                    )
                  }
                  
                  {!loading && !fetchError && exercises?.length === 0 ? (
                    <p className="text-gray-400 text-center py-6">No exercises added yet</p>
                  ) : !loading && fetchError ? (
                    <p className="my-12 text-center text-red-500 text-[13px] traxking-[0.3px]"> {fetchError} </p>
                  ) : (
                    !loading && !fetchError && exercises && exercises.map((exercise) => (
                      <motion.div
                        key={exercise._id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className={`rounded-lg p-4 border-2 cursor-pointer transition-all ${
                          selectedExerciseId === exercise._id
                            ? "bg-purple-50 border-purple-500"
                            : "bg-gray-50 border-gray-200 hover:border-gray-300" 
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1"> 
                            <p className="flex items-center gap-[5px]">
                              <IoBarbellSharp className="w-[20px] h-[20px] text-primaryDark"/>
                              <span className="text-secondary text-[14px] font-medium capitalize"> {exercise.name} </span>
                            </p>
                            <ul className="list-disc ml-8">
                            {
                              exercise.sets.map((set, index)=> (
                                <li className="text-gray-600 text-[13px] mt-[5px]">
                                  {`Set-${index + 1}: ${set.reps} reps  with ${set.weight}kg (${set.rpe}/10 RPE)`}
                                </li>
                              ))
                            }
                            </ul>
                            {exercise.notes && <p className="ml-4 text-gray-500 capitalize text-xs tracking-[0.3px] mt-1">{exercise.notes}</p>}
                            <div className="ml-8 mt-1 flex items-center gap-8">
                              {
                                exercise.equipment &&
                                  <p className="flex items-center gap-[5px]">
                                    <IoIosFitness className="w-[16px] h-[16px] text-[#b87be3]"/>
                                    <span className="text-muted text-[13px] capitalize"> {exercise.equipment} </span>
                                  </p>
                              }
                              {
                                exercise.bodyPart &&
                                  <p className="flex items-center gap-[5px]">
                                    <IoBody className="w-[13px] h-[13px] text-[#b87be3]"/>
                                    <span className="text-muted text-[13px] capitalize"> {exercise.bodyPart} </span>
                                  </p>
                              }
                            </div>
                          </div> 
                          <div className="h-full flex flex-col gap-4">
                            <motion.button
                              onClick={(e) => {
                                if(selectedExerciseId !== exercise._id){
                                  e.stopPropagation()
                                  setOpenExerciseDeleteModal({exercise})
                                }
                              }}
                              className={`text-red-500 hover:text-red-600 ml-2 
                                ${selectedExerciseId === exercise._id && 'cursor-not-allowed'}`}
                              whileHover={{ scale: 1.1 }}
                            >
                              <Trash className="w-[15px] h-[15px]"/>
                            </motion.button>
                            <motion.button
                              onClick={(e) => {
                                if(selectedExerciseId !== exercise._id){
                                  e.stopPropagation()
                                  setEditingExercise(exercise)
                                }
                              }}
                              className={`text-muted hover:text-gray-600 ml-2
                                ${selectedExerciseId === exercise._id && 'cursor-not-allowed'}`}
                              whileHover={{ scale: 1.1 }}
                            >
                              <FiEdit3 className="w-[15px] h-[15px]"/>
                            </motion.button>
                          </div>
                        </div>
                        
                        <div className="w-full flex items-center justify-between">
                          <motion.div whileTap={{ scale: 0.98 }} className="mt-[10px] ml-[3px]">
                              <button
                                className={`flex items-center gap-[5px] hover:bg-green-400 transition duration-300
                                 hover:text-white text-[11px] font-medium tracking-[0.2px] px-[9px] py-[7px] 
                                 rounded-[6px] !disabled:cursor-not-allowed 
                                 ${selectedExerciseId === exercise._id 
                                    ? 'bg-green-400 text-white cursor-not-allowed' 
                                    : 'bg-primary text-secondary'
                                  }`}
                                onClick={()=> handleSelectExercise(exercise._id)}
                                >
                                   {
                                    loading 
                                      ? <CustomHashLoader loading={loading}/> 
                                      : (
                                        <>
                                          {
                                            selectedExerciseId !== exercise._id &&
                                              <Play className="w-[17px] h-[17px]"/>
                                          }
                                          <span> 
                                            { selectedExerciseId === exercise._id ? 'Started' : 'Start Exercise' }
                                          </span>
                                        </>
                                      )
                                   }  
                              </button>
                          </motion.div>
                          <motion.div whileTap={{ scale: 0.98 }} className="mt-[10px] ml-[3px]">
                              <button
                                className={`flex items-center gap-[5px] bg-primary text-secondary hover:bg-green-400 
                                 hover:text-white text-[11px] font-medium tracking-[0.2px] px-[9px] py-[7px] 
                                 rounded-[6px] transition duration-300 !disabled:cursor-not-allowed 
                                 ${selectedExerciseId === exercise._id && 'hidden'}`}
                                onClick={()=> navigateToExerciseGuide(exercise.name)}
                                >
                                  <TvMinimal className="w-[17px] h-[17px]"/>
                                  <span> View Guide </span>
                              </button>
                          </motion.div>
                        </div>

                      </motion.div>
                    )
                  )
                  )}
                </div>

                {
                exercises.length > 0 && totalPages &&
                  <PaginationV2 
                    miniVersion={true}
                    headerStyle='!mt-4'
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={(page)=> {
                      setCurrentPage(page)
                      setTimeout(()=> getExercises(), 700)
                    }} 
                  />
                }

              </motion.div>

              <TermsDisclaimer startWith="By using fitness tracker" style='!mt-4'/>

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
                    <p className="text-gray-900 font-bold text-lg mb-4 capitalize">{selectedExercise.name}</p>

                    <div className="bg-purple-50 rounded-lg p-4 mb-4 border border-purple-200">
                      <p className="text-purple-900 text-sm font-semibold">
                        Set {currentSet + 1} of {selectedExercise.sets.length}
                      </p>
                    </div>

                    <Timer 
                      onSetComplete={handleCompleteSet} 
                      restartTimer={restartTimer} 
                      afterRestart={()=> setRestartTimer(false)}
                      startTimerFrom={startTimerFrom} 
                    />

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
                        onClick={handleRestartExercise}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Restart
                      </motion.button>
                    </div>
                    <motion.button
                      onClick={handleFinishWorkout}
                      disabled={exercises && exercises?.length === 0}
                      className="mt-4 w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Finish Workout
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              <RecentWorkouts 
                refreshHistory={refreshHistory} 
                stopRefreshHistory={()=> setRefreshHistory(false)}
                resumeTodayWorkout={handleResumeTodayWorkout}
              />

            </div>
          </div>
          
          <div className="mt-12">

            <WorkoutAiInsights />

          </div>
                
      </motion.div>
                    
      {
        showSummary && 
          <WorkoutSummaryModal 
            stats={sessionStats} 
            recalculateCalories={(userWeight)=> {
              const {bodyPart, equipment, sets} = sessionStats.exercise
              return estimateCalories(bodyPart, equipment, sets, sessionStats.duration, userWeight)
            }}
            onClose={()=> setShowSummary(false)} 
          />
      }
      {
        openExerciseDeleteModal && openExerciseDeleteModal.exercise &&
          <DeleteConfirmationModal 
            exercise={openExerciseDeleteModal.exercise}
            isOpen={openExerciseDeleteModal.exercise}
            onCancel={()=> setOpenExerciseDeleteModal({exercise: null})}
            onConfirm={()=> {
              handleDeleteExercise(openExerciseDeleteModal.exercise._id)
              setOpenExerciseDeleteModal({exercise: null})
            }}
          />
      }
    </>
  )
}
