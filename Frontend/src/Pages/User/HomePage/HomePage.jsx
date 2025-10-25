import React, {useState, useEffect, useRef} from 'react'

import Header from '../../../Components/Header/Header'
import HeroSection from './HeroSection'
import PopularProductsCarousal from './PopularProductsCarousal'
import LatestProductsCarousel from './LatestProductsCarousel'
import BrandsCarousal from './BrandsCarousal'
import FitnessQuoteSection from './FitnessQuoteSection'
import ShopByCategories from './ShopByCategories'
import FitlabHighlights from './FitlabHighlights'
import SpecialOfferSection from './SpecialOfferSection'
import TestimonialSection from './TestimonialSection'
import Footer from '../../../Components/Footer/Footer'


export default function HomePage(){

    const [showHighlights, setShowHighlights] = useState(false)
    const highlightsRef = useRef(null)

    const shopByCategoryRef = useRef(null)

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

        <div 
          className="h-[48rem] l-md:h-[62rem] bg-black l-md:bg-gray-100 bg-[position:80%_center] 
            xx-md:bg-[position:3%_center] lg:bg-[position:initial]" 
          style={bgImg}
        >

            <Header goToShopByCategorySec={()=> shopByCategoryRef.current?.scrollIntoView({ behavior: "smooth" })}/>

            <HeroSection />

        </div>

        <PopularProductsCarousal />
          
        <div className='mb-8'>
            <FitnessQuoteSection />
        </div>
        
        <div className='w-full py-8'>
          <LatestProductsCarousel />
        </div>

        <div className='w-full mt-8'>

          <BrandsCarousal />

        </div>

        <div ref={shopByCategoryRef}>

          <ShopByCategories />

        </div>

        <div ref={highlightsRef} className='mt-8'>

          {showHighlights && <FitlabHighlights />}

        </div>

        <SpecialOfferSection />    

        <TestimonialSection />
        
        <Footer/>
        
      </section>
    )
}