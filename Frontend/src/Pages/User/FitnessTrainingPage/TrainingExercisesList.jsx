import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {motion, AnimatePresence} from 'framer-motion'

import axios from 'axios'

import ExerciseCard from './ExerciseCard'
import {capitalizeFirstLetter} from '../../../Utils/helperFunctions'

import PaginationV2 from '../../../Components/PaginationV2/PaginationV2'


export default function TrainingExercisesList({selectedBodyParts, exercises, isLoading, error, currentPage, totalPages, onSelectExercise,
  onPageChange, onfetchMusclesAndEquipments, children}){

  const exerciseAPiUrl = import.meta.env.VITE_EXERCISEDB_URL

  useEffect(()=> {
    async function loadMusclesAndEquipments(){
      try {
        let items = {muscles: [], equipments: []}
        console.log("Inside loadMusclesAndEquipments()...")
        const [musclesResponse, equipmentsResponse] = await Promise.allSettled([
          await axios.get(`${exerciseAPiUrl}/muscles`),
          await axios.get(`${exerciseAPiUrl}/equipments`),
        ])
        
        console.log("musclesResponse------->", musclesResponse)
        if (musclesResponse.status === 'fulfilled'){
          const muscles = musclesResponse.value.data.data.map(data=> data.name)
          items.muscles = muscles
        }
        if (equipmentsResponse.status === 'fulfilled'){
          const equipments = equipmentsResponse.value.data.data.map(data=> data.name)
          items.equipments = equipments
        }
        console.log("items---->", items)
        onfetchMusclesAndEquipments(items)
      }catch (error) {
      	console.error("Error while loading muscles and equipments", error.message)
      }
    }
    loadMusclesAndEquipments()
  }, [exercises])

  useEffect(()=> {
    console.log(`totalPages------>${totalPages} and currentPage------>${currentPage}`)
  }, [currentPage, totalPages])


  return (
    
    <section className="px-12">
          

      <AnimatePresence mode="wait">
          {(
            (selectedBodyParts && selectedBodyParts.length > 0) || (exercises && exercises.length > 0)
           ) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              key={selectedBodyParts[0] || "exercises-list"}
            >
              <div className="mb-10 flex flex-col x-lg:flex-row gap-8 items-center justify-between">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                    {
                      selectedBodyParts.length === 1 
                        ? `${capitalizeFirstLetter(selectedBodyParts[0])} Exercises`
                        : 'Exercises'
                    } 
                  </h3>
                  <div className="w-12 h-1 bg-secondary rounded-full" />
                </div>    
                
                  {children}


              </div>

              {error && !isDemo && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8"
                >
                  <p className="font-semibold">Error loading exercises</p>
                  <p className="text-sm mt-1">{error}</p>
                </motion.div>
              )}

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-12 h-12 border-4 border-slate-200 border-t-secondary rounded-full"
                  />
                </motion.div>
              )}

              {!isLoading && exercises.length > 0 && (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1 }}
                >

                  {
                    exercises && exercises.length > 0 && exercises.map((exercise, index) => (

                      <ExerciseCard 
                        exercise={exercise} 
                        index={index} 
                        onChooseExercise={onSelectExercise}
                      />

                  ))}

                </motion.div>
              )}

              {!isLoading && !error && exercises.length === 0 && exercises.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <p className="text-lg text-slate-500">No exercises found for "{searchQuery}"</p>
                </motion.div>
              )}

              {!isLoading && !error && exercises.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <p className="text-lg text-slate-500">No exercises found!</p>
                </motion.div>
              )}

              {
                totalPages &&
                  <PaginationV2 currentPage={currentPage} totalPages={totalPages} onPageChange={(page)=> onPageChange(page)} />
              }

            </motion.div>
            
          )}
        </AnimatePresence>

        {selectedBodyParts.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <p className="text-lg text-slate-500">Select a body part above to explore exercises</p>
          </motion.div>
        )}

    </section>
    
  )
}





