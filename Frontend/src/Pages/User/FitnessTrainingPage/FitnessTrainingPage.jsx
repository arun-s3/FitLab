import React, {useEffect, useState, useRef} from 'react'
import {useLocation, Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import axios from 'axios'

import Header from '../../../Components/Header/Header'
import TextChatBox from '../TextChatBox/TextChatBox'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import FitnessCarousal from './FitnessCarousal'
import MuscleSelector from './MuscleSelector'
import TrainingExercisesList from './TrainingExercisesList'
import FeaturesDisplay from '../../../Components/FeaturesDisplay/FeaturesDisplay'
import PaginationV2 from '../../../Components/PaginationV2/PaginationV2'
import Footer from '../../../Components/Footer/Footer'


export default function FitnessTrainingPage(){

  const [muscles, setMuscles] = useState(null)
  const [selectedMuscle, setSelectedMuscle] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [exercises, setExercises] = useState([])
  const [firstExerciseIndex, setFirstExerciseIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1) 
  const exercisesPerPage = 3

  const exerciseAPiKey = import.meta.env.VITE_EXERCISEDB_RAPIDAPI_KEY
  const exerciseAPiUrl = import.meta.env.VITE_EXERCISEDB_URL

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  const videosPerPage = 3

  const {user} = useSelector(state=> state.user)

  const dispatch = useDispatch()

  const location = useLocation()

  useEffect(()=> {
    async function loadBodyParts(){
      try {
        console.log("Inside loadBodyParts()...")
        const response = await axios.get(`${exerciseAPiUrl}/bodyparts`)
        console.log("loadBodyParts response----->", response.data)
        if(response.data.success){ 
          setMuscles(response.data.data.map(data=> data.name))
          console.log("Muscles--->", muscles)
        }
      }catch (error) {
      	console.error("Error while loading body parts", error.message)
      }
    }
    loadBodyParts()
  }, [])

  const fetchExercisesByMuscle = async()=> { 
    try {
        console.log("Inside fetchExercisesByMuscle()...")
        const response = await axios.get(
          `${exerciseAPiUrl}/bodyparts/${selectedMuscle}/exercises?offset=${firstExerciseIndex}&limit=${exercisesPerPage}`
        )
        console.log("fetchExercisesByMuscle response----->", response.data)
        if(response.data.success){
          console.log("Exercises--->", response.data)
          const totalPagesRequired = Math.ceil(response.data.metadata.totalExercises / exercisesPerPage)
          setTotalPages(totalPagesRequired)
          return response.data.data
        }
      }catch (error) {
      	console.error("Error while loading body parts", error.message)
      }
  }

  const searchExercises = async()=> { 
    try {
        console.log("Inside searchExercises()...")
        const response = await axios.get(
          `${exerciseAPiUrl}/bodyparts/${selectedMuscle}/exercises?offset=${firstExerciseIndex}&limit=${exercisesPerPage}`
        )
        console.log("fetchExercisesByMuscle response----->", response.data)
        if(response.data.success){
          console.log("Exercises--->", response.data)
          const totalPagesRequired = Math.ceil(response.data.metadata.totalExercises / exercisesPerPage)
          setTotalPages(totalPagesRequired)
          return response.data.data
        }
      }catch (error) {
      	console.error("Error while loading body parts", error.message)
      }
  }

  useEffect(() => {
    if (!selectedMuscle) {
      setExercises([])
      setError(null)
      return
    }

    const loadExercises = async () => {
      if(selectedMuscle){
        setLoading(true)
        setError(null)

        const result = await fetchExercisesByMuscle()

        setExercises(result || [])
        if (result.error) {
          setError(result.error)
        }

        setLoading(false)
      }
    }
    console.log("firstExerciseIndex----->", firstExerciseIndex)
    loadExercises()
  }, [selectedMuscle, firstExerciseIndex])

  useEffect(()=> {
    if(currentPage){
      setFirstExerciseIndex((currentPage - 1) * exercisesPerPage)
    }
  }, [currentPage])

  const headerBg = {
     backgroundImage: "url('/header-bg.png')",
     backgrounSize: 'cover'
  }


  return (
    
    <section id='FitnessTrainingPage'>
      <header style={headerBg} className='h-[5rem]'>
    
        <Header />
    
      </header>
    
      <BreadcrumbBar heading='Fitness Training'/>

      <main>
        
        <div className="px-[1rem] py-[3rem]">

          
          <div className="min-h-screen bg-white text-slate-900">

            <FitnessCarousal />

            <div className="mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 md:py-0">

            {
              muscles && muscles.length > 0 &&
                <MuscleSelector 
                  muscles={muscles} 
                  searchedMuscle={searchQuery} 
                  setSearchedMuscle={setSearchQuery} 
                  onSearchMuscle={setSelectedMuscle}
                  selectedMuscle={selectedMuscle}
                />
            }

            </div>

            <TrainingExercisesList 
              muscles={muscles}
              selectedMuscle={selectedMuscle} 
              exercises={exercises}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              isLoading={loading}
              error={error}
            />

          </div>

        </div>

        {/* <div className="fixed bottom-[2rem] right-[2rem] z-50">
              
          <TextChatBox />

        </div> */}

      </main>

      <FeaturesDisplay />

      <Footer/>

    </section>
    
  )
}





