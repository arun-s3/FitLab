import React, { useState } from "react"
import { motion } from "framer-motion"

import PrivacyPolicies, {lastUpdated} from "../../../../data/PrivacyPolicies"
import PrivacyTopicsSection from "./PrivacyTopicsSection"
import PolicyContentSection from "./PolicyContentSection"
import Header from "../../../Components/Header/Header"
import Footer from "../../../Components/Footer/Footer"


export default function PrivacyPolicyPage() {

  const [activeSection, setActiveSection] = useState(0)

  const activeSectionData = PrivacyPolicies[activeSection]


  return (
    <section id='PrivacyPolicyPage'>
    
        <header className='h-[5rem] bg-gradient-to-r from-purple-600 to-purple-800'>

          <Header lighterLogo={true} currentPageChatBoxStatus={true}/>

        </header>

        <div className="w-full min-h-screen bg-gradient-to-b from-white to-gray-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-r from-purple-600 to-purple-800 text-white pt-12 pb-20 px-6 md:px-12"
          >
            <svg
              className="absolute bottom-0 left-0 w-full h-24 text-white"
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
            >
              <path fill="currentColor" d="M0,40 Q360,80 720,80 T1440,40 L1440,120 L0,120 Z" />
            </svg>

            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl font-bold mb-4 text-white"
              >
                Privacy Policy
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[15px] text-purple-100"
              >
                {`Last updated: ${lastUpdated}`}
              </motion.p>
            </div>
          </motion.div>

          <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-6 md:px-12 py-12 gap-8 lg:gap-12">

            <PrivacyTopicsSection 
              privacyPolicies={PrivacyPolicies}
              activeSectionIndex={activeSection} 
              onClickSection={setActiveSection}
            />

            <PolicyContentSection 
              activeSectionIndex={activeSection} 
              activeSectionData={activeSectionData}
            />

          </div>
          
        </div>
        
        <Footer/>

    </section>
  )
}
