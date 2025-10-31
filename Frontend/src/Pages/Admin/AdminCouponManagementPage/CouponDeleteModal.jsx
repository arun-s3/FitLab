import React, {useEffect, useRef} from 'react'
import {useDispatch, useSelector} from "react-redux"

import { X, AlertTriangle } from "lucide-react"
import {toast as sonnerToast} from 'sonner'

import useModalHelpers from '../../../Hooks/ModalHelpers'
import {deleteCoupon, resetCouponStates} from '../../../Slices/couponSlice'


export default function CouponDeleteModal ({ isOpen, onClose, coupon }){

  const {couponRemoved} = useSelector(state=> state.coupons)
  const dispatch = useDispatch()

  const modalRef = useRef(null)
  useModalHelpers({open: isOpen, onClose, modalRef})

  useEffect(()=> {
    if(couponRemoved){
      sonnerToast.success('Coupon removed successfully!')
      dispatch(resetCouponStates())
    }
  },[couponRemoved])

  if (!isOpen) return null

  const handleDeleteCoupon = ()=> {
    dispatch(deleteCoupon({couponId: coupon._id}))
    onClose()
  }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-[1rem] border-b">
          <h2 className="text-xl font-semibold text-gray-900">Confirm Deletion</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6" ref={modalRef}>
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-yellow-100 rounded-full p-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900">Are you sure?</h3>
              <p className="text-[13px] text-gray-500">This action cannot be undone.</p>
            </div>
          </div>
          <p className="text-[14px] text-gray-600 mb-6">
            You are about to delete the coupon "<span className="font-semibold">{coupon.code}</span>".
          </p>
          <div className="flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium
             text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancel
            </button>
            <button onClick={handleDeleteCoupon} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm
             font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2
              focus:ring-red-500">
              Delete Coupon
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


