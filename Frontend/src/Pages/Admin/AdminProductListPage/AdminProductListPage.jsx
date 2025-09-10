import React,{useState, useEffect, useRef} from 'react'
import './AdminProductListPage.css'
import {useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'

import {toast} from 'react-toastify'
import {LiaSlidersHSolid} from "react-icons/lia"
import {FiDownload} from "react-icons/fi"
import {RiArrowDropDownLine} from "react-icons/ri"
import {IoMdAdd} from "react-icons/io"
import {BsFillGrid3X3GapFill} from "react-icons/bs"
import {FaList} from "react-icons/fa"
import {CiViewTable} from "react-icons/ci"
import {VscTable} from "react-icons/vsc"

import {resetStates} from '../../../Slices/productSlice'
import ProductListingTools from '../../../Components/ProductListingTools/ProductListingTools'
import {SitePrimaryButtonWithShadow} from '../../../Components/SiteButtons/SiteButtons'
import ProductsDisplay from '../../../Components/ProductsDisplay/ProductsDisplay'
import ProductFilterForAdmin from '../../../Components/ProductFilterForAdmin/ProductFilterForAdmin'



export default function AdminProductListPage(){

    const [showSortBy, setShowSortBy] = useState(false)
    const [showByGrid, setShowByGrid] = useState(true)
    const [showByTable, setShowByTable] = useState(false)
    const [toggleTab, setToggleTab] = useState({goTo: 'all'})

    const [showTheseProducts, setShowTheseProducts] = useState([])

    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)

    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(3750)
    const [inputLocalMinPrice, setInputLocalMinPrice] = useState(0)
    const [inputLocalMaxPrice, setInputLocalMaxPrice] = useState(0)

    const [showFilter, setShowFilter] = useState(false)
    const [filter, setFilter] = useState({status: 'all', categories: [], brands: []})
    const [totalFilter, setTotalFilter] = useState({})
    const mouseInFilter = useRef(true)

    const [limit, setLimit] = useState(12)  
    const [currentPage, setCurrentPage] = useState(1)
    const [sorts, setSorts] = useState({})
    const [queryOptions, setQueryOptions] = useState({})
    

    const navigate = useNavigate()
    const {products, productSuccess, error, loading, message} = useSelector(state=> state.productStore)

    const displayFilter = (e)=>{
        if (showFilter && !mouseInFilter.current){
            setShowFilter(false)
            return
        }
        if(!showFilter){
            setShowFilter(true)
            return
        }
    }

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
        setTotalFilter({...filter,startDate, endDate, minPrice, maxPrice})
        console.log(`From AdminProductListPage startDate-->${startDate}, endDate-->${endDate}`)
        console.log("TotalFilters-->", JSON.stringify(totalFilter))
    },[filter, startDate, endDate, minPrice, maxPrice])

    useEffect(()=>{
        console.log("FILTER-->", JSON.stringify(totalFilter))
        console.log("SORTS-->", JSON.stringify(sorts))
        setQueryOptions( {filter: {...queryOptions.filter, ...totalFilter}, sort: {...queryOptions.sort, ...sorts}, page: currentPage, limit} )
    },[totalFilter, sorts, currentPage, limit])

    useEffect(()=>{
        console.log("QUERYOPTIONS-->", JSON.stringify(queryOptions))
    },[queryOptions])

    // useEffect(()=>{
    //     if(productSuccess){

    //     }
    // },[productSuccess])

    useEffect(()=>{
        // const setCloseMenus = ()=>{
        //     setShowFilter(false)
        // }
        // window.addEventListener('click', ()=> setCloseMenus)

        // return ()=>{
        //     window.removeEventListener('click', ()=> setCloseMenus)
        // }
    })

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

    return(

        <section id='AdminProductList' >

            <header className='flex justify-between items-center'>
                <h1> Products </h1>
                <div className='flex items-center gap-[1.5rem]'>
                    <SitePrimaryButtonWithShadow className='chip relative' clickHandler={(e)=> displayFilter(e)}>
                        <i>
                            <LiaSlidersHSolid/>
                        </i>
                        <span> Filter </span>
                        {showFilter &&
                        <div className='absolute top-[2rem] right-0 z-[10]' onMouseLeave={()=> mouseInFilter.current = false}
                                    onMouseEnter={()=>  mouseInFilter.current = true}>
                            <ProductFilterForAdmin filter={filter} setFilter={setFilter} priceGetter={{minPrice, maxPrice}} priceSetter={{setMinPrice, setMaxPrice}}
                                     dateGetter={{startDate, endDate}} dateSetter={{setStartDate, setEndDate}}/>
                        </div>
                        }
                    </SitePrimaryButtonWithShadow>
                    <SitePrimaryButtonWithShadow className='chip' >
                        <i>
                            <FiDownload/>
                        </i>
                        <span> Export </span>
                        <i>
                            <RiArrowDropDownLine/>
                        </i>
                    </SitePrimaryButtonWithShadow>
                    <SitePrimaryButtonWithShadow clickHandler={()=> navigate('/admin/products/add')}>
                        <i>
                            <IoMdAdd/>
                        </i>
                        <span> Add new Product </span>
                    </SitePrimaryButtonWithShadow>
                </div>
            </header>
            <main className='relative mt-[4.3rem]'>
                {/* <svg width="170" height="35" xmlns="http://www.w3.org/2000/svg">
                    <path stroke="red" stroke-width="1" fill="transparent"  d='M0 35  Q0 0, 20 0 h90 Q130 0, 145 35'/>
                </svg> */}
                <div className='h-[40px] w-[150px] bg-white border border-b-[#e5e7eb] rounded-tl-[10px] cursor-pointer
                                 flex justify-center items-center absolute top-[-39px] tab' onClick={()=> showProducts('all')} 
                        style={toggleTab.goTo == 'all'? {borderBottomColor:'transparent'}:{}}>
                    <h4 className={toggleTab.goTo == 'all' ? 'opacity-[1]' : 'opacity-[0.75]'}> All </h4>
                </div>
                <div className='h-[40px] w-[150px] bg-white border border-b-[#e5e7eb] flex justify-center items-center absolute cursor-pointer
                                    top-[-39px] left-[150px] tab' onClick={()=> showProducts('active')}
                                style={toggleTab.goTo == 'active'? {borderBottomColor:'transparent'}:{}}>
                    <h4 className={toggleTab.goTo == 'active' ? 'opacity-[1]' : 'opacity-[0.75]'}> Active </h4>
                </div>
                <div className='h-[40px] w-[150px] bg-white border border-b-[#e5e7eb] rounded-tr-[5px] flex justify-center items-center cursor-pointer
                             absolute top-[-39px] left-[300px] tab' onClick={()=> showProducts('blocked')}
                                style={toggleTab.goTo == 'blocked'? {borderBottomColor:'transparent'}:{}}>
                    <h4 className={toggleTab.goTo == 'blocked' ? 'opacity-[1]' : 'opacity-[0.75]'}> Blocked </h4>
                </div>
                <div className='absolute right-[5px] top-[-30px] flex items-center gap-[7px] view-type'>
                    <span data-label='Table View' onClick={()=> setShowByTable(!showByTable)}> <VscTable/> </span>
                    <span data-label='List View' 
                        className='hidden xx-lg:inline-block'
                        onClick={()=> {setShowByTable(false); setShowByGrid(false)}}
                    > 
                        <FaList/> 
                    </span>
                    <span data-label='Grid View' onClick={()=> {setShowByTable(false); setShowByGrid(true)}}>  <BsFillGrid3X3GapFill/> </span>
                </div>
                <div className='border py-[1rem] px-[2rem] bg-white'>

                    <ProductListingTools admin={true} showSortBy={showSortBy} setShowSortBy={setShowSortBy} showByTable={showByTable}
                                sortHandlers={{sorts, setSorts}} limiter={{limit, setLimit}}/>

                    <div className='mt-[2rem] px-[2rem]'>

                        <ProductsDisplay gridView={showByGrid} showByTable={showByTable} pageReader={{currentPage, setCurrentPage}} limiter={{limit, setLimit}} showTheseProducts={showTheseProducts} admin={true}/>

                    </div>

                </div>
            </main>
        </section>
    )
}