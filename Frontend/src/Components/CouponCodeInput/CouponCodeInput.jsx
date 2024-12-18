import React, {useState} from 'react'
import './CouponCodeInput.css'

import {RiCoupon4Line} from "react-icons/ri";


export default function CouponCodeInput({couponCode, setCouponCode}){

    return(
        <div className="mt-[5rem] w-[75%]" id='CouponCodeInput'>
          <h3 className="font-medium mb-[8px]"> Have a coupon? </h3>
          <p className="text-[14px] text-gray-500 mb-[8px]"> Add your code for an instant cart discount </p>
          <div id='input-box'>
            <div className='flex-1 flex justify-between items-center p-[8px] h-[2.7rem] border border-secondaryLight2 rounded-[5px] 
                focus:ring-0 focus:border-0 focus:outline-0'>
              <RiCoupon4Line className='w-[18px] h-[18px] text-muted'/>
              <input type="text" placeholder="Coupon Code" className="ml-[-20px] w-[80%] h-[10px] border-0 outline-0 placeholder:text-[13px]
                 placeholder:tracking-[0.1px] text-primaryDark caret-primaryDark" value={couponCode} onChange={(e) => setCouponCode(e.target.value)}/>
              <button className="px-[1.5rem] py-[8px] text-[15px] text-purple-600 font-medium">
                Apply
              </button>
            </div>
          </div>
        </div>    
    )
}