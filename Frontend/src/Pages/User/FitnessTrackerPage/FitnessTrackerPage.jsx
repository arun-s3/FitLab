import React, { useState } from "react"
import { motion } from "framer-motion"

import Header from "../../../Components/Header/Header"
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import FitnessLayout from "./FitnessLayout"
import FitnessNavigation from "./FitnessNavigation"
import FeaturesDisplay from '../../../Components/FeaturesDisplay/FeaturesDisplay'
import Footer from '../../../Components/Footer/Footer'


export default function FitnessTrackerPage() {

  const [currentPage, setCurrentPage] = useState("tracker")

  const headerBg = {
    backgroundImage: "url('/header-bg.png')",
    backgrounSize: 'cover'
  }

  return (
    <section id='FitnessTrackerPage'>
        <header style={headerBg} className='h-[5rem]'>
            
            <Header />
            
        </header>
            
        <BreadcrumbBar heading='Fitness Tracker'/>

        <main 
            className="pt-[10px]"
            style={{
                backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.94), rgba(250,245,255,0.94), rgba(243,244,246,0.94)), url('/fitness-tracker-bg.png')",
                backgroundSize: "cover",
                // backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}
        >

            <FitnessNavigation currentPage={currentPage} setCurrentPage={setCurrentPage} />

            <FitnessLayout>

            </FitnessLayout>

        </main>

        <FeaturesDisplay />
        
        <Footer/>
        
    </section>
  )
}
