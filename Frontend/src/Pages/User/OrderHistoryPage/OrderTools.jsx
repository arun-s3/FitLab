import React, {useEffect, useState, useRef} from 'react'
import './OrderHistoryPage.css'

import {ShoppingBag, Truck, PackagePlus, PackageX , CalendarArrowDown}  from 'lucide-react'
import {RiArrowDropDownLine} from "react-icons/ri"
import {MdSort} from "react-icons/md"
import {TbCreditCardRefund} from "react-icons/tb";


export default function OrderTools({limit, setLimit, queryDetails, setQueryDetails}){

    const [activeTab, setActiveTab] = useState('Orders')
    const [orderDuration, setOrderDuration] = useState('All Orders')

    const mouseInSort = useRef(true)

    const [openDropdowns, setOpenDropdowns] = useState({durationDropdown: false, limitDropdown: false, sortDropdown: false})
    const dropdownRefs = {
      durationDropdown: useRef(null),
      limitDropdown: useRef(null),
      sortDropdown: useRef(null)
    }

    const toggleDropdown = (dropdownKey)=> {
      setOpenDropdowns((prevState)=>
        Object.keys(prevState).reduce((newState, key)=> {
          newState[key] = key === dropdownKey? !prevState[key] : false
          return newState
        }, {})
      )
    }

    useEffect(()=> {
      const handleClickOutside = (e)=> {
        const isOutside = !Object.values(dropdownRefs).some( (ref)=> ref.current?.contains(e.target) )
        console.log("isOutside--->", isOutside)

        if (isOutside){
          setOpenDropdowns((prevState)=>
            Object.keys(prevState).reduce((newState, key)=> {
              newState[key] = false
              return newState
            }, {})
          )
        }
      }
      document.addEventListener("click", handleClickOutside)
      return ()=> {
        document.removeEventListener("click", handleClickOutside)
      }
    }, [])
    
    const orderTabs = [
      {name: 'Orders', subtitle:'All Orders', icon: ShoppingBag},
      {name: 'Shipped', subtitle:'On Delivery', icon: Truck},
      {name: 'Delivered', subtitle:'Order Completed', icon: PackagePlus},
      {name: 'Cancelled', subtitle:'Cancelled orders', icon: PackageX},
      {name: 'Refunded', subtitle:'Refunded orders after review', icon: TbCreditCardRefund}
    ]

    const orderDurationHandler = (e)=> {
      const value = e.target.textContent.trim()
      const monthNumber = value.match(/\d+/).toString()
      setQueryDetails(query=> {
        return {...query, month: Number.parseInt(monthNumber)}
      })
    }

    const activateTab = (name)=> {
      setActiveTab(name)
      setQueryDetails(query=> {
        return {...query, orderStatus: name.toLowerCase().trim()}
      })
    }

    const limitHandler = (value)=> {
      setQueryDetails(query=> {
        return {...query, limit: value}
      })
      setLimit(value)
    }

    const radioClickHandler = (e)=>{
      const value = Number.parseInt(e.target.value)
      console.log("value---->", value)
      const checkStatus = queryDetails.sort === value
      console.log("checkStatus-->", checkStatus)
      if(checkStatus){
          console.log("returning..")
          return
      }else{
          console.log("Checking radio..")
          setQueryDetails(query=> {
            return {...query, sort: value}
          })
          const changeEvent = new Event('change', {bubbles:true})
          e.target.dispatchEvent(changeEvent)
      }
    }

    const radioChangeHandler = (e, value)=>{
      e.target.checked = (queryDetails.sort === Number.parseInt(value))
    }


    return(
                <div className="mb-[2rem] flex justify-between items-center" id='order-menu'>
                    <div className="px-[8px] py-[6px] flex gap-[10px] bg-white rounded-[9px] border border-primary shadow-sm">
                      {orderTabs.map((tab)=> (
                        <button key={tab.name} className={`px-[1rem] py-[8px] flex items-center gap-[5px] rounded-[7px] transition-all
                             duration-200 
                            ${activeTab === tab.name ? 
                              'text-black shadow-md transform scale-105'
                              : 'text-gray-600 hover:bg-gray-50' }`} onClick={()=> activateTab(tab.name)}>
                          <tab.icon className='w-[35px] h-[35px] p-[8px] text-white bg-primaryDark rounded-[5px]'/>
                          <div className='flex flex-col justify-between items-start'>
                            <span className='text-[15px]'> {tab.name} </span>
                            <span className='text-[10px] text-muted'> {tab.subtitle} </span>
                          </div>
                        </button>
                      ))}
                    </div>

                  <div className='flex justify-between items-center gap-[3rem]'>

                    <div className='h-[2.5rem] text-[14px] text-muted bg-white flex items-center gap-[10px]
                      justify-between border border-dropdownBorder rounded-[8px] shadow-sm cursor-pointer hover:bg-gray-50 transition-colors
                         optionDropdownsort-dropdown' onClick={(e)=> toggleDropdown('limitDropdown')}
                           id='limit-dropdown' ref={dropdownRefs.limitDropdown}>
                          <span className='relative flex items-center border-r border-dropdownBorder py-[8px] pl-[10px] pr-[2px]'> 
                            {limit} 
                            <i> <RiArrowDropDownLine/> </i>
                            {limit && openDropdowns.limitDropdown &&
                              <ul className='absolute top-[44px] left-[3px] right-0 py-[10px] w-[101%] rounded-b-[4px] flex flex-col items-center
                                 gap-[10px] text-[13px] bg-white border border-dropdownBorder rounded-[6px] cursor-pointer'>
                                  <li onClick={()=> limitHandler(10)}> 10 </li>
                                  <li onClick={()=> limitHandler(20)}> 20 </li>
                                  <li onClick={()=> limitHandler(30)}> 30 </li>
                                  <li className='pb-[5px]' onClick={()=> limitHandler(18)}> 40 </li>
                              </ul>
                          }
                          </span>
                          <span className='flex items-center py-[8px] pr-[16px]'>
                            <span className='font-[470]'> Orders </span> 
                          </span>
                    </div>

                    <div className='relative h-[2.5rem] px-[16px] py-[8px] text-[14px] text-muted bg-white flex items-center gap-[10px]
                        justify-between border border-dropdownBorder rounded-[8px] shadow-sm cursor-pointer hover:bg-gray-50 transition-colors
                           optionDropdown sort-dropdown' onClick={(e)=> toggleDropdown('sortDropdown')} id='sort-options' 
                              ref={dropdownRefs.sortDropdown}>
                        <span className='text-[13px] font-[470]'> Sort By </span>
                        <MdSort lassName='h-[15px] w-[15px] text-[#EF4444]'/>
                        {openDropdowns.sortDropdown && 
                        <ul className='list-none  px-[10px] py-[1rem] absolute top-[44px] left-0 flex flex-col gap-[10px] justify-center 
                                w-[12rem] text-[10px] bg-white border border-borderLight2 rounded-[8px] z-[5] cursor-pointer' 
                                    onMouseLeave={()=> mouseInSort.current = false} onMouseEnter={()=>  mouseInSort.current = true}>
                            <li> 
                                <span>  
                                    <input type='radio' value='-1' onClick={(e)=> radioClickHandler(e)}
                                        onChange={(e)=> radioChangeHandler(e, -1)} checked={queryDetails.sort === -1} />
                                    <span> Orders: Recent to Oldest </span>
                                </span>
                            </li>
                            <li> 
                                <span>  
                                    <input type='radio' value='1' onClick={(e)=> radioClickHandler(e)}
                                        onChange={(e)=> radioChangeHandler(e, 1)} checked={queryDetails.sort === 1} />
                                    <span> Orders: Oldest to Recent  </span>
                                </span>
                            </li>
                        </ul>
                        }
                    </div>

                    <div className="relative h-[2.5rem] px-[16px] py-[8px] text-[13px] text-muted font-500 bg-white flex items-center gap-[10px]
                        justify-between border border-dropdownBorder rounded-[8px] shadow-sm cursor-pointer hover:bg-gray-50 transition-colors
                           optionDropdown" id='duration-options'
                          onClick={()=> toggleDropdown('durationDropdown')} ref={dropdownRefs.durationDropdown}>
                        <span className='font-[470]'> {orderDuration} </span>
                        <CalendarArrowDown className='h-[15px] w-[15px]'/>      {/*text-[#EF4444]*/}
                        {openDropdowns.durationDropdown &&
                        <div className='options'>
                          <span onClick={(e)=> orderDurationHandler(e)}>Past 1 Month</span>
                          <span onClick={(e)=> orderDurationHandler(e)}>Past 3 Month</span>
                          <span onClick={(e)=> orderDurationHandler(e)}>Past 6 Months</span>
                          <span onClick={(e)=> orderDurationHandler(e)}>Past 12 Month</span>
                          <span onClick={(e)=> orderDurationHandler(e)}>All Orders</span>
                      </div>
                      }
                    </div>
                 </div>
              </div>
            
    )
}



