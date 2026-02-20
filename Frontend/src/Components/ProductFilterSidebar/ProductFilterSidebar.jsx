import React, {useState, useEffect, useRef} from "react"
import {motion, AnimatePresence} from "framer-motion"

import {X, Filter, SlidersHorizontal, ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, Shield} from "lucide-react"
import {MdOutlineArrowDropDownCircle} from "react-icons/md"

import CategoryDisplay from '../CategoryDisplay/CategoryDisplay'
import PriceSliderAndFilter from '../PriceSliderAndFilter/PriceSliderAndFilter'
import RatingSlider from '../RatingSlider/RatingSlider'
import StockFilter from "./StockFilter"
import {capitalizeFirstLetter} from '../../Utils/helperFunctions'
import {DateSelector} from '../Calender/Calender'


export default function ProductFilterSidebar({isOpen, onClose, popularProducts, muscleGroups, brands, isAdmin = false, saveCurrentFilters,
    savedFilters, applySidebarFilters, onClearedFilters}){

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    popularProducts: true,
    price: true,
    brand: true,
    muscle: true,
    productStatus: true,
    dateRange: true,
    rating: true,
    stock: true
  })

  const [selectedFilters, setSelectedFilters] = useState({
    popularProducts: [],
    brands: [],
    targetMuscles: [],
    productStatus: "all",
    startDate: "",
    endDate: ""
  })

  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(3750)
  let firstSlideRef = useRef(false)

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const [rating, setRating] = useState(0)

  const [morePopularProducts, setMorePopularProducts] = useState(0)
  const [popularProductsShowLabel, setPopularProductsShowLabel] = useState('See more')

  const [categoryFilter, setCategoryFilter] = useState({categories: []})

  const [maxStock, setMaxStock] = useState(null)

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const productStatusOptions = [
    { value: "all", label: "All Products", icon: Clock, color: "text-neutral-400" },
    { value: "active", label: "Active Products", icon: CheckCircle, color: "text-green-400" },
    { value: "blocked", label: "Blocked Products", icon: XCircle, color: "text-red-400" },
  ]

  useEffect(()=> {
    if(startDate){
      setSelectedFilters((filters) => ({
        ...filters, startDate: startDate.toDateString()
      }))
    }else{
      setSelectedFilters((filters) => ({
        ...filters, startDate: ""
      }))
    }
    if(endDate){
      setSelectedFilters((filters) => ({
        ...filters, endDate: endDate.toDateString()
      }))
    }else{
      setSelectedFilters((filters) => ({
        ...filters, endDate: ""
      }))
    }
  }, [startDate, endDate])

  useEffect(()=> {
    const hasPreviousFilters = Object.keys(savedFilters).length > 0
    if(isOpen && hasPreviousFilters) {
        setSelectedFilters(savedFilters.selectedFilters)
        setRating(savedFilters.rating)
        setCategoryFilter(savedFilters.categoryFilter)
        setMinPrice(savedFilters.minPrice)
        setMaxPrice(savedFilters.maxPrice)
        setMaxStock(savedFilters.maxStock)
    }
  }, [isOpen, savedFilters])

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

    const handleStatusChange = (status) => {
      setSelectedFilters((prev) => ({
        ...prev,
        productStatus: status,
      }))
      setIsStatusDropdownOpen(false)
    }

    const applyFilters = ()=> {
      let appliedFilters = {}
        if(firstSlideRef.current){
            appliedFilters = {minPrice, maxPrice}
        }
        appliedFilters = {...appliedFilters, ...selectedFilters, rating, maxStock, categories: categoryFilter.categories}
        applySidebarFilters(appliedFilters)
        saveCurrentFilters({selectedFilters, rating, maxStock, categoryFilter, minPrice, maxPrice})
        onClose()
    }

    const clearAllFilters = () => {
      setSelectedFilters({
        popularProducts: [],
        brands: [],
        targetMuscles: [],
        productStatus: "all",
        startDate: "",
        endDate: ""
      })
      setRating(0)
      setMaxStock(null)
      setCategoryFilter({categories: []})
      saveCurrentFilters({})
      onClearedFilters()
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

                        {
                            savedFilters.categoryFilter && savedFilters.categoryFilter.categories.length > 0 
                                ? 
                                <div className="flex gap-[7px]">
                                    <div className="border border-inputBorderLow px-4 py-[7px] rounded-[8px] max-w-[15rem]">
                                        <p className="flex items-start gap-[7px]">
                                            <span className="text-[12px] font-medium text-muted whitespace-nowrap"> Categories: </span>
                                            <span className="text-[12px] text-secondary whitespace-pre-wrap line-clamp-2 break-words">
                                                {savedFilters.categoryFilter.categories.toString()} 
                                            </span>
                                        </p> 
                                        {savedFilters.categoryFilter?.subCategories &&
                                            <p className="mt-[5px] flex items-start gap-[7px]"> 
                                                <span className="text-[12px] font-medium text-muted whitespace-nowrap"> Sub-Categories: </span>
                                                <span className="text-[12px] text-secondary whitespace-pre-wrap line-clamp-2 break-words">
                                                 {savedFilters.categoryFilter.subCategories} 
                                                </span>
                                            </p>
                                        }
                                    </div>
                                    <X className="w-[15px] h-[15px] text-red-500 cursor-pointer hover:scale-110" onClick={()=> {
                                        const {categoryFilter, ...rest} = savedFilters
                                        saveCurrentFilters(rest)
                                    }} />
                                </div>
                                :
                                <CategoryDisplay type='checkboxType' filter={categoryFilter} setFilter={setCategoryFilter}/>
                        }                        
                    </div>
                }
              </div>

              {
                isAdmin &&
                <>
                <div className="space-y-3 relative">
                  <button
                    onClick={() => toggleSection("productStatus")}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="text-[15px] font-medium tracking-[0.5px] text-gray-900 dark:text-white"> Product Status </h3>
                    {expandedSections.productStatus ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                </button>

                <AnimatePresence>
                  {expandedSections.productStatus && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="space-y-3 pl-2"
                    >
                      <div className="">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.15, ease: "easeInOut" }}
                          onClick={()=> setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                          className="w-full flex items-center justify-between px-3 py-[8px] bg-whitesmoke border border-dropdownBorder
                           rounded-lg text-white hover:border-purple-400/50 transition-all duration-200"
                        >
                          <div className="flex items-center gap-2">
                            {(() => {
                              const selectedOption = productStatusOptions.find(
                                (option) => option.value === selectedFilters.productStatus,
                              )
                              const IconComponent = selectedOption?.icon || Clock
                              return (
                                <>
                                  <div>
                                    <IconComponent
                                      className={`w-4 h-4 ${selectedOption?.color || "text-neutral-400"}`}
                                    />
                                  </div>
                                  <span className="text-[14px] text-secondary font-medium">{selectedOption?.label || "Select Status"}</span>
                                </>
                              )
                            })()}
                          </div>
                          <motion.div
                            animate={{ rotate: isStatusDropdownOpen ? 180 : 0 }}
                            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                          >
                            <ChevronDown className="w-4 h-4 text-secondary" />
                          </motion.div>
                        </motion.button>

                        <AnimatePresence>
                          {isStatusDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -5, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.95 }}
                              transition={{ duration: 0.1, ease: 'easeOut' }}
                              className="absolute top-full left-0 right-0 w-full mt-2 bg-whitesmoke text-[13px] border 
                                border-dropdownBorder rounded-lg shadow-xl z-50 overflow-hidden"
                            >
                              {productStatusOptions.map((option, index) => {
                                const IconComponent = option.icon
                                return (
                                  <motion.button
                                    key={option.value}
                                    initial={{ x: -10 }}
                                    animate={{ x: 0 }}
                                    transition={{ duration: 0.1, ease: 'circInOut' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleStatusChange(option.value)}
                                    className={`w-full flex items-center gap-3 px-3 py-[10px] text-left transition-all duration-200 cursor-pointer ${
                                      selectedFilters.productStatus === option.value
                                        ? "bg-purple-500/20 border-l-4 border-purple-400"
                                        : "hover:bg-inputBorderLow"
                                    }`}
                                  >
                                      <IconComponent className={`w-4 h-4 ${option.color}`} />
                                    <span
                                      className={`font-medium ${
                                        selectedFilters.productStatus === option.value
                                          ? "text-secondary"
                                          : "text-muted"
                                      }`}
                                    >
                                      {option.label}
                                    </span>
                                    {selectedFilters.productStatus === option.value && (
                                      <div
                                        className="ml-auto w-2 h-2 bg-purple-400 rounded-full"
                                      />
                                    )}
                                  </motion.button>
                                )
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-3 relative">
                  <button
                    onClick={() => toggleSection("dateRange")}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="text-[15px] font-medium tracking-[0.5px] text-gray-900 dark:text-white"> Date Range </h3>
                    {expandedSections.dateRange ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                </button>

                <AnimatePresence>
                  {expandedSections.dateRange && (
                    <motion.div
                      initial={{ opacity: 0, y: -5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="space-y-4 pl-2"
                    >
                      <motion.div
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, ease: 'easeOut'  }}
                        className="space-y-3"
                      >
                        {/* <div>
                          <label className="block text-xs text-secondary font-bold mb-2 uppercase">Start Date</label>
                          <motion.input
                            whileFocus={{ scale: 1.02, borderColor: "#60a5fa" }}
                            type="date"
                            value={selectedFilters.startDate}
                            onChange={(e) =>
                              setSelectedFilters((prev) => ({
                                ...prev,
                                startDate: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-sm text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-secondary font-bold mb-2 uppercase">End Date</label>
                          <motion.input
                            whileFocus={{ scale: 1.02, borderColor: "#60a5fa" }}
                            type="date"
                            value={selectedFilters.endDate}
                            onChange={(e) =>
                              setSelectedFilters((prev) => ({
                                ...prev,
                                endDate: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-sm text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-200"
                          />
                        </div> */}

                        <DateSelector 
                          dateGetter={{startDate, endDate}} 
                          dateSetter={{setStartDate, setEndDate}} 
                          className="!h-[2.2rem] !border-inputBorderLow !rounded-[6px] !focus:ring-secondary"
                          iconClassName="!text-[#b46fe3] !ml-[3px]"
                          calendarClassName="!bg-white !rounded-lg !shadow-lg !p-2 !border !border-dropdownBorder"
                          // strokeColor="text-[#b46fe3] ml-[2px]"
                        />
                        
                        {(selectedFilters.startDate || selectedFilters.endDate) && (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                            className="text-center px-3 py-[4px] bg-whitesmoke rounded-lg border border-blue-400/20"
                          >
                            <span className="text-secondary font-bold text-[12px]">
                              {
                                selectedFilters.startDate && selectedFilters.endDate 
                                  ? `${selectedFilters.startDate} → ${selectedFilters.endDate}`
                                  : selectedFilters.startDate 
                                  ? `From ${selectedFilters.startDate}`
                                  : selectedFilters.endDate
                                  ? `Till ${selectedFilters.endDate}`
                                  : null
                              }
                            </span>
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              </>
              }

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
                                        className='w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-0' 
                                        whileHover={{ rotate: 45 }}
                                        id={product}
                                        checked={selectedFilters.popularProducts.includes(product)}
                                        onChange={(e)=> handleProductChange(product)}/>
                                    <label htmlFor={product}
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
                  <h3 className="text-[15px] font-medium tracking-[0.5px] text-gray-900 dark:text-white"> Price Range </h3>
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
                              givenRating={savedFilters?.rating ? savedFilters.rating : null}
                              indentSlider='10px'/>

                        </div>
                    }
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {
                isAdmin &&
                    <div className="space-y-3">
                        <button
                          onClick={() => toggleSection("stock")}
                          className="mt-16 flex items-center justify-between w-full text-left"
                        >
                          <h3 className="text-[15px] font-medium tracking-[0.5px] text-gray-900 dark:text-white"> Stocks </h3>
                          {expandedSections.stock ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          )}
                        </button>

                        <AnimatePresence>
                          {expandedSections.stock && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-[10px]"
                            >
                            {
                                <div className="mt-[5px] w-[90%]">
                                
                                    <StockFilter
                                        onStockChange={(value)=> setMaxStock(value)}
                                        onReset={()=> setMaxStock(null)}
                                        givenStock={maxStock}
                                    />
                                </div>
                            }
                            </motion.div>
                          )}
                        </AnimatePresence>
                    </div>
              }

            </div>

            <div className="sticky bottom-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-[100]">
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

