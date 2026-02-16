import React, {useState, useEffect, lazy, Suspense} from 'react'
import './CustomerSupportPage.css'
import {motion} from 'framer-motion'

import Header from '../../../Components/Header/Header'
import UserSidebar from '../../../Components/UserSidebar/UserSidebar'
import ChatTooltip from './VideoSupport/ChatTooltip'
import Footer from '../../../Components/Footer/Footer'
import Fallback from '../../../Components/FallbackSuspense/Fallback'

const VideoSupportModule = lazy(()=> import("./VideoSupportModule"))
const TextChatBox = lazy(()=> import("../../User/TextChatBox/TextChatBox"))
const FaqSection = lazy(()=> import("./FaqSection"))
const MiniTestimonialCarousal = lazy(()=> import("../../../Components/MiniTestimonialCarousal/MiniTestimonialCarousal"))
const FeaturesDisplay = lazy(()=> import("../../../Components/FeaturesDisplay/FeaturesDisplay"))


export default function CustomerSupportPage(){


    const [showTooltip, setShowTooltip] = useState(false)

    const [chatFocusInput, setChattFocusInput] = useState(false)

    const bgImg = {
        backgroundImage:"url('/Images/SupportPageBg1.png')",
        backgroundSize:"cover", 
        backgroundPositionY:"2.5%"
    }

    const headerTextVariants = {
      hidden: { opacity: 0, y: -20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: "easeOut",
        },
      },
    }

    useEffect(() => {
      window.showChatTooltip = () => {
        setShowTooltip(true)
        setTimeout(() => {
          setShowTooltip(false)
        }, 3000)
        setChattFocusInput(true)
      }
    
      return () => {
        delete window.showChatTooltip
      }
    }, [])


    return (

         <>
            <section className='h-screen' id="CustomerSupportPage">
        
                <header className='relative h-[17rem] pt-4' style={bgImg}>
                        
                    <Header currentPageChatBoxStatus={true}/>

                    <div className="absolute top-[7.5rem] w-full text-[3rem] font-bold text-center
                     text-inputBorderLow">
                        <motion.h1
                          className="text-inherit font-funCity"
                          initial="hidden"
                          animate="visible"
                          variants={headerTextVariants}
                        >
                          HELLO!
                        </motion.h1>
                        <motion.h2
                          className="text-inherit font-funCity"
                          initial="hidden"
                          animate="visible"
                          variants={headerTextVariants}
                          transition={{ delay: 0.2 }}
                        >
                          HOW CAN WE HELP?
                        </motion.h2>
                    </div>
                                        
                </header>
                <div className="relative mt-[-13px]">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-8 md:h-12 lg:h-16 fill-gray-50 block">
                      <path d="M0,0 L48,8 L96,3 L144,12 L192,5 L240,15 L288,2 L336,18 L384,7 L432,22 L480,4 L528,16 L576,9 
                        L624,25 L672,6 L720,19 L768,11 L816,28 L864,8 L912,21 L960,13 L1008,30 L1056,10 L1104,24 L1152,14 L1200,32
                         L1200,120 L0,120 Z" />
                    </svg>
                </div>
                        
                <main className='-mt-[4rem] bg-gradient-to-b from-gray-50 to-gray-100'>

                    <div className='w-full flex gap-4 pl-[4rem] pr-[2rem]'>

                      <div className='basis-[15%]'>
                                                                
                        <UserSidebar currentPath='/support' />
                        
                      </div>

                      <div className='mt-[4rem] flex justify-between'>

                        <Suspense fallback={<Fallback variant="default" height="h-96" />}>
                          <VideoSupportModule />
                        </Suspense>

                        <div className='mt-[3rem]'>

                          <Suspense fallback={<Fallback variant="wave" height="h-[32rem]" />}>
                            <TextChatBox isStatic={true} boxHeight={517} boxWidth={25} focusByDefault={chatFocusInput}/>
                          </Suspense>

                          <ChatTooltip isVisible={showTooltip} onHide={()=> setShowTooltip(false)} />

                          <div className='mt-[1.7rem]'>

                            <Suspense fallback={<Fallback variant="brands" height="h-32" />}>
                              <MiniTestimonialCarousal />
                            </Suspense>

                          </div>

                        </div>

                      </div>

                    </div>

                    <div className='mt-8'>

                      <Suspense fallback={<Fallback variant="default" height="h-64" />}>
                        <FaqSection/>
                      </Suspense>

                    </div>

                </main>

                  <div className=''>   

                    <Suspense fallback={<Fallback variant="products" height="h-80" />}>
                      <FeaturesDisplay topRoom={false}/>
                    </Suspense>

                  </div>
                                            
                  <Footer />

            </section>
        </>
    )
}