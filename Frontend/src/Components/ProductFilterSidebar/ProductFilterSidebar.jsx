import React, {useState, useEffect, useRef} from "react"
import {motion, AnimatePresence} from "framer-motion"

import {X, Filter, SlidersHorizontal, ChevronDown, ChevronUp, Star, Zap} from "lucide-react"

import CategoryDisplay from '../CategoryDisplay/CategoryDisplay'
import PriceSliderAndFilter from '../PriceSliderAndFilter/PriceSliderAndFilter'
import RatingSlider from '../RatingSlider/RatingSlider'
import {capitalizeFirstLetter} from '../../Utils/helperFunctions'



export default function ProductFilterSidebar({isOpen, onClose, popularProducts, muscleGroups, brands, applySidebarFilters}){

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    popularProducts: true,
    price: true,
    brand: true,
    muscle: true,
    rating: true,
  })

  const [selectedFilters, setSelectedFilters] = useState({
    popularProducts: [],
    brands: [],
    targetMuscles: [],
  })

  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(3750)
  let firstSlideRef = useRef(false)

  const [rating, setRating] = useState(0)

  const [morePopularProducts, setMorePopularProducts] = useState(0)
  const [popularProductsShowLabel, setPopularProductsShowLabel] = useState('See more')

  const [categoryFilter, setCategoryFilter] = useState({categories: []})
  const [clearCategoryFilter, setClearCategoryFilter] = useState(false)

  useEffect(()=> {
    console.log('Opened ProductFilterSidebar....')
    console.log("isOpen--->", isOpen)
  }, [isOpen])

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const showMoreProducts = ()=> {
      setMorePopularProducts(count=> {
          if( popularProducts.length - (count * 2) < 0 ){
              return count-=5
          }else{
              if(count + 10 >= popularProducts.length){
                  setPopularProductsShowLabel('See less')
              }else{
                  setPopularProductsShowLabel('See more')
              }
              return count+=5
          }
      })
  }

  const handleBrandChange = (brand) => {
    setSelectedFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand) ? prev.brands.filter((b) => b !== brand) : [...prev.brands, brand],
    }))
  }

    const handleMuscleChange = (muscle) => {
      setSelectedFilters((prev) => ({
        ...prev,
        targetMuscles: prev.targetMuscles.includes(muscle)
          ? prev.targetMuscles.filter((m) => m !== muscle)
          : [...prev.targetMuscles, muscle],
      }))
    }

    const handleProductChange = (product)=> {
      setSelectedFilters((prev) => ({
        ...prev,
        popularProducts: prev.popularProducts.includes(product) ? prev.popularProducts.filter((p) => p !== product) : [...prev.popularProducts, product]
      }))
    }

    const applyFilters = ()=> {
      let appliedFilters = {}
        if(firstSlideRef.current){
            appliedFilters = {minPrice, maxPrice}
        }
        appliedFilters.targetMuscles = 
        appliedFilters = {...appliedFilters, ...selectedFilters, rating, categories: categoryFilter.categories}
        applySidebarFilters(appliedFilters)
        onClose()
    }

    const clearAllFilters = () => {
      setSelectedFilters({
        popularProducts: [],
        brands: [],
        targetMuscles: [],
      })
      setRating(0)
      setCategoryFilter({categories: []})
    }



  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>

        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 200,
            }}
            className="fixed left-0 top-0 h-full w-80 bg-inputBgSecondary dark:bg-gray-900 shadow-xl z-50 overflow-y-auto"
          >


            <div className="flex items-center justify-between p-4 border-b border-dropdownBorder dark:border-gray-700">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-secondary dark:text-white"> Filters </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted dark:text-gray-400" />
              </button>
            </div>

            <div className="p-4 space-y-6 mb-16">
              <button
                onClick={clearAllFilters}
                className="w-full text-sm text-right text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300
                 font-medium transition-colors"
              >
                Clear All Filters
              </button>

              <div className="space-y-3">
                <button
                  onClick={() => toggleSection("category")}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="text-[15px] font-medium tracking-[0.5px] text-gray-900 dark:text-white"> Category </h3>
                  {expandedSections.category ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                {
                 expandedSections.category &&

                    <div className="ml-[10px] w-[96%]">

                        <CategoryDisplay type='checkboxType' filter={categoryFilter} setFilter={setCategoryFilter}/>

                    </div>
                }
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => toggleSection("popularProducts")}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="text-[15px] font-medium tracking-[0.5px] text-gray-900 dark:text-white"> Popular Products </h3>
                  {expandedSections.popularProducts ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                {expandedSections.popularProducts && 
                <ul className='list-none ml-[10px] space-y-2 overflow-visible'>
                    {
                        popularProducts.slice(0, 5 + morePopularProducts).map(product=> (
                            <motion.li 
                              initial={{ scale: 0.7, opacity: 0, y: 15 }}
                              animate={{ scale: 1, opacity: 1, y: 0 }}
                              whileHover={{ scale: 1.08 }}
                              className="space-y-2 overflow-visible">
                                <div className="flex items-center space-x-2 text-gray-700 hover:text-secondary cursor-pointer">
                                    <motion.input type='checkbox' 
                                        className='className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-0' 
                                        whileHover={{ rotate: 45 }}
                                        id={product}
                                        checked={selectedFilters.popularProducts.includes(product)}
                                        onChange={(e)=> handleProductChange(product)}/>
                                    <label HTMLfor={product}
                                        className="text-sm text-inherit dark:text-gray-300">
                                        { capitalizeFirstLetter(product) } 
                                    </label>
                                </div>
                            </motion.li>
                        ))
                    }
                    <span className='mt-[5px] text-secondary text-[13px] cursor-pointer hover:underline transition duration-500' 
                        onClick={()=> showMoreProducts()}>
                      {popularProductsShowLabel}
                    </span>
                </ul>
                }
                </div>

                
              <div className="space-y-3">
                <button
                  onClick={() => toggleSection("price")}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="text-[15px] font-medium tracking-[0.5px] text-gray-900 dark:text-whitee"> Price Range </h3>
                  {expandedSections.price ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {
                expandedSections.price && 
                    <div className="ml-[10px] w-[95%]">

                        <PriceSliderAndFilter priceGetter={{minPrice, maxPrice}} 
                          priceSetter={{setMinPrice, setMaxPrice}} 
                          firstSlide={firstSlideRef} 
                        />
                    </div>
                }
                </div>  


              <div className="space-y-3">
                <button
                  onClick={() => toggleSection("brand")}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="text-[15px] font-medium tracking-[0.5px] text-gray-900 dark:text-white"> Brand </h3>
                  {expandedSections.brand ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSections.brand && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2 overflow-visible ml-[10px]"
                    >
                      {brands.map((brand) => (
                        <motion.label key={brand} 
                          initial={{ scale: 0.7, opacity: 0, y: 15 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.08 }}
                          className="flex items-center space-x-2 text-gray-700 hover:text-secondary cursor-pointer">
                            <motion.input
                              type="checkbox"
                              whileHover={{ rotate: 45 }}
                              checked={selectedFilters.brands.includes(brand)}
                              onChange={()=> handleBrandChange(brand)}
                              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-0"
                            />
                            <span className="text-sm text-inherit dark:text-gray-300"> {brand} </span>
                        </motion.label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-3">
                <button
                  onClick={()=> toggleSection("muscle")}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="text-[15px] font-medium tracking-[0.5px] text-gray-900 dark:text-white"> Target Muscles </h3>
                  {expandedSections.muscle ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSections.muscle && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-2 gap-2 overflow-visible pl-2"
                    >
                      {muscleGroups.map((muscle, index) => (
                        <motion.label key={muscle}
                          initial={{ scale: 0.7, opacity: 0, y: 15 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.08, x: 3, y: -2 }}
                          className="flex items-center space-x-2 cursor-pointer text-gray-700 hover:text-secondary">
                            <motion.input
                              whileHover={{ scale: 1.2, rotate: 45 }}
                              type="checkbox"
                              checked={selectedFilters.targetMuscles.includes(muscle)}
                              onChange={()=> handleMuscleChange(muscle)}
                              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-0"
                            />
                            <span className="text-sm text-inherit dark:text-gray-300"> {muscle} </span>
                        </motion.label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => toggleSection("rating")}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="text-[15px] font-medium tracking-[0.5px] text-gray-900 dark:text-white"> Rating </h3>
                  {expandedSections.rating ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSections.rating && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-[10px]"
                    >
                    {
                        <div className="mt-[5px] w-[90%]">

                            <RatingSlider rating={rating} 
                              setRating={setRating} 
                              indentSlider='10px'/>

                        </div>
                    }
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            <div className="sticky bottom-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={applyFilters}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Apply Filters
              </button>
            </div>


          </motion.div>
        )}

      </AnimatePresence>
    </>
  )
}

