import React, {lazy, Suspense} from 'react'

import HeroSection from "./HeroSection"
import Header from '../../../Components/Header/Header'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'

const StatsSection = lazy(() => import("./StatsSection"))
const VisionSection = lazy(() => import("./VisionSection"))
const ReviewsSection = lazy(() => import("./ReviewsSection"))

import Fallback from '../../../Components/FallbackSuspense/Fallback'


export default function AboutUsPage() {

  const bgImg = {
      backgroundImage:"url('/Hero-section-bg2.png')",
      backgroundSize:"cover"
  }

  const headerBg = {
     backgroundImage: "url('/header-bg.png')",
     backgrounSize: 'cover'
  }


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

        </div>

      </main>
    
    </section>
  )
}
