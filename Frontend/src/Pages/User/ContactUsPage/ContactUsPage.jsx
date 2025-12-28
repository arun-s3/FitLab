import React, { useContext } from "react"

import axios from 'axios'
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
     backgroundImage: "url('/header-bg.png')",
     backgrounSize: 'cover'
  }

  const {isConnected, isAdminOnline} = useContext(SocketContext)

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  const handleSubmit = async({details}) => {
    console.log("Form Details inside handleSubmit():", details)
    try { 
      const response = await axios.post(`${baseApiUrl}/contact`, {details}, { withCredentials: true })
      if(response.status === 201){
        sonnerToast.success(response.data.message, {duration: 4500})
        return true
      }
      if(response.status === 404){
        sonnerToast.error(error.response.data.message)
        console.log("Error---->", error.response.data.message)
        return false
      }
    }catch (error) {
      console.error("Error while submitting the details:", error.message)
      sonnerToast.error('Something went wrong! Please retry later.')
      return false
    }
  }


  return (
    <section id='ContactUsPage'>
    
        <header style={headerBg} className='h-[5rem]'>
        
            <Header pageChatBoxStatus={true}/>
        
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

