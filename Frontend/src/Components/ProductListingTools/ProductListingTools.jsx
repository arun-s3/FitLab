import React, {useEffect, useRef} from 'react'
import './ProductListingTools.css'
import {debounce} from 'lodash'

import {RiArrowDropDownLine} from "react-icons/ri"
import {BsFillGrid3X3GapFill} from "react-icons/bs"
import {FaList} from "react-icons/fa"
import {VscSettings} from "react-icons/vsc"

import useFlexiDropdown from '../../Hooks/FlexiDropdown'
import useStickyDropdown from '../../Hooks/StickyDropdown'


export default function ProductListingTools({admin, showByGrid, setShowByGrid, showByTable, sortHandlers, sortMenu, limiter, queryOptions, 
    setQueryOptions, showFilter, filterHandler, wishlistDisplay = false}){

    const {sorts, setSorts} = sortHandlers
    const {limit, setLimit} = limiter

    const {openDropdowns, dropdownRefs, toggleDropdown} = useFlexiDropdown(['limitDropdown'])

    const {openStickyDropdowns, stickyDropdownRefs, toggleStickyDropdown} = useStickyDropdown(['sortDropdown'])

    const limitValues = [9, 12, 15, 18]

    useEffect(()=> {
        const handleResizing = ()=> {
            if(window.innerWidth <= 1150){
                setShowByGrid(true)
            }
        }
        setShowByGrid && handleResizing()
        window.addEventListener('resize', handleResizing)

        return ()=> window.removeEventListener('resize', handleResizing)
    },[])

    const debouncedSearch = useRef(
        debounce((searchData)=> {
            setQueryOptions(queryOptions=> (
                {...queryOptions, searchData: searchData}
            ))
        }, 600) 
    ).current;

    const searchHandler = (e)=> {
        const searchData = e.target.value
        if(searchData.trim() !== ''){
            debouncedSearch(searchData)
        } 
        else{
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
      
        if (e.target.checked){
            if(Object.keys(sorts).some((key) => key === sortKey)){
               e.target.checked = false
               setSorts({})
               return
             }
             else{
               setSorts({[sortKey]: sortValue})
               return
             }
        } else {
            setSorts({})
            return
        }
      }
      

    return(

        <div className='w-[18rem] xxs-sm:w-[19rem] xs-sm2:w-auto flex flex-col justify-between lg:flex-row gap-[1rem] lg:gap-[2rem]' 
            id='ProductListingTools'>

            <input type='search'
                placeholder={wishlistDisplay ? 'Search Wishlist...' : 'Search Fitlab..'} 
                className={`h-[34px] lg:w-[47%] x-lg:w-[25rem] xl:w-[34rem] text-secondary rounded-[7px] placeholder:text-[11px] 
                  ${wishlistDisplay ? 'border-2 border-dropdownBorder shadow-sm focus:ring-2 focus:ring-secondary focus:border-0 focus:shadow-lg' 
                    : 'search-fitlab focus:shadow-lg'} `}
                onChange={(e)=> searchHandler(e)} 
            />


            <div className='flex gap-[2rem] items-center justify-between lg:justify-normal'>
            
            {
            showFilter &&
                <button className='flex gap-[8px] items-center xx-md:hidden px-[10px] py-[5px] bg-whitesmoke hover:bg-purple-500  
                 text-secondary hover:text-white transition duration-150 border border-inputBorderLow hover:border-secondary
                  rounded-[7px] cursor-pointer'
                    onClick={()=> filterHandler()}>
                        <VscSettings className='text-inherit'/>
                        <h3 className='text-[13px] xs-sm:text-[14px] text-inherit font-[500] leading-[0.8px]'> Filter </h3>
                </button>
            }

            { !wishlistDisplay &&
            <div className='flex items-center gap-[10px]'>
                <span className='text-[12px] xs-sm:text-[13px] font-[500]'> Showing </span>
                <div className='flex items-center justify-center bg-secondaryLighter rounded-[4px] text-[12px] text-secondary py-[2px] xx-md:py-0
                        border border-inputBorderLow xx-md:border-primary px-[8px] relative z-[5] cursor-pointer'
                    onClick={(e)=> toggleDropdown('limitDropdown')}
                    id='limit-dropdown' 
                    ref={dropdownRefs.limitDropdown}
                >
                    <span> {limit} </span>
                    <i> <RiArrowDropDownLine/> </i>
                    {openDropdowns.limitDropdown && 
                        <ul className='absolute top-[22px] pt-[5px] w-[101%] rounded-[4px] flex flex-col items-center gap-[5px] 
                                border border-primary cursor-pointer'>
                            {
                                limitValues.map( (value, index)=> (
                                    index !== (limitValues.length - 1) 
                                        ? <li key={value} onClick={()=> setLimit(value)}> {value} </li> 
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
                    <span className='text-[12px] xs-sm:text-[13px] font-[500] whitespace-nowrap' > Sort By </span>
                    <RiArrowDropDownLine/>
                    {openStickyDropdowns.sortDropdown && 
                    <ul className='list-none cursor-pointer absolute top-[22px] flex flex-col gap-[10px] justify-center 
                            w-[9rem] border border-borderLight2 rounded-[8px] text-[10px] z-[5] px-[10px] py-[1rem]' 
                        style={admin && {right:'0px'}}
                        ref={stickyDropdownRefs.sortDropdown}>
                        {
                            sortMenu.map(menuItem=> (
                                <li key={menuItem.name} 
                                    style={ (menuItem?.invisibleOnTable && showByTable) ? {display:'none'}:{}} 
                                    onClick={(e)=> e.stopPropagation()}
                                > 
                                    <span>  
                                        <input type='checkbox' 
                                            value={menuItem.value} 
                                            onChange={(e)=> sortCheckHandler(e, menuItem?.order)}
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
                <div className='hidden x-lg:flex items-center gap-[5px] relative view-type'>
                    <span data-label='Grid View' onClick={()=> setShowByGrid(true)}>  <BsFillGrid3X3GapFill/> </span>
                    <span data-label='List View' onClick={()=> setShowByGrid(false)}> <FaList/> </span>
                </div>
                }

            </div>
        </div>

    )
}