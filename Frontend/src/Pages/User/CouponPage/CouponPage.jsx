import React, {useState, useEffect, useContext} from "react"
import './CouponPage.css'
import {useLocation, useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import {BadgePercent, Search, Percent, IndianRupee, BadgeIndianRupee, CirclePercent,  ShoppingBag, Truck, Calendar, 
  ShoppingCart, User, PercentCircle, Tag} from "lucide-react"
import {TbRosetteDiscountCheck} from "react-icons/tb"
import {RiArrowDropDownLine} from "react-icons/ri"
import {MdSort} from "react-icons/md"
import {toast} from "react-toastify"
import {format} from "date-fns"

import CouponApplicableModal from '../ProductListPage/CouponApplicableModal'
import {UserPageLayoutContext} from '../UserPageLayout/UserPageLayout'
import {ProtectedUserContext} from '../../../Components/ProtectedUserRoutes/ProtectedUserRoutes'
import {getEligibleCoupons, searchCoupons, resetCouponStates} from '../../../Slices/couponSlice'
import {applyCoupon, removeCoupon, resetCartStates} from '../../../Slices/cartSlice'
import useFlexiDropdown from '../../../Hooks/FlexiDropdown'
import PaginationV2 from '../../../Components/PaginationV2/PaginationV2'


export default function CouponPage(){

  const {setBreadcrumbHeading, setPageLocation} = useContext(UserPageLayoutContext)
  setBreadcrumbHeading('Coupons')

  const {setIsAuthModalOpen, checkAuthOrOpenModal} = useContext(ProtectedUserContext)  
  const location = useLocation()
  setPageLocation(location.pathname)

  const [coupons, setCoupons] = useState([])

  const [searchTerm, setSearchTerm] = useState("")
  
  const [showItemsOf, setShowItemsOf] = useState({})

  const [limit, setLimit] = useState(6) 
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 20

  const [couponApplicableModal, setCouponApplicableModal] = useState({code: '', products: []})

  const [queryOptions, setQueryOptions] = useState({page: 1, limit: 6})

  const {openDropdowns, dropdownRefs, toggleDropdown} = useFlexiDropdown(['limitDropdown', 'sortDropdown'])
  
  const {coupons: allCoupons} = useSelector(state=> state.coupons)
  const {cart, couponApplied, couponRemoved} = useSelector(state=> state.cart)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()


  useEffect(() => {
    if(allCoupons.length > 0){
      setCoupons(allCoupons)
    }
    console.log("coupons------>", allCoupons)
  }, [allCoupons])

  useEffect(()=> {
    setQueryOptions(query=> {
      return {...query, page: currentPage}
    })
  },[currentPage])
  
  useEffect(() => {
    console.log("queryOptions----->", queryOptions)
    if(Object.keys(queryOptions).length > 0){
      dispatch( getEligibleCoupons({queryOptions}) )
    }
  }, [queryOptions])

  useEffect(()=> {
    if(couponApplied){
      toast.success("Coupon applied successfully!")
      dispatch(resetCartStates())
      navigate('/shop', {
        state: {showCouponApplicableModal: true, couponCode: couponApplicableModal.code, products: couponApplicableModal.products}
      })
    }
    if(couponRemoved){
      toast.success("Coupon removed successfully!")
      dispatch(resetCartStates())
    }
  },[couponApplied, couponRemoved])

  const headerBg = {
    backgroundImage: "url('/header-bg.png')",
    backgrounSize: 'cover'
 }

  const discounTypeIcons = [
    {name:'percentage', Icon: PercentCircle}, {name:'fixed', Icon: BadgeIndianRupee}, {name:'buyOneGetOne', Icon: ShoppingBag},
    {name:'freeShipping', Icon: Truck}
  ]

  const sortTypes = [
    {name: 'Coupons: Recent to Oldest', value: '-1', sortBy: 'createdAt'}, {name: 'Coupons: Oldest to Recent', value: '1', sortBy: 'createdAt'},
    {name: 'Alphabetical: A to Z', value: '1', sortBy: 'code'}, {name: 'Alphabetical: Z to A', value: '-1', sortBy: 'code'}
  ]

  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

  const radioChangeHandler = (e, value, sortBy)=>{
    e.target.checked = (queryOptions.sort === Number.parseInt(value))
  }

  const couponAction = (coupon)=> {
    console.log("Bfore checkAuthOrOpenModal()----")
    if(checkAuthOrOpenModal("coupon features")) return
    console.log("After checkAuthOrOpenModal()----")
    if(cart?.couponUsed?._id === coupon._id){
      dispatch(removeCoupon())
    }else{
      if(coupon?.applicableProducts && coupon.applicableProducts.length > 0){
        setCouponApplicableModal({code: coupon.code, products: coupon.applicableProducts})
      }
      dispatch( applyCoupon({couponCode: coupon.code}) )
    }
  }


  return (
    <section id='CouponPage'>

      <div className="container mx-auto px-4 py-8">
        <h1 className=" flex items-center gap-[10px] text-[25px] text-secondary font-bold uppercase tracking-[1.2px] mb-[3rem]" 
          style={{wordSpacing: '1.5px'}}>
            {/* <BadgePercent className="h-[30px] w-[30px] text-muted"/> */}
            Available Coupons
        </h1>
        <div className="mb-6 flex justify-between items-center">

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-[19px] w-[19px] transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search coupons..." className="pl-10 w-[35rem] h-[2.5rem] p-2 border border-gray-300
               rounded-md placeholder:text-[13px] focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
                value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)}/>
          </div>

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
               <MdSort lassName='h-[15px] w-[15px] text-[#EF4444]'/>
               {openDropdowns.sortDropdown && 
               <ul className='list-none  px-[10px] py-[1rem] absolute top-[44px] right-0 flex flex-col gap-[10px] justify-center 
                       w-[12rem] text-[10px] bg-white border border-borderLight2 rounded-[8px] z-[5] cursor-pointer'>
                   {
                    sortTypes.map(sortType=> (
                      <li key={`${sortType.value}-${sortType.sortBy}`}> 
                       <span className="flex items-center gap-[5px]">  
                           <input type='radio' value={sortType.value} onClick={(e)=> radioClickHandler(e, sortType.sortBy)}
                               onChange={(e)=> radioChangeHandler(e, sortType.value, sortType.sortBy)} 
                                className='h-[10px] w-[10px] text-secondary focus:ring-secondary focus:text-secondary'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.map( (coupon) => (
            <div key={coupon._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
              <div className="p-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h2 className="flex items-center gap-[5px] text-lg font-bold">
                    {coupon.code} 
                    {
                      cart?.couponUsed?._id === coupon._id &&
                        <span className="ml-[5px] text-[15px] text-primaryDark"> (Applied) </span>
                    }
                  </h2>
                  <span className="px-[10px] py-[5px] bg-purple-100 text-secondary text-xs font-semibold rounded-full flex items-center">
                    {
                      ( ()=>{
                        const Icon = discounTypeIcons.find(type=> type.name === coupon.discountType).Icon
                        return (<Icon className="mr-1 w-4 h-4 text-secondary" />)
                      })()
                    }
                    {
                      coupon.discountType === 'percentage' 
                      ? coupon.discountValue + '%' + ' OFF'
                        :coupon.discountType === 'fixed' ? '₹' + coupon.discountValue + ' OFF'
                        :coupon.discountValue
                    } 
                  </span>
                </div>
              </div>
              <div className="p-4 flex-grow">
                <p className="text-sm text-gray-600 mb-4">{coupon.description}</p>
                <div className="space-y-2 text-sm">
                 {coupon.minimumOrderValue &&
                   <p className="flex items-center">
                    <ShoppingCart className="w-4 h-4 mr-2 text-gray-400" />
                    Min. Order: 
                    <span className="ml-[5px]"> ₹{coupon.minimumOrderValue} </span>
                  </p>
                 }
                  {coupon.maxDiscount &&
                    <p className="flex items-center">
                      <IndianRupee className="w-4 h-4 mr-2 text-gray-400" />
                      Max Discount: 
                      <span className="ml-[5px]"> ₹{coupon.maxDiscount} </span>
                    </p>
                  }
                  <p className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    Usage Limit: 
                    <span className="ml-[5px]"> {coupon.usageLimitPerCustomer} </span>
                  </p>
                  <p className='flex items-center'>
                    <TbRosetteDiscountCheck className="w-4 h-4 mr-2 text-gray-400" />
                    Used Count: 
                    <span className={`ml-[5px] ${coupon.usedCount < coupon.usageLimitPerCustomer ? 'text-green-500' : 'text-red-500'}`}> 
                      {coupon.usedCount < coupon.usageLimitPerCustomer ? coupon.usedCount : 'Exhausted'}
                    </span>
                  </p>
                  <p className="relative flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-gray-400" />
                    Appicable for: 
                    <span className="ml-[5px]">
                      {
                        coupon.applicableType === 'allProducts' ? 'All' :  coupon.applicableType === 'products' ?
                          'Certain Products -'  : 'Categories -'
                      } 
                      &nbsp;
                    </span>
                    <span className={`text-[13px] text-secondary hover:underline transition duration-300 ease-in cursor-pointer
                      ${coupon.applicableType === 'allProducts' && 'hidden'}`}
                       onMouseEnter={()=> setShowItemsOf({
                        type: (coupon.applicableType === 'products' ? 'applicableProducts' : 'applicableCategories'),
                        code: coupon.code
                       })} 
                       onMouseLeave={()=> setShowItemsOf({})}
                        >
                      { coupon.applicableType !== 'allProducts' ? ' show' : null }
                    </span>

                    {showItemsOf.code === coupon.code && (
                        <ul className={`absolute bottom-[100%] left-[50%] py-[10px] px-[22px] list-disc bg-white 
                          ${coupon[showItemsOf.type].length > 6 ? "h-[10rem] overflow-y-scroll" : "h-fit"} border
                           border-dropdownBorder rounded-[4px] z-[10]`}>
                          { coupon[showItemsOf.type].map( (categoryOrProduct) => (
                            <li key={categoryOrProduct._id} className="capitalize text-muted">
                              {
                                (()=> {
                                  const name = showItemsOf.type === 'applicableProducts' ? categoryOrProduct.title : categoryOrProduct.name
                                  return (name.length > 17 ? name.slice(0, 15) + '...' : name)
                                })()
                              }
                            </li>
                          ))}
                        </ul>
                      )
                    }

                  </p>
                  <p className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    Expires: 
                    <span className="ml-[5px]"> {format( new Date(coupon.endDate), "MMM dd, yyyy" )} </span>
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-50">
                <button className={`w-full text-white py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2
                focus:ring-secondary focus:ring-offset-2
                    ${cart?.couponUsed?._id === coupon._id ? 'bg-purple-800 hover:bg-purple-900' : 'bg-secondary hover:bg-purple-700'} `}
                    onClick={()=> couponAction(coupon)}>
                  {
                    cart?.couponUsed?._id === coupon._id ? 'Ignore' : 'Apply Coupon'
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='mt-[3rem] mb-[5rem]'>

        <PaginationV2 currentPage={currentPage} totalPages={totalPages} onPageChange={(page)=> setCurrentPage(page)} />

      </div>

    </section>
    
  )
}

