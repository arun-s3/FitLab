
import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'

import { X, Calendar, Users, Clock, Flag } from 'lucide-react'

import {createList, updateList, getAllWishlistProducts} from '../../../Slices/wishlistSlice'
import {SiteSecondaryFillButton} from '../../../Components/SiteButtons/SiteButtons'
import {CustomHashLoader} from '../../../Components/Loader/Loader'



export default function WishlistModal ({isOpen, onClose, shouldUpdateThisId}){


  const [wishlistDetails, setWishlistDetails] = useState({
    name: "",
    description: "",
    isPublic: false,
    sharedWith: "",
    reminderDate: "",
    expiryDate: "",
    priority: 2,
  })

  const {listCreated, loading} = useSelector(state=> state.wishlist) 

  const dispatch = useDispatch()

  const handleChange = (e)=> {
    const { name, value, type, checked } = e.target
    if(name === "priority"){
      console.log(" Inside if(name === 'priority') ")
      setWishlistDetails((prev)=> ({ ...prev, priority: Number.parseInt(value) }))
    }else{
      setWishlistDetails((prev)=> ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }

  const handleSubmit = (e)=> {
    e.preventDefault()
    console.log("New Wishlist Data:", wishlistDetails)
    console.log("Dispatching....")
    shouldUpdateThisId? dispatch( updateList({updateListDetails: {listId: shouldUpdateThisId, ...wishlistDetails}}) ) 
      : dispatch( createList({wishlistDetails}) )
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-primary">
          <h2 className="text-xl text-secondary font-semibold"> {shouldUpdateThisId ? 'Update Wishlist' : 'Create New Wishlist'} </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
              <span className="ml-[5px] text-[10px] text-red-500 tracking-[0.3px]"> (*Required) </span>
            </label>
            <input type="text" id="name" name="name" required value={wishlistDetails.name} onChange={handleChange} className="w-full px-3 py-2
               text-[14px] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary
                 focus:border-secondary transition duration-150 ease-in-out" />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea id="description" name="description" value={wishlistDetails.description} onChange={handleChange} rows="3"
              className="w-full px-3 py-2 text-[14px] resize-none border border-gray-300 rounded-md shadow-sm focus:outline-none
                 focus:ring-secondary focus:border-secondary transition duration-150 ease-in-out"></textarea>
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="isPublic" name="isPublic" checked={wishlistDetails.isPublic} onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-secondary border-gray-300 rounded"/>
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
              Make this wishlist public
            </label>
          </div>

          <div className="relative">
            <label htmlFor="sharedWith" className="block text-sm font-medium text-gray-700 mb-1">
              Shared With (comma-separated emails)
            </label>
            <input type="text" id="sharedWith" name="sharedWith" value={wishlistDetails.sharedWith} onChange={handleChange}
              className="w-full pr-3 pl-[2.5rem] py-2 text-[10px] text-secondary border border-gray-300 rounded-md 
                shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary transition duration-150 ease-in-out"/>
            <Users className="absolute left-[1rem] top-[2.3rem] h-[1rem] w-[1rem] text-gray-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="reminderDate" className="block text-sm font-medium text-gray-700 mb-1">
                <span className="block"> Reminder Date </span>
                <span className="block mt-[2px] text-[10px] text-muted tracking-[0.3px] leading-[13px]"> 
                  (The date you want to be reminded on to buy)
                </span>
              </label>
              <input type="date" id="reminderDate" name="reminderDate" value={wishlistDetails.reminderDate} onChange={handleChange}
                className="w-full pr-3 pl-[45px] py-2 text-[14px] text-muted border border-gray-300 rounded-md shadow-sm
                 focus:outline-none focus:ring-secondary focus:border-secondary transition duration-150 ease-in-out"/>
              <Calendar className="absolute left-[1rem] top-[4.1rem] h-[1rem] w-[1rem] text-gray-400" />
            </div>
            <div className="relative">
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                <span className="block"> Expiry Date </span>
                <span className="block mt-[2px] text-[10px] text-muted tracking-[0.3px] leading-[13px]"> 
                  (The date you want this list to be expired) 
                </span>
              </label>
              <input type="date" id="expiryDate" name="expiryDate" value={wishlistDetails.expiryDate} onChange={handleChange}
                className="w-full pr-3 pl-[45px] py-2 text-[14px] text-muted border border-gray-300 rounded-md shadow-sm
                 focus:outline-none focus:ring-secondary focus:border-secondary transition duration-150 ease-in-out" />
              <Clock className="absolute left-[1rem] top-[4.1rem] h-[1rem] w-[1rem] text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select id="priority" name="priority" value={wishlistDetails.priority} onChange={handleChange}
              className="w-full pr-3 pl-[45px] py-2 text-[15px] text-secondary border border-gray-300 rounded-md shadow-sm
               focus:outline-none focus:ring-secondary focus:border-secondary transition duration-150 ease-in-out">
              <option value="3" className="">Low</option>
              <option value="2" className="">Medium</option>
              <option value="1" className="">High</option>
            </select>
            <Flag className="absolute left-[1rem] top-[2.3rem] h-[1rem] w-[1rem] text-gray-400" />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm
               font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2
                focus:ring-secondary transition duration-150 ease-in-out">
              Cancel
            </button>
            <SiteSecondaryFillButton shouldSubmit={true} className='text-sm font-medium hover:bg-purple-700 transition-colors'>
                { loading? <CustomHashLoader loading={loading}/> : shouldUpdateThisId ? 'Update Wishlist' : 'Create Wishlist' }
            </SiteSecondaryFillButton>
          </div>
        </form>
      </div>
    </div>
  )
}




