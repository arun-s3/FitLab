import React, {useEffect} from 'react'
import {motion, AnimatePresence} from 'framer-motion'

import apiClient from '../../../Api/apiClient'
import {TriangleAlert, RotateCcw} from 'lucide-react'

import ExerciseCard from './ExerciseCard'
import {capitalizeFirstLetter} from '../../../Utils/helperFunctions'

import PaginationV2 from '../../../Components/PaginationV2/PaginationV2'
import TermsDisclaimer from "../../../Components/TermsDisclaimer/TermsDisclaimer"


export default function TrainingExercisesList({selectedBodyParts, searchQuery, exercises, isLoading, fetchError, currentPage, totalPages, 
    refetchExercises, onSelectExercise, onPageChange, onfetchMusclesAndEquipments, children}){

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  useEffect(()=> {
    async function loadMusclesAndEquipments(){
      try {
        let items = {muscles: [], equipments: []}
        const [musclesResponse, equipmentsResponse] = await Promise.allSettled([
            await apiClient.get(`${baseApiUrl}/fitness/exercises/muscles`),
            await apiClient.get(`${baseApiUrl}/fitness/exercises/equipments`),
        ])
        
        if (musclesResponse.status === 'fulfilled'){
          const muscles = musclesResponse.value.data.data.map(data=> data.name)
          items.muscles = muscles
        }
        if (equipmentsResponse.status === 'fulfilled'){
          const equipments = equipmentsResponse.value.data.data.map(data=> data.name)
          items.equipments = equipments
        }
        onfetchMusclesAndEquipments(items)
      }catch (error) {
        if (!error.response) {
          sonnerToast.error("Network error. Please check your internet.")
        }
        console.error(error)
      }
    }
    loadMusclesAndEquipments()
  }, [exercises])


  return (
      <section className={`px-12 ${fetchError && 'flex justify-center items-center'}`}>
          <AnimatePresence mode='wait'>

              {fetchError && (
                  <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className='flex justify-center items-center gap-[5px] w-[35%] min-w-[15rem] bg-red-50 border border-red-200
                        text-red-700 p-4 rounded-lg mb-8'>
                      <TriangleAlert className='mb-[18px] text-primary w-[32px] h-[32px]' />
                      <p className='flex flex-col'>
                          <span className='flex items-center gap-[7px] text-[17px] text-[#686262] font-medium'>
                              Unable to load
                              <RotateCcw
                                  className='w-[20px] h-[20px] text-muted p-1 rounded-full border border-dropdownBorder cursor-pointer 
                                              hover:text-black transition-all duration-150 ease-in'
                                  onClick={() => refetchExercises()}
                              />
                          </span>
                          <span className='text-[13px] text-muted'>Check connection</span>
                      </p>
                  </motion.div>
              )}

              {((selectedBodyParts && selectedBodyParts.length > 0) || (exercises && exercises.length > 0)) && !fetchError && (
                  <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.5 }}
                      key={selectedBodyParts[0] || "exercises-list"}>
                      <div className='mb-10 flex flex-col x-lg:flex-row gap-8 items-center justify-between'>
                          <div>
                              <h3 className='text-3xl md:text-4xl font-bold text-slate-900 mb-2'>
                                  {selectedBodyParts.length === 1
                                      ? `${capitalizeFirstLetter(selectedBodyParts[0])} Exercises`
                                      : "Exercises"}
                              </h3>
                              <div className='w-12 h-1 bg-secondary rounded-full' />
                          </div>

                          {children}
                      </div>

                      {isLoading && (
                          <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className='flex justify-center py-12'>
                              <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                  className='w-12 h-12 border-4 border-slate-200 border-t-secondary rounded-full'
                              />
                          </motion.div>
                      )}

                      {!isLoading && exercises.length > 0 && (
                          <motion.div
                              className='space-y-6'
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ staggerChildren: 0.1 }}>
                              {exercises &&
                                  exercises.length > 0 &&
                                  exercises.map((exercise, index) => (
                                      <ExerciseCard
                                          exercise={exercise}
                                          index={index}
                                          onChooseExercise={onSelectExercise}
                                      />
                                  ))}
                          </motion.div>
                      )}

                      {!isLoading && exercises.length === 0 && exercises.length > 0 && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-center py-12'>
                              <p className='text-lg text-slate-500'>No exercises found for "{searchQuery}"</p>
                          </motion.div>
                      )}

                      {!isLoading && exercises.length === 0 && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-center py-12'>
                              <p className='text-lg text-slate-500'>No exercises found!</p>
                          </motion.div>
                      )}

                      <TermsDisclaimer style='mt-6 !text-right' startWith='By using this fitness training service' />

                      {totalPages && (
                          <PaginationV2
                              currentPage={currentPage}
                              totalPages={totalPages}
                              onPageChange={(page) => onPageChange(page)}
                          />
                      )}
                  </motion.div>
              )}
          </AnimatePresence>

          {selectedBodyParts.length === 0 && !searchQuery && !isLoading && !fetchError && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-center py-16'>
                  <p className='text-lg text-slate-500'>Select a body part above to explore exercises</p>
              </motion.div>
          )}
      </section>
  )
}





