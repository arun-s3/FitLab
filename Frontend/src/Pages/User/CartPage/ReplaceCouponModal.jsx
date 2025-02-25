import React from 'react'
import { X } from "lucide-react"

export default function ReplaceCouponModal({ isOpen, onClose, currentCoupon, newCoupon, onConfirm }){

    if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-red-500">Replace Coupon?</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">

          <p className="text-gray-600 text-[14px] mb-4">
            You already have a coupon applied to your order. Do you want to replace it with the new coupon?
          </p>
          <div className="bg-gray-50 rounded-lg px-4 mb-4">
            <div className="mb-2">
              <span className="font-semibold text-[15px]">Current Coupon:</span> 
              <span className='text-[15px] text-green-500 ml-[5px] uppercase'> {currentCoupon} </span>
            </div>
            <div>
              <span className="font-semibold text-[15px]">New Coupon:</span> 
              <span className='text-[15px] text-green-500 ml-[5px] uppercase'> {newCoupon} </span>
            </div>
          </div>
          <p className="text-sm text-[13px] text-gray-500 mb-6">
            Note: Replacing the coupon will remove any discounts applied by the current coupon.
          </p>

          <div className="flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium
                text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2
                     focus:ring-indigo-500 transition duration-150 ease-in-out">
              Keep Current Coupon
            </button>
            <button onClick={()=> { onConfirm(); onClose(); }} 
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
               bg-secondary hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 
                    transition duration-150 ease-in-out">
              Replace Coupon
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}


