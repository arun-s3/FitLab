import React, {useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'

import { X, AlertTriangle } from "lucide-react"


export default function RemoveCouponModal({isOpen, onClose, couponCode, onConfirm}){


  if (!isOpen) return null

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
                  <h2 className="text-xl font-semibold text-red-500 text-[13px]"> Remove Coupon? </h2>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="p-6">

                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-yellow-100 rounded-full p-3">
                      <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900"> Are you sure? </h3>
                      <p className="text-sm text-gray-500"> This action will remove the applied coupon. </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg px-4 py-[10px] mb-4">
                    <p className="text-gray-700">
                      <span className="font-semibold text-[15px]"> Coupon to remove: </span> 
                      <span className='text-[15px]'> {couponCode} </span>
                    </p>
                  </div>

                  <p className="text-[13px] text-gray-500 mb-[1rem]">
                    Removing this coupon will cancel any discounts it provides. You can always apply it again later.
                  </p>

                  <div className="flex xxs-sm:flex-row flex-col justify-center xxs-sm:justify-end items-center gap-4 space-x-3">
                    <motion.button 
                      className="w-full xxs-sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium
                     text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2
                      focus:ring-indigo-500 transition duration-150 ease-in-out"
                      onClick={onClose} 
                      variants={buttonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Cancel
                    </motion.button>
                    <motion.button 
                      onClick={()=> { onConfirm(); onClose(); }}
                      className="w-full xxs-sm:w-auto !ml-0 xxs-sm:ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                       bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                        transition duration-150 ease-in-out"
                      variants={buttonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      >
                      Remove Coupon
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


