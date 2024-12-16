import React, { useEffect } from 'react'
import './CartSidebar.css'
import {X, Minus, Plus, Trash} from 'lucide-react'

import {SiteSecondaryFillImpButton} from '../SiteButtons/SiteButtons'

export default function CartSidebar({ isOpen, onClose, packedupCart, removeFromTheCart, updateQuantity }) {

  // const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  useEffect(()=> {
    if(packedupCart){
      console.log("packedupCart--->", packedupCart)
    }
  },[packedupCart])

  return (
    <div id='ProductDetailSidebar' className={`fixed top-0 right-0 lg:w-[400px] sm:w-[300px] h-full bg-white shadow-2xl rounded-l-2xl  
          transform transition-transform duration-300 ease-in-out ${ isOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800"> Your Cart </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} className='text-secondary'/>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          { packedupCart.products ? packedupCart?.products?.length === 0 ? (
            <p className="h-full w-full text-muted capitalize flex items-center justify-center"> Your cart is empty </p>
          ) : (
            packedupCart?.products.map((product) => (
              <div key={product.productId} id='cart-product' className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
                  <img src={product.thumbnail} alt={product.title} className="w-[50px] h-[50px] rounded-lg object-cover"/>
                  <div className="flex-1 ml-3">
                    <h3 className="font-medium text-gray-800">{product.title}</h3>
                    <p className="text-[11px] text-secondary"> 
                      &#8377;{product.price} x {product.quantity} = &#8377;{product.total.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={()=> updateQuantity(product.productId, -1)} 
                      className="p-1 bg-gray-100 hover:bg-gray-200 rounded-md">
                      <Minus size={16} className='h-[10px] w-[10px]'/>
                    </button>
                    <span className="text-[12px] text-gray-800 font-[500]">{product.quantity}</span>
                    <button onClick={()=> updateQuantity(product.productId, 1)}
                      className="p-1 bg-gray-100 hover:bg-gray-200 rounded-md">
                      <Plus size={16} className='h-[10px] w-[10px]'/>
                    </button>
                    <button onClick={()=> removeFromTheCart(product.productId)} className="text-red-500 hover:text-red-700 ml-2">
                      <Trash className='h-[15px] w-[15px]'/>
                    </button>
                  </div>
              </div>
            ))
          ) : null}
        </div>
        { packedupCart?.products?.length !== 0 && 
           <div className="border-t p-4 bg-white sticky bottom-0">
             <div className="flex justify-between items-center font-bold text-lg text-gray-800">
               <span>Total:</span>
               <span>&#8377; {packedupCart.absoluteTotal ? packedupCart.absoluteTotal.toFixed(2) : null} </span>
             </div>
             <SiteSecondaryFillImpButton clickHandler={()=> alert('Proceeding to Checkout')}>
               Proceed to Checkout
             </SiteSecondaryFillImpButton>
           </div>
        }  
       
      </div>
    </div>
  )
}

