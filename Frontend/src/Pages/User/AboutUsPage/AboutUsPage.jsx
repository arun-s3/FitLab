import React, {lazy, Suspense} from 'react'
import {useSelector} from 'react-redux'

import HeroSection from "./HeroSection"
import Header from '../../../Components/Header/Header'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import Footer from '../../../Components/Footer/Footer'
import CTASection from './CTASection'

const StatsSection = lazy(() => import("./StatsSection"))
const VisionSection = lazy(() => import("./VisionSection"))
const ReviewsSection = lazy(() => import("./ReviewsSection"))
const TimelineSection = lazy(() => import("./TimelineSection"))
const CoreValues = lazy(() => import("./CoreValues"))
const FeaturesSection = lazy(() => import("./FeaturesSection"))

import Fallback from '../../../Components/FallbackSuspense/Fallback'


export default function AboutUsPage() {

  const headerBg = {
     backgroundImage: "url('/header-bg.png')",
     backgrounSize: 'cover'
  }

  const {user} = useSelector(state=> state.user)


  return (
    <section id='ShoppingCartPage'>

      <header style={headerBg} className='h-[5rem]'>
    
        <Header pageChatBoxStatus={true}/>
    
      </header>
    
      <BreadcrumbBar heading='About Us'/>

      <main className='mt-[5px]'>

        <div className="min-h-screen bg-white overflow-hidden">

          <HeroSection />

          <Suspense fallback={<Fallback variant="wave" height="h-32" />}>
            <StatsSection />
          </Suspense>

          <Suspense fallback={<Fallback variant="products" height="h-32" />}>
            <VisionSection />
          </Suspense>

          <Suspense fallback={<Fallback variant="products" height="h-32" />}>
            <ReviewsSection />
          </Suspense>

          <Suspense fallback={<Fallback variant="wave" height="h-32" />}>
            <TimelineSection />
          </Suspense>

          <Suspense fallback={<Fallback variant="pulse" height="h-32" />}>
            <CoreValues />
          </Suspense>

          <Suspense fallback={<Fallback variant="products" height="h-32" />}>
            <FeaturesSection />
          </Suspense>

          {
            !user &&
              <CTASection />
          }

        </div>

      </main>

      <Footer/>
    
    </section>
  )
}
