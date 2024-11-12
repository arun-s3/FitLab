import React,{useState, useEffect, useRef} from 'react'
import {Link} from 'react-router-dom'
import './ProductListPage.css'
import Header from '../../../Components/Header/Header'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import PriceSliderAndFilter from '../../../Components/PriceSliderAndFilter/PriceSliderAndFilter'
import TestPriceFilter from '../../../Components/PriceSliderAndFilter/TestPriceSliderAndFilter' // For Enhancing Original PriceFiter feature
import ProductsDisplay from '../../../Components/ProductsDisplay/ProductsDisplay'
import ProductListingTools from '../../../Components/ProductListingTools/ProductListingTools'
import CategoryDisplay from '../../../Components/CategoryDisplay/CategoryDisplay'

import {VscSettings} from "react-icons/vsc";
import {RiArrowDropUpLine} from "react-icons/ri";


export default function ProductList({admin}){

    const headerBg = {
        backgroundImage: "url('/header-bg.png')",
        backgrounSize: 'cover'
    }

    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(3750)
    let firstSlideRef = useRef(false)

    const [category, setCategory] = useState([])
    const [subcategory, setSubcategory] = useState('')

    const [showCategory, setShowCategory ] = useState(true)
    const [showProductsFilter, setShowProductsFilter] = useState(true)
    const [showPriceFilter, setShowPriceFilter] = useState(true)
    const [showSortBy, setShowSortBy] = useState(false)
    const [showByGrid, setShowByGrid] = useState(true)

    const [filter, setFilter] = useState({categories: [], products: []})
    const [sorts, setSorts] = useState({})

    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(12)  

    const [queryOptions, setQueryOptions] = useState({})


    useEffect(()=>{
        console.log("FILTER-->", JSON.stringify(filter))
        console.log("SORTS-->", JSON.stringify(sorts))
        setQueryOptions( {filter: {...queryOptions.filter, ...filter}, sort: {...queryOptions.sort, ...sorts}, page: currentPage, limit} )
    },[filter, sorts, currentPage, limit])

    useEffect(()=>{
        console.log("QUERYOPTIONS-->", JSON.stringify(queryOptions))
    },[queryOptions])

    useEffect(()=>{
        if(firstSlideRef.current){
            setFilter({...filter, minPrice, maxPrice})
        }
    },[minPrice, maxPrice])

    const categoryClickHandler = (e)=>{
        const value = e.target.innerText.toLowerCase()
        if( filter.categories.includes(e.target.innerText.toLowerCase()) ){
            e.target.previousElementSibling.style.visibility = 'hidden'
            setFilter({...filter, categories: filter.categories.filter(category=> category !== value)})
        }else{
            e.target.previousElementSibling.style.visibility = 'visible'
            setFilter({...filter, categories: [...filter.categories, value]})
        }
    }

   const checkHandler = (e)=>{
        const value = e.target.value.trim().split(',')
        console.log("Value of checks-->", [...filter.products, ...value])
        if(e.target.checked){
            setFilter({...filter, products: [...filter.products, ...value]})
        }
   } 

    return(
        <>  
            <header style={headerBg}>

                <Header/>

            </header>
            
            <BreadcrumbBar/>
                
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
                        <ul className='list-none cursor-pointer' id='filter-body'>
                            <li> <span className='bullet'></span> <span to='' onClick={(e)=>{categoryClickHandler(e)}}> Strength </span> </li>
                            <li> <span className='bullet'></span> <span to='' onClick={(e)=>{categoryClickHandler(e)}}> Cardio </span> </li>
                            <li> <span className='bullet'></span> <span to='' onClick={(e)=>{categoryClickHandler(e)}}> Accessories </span> </li>
                            <li> <span className='bullet'></span> <span to='' onClick={(e)=>{categoryClickHandler(e)}}> Supplements </span> </li>
                        </ul>
                        <span className='mt-[5px] text-secondary text-[13px]'>See all</span>
                        {/* CategoryList here--- */ }
                        </>
                        }
                    </div>
                    <div className='pb-[10px] border-b border-[#DEE2E7]' > 
                        <div id='filter-header'>
                            <h4>By Product</h4>
                            <span className='cursor-pointer' onClick={()=> setShowProductsFilter(status=> !status)}> <RiArrowDropUpLine/> </span>
                        </div>
                        {showProductsFilter && 
                        <ul className='list-none' id='filter-body' >
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='benchesAndRacks' value='benches,racks' onChange={(e)=> checkHandler(e)}/>
                                    <label HTMLfor='benchesAndRacks'>Benches and Racks</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='gymbell' value='gymbell' onChange={(e)=> checkHandler(e)}/>
                                    <label HTMLfor='gymbell'>Gymbell</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='treadmills' value='treadmill'  onChange={(e)=> checkHandler(e)}/>
                                    <label HTMLfor='treadmills'>Treadmills</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='plates' value='plates'  onChange={(e)=> checkHandler(e)}/>
                                    <label HTMLfor='plates'>Plates</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='bikesAndEllipticals' value='bikes,ellipticals'  onChange={(e)=> checkHandler(e)}/>
                                    <label HTMLfor='bikesAndEllipticals'>Bikes and Ellipticals</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='proteinPowders' value='protein powder'  onChange={(e)=> checkHandler(e)}/>
                                    <label HTMLfor='proteinPowders'>Protein Powders</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='multistationMachines' value='multistation machines'  onChange={(e)=> checkHandler(e)}/>
                                    <label HTMLfor='multistationMachine'>MultistationMachine</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='resistanceBands' value='resistance bands'  onChange={(e)=> checkHandler(e)}/>
                                    <label HTMLfor='resistanceBands'>Resistance Bands</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='yogaMats' value='yoga mats'  onChange={(e)=> checkHandler(e)}/>
                                    <label HTMLfor='yogaMats'>Yoga Mats</label>
                                </div>
                            </li>
                            <span className='mt-[5px] text-secondary text-[13px]'>See all</span>
                        </ul>
                        }
                    </div>
                    <div className='pb-[10px] border-gray-500'>
                        <div id='filter-header'>
                            <h4>Price Range</h4>
                            <span className='cursor-pointer' onClick={()=> setShowPriceFilter(status=> !status)}> <RiArrowDropUpLine/> </span>
                        </div>
                    <div id='filter-body'>
                        {
                            showPriceFilter && < PriceSliderAndFilter priceGetter={{minPrice, maxPrice}} priceSetter={{setMinPrice, setMaxPrice}}  firstSlide={firstSlideRef} />
                            // showPriceFilter && <TestPriceFilter/>
                        }
                    </div>
                    </div>
                </aside>

                <section className='basis-full flex-grow'>
                    <div>
                        <ProductListingTools showSortBy={showSortBy} setShowSortBy={setShowSortBy} showByGrid={showByGrid}
                                 setShowByGrid={setShowByGrid} sortHandlers={{sorts, setSorts}} limiter={{limit, setLimit}}/>
                    </div>
                    <div className='mt-[2rem]'>

                        <ProductsDisplay gridView={showByGrid} pageReader={{currentPage, setCurrentPage}} limiter={{limit, setLimit}} queryOptions={queryOptions}/>

                    </div>
                </section>
            </main>
        </>
    )
}