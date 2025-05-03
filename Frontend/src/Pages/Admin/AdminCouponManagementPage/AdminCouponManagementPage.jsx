import React, {useState, useEffect, useRef} from 'react'
import './AdminCouponManagementPage.css'
import {useOutletContext} from 'react-router-dom'
import {useSelector, useDispatch} from "react-redux"
import {debounce} from 'lodash'

import {Plus, Search, SlidersHorizontal, CalendarX2} from "lucide-react"
// import {IconFilePercent, IconRosetteDiscount, IconRosetteDiscountCheck, IconRosetteDiscountOff} from "@tabler/icons-react"
import {RiArrowDropDownLine} from "react-icons/ri"
import {MdSort} from "react-icons/md"
import {toast} from 'react-toastify'
import {TbDiscountOff} from "react-icons/tb";

import AdminHeader from '../../../Components/AdminHeader/AdminHeader'
import CouponList from "./CouponList"
import CouponModal from "./CouponModal"
import CouponDeleteModal from "./CouponDeleteModal"
import AdvancedCouponFilters from './AdvancedCouponFilters'
import useFlexiDropdown from '../../../Hooks/FlexiDropdown'
import useStickyDropdown from '../../../Hooks/StickyDropdown'
import {convertToCamelCase, camelToCapitalizedWords} from "../../../Utils/helperFunctions"
import {DateSelector} from '../../../Components/Calender/Calender'
import {getAllCoupons, searchCoupons, toggleCouponStatus, resetCouponStates} from '../../../Slices/couponSlice'
import PaginationV2 from '../../../Components/PaginationV2/PaginationV2'


