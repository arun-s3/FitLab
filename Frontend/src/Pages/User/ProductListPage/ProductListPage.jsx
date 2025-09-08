import React,{useState, useEffect, useRef} from 'react'
import './ProductListPage.css'
import {useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import {debounce} from 'lodash'
import {motion, AnimatePresence} from "framer-motion"

import {VscSettings} from "react-icons/vsc"
import {RiArrowDropUpLine} from "react-icons/ri"
import {toast} from 'react-toastify'
import {Star} from "lucide-react"

import Header from '../../../Components/Header/Header'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import PriceSliderAndFilter from '../../../Components/PriceSliderAndFilter/PriceSliderAndFilter'
import RatingSlider from '../../../Components/RatingSlider/RatingSlider'
import TestPriceFilter from '../../../Components/PriceSliderAndFilter/TestPriceSliderAndFilter' // For Enhancing Original PriceFilter feature..will do it later
import ProductsDisplay from '../../../Components/ProductsDisplay/ProductsDisplay'
import ProductListingTools from '../../../Components/ProductListingTools/ProductListingTools'
import CategoryDisplay from '../../../Components/CategoryDisplay/CategoryDisplay'
import CartSidebar from '../../../Components/CartSidebar/CartSidebar'
import {getAllProducts, toggleProductStatus} from '../../../Slices/productSlice'
import {getTheCart, resetCartStates} from '../../../Slices/cartSlice'
import {capitalizeFirstLetter} from '../../../Utils/helperFunctions'
import ProductFilterSidebar from '../../../Components/ProductFilterSidebar/ProductFilterSidebar'



export default function ProductList({admin}){

    const headerBg = {
        backgroundImage: "url('/header-bg.png')",
        backgrounSize: 'cover'
    }

    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(3750)
    let firstSlideRef = useRef(false)

    const [rating, setRating] = useState(4.5)
    const [highestRating, setHighestRating] = useState(0)

    const [showFilter, setShowFilter] = useState({
        category: true,
        popularProducts: true,
        price: true,
        rating: true,
        brand: true,
        targetMuscles: true
    })

    const [showByGrid, setShowByGrid] = useState(true)

    const [filter, setFilter] = useState({categories: [], products: [], brands: [], targetMuscles: []})
    const [sorts, setSorts] = useState({})

    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(12)  

    const [popularProductsShowLabel, setPopularProductsShowLabel] = useState('See more')

    const [queryOptions, setQueryOptions] = useState({})

    const [isCartOpen, setIsCartOpen] = useState(false)

    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false)

    const {cart, productAdded, productRemoved, loading, error, message} = useSelector(state=> state.cart)    

    const popularProducts = [
        'benches', 'gymbell', 'treadmill', 'Ellipticals', 'bikes', 'proteinPowders', 'mutistationMachines', 'resistanceBands', 'yogaMats'
    ]
    const [morePopularProducts, setMorePopularProducts] = useState(0)

    const brands = ["Nike", "Adidas", "Under Armour", "Reebok", "Puma", "Gymshark"]

    const muscleGroups = ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Forearms", "Quadriceps", "Hamstrings", "Glutes", "Calves",
        "Core/Abs", "Full Body", "Cardio"]

    const sortMenu = [
        {name: 'Price: High to Low', value:'price', order:'-1', invisibleOnTable: true},
        {name: 'Price: Low to High', value:'price', order:'1', invisibleOnTable: true},
        {name: 'Ratings: High to Low', value:'averageRating', order:'1'}, {name: 'Ratings: Low to High', value:'averageRating', order:'-1'},
        {name: 'Featured', value:'featured'},
        {name: 'Best Sellers', value:'bestSellers'}, {name: 'Newest Arrivals', value:'newestArrivals'}
    ]

    const dispatch = useDispatch()

    const debouncedProducts = useRef(
        debounce(()=> {
            dispatch( getAllProducts({queryOptions}) )
        }, 1000) 
    ).current

    useEffect(()=> {
        dispatch(getTheCart())
    },[])

    useEffect(()=>{
        console.log("FILTER-->", JSON.stringify(filter))
        console.log("SORTS-->", JSON.stringify(sorts))
        setQueryOptions(queryOptions=> (
            {...queryOptions, filter: {...queryOptions.filter, ...filter}, sort: sorts, page: currentPage, limit,
                 averageRating: rating, highestRating}
        ))
    },[filter, sorts, currentPage, limit, rating, highestRating])

    useEffect(()=>{
        console.log('OUERYOPTIONS--------->', JSON.stringify(queryOptions))
        if(Object.keys(queryOptions).length){
            dispatch( getAllProducts({queryOptions}))
        }
    },[queryOptions])

    useEffect(()=>{
        if(firstSlideRef.current){
            setFilter({...filter, minPrice, maxPrice})
        }
    },[minPrice, maxPrice])

    useEffect(()=> {
        if(cart?.products && cart.products.length > 0){
          setIsCartOpen(true)
        }
        if(error && error.toLowerCase().includes('product')){
          console.log("Error from ProductDetailPage-->", error)
          toast.error(error)
          dispatch(resetCartStates())
        }
        if(productAdded){
          console.log("Product added to cart successfully!")
          setIsCartOpen(true)
          dispatch(resetCartStates())
        }
    },[error, productAdded, cart])

    const container = {
      hidden: { opacity: 0, height: 0 },
      show: {
        opacity: 1,
        height: "auto",
        transition: {
          duration: 0.3,
          when: "beforeChildren",
          staggerChildren: 0.1,
        },
      },
      exit: { opacity: 0, height: 0 },
    }

    const child = {
      hidden: { opacity: 0, x: -20 },
      show: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    }

    const toggleFilterSection = (section) => {
      setShowFilter((filterStatus) => ({
        ...filterStatus,
        [section]: !filterStatus[section],
      }))
    }

   const popularProductsHandler = (e, product)=>{
        console.log(`Product ${e.target.checked ? 'checked' : 'unchecked'}--->`, product)
        if(e.target.checked){
            console.log("Inside e.target.checked")
            setFilter({...filter, products: [...filter.products, product]})
        }
        if(!e.target.checked){
            console.log("Inside e.target.unchecked")
            const updatedProducts = filter.products.filter(item=> item !== product)
            setFilter(filter=> (
                {...filter, products: updatedProducts}
            ))
        }
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
        setFilter((filters) => ({
          ...filters,
          brands: filters.brands.includes(brand) ? filters.brands.filter((b) => b !== brand) : [...filters.brands, brand]
        }))
   }

    const handleMuscleChange = (muscle) => {
      setFilter((filters) => ({
        ...filters,
        targetMuscles: filters.targetMuscles.includes(muscle)
          ? filters.targetMuscles.filter((m) => m !== muscle)
          : [...filters.targetMuscles, muscle]
      }))
    }

    const applySidebarFilters = (appliedFilters)=> {
        console.log("Inside applySidebarFilters...")
        console.log("appliedFilters from ProductFilterSidebar------->", appliedFilters)
        if(appliedFilters.minPrice){
            setMinPrice(appliedFilters.minPrice)
        }
        if(appliedFilters.maxPrice){
            setMinPrice(appliedFilters.maxPrice)
        }
        if(appliedFilters.rating){
            setRating(appliedFilters.rating)
        }
        if(appliedFilters.highestRating){
            setHighestRating(appliedFilters.highestRating)
        }
        const {categories, brands, targetMuscles} = appliedFilters
        setFilter({...filter, categories, brands, targetMuscles, products: appliedFilters.popularProducts})
    }



    return(
        <>  
            <header style={headerBg}  className='h-[5rem]'>

                <Header/>

            </header>
            
            <BreadcrumbBar heading='shopping' />
                
            <main className='px-[60px] mt-[3rem] flex gap-[2.5rem] items-start justify-start' id='productlist'>
                

                <aside className='hidden xx-md:flex flex-col gap-[10px] basis-[15rem]'>

                    <div className='flex gap-[5px] items-center pb-[10px] border-b border-[#DEE2E7] filter-head'>
                        <VscSettings/>
                        <h3 className='text-[18px] font-[550] leading-[0.5px]'> Filter </h3>
                    </div>
                    <div className='pb-[10px] border-b border-[#DEE2E7]'>
                        <div className='flex justify-between items-center' 
                            id='filter-header' 
                            onClick={()=> toggleFilterSection('category')}
                        >
                                <h4 className='text-[15px] font-[500]'> By Category </h4>
                                <span className='cursor-pointer'> <RiArrowDropUpLine/> </span>
                        </div>
                        <AnimatePresence>
                            {showFilter.category && 
                                <motion.ul className='list-none cursor-pointer pr-[7px]'
                                    id='filter-body'
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                >

                                    <CategoryDisplay type='checkboxType' filter={filter} setFilter={setFilter}/>

                                </motion.ul>
                            }
                        </AnimatePresence>
                    </div>

                    <div className='pb-[10px] border-b border-[#DEE2E7]'> 
                        <div id='filter-header'
                             onClick={()=> toggleFilterSection('popularProducts')}
                        >
                                <h4>By Popular Products</h4>
                                <span className='cursor-pointer'> <RiArrowDropUpLine/> </span>
                        </div>
                        <AnimatePresence>
                            {showFilter.popularProducts && 
                                <motion.ul className='list-none'
                                    id='filter-body' 
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                    exit="hidden"
                                >
                                    {
                                        popularProducts.slice(0, 5 + morePopularProducts).map(product=> (
                                            <motion.li
                                                variants={child}
                                                whileHover={{ scale: 1.08 }}>
                                                    <div>
                                                        <motion.input type='checkbox' 
                                                            whileHover={{ rotate: 45 }}
                                                            id={product} 
                                                            value={product}
                                                            onChange={(e)=> popularProductsHandler(e, product)}/>
                                                        <label HTMLfor='gymbell' className=''> { capitalizeFirstLetter(product) } </label>
                                                    </div>
                                            </motion.li>
                                        ))
                                    }
                                <span className='mt-[5px] text-secondary text-[13px] cursor-pointer hover:underline transition duration-500' 
                                    onClick={()=> showMoreProducts()}>
                                  {popularProductsShowLabel}
                                </span>
                            </motion.ul>
                            }
                        </AnimatePresence>
                    </div>

                    <div className='pb-[10px] border-b border-[#DEE2E7]'>
                        <div id='filter-header'
                             onClick={()=> toggleFilterSection('price')}
                        >
                                <h4>Price Range</h4>
                                <span className='cursor-pointer'> <RiArrowDropUpLine/> </span>
                        </div>
                        <div id='filter-body'>
                            <AnimatePresence>
                                {
                                showFilter.price && 
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    < PriceSliderAndFilter priceGetter={{minPrice, maxPrice}}
                                         priceSetter={{setMinPrice, setMaxPrice}} 
                                         firstSlide={firstSlideRef}
                                    />
                                </motion.div>
                                }
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className='pb-[10px] border-b border-[#DEE2E7]'>
                        <div id='filter-header' 
                            onClick={()=> toggleFilterSection('rating')}
                        >
                                <h4>Ratings Range</h4>
                                <span className='cursor-pointer'> <RiArrowDropUpLine/> </span>
                        </div>
                        <div id='filter-body' className='mb-[10px]'>
                             <AnimatePresence>
                                {
                                showFilter.rating &&
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                            <RatingSlider rating={rating} 
                                                setRating={setRating} 
                                                highestRating={highestRating} 
                                                setHighestRating={setHighestRating}/>
                                    </motion.div>
                                } 
                            </AnimatePresence>  
                        </div>
                    </div>

                    <div className='pb-[10px] border-b border-[#DEE2E7]'>
                        <div id='filter-header'  
                            onClick={()=> toggleFilterSection('brand')}
                        >
                            <h4>By Brands</h4>
                            <span className='cursor-pointer'> <RiArrowDropUpLine/> </span>
                        </div>
                        <div id='filter-body'>
                            <AnimatePresence>
                                {showFilter.brand && (
                                  <motion.div
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                    exit="hidden"
                                    className="space-y-2 overflow-visible ml-[10px]"
                                  >
                                    {brands.map((brand) => (
                                      <motion.label key={brand} 
                                        variants={child}
                                        whileHover={{ scale: 1.08 }}
                                        className="flex items-center space-x-2 text-[#505050] hover:text-secondary cursor-pointer">
                                          <motion.input
                                            type="checkbox"
                                            whileHover={{ rotate: 45 }}
                                            checked={filter.brands.includes(brand)}
                                            onChange={()=> handleBrandChange(brand)}
                                            className=""
                                          />
                                          <span className="text-[13px] text-inherit dark:text-gray-300"> {brand} </span>
                                      </motion.label>
                                    ))}
                                  </motion.div>
                                )}
                            </AnimatePresence> 
                        </div>
                    </div>

                    <div className='pb-[10px]'>
                        <div id='filter-header'  
                            onClick={()=> toggleFilterSection('targetMuscles')}>
                                <h4> Target Muscles </h4>
                                <span className='cursor-pointer'> <RiArrowDropUpLine/> </span>
                        </div>
                        <div id='filter-body'>
                            <AnimatePresence>
                                {showFilter.targetMuscles && (
                                  <motion.div
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                    exit="hidden"
                                    className="grid grid-cols-2 gap-2 overflow-visible pl-2"
                                  >
                                    {muscleGroups.map((muscle) => (
                                      <motion.label key={muscle}
                                        variants={child}
                                        whileHover={{ scale: 1.08, x: 3, y: -2 }}
                                        className="flex items-center space-x-2 cursor-pointer text-gray-700 hover:text-secondary">
                                          <motion.input
                                            whileHover={{ rotate: 45 }}
                                            type="checkbox"
                                            checked={filter.targetMuscles.includes(muscle)}
                                            onChange={() => handleMuscleChange(muscle)}
                                            className=""
                                          />
                                          <span className="text-[13px] text-inherit dark:text-gray-300"> {muscle} </span>
                                      </motion.label>
                                    ))}
                                  </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                </aside>


                <section className='basis-full flex-grow'>
                    <div> 

                        <ProductListingTools showByGrid={showByGrid} 
                            setShowByGrid={setShowByGrid}
                            sortHandlers={{sorts, setSorts}}
                            sortMenu={sortMenu}
                            limiter={{limit, setLimit}}
                            showFilter={true}
                            filterHandler={()=> { console.log('Opening FilterSidebar...') ; setIsFilterSidebarOpen(true)}}
                            queryOptions={queryOptions}
                            setQueryOptions={setQueryOptions}
                        />
                             
                    </div>
                    
                    <div className='mt-[2rem] w-auto x-sm:w-full xx-md:w-[64%] lg:w-[85%] x-lg:w-auto'>

                        <ProductsDisplay gridView={showByGrid}
                            pageReader={{currentPage, setCurrentPage}}
                            limiter={{limit, setLimit}}
                            queryOptions={queryOptions}
                        />

                    </div>

                        <CartSidebar isOpen={isCartOpen} 
                            onClose={()=> setIsCartOpen(false)} 
                            retractedView={true} 
                        />

                        {   
                            isFilterSidebarOpen &&
                                <ProductFilterSidebar isOpen={isFilterSidebarOpen}
                                    onClose={() => setIsFilterSidebarOpen(false)} 
                                    popularProducts={popularProducts}
                                    muscleGroups={muscleGroups}
                                    brands={brands}
                                    applySidebarFilters={applySidebarFilters}
                                />
                        }

                </section>
            </main>
        </>
    )
}