import React, {useState, useEffect, useRef} from 'react'
import './AdminCouponManagementPage.css'
import {useOutletContext} from 'react-router-dom'
import {useSelector, useDispatch} from "react-redux"
import {debounce} from 'lodash'


import { Plus, Search } from "lucide-react"
import {RiArrowDropDownLine} from "react-icons/ri"
import {MdSort} from "react-icons/md"

import AdminHeader from '../../../Components/AdminHeader/AdminHeader'
import CouponList from "./CouponList"
import CouponModal from "./CouponModal"
import CouponDeleteModal from "./CouponDeleteModal"
import useFlexiDropdown from '../../../Hooks/FlexiDropdown'
import {DateSelector} from '../../../Components/Calender/Calender'
import {getAllCoupons, searchCoupons, resetCouponStates} from '../../../Slices/couponSlice'




export default function AdminCouponManagementPage(){

    const [coupons, setCoupons] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" })

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [editingCoupon, setEditingCoupon] = useState(null)

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [couponToDelete, setCouponToDelete] = useState(null)

    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)

    const [limit, setLimit] = useState(10) 

    const {openDropdowns, dropdownRefs, toggleDropdown} = useFlexiDropdown(['limitDropdown', 'sortDropdown'])
    
    const [queryOptions, setQueryOptions] = useState({page: 1, limit: 6})

    const {setHeaderZIndex} = useOutletContext()
    setHeaderZIndex(0)

    const {coupons: allCoupons } = useSelector(state=> state.coupons)
    const dispatch = useDispatch()
    

    useEffect(() => {
      if(allCoupons.length > 0){
        setCoupons(allCoupons)
      }
    }, [allCoupons])

    useEffect(()=> {
      setQueryOptions(query=> {
        return {...query, startDate, endDate}
      })
    },[startDate, endDate])

    useEffect(() => {
      console.log("queryOptions----->", queryOptions)
      if(Object.keys(queryOptions).length > 0){
        dispatch( getAllCoupons({queryOptions}) )
      }
    }, [queryOptions])
  
    const handleSort = (key)=> {
      const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc"
      setSortConfig({ key, direction })
      const sorted = [...coupons].sort((a, b) => {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1
        return 0
      })
      setCoupons(sorted)
    }

    const debouncedSearch = useRef(
      debounce((searchData)=> {
        dispatch(searchCoupons({query: searchData}))
      }, 600) 
    ).current
  
    const searchCoupon = (e)=> {
      const searchData = e.target.value
      console.log('searchData--->', searchData)
      if(searchData.trim() !== ''){
          console.log("Getting searched lists--")
          debouncedSearch(searchData)
      } 
      else{
          console.log("Getting all lists--")
          debouncedSearch.cancel()
          dispatch( getAllCoupons({queryOptions}) )
      } 
    }

    const limitHandler = (value)=> {
      setQueryOptions(query=> {
        return {...query, limit: value}
      })
      setLimit(value)
    }
  
    const radioClickHandler = (e)=>{
      const value = Number.parseInt(e.target.value)
      console.log("value---->", value)
      const checkStatus = queryOptions.sort === value
      console.log("checkStatus-->", checkStatus)
      if(checkStatus){
          console.log("returning..")
          return
      }else{
          console.log("Checking radio..")
          setQueryOptions(query=> {
            return {...query, sort: value}
          })
          const changeEvent = new Event('change', {bubbles:true})
          e.target.dispatchEvent(changeEvent)
      }
    }
  
    const radioChangeHandler = (e, value)=>{
      e.target.checked = (queryOptions.sort === Number.parseInt(value))
    }



    return(
        <section id='AdminCouponManagementPage'>

            <header>

                <AdminHeader heading='Coupon Management' subHeading="Manage and track Coupons with Advanced controls and Analytics"/>

            </header>

            <main>

                <div className="container mx-auto px-4">

                      <button onClick={()=> setIsModalOpen(true)} className="ml-auto bg-secondary text-[15px] text-white px-[17px]
                       py-[6px] rounded-md hover:bg-purple-700 transition duration-300 flex items-center">
                        <Plus className="h-5 w-5 mr-2" />
                        Create Coupon
                      </button>

                    <div className="flex justify-between items-center mb-6 mt-[1rem]">
                      <div className="relative">
                        <input type= "text" placeholder="Search coupons..."
                            className="w-[20rem] h-[36px] text-[15px] pl-10 pr-4 py-2 rounded-[6px] border border-gray-300 
                              tracking-[0.2px]  placeholder:text-[12px] focus:outline-none focus:border-0 focus:ring-2
                                 focus:ring-secondary" onChange={(e)=> searchCoupon(e)}/>
                        <Search className="absolute left-3 top-2.5 h-[17px] w-[17px] text-gray-400" />
                      </div>
                      <div id='coupon-menu' className='flex items-center gap-[2rem]'>

                        <DateSelector dateGetter={{startDate, endDate}} dateSetter={{setStartDate, setEndDate}} labelNeeded={true}/>


                        <div className='flex items-center gap-[1rem]'>
                           <div className='h-[35px] text-[14px] text-muted bg-white flex items-center gap-[10px]
                             justify-between border border-dropdownBorder rounded-[8px] shadow-sm cursor-pointer hover:bg-gray-50
                              transition-colors optionDropdown sort-dropdown' onClick={(e)=> toggleDropdown('limitDropdown')}
                                id='limit-dropdown' ref={dropdownRefs.limitDropdown}>
                               <span className='relative flex items-center border-r border-dropdownBorder py-[8px] pl-[10px] pr-[2px]'> 
                                 {limit} 
                                 <i> <RiArrowDropDownLine/> </i>
                                 {limit && openDropdowns.limitDropdown && 
                                   <ul className='absolute top-[44px] left-[3px] right-0 py-[10px] w-[101%] rounded-b-[4px] flex 
                                    flex-col items-center gap-[10px] text-[13px] bg-white border border-dropdownBorder rounded-[6px] 
                                      cursor-pointer'>
                                       <li onClick={()=> limitHandler(10)}> 10 </li>
                                       <li onClick={()=> limitHandler(20)}> 20 </li>
                                       <li onClick={()=> limitHandler(30)}> 30 </li>
                                       <li className='pb-[5px]' onClick={()=> limitHandler(18)}> 40 </li>
                                   </ul>
                               }
                               </span>
                               <span className='flex items-center py-[8px] pr-[16px]'>
                                 <span className='font-[470]'> Coupons </span> 
                               </span>
                           </div>
                           <div className='relative h-[35px] px-[16px] py-[8px] text-[14px] text-muted bg-white flex items-center 
                            gap-[10px] justify-between border border-dropdownBorder rounded-[8px] shadow-sm cursor-pointer
                             hover:bg-gray-50 transition-colors optionDropdown sort-dropdown'
                                 onClick={(e)=> toggleDropdown('sortDropdown')} id='sort-options' ref={dropdownRefs.sortDropdown}>
                             <span className='text-[13px] font-[470]'> Sort By </span>
                             <MdSort lassName='h-[15px] w-[15px] text-[#EF4444]'/>
                             {openDropdowns.sortDropdown && 
                             <ul className='list-none  px-[10px] py-[1rem] absolute top-[44px] right-0 flex flex-col gap-[10px] justify-center 
                                     w-[12rem] text-[10px] bg-white border border-borderLight2 rounded-[8px] z-[5] cursor-pointer'>
                                 <li> 
                                     <span>  
                                         <input type='radio' value='-1' onClick={(e)=> radioClickHandler(e)}
                                             onChange={(e)=> radioChangeHandler(e, -1)} checked={queryOptions.sort === -1} />
                                         <span> Orders: Recent to Oldest </span>
                                     </span>
                                 </li>
                                 <li> 
                                     <span>  
                                         <input type='radio' value='1' onClick={(e)=> radioClickHandler(e)}
                                             onChange={(e)=> radioChangeHandler(e, 1)} checked={queryOptions.sort === 1} />
                                         <span> Orders: Oldest to Recent  </span>
                                     </span>
                                 </li>
                             </ul>
                             }
                           </div>
                        </div>
                        </div>
                      
                      </div>

                    <CouponList coupons={coupons} onEdit={(coupon)=> { setEditingCoupon(coupon); setIsModalOpen(true); }}
                      onDelete={(coupon)=> { setCouponToDelete(coupon); setIsDeleteModalOpen(true); }}
                        onSort={handleSort} sortConfig={sortConfig} />

                    <CouponModal isOpen={isModalOpen} onClose={()=> { setIsModalOpen(false); setEditingCoupon(null); }}
                        coupon={editingCoupon} isEditing={editingCoupon ? true : false}/>

                    <CouponDeleteModal isOpen={isDeleteModalOpen} onClose={()=> {setIsDeleteModalOpen(false); setCouponToDelete(null)}}
                        coupon={couponToDelete} />
                        
                </div>

            </main>

        </section>
    )
}