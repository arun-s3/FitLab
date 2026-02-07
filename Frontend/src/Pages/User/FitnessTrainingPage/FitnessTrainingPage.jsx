import React, {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'

import axios from 'axios'

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
  const [error, setError] = useState(null)

  const [selectedExercise, setSelectedExercise] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1) 
  const exercisesPerPage = 3

  const [openCoach, setopenCoach] = useState(true)

  const exerciseAPiUrl = import.meta.env.VITE_EXERCISEDB_URL

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  useEffect(()=> {
    async function loadBodyParts(){
      try {
        console.log("Inside loadBodyParts()...")
        const response = await axios.get(`${exerciseAPiUrl}/bodyparts`)
        console.log("loadBodyParts response----->", response.data)
        if(response.data.success){ 
          setBodyParts(response.data.data.map(data=> data.name))
          console.log("Body Parts--->", bodyParts)
        }
      }catch (error) {
      	console.error("Error while loading body parts", error.message)
      }
    }
    loadBodyParts()
  }, [])

  const fetchExercises = async(options)=> { 
    try {
        console.log("Inside fetchExercises()...")
        if(options?.searchQueryRemoved && selectedBodyParts?.length === 0){
          setExercises([])
          return
        }     

        // const response = await axios.get(
        //   `${exerciseAPiUrl}/exercises/filter`,
        //   {
        //     params: {
        //       offset: firstExerciseIndex,          
        //       limit: exercisesPerPage,             
            
        //       muscles: selectedMuscles.length > 0 ? selectedMuscles.join(",") : undefined,        
        //       bodyParts: selectedBodyParts.length > 0 ? selectedBodyParts.join(",") : undefined,    
        //       equipment: selectedEquipments.length > 0 ? selectedEquipments.join(",") : undefined,   
            
        //       search: options?.searchQueryRemoved ? undefined : searchQuery || undefined,
            
        //       sortBy: sort.by ? sort.by : undefined,
        //       sortOrder: sort.order ? sort.order : undefined,
        //     }
        //   }
        // );

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

        const response = await axios.post(`${baseApiUrl}/fitness/exercises/list`, {queryDetails}, {withCredentials: true})

        console.log("fetchExercises response----->", response.data.data)
        if(response.data.data.success){
          console.log("Exercises--->", response.data.data)
          const totalPagesRequired = Math.ceil(response.data.data.metadata.totalExercises / exercisesPerPage)
          setTotalPages(totalPagesRequired)
          return response.data.data.data
        }
      }catch (error) {
      	console.error("Error while loading exercises", error.message)
      }
  }

  
  const loadExercises = async (options) => {
    setLoading(true)
    setError(null)

    const result = await fetchExercises(options)
    setExercises(result || [])

    if (result.error) {
      setError(result.error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (searchQuery) {
      console.log("searchQuery--->", searchQuery)
      loadExercises()
    }
  }, [searchQuery])
  
  useEffect(() => {
    if (selectedEquipments.length > 0 || selectedMuscles.length > 0 || sort.by.trim() !== '' || sort.order.trim() !== '') {
      loadExercises()
    }
  }, [selectedEquipments, selectedMuscles, sort.by, sort.order])

  useEffect(() => {
    console.log("selectedBodyParts----->", selectedBodyParts)
    if ((!selectedBodyParts || selectedBodyParts.length === 0) && !searchQuery) {
      setExercises([])
      setError(null)
      return
    }
    console.log("firstExerciseIndex----->", firstExerciseIndex)
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
    
        <Header currentPageCoachStatus={true}/>
    
      </header>
    
      <BreadcrumbBar heading='Fitness Training'/>

      <main className='bg-gradient-to-br from-white via-blue-50 to-gray-100'>
        
        <div className="px-[1rem] py-[3rem] bg-white">

          
          <div className="min-h-screen text-slate-900">

            {
              !selectedExercise ?
                <>
                  <FitnessCarousal />

                  <div className="mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 md:py-0">

                  {
                    bodyParts && bodyParts.length > 0 &&
                      <MuscleSelector 
                        bodyParts={bodyParts} 
                        searchedBodyPart={searchQuery} 
                        setSearchedBodyPart={setSearchQuery} 
                        onSearchBodyPart={setSelectedBodyParts}
                        selectedBodyParts={selectedBodyParts}
                        listExercises={loadExercises}
                        isLoading={loading}
                      />
                  }

                  </div>
                
                  <TrainingExercisesList 
                    selectedBodyParts={selectedBodyParts} 
                    exercises={exercises}
                    onfetchMusclesAndEquipments={saveMusclesAndEquipments}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onSelectExercise={setSelectedExercise}
                    onPageChange={setCurrentPage}
                    isLoading={loading}
                    error={error}
                  >
                
                      <FilterPanel
                        selectedMuscles={selectedMuscles}
                        onMusclesChange={setSelectedMuscles}
                        selectedEquipments={selectedEquipments}
                        onEquipmentsChange={setSelectedEquipments}
                        sortBy={sort.by}
                        onSortByChange={(value)=> setSort(sorts=> ({...sorts, by: value}))}
                        sortOrder={sort.order}
                        onSortOrderChange={(value)=> setSort(sorts=> ({...sorts, order: value}))}
                        availableMuscles={availableMuscles}
                        availableEquipments={availableEquipments}
                      />
                
                  </TrainingExercisesList>
                </>
              
              : <ExerciseDetails 
                  exercise={selectedExercise} 
                  onGoBack={()=> setSelectedExercise(null)}
                />

            }

          </div>

        </div>

        {
            openCoach &&
                <div className="fixed bottom-[2rem] left-[2rem] z-50">
                
                    <CoachPlus closeable={true} 
                        autoOpen={false}
                        onCloseChat={()=> setopenCoach(false)}/>
                </div>
        }

      </main>

      <FeaturesDisplay/>

      <Footer/>

    </section>
    
  )
}





