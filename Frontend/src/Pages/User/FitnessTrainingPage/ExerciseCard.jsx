import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {motion} from 'framer-motion'

import { Zap, Package } from "lucide-react"
import axios from 'axios'

import ExerciseDifficultyStars from './ExerciseDifficultyStars'



export default function ExerciseCard({exercise, index}){

    const [thumbnails, setThumbnails] = useState({})

    const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY
    const googleSeId = import.meta.env.VITE_GOOGLE_SE_ID 
  
    useEffect(()=> {
      async function searchImages(query){
        try {
          const res = await axios.get("https://www.googleapis.com/customsearch/v1", {
            params: {
              key: googleApiKey,
              cx: googleSeId,
              searchType: "image",
              q: query + 'JEFIT',
            },
          })
        
          console.log("res.data.items----->", res.data.items)
          console.log("res.data.items[0].link----->", res.data.items[0].link)
          const validThumbnail = res.data.items.find(item=> item?.link)
          if(exercise.name === 'cable standing up straight crossovers'){
            console.log("res.data.items of cable standing up straight crossovers----->", res.data.items)
          }
          return validThumbnail?.link || './fitness_placeholder.jpg'
        } catch (err) {
          console.error("Google Image Search Error:", err.response?.data || err)
          return './fitness_placeholder.jpg'
        }
      }

      const putThumbnails = async()=> {
        if(exercise && exercise?.name){
          const thumbnailLink = await searchImages(exercise.name)
          setThumbnails(thumbnails=> ({...thumbnails, [exercise.name]: thumbnailLink || './fitness_placeholder.jpg'}))
        }
      }

      putThumbnails()
    }, [exercise])

    useEffect(()=> {
      console.log("thumbnails----->", thumbnails)
    }, [thumbnails])


    return (
            <motion.div
              key={exercise.exerciseId || exercise.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ scale: 1.02 }}
              className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-purple-300 transition-all duration-300 cursor-pointer"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
                <div className="md:col-span-1">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative h-48 md:h-40 bg-slate-100 rounded-lg overflow-hidden"
                  >
                    {thumbnails?.[ exercise.name] ? (
                      <img
                        src={thumbnails[exercise.name] || "/placeholder.svg"}
                        alt={exercise.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        No GIF
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                </div>
                <div className="md:col-span-3 flex flex-col justify-between">
                  <div className="mb-4">
                    <h4 className="text-xl md:text-2xl capitalize font-bold text-slate-900 mb-2 group-hover:text-secondary transition-colors">
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      
                    <ExerciseDifficultyStars exercise={exercise}/>

                    {/* Equipment */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Package size={18} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Equipment</p>
                        <p className="text-sm font-semibold text-slate-900 capitalize">
                          {exercise.equipments || "Bodyweight"}
                        </p>
                      </div>
                    </div>
                    {/* Force Type */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Zap size={18} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Type</p>
                        <p className="text-sm font-semibold text-slate-900 capitalize">
                          {exercise.force || "Mixed"}
                        </p>
                      </div>
                    </div>
                    {/* Category */}
                    {
                      exercise?.category &&
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Category</p>
                          <span className="inline-block text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full capitalize">
                            {exercise.category || "Strength"}
                          </span>
                        </div>
                    }
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
                  <Link
                    // href={`/video/${exercise.id || exercise.name.replace(/\s+/g, "-")}?muscle=${selectedMuscle}`}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full md:w-auto bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                    >
                      View Details
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
    )
}