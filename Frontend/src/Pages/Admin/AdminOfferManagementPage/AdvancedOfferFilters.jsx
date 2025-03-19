import React, {useEffect, useRef, useState} from 'react'
import './AdvancedOfferFilters.css'

import {BadgePercent, BadgeIndianRupee, Truck, ChevronDown, Tag, ListTodo, Check, ChevronUp, Plus, Minus} from "lucide-react"
import {TbShoppingCartPlus} from "react-icons/tb"
import {TbPackages} from "react-icons/tb"
import {BiCategory} from "react-icons/bi"
import {MdOutlineArrowDropDownCircle} from "react-icons/md"

import {camelToCapitalizedWords} from "../../../Utils/helperFunctions"
import {SiteButtonSquare} from '../../../Components/SiteButtons/SiteButtons'


export default function AdvancedOfferFilters({queryOptions, setQueryOptions, close}){

    const [discountType, setDiscountType] = useState({show: false, value: 'all'})
    const [applicableType, setApplicableType] = useState({show: false, value: 'all', name: 'All'})

    const [minimumOrderValue, setMinimumOrderValue] = useState(null)
    const [usedCount, setUsedCount] = useState(null)
    const [isDisabled, setIsDisabled] = useState({minimumOrderValue: true, usedCount: true})

    const [error, setError] = useState({minimumOrderValue: '', usedCount: ''})

    const allDiscountTypes = ["percentage", "fixed", "freeShipping", "buyOneGetOne"]

    const allApplicableTypes = [
      {name: "All", value: "all"}, {name: "All Products", value: "allProducts"}, {name: "Specific Products", value: "products"},
      {name: "Specific Categories", value: "categories"}
    ]   

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

    const inputBlurHandler = (e, fieldName)=> { 
      console.log("Inside inputBlurHandler, fieldname", fieldName)
      const value = e.target.value.trim()
      console.log("value--->", value)
      const regexPattern = /^\d+$/
      if( value  && (!regexPattern.test(value) || value < 0) ){
        setError(error=> ( {...error, [fieldName]: `Please enter a valid ${camelToCapitalizedWords(fieldName)}!`} ) )
        e.target.style.borderColor = '#e74c3c'
      }
    }

    const incDecHandler = (type, operate)=> {
      console.log("Inside incDecHandler")
      const value = type === 'usedCount' ? Number(usedCount) : Number(minimumOrderValue)
      const setter = type === 'usedCount' ? setUsedCount : setMinimumOrderValue
      console.log("Number(formData[type])-->", value)
      if( ((value) || value == '0') && !isDisabled[type] ){
        if(value >= 0){
          if(operate === 1){
            setter(value + 1)
          }else{
            value !== 0 && setter(value - 1)
          }
        }
      }else return
    }

    const submitFilters = ()=> {
      setQueryOptions(query=> ({...query, discountType: discountType.value, applicableType: applicableType.value}))
      if(minimumOrderValue >= 0 && !isDisabled.minimumOrderValue){
        setQueryOptions(query=> ({...query, minimumOrderValue}))
      }
      if(usedCount >= 0 && !isDisabled.usedCount){
        setQueryOptions(query=> ({...query, usedCount}))
      }
      close()
    }



    return(
        <main className='w-[20rem] bg-white pt-[20px] pb-[25px] px-[35px] border border-borderLight2 rounded-[8px]'
             id='advancedOfferFilters' onClick={(e)=> e.stopPropagation()}>    

        <h4 className='text-[17px] font-[600] text-secondary tracking-[1.3px]'> Filter </h4>

        <div className='flex flex-col gap-[1rem] mt-[1rem]' id='filters'>

            <div>
                <h5 className='filter-label'> Discount Type </h5>
                <div className='relative w-[16rem] h-[30px] px-[10px] py-[8px] text-[14px] text-muted bg-white flex items-center 
                    gap-[10px] justify-center border border-dropdownBorder rounded-[4px] shadow-sm cursor-pointer
                     hover:bg-gray-50 transition-colors optionDropdown sort-dropdown'
                         onClick={()=> setDiscountType(discountType=> ({...discountType, show: !discountType.show}))}>
                     <div className='w-full flex items-center justify-between'>
                      <div className='flex items-center gap-[5px]'>
                       {
                         (()=> {
                           const DiscountIcon = getDiscountIcon(discountType.value)
                           return <DiscountIcon className='w-[13px] h-[13px] text-muted'/>
                         })()
                       }
                        <span className='text-[12px] font-[470] text-secondary'> 
                          { camelToCapitalizedWords(discountType.value) } 
                        </span> 
                      </div>
                      {
                        discountType.show ? <ChevronUp className='h-[15px] w-[15px] text-muted'/>
                          : <ChevronDown className='h-[15px] w-[15px] text-muted'/>
                      }
                     </div>
                     {discountType.show &&
                     <ul className='list-none  px-[10px] py-[1rem] absolute top-[37px] right-0 flex flex-col gap-[10px] justify-center 
                             w-[16rem] text-[10px] bg-white border border-borderLight2 rounded-[8px] z-[5] cursor-pointer'
                              onMouseLeave={()=> setDiscountType(discountType=> ({...discountType, show: false}))} >
                         {allDiscountTypes &&
                          allDiscountTypes.map(type=> (
                            <li key={type} onClick={(e)=> {
                              e.stopPropagation()
                              setDiscountType({show: false, value: type})
                            } }> 
                             <span className={`w-full h-[26px] pl-[8px] flex items-center gap-[7px] rounded-[5px] hover:text-primaryDark
                                 hover:bg-[#F5FBD2] ${discountType.value === type ? 'text-primaryDark' : 'text-muted'}}`} onClick={()=> setDiscountType({show:false, value: type}) }>  
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
                <div>
                <h5 className='filter-label'> Applicable Type </h5>
                <div className='relative w-[16rem] h-[30px] px-[10px] py-[8px] text-[14px] text-muted bg-white flex items-center 
                    gap-[10px] justify-center border border-dropdownBorder rounded-[4px] shadow-sm cursor-pointer
                     hover:bg-gray-50 transition-colors optionDropdown sort-dropdown'
                        onClick={()=> setApplicableType(type=> ({...type, show: !applicableType.show}))} >
                     <div className='w-full flex items-center justify-between'>
                      <div className='flex items-center gap-[5px]'>
                       {
                         (()=> {
                           const Icon = getApplicableIcon(applicableType.value)
                           return <Icon className='w-[13px] h-[13px] text-muted'/>
                         })()
                       }
                        <span className='text-[12px] font-[470] text-secondary'> 
                          { applicableType.name } 
                        </span> 
                      </div>
                      {
                        applicableType.show ? <ChevronUp className='h-[15px] w-[15px] text-muted'/>
                          : <ChevronDown className='h-[15px] w-[15px] text-muted'/>
                      }
                     </div>
                     {applicableType.show && 
                     <ul className='list-none  px-[10px] py-[1rem] absolute top-[37px] right-0 flex flex-col gap-[10px] justify-center 
                         w-[16rem] text-[10px] bg-white border border-borderLight2 rounded-[8px] z-[5] cursor-pointer'
                            onMouseLeave={()=> setApplicableType(type=> ({...type, show:false}))}>
                         {allApplicableTypes &&
                          allApplicableTypes.map(type=> (
                            <li key={type.value} onClick={(e)=> {
                              e.stopPropagation()
                              setApplicableType({show: false, name: type.name, value: type.value }) 
                            }}> 
                             <span className={`w-full h-[26px] pl-[8px] flex items-center gap-[7px] rounded-[5px] hover:text-primaryDark
                                 hover:bg-[#F5FBD2] ${applicableType.value === type.value ? 'text-primaryDark' : 'text-muted'}}`}>  
                                {
                                  (()=> {
                                    const UserIcon = getApplicableIcon(type.value)
                                    console.log("type.value--->", type.value)
                                    return <UserIcon className={`w-[15px] h-[15px] text-inherit`}/>
                                  })()
                                }        
                                 <span className='text-[13px] capitalize'> { type.name } </span>
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
              <div className="relative">
                <div className="w-full flex items-center justify-between">
                  <label htmlFor="usedCount" className="filter-label block text-muted">
                    Below Used Count
                  </label>
                  <span className={`text-[10px] ${isDisabled.usedCount ? 'text-[#07bc0c]' : 'text-red-500'}`}
                      onClick={()=> setIsDisabled(isDisabled=> ({...isDisabled, usedCount: !isDisabled.usedCount}))}> 
                      {isDisabled.usedCount ? 'Enable?' : 'Disable?'}
                  </span>
                </div>
                <input type="text" id="usedCount" name="usedCount" value={usedCount} 
                  placeholder="Filter offers below this used count" disabled={isDisabled.usedCount}
                   className={`h-[2.2rem] ${isDisabled.usedCount && 'bg-[#E9EBEE]'}`} 
                    onBlur={(e)=> inputBlurHandler(e, "usedCount")} onChange={(e)=> setUsedCount(e.target.value)}/>
                <div className="input-contoller">
                  <Plus onClick={()=> incDecHandler('usedCount', 1)}/>
                  <Minus onClick={()=> incDecHandler('usedCount', -1)}/>
                </div>  
                <span className='error bottom-0 right-0'> {error.usedCount && error.usedCount} </span>
              </div>
            </div>

            <div>
              <div className="relative">
                  <div className="w-full flex items-center justify-between">
                    <label htmlFor="minimumOrderValue" className="filter-label block text-muted">
                      Below Minimum Order Value
                    </label>
                    <span className={`text-[10px] ${isDisabled.minimumOrderValue ? 'text-[#07bc0c]' : 'text-red-500'}`}
                        onClick={()=> setIsDisabled(isDisabled=> ({...isDisabled, minimumOrderValue: !isDisabled.minimumOrderValue}))}> 
                        {isDisabled.minimumOrderValue ? 'Enable?' : 'Disable?'}
                    </span>
                  </div>
                  <input type="text" id="minimumOrderValue" name="minimumOrderValue" value={minimumOrderValue} 
                    placeholder="Filter offers below this minimum order value" disabled={isDisabled.minimumOrderValue}
                     className={`h-[2.2rem] ${isDisabled.minimumOrderValue && 'bg-[#E9EBEE]'}`} 
                      onBlur={(e)=> inputBlurHandler(e, "minimumOrderValue")} onChange={(e)=> setMinimumOrderValue(e.target.value)}/>
                  <div className="input-contoller">
                    <Plus onClick={()=> incDecHandler('minimumOrderValue', 1)}/>
                    <Minus onClick={()=> incDecHandler('minimumOrderValue', -1)}/>
                  </div>  
                  <span className='error bottom-0 right-0'> {error.minimumOrderValue && error.minimumOrderValue} </span>
              </div>
            </div>

            <div className='text-right'>
                <SiteButtonSquare customStyle={{paddingBlock: '3px', paddingInline: '28px', borderRadius:'4px'}}
                   light={true} lowFont={true} clickHandler={()=> submitFilters()}> 
                    Apply
                </SiteButtonSquare>
            </div>

            </div>
        </main>
    )
}