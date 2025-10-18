import React, {useState, useEffect, useRef} from 'react'

import Header from '../../../Components/Header/Header'
import HeroSection from './HeroSection'
import ProductCarousel from './ProductCarousel'
import BrandsCarousal from './BrandsCarousal'
import FitnessQuoteSection from './FitnessQuoteSection'
import ShopByCategories from './ShopByCategories'
import FitlabHighlights from './FitlabHighlights'
import SpecialOfferSection from './SpecialOfferSection'
import Footer from '../../../Components/Footer/Footer'


export default function HomePage(){

    const [showHighlights, setShowHighlights] = useState(false)
    const highlightsRef = useRef(null)

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setShowHighlights(true)
              observer.disconnect()
            }
          })
        },
        { threshold: 0.3 }
      )

      if (highlightsRef.current) observer.observe(highlightsRef.current)

      return () => observer.disconnect()
    }, [])

    const bgImg = {
        backgroundImage:"url('/Hero-section-bg2.png')",
        backgroundSize:"cover"
    }


    return(
      <section id='homePage' className="bg-gray-100">

        <div className="h-[70rem]" style={bgImg}>

            <Header />

            <HeroSection />

        </div>
          
        <FitnessQuoteSection />
        
        <div className='w-full py-8'>

          <ProductCarousel />

        </div>

        <div className='w-full'>

          <BrandsCarousal />

        </div>

        <ShopByCategories />

        <div ref={highlightsRef}>

          {showHighlights && <FitlabHighlights />}

        </div>

        <SpecialOfferSection />    
        
        <Footer/>
        
      </section>
    )
}