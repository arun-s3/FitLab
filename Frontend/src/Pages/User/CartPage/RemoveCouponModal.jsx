import React, {useState} from 'react'
import { X, AlertTriangle } from "lucide-react"



export default function RemoveCouponModal({isOpen, onClose, couponCode, onConfirm}){


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-red-500 text-[13px]">Remove Coupon?</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">

          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-yellow-100 rounded-full p-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Are you sure?</h3>
              <p className="text-sm text-gray-500">This action will remove the applied coupon.</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg px-4 py-[10px] mb-4">
            <p className="text-gray-700">
              <span className="font-semibold text-[15px]">Coupon to remove:</span> 
              <span className='text-[15px]'> {couponCode} </span>
            </p>
          </div>

          <p className="text-[13px] text-gray-500 mb-[1rem]">
            Removing this coupon will cancel any discounts it provides. You can always apply it again later.
          </p>

          <div className="flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium
             text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2
              focus:ring-indigo-500 transition duration-150 ease-in-out">
              Cancel
            </button>
            <button onClick={()=> { onConfirm(); onClose(); }}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
               bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                transition duration-150 ease-in-out">
              Remove Coupon
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


