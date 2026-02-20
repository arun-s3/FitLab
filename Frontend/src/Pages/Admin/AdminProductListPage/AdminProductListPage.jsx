import React,{useState, useEffect, useRef} from 'react'
import './AdminProductListPage.css'
import {useNavigate, useOutletContext} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'

import {LiaSlidersHSolid} from "react-icons/lia"
import {FiDownload} from "react-icons/fi"
import {RiArrowDropDownLine} from "react-icons/ri"
import {IoMdAdd} from "react-icons/io"

import {toast} from 'react-toastify'
import {toast as sonnerToast} from 'sonner'

import apiClient from '../../../Api/apiClient'

import AdminTitleSection from '../../../Components/AdminTitleSection/AdminTitleSection'
import ProductListingTools from '../../../Components/ProductListingTools/ProductListingTools'
import {SitePrimaryButtonWithShadow} from '../../../Components/SiteButtons/SiteButtons'
import {getAllProducts, resetStates} from '../../../Slices/productSlice'
import ListingTabs from './ListingTabs'
import ProductsDisplay from '../../../Components/ProductsDisplay/ProductsDisplay'
import ProductFilterSidebar from '../../../Components/ProductFilterSidebar/ProductFilterSidebar'
import ExportFileModal from './ExportFileModal'


