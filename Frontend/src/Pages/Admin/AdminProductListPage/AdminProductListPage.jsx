import React,{useState, useEffect, useRef} from 'react'
import './AdminProductListPage.css'
import {useNavigate, useOutletContext} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {motion} from 'framer-motion'

import {toast} from 'react-toastify'
import {LiaSlidersHSolid} from "react-icons/lia"
import {FiDownload} from "react-icons/fi"
import {RiArrowDropDownLine} from "react-icons/ri"
import {IoMdAdd} from "react-icons/io"

import {resetStates} from '../../../Slices/productSlice'
import ProductListingTools from '../../../Components/ProductListingTools/ProductListingTools'
import {SitePrimaryButtonWithShadow} from '../../../Components/SiteButtons/SiteButtons'
import {getAllProducts} from '../../../Slices/productSlice'
import ListingTabs from './ListingTabs'
import ProductsDisplay from '../../../Components/ProductsDisplay/ProductsDisplay'
import ProductFilterForAdmin from '../../../Components/ProductFilterForAdmin/ProductFilterForAdmin'
import ProductFilterSidebar from '../../../Components/ProductFilterSidebar/ProductFilterSidebar'



export default function AdminProductListPage(){

    const [showSortBy, setShowSortBy] = useState(false)
    const [showByGrid, setShowByGrid] = useState(true)
    const [showByTable, setShowByTable] = useState(false)
    const [toggleTab, setToggleTab] = useState({goTo: 'all'})

    const [showTheseProducts, setShowTheseProducts] = useState([])

    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(3750)

    const [showFilter, setShowFilter] = useState(false)
    const [filter, setFilter] = useState({status: 'all', categories: [], brands: []})
    const [totalFilter, setTotalFilter] = useState({})
    const mouseInFilter = useRef(true)

    const [limit, setLimit] = useState(12)  
    const [currentPage, setCurrentPage] = useState(1)
    const [sorts, setSorts] = useState({})
    const [queryOptions, setQueryOptions] = useState({})

    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {products, message} = useSelector(state=> state.productStore)

    const {setHeaderZIndex} = useOutletContext()

    const popularProducts = [
        'benches', 'gymbell', 'treadmill', 'Ellipticals', 'bikes', 'proteinPowders', 'mutistationMachines', 'resistanceBands', 'yogaMats'
    ]

    const brands = ["Nike", "Adidas", "Under Armour", "Reebok", "Puma", "Gymshark"]

    const muscleGroups = ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Forearms", "Quadriceps", "Hamstrings", "Glutes", "Calves",
        "Core/Abs", "Full Body", "Cardio"]

    useEffect(()=>{
        setShowTheseProducts(products)
    },[])

    useEffect(()=> {
        if(message && message?.includes('block')){
          console.log("message arrived-->", message)
          toast.success(`${message} successfully`)
        }
      },[message])

    useEffect(()=>{
        setTotalFilter({...filter, minPrice, maxPrice})
        console.log("TotalFilters-->", JSON.stringify(totalFilter))
    },[filter, minPrice, maxPrice])

    useEffect(()=>{
        console.log("FILTER-->", JSON.stringify(totalFilter))
        console.log("SORTS-->", JSON.stringify(sorts))
        setQueryOptions( {filter: {...queryOptions.filter, ...totalFilter}, sort: {...queryOptions.sort, ...sorts}, page: currentPage, limit} )
    },[totalFilter, sorts, currentPage, limit])

    useEffect(()=>{
        console.log('OUERYOPTIONS--------->', JSON.stringify(queryOptions))
        if(Object.keys(queryOptions).length){
            dispatch( getAllProducts({queryOptions}))
        }
    },[queryOptions])

    useEffect(()=> {
        if(setHeaderZIndex && isFilterSidebarOpen){
            setHeaderZIndex(0)
        }else{
            setHeaderZIndex(10)
        }
    }, [isFilterSidebarOpen])

    const showProducts = (type)=>{
        console.log("Inside showProducts(), type--", type)
        setToggleTab({goTo: type})
        if(type == 'all'){
            setShowTheseProducts(products)
        }
        if(type == 'active'){
            setShowTheseProducts( products.filter(product=> !product.isBlocked) )
        }
        if(type == 'blocked'){
            setShowTheseProducts( products.filter(product=> product.isBlocked) )
        }
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
        const {categories, brands, targetMuscles, startDate, endDate, productStatus: status, popularProducts: products, rating} = appliedFilters
        setFilter({...filter, categories, brands, targetMuscles, products, startDate, endDate, status, averageRating: rating})
    }



    return(

        <section id='AdminProductList' >

            <header className='flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-center'>
                <h1 className='w-full md:w-auto'> Products </h1>
                <div className='w-full md:w-auto flex items-center justify-between md:justify-normal gap-[10px] xx-md:gap-[10px]
                 lg:gap-[1.5rem] x-md:gap-[1.5rem]'>
                    <SitePrimaryButtonWithShadow 
                        tailwindClasses="xxs-sm:text-[13px] x-md:text-[14px] xx-md:text-[13px] lg:text-[14px] xxs-sm:py-[3px]
                            xx-md:py-[3px] lg:py-[4px] x-md:py-[4px] xxs-sm:rounded-[6px] xx-md:rounded-[6px] lg:rounded-[8px] x-md:rounded-[8px]"
                        className='chip relative'  
                        animated={true}
                        clickHandler={(e)=> {
                            setIsFilterSidebarOpen(true)
                        }} 
                    >
                        <i>
                            <LiaSlidersHSolid/>
                        </i>
                        <span> Filter </span>
                    </SitePrimaryButtonWithShadow>
                    <SitePrimaryButtonWithShadow 
                        tailwindClasses="xxs-sm:text-[13px] x-md:text-[14px] xx-md:text-[13px] lg:text-[14px] xxs-sm:py-[3px]
                            xx-md:py-[3px] lg:py-[4px] x-md:py-[4px] xxs-sm:rounded-[6px] xx-md:rounded-[6px] lg:rounded-[8px] x-md:rounded-[8px]"
                        className='chip' 
                        animated={true}
                    >
                        <i>
                            <FiDownload/>
                        </i>
                        <span> Export </span>
                        <i>
                            <RiArrowDropDownLine/>
                        </i>
                    </SitePrimaryButtonWithShadow>
                    <SitePrimaryButtonWithShadow 
                        tailwindClasses="xxs-sm:text-[13px] x-md:text-[14px] xx-md:text-[13px] lg:text-[14px] xxs-sm:py-[3px]
                            xx-md:py-[3px] lg:py-[4px] x-md:py-[4px] xxs-sm:rounded-[6px] xx-md:rounded-[6px] lg:rounded-[8px] x-md:rounded-[8px]"
                        clickHandler={()=> navigate('/admin/products/add')}
                        animated={true}
                    >
                        <i>
                            <IoMdAdd/>
                        </i>
                        <span className='hidden md:inline-block'> Add new Product </span>
                        <span className='inline-block md:hidden'> Add Product </span>
                    </SitePrimaryButtonWithShadow>
                </div>
            </header>
            <main className='relative mt-[4.3rem]'>

                <ListingTabs showProducts={showProducts}
                    toggleTab={toggleTab}
                    setShowByGrid={setShowByGrid}
                    setShowByTable={setShowByTable}
                />

                <div className='border py-[1rem] px-[2rem] bg-white'>

                    <ProductListingTools admin={true} 
                        showSortBy={showSortBy} 
                        setShowSortBy={setShowSortBy} 
                        showByTable={showByTable}
                        sortHandlers={{sorts, setSorts}} 
                        limiter={{limit, setLimit}}
                        queryOptions={queryOptions}
                        setQueryOptions={setQueryOptions}
                    />

                    <div className='mt-[2rem] px-[2rem]'>

                        <ProductsDisplay gridView={showByGrid} 
                            showByTable={showByTable} 
                            pageReader={{currentPage, setCurrentPage}} 
                            limiter={{limit, setLimit}} 
                            showTheseProducts={showTheseProducts} 
                            admin={true}
                        />

                    </div>

                </div>
            </main>

                {   
                    isFilterSidebarOpen &&
                        <ProductFilterSidebar isOpen={isFilterSidebarOpen}
                            onClose={() => setIsFilterSidebarOpen(false)} 
                            isAdmin={true}
                            popularProducts={popularProducts}
                            muscleGroups={muscleGroups}
                            brands={brands}
                            applySidebarFilters={applySidebarFilters}
                        />
                }

        </section>
    )
}