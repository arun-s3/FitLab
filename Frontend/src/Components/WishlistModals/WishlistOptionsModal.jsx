import React, {useState} from "react"
import {useDispatch} from 'react-redux'

import {X, Heart, Plus} from "lucide-react"

import {addProductToList, resetWishlistStates} from '../../Slices/wishlistSlice'
import {SiteSecondaryFillButton} from '../SiteButtons/SiteButtons'


export default function WishlistOptionsModal({ isOpen, onClose, product, setIsWishlistModalOpen, wishlist }){

  const [selectedList, setSelectedList] = useState("")
  const [productNote, setProductNote] = useState("")
  const [isHovered, setIsHovered] = useState(false)

  const dispatch = useDispatch()
  

  if (!isOpen) return null

  const handleSubmit = (e)=> {
    e.preventDefault()
    console.log(`Adding ${product.title} to wishlist: ${selectedList}`)
    dispatch(addProductToList({listName: selectedList, productId: product._id, productNote}))
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-[1rem] border-b border-primary">
          <h2 className="text-[18px] text-secondary capitalize font-semibold" style={{wordSpacing: '1px'}}>
            Add to Wishlist
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 pb-[1rem]">
          <div className="flex items-center space-x-4 mb-6">
            <img src={product.thumbnail.url || "/placeholder.svg"} alt={product.title} className="w-16 h-16 object-cover rounded-md" />
            <div>
              <h3 className="capitalize font-semibold text-gray-900">{product.title}</h3>
              <p className="text-sm text-[13px] text-gray-500">&#8377; {product.price.toFixed(2)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label htmlFor="wishlist" className="block text-sm font-medium text-gray-700 mb-1">
                Choose a wishlist
              </label>
              <select id="wishlist" name="wishlist" value={selectedList} onChange={(e) => setSelectedList(e.target.value)}
                className="w-full px-3 py-[4px] text-[12px] text-secondary border border-gray-300 rounded-md shadow-sm
                 focus:outline-none focus:ring-secondary focus:border-secondary">
                <option value="">Select a wishlist</option>
                {wishlist.lists.filter(list=> list.name !== 'Default Shopping List').map((list)=> (
                  <option key={list.name} value={list.name}>
                    {list.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="productNote" className="block text-sm font-medium text-gray-700 mb-1">
                Add a note (optional)
              </label>
              <textarea id="productNote"  name="productNote" rows="3" value={productNote} onChange={(e)=> setProductNote(e.target.value)}
                placeholder="E.g., Muscles to target, Ways to train, weight preference, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary
                 focus:border-secondary placeholder:text-[11px] resize-none">
              </textarea>
            </div>

            <div className="flex items-center justify-between">
              <SiteSecondaryFillButton className='flex items-center text-[14px] font-medium hover:bg-purple-700 transition-colors'
                shouldSubmit={true}>
                <Heart className="h-5 w-5 mr-2" />
                Add to selected list
              </SiteSecondaryFillButton>
              <button type="button" className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm
                 font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2
                     focus:ring-indigo-500" 
                            onClick={()=> { console.log("Adding to default wishlist");  onClose() }}>
                    Add to default list
              </button>
            </div>

          </form>

          <div className="mt-6 pt-4 border-t">
            <button onClick={()=> {console.log("Create new wishlist")}} className="flex items-center">
              <Plus className={`h-5 w-5 mr-2 ${isHovered ? 'text-orange-400' : 'text-primaryDark'}
                   transition duration-150 ease-in-out`}
                onMouseEnter={()=> setIsHovered(true)} onMouseLeave={()=> setIsHovered(false)}/>
              <span className={`text-[15px] ${isHovered ? 'text-purple-700' : 'text-secondary'} transition duration-150 ease-in-out`}
                onClick={()=> setIsWishlistModalOpen(true)} onMouseEnter={()=> setIsHovered(true)}  onMouseLeave={()=> setIsHovered(false)}>
                  Create a new wishlist 
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}


