import React, {useEffect, useState, useRef} from 'react'
import {useLocation, Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import axios from 'axios'

import Header from '../../../Components/Header/Header'
import TextChatBox from '../TextChatBox/TextChatBox'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import FitnessCarousal from './FitnessCarousal'
import FeaturesDisplay from '../../../Components/FeaturesDisplay/FeaturesDisplay'
import Footer from '../../../Components/Footer/Footer'


export default function FitnessTrainingPage(){

  const [muscles, setMuscles] = useState(null)
  const [selectedMuscle, setSelectedMuscle] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

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
        if(response.success){
          setMuscles(response.data.map(data=> data.name))
          console.log("Muscles--->", muscles)
        }
      }catch (error) {
      	console.error("Error while loading body parts", error.message)
      }
    }
    loadBodyParts()
  }, [])

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

          </div>

        </div>

        <div className="fixed bottom-[2rem] right-[2rem] z-50">
              
          <TextChatBox />

        </div>

      </main>

      <FeaturesDisplay />

      <Footer/>

    </section>
    
  )
}





