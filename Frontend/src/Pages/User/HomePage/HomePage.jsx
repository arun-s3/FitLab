import React, {useState, useEffect, useRef, lazy, Suspense} from 'react'
import {useLocation} from "react-router-dom"

import Header from '../../../Components/Header/Header'
import HeroSection from './HeroSection'
import Footer from "../../../Components/Footer/Footer"
import Fallback from '../../../Components/FallbackSuspense/Fallback'

const PopularProductsCarousal = lazy(() => import("./PopularProductsCarousal"))
const LatestProductsCarousel = lazy(() => import("./LatestProductsCarousel"))
const BrandsCarousal = lazy(() => import("./BrandsCarousal"))
const FitnessQuoteSection = lazy(() => import("./FitnessQuoteSection"))
const ShopByCategories = lazy(() => import("./ShopByCategories"))
const FitlabHighlights = lazy(() => import("./FitlabHighlights"))
const SpecialOfferSection = lazy(() => import("./SpecialOfferSection"))
const TestimonialSection = lazy(() => import("./TestimonialSection"))


export default function HomePage(){

    const [showHighlights, setShowHighlights] = useState(false)
    const highlightsRef = useRef(null)

    const location = useLocation()

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
  
    useEffect(() => {
      if (location.state?.scrollTo === "shopByCategories"){
        setTimeout(() => {
          shopByCategoryRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 200)
      }
    }, [location])

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

        <Suspense fallback={<Fallback variant="products" height="h-56" />}>
          <PopularProductsCarousal />
        </Suspense>

        <div className="mb-8">
          <Suspense fallback={<Fallback variant="wave" height="h-32" />}>
            <FitnessQuoteSection />
          </Suspense>
        </div>

        <div className="w-full py-8">
          <Suspense fallback={<Fallback variant="products" height="h-56" />}>
            <LatestProductsCarousel />
          </Suspense>
        </div>

        <div className="w-full mt-8">
          <Suspense fallback={<Fallback variant="brands" height="h-40" />}>
            <BrandsCarousal />
          </Suspense>
        </div>

        <div id="shopByCategoriesSection" ref={shopByCategoryRef}>
          <Suspense fallback={<Fallback variant="products" height="h-64" />}>
            <ShopByCategories />
          </Suspense>
        </div>

        <div ref={highlightsRef} className="mt-8">
          <Suspense fallback={<Fallback variant="pulse" height="h-64" />}>
            {showHighlights && <FitlabHighlights />}
          </Suspense>
        </div>

        <Suspense fallback={<Fallback variant="default" height="h-48" />}>
          <SpecialOfferSection />
        </Suspense>

        <Suspense fallback={<Fallback variant="dots" height="h-48" />}>
          <TestimonialSection />
        </Suspense>
        
        <Footer/>
        
      </section>
    )
}