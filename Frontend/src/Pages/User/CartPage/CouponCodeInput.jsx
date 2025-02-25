import React, {useState} from 'react'
import './CouponCodeInput.css'
import {useDispatch, useSelector} from 'react-redux'

import {RiCoupon4Line} from "react-icons/ri"

import {applyCoupon, resetCartStates} from '../../../Slices/cartSlice'
import ReplaceCouponModal from './ReplaceCouponModal'



export default function CouponCodeInput({couponCode, setCouponCode}){

  const [hasNewValue, setHasNewValue] = useState(false)
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false)

  const {cart} = useSelector(state=> state.cart)
  const dispatch = useDispatch() 


  const couponInputHandler = (e)=> {
    setCouponCode(e.target.value)
  }

  const applyTheCoupon = ()=> {
    if(cart?.couponUsed && cart.couponUsed.code !== couponCode){
      setIsReplaceModalOpen(true)
    }else{
      console.log("No coupon code applied, hence replacing...")
      dispatch( applyCoupon({couponCode}) )
    }
  }

  const applyNewCoupon = ()=> {
    console.log("Applying new coupon...")
    dispatch( applyCoupon({couponCode}) )
  }

    return(
        <div className="mt-[5rem] w-[75%]" id='CouponCodeInput'>
          <h3 className="font-medium mb-[8px]"> Have a coupon? </h3>
          <p className="text-[14px] text-gray-500 mb-[8px]"> Add your code for an instant cart discount </p>
          <div id='input-box'>
            <div className='flex-1 flex justify-between items-center p-[8px] h-[2.7rem] border border-secondaryLight2 rounded-[5px] 
                focus:ring-0 focus:border-0 focus:outline-0'>
              <RiCoupon4Line className='w-[18px] h-[18px] text-muted'/>
              <input type="text" placeholder="Coupon Code" className="ml-[-20px] w-[80%] h-[10px] border-0 outline-0 placeholder:text-[13px]
                 placeholder:tracking-[0.1px] text-primaryDark caret-primaryDark" value={couponCode.toUpperCase()}
                   onChange={(e)=> couponInputHandler(e)}/>
              <button className="px-[1.5rem] py-[8px] text-[15px] text-purple-600 font-medium" onClick={()=> applyTheCoupon()}>
                Apply
              </button>

              <ReplaceCouponModal isOpen={isReplaceModalOpen} onClose={() => setIsReplaceModalOpen(false)}
                currentCoupon={cart?.couponUsed?.code} newCoupon={couponCode} onConfirm={applyNewCoupon} />

            </div>
          </div>
        </div>    
    )
}