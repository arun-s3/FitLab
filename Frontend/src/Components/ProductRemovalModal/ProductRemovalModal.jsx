import React from 'react'

import { AlertTriangle } from "lucide-react"


export default function ProductRemovalModal({ isOpen, productToRemove, onConfirm, onCancel }){

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onCancel} ></div>

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg
         p-6 z-50 w-11/12 max-w-md">
        <div className="flex items-center mb-4 text-red-500">
          <AlertTriangle className="w-6 h-6 mr-2" />
          <h2 id="modal-title" className="text-lg font-bold">
            Remove Item
          </h2>
        </div>

        <p className="mb-6">
            Are you sure you want to remove <span className="font-semibold capitalize"> {productToRemove.name} </span> from your cart?
        </p>

        <div className="flex justify-end space-x-3">
          <button onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className='px-4 py-2 rounded-md transition-colors bg-red-600 hover:bg-red-700 text-white'>
            Confirm
          </button>
        </div>
      </div>
    </>
  )
}

