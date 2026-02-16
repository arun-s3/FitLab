import React, {useState, useEffect, useRef, lazy, Suspense} from 'react'
import {useLocation} from "react-router-dom"
import {motion} from "framer-motion"

import apiClient from '../../../Api/apiClient'

import Header from '../../../Components/Header/Header'
import HeroSection from './HeroSection'
import Footer from "../../../Components/Footer/Footer"
import TextChatBox from '../TextChatBox/TextChatBox'
import Fallback from '../../../Components/FallbackSuspense/Fallback'

const Carousal = lazy(() => import("../../../Components/Carousal/Carousal"))
const LatestProductsCarousel = lazy(() => import("./LatestProductsCarousel"))
const BrandsCarousal = lazy(() => import("./BrandsCarousal"))
const FitnessQuoteSection = lazy(() => import("./FitnessQuoteSection"))
const ShopByCategories = lazy(() => import("./ShopByCategories"))
const FeaturesSection = lazy(() => import("./FeaturesSection"))
const OfferShowcase = lazy(() => import("../../../Components/OfferShowcase/OfferShowcase"))
const FitlabHighlights = lazy(() => import("./FitlabHighlights"))
const SpecialOfferSection = lazy(() => import("./SpecialOfferSection"))
const TestimonialSection = lazy(() => import("./TestimonialSection"))


export default function HomePage(){

    const [showHighlights, setShowHighlights] = useState(false)
    const [popularproducts, setPopularProducts] = useState([])

    const [openChatBox, setOpenChatBox] = useState(true)
    
    const highlightsRef = useRef(null)

    const location = useLocation()

    const shopByCategoryRef = useRef(null)

    const baseApiUrl = import.meta.env.VITE_API_BASE_URL

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

    useEffect(()=> {
      async function loadPopularProducts(){
        try{
          const response = await apiClient.get(`${baseApiUrl}/products/popular`)
          if(response?.data?.popularProducts) {
            setPopularProducts(response.data.popularProducts)
          }
        }
        catch(error){
          if (!error.response) {
            sonnerToast.error("Network error. Please check your internet.")
          }
          console.error(error)
          setPopularProducts([])
        }  
      }
      loadPopularProducts()
    }, [])

    const bgImg = {
        backgroundImage:"url('/Images/Hero-section-bg2.png')",
        backgroundSize:"cover"
    }


    return(
      <section id='homePage' className="bg-gray-100">

        <div 
          className="h-[48rem] l-md:h-[62rem] bg-black l-md:bg-gray-100 bg-[position:80%_center] 
            xx-md:bg-[position:3%_center] lg:bg-[position:initial]" 
          style={bgImg}
        >

            <Header 
              goToShopByCategorySec={()=> shopByCategoryRef.current?.scrollIntoView({ behavior: "smooth" })}
              currentPageChatBoxStatus={openChatBox}
            />

            <HeroSection />

        </div>

        <div className='my-16'>
          <Suspense fallback={<Fallback variant="products" height="h-56" />}>
            {/* <PopularProductsCarousal /> */}
            {
              popularproducts &&
                <Carousal 
                  products={popularproducts} 
                  title='Most Popular Products' 
                  subtitle='TOP FITNESS PICKS' 
                  buttonLabel='BUY'
                />
            }
          </Suspense>
        </div>

        <div className="mb-8">
          <Suspense fallback={<Fallback variant="wave" height="h-32" />}>
            <FitnessQuoteSection />
          </Suspense>
        </div>

        <div>
          <Suspense fallback={<Fallback variant="products" height="h-64" />}>
            <FeaturesSection />
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

        <div className="w-full py-8">
          <Suspense fallback={<Fallback variant="products" height="h-56" />}>
            <LatestProductsCarousel />
          </Suspense>
        </div>

        <div>
          <Suspense fallback={<Fallback variant="products" height="h-56" />}>
            <OfferShowcase />
          </Suspense>
        </div>

        <div ref={highlightsRef}>
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
        
        <Footer goToShopByCategorySec={()=> shopByCategoryRef.current?.scrollIntoView({ behavior: "smooth" })}/>

        {
          openChatBox &&
              <motion.div 
                initial={{ x: 5, opacity: 0 }}
                animate={{ x:0, opacity: 1 }}
                transition={{delay: 2.8, ease: 'easeOut'}}
                exit={{ opacity: 0 }}
                className="fixed bottom-[2rem] right-[2rem] z-50"
              >
              
                <TextChatBox closeable={true} 
                    onCloseChat={()=> setOpenChatBox(false)}/>

              </motion.div>
        }
        
      </section>
    )
}