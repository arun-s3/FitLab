import React,{useState, useRef} from 'react'
import './ProductListingTools.css'

import {SearchInput} from '../FromComponents/FormComponents'
import {RiArrowDropDownLine} from "react-icons/ri";
import {BsFillGrid3X3GapFill} from "react-icons/bs";
import {FaList} from "react-icons/fa";
import {IoPricetagOutline} from "react-icons/io5";
import {FaIndianRupeeSign, FaChartLine } from "react-icons/fa6";
import {VscFeedback} from "react-icons/vsc";
import {MdOutlineFeaturedVideo, MdOutlineNewReleases} from "react-icons/md";


export default function ProductListingTools({admin, showSortBy, setShowSortBy, showByGrid, setShowByGrid, showByTable, sortHandlers, limiter}){

    const {sorts, setSorts} = sortHandlers
    const {limit, setLimit} = limiter
    const [showLimit, setShowLimit] = useState(false)

    const mouseInSort = useRef(true)

    const limitDropdownHandler = (e)=>{
        e.currentTarget.style.borderBottomLeftRadius = e.currentTarget.style.borderBottomRightRadius = showLimit ? '4px' : '0px'
        setShowLimit(!showLimit)
    }

    const sortCheckHandler = (e)=>{
        const value = e.target.value
        const sortKey = value.trim().split(',')[0]
        const sortValue = value.trim().split(',')[1] 
        console.log(`sortkey-->${sortKey} sortValue-->${sortValue}`)
        if(e.target.checked){
            if( Object.keys(sorts).some(sort=> sort==sortKey) ){
                console.log("sortKey already exists")
                e.target.checked = false
                return
            }
            if( value.trim().split(',').length > 1 ){
                console.log("setting sort..")
                e.target.nextElementSibling.style.color = 'rgba(159, 42, 240, 1)'
                setSorts({...sorts, [sortKey]: sortValue})
                return
            }
            if( value.trim().split(',').length == 1 ){
                if( !Object.keys(sorts).some(key=> key=='featured'||key=='bestSellers'||key=='newestArrivals') ){
                    e.target.nextElementSibling.style.color = 'rgba(159, 42, 240, 1)'
                    setSorts({...sorts, [sortKey]: 1})
                }
                else{
                    console.log("Only one such sort is allowed!")
                    e.target.checked = false
                    return
                }
            }
        }else{
            e.target.nextElementSibling.style.color = 'initial'
            setSorts(sorts=> { delete sorts[sortKey]; return sorts })
        }
    }

    const displaySort = (e)=>{
        if (showSortBy && !mouseInSort.current){
            setShowSortBy(false)
            return
        }
        if(!showSortBy){
            setShowSortBy(true)
            return
        }
    }

    return(

        <div className='flex justify-between' id='ProductListingTools'>
            <SearchInput/>
            <div className='flex gap-[2rem] items-center'>
            <div className='flex items-center gap-[10px]'>
                <span className='text-[13px] font-[500]'> Showing </span>
                <div className='flex items-center justify-center bg-secondaryLighter rounded-[4px] text-[12px] text-secondary
                        border border-primary px-[8px] relative z-[10] cursor-pointer' onClick={(e)=> limitDropdownHandler(e)} id='limit-dropdown'>
                    <span> {limit} </span>
                    <i> <RiArrowDropDownLine/> </i>
                    {limit && showLimit &&
                        <ul className='absolute top-[18px] pt-[5px] w-[101%] rounded-b-[4px] flex flex-col items-center gap-[5px] 
                                border border-primary cursor-pointer'>
                            <li onClick={()=> setLimit(9)}> 9 </li>
                            <li onClick={()=> setLimit(12)}> 12 </li>
                            <li onClick={()=> setLimit(15)}> 15 </li>
                            <li className='pb-[5px]' onClick={()=> setLimit(18)}> 18 </li>
                        </ul>
                    }
                </div>
            </div>
            <div className='flex items-center sort-by relative sort-dropdown cursor-pointer' onClick={(e)=> displaySort(e)}>
                    <span className='text-[13px] font-[500]'> Sort By </span>
                    <RiArrowDropDownLine/>
                    {showSortBy && 
                    <ul className='list-none cursor-pointer absolute top-[22px] flex flex-col gap-[10px] justify-center 
                            w-[9rem] border border-borderLight2 rounded-[8px] text-[10px] z-[5] px-[10px] py-[1rem]' style={admin && {right:'0px'}}
                                onMouseLeave={()=> mouseInSort.current = false} onMouseEnter={()=>  mouseInSort.current = true}>
                        <li style={showByTable ? {display:'none'}:{}}> 
                            <span>  
                                <input type='checkbox' value='price,-1' onChange={(e)=> sortCheckHandler(e)}/>
                                <span> Price: High to Low </span>
                            </span>
                        </li>
                        <li style={showByTable ? {display:'none'}:{}}>
                            <span>  
                                <input type='checkbox' value='price,1' onChange={(e)=> sortCheckHandler(e)}/>
                                <span> Price: Low to High </span>
                            </span>
                        </li>
                        <li> 
                            <span>  
                                <input type='checkbox' value='averageRating,-1' onChange={(e)=> sortCheckHandler(e)}/>
                                <span> Ratings: High to Low </span>
                            </span>
                        </li>
                        <li> 
                            <span>  
                                <input type='checkbox' value='averageRating,1' onChange={(e)=> sortCheckHandler(e)}/>
                                <span> Ratings: Low to High </span>
                            </span>
                        </li>
                        <li> 
                            <span>  
                                <input type='checkbox' value='featured' onChange={(e)=> sortCheckHandler(e)}/>
                                <span> Featured </span>
                            </span>
                        </li>
                        <li> 
                            <span>  
                                <input type='checkbox' value='bestSellers' onChange={(e)=> sortCheckHandler(e)}/>
                                <span> Best Sellers </span>
                            </span>
                        </li>
                        <li>
                            <span>  
                                <input type='checkbox' value='newestArrivals' onChange={(e)=> sortCheckHandler(e)}/>
                                <span> Newest Arrivals </span>
                            </span> 
                        </li>
                    </ul>
                    }
            </div>
                { !admin &&
                <div className='flex items-center gap-[5px] relative view-type'>
                    <span data-label='Grid View' onClick={()=> setShowByGrid(true)}>  <BsFillGrid3X3GapFill/> </span>
                    <span data-label='List View' onClick={()=> setShowByGrid(false)}> <FaList/> </span>
                </div>
                }
            </div>
        </div>

    )
}