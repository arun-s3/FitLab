import React, {useRef} from 'react'
import {useDispatch} from 'react-redux'

import { X, AlertTriangle } from "lucide-react"

import useModalHelpers from '../../Hooks/ModalHelpers'
import {removeProductFromList, resetWishlistStates} from '../../Slices/wishlistSlice'



export default function RemoveWishlistItemModal({ isOpen, onClose, product, listName, forWishlistDisplay, removeProductFromWishlist}){

  const dispatch = useDispatch()
  
  if (!isOpen) return null

  const modalRef = useRef(null)
  useModalHelpers({open: isOpen, onClose, modalRef})

  const handleRemoveListProductConfirm = ()=> {
    console.log(`Removing ${product.title} from ${listName}`)
    if(removeProductFromWishlist){
      console.log("removeProductFromList--->", removeProductFromWishlist)
      dispatch(removeProductFromList( {listName, productId: removeProductFromWishlist } ))
    }else{
      console.log("Inside else removeProductFromList")
      dispatch(removeProductFromList( {listName, productId: product._id } ))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" ref={modalRef}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">

        <div className="flex justify-between items-center p-[1rem] border-b border-primary">
          <h2 className="text-[18px] text-secondary capitalize font-semibold" style={{wordSpacing: '1px'}}> Remove from Wishlist </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out">
            <X className="h-6 w-6" />
          </button>
        </div> 

        <div className="p-6">

          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-yellow-100 rounded-full p-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900"> Confirm Removal </h3>
              <p className="text-[13px] text-sm text-gray-500"> Are you sure you want to remove this item? </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-4">
              <img src={product.thumbnail.url || "/placeholder.svg"} alt={product.title} className="w-16 h-16 object-cover rounded-md" />
              <div>
                <h4 className="font-[520] text-gray-900 capitalize tracking-[0.3px]"> {product.title} </h4>
                <p className="text-sm text-gray-500"> ${product.price.toFixed(2)} </p>
                <p className="text-sm text-gray-500 mt-1"> From List: {listName} </p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            The product will be removed from the "{listName}" list.
          </p>

          <div className="flex justify-end space-x-3">
            <button onClick={onClose}  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium
               text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                 transition duration-150 ease-in-out" >
              Cancel
            </button>
            <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600
               hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
              onClick={()=> {
                handleRemoveListProductConfirm()
                onClose()
              }}
            >
              Remove
            </button>
          </div>
          
        </div>
      </div>
    </div>
  )
}


