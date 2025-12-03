import React, {useState, useEffect} from 'react'
import { motion } from "framer-motion"

import {Clock, Flame, Dumbbell} from 'lucide-react'
import {IoIosFitness} from "react-icons/io"
import {format} from "date-fns"
import axios from 'axios'

import {estimateCalories} from "../../../Utils/exerciseFunctions"


export default function RecentWorkouts({refreshHistory, stopRefreshHistory}) {

  const [todayWorkouts, setTodayWorkouts] = useState([])
  const [olderWorkouts, setOlderWorkouts] = useState([])

  const [userWeight, setUserWeight] = useState(70)

  const [loading, setLoading] = useState(false)

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  async function listWorkoutHistory(){
    try {   
      console.log("Inside listWorkoutHistory()..")
      const response = await axios.get(`${baseApiUrl}/fitness/tracker/workout/list`, { withCredentials: true })
      if(response.status === 200){
        console.log("response.data.todayWorkouts--->", response.data.todayWorkouts)
        console.log("response.data.olderWorkouts--->", response.data.olderWorkouts)
        setTodayWorkouts(response.data.todayWorkouts)
        setOlderWorkouts(response.data.olderWorkouts)
        stopRefreshHistory()
        setLoading(false)
      }
    }catch (error) {
      console.error("Error listing workoutInfo", error.message)
      stopRefreshHistory()
      setLoading(false)
    }
  }

  useEffect(()=> {
    setLoading(true)
    listWorkoutHistory()
  }, [])

  useEffect(()=> {
    if(refreshHistory){
      setLoading(true)
      listWorkoutHistory()
    }
  }, [refreshHistory])

  function HistoryCard({workout, date = null}){

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
                {estimateCalories(workout.bodyPart, workout.equipment, workout.sets, workout.duration, userWeight) + ' kcal'}
              </p>
            </div>
          </div>
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
        
        {!loading && todayWorkouts && todayWorkouts.length > 0 && todayWorkouts.map((workouts) => (
            workouts.exercises.map(exercise=> (
              <HistoryCard workout={exercise} />
            ))
        ))}

      </HistoryWrapper>

      <HistoryWrapper heading="Older Workouts" headerStyle="mt-8">
        
        {!loading && olderWorkouts && olderWorkouts.length > 0 && olderWorkouts.map((workouts) => (
            workouts.exercises.map(exercise=> (
              <HistoryCard workout={exercise} date={workouts.date}/>
            ))
        ))}

      </HistoryWrapper>

    </>
  )
}
