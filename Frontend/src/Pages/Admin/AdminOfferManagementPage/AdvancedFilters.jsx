import React, {useEffect, useRef, useState} from 'react'
import './AdvancedFilters.css'

import {BadgePercent, BadgeIndianRupee, Truck, ChevronDown, Tag, ListTodo, Check} from "lucide-react"
import {TbShoppingCartPlus} from "react-icons/tb"
import {TbPackages} from "react-icons/tb"
import {BiCategory} from "react-icons/bi"
import {MdOutlineArrowDropDownCircle} from "react-icons/md"

import {camelToCapitalizedWords} from "../../../Utils/helperFunctions"
import {SiteButtonSquare} from '../../../Components/SiteButtons/SiteButtons'


export default function AdvancedFilters({queryOptions, setQueryOptions}){

    const [showDiscountTypes, setShowDiscountTypes] = useState(false)
    const [showApplicableTypes, setShowApplicableTypes] = useState(false)

    const discountTypes = ["percentage", "fixed", "freeShipping", "buyOneGetOne"]

    const applicableTypes = ["all", "allProducts", "products", "categories"]

    const getDiscountIcon = (discountType)=> {
      switch(discountType){
        case "all":
          return Tag
        case "percentage":
          return BadgePercent
        case "fixed":
          return BadgeIndianRupee
        case "freeShipping":
          return Truck
        case "buyOneGetOne": 
          return TbShoppingCartPlus
      }
    }
    
    const getApplicableIcon = (applicableType)=> {
        switch(applicableType){
          case "all":
            return Check
          case "allProducts":
            return ListTodo
          case "products":
            return TbPackages
          case "categories":
            return BiCategory
        }
    }
    

    return(
        <div className='w-[20rem] bg-white pt-[20px] pb-[25px] px-[35px] border border-borderLight2 rounded-[8px]'
             id='admin-product-filter' onClick={(e)=> e.stopPropagation()}>    {/* border-[#e5e7eb] */}
        <h4 className='text-[16px] font-[600] text-secondary tracking-[1.3px]'> Filter </h4>
        <div className='flex flex-col gap-[1.5rem] mt-[1rem]'>
            <div onMouseEnter={()=> setShowDiscountTypes(true)} 
                            onMouseLeave={()=> setShowDiscountTypes(false)}>
                <h5 className='filter-label'> Discount Type </h5>
                <div className='relative w-[16rem] h-[35px] px-[10px] py-[8px] text-[14px] text-muted bg-white flex items-center 
                    gap-[10px] justify-center border border-dropdownBorder rounded-[4px] shadow-sm cursor-pointer
                     hover:bg-gray-50 transition-colors optionDropdown sort-dropdown'
                         >
                     <div className='w-full flex items-center justify-between'>
                      <div className='flex items-center gap-[5px]'>
                       {
                         (()=> {
                           const DiscountIcon = getDiscountIcon(queryOptions.discountType)
                           return <DiscountIcon className='w-[15px] h-[15px] text-muted'/>
                         })()
                       }
                        <span className='text-[12px] font-[470] text-secondary'> 
                          { camelToCapitalizedWords(queryOptions.discountType) } 
                        </span> 
                      </div>
                      <ChevronDown className='h-[15px] w-[15px] text-muted'/>
                     </div>
                     {showDiscountTypes && 
                     <ul className='list-none  px-[10px] py-[1rem] absolute top-[37px] right-0 flex flex-col gap-[10px] justify-center 
                             w-[16rem] text-[10px] bg-white border border-borderLight2 rounded-[8px] z-[5] cursor-pointer'
                                >
                         {discountTypes &&
                          discountTypes.map(type=> (
                            <li key={type} onClick={()=> setQueryOptions(query=> { return {...query, discountType: type} })}> 
                             <span className={`w-full h-[26px] pl-[8px] flex items-center gap-[7px] rounded-[5px] hover:text-primaryDark
                                 hover:bg-[#F5FBD2] ${queryOptions.discountType === type ? 'text-primaryDark' : 'text-muted'}}`}>  
                                {
                                  (()=> {
                                    const UserIcon = getDiscountIcon(type)
                                    return <UserIcon className={`w-[15px] h-[15px] text-inherit`}/>
                                  })()
                                }        
                                 <span className='text-[13px] capitalize'> { camelToCapitalizedWords(type) } </span>
                             </span>
                            </li>
                          ))
                         }
                      </ul>
                      }
                </div>
            </div>
            <div>
                <div onMouseEnter={()=> setShowApplicableTypes(true)} 
                            onMouseLeave={()=> setShowApplicableTypes(false)}>
                <h5 className='filter-label'> Applicable Type </h5>
                <div className='relative w-[16rem] h-[35px] px-[10px] py-[8px] text-[14px] text-muted bg-white flex items-center 
                    gap-[10px] justify-center border border-dropdownBorder rounded-[4px] shadow-sm cursor-pointer
                     hover:bg-gray-50 transition-colors optionDropdown sort-dropdown'
                         >
                     <div className='w-full flex items-center justify-between'>
                      <div className='flex items-center gap-[5px]'>
                       {
                         (()=> {
                           const Icon = getApplicableIcon(queryOptions.applicableType)
                           return <Icon className='w-[15px] h-[15px] text-muted'/>
                         })()
                       }
                        <span className='text-[12px] font-[470] text-secondary'> 
                          { camelToCapitalizedWords(queryOptions.applicableType) } 
                        </span> 
                      </div>
                      <ChevronDown className='h-[15px] w-[15px] text-muted'/>
                     </div>
                     {showApplicableTypes && 
                     <ul className='list-none  px-[10px] py-[1rem] absolute top-[37px] right-0 flex flex-col gap-[10px] justify-center 
                             w-[16rem] text-[10px] bg-white border border-borderLight2 rounded-[8px] z-[5] cursor-pointer'
                                >
                         {applicableTypes &&
                          applicableTypes.map(type=> (
                            <li key={type} onClick={()=> setQueryOptions(query=> { return {...query, applicableType: type} })}> 
                             <span className={`w-full h-[26px] pl-[8px] flex items-center gap-[7px] rounded-[5px] hover:text-primaryDark
                                 hover:bg-[#F5FBD2] ${queryOptions.discountType === type ? 'text-primaryDark' : 'text-muted'}}`}>  
                                {
                                  (()=> {
                                    const UserIcon = getApplicableIcon(type)
                                    return <UserIcon className={`w-[15px] h-[15px] text-inherit`}/>
                                  })()
                                }        
                                 <span className='text-[13px] capitalize'> { camelToCapitalizedWords(type) } </span>
                             </span>
                            </li>
                          ))
                         }
                      </ul>
                      }
                </div>
            </div>
            </div>
            <div>
                <h5 className='filter-label'> Used Count </h5>

            </div>
            <div>
                <h5 className='filter-label'> Minimum order value </h5>
                
            </div>

                <div className='text-right'>
                    <SiteButtonSquare customStyle={{paddingBlock: '3px', paddingInline: '28px', borderRadius:'7px'}} light={true} lowFont={true}> 
                        Apply
                    </SiteButtonSquare>
                </div>

            </div>
        </div>
    )
}