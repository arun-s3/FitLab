import React, {useState, useEffect} from 'react'
import './CustomerSupportPage.css'

import Header from '../../../Components/Header/Header'
import Footer from '../../../Components/Footer/Footer'


export default function CustomerSupportPage(){



    const bgImg = {
        backgroundImage:"url('/SupportPageBg1.png')",
        backgroundSize:"cover", 
        backgroundPositionY:"2.5%"
    }


    return (

         <>
            <section className='h-screen' id="CustomerSupportPage">
        
                <header className='h-[17rem] pt-4' style={bgImg}>
                        
                    <Header/>
                                        
                </header>
                        
                <main>

                </main>

            </section>
        </>
    )
}