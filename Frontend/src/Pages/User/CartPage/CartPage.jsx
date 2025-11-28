import React, {useEffect, useState, useRef} from 'react'
import './CartPage.css'
import {useLocation, Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {motion} from 'framer-motion'

import {toast} from 'react-toastify'
import {toast as sonnerToast} from 'sonner'

import Header from '../../../Components/Header/Header'
import CartTable from './CartTable'
import PaymentSummary from './PaymentSummary'
import CouponCodeInput from './CouponCodeInput'
import SimilarProductsCarousal from '../../../Components/ProductsCarousal/SimilarProductsCarousal'
import TextChatBox from '../TextChatBox/TextChatBox'
import ProductRemovalModal from '../../../Components/ProductRemovalModal/ProductRemovalModal'
import BestCouponModal from './Modals/BestCouponModal'
import RemoveCouponModal from './Modals/RemoveCouponModal'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import OrderStepper from '../../../Components/OrderStepper/OrderStepper'
import FeaturesDisplay from '../../../Components/FeaturesDisplay/FeaturesDisplay'
import {addToCart, reduceFromCart, removeFromCart, getTheCart, removeCoupon, resetCartStates} from '../../../Slices/cartSlice'
import {getBestCoupon} from '../../../Slices/couponSlice'
import Footer from '../../../Components/Footer/Footer'
import AuthPrompt from '../../../Components/AuthPrompt/AuthPrompt'


export default function ShoppingCartPage(){

  const [couponCode, setCouponCode] = useState('')

  const [isProductRemovalModalOpen, setIsProductRemovalModalOpen] = useState(false)
  const [openBestCouponModal, setOpenBestCouponModal] = useState({dispatched: false, applied: false})

  const [productToRemove, setProductToRemove] = useState({})

  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)

  const [cartProductIds, setCartProductIds] = useState([])

  const {cart, error, couponApplied} = useSelector(state=> state.cart)
  const {bestCoupon, couponMessage} = useSelector(state=> state.coupons)
  const {user} = useSelector(state=> state.user)

  const dispatch = useDispatch()

  const location = useLocation()

  const makeCheckoutRef = useRef()

  const headerBg = {
     backgroundImage: "url('/header-bg.png')",
     backgrounSize: 'cover'
  }

  useEffect(()=> {
    dispatch(getTheCart())
    console.log("bestCoupon--->", bestCoupon)
    if(!bestCoupon && Object.keys(bestCoupon).length === 0){
      console.log("Getting the best coupon...")
      dispatch(getBestCoupon())
    }
  },[])

  useEffect(()=> {
    if(cart){
      console.log("Cart---->", cart)
      if(cart.products && cart.products.length > 0){
        const productIds = cart.products.map(product=> product.productId)
        console.log("productIds---->", productIds)
        setCartProductIds(productIds)
      }
    }
  },[cart])

  useEffect(()=> {
    if(location){
      if(location.state?.OtpVerified){
        toast.success("Your OTP Verification is successful!", {autoClose: 4500})
        makeCheckoutRef.current.clickCheckout()
      }
    }
  },[location])

  useEffect(()=> {
    if(bestCoupon && couponApplied && couponMessage && couponMessage?.includes('Best')){
      toast.success(couponMessage + ' and applied to the cart!', {autoClose: 4500})
      dispatch(resetCartStates())
    }
  },[couponApplied, bestCoupon])

  useEffect(()=> {
    if(error){
      console.log("Error-->", error)
      sonnerToast.error(error)
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

  const removeTheCoupon = ()=> {
    sonnerToast.warning("Removing coupon...")
    dispatch(removeCoupon())
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

          {
            cart?.products && cart.products.length > 0 ?
              <OrderStepper stepNumber={1}/>
              : null
          }

          {
            cart?.products && cart.products.length > 0 ?
              <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-[1rem] x-sm:gap-[2rem]" 
                id='cart-main'
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                <div className="lg:col-span-2">

                  <CartTable 
                    products={cart.products} 
                    omIncQuantity={addQuantity} 
                    onDecQuantity={lessenQuantity} 
                    onRemoveProduct={removeFromTheCart}
                  />
                    
                  <motion.div variants={itemVariants}>
                      <CouponCodeInput 
                        couponCode={couponCode} 
                        setCouponCode={setCouponCode}
                        bestCouponAppliedStatus={openBestCouponModal}
                        setBestCouponAppliedStatus={setOpenBestCouponModal}
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
                      setIsRemoveModalOpen={setIsRemoveModalOpen}
                      ref={makeCheckoutRef}/>
                      
                </motion.div>
                    
              </motion.div>
              :
              <motion.div className="flex items-center justify-center h-[15vh] xs-sm:h-[25vh]" 
                id='cart-main'
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                <p className='text-[13px] xs-sm2:text-[16px] xs-sm:text-[17px] text-muted capitalize tracking-[0.5px]'>
                  Your cart is empty. Click 
                  <Link to='/shop' className='mx-[5px] text-secondary hover:underline transition duration-300 cursor-pointer'>
                    here 
                  </Link> 
                  to start shopping!
                </p>
              </motion.div>
          }

          <ProductRemovalModal 
            isOpen={isProductRemovalModalOpen} 
            productToRemove={productToRemove} 
            onConfirm={confirmProductRemoval} 
            onCancel={cancelProductRemoval}
          />

          <BestCouponModal 
            open={openBestCouponModal.applied && openBestCouponModal.dispatched} 
            onClose={()=> setOpenBestCouponModal({dispatched: false, applied: false})} 
            coupon={bestCoupon} 
          />

          <RemoveCouponModal 
            isOpen={isRemoveModalOpen} 
            onClose={()=> setIsRemoveModalOpen(false)} 
            couponCode={cart?.couponUsed?.code}
            onConfirm={removeTheCoupon} 
          />

          {
            !user &&
              <div className='mt-16 '>
              
                <AuthPrompt />

              </div>
          }

        </div>

        <div className="mt-[2rem] mx-[3rem]">

            { cartProductIds && cartProductIds.length > 0 &&
                <SimilarProductsCarousal referenceProductIds={cartProductIds}/>
            }

        </div>

        <div className="fixed bottom-[2rem] right-[2rem] z-50">
              
          <TextChatBox />

        </div>

      </main>

      <FeaturesDisplay />

      <Footer/>

    </section>
    
  )
}





