import React, {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {useSelector} from 'react-redux'

import {toast as sonnerToast} from 'sonner'

import CartSidebar from '../CartSidebar/CartSidebar'
import {addToCart, removeFromCart, resetCartStates} from '../../Slices/cartSlice'


export default function RetractedCartSidebar(){

    const [isCartOpen, setIsCartOpen] = useState(false)
    const [packedupCart, setPackedupCart] = useState({})

    const location = useLocation()
    
    const {cart, productAdded, productRemoved, error} = useSelector(state=> state.cart) 

    useEffect(()=> {
        if(cart?.products && cart.products.length > 0){
            setPackedupCart(cart)
            setIsCartOpen(true)
        }
        if(productAdded){
          setPackedupCart(cart)
          setIsCartOpen(true)
          dispatch(resetCartStates())
        }
        if(productRemoved){
          setPackedupCart(cart)
          dispatch(resetCartStates())
        }
    },[cart, productAdded, productRemoved])

    useEffect(()=> {
        if(location.pathname === '/cart' || location.pathname === '/checkout') return
        if(error){
          sonnerToast.error(error)
          dispatch(resetCartStates())
        }
    },[error])

    const updateQuantity = (id, newQuantity) => {
        dispatch( addToCart({productId: id, quantity: newQuantity}) )
    }
       
    const removeFromTheCart = (id) => {
        dispatch(removeFromCart({productId: id}))
    }

    
    return (

      <CartSidebar isOpen={isCartOpen} onClose={()=> setIsCartOpen(false)} packedupCart={packedupCart} 
          updateQuantity={updateQuantity} removeFromTheCart={removeFromTheCart} retractedView={true} />
          
    )

}