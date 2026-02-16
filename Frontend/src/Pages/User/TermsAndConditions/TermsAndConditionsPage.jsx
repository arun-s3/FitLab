import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { motion } from "framer-motion" 

import {toast as sonnerToast} from 'sonner'

import TermsAndConditions, {lastUpdated, termsVersion} from  "../../../Data/TermsAndConditions"
import TermsAndConditionTopics from "./TermsAndConditionTopics"
import TermsAndConditionContent from "./TermsAndConditionContent"
import UserActionBar from "./UserActionBar"
import Header from "../../../Components/Header/Header"
import Footer from "../../../Components/Footer/Footer"
import {updateTermsAcceptance, resetStates} from '../../../Slices/userSlice'


export default function TermsAndConditionsPage() {

  const [activeSection, setActiveSection] = useState(0)

  const dispatch = useDispatch()
  const {updatedTermsAcceptance, error, loading, user} = useSelector((state)=> state.user)

  useEffect(()=> {
      if(updatedTermsAcceptance){
        dispatch(resetStates())
      }
  }, [updatedTermsAcceptance])

  useEffect(()=> {
      if(error){
        sonnerToast.error(error || "Something went wrong. Plaese check your network and retry later!")
        dispatch(resetStates())
      }
  }, [error])

  const headerBg = {
     backgroundImage: "url('/Images/header-bg.png')",
     backgrounSize: 'cover'
  }

  const handleConsent = (status) => {
    if(!user){
      sonnerToast.error("Please login first!")
      return
    }
    const consent = {hasAcceptedTerms: status, termsVersion}
    dispatch(updateTermsAcceptance({consent}))
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }


  return (
    <section id='TermsAndConditionsPage'>
        
      <header style={headerBg} className='h-[5rem] bg-gray-100'>

        <Header currentPageChatBoxStatus={true}/>

      </header>

    <div className="my-[10px] min-h-screen bg-gray-50 text-gray-900 flex flex-col border-t border-t-dropdownBorder">

      <motion.div
        className="bg-gray-200 border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Terms and Conditions</h1>
          <p className="text-sm text-gray-600"> {`Last Updated: ${lastUpdated} (${termsVersion})`} </p>
        </div>
      </motion.div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">

          <TermsAndConditionTopics 
            termsAndConditions={TermsAndConditions} 
            onClickTermTopic={setActiveSection}
            activeSection={activeSection}
          />
          
          <TermsAndConditionContent 
            termsAndConditions={TermsAndConditions} 
            activeSection={activeSection}
          />

        </div>
      </div>

    <UserActionBar 
      onUserConsent={handleConsent}
      loading={loading}
      termsVersion={termsVersion}
      user={user}
    />

    </div>

    <Footer/>
  
    </section>
  )
}
