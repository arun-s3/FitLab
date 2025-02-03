import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'

import CartSidebar from '../CartSidebar/CartSidebar'
import {addToCart, removeFromCart, resetCartStates} from '../../Slices/cartSlice'



export default function RetractedCartSidebar(){

    const [isCartOpen, setIsCartOpen] = useState(false)
    const [packedupCart, setPackedupCart] = useState({})
    
    const {cart, productAdded, productRemoved, loading, error, message} = useSelector(state=> state.cart) 

    useEffect(()=> {
        if(cart?.products && cart.products.length > 0){
            setPackedupCart(cart)
            setIsCartOpen(true)
        }
        if(error && error.toLowerCase().includes('product')){
          console.log("Error from ProductDetailPage-->", error)
          toast.error(error)
          dispatch(resetCartStates())
        }
        if(productAdded){
          console.log("Product added to cart successfully!")
          setPackedupCart(cart)
          setIsCartOpen(true)
          dispatch(resetCartStates())
        }
        if(productRemoved){
          setPackedupCart(cart)
          dispatch(resetCartStates())
        }
    },[cart, error, productAdded, productRemoved])


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