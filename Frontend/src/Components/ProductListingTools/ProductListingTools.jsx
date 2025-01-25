import React,{useState, useEffect, useRef} from 'react'
import './ProductListingTools.css'

import useFlexiDropdown from '../../Hooks/FlexiDropdown'
import useStickyDropdown from '../../Hooks/StickyDropdown'
import {SearchInput} from '../FromComponents/FormComponents'
import {RiArrowDropDownLine} from "react-icons/ri"
import {BsFillGrid3X3GapFill} from "react-icons/bs"
import {FaList} from "react-icons/fa"


export default function ProductListingTools({admin, showByGrid, setShowByGrid, showByTable, sortHandlers, limiter}){

    const {sorts, setSorts} = sortHandlers
    const {limit, setLimit} = limiter

    const {openDropdowns, dropdownRefs, toggleDropdown} = useFlexiDropdown(['limitDropdown'])

    const {openStickyDropdowns, stickyDropdownRefs, toggleStickyDropdown} = useStickyDropdown(['sortDropdown'])

    const sortMenu = [
        {name: 'Price: High to Low', value:'price', order:'1', invisibleOnTable: true},
        {name: 'Price: Low to High', value:'price', order:'-1', invisibleOnTable: true},
        {name: 'Ratings: High to Low', value:'averageRating', order:'1'}, {name: 'Ratings: Low to High', value:'averageRating', order:'-1'},
        {name: 'Featured', value:'featured'},
        {name: 'Best Sellers', value:'bestSellers'}, {name: 'Newest Arrivals', value:'newestArrivals'}
    ]

    const limitValues = [9, 12, 15, 18]

    const sortCheckHandler = (e, order) => {
        const sortKey = e.target.value
        const sortValue = order
        console.log(`sortKey --> ${sortKey}, sortValue --> ${sortValue}`);
      
        if (e.target.checked){
            if(Object.keys(sorts).some((key) => key === sortKey)){
                console.log("sortKey already exists")
               e.target.checked = false
               setSorts((prevSorts) => {
                 const updatedSorts = { ...prevSorts }
                 delete updatedSorts[sortKey]
                 return updatedSorts
               })
               return
             }
             if(!["featured", "bestSellers", "newestArrivals"].includes(sortKey)){
               console.log("Setting sort...")
               e.target.nextElementSibling.style.color = "rgba(159, 42, 240, 1)"
               setSorts((prevSorts)=> ({...prevSorts, [sortKey]: sortValue}))
               return
             }
             else {
               if( !Object.keys(sorts).some((key)=> ["featured", "bestSellers", "newestArrivals"].includes(key) )) {
                 e.target.nextElementSibling.style.color = "rgba(159, 42, 240, 1)"
                 setSorts((prevSorts)=> ({...prevSorts, [sortKey]: 1}))
               }else{
                 console.log("Only one such sort is allowed!")
                 e.target.checked = false
                 return
               }
             }
        } else {
          e.target.nextElementSibling.style.color = "initial"
          setSorts((prevSorts)=> {
            const updatedSorts = { ...prevSorts }
            delete updatedSorts[sortKey]
            return updatedSorts
          })
        }
      }
      


    return(

        <div className='flex justify-between' id='ProductListingTools'>

            <SearchInput/>

            <div className='flex gap-[2rem] items-center'>
                
            <div className='flex items-center gap-[10px]'>
                <span className='text-[13px] font-[500]'> Showing </span>
                <div className='flex items-center justify-center bg-secondaryLighter rounded-[4px] text-[12px] text-secondary
                        border border-primary px-[8px] relative z-[10] cursor-pointer' onClick={(e)=> toggleDropdown('limitDropdown')}
                             id='limit-dropdown' ref={dropdownRefs.limitDropdown}>
                    <span> {limit} </span>
                    <i> <RiArrowDropDownLine/> </i>
                    {openDropdowns.limitDropdown && 
                        <ul className='absolute top-[22px] pt-[5px] w-[101%] rounded-[4px] flex flex-col items-center gap-[5px] 
                                border border-primary cursor-pointer'>
                            {
                                limitValues.map( (value, index)=> (
                                    index !== (limitValues.length - 1) ? <li key={value} onClick={()=> setLimit(value)}> {value} </li> 
                                        : <li key={value} className='pb-[5px]' onClick={()=> setLimit(value)}> {value} </li>
                                ))
                            }
                        </ul>
                    }
                </div>
            </div>

            <div className='flex items-center sort-by relative sort-dropdown cursor-pointer'
                 onClick={(e)=> toggleStickyDropdown(e, 'sortDropdown')}>
                    <span className='text-[13px] font-[500]' > Sort By </span>
                    <RiArrowDropDownLine/>
                    {openStickyDropdowns.sortDropdown && 
                    <ul className='list-none cursor-pointer absolute top-[22px] flex flex-col gap-[10px] justify-center 
                            w-[9rem] border border-borderLight2 rounded-[8px] text-[10px] z-[5] px-[10px] py-[1rem]' style={admin && {right:'0px'}}
                                ref={stickyDropdownRefs.sortDropdown}>
                        {
                            sortMenu.map(menuItem=> (
                                <li key={menuItem.name} style={ (menuItem?.invisibleOnTable && showByTable) ? {display:'none'}:{}} 
                                        onClick={(e)=> e.stopPropagation()}> 
                                    <span>  
                                        <input type='checkbox' value={menuItem.value} onChange={(e)=> sortCheckHandler(e, menuItem?.order)}
                                            checked={ Object.keys(sorts).find(key=> key === menuItem.value) 
                                                        && (menuItem?.order ? sorts[menuItem.value] === menuItem.order : true) || false } />
                                        <span> {menuItem.name} </span>
                                    </span>
                                </li>
                            ))
                        }
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