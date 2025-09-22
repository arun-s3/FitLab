import React, {useEffect, useState, useRef} from 'react'
import './CartPage.css'
import {useNavigate, useLocation} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {motion, AnimatePresence} from 'framer-motion'

import {Trash2, Plus, Minus, Star, ChevronLeft, ChevronRight, BadgePlus, Check, ShoppingCart} from 'lucide-react';
import {toast} from 'react-toastify'
import axios from 'axios'

import Header from '../../../Components/Header/Header'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import OrderStepper from '../../../Components/OrderStepper/OrderStepper'
import FeaturesDisplay from '../../../Components/FeaturesDisplay/FeaturesDisplay'
import PaymentSummary from './PaymentSummary'
import CouponCodeInput from './CouponCodeInput'
import SimilarProductsCarousal from './SimilarProductsCarousal'
import TextChatBox from '../TextChatBox/TextChatBox'
import {capitalizeFirstLetter} from '../../../Utils/helperFunctions'
import ProductRemovalModal from '../../../Components/ProductRemovalModal/ProductRemovalModal'
import {SiteSecondaryFillButton, SiteButtonSquare} from '../../../Components/SiteButtons/SiteButtons'
import {addToCart, reduceFromCart, removeFromCart, getTheCart, resetCartStates} from '../../../Slices/cartSlice'
import {getBestCoupon, resetCouponStates} from '../../../Slices/couponSlice'

import {CustomHashLoader, CustomScaleLoader} from '../../../Components/Loader//Loader'
import Footer from '../../../Components/Footer/Footer'
import AuthPrompt from '../../../Components/AuthPrompt/AuthPrompt';

