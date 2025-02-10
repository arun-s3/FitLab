import React,{useState, useEffect, useRef} from 'react'
import './ProductListingTools.css'
import {useSelector, useDispatch} from 'react-redux'
import {debounce} from 'lodash'

import {RiArrowDropDownLine} from "react-icons/ri"
import {BsFillGrid3X3GapFill} from "react-icons/bs"
import {FaList} from "react-icons/fa"

import useFlexiDropdown from '../../Hooks/FlexiDropdown'
import useStickyDropdown from '../../Hooks/StickyDropdown'
import {searchProduct, getAllProducts} from '../../Slices/productSlice'
import {SearchInput} from '../FromComponents/FormComponents'


export default function ProductListingTools({admin, showByGrid, setShowByGrid, showByTable, sortHandlers, sortMenu, limiter, queryOptions, 
    setQueryOptions, wishlistDisplay = false}){

    const {sorts, setSorts} = sortHandlers
    const {limit, setLimit} = limiter

    const {openDropdowns, dropdownRefs, toggleDropdown} = useFlexiDropdown(['limitDropdown'])

    const {openStickyDropdowns, stickyDropdownRefs, toggleStickyDropdown} = useStickyDropdown(['sortDropdown'])

    const {products, productCounts} = useSelector(state=> state.productStore)
    const dispatch = useDispatch()

    const limitValues = [9, 12, 15, 18]

    const debouncedSearch = useRef(
        debounce((searchData)=> {
        //   dispatch(searchProduct({find: searchData}))
            setQueryOptions(queryOptions=> (
                {...queryOptions, searchData: searchData}
            ))
        }, 600) 
    ).current;

    // const debouncedProducts = useRef(
    //     debounce(()=> {
    //         dispatch( getAllProducts({queryOptions}) )
    //     }, 1000) 
    // ).current;

    const searchHandler = (e)=> {
        const searchData = e.target.value
        console.log('searchData--->', searchData)
        if(searchData.trim() !== ''){
            console.log("Getting searched products--")
            debouncedSearch(searchData)
        } 
        else{
            console.log("Getting all products--")
            console.log('QUERYOOPTIONS FROM productListingTool--->', JSON.stringify(queryOptions))
            // debouncedProducts()
            debouncedSearch.cancel()
            if(queryOptions.searchData){
                setQueryOptions(queryOptions=> {
                    const { searchData, ...rest } = queryOptions
                    return rest
                })
            }
        } 
    }

    const sortCheckHandler = (e, order) => {
        const sortKey = e.target.value
        const sortValue = order
        console.log(`sortKey --> ${sortKey}, sortValue --> ${sortValue}`);
      
        if (e.target.checked){
            if(Object.keys(sorts).some((key) => key === sortKey)){
               console.log("sortKey already exists")
               e.target.checked = false
               setSorts({})
               return
             }
             else{
               console.log("Setting sort...")
               setSorts({[sortKey]: sortValue})
               return
             }
        } else {
          console.log("Unchecked....")
            setSorts({})
            return
        }
      }
      


    return(

        <div className='flex justify-between' id='ProductListingTools'>

            <input type='search' placeholder={wishlistDisplay ? 'Search Wishlist...' : 'Search Fitlab..'} 
              className={`h-[34px] w-[34rem] text-secondary rounded-[7px] placeholder:text-[11px] 
                 ${ wishlistDisplay ? 'border-2 border-dropdownBorder shadow-sm focus:ring-2 focus:ring-secondary focus:border-0 focus:shadow-lg' 
                    : 'search-fitlab focus:shadow-lg'} `}
                 onChange={(e)=> searchHandler(e)} />


            <div className='flex gap-[2rem] items-center'>

            { !wishlistDisplay &&
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
            }

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
                                        <span className={`${Object.keys(sorts).find(key=> key === menuItem.value) 
                                                            && (menuItem?.order ? sorts[menuItem.value] === menuItem.order : true) 
                                                            ? 'text-secondary' : 'text-[rgb(18,18,18)]'}`}>
                                            {menuItem.name}
                                        </span>
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