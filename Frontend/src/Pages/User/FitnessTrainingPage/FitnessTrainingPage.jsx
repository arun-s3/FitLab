import React, {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'

import apiClient from '../../../Api/apiClient'
import {toast as sonnerToast} from 'sonner'

import Header from '../../../Components/Header/Header'
import TextChatBox from '../TextChatBox/TextChatBox'
import CoachPlus from '../Coach+/Coach+'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import FitnessCarousal from './FitnessCarousal'
import MuscleSelector from './MuscleSelector'
import TrainingExercisesList from './TrainingExercisesList'
import ExerciseDetails from './ExerciseDetails'
import FilterPanel from './FilterPanel'
import FeaturesDisplay from '../../../Components/FeaturesDisplay/FeaturesDisplay'
import Footer from '../../../Components/Footer/Footer'


export default function FitnessTrainingPage(){

  const [bodyParts, setBodyParts] = useState(null)
  const [bodyPartsLoading, setBodyPartsLoading] = useState(false)
  const [selectedBodyParts, setSelectedBodyParts] = useState([])
  const [selectedMuscles, setSelectedMuscles] = useState([])
  const [selectedEquipments, setSelectedEquipments] = useState([])
  
  const [searchQuery, setSearchQuery] = useState('')

  const [availableEquipments, setAvailableEquipments] = useState([])
  const [availableMuscles, setAvailableMuscles] = useState([])

  const [sort, setSort] = useState({by: '', order: ''})

  const [exercises, setExercises] = useState([])
  const [firstExerciseIndex, setFirstExerciseIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const [selectedExercise, setSelectedExercise] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1) 
  const exercisesPerPage = 3

  const [openCoach, setopenCoach] = useState(true)

  async function loadBodyParts() {
      try {
          setBodyPartsLoading(true)
          const response = await apiClient.get(`/fitness/exercises/bodyparts`)
          if (response.data.success) {
              setBodyParts(response.data.data.map((data) => data.name))
          }
      } catch (error) {
          setError(true)
          if (!error.response) {
              sonnerToast.error("Network error. Please check your internet.")
          }else {
              sonnerToast.error("Something went wrong! Internal server error.")
          }
      } finally {
          setBodyPartsLoading(false)
      }
  }

  useEffect(()=> {
    loadBodyParts()
  }, [])

  const fetchExercises = async(options)=> { 
    try {
        if(options?.searchQueryRemoved && selectedBodyParts?.length === 0){
          setExercises([])
          return
        }     

        const queryDetails = {
          offset: firstExerciseIndex, 
          limit: exercisesPerPage, 
          muscles: selectedMuscles.length > 0 ? selectedMuscles.join(",") : undefined,  
          bodyParts: selectedBodyParts.length > 0 ? selectedBodyParts.join(",") : undefined,    
          equipment: selectedEquipments.length > 0 ? selectedEquipments.join(",") : undefined,   
        
          search: options?.searchQueryRemoved ? undefined : searchQuery || undefined,
        
          sortBy: sort.by ? sort.by : undefined,
          sortOrder: sort.order ? sort.order : undefined,
        }

        const response = await apiClient.post(`/fitness/exercises/list`, {queryDetails})

        if(response.data.data.success){
          const totalPagesRequired = Math.ceil(response.data.data.metadata.totalExercises / exercisesPerPage)
          setTotalPages(totalPagesRequired)
          return response.data.data.data
        }
      }catch (error) {
        setError(true)
         if (!error.response) {
             sonnerToast.error("Network error. Please check your internet.")
         } else if (error.response?.status === 429) {
             sonnerToast.error(error.response.data?.message || "Too many requests. Please try again later.")
         } else {
             sonnerToast.error("Something went wrong while loading exercises! Please retry later.")
         }
      } finally {
        setLoading(false)
      }
  }
  
  const loadExercises = async (options) => {
    setLoading(true)
    setError(false)

    const result = await fetchExercises(options)
    setExercises(result || [])
  }

  useEffect(() => {
    if (searchQuery) {
      loadExercises()
    }
  }, [searchQuery])
  
  useEffect(() => {
    if (selectedEquipments.length > 0 || selectedMuscles.length > 0 || sort.by.trim() !== '' || sort.order.trim() !== '') {
      loadExercises()
    }
  }, [selectedEquipments, selectedMuscles, sort.by, sort.order])

  useEffect(() => {
    if ((!selectedBodyParts || selectedBodyParts.length === 0) && !searchQuery) {
      setExercises([])
      setError(false)
      return
    }
    loadExercises()
  }, [selectedBodyParts, firstExerciseIndex])

  useEffect(()=> {
    if(currentPage){
      setFirstExerciseIndex((currentPage - 1) * exercisesPerPage)
    }
  }, [currentPage])

  const saveMusclesAndEquipments = (items)=>{
    setAvailableMuscles(items.muscles || [])
    setAvailableEquipments(items.equipments || [])
  }

  const headerBg = {
     backgroundImage: "url('/Images/header-bg.png')",
     backgrounSize: 'cover'
  }


  return (
      <section id='FitnessTrainingPage'>
          <header style={headerBg} className='h-[5rem]'>
              <Header currentPageCoachStatus={true} />
          </header>

          <BreadcrumbBar heading='Fitness Training' />

          <main className='bg-gradient-to-br from-white via-blue-50 to-gray-100'>
              <div className='px-[1rem] py-[3rem] bg-white'>
                  <div className='min-h-screen text-slate-900'>
                      {!selectedExercise ? (
                          <>
                              <FitnessCarousal />

                              <div className='mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 md:py-0'>
                                  \{" "}
                                  <MuscleSelector
                                      bodyParts={bodyParts}
                                      searchedBodyPart={searchQuery}
                                      setSearchedBodyPart={setSearchQuery}
                                      onSearchBodyPart={setSelectedBodyParts}
                                      selectedBodyParts={selectedBodyParts}
                                      listExercises={loadExercises}
                                      isLoading={loading}
                                      bodyPartsLoading={bodyPartsLoading}
                                  />
                              </div>

                              <TrainingExercisesList
                                  selectedBodyParts={selectedBodyParts}
                                  searchQuery={searchQuery}
                                  exercises={exercises}
                                  onfetchMusclesAndEquipments={saveMusclesAndEquipments}
                                  currentPage={currentPage}
                                  totalPages={totalPages}
                                  onSelectExercise={setSelectedExercise}
                                  onPageChange={setCurrentPage}
                                  isLoading={loading}
                                  fetchError={error} 
                                  refetchExercises={() => {
                                    loadExercises()
                                    loadBodyParts()
                                  }}
                                >
                                  <FilterPanel
                                      selectedMuscles={selectedMuscles}
                                      onMusclesChange={setSelectedMuscles}
                                      selectedEquipments={selectedEquipments}
                                      onEquipmentsChange={setSelectedEquipments}
                                      sortBy={sort.by}
                                      onSortByChange={(value) => setSort((sorts) => ({ ...sorts, by: value }))}
                                      sortOrder={sort.order}
                                      onSortOrderChange={(value) => setSort((sorts) => ({ ...sorts, order: value }))}
                                      availableMuscles={availableMuscles}
                                      availableEquipments={availableEquipments}
                                  />
                              </TrainingExercisesList>
                          </>
                      ) : (
                          <ExerciseDetails exercise={selectedExercise} onGoBack={() => setSelectedExercise(null)} />
                      )}
                  </div>
              </div>

              {openCoach && (
                  <div className='fixed bottom-[2rem] left-[2rem] z-50'>
                      <CoachPlus closeable={true} autoOpen={false} onCloseChat={() => setopenCoach(false)} />
                  </div>
              )}
          </main>

          <FeaturesDisplay />

          <Footer />
      </section>
  )
}





