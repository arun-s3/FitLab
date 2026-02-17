import React, {useState, useEffect} from 'react'
import {motion} from 'framer-motion'

import {Package} from "lucide-react"
import apiClient from '../../../Api/apiClient'

import ExerciseDifficultyStars from './ExerciseDifficultyStars'
import ExerciseForceType from './ExerciseForceType'
import {CustomHashLoader} from '../../../Components/Loader/Loader'


export default function ExerciseCard({exercise, index, onChooseExercise}){

    const [thumbnail, setThumbnail] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
      if (!exercise?.name) return
    
      let didCancel = false
    
      async function loadThumbnail() {
        setIsLoading(true)
      
        async function searchImages(query) {
          try {
            const response = await apiClient.get(`/fitness/thumbnail/${query}`)
            return response.data.thumbnail;
          } catch (error) {
            return null
          }
        }
      
        const fetchedUrl = await searchImages(exercise.name)
        if (didCancel) return
      
        if (!fetchedUrl) {
          setThumbnail(exercise.gifUrl)
          setIsLoading(false)
          return
        }
      
        const tester = new Image()
        tester.src = fetchedUrl
      
        const timeoutId = setTimeout(() => {
          if (!didCancel) {
            setThumbnail(exercise.gifUrl)
            setIsLoading(false)
          }
        }, 4000)
      
        tester.onload = () => {
          clearTimeout(timeoutId)
          if (!didCancel) {
            setThumbnail(fetchedUrl)
            setIsLoading(false)
          }
        }
      
        tester.onerror = () => {
          clearTimeout(timeoutId)
          if (!didCancel) {
            setThumbnail(exercise.gifUrl)
            setIsLoading(false)
          }
        }
      }
    
      loadThumbnail()
    
      return () => {
        didCancel = true
      };
    }, [exercise?.name])


    return (
            <motion.div
              key={exercise.exerciseId || exercise.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ scale: 1.005 }}
              className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg
                over:border-purple-300 transition-all duration-300 cursor-pointer"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
                <div className="lg:col-span-1">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`relative ${isLoading && 'flex justify-center items-center'} 
                      ${thumbnail === exercise.gifUrl ? 'h-[13rem]' : 'h-48 lg:h-40'} bg-slate-100 
                      rounded-lg overflow-hidden`}
                  >
                    {
                      isLoading &&
                        <CustomHashLoader loading={isLoading}/> 
                    }
                    {
                      thumbnail && !isLoading && (
                        <img
                          src={thumbnail}
                          className={`${!isLoading && 'w-full object-cover'} 
                            ${thumbnail === exercise.gifUrl ? 'h-[13rem]' : ' h-full'}`}
                          onLoad={()=> setIsLoading(false)}
                        />
                      ) 
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 
                      group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                </div>
                <div className="lg:col-span-3 flex flex-col justify-between">
                  <div className="mb-4">
                    <h4 className="text-xl lg:text-2xl capitalize font-bold text-slate-900 mb-2 group-hover:text-secondary transition-colors"
                      onClick={()=> onChooseExercise({...exercise, thumbnail})}
                    >
                      {exercise.name}
                    </h4>
                    {exercise.instructions &&
                      Array.isArray(exercise.instructions) &&
                      exercise.instructions.length > 0 && (
                        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                          {exercise.instructions[0].replace("Step:1", "Initial Position:")}
                        </p>
                      )}
                  </div>
                  <div className="grid xs-sm2:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      
                    <ExerciseDifficultyStars exercise={exercise}/>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Package size={18} className="text-purple-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Equipment</p>
                        <p className="text-sm font-semibold text-slate-900 capitalize">
                          {exercise.equipments || "Bodyweight"}
                        </p>
                      </div>
                    </div>
                    
                    <ExerciseForceType exercise={exercise}/>

                 </div>
                  {exercise.secondaryMuscles &&
                    Array.isArray(exercise.secondaryMuscles) &&
                    exercise.secondaryMuscles.length > 0 && (
                      <div className="mb-4 pb-4 border-t border-slate-200">
                        <p className="text-xs text-slate-500 mb-2">Secondary Muscles</p>
                        <div className="flex flex-wrap gap-2">
                          {exercise.secondaryMuscles.map((muscle, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-purple-50 text-secondary px-3 py-1 rounded-full capitalize"
                            >
                              {muscle}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={()=> onChooseExercise({...exercise, thumbnail})}
                      className="max-w-40 lg:w-auto bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold
                        hover:bg-purple-700 transition-colors"
                    >
                      View Details
                    </motion.button>
                </div>
              </div>
            </motion.div>
    )
}