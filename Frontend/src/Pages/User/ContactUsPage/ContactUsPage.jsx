import React, { useContext } from "react"

import apiClient from '../../../Api/apiClient'
import {toast as sonnerToast} from 'sonner'

import ContactForm from "./ContactForm"
import LocationInfo from "./LocationInfo"
import FaqSection from "./FaqSection"
import Header from '../../../Components/Header/Header'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import Footer from '../../../Components/Footer/Footer'
import {SocketContext} from '../../../Components/SocketProvider/SocketProvider'


export default function ContactUsPage(){

  const headerBg = {
     backgroundImage: "url('/Images/header-bg.png')",
     backgrounSize: 'cover'
  }

  const {isConnected, isAdminOnline} = useContext(SocketContext)

  const handleSubmit = async({details}) => {
    try { 
      const response = await apiClient.post(`/contact`, {details})
      if(response.status === 201){
        sonnerToast.success(response.data.message, {duration: 4500})
        return true
      }
    }catch (error) {
      if (!error.response) {
          sonnerToast.error("Network error. Please check your internet.")
      } else if (error.response?.status === 404) {
          sonnerToast.error(error.response.data.message || "Error while submitting your message. Please try later!")
      } else {
          sonnerToast.error("Something went wrong! Please retry later.")
      }
      return false
    }
  }


  return (
    <section id='ContactUsPage'>
    
        <header style={headerBg} className='h-[5rem]'>
        
            <Header currentPageChatBoxStatus={true}/>
        
        </header>
        
        <BreadcrumbBar heading='Contact Us'/>
    
        <main className='mt-[5px]'>

            <div className="min-h-screen">   

              <ContactForm 
                isSupportConnected={isAdminOnline} 
                isCoachConnected={isConnected}
                onSubmit={handleSubmit} 
              />  

              <LocationInfo />
                    
              <FaqSection />

            </div>

        </main>

        <Footer/>
                
    </section>
  )
}

