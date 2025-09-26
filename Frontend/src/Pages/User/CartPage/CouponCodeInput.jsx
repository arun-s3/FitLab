import React, {useState, useEffect} from 'react'
import './CouponCodeInput.css'
import {useDispatch, useSelector} from 'react-redux'

import {RiCoupon4Line} from "react-icons/ri"

import {applyCoupon, resetCartStates} from '../../../Slices/cartSlice'
import ReplaceCouponModal from './Modals/ReplaceCouponModal'



export default function CouponCodeInput({couponCode, setCouponCode}){

  const [hasNewValue, setHasNewValue] = useState(false)
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false)

  const {cart, couponApplied} = useSelector(state=> state.cart)
  const {bestCoupon, couponMessage} = useSelector(state=> state.coupons)

  const dispatch = useDispatch() 

  useEffect(()=> {
    console.log("bestCoupon from CouponCodeInput--->", bestCoupon)
    if(bestCoupon && Object.keys(bestCoupon).length > 0 && !couponCode && !cart.couponUsed){
      console.log("Inside useEffect of CouponCodeInput for bestCoupon")
      setCouponCode(bestCoupon.code)
      console.log("Dispatching applyCoupon the best coupon...")
      dispatch( applyCoupon({couponCode: bestCoupon.code}) )
    }
  }, [bestCoupon])

  useEffect(()=> {
    if(couponApplied){
      console.log("Inside useEffect when couponApplied is true")
      setCouponCode(cart?.couponUsed?.code.toUpperCase())
    }
  },[couponApplied])

  const couponInputHandler = (e)=> {
    setCouponCode((e.target.value).toUpperCase())
  }

  const applyTheCoupon = ()=> {
    if(cart?.couponUsed && cart.couponUsed.code !== couponCode){
      console.log("No coupon code applied, hence replacing...")
      setIsReplaceModalOpen(true)
    }else{
      console.log("dispatching applyCoupon()....")
      dispatch( applyCoupon({couponCode}) )
    }
  }

  const applyNewCoupon = ()=> {
    console.log("Applying new coupon...")
    dispatch( applyCoupon({couponCode}) )
  }

  const putOldCoupon = ()=> {
    setCouponCode(cart.couponUsed.code)
    setIsReplaceModalOpen(false)
  }

    return(
        <div className="mt-[5rem] ml-0 sm:ml-20 lg:ml-0 s-sm:mt-[4rem] x-sm:mt-[5rem] w-full xs-sm:w-[85%] 
           s-sm:w-[80%] x-sm:w-[75%]" 
          id='CouponCodeInput'>
          <h3 className="font-medium mb-[6px] s-sm:mb-[8px]"> Have a coupon? </h3>
          <p className="text-[13px] xs-sm:text-[14px] text-gray-500 mb-[8px]"> Add your code for an instant cart discount </p>
          <div id='input-box'> 
            <div className='relative flex-1 flex justify-between items-center p-[8px] pl-12 h-[2.7rem] border
            border-secondaryLight2 rounded-[5px] focus:ring-0 focus:border-0 focus:outline-0'>
              <RiCoupon4Line className='w-[18px] h-[18px] text-muted absolute left-[9px]'/>
              <input type="text" 
                placeholder="Coupon Code" 
                className="ml-[-20px] w-[80%] h-[10px] border-0 outline-0 placeholder:text-[12px] xxs-sm:placeholder:text-[13px]
                 placeholder:tracking-[0.1px] text-primaryDark caret-primaryDark" 
                value={couponCode || cart?.couponUsed?.code} 
                onChange={(e)=> couponInputHandler(e)}
              />
              <button className="px-[1.5rem] py-[8px] text-[15px] text-purple-600 font-medium" onClick={()=> applyTheCoupon()}>
                Apply
              </button> 

              <ReplaceCouponModal 
                isOpen={isReplaceModalOpen} 
                onClose={()=> setIsReplaceModalOpen(false)} 
                putOldCoupon={putOldCoupon}
                currentCoupon={cart?.couponUsed?.code} 
                newCoupon={couponCode} onConfirm={applyNewCoupon} 
              />

            </div>
          </div>
        </div> 

    )
}