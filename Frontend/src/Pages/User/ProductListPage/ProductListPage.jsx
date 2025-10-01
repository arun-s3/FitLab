import React,{useState, useEffect, useRef, useContext} from 'react'
import {useLocation} from 'react-router-dom'
import './ProductListPage.css'
import {useDispatch, useSelector} from 'react-redux'
import {debounce} from 'lodash'
import {motion, AnimatePresence} from "framer-motion"

import {toast} from 'react-toastify'

import Header from '../../../Components/Header/Header'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import TestPriceFilter from '../../../Components/PriceSliderAndFilter/TestPriceSliderAndFilter' // For Enhancing Original PriceFilter feature..will do it later
import ProductsDisplay from '../../../Components/ProductsDisplay/ProductsDisplay'
import ProductListingTools from '../../../Components/ProductListingTools/ProductListingTools'
import CartSidebar from '../../../Components/CartSidebar/CartSidebar'
import CouponApplicableModal from './CouponApplicableModal'
import {getAllProducts, toggleProductStatus} from '../../../Slices/productSlice'
import {getTheCart, resetCartStates} from '../../../Slices/cartSlice'
import {ProtectedUserContext} from '../../../Components/ProtectedUserRoutes/ProtectedUserRoutes'
import ProductFilterSidebar from '../../../Components/ProductFilterSidebar/ProductFilterSidebar'
import FilterModule from './FilterModule'



export default function ProductList({admin}){


    const {setIsAuthModalOpen, checkAuthOrOpenModal} = useContext(ProtectedUserContext)
    setIsAuthModalOpen({status: false, accessFor: 'shopping'})
    
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(3750)
    let firstSlideRef = useRef(false)

    const [rating, setRating] = useState(0)

    const [showByGrid, setShowByGrid] = useState(true)

    const [filter, setFilter] = useState({categories: [], products: [], brands: [], targetMuscles: []})
    const [sorts, setSorts] = useState({})

    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(12)  

    const [queryOptions, setQueryOptions] = useState({})

    const [isCartOpen, setIsCartOpen] = useState(false)

    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false)

    const [openCouponApplicableModal, setOpenCouponApplicableModal] = useState({status: false, code: '', products: []})

    const {cart, productAdded, productRemoved, loading, error, message} = useSelector(state=> state.cart)    
    
    const location = useLocation()

    useEffect(()=> {
        if(location && location.state.showCouponApplicableModal){
            const {couponCode, products} = location.state
            setTimeout(()=> setOpenCouponApplicableModal({status: true, code: couponCode, products}), 1500)
        }
    }, [location])

    const headerBg = {
        backgroundImage: "url('/header-bg.png')",
        backgrounSize: 'cover'
    }


    const sortMenu = [
        {name: 'Price: High to Low', value:'price', order:'-1', invisibleOnTable: true},
        {name: 'Price: Low to High', value:'price', order:'1', invisibleOnTable: true},
        {name: 'Ratings: High to Low', value:'averageRating', order:'1'}, {name: 'Ratings: Low to High', value:'averageRating', order:'-1'},
        {name: 'Featured', value:'featured'},
        {name: 'Best Sellers', value:'bestSellers'}, {name: 'Newest Arrivals', value:'newestArrivals'}
    ]

    const popularProducts = [
        'benches', 'gymbell', 'treadmill', 'Ellipticals', 'bikes', 'proteinPowders', 'mutistationMachines', 'resistanceBands', 'yogaMats'
    ]

    const brands = ["Nike", "Adidas", "Under Armour", "Reebok", "Puma", "Gymshark"]

    const muscleGroups = ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Forearms", "Quadriceps", "Hamstrings", "Glutes", "Calves",
        "Core/Abs", "Full Body", "Cardio"]


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
                 averageRating: rating}
        ))
    },[filter, sorts, currentPage, limit, rating])

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
        if(message && message.includes("Coupon is not applicable to the selected products")){
            toast.warn(message, {autoClose: 5000})
        }
    },[error, productAdded, message, cart])


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

                
                <motion.div
                  initial={{ x: "-100%", opacity: 0 }}  
                  animate={{ x: 0, opacity: 1 }}        
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                
                    <FilterModule filter={filter} 
                        setFilter={setFilter} 
                        rating={rating} 
                        setRating={setRating}
                        popularProducts={popularProducts}
                        muscleGroups={muscleGroups}
                        brands={brands}
                    />

                </motion.div>


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
                            checkAuthOrOpenModal={checkAuthOrOpenModal}
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

                        { 
                            openCouponApplicableModal.status &&
                              <CouponApplicableModal
                                open={openCouponApplicableModal.status}
                                onClose={()=> setOpenCouponApplicableModal({status: false, code:'', products: []})}
                                couponLabel={openCouponApplicableModal.code}
                                products={openCouponApplicableModal.products}
                              />
                        }

                </section>
            </main>
        </>
    )
}