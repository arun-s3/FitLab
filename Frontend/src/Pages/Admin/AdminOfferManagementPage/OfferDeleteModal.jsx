import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux"

import { X, AlertTriangle } from "lucide-react"
import {toast} from 'react-toastify';

import {deleteOffer, resetOfferStates} from '../../../Slices/offerSlice'


export default function OfferDeleteModal ({ isOpen, onClose, offer }){

  const {offerRemoved} = useSelector(state=> state.offers)
  const dispatch = useDispatch()

  useEffect(()=> {
    if(offerRemoved){
      toast.success('Offer removed successfully!')
      dispatch(resetOfferStates())
    }
  },[offerRemoved])

  if (!isOpen) return null

  const handleDeleteOffer = ()=> {
    dispatch(deleteOffer({offerId: offer._id}))
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
        <div className="p-6">
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
            You are about to delete an offer named "<span className="font-semibold">{ offer.name }</span>".
          </p>
          <div className="flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium
             text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancel
            </button>
            <button onClick={handleDeleteOffer} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm
             font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2
              focus:ring-red-500">
              Delete Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


