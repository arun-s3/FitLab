import React, {useState, useEffect} from 'react'
import './CheckoutPage.css'

import Header from '../../../Components/Header/Header'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import OrderStepper from '../../../Components/OrderStepper/OrderStepper'
import FeaturesDisplay from '../../../Components/FeaturesDisplay/FeaturesDisplay'

export default function CheckoutPage(){



    const headerBg = {
        backgroundImage: "url('/header-bg.png')",
        backgrounSize: 'cover'
    }


    return(
        <section id='CheckoutPage'>
            <header style={headerBg}>
                
                <Header />
                
            </header>
                
            <BreadcrumbBar heading='Shopping Cart'/>
            
            <main>

                <OrderStepper stepNumber={1}/>

            </main>
        </section>
    )
}