export default function AdminProductListPage(){

    const [showSortBy, setShowSortBy] = useState(false)
    const [showByGrid, setShowByGrid] = useState(true)
    const [showByTable, setShowByTable] = useState(false)
    const [toggleTab, setToggleTab] = useState({goTo: 'all'})

    const [showTheseProducts, setShowTheseProducts] = useState([])

    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(null)

    const [showFilter, setShowFilter] = useState(false)
    const [filter, setFilter] = useState({status: 'all', categories: [], brands: []})
    const [totalFilter, setTotalFilter] = useState({})
    const [currentFilters, setCurrentFilters] = useState({})

    const [limit, setLimit] = useState(9)  
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(20)  

    const [sorts, setSorts] = useState({}) 
    const [queryOptions, setQueryOptions] = useState({page: 1, limit: 9})

    const [isProductRestocking, setIsProductRestocking] = useState(false)

    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false)

    const [isExportModalOpen, setIsExportModalOpen] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {products, productCounts, productRestocked, productStatusToggled, message, error} = useSelector(state=> state.productStore)

    const {setHeaderZIndex, setPageBgUrl} = useOutletContext() 
    setPageBgUrl(`linear-gradient(to right,rgba(255,255,255,0.94),rgba(255,255,255,0.94)), url('/Images/admin-ProductsListBg.jpg')`)

    const popularProducts = [
        'benches', 'gymbell', 'treadmill', 'Ellipticals', 'bikes', 'proteinPowders', 'mutistationMachines', 'resistanceBands', 'yogaMats'
    ]

    const brands = ["Nike", "Adidas", "Under Armour", "Reebok", "Puma", "Gymshark"]

    const muscleGroups = ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Forearms", "Quadriceps", "Hamstrings", "Glutes", "Calves",
        "Core", "Abs", "Full Body", "Cardio"]

    const sortMenu = [
        { name: "Price: High to Low", value: "price", order: "-1", invisibleOnTable: true },
        { name: "Price: Low to High", value: "price", order: "1", invisibleOnTable: true },
        { name: "Ratings: High to Low", value: "averageRating", order: "1" },
        { name: "Ratings: Low to High", value: "averageRating", order: "-1" },
        { name: "Featured", value: "featured" },
        { name: "Best Sellers", value: "bestSellers" },
        { name: "Newest Arrivals", value: "newestArrivals" },
    ]
    
    useEffect(()=> {
        dispatch( getAllProducts({queryOptions: {page: 1, limit: 9}}))
    }, [])

    useEffect(()=>{
        setShowTheseProducts(products)
    },[products])

    useEffect(()=> {
        if(productStatusToggled && message){
          sonnerToast.success(message)
          dispatch(resetStates())
        }
      },[productStatusToggled, message])

    useEffect(()=>{
        setTotalFilter({...filter, minPrice, maxPrice})
    },[filter, minPrice, maxPrice])

    useEffect(()=>{
        setQueryOptions( {filter: {...queryOptions.filter, ...totalFilter}, sort: {...queryOptions.sort, ...sorts}, page: currentPage, limit} )
    },[totalFilter, sorts, currentPage, limit])

    useEffect(()=>{
        if(Object.keys(queryOptions).length){
            dispatch( getAllProducts({queryOptions}))
        }
    },[queryOptions])

    useEffect(()=> {
      if(products && productCounts && totalPages && limit){
        setTotalPages(Math.ceil(productCounts/limit))
      }
    }, [products, productCounts])

    useEffect(()=> {
         if(error) {
             sonnerToast.error(error)
             dispatch(resetStates())
         }
    }, [error])

    useEffect(() => {
        if (setHeaderZIndex && (isFilterSidebarOpen || isProductRestocking)) {
            setHeaderZIndex(0)
        } else {
            setHeaderZIndex(10)
        }
    }, [isFilterSidebarOpen, isProductRestocking])

    useEffect(() => {
        if (productRestocked) {
          sonnerToast.success("Product restocked succesfully!")
          dispatch(resetStates())
        }
        dispatch(getAllProducts({ queryOptions }))
    }, [productRestocked])

    const showProducts = (type)=>{
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
        if(appliedFilters.minPrice){
            setMinPrice(appliedFilters.minPrice)
        }
        if(appliedFilters.maxPrice){
            setMaxPrice(appliedFilters.maxPrice)
        }
        const {categories, brands, targetMuscles, startDate, endDate, productStatus: status, popularProducts: products,
             rating, maxStock} = appliedFilters
        setFilter({...filter, categories, brands, targetMuscles, products, startDate, endDate, status, averageRating: rating, maxStock})
    }

    const exportFile = async (type) => {
        setHeaderZIndex(10)
        if(products && products.length > 0){
            try {
                const response = await apiClient.post(`/admin/products/export/${type}`, {products}, {responseType: 'blob'})

                const fileBlob = new Blob([response.data], { type: type === 'csv' ? 'text/csv' : 'application/pdf'})

                const url = window.URL.createObjectURL(fileBlob)
                const link = document.createElement("a");
                link.href = url;
                link.download = type === "csv" ? "products.csv" : "products.pdf"
                document.body.appendChild(link)
                link.click()

                link.remove()
                window.URL.revokeObjectURL(url)

                }
            catch (error) {
              if (!error.response) {
                sonnerToast.error("Network error. Please check your internet.")
              } else if (error.response?.status === 404) {
                sonnerToast.error(error.response.data.message || "No products found!")
              } else {
                sonnerToast.error("Something went wrong while exporting files! Please retry later.")
              }
            }
        }else{
            toast.error("Sorry.There is no available product in the store to export details!")
        }
    }


    return (
        <section id='AdminProductList'>
            <header className='flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-center'>
                <header>
                    <AdminTitleSection
                        heading='Products'
                        subHeading='View, edit, filter, export and manage products across grid, list, and table views.'
                    />
                </header>
                <div
                    className='w-full md:w-auto flex items-center justify-between md:justify-normal gap-[10px] xx-md:gap-[10px]
                 lg:gap-[1.5rem] x-md:gap-[1.5rem]'>
                    <SitePrimaryButtonWithShadow
                        tailwindClasses={`xxs-sm:text-[13px] x-md:text-[14px] xx-md:text-[13px] lg:text-[14px] xxs-sm:py-[3px]
                            xx-md:py-[3px] lg:py-[4px] x-md:py-[4px] xxs-sm:rounded-[6px] xx-md:rounded-[6px] lg:rounded-[8px] 
                            x-md:rounded-[8px] ${isFilterSidebarOpen && 'bg-primaryDark'}`}
                        className='chip relative'
                        animated={true}
                        clickHandler={(e) => {
                            setIsFilterSidebarOpen(true)
                        }}>
                        <i>
                            <LiaSlidersHSolid />
                        </i>
                        <span> Filter </span>
                    </SitePrimaryButtonWithShadow>
                    <SitePrimaryButtonWithShadow
                        tailwindClasses='xxs-sm:text-[13px] x-md:text-[14px] xx-md:text-[13px] lg:text-[14px] xxs-sm:py-[3px]
                            xx-md:py-[3px] lg:py-[4px] x-md:py-[4px] xxs-sm:rounded-[6px] xx-md:rounded-[6px] lg:rounded-[8px] x-md:rounded-[8px]'
                        className='chip'
                        animated={true}
                        clickHandler={() => {
                            setHeaderZIndex(0)
                            setIsExportModalOpen(true)
                        }}>
                        <i>
                            <FiDownload />
                        </i>
                        <span> Export </span>
                        <i>
                            <RiArrowDropDownLine />
                        </i>
                    </SitePrimaryButtonWithShadow>
                    <SitePrimaryButtonWithShadow
                        tailwindClasses='xxs-sm:text-[13px] x-md:text-[14px] xx-md:text-[13px] lg:text-[14px] xxs-sm:py-[3px]
                            xx-md:py-[3px] lg:py-[4px] x-md:py-[4px] xxs-sm:rounded-[6px] xx-md:rounded-[6px] lg:rounded-[8px] x-md:rounded-[8px]'
                        clickHandler={() =>
                            navigate("/admin/products/add", {
                                state: { from: location.pathname },
                            })
                        }
                        animated={true}>
                        <i>
                            <IoMdAdd />
                        </i>
                        <span className='hidden md:inline-block'> Add new Product </span>
                        <span className='inline-block md:hidden'> Add Product </span>
                    </SitePrimaryButtonWithShadow>
                </div>
            </header>
            <main className='relative mt-[4.3rem]'>
                <ListingTabs
                    showProducts={showProducts}
                    toggleTab={toggleTab}
                    setShowByGrid={setShowByGrid}
                    setShowByTable={setShowByTable}
                />

                <div className='border py-[1rem] px-[2rem] bg-white'>
                    <ProductListingTools
                        admin={true}
                        showSortBy={showSortBy}
                        setShowSortBy={setShowSortBy}
                        showByTable={showByTable}
                        sortHandlers={{ sorts, setSorts }}
                        sortMenu={sortMenu}
                        limiter={{ limit, setLimit }}
                        queryOptions={queryOptions}
                        setQueryOptions={setQueryOptions}
                    />

                    <div className='mt-[2rem] px-[2rem]'>
                        {products && (
                            <ProductsDisplay
                                gridView={showByGrid}
                                showByTable={showByTable}
                                pageReader={{ currentPage, setCurrentPage }}
                                limiter={{ limit, setLimit }}
                                totalPages={totalPages}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                showTheseProducts={showTheseProducts}
                                restockingProduct={setIsProductRestocking}
                                admin={true}
                            />
                        )}
                    </div>
                </div>
            </main>

            {isFilterSidebarOpen && (
                <ProductFilterSidebar
                    isOpen={isFilterSidebarOpen} 
                    onClose={() => setIsFilterSidebarOpen(false)}
                    isAdmin={true}
                    popularProducts={popularProducts}
                    muscleGroups={muscleGroups}
                    brands={brands}
                    applySidebarFilters={applySidebarFilters}
                    saveCurrentFilters={setCurrentFilters}
                    savedFilters={currentFilters}
                    onClearedFilters={()=> 
                        setQueryOptions( {sort: {...queryOptions.sort, ...sorts}, page: currentPage, limit} )
                    }
                />
            )}

            {isExportModalOpen && (
                <ExportFileModal
                    isOpen={isExportModalOpen}
                    onClose={() => setIsExportModalOpen(false)}
                    onExport={exportFile}
                    productCount={products.length}
                />
            )}
        </section>
    )
}