export default function AdminCouponManagementPage(){

    const [coupons, setCoupons] = useState([])

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [editingCoupon, setEditingCoupon] = useState(null)

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [couponToDelete, setCouponToDelete] = useState(null)

    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)

    const [limit, setLimit] = useState(6) 
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = 20

    const {openDropdowns, dropdownRefs, toggleDropdown} = useFlexiDropdown(['limitDropdown', 'sortDropdown', 'statusDropdown'])

    const {openStickyDropdowns, stickyDropdownRefs, toggleStickyDropdown} = useStickyDropdown(['filterDropdown'])

    const [advFilterEvent, setAdvFilterEvent] = useState(null)
    
    const [queryOptions, setQueryOptions] = useState({page: 1, limit: 6, status: 'all'})

    const {setHeaderZIndex} = useOutletContext()
    setHeaderZIndex(0)

    const {coupons: allCoupons, couponDeactivated} = useSelector(state=> state.coupons)
    const dispatch = useDispatch()
    

    useEffect(() => {
        setCoupons(allCoupons)
    }, [allCoupons])

    useEffect(()=> {
      setQueryOptions(query=> {
        return {...query, page: currentPage, startDate, endDate}
      })
    },[startDate, endDate, currentPage])

    useEffect(() => {
      console.log("queryOptions----->", queryOptions)
      if(Object.keys(queryOptions).length > 0){
        dispatch( getAllCoupons({queryOptions}) )
      }
    }, [queryOptions])

    useEffect(()=> {
      if(couponDeactivated){
        toast.success('The coupon is successfully deactivated!')
      }
      dispatch(resetCouponStates())
    },[couponDeactivated])

    const sortTypes = [
      {name: 'Coupons: Recent to Oldest', value: '-1', sortBy: 'createdAt'}, {name: 'Coupons: Oldest to Recent', value: '1', sortBy: 'createdAt'},
      {name: 'Alphabetical: A to Z', value: '1', sortBy: 'code'}, {name: 'Alphabetical: Z to A', value: '-1', sortBy: 'code'}
    ]

    const statusTypes = [
      {name: 'All', icon: IconFilePercent},
      {name: 'Active', icon: IconRosetteDiscount},
      {name: 'Expired', icon: CalendarX2}, 
      {name: 'Deactivated', icon: IconRosetteDiscountOff},
      {name: 'Used up', icon: IconRosetteDiscountCheck},
    ]

    const getStatusIcon = (statusType)=> {
      switch(statusType){
        case "All":
          return IconFilePercent
        case "Active":
          return IconRosetteDiscount
        case "Expired":
          return CalendarX2
        case "Deactivated":
          return IconRosetteDiscountOff
        case "Used up": 
          return IconRosetteDiscountCheck
      }
    }

    const debouncedSearch = useRef(
      debounce((searchData)=> {
        setQueryOptions(query=> (
          {...query, searchData}
        ))
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
          setQueryOptions(query=> {
            const {searchData, ...rest} = query
            return rest
          })
      } 
    }

    const limitHandler = (value)=> {
      setQueryOptions(query=> {
        return {...query, limit: value}
      })
      setLimit(value)
    }
  
    const radioClickHandler = (e, sortBy)=>{
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
            return {...query, sort: value, sortBy}
          })
          const changeEvent = new Event('change', {bubbles:true})
          e.target.dispatchEvent(changeEvent)
      }
    }
  
    const radioChangeHandler = (e, value)=>{
      e.target.checked = (queryOptions.sort === Number.parseInt(value))
    }

    const handleSort = (sortBy, sort)=> {
      setQueryOptions(query=> {
        return {...query, sortBy, sort}
      })
    }



    return(
        <section id='AdminCouponManagementPage'>

            <header>

                <AdminHeader heading='Coupon Management' subHeading="Manage and track Coupons with Advanced controls and Analytics"/>

            </header>

            <main className='mt-[3rem]'>

                <div className="container mx-auto px-4">

                  <div className="flex justify-between items-center mb-[10px] mt-[1rem]">
                    <button onClick={()=> setIsModalOpen(true)} className="bg-secondary text-[15px] text-white px-[17px]
                     py-[6px] rounded-md hover:bg-purple-700 transition duration-300 flex items-center">
                      <Plus className="h-5 w-5 mr-2" />
                      Create Coupon
                    </button>

                    <div className='flex items-center gap-[1rem]'>
                      
                      <div className='relative h-[35px] px-[16px] py-[8px] text-[14px] text-muted bg-white flex items-center 
                        gap-[10px] justify-between border border-dropdownBorder rounded-[6px] shadow-sm cursor-pointer
                         hover:bg-gray-50 transition-colors optionDropdown sort-dropdown' 
                          onClick={(e)=> {
                            toggleStickyDropdown(e, 'filterDropdown')
                            setAdvFilterEvent(e)
                          }}
                             id='sort-options' ref={stickyDropdownRefs.filterDropdown}> {/* onClick={(e)=> toggleDropdown('filterDropdown')}*/}
                         <SlidersHorizontal className='h-[15px] w-[15px]'/>
                         <span className='text-[13px] font-[470]'> Adv Filters </span>
                         
                         {openStickyDropdowns.filterDropdown && 
                            <div className='absolute top-[2.4rem] right-0 z-[10]'>
  
                                <AdvancedCouponFilters queryOptions={queryOptions} setQueryOptions={setQueryOptions} 
                                  close={()=> {toggleStickyDropdown(advFilterEvent, 'filterDropdown'); setAdvFilterEvent(null)}}/> 
  
                            </div>
                         }
                      </div>

                      <div className='relative h-[35px] px-[16px] py-[8px] text-[14px] text-muted bg-white flex items-center 
                        gap-[10px] justify-between border border-dropdownBorder rounded-[6px] shadow-sm cursor-pointer
                         hover:bg-gray-50 transition-colors optionDropdown sort-dropdown'
                             onClick={(e)=> toggleDropdown('statusDropdown')} id='sort-options' ref={dropdownRefs.statusDropdown}>
                         <div className='flex items-center gap-[8px]'>
                          {Object.keys(queryOptions).length > 0 &&
                           (()=> {
                             const StatusIcon = getStatusIcon(camelToCapitalizedWords(queryOptions.status))
                             return <StatusIcon className='w-[19px] h-[19px] text-muted'/>
                           })()
                          }
                          <div className='flex items-center gap-[5px]'>
                            <span className='text-[13px] font-[470]'> Status: </span>
                            <span className='text-secondary'> { camelToCapitalizedWords(queryOptions.status) } </span>
                          </div>
                         </div>
                         {openDropdowns.statusDropdown && 
                         <ul className='list-none px-[10px] py-[1rem] absolute top-[44px] right-0 flex flex-col gap-[10px] justify-center 
                                 w-fit text-[10px] bg-white border border-borderLight2 rounded-[8px] z-[5] cursor-pointer'>
                             {
                              statusTypes.map(statusType=> (
                                <li key={`${statusType.name}`} className={`px-[8px] py-[5px] flex items-center gap-[8px] rounded-[5px] 
                                  hover:text-primaryDark hover:bg-[#F5FBD2] 
                                      ${statusType.name === queryOptions.status ? 'text-primaryDark' : 'text-muted'}`}
                                 onClick={()=> {
                                  setQueryOptions(query=> {
                                    return {...query, status: convertToCamelCase(statusType.name)}
                                  })
                                }}> 
                                 {
                                    (()=> {
                                      const StatusIcon = getStatusIcon(statusType.name)
                                      return <StatusIcon className='w-[17px] h-[17px] text-muted'/>
                                    })()
                                  }
                                  <span className='text-[12px]'> { camelToCapitalizedWords(statusType.name) } </span>
                                </li>
                              ))
                             }
                         </ul>
                         }
                      </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-6 mt-[12px]">
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
                                        {
                                          [6, 10, 20, 30, 40].map( limit=> (
                                            <li onClick={()=> limitHandler(limit)}> {limit} </li>
                                          ))
                                        }
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
                             <MdSort className='h-[15px] w-[15px]'/>
                             {openDropdowns.sortDropdown && 
                             <ul className='list-none  px-[10px] py-[1rem] absolute top-[44px] right-0 flex flex-col gap-[10px] justify-center 
                                     w-[12rem] text-[10px] bg-white border border-borderLight2 rounded-[8px] z-[5] cursor-pointer'>
                                 {
                                  sortTypes.map(sortType=> (
                                    <li key={`${sortType.value}-${sortType.sortBy}`}> 
                                     <span>  
                                         <input type='radio' value={sortType.value} onClick={(e)=> radioClickHandler(e, sortType.sortBy)}
                                             onChange={(e)=> radioChangeHandler(e, sortType.value, sortType.sortBy)} 
                                             checked={queryOptions.sort === Number(sortType.value) && queryOptions.sortBy === sortType.sortBy}/>
                                         <span> {sortType.name} </span>
                                     </span>
                                    </li>
                                  ))
                                 }
                             </ul>
                             }
                           </div>
                        </div>
                        </div>
                      
                      </div>

                    {
                      coupons && coupons.length > 0 &&
                        <CouponList coupons={coupons} onEdit={(coupon)=> { setEditingCoupon(coupon); setIsModalOpen(true); }}
                          onDelete={(coupon)=> { setCouponToDelete(coupon); setIsDeleteModalOpen(true); }} 
                            onDeactivate={(id)=> dispatch(toggleCouponStatus({couponId: id}))} onSort={handleSort}/>
                    }

                    <CouponModal isOpen={isModalOpen} onClose={()=> { setIsModalOpen(false); setEditingCoupon(null); }}
                        coupon={editingCoupon} isEditing={editingCoupon ? true : false}/>

                    <CouponDeleteModal isOpen={isDeleteModalOpen} onClose={()=> {setIsDeleteModalOpen(false); setCouponToDelete(null)}}
                        coupon={couponToDelete} />
                        
                </div>

                <div className='mt-[3rem] mb-[5rem]'>

                  <PaginationV2 currentPage={currentPage} totalPages={totalPages} onPageChange={(page)=> setCurrentPage(page)} />

                </div>

            </main>

        </section>
    )
}