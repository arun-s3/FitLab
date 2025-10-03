import React, {useState, useEffect, useContext} from "react"
import './CouponPage.css'
import {useLocation, useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import {toast} from "react-toastify"

import CouponTools from "./CouponTools"
import CouponList from "./CouponList"
import RemoveCouponModal from "./RemoveCouponModal"
import AuthPrompt from '../../../Components/AuthPrompt/AuthPrompt'
import {UserPageLayoutContext} from '../UserPageLayout/UserPageLayout'
import {ProtectedUserContext} from '../../../Components/ProtectedUserRoutes/ProtectedUserRoutes'
import {getEligibleCoupons} from '../../../Slices/couponSlice'
import {applyCoupon, removeCoupon, getTheCart, resetCartStates} from '../../../Slices/cartSlice'
import PaginationV2 from '../../../Components/PaginationV2/PaginationV2'


export default function CouponPage(){

  const {setBreadcrumbHeading, setPageLocation, setPageWrapperClasses, setSidebarTileClasses, setContentTileClasses} = useContext(UserPageLayoutContext)
  setBreadcrumbHeading('Coupons')
  setPageWrapperClasses('gap-[2rem] px-4 xx-md:px-[4rem] mb-[10rem]')
  setContentTileClasses('basis-full x-lg:basis-[75%] mt-[2rem] content-tile')
  setSidebarTileClasses('hidden x-lg:inline-block')

  const {checkAuthOrOpenModal} = useContext(ProtectedUserContext)  
  
  const location = useLocation()
  setPageLocation(location.pathname)

  const [coupons, setCoupons] = useState([])

  const [searchTerm, setSearchTerm] = useState("")
  
  const [limit, setLimit] = useState(6) 
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(20) 

  const [couponApplicableModal, setCouponApplicableModal] = useState({code: '', products: [], categories: []})

  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState({status: false, coupon: ''})

  const [queryOptions, setQueryOptions] = useState({page: 1, limit: 6})
  
  const {coupons: allCoupons, totalCoupons} = useSelector(state=> state.coupons)
  const {cart, couponApplied, couponRemoved} = useSelector(state=> state.cart)
  const {user} = useSelector(state=> state.user)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()


  useEffect(()=> {
    if(allCoupons.length > 0){
      setCoupons(allCoupons)
      dispatch(getTheCart())
    }
    if(totalCoupons && totalPages && limit){
      console.log(`totalPages------>${totalPages}, limit------>${limit}`)
      setTotalPages(Math.ceil(totalPages/limit))
    }
    console.log("coupons------>", allCoupons)
  }, [allCoupons, totalCoupons])

  useEffect(()=> {
    setQueryOptions(query=> {
      return {...query, page: currentPage}
    })
  },[currentPage])

  useEffect(()=> {
    console.log("cart------>", cart)
  },[cart])
  
  useEffect(() => {
    console.log("queryOptions----->", queryOptions)
    if(Object.keys(queryOptions).length > 0){
      dispatch( getEligibleCoupons({userId: user ? user._id : '', queryOptions}) )
    }
  }, [queryOptions])

  useEffect(()=> {
    if(couponApplied){
      toast.success("Coupon applied successfully!")
      dispatch(resetCartStates())
      navigate('/shop', {
        state: {
          showCouponApplicableModal: true, 
          couponCode: couponApplicableModal.code, 
          products: couponApplicableModal.products, 
          categories: couponApplicableModal.categories
        }
      })
    }
    if(couponRemoved){
      toast.success("Coupon removed successfully!")
      dispatch(resetCartStates())
    }
  },[couponApplied, couponRemoved])

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
    if(checkAuthOrOpenModal("coupon features")) return
    if(cart?.couponUsed?._id === coupon._id){
      setIsRemoveModalOpen({status: true, coupon: coupon.code})
    }else{
      console.log('Coupon---->', coupon)
      console.log('Coupon.applicableCategories---->', coupon.applicableCategories)    
      if(coupon?.applicableCategories && coupon?.applicableCategories.length > 0){
        console.log('Coupon has applicableCategories---->', coupon.applicableCategories)
        setCouponApplicableModal({code: coupon.code, categories: coupon.applicableCategories})
      }
      if(coupon?.applicableProducts && coupon.applicableProducts.length > 0){
        console.log('Coupon has applicableProducts---->', coupon.applicableProducts)
        setCouponApplicableModal({code: coupon.code, products: coupon.applicableProducts})
      } 
      dispatch( applyCoupon({couponCode: coupon.code}) )
    }
  }

  const removeTheCoupon = ()=> {
    console.log('Removing coupon....')
    dispatch(removeCoupon())
  }


  return (
    <section id='CouponPage'>

      <div className="container mx-auto px-4 py-8">

        <h1 className=" flex items-center gap-[10px] text-[22px] xxs-sm:text-[25px] text-secondary font-bold uppercase 
          tracking-[1.2px] mb-[3rem]" 
          style={{wordSpacing: '1.5px'}}>
            Eligible Coupons
        </h1>

        <CouponTools 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          limit={limit} 
          onLimitChange={limitHandler} 
          onSortClick={radioClickHandler} 
          onSortChange={radioChangeHandler} 
          options={queryOptions}
        />

        <CouponList 
          coupons={filteredCoupons} 
          onCouponApply={couponAction}
        />

        <RemoveCouponModal 
          isOpen={isRemoveModalOpen.status} 
          onClose={()=> setIsRemoveModalOpen({status: false, coupon: ''})} 
          couponCode={isRemoveModalOpen.coupon}
          onConfirm={removeTheCoupon} 
        />

      </div>

      <div className='mt-[3rem] mb-[5rem]'>

        {
          totalPages &&
            <PaginationV2 currentPage={currentPage} totalPages={totalPages} onPageChange={(page)=> setCurrentPage(page)} />
        }

      </div>

      {
        !user &&
          <div className='mt-8 flex justify-center'>
          
            <AuthPrompt/>
          </div>
      }

    </section>
    
  )
}

