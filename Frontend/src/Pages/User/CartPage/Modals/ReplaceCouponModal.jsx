import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {motion, AnimatePresence} from 'framer-motion'

import axios from 'axios'
import { X } from "lucide-react"


export default function ReplaceCouponModal({ isOpen, onClose, putOldCoupon, currentCoupon, newCoupon, onConfirm }){

  if (!isOpen) return null
  
  const [winnerCouponDiscount, setWinnerCouponDiscount] = useState({currentCoupon: false, newCoupon: false})
  const [winnerDiscountValue, setWinnerDiscountValue] = useState(null)
  const [couponError, setCouponError] = useState(null)
  const {cart} = useSelector(state=> state.cart)

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  useEffect(()=> {
    if(currentCoupon.trim() === newCoupon.trim()){
      onClose()
    }
  }, [currentCoupon, newCoupon])

  useEffect(()=> {
    async function compareCoupons(){
      try{
        const response = await axios.post( `${baseApiUrl}/coupons/compare`, {newCoupon, currentCoupon}, { withCredentials: true } )
        console.log("response.data---->", response.data)
        console.log("response.data.winnerCoupon.code---->", response.data.winnerCoupon.code)
        if(response.status === 200){
          setWinnerDiscountValue(response.data.winnerCoupon.discount)
          if(currentCoupon === response.data.winnerCoupon.code) setWinnerCouponDiscount({currentCoupon: true, newCoupon: false})
          else setWinnerCouponDiscount({currentCoupon: false, newCoupon: true})
        }
      }
      catch(error){
        console.log("Error in compareCoupons:", error.message)
        if (error.response && error.response.status === 404) {
          toast.error(error.response.data.message || "Coupon not found!", {autoClose: 4000});
          setCouponError(true)
        }
      }
    }
    if(newCoupon){
      compareCoupons()
    }   
  },[newCoupon])

  useEffect(()=> {
    if(couponError){
      onClose()
      setCouponError(false)
    }
  }, [couponError])

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 220, damping: 20 } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20, 
      transition: { duration: 0.25, ease: "easeInOut" } 
    },
  }

  const buttonVariants = {
    rest: { scale: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)" },
    hover: { 
      scale: 1.02, 
      boxShadow: "0px 4px 12px rgba(0,0,0,0.15)", 
      transition: { ease: "easeInOut", duration: 0.1 } 
    },
    tap: { scale: 0.95 }
  }


  return (
    <AnimatePresence>

      {
        isOpen &&
          (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div 
                className="mr-12 xxs-sm:mr-0 bg-white rounded-lg shadow-xl w-full max-w-[20rem] xxs-sm:max-w-md"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex justify-between items-center p-6 border-b">
                  <h2 className="text-xl font-semibold text-red-500">Replace Coupon?</h2>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="p-6">

                    <p className="text-gray-600 text-[14px] mb-4">
                      {  !couponError && winnerCouponDiscount.newCoupon ?
                        <div>
                          <span>
                            You already have a coupon applied to your order. Do you want to replace it with the new coupon?
                          </span>
                          <p className='mt-[5px] text-secondary font-[480]'>
                            The New Coupon provides Higher Discount value!
                          </p>
                        </div>
                        : !couponError && winnerCouponDiscount.currentCoupon ?
                          <span>
                            <span> You already have a coupon with a better discount value providing you a discount</span>
                            {
                              cart?.couponUsed?.discountType !== 'buyOneGetOne' &&
                              <span> of </span>
                            }
                            <span className='text-red-500 font-[480]'>
                              { cart?.couponUsed?.discountType !== 'buyOneGetOne' &&
                                `${
                                    `( ${cart?.couponUsed?.discountType === 'percentage' ? 
                                      cart?.couponUsed?.discountValue + '%' + ' Off' : cart?.couponUsed?.discountType === 'fixed' ?
                                       '₹' + cart?.couponUsed?.discountValue + ' Off' : null
                                      }
                                    )`
                                  }`  
                              } 
                              <span className='text-gray-600 font-normal'> applied. </span>
                            </span> 
                            <p className='mt-[10px]'> Do you want to replace it with the new coupon with a lesser discount value? </p>
                          </span>
                          : null
                      }
                    </p>
                    
                  <div className="bg-gray-50 rounded-lg px-4 mb-4">
                    <div className="mb-2">
                      <span className="font-semibold text-[15px]">Current Coupon:</span> 
                      <span className='text-[15px] text-green-500 ml-[5px] uppercase'> {currentCoupon} </span>
                    </div>
                    <div>
                      <span className="font-semibold text-[15px]">New Coupon:</span> 
                      <span className='text-[15px] text-green-500 ml-[5px] uppercase'> {newCoupon} </span>
                    </div>
                  </div>
                  <p className="text-sm text-[13px] text-gray-500 mb-6">
                    Note: Replacing the coupon will remove any discounts applied by the current coupon.
                  </p>
                    
                  <div className="flex xxs-sm:flex-row flex-col justify-center xxs-sm:justify-center items-center
                   gap-4 xxs-sm:gap-8 space-x-3">
                    <motion.button 
                      onClick={putOldCoupon} 
                      className="w-full xxs-sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium
                      text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2
                      focus:ring-indigo-500 transition duration-150 ease-in-out"
                      variants={buttonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Keep Current Coupon
                    </motion.button>
                    <motion.button 
                      onClick={()=> { onConfirm(); onClose(); }} 
                      className="w-full xxs-sm:w-auto !ml-0 xxs-sm:ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm 
                        text-sm font-medium text-white
                      bg-secondary hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 
                        transition duration-150 ease-in-out"
                      variants={buttonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Replace Coupon
                    </motion.button>
                  </div>
                    
                </div>
              </motion.div>
            </motion.div>
          )
      }

    </AnimatePresence>
  )
}


