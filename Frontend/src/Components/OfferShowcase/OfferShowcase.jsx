import React, { useState, useEffect } from "react"
import {useSelector, useDispatch} from "react-redux"
import { motion, AnimatePresence } from "framer-motion"

import { ChevronLeft, ChevronRight, X } from "lucide-react"

import OfferProductsModal from "./OfferProductsModal"
import OfferCategoryModal from "./OfferCategoryModal"
import {getAllOffers} from '../../../src/Slices/offerSlice'


export default function OfferShowcase({sectionStyle, containerStyle, headlineStyle}) {

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [openModal, setOpenModal] = useState({type: '', datas: null}) 

  const [altOfferBanner, setAltOfferBanner] = useState(null)

  const [queryOptions, setQueryOptions] = useState({page: 1, limit: 1, status: 'active'})

  const [currentOffer, setCurrentOffer] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(20)  

  const {offers, totalOffers} = useSelector(state=> state.offers)
  const {user} = useSelector((state)=> state.user)

  const dispatch = useDispatch()

  useEffect(()=> {
    console.log("currentPage------->", currentPage)
    if(user && Object.keys(queryOptions).length > 0){
        console.log("Dispatching getAllOffers()...")
        dispatch( getAllOffers({queryOptions: {...queryOptions, userId: user._id, page: currentPage}}) )
    }
    else if(!user && Object.keys(queryOptions).length > 0){
        console.log("Dispatching getAllOffers()...")
        dispatch( getAllOffers({queryOptions: {...queryOptions, page: currentPage}}) )
    }
  }, [currentPage, queryOptions, user])

  useEffect(()=> {
      console.log("offers------->", offers)
      console.log("totalOffers------->", totalOffers)
      if(offers && offers.length > 0){
          setCurrentOffer(offers[0])
          const thumbnail = offers[0].applicableType === 'products' 
                  ? offers[0].applicableProducts?.[0]?.thumbnail.url 
                  : offers[0].applicableCategories?.[0]?.image.url
          console.log("thumbnail------->", thumbnail)
          setAltOfferBanner(thumbnail)
      }
  }, [offers])

  useEffect(()=> {
    console.log("openModal------->", openModal)
  }, [openModal])

  const handlePrevious = () => {
    if(currentPage - 1 === 0){
        setCurrentPage(totalOffers)
    }
    else setCurrentPage(page=> page -= 1)
  }

  const handleNext = () => {
    if(currentPage + 1 > totalOffers){
        setCurrentPage(1)
    }
    else setCurrentPage(page=> page += 1)
  }

  const openProductsModal = (offer) => {
    setSelectedOffer(offer)
    setOpenModal({type: "products", datas: offer.applicableProducts})
  }

  const openCategoriesModal = (offer) => {
    setSelectedOffer(offer)
    setOpenModal({type: "categories", datas: offer.applicableCategories})
  }

  const closeModal = () => {
    setSelectedOffer(null)
    setOpenModal({type: '', datas: null})
  }

  const getDiscountLabel = (offer) => {
    switch (offer.discountType) {
      case "percentage":
        return `${offer.discountValue}% Off`
      case "fixed":
        return `₹ ${offer.discountValue} Off`
      case "freeShipping":
        return "Free Shipping"
      case "buyOneGetOne":
        return "Buy 1 Get 1"
      default:
        return "Special Offer"
    }
  }

  return (
    <section className={`w-full py-12 md:py-16 px-4 md:px-6 bg-gradient-to-b from-slate-50 to-white
       dark:from-slate-900 dark:to-slate-950 ${sectionStyle && sectionStyle}`}>
      <div className={`max-w-6xl mx-auto ${containerStyle && containerStyle}`}>
        <div className="mb-4 md:mb-6">
          <h2 className={`text-[28px] md:text-[34px] font-bold text-slate-900 dark:text-white text-balance ${headlineStyle && headlineStyle}`}>
            Exclusive Offers
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
            Discover amazing deals on our best products and categories
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-xl bg-white dark:bg-slate-900 shadow-lg dark:shadow-2xl">
            <div className="relative h-64 md:h-96 lg:h-80">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <div className="h-full flex flex-col md:flex-row items-center justify-between p-6 md:p-10 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950">
                    
                    {
                        currentOffer &&
                            <div className="flex-1 flex flex-col justify-center mb-6 md:mb-0">
                              <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                                className="text-[20px] md:text-[30px] capitalize font-bold text-slate-900 dark:text-white mb-2 text-balance"
                              >
                                {currentOffer.name}
                              </motion.h3>

                              <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15, duration: 0.4 }}
                                className="text-slate-700 dark:text-slate-300 text-sm md:text-base mb-4 line-clamp-2"
                              >
                                {currentOffer.description}
                              </motion.p>

                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                                className="flex flex-wrap gap-2 mb-4"
                              >
                                <span className="inline-block text-[17px] bg-primaryDark text-white px-4 py-[6px] rounded-lg 
                                    font-bold text-lg md:text-xl">
                                  {getDiscountLabel(currentOffer)}
                                </span>
                                {currentOffer.minimumOrderValue > 0 && (
                                  <span className="inline-block text-[14px] text-secondary bg-slate-200 dark:bg-slate-700 
                                   dark:text-white font-medium px-3 py-2 rounded-lg text-xs md:text-sm">
                                    Min: ₹ {currentOffer.minimumOrderValue}
                                  </span>
                                )}
                              </motion.div>
                            
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25, duration: 0.4 }}
                                className="flex flex-wrap gap-2"
                              >
                                {currentOffer.applicableType === "allProducts" && (
                                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                                    All Products
                                  </button>
                                )}

                                {currentOffer.applicableType === "products" && currentOffer.applicableProducts?.length > 0 && (
                                  <button
                                    onClick={()=> openProductsModal(currentOffer)}
                                    className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
                                  >
                                    View {currentOffer.applicableProducts.length} Products
                                  </button>
                                )}

                                {currentOffer.applicableType === "categories" &&
                                  currentOffer.applicableCategories?.length > 0 && (
                                    <button
                                      onClick={()=> openCategoriesModal(currentOffer)}
                                      className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
                                    >
                                      View {currentOffer.applicableCategories.length} Categories
                                    </button>
                                  )}
                              </motion.div>
                            </div>
                    }

                    {currentOffer && currentOffer.offerBanner?.url && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="flex-1 flex items-center justify-center"
                      >
                        <img
                          src={currentOffer.offerBanner.url}
                          alt={currentOffer.name}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = {altOfferBanner}
                          }}
                          className="w-full h-auto max-h-56 md:max-h-64 object-cover rounded-lg"
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {totalOffers && totalOffers > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-white dark:bg-slate-800
                    text-slate-900 dark:text-white rounded-full grid place-items-center w-12 h-12 p-0 shadow-xl z-10 border border-dropdownBorder
                    transform-gpu will-change-transform transition-transform duration-200 ease-out hover:scale-110 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 bg-white dark:bg-slate-800
                    text-slate-900 dark:text-white rounded-full grid place-items-center w-12 h-12 p-0 shadow-xl z-10 border border-dropdownBorder
                    transform-gpu will-change-transform transition-transform duration-200 ease-out hover:scale-110 active:scale-95"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </>
          )}

          {totalOffers && totalOffers > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalOffers }).map((_, index) => (
                <motion.button
                  key={index + 1}
                  onClick={()=> setCurrentPage(index + 1)}
                  whileHover={{ scale: 1.2 }}
                  className={`transition-all rounded-full ${
                    index + 1=== currentPage
                      ? "w-8 h-2 bg-purple-500"
                      : "w-3 h-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {
        openModal.type === 'products' && openModal.datas.length > 0 &&
            <OfferProductsModal 
                offer={selectedOffer}
                applicableProducts={openModal.datas}
                onClose={closeModal}
            />
      }

      {
        openModal.type === 'categories' && openModal.datas.length > 0 &&
            <OfferCategoryModal 
                categories={openModal.datas}
                onClose={closeModal}
            />
      }

    </section>
  )
}

