import React from 'react'
import './ProductListingTools.css'

import {SearchInput} from '../FromComponents/FormComponents'
import {RiArrowDropDownLine} from "react-icons/ri";
import {BsFillGrid3X3GapFill} from "react-icons/bs";
import {FaList} from "react-icons/fa";
import {IoPricetagOutline} from "react-icons/io5";
import {FaIndianRupeeSign, FaChartLine } from "react-icons/fa6";
import {VscFeedback} from "react-icons/vsc";
import {MdOutlineFeaturedVideo, MdOutlineNewReleases} from "react-icons/md";


export default function ProductListingTools({admin, showSortBy, setShowSortBy, showByGrid, setShowByGrid, showByTable}){

    console.log("showByTable", showByTable)
    return(

        <div className='flex justify-between' id='ProductListingTools'>
            <SearchInput/>
            <div className='flex gap-[2rem] items-center'>
                <div className='flex items-center sort-by relative sort-dropdown cursor-pointer' 
                                                        onClick={(e)=> setShowSortBy(status=> !status)}>
                    <span className='text-[13px] font-[500]'> Sort By </span>
                    <RiArrowDropDownLine/>
                    {showSortBy && 
                    <ul className='list-none cursor-pointer absolute top-[22px] flex flex-col gap-[5px] justify-center 
                            w-[10rem] h-[10rem] border rounded-[8px] text-[10px] z-[5] px-[19px]' style={admin && {right:'0px'}}>
                        <li style={showByTable ? {display:'none'}:{}}> Price: High to Low <FaIndianRupeeSign/> </li>
                        <li style={showByTable ? {display:'none'}:{}}> Price: Low to High <FaIndianRupeeSign/> </li>
                        <li> Ratings: High to Low <VscFeedback/> </li>
                        <li> Ratings: Low to High <VscFeedback/> </li>
                        <li> Featured <MdOutlineFeaturedVideo/> </li>
                        <li> Best Sellers <FaChartLine/> </li>
                        <li> Newest Arrivals <MdOutlineNewReleases/> </li>
                    </ul>
                    }
                </div>
                { !admin &&
                <div className='flex items-center gap-[5px] view-type'>
                    <span onClick={()=> setShowByGrid(true)}>  <BsFillGrid3X3GapFill/> </span>
                    <span onClick={()=> setShowByGrid(false)}> <FaList/> </span>
                </div>
                }
            </div>
        </div>

    )
}