import React, {useState, useEffect} from 'react'
import { motion } from "framer-motion"

import { Clock, Flame, Dumbbell, TriangleAlert, RotateCcw, Play } from "lucide-react"
import {IoIosFitness} from "react-icons/io"
import {format} from "date-fns"
import apiClient from '../../../Api/apiClient'
import {toast as sonnerToast} from 'sonner'

import {estimateCalories} from "../../../Utils/exerciseFunctions"
import PaginationV2 from '../../../Components/PaginationV2/PaginationV2'


export default function RecentWorkouts({refreshHistory, stopRefreshHistory, resumeTodayWorkout}) {

  const [todayWorkouts, setTodayWorkouts] = useState([])
  const [olderWorkouts, setOlderWorkouts] = useState([])

  const [userWeight, setUserWeight] = useState(70)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(20) 
  const limit = 2

  const [loading, setLoading] = useState(false)
  const [refetch, setRefetch] = useState(true)
  const [error, setError] = useState(false)

  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null) 
  const [loadingResume, setLoadingResume] = useState(false)

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  const ShowError = ()=> (
      <div className='flex justify-center items-center gap-[5px] w-full h-full'>
          <TriangleAlert className='mb-[18px] text-primary w-[28px] h-[28px]' />
          <p className='flex flex-col'>
              <span className='flex items-center gap-[7px] text-[14px] text-[#686262] font-medium'>
                  Unable to load
                  <RotateCcw
                      className="w-[20px] h-[20px] text-muted p-1 rounded-full border border-dropdownBorder cursor-pointer 
                          hover:text-black transition-all duration-150 ease-in"
                      onClick={() => setRefetch(true)}
                  />
              </span>
              <span className='text-[12px] text-muted'>Check connection</span>
          </p>
      </div>
  )

  async function listWorkoutHistory(){
    try {   
      const response = await apiClient.get(`${baseApiUrl}/fitness/tracker/workout/list?page=${currentPage}&limit=${limit}`)
      if(response.status === 200){
        setTodayWorkouts(response.data.todayWorkouts)
        setOlderWorkouts(response.data.olderWorkouts)
        setTotalPages(response.data.pagination.totalPages)
        stopRefreshHistory()
      }
    }catch (error) {
      if (!error.response) {
        sonnerToast.error("Network error. Please check your internet.")
      }
      else {
        sonnerToast.error("Something went wrong!")
      }
      stopRefreshHistory()
      setError(true)
    }finally {
        setLoading(false)
        setRefetch(false)
    }
  }

  useEffect(() => {
      if (refetch) {
          setLoading(true)
          listWorkoutHistory()
      }
  }, [refetch])

  useEffect(()=> {
    if(refreshHistory){
      setLoading(true)
      setSelectedWorkoutId(null)
      listWorkoutHistory()
    }
  }, [refreshHistory])

  useEffect(()=> {
      listWorkoutHistory()
  }, [currentPage])

  const handleResumeWorkout = (workout)=> {
    setSelectedWorkoutId(workout._id)
    const resumeFromSet = workout.sets.findIndex(set=> !set.completed)
    resumeTodayWorkout(workout, resumeFromSet)
  }

  function HistoryCard({workout, date = null, allowResumeExercise = false, workoutCompleted}){

    return (
      <motion.div
          key={workout.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-lg p-4 bg-purple-50 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between mb-3">
            <div> 
              {
                date &&
                  <p className="text-gray-900 font-semibold text-sm">{format(new Date(date), "MMMM dd, yyyy" )}</p>
              }
              <div className="flex items-center justify-between gap-14 text-gray-500 text-xs capitalize">
                <span> {workout.name} </span>
                <div className='flex items-center gap-[5px]'> 
                  <p className='w-[4px] h-[4px] bg-muted rounded-full'></p>
                  {workout.bodyPart}
                </div>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.1 }} className="text-purple-600">
              <Flame className='w-[18px] h-[18px]'/>
            </motion.div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-white rounded p-2 text-center border border-gray-200">
              <p className="text-gray-500 mb-1">Duration</p>
              <p className="text-gray-900 font-semibold">{ `${Math.ceil(workout.duration / 60)} min` }</p>
            </div>
            <div className="bg-white rounded p-2 text-center border border-gray-200">
              <div className="flex items-center justify-center gap-1 mb-1">
                <IoIosFitness className='w-[12px] h-[12px]'/>
                <p className="text-gray-500">Sets</p>
              </div>
              <p className="text-gray-900 font-semibold">{workout.sets.length}</p>
            </div>
            <div className="bg-white rounded p-2 text-center border border-gray-200">
              <p className="text-gray-500 mb-1">Calories</p>
              <p className="text-gray-900 font-semibold">
                {(workout?.calories || estimateCalories(workout.bodyPart, workout.equipment, workout.sets, workout.duration, userWeight)) + ' kcal'}
              </p>
            </div>
          </div>

          {
            allowResumeExercise && !workoutCompleted &&
              <motion.div whileTap={{ scale: 0.98 }} className="mt-[10px] ml-[3px] flex items-center justify-between gap-[10px]">
                <button
                  className={`flex items-center gap-[5px] hover:bg-green-400 transition duration-300
                   hover:text-white text-[11px] font-medium tracking-[0.2px] px-[9px] py-[7px] 
                   rounded-[6px] !disabled:cursor-not-allowed 
                   ${selectedWorkoutId === workout._id 
                      ? 'bg-green-400 text-white cursor-not-allowed' 
                      : 'bg-primary text-secondary'
                    }`}
                  onClick={()=> handleResumeWorkout(workout)}>
                     {
                      loadingResume 
                        ? <CustomHashLoader loading={loadingResume}/> 
                        : (
                          <> 
                            {
                              selectedWorkoutId !== workout._id &&
                                <Play className="w-[17px] h-[17px]"/>
                            }
                            <span> 
                              { selectedWorkoutId === workout._id ? 'Resumed' : 'Resume Exercise' }
                            </span>
                          </>
                        )
                     }  
                </button>
                <p className='text-[11px] text-red-500 tracking-[0.3px]'>
                   {`Workout: only completed ${workout.sets.findIndex(set=> !set.completed)}/${workout.sets.length}`} 
                </p>
              </motion.div>

          }
        </motion.div>
    )
  }

  function HistoryWrapper({heading, headerStyle, iconNeeded = true, children}){

    return (
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`${headerStyle && headerStyle} bg-white rounded-xl p-6 border border-gray-200 shadow-sm`}
      >
        <div className="flex items-center gap-2 mb-4">
          {
            iconNeeded && <Clock className='w-[19px] h-[19px] text-muted'/>
          }
          <h3 className="text-gray-900 font-semibold text-lg"> {heading} </h3>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">

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

          { children }
          
        </div>
      </motion.div>
    )
  }


  return (
      <>
          <HistoryWrapper heading="Today's Workouts" iconNeeded={false}>
              {!loading && todayWorkouts && todayWorkouts.length > 0 ? (
                  todayWorkouts.map((workouts) =>
                      workouts.exercises.map((exercise) => (
                          <HistoryCard
                              workout={exercise}
                              allowResumeExercise={true}
                              workoutCompleted={workouts.exerciseCompleted}
                          />
                      )),
                  )
              ) : !loading && !error && (!todayWorkouts || todayWorkouts.length === 0) ? (
                  <p className='my-8 text-[13px] text-muted text-center'> Looks like you havn't worked out today! </p>
              ) : (
                  !loading && error && <ShowError />
              )}
          </HistoryWrapper>

          <HistoryWrapper heading='Workout History' headerStyle='mt-8'>
              {!loading && olderWorkouts && olderWorkouts.length > 0 ? (
                  olderWorkouts.map((workouts) =>
                      workouts.exercises.map((exercise) => <HistoryCard workout={exercise} date={workouts.date} />),
                  )
              ) : !loading && !error && (!olderWorkouts || todayWorkouts.length === 0) ? (
                  <p className='my-8 text-[13px] text-muted text-center'> No workout history to show! </p>
              ) : (
                  !loading && error && <ShowError />
              )}

              {olderWorkouts.length > 0 && totalPages && (
                  <PaginationV2
                      miniVersion={true}
                      headerStyle='!mt-4'
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) => setCurrentPage(page)}
                  />
              )}
          </HistoryWrapper>
      </>
  )
}
