import React, {useState, useEffect} from 'react'
import './CustomerSupportPage.css'
import {motion} from 'framer-motion'

import Header from '../../../Components/Header/Header'
import TestimonialsSection from './TestimonialsSection'
import Footer from '../../../Components/Footer/Footer'


export default function CustomerSupportPage(){



    const bgImg = {
        backgroundImage:"url('/SupportPageBg1.png')",
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


    return (

         <>
            <section className='h-screen' id="CustomerSupportPage">
        
                <header className='relative h-[17rem] pt-4' style={bgImg}>
                        
                    <Header/>

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
                <div className="relative mt-[-13px] z-10">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-8 md:h-12 lg:h-16 fill-white block">
                      <path d="M0,0 L48,8 L96,3 L144,12 L192,5 L240,15 L288,2 L336,18 L384,7 L432,22 L480,4 L528,16 L576,9 
                        L624,25 L672,6 L720,19 L768,11 L816,28 L864,8 L912,21 L960,13 L1008,30 L1056,10 L1104,24 L1152,14 L1200,32
                         L1200,120 L0,120 Z" />
                    </svg>
                </div>
                        
                <main>

                    <div className='mt-8'>
        
                        <TestimonialsSection/>
        
                    </div>

                </main>

            </section>
        </>
    )
}