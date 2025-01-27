import React,{useState, useEffect, useRef} from 'react'
import './ProductListPage.css'
import {useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import {debounce} from 'lodash'

import {VscSettings} from "react-icons/vsc";
import {RiArrowDropUpLine} from "react-icons/ri";

import Header from '../../../Components/Header/Header'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import PriceSliderAndFilter from '../../../Components/PriceSliderAndFilter/PriceSliderAndFilter'
import RatingSlider from '../../../Components/RatingSlider/RatingSlider'
import TestPriceFilter from '../../../Components/PriceSliderAndFilter/TestPriceSliderAndFilter' // For Enhancing Original PriceFiter feature
import ProductsDisplay from '../../../Components/ProductsDisplay/ProductsDisplay'
import ProductListingTools from '../../../Components/ProductListingTools/ProductListingTools'
import CategoryDisplay from '../../../Components/CategoryDisplay/CategoryDisplay'
import {getAllProducts, toggleProductStatus} from '../../../Slices/productSlice'
import {capitalizeFirstLetter} from '../../../Utils/helperFunctions'



export default function ProductList({admin}){

    const headerBg = {
        backgroundImage: "url('/header-bg.png')",
        backgrounSize: 'cover'
    }

    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(3750)
    let firstSlideRef = useRef(false)

    const [rating, setRating] = useState(4.5)
    
    // const [category, setCategory] = useState([])
    // const [subcategory, setSubcategory] = useState('')

    const [showCategory, setShowCategory ] = useState(true)
    const [showProductsFilter, setShowProductsFilter] = useState(true)
    const [showPriceFilter, setShowPriceFilter] = useState(true)
    const [showRatingSlider, setShowRatingSlider] = useState(true)
    const [showByGrid, setShowByGrid] = useState(true)

    const [filter, setFilter] = useState({categories: [], products: []})
    const [sorts, setSorts] = useState({})

    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(12)  

    const [popularProductsShowLabel, setPopularProductsShowLabel] = useState('See more')

    const [queryOptions, setQueryOptions] = useState({})

    const popularProducts = [
        'benches', 'gymbell', 'treadmill', 'Ellipticals', 'bikes', 'proteinPowders', 'mutistationMachines', 'resistanceBands', 'yogaMats'
    ]
    const [morePopularProducts, setMorePopularProducts] = useState(0)

    const dispatch = useDispatch()

    const debouncedProducts = useRef(
        debounce(()=> {
            dispatch( getAllProducts({queryOptions}) )
        }, 1000) 
    ).current

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
            // debouncedProducts()
            dispatch( getAllProducts({queryOptions}))
        }
    },[queryOptions])

    useEffect(()=>{
        if(firstSlideRef.current){
            setFilter({...filter, minPrice, maxPrice})
        }
    },[minPrice, maxPrice])

    // const categoryClickHandler = (e)=>{
    //     const value = e.target.innerText.toLowerCase()
    //     if( filter.categories.includes(e.target.innerText.toLowerCase()) ){
    //         e.target.previousElementSibling.style.visibility = 'hidden'
    //         setFilter({...filter, categories: filter.categories.filter(category=> category !== value)})
    //     }else{
    //         e.target.previousElementSibling.style.visibility = 'visible'
    //         setFilter({...filter, categories: [...filter.categories, value]})
    //     }
    // }

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

    return(
        <>  
            <header style={headerBg}>

                <Header/>

            </header>
            
            <BreadcrumbBar heading='products' />
                
            <main className='px-[60px] mt-[3rem] flex gap-[2.5rem] items-start justify-start' id='productlist'>
                <aside className='basis-[15rem] flex flex-col gap-[10px]'>
                    <div className='flex gap-[5px] items-center pb-[10px] border-b border-[#DEE2E7] filter-head'>
                        <VscSettings/>
                        <h3 className='text-[18px] font-[550] leading-[0.5px]'> Filter </h3>
                    </div>
                    <div className='pb-[10px] border-b border-[#DEE2E7]'>
                        <div className='flex justify-between items-center' id='filter-header'>
                            <h4 className='text-[15px] font-[500]'>By Category</h4>
                            <span className='cursor-pointer' onClick={()=> setShowCategory(status=> !status)}> <RiArrowDropUpLine/> </span>
                        </div>
                        {showCategory && <>
                        <ul className='list-none cursor-pointer pr-[7px]' id='filter-body'>

                            <CategoryDisplay type='checkboxType' filter={filter} setFilter={setFilter}/>

                        </ul>
                        </>
                        }
                    </div>
                    <div className='pb-[10px] border-b border-[#DEE2E7]' > 
                        <div id='filter-header'>
                            <h4>By Popular Products</h4>
                            <span className='cursor-pointer' onClick={()=> setShowProductsFilter(status=> !status)}> <RiArrowDropUpLine/> </span>
                        </div>
                        {showProductsFilter && 
                        <ul className='list-none' id='filter-body' >
                            {
                                popularProducts.slice(0, 5 + morePopularProducts).map(product=> (
                                    <li>
                                        <div>
                                            <input type='checkbox' className='' id={product} value={product}
                                                 onChange={(e)=> popularProductsHandler(e, product)}/>
                                            <label HTMLfor='gymbell'> { capitalizeFirstLetter(product) } </label>
                                        </div>
                                    </li>
                                ))
                            }
                            <span className='mt-[5px] text-secondary text-[13px] cursor-pointer hover:underline transition duration-500' 
                                onClick={()=> showMoreProducts()}>
                              {popularProductsShowLabel}
                            </span>
                        </ul>
                        }
                    </div>
                    <div className='pb-[10px] border-b border-[#DEE2E7]'>
                        <div id='filter-header'>
                            <h4>Price Range</h4>
                            <span className='cursor-pointer' onClick={()=> setShowPriceFilter(status=> !status)}> <RiArrowDropUpLine/> </span>
                        </div>
                        <div id='filter-body'>
                            {
                            showPriceFilter && 
                                < PriceSliderAndFilter priceGetter={{minPrice, maxPrice}} priceSetter={{setMinPrice, setMaxPrice}} 
                                     firstSlide={firstSlideRef} />
                                // showPriceFilter && <TestPriceFilter/>
                            }
                        </div>
                    </div>
                    <div className='pb-[10px] border-gray-500'>
                        <div id='filter-header'>
                            <h4>Ratings Range</h4>
                            <span className='cursor-pointer' onClick={()=> setShowRatingSlider(status=> !status)}> <RiArrowDropUpLine/> </span>
                        </div>
                        <div id='filter-body' className='mt-[1.5rem]'>
                             {
                                showRatingSlider &&
                                    <RatingSlider rating={rating} setRating={setRating}/>
                             }   
                        </div>
                    </div>
                </aside>

                <section className='basis-full flex-grow'>
                    <div>

                        <ProductListingTools showByGrid={showByGrid} setShowByGrid={setShowByGrid} sortHandlers={{sorts, setSorts}}
                             limiter={{limit, setLimit}} queryOptions={queryOptions} setQueryOptions={setQueryOptions}/>
                             
                    </div>
                    <div className='mt-[2rem]'>

                        <ProductsDisplay gridView={showByGrid} pageReader={{currentPage, setCurrentPage}} limiter={{limit, setLimit}}
                             queryOptions={queryOptions}/>

                    </div>

                </section>
            </main>
        </>
    )
}