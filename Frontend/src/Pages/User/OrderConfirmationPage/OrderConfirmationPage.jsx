import React from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'

import Header from '../../../Components/Header/Header'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import OrderStepper from '../../../Components/OrderStepper/OrderStepper'
import FeaturesDisplay from '../../../Components/FeaturesDisplay/FeaturesDisplay'
import Footer from '../../../Components/Footer/Footer'
import {SiteButtonSquare, SiteButton, SiteSecondaryFillImpButton} from '../../../Components/SiteButtons/SiteButtons'

export default function OrderConfirmationPage(){

  const {user} = useSelector((state)=>state.user)

  const navigate = useNavigate()

  const headerBg = {
    backgroundImage: "url('/header-bg.png')",
    backgrounSize: 'cover'
  }

  return (

    <section id='CheckoutPage'>
      <header style={headerBg}>
                    
        <Header />
                    
      </header>
                    
      <BreadcrumbBar heading='Order Confirmation'/>
                
      <main className='mb-[7rem]'>
        <div className="min-h-screen bg-white">
          <div className="container mx-auto px-[1rem] py-[2rem]">
            <h1 className="text-4xl font-bold text-center mb-[3rem]">Completed!</h1>

            <OrderStepper stepNumber={4}/>

            <div className="max-w-3xl mx-auto mb-[3rem]">
              <div className="bg-green-600 rounded-lg p-[1.5rem] flex justify-between items-center">
                <div>
                  <h2 className="text-2xl text-white font-bold mb-[8px]">Order Completed</h2>
                  <p className="text-green-200">Arriving By 15 Mon 2024</p>
                </div>
                  <SiteButton customStyle={{filter: 'none'}} onClick={()=> navigate('/orders')}>
                    View order
                  </SiteButton>
              </div>
            </div>

            <div className="max-w-2xl mx-auto text-center mb-[3rem]">
              <h2 className="text-[2rem] font-bold mb-[1.5rem]">Thank you!</h2>
              <p className="text-[1.5rem] mb-[1.5rem]">
                Your order <span className="text-purple-600 font-medium">#62-745890</span> has been placed!
              </p>
              <p className="text-gray-600 mb-[2rem]">
                {`We sent an email to ${user.email} with your order confirmation and receipt. If the email hasn't arrived within two
                minutes, please do check your spam folder for the mail`}
              </p>
                <SiteButtonSquare onClick={()=> navigate('/shop/products')}>
                  Continue Shopping
                </SiteButtonSquare>
            </div>
          </div>
        </div>
      </main>

      <FeaturesDisplay />

      <Footer />

    </section>
  )
}