export default function ShoppingCartPage(){

  const [couponCode, setCouponCode] = useState('')

  const [isProductRemovalModalOpen, setIsProductRemovalModalOpen] = useState(false)
  const [productToRemove, setProductToRemove] = useState({})

  // const [shipping, setShipping] = useState(0)
  // const [gst, setGst] = useState(0)
  // const [absoluteTotalWithTaxes, setAbsoluteTotalWithTaxes] = useState(0)

  const {cart, productAdded, productRemoved, loading, error, message, couponApplied} = useSelector(state=> state.cart)
  const {bestCoupon, couponMessage} = useSelector(state=> state.coupons)
  const {user} = useSelector(state=> state.user)

  const dispatch = useDispatch()

  const navigate = useNavigate()
  const location = useLocation()

  const makeCheckoutRef = useRef()

  const headerBg = {
     backgroundImage: "url('/header-bg.png')",
     backgrounSize: 'cover'
  }

  useEffect(()=> {
    dispatch(getTheCart())
    console.log("bestCoupon--->", bestCoupon)
    if(bestCoupon && Object.keys(bestCoupon).length <= 0){
      console.log("Getting the best coupon...")
      dispatch(getBestCoupon())
    }
  },[])

  useEffect(()=> {
    if(cart){
      console.log("Cart---->", cart)
    }
  },[cart])

  useEffect(()=> {
    if(location){
      if(location.state?.OtpVerified){
        toast.success("Your OTP Verification is successful!")
        makeCheckoutRef.current.clickCheckout()
      }
    }
  },[location])

  useEffect(()=> {
    if(bestCoupon && couponApplied && couponMessage && couponMessage?.includes('Best')){
      toast.success(couponMessage + ' and applied to the cart!')
      dispatch(resetCartStates())
    }
  },[couponApplied, bestCoupon])

  useEffect(()=> {
    if(error){
      console.log("Error-->", error)
      toast.error(error)
      dispatch(resetCartStates())
    }
  },[error])

  const addQuantity = (id, quantity)=> {
    console.log("Inside addQuantity")
    dispatch( addToCart({productId: id, quantity}) )
  }
  
  const lessenQuantity = (id, quantity)=> {
    console.log("Inside lessenQuantity")
    dispatch( reduceFromCart({productId: id, quantity}) )
  }
    
  const removeFromTheCart = (id, name)=> {
    console.log("Removal confirmation for id--->", id)
    setProductToRemove({id, name})
    setIsProductRemovalModalOpen(true)
  }

  const confirmProductRemoval = ()=> {
    if(productToRemove !== null){
      console.log("On confirmation--->", productToRemove.id)
      dispatch(removeFromCart({productId: productToRemove.id}))
      setIsProductRemovalModalOpen(false)
      setProductToRemove({})
    }
  }

  const cancelProductRemoval = ()=> {
    setIsProductRemovalModalOpen(false)
    setProductToRemove({})
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.08, 
        when: "beforeChildren",
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 18 },
    },
  }

  const summaryVariants = {
    hidden: { opacity: 0, x: 40 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 70, damping: 15, delay: 0.3 },
    },
  }


  return (
    
    <section id='ShoppingCartPage'>
      <header style={headerBg} className='h-[5rem]'>
    
        <Header />
    
      </header>
    
      <BreadcrumbBar heading='Shopping Cart'/>

      <main>
        <div className="max-w-[87.5rem] mx-auto px-[1rem] py-[3rem]">
          {cart?.products && cart.products.length > 0 ?
            <OrderStepper stepNumber={1}/>
          : null
          }

          <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-[1rem] x-sm:gap-[2rem]" 
            id='cart-main'
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <div className="lg:col-span-2">
              <motion.div 
                className="bg-muted text-[12px] x-sm:text-[14px] font-[430] text-white grid grid-cols-4 p-[0.5rem] s-sm:p-[1rem]
                 rounded-t-[8px]"
                variants={itemVariants}
              >
                <div className="truncate">ITEMS</div>
                <div className="text-center truncate">PRICE</div>
                <div className="text-center truncate">QTY</div>
                <div className="text-center truncate">SUBTOTAL</div>
              </motion.div>

              <div className="border rounded-b-[8px]"
                variants={containerVariants}
              >
                <AnimatePresence>
                  {
                    cart.products.map(product => (
                      <motion.div key={product.productId} 
                        className="grid grid-cols-4 items-center p-[0.5rem] s-sm:p-[1rem] border-b last:border-b-0"
                        variants={itemVariants}
                        initial="hidden"
                        animate="show"
                        exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                      >
                        <div className="flex items-center space-x-[0.5rem] s-sm:space-x-[1rem]">
                          <img src={product.thumbnail} 
                            alt={product.title} 
                            className="w-[4rem] h-[4rem] mob:w-[5rem] mob:h-[5rem] s-sm:w-[6rem] s-sm:h-[6rem] object-cover rounded"/>
                          <div className="min-w-0 hidden xs-sm:inline-block">
                            <h3 className="text-[13px] s-sm:text-[15px] text-secondary font-medium capitalize truncate"> 
                              {product.title}
                            </h3>
                            {product?.category.length > 0 &&
                              <div className='hidden xs-sm:inline-block'>
                                <p className="text-[11px] hidden sm:inline-block text-mutedLight truncate"> 
                                  {'CAT: '+ product.category.map(cat=> capitalizeFirstLetter(cat)).toString()} 
                                </p>
                                <p className="text-[11px] inline-block sm:hidden text-mutedLight truncate"> 
                                  {product.category.map(cat=> capitalizeFirstLetter(cat)).toString()} 
                                </p>
                              </div>
                            }
                          </div>
                        </div>
                        <div className="text-center text-[13px] s-sm:text-[15px] tracking-[0.3px]">
                          <p>
                            <span className={`${product?.offerApplied && product?.offerDiscount && 
                              'mr-[5px] x-sm:mr-[10px] line-through decoration-[1.6px] decoration-red-500'}`}>
                              ₹{(product.price)} 
                            </span> 
                            {
                              product?.offerApplied && product?.offerDiscount &&
                              <span> ₹{(product.price - product.offerDiscount).toFixed(2)} </span>
                            }
                          </p>
                          {
                          product?.offerApplied && product?.offerDiscount &&
                          <p className='ml-[1rem] x-sm:ml-[2rem] px-[3px] x-sm:px-[5px] py-[2px] flex items-center gap-[2px] 
                            x-sm:gap-[3px] text-[9px] s-sm:text-[10px] text-secondary'>
                            <BadgePlus className='w-[11px] h-[11px] s-sm:w-[13px] s-sm:h-[13px] text-muted'/>
                            <span className="truncate">
                            {
                              `${product.offerApplied.discountType === 'percentage' ?
                             `${product.offerApplied.discountValue} %` : `₹ ${product.offerApplied.discountValue}`} Offer `
                            }
                            </span>
                            <span className='capitalize truncate hidden x-sm:inline'>
                              - {product.offerApplied.name}
                            </span>
                          </p>
                          }
                        </div>
                        <div className="flex items-center justify-center space-x-[5px] s-sm:space-x-[8px]">
                          <button className="p-[3px] s-sm:p-[4px] bg-primary hover:bg-primaryDark rounded-[4px]" 
                            style={{boxShadow: '2px 2px 9px rgb(219, 214, 223)'}}
                            onClick={()=> lessenQuantity(product.productId._id, 1)}
                          >
                            <Minus className="w-[8px] h-[8px] s-sm:w-[10px] s-sm:h-[10px] text-secondary" />
                          </button>
                          <span className="w-[1.5rem] s-sm:w-[2rem] text-center text-[13px] s-sm:text-[15px]"> {product.quantity} </span>
                          <button className="p-[3px] s-sm:p-[4px] bg-primary hover:bg-primaryDark rounded-[4px]" 
                            style={{boxShadow: '2px 2px 9px rgb(219, 214, 223)'}}
                            onClick={() => addQuantity(product.productId._id, 1)}
                          >
                            <Plus className="w-[8px] h-[8px] s-sm:w-[10px] s-sm:h-[10px] text-secondary" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-center flex-1 text-[13px] s-sm:text-[15px] tracking-[0.3px]">
                            ₹{product.total.toLocaleString()}
                          </span>
                          <button className="text-red-500 hover:text-red-700" 
                            onClick={()=> removeFromTheCart(product.productId._id, product.title)}
                          >
                            <Trash2 className="w-[14px] h-[14px] s-sm:w-[16px] s-sm:h-[16px]" />
                          </button>
                        
                          <ProductRemovalModal 
                            isOpen={isProductRemovalModalOpen} 
                            productToRemove={productToRemove} 
                            onConfirm={confirmProductRemoval} 
                            onCancel={cancelProductRemoval}
                          />
  
                        </div>
                      </motion.div>
                    ))
                  }
                </AnimatePresence>
                
              </div>

              <motion.div variants={itemVariants}>
                  <CouponCodeInput 
                    couponCode={couponCode} 
                    setCouponCode={setCouponCode}
                  />
              </motion.div>
              

            </div>
            
            <motion.div variants={summaryVariants}>
                  <PaymentSummary heading='Order Summary' 
                    absoluteTotal={cart.absoluteTotal} 
                    absoluteTotalWithTaxes={cart.absoluteTotalWithTaxes}
                    deliveryCharge={cart.deliveryCharge} 
                    couponDiscount={cart?.couponDiscount} 
                    gst={cart.gst} 
                    couponCode={cart?.couponUsed?.code} 
                    ref={makeCheckoutRef}/>
            </motion.div>
            
          </motion.div>

        {
          !user &&
            <div className='mt-16 '>

              <AuthPrompt />
              
            </div>
        }

      </div>

      <SimilarProductsCarousal />

      <div className="fixed bottom-[2rem] right-[2rem] z-50">
        
        <TextChatBox />
                
      </div>

    </main>

    <FeaturesDisplay />

    <Footer/>

  </section>
    
  )
}





