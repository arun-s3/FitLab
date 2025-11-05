import React, { useState, useEffect, useRef } from "react"
import {useDispatch, useSelector} from 'react-redux'
import { motion, AnimatePresence } from "framer-motion"

import { AlertTriangle, Clock, CheckCircle, X, ImageIcon } from "lucide-react"
import {toast as sonnerToast} from 'sonner'

import FileUpload from "../../../Components/FileUpload/FileUpload"
import useModalHelpers from '../../../Hooks/ModalHelpers'
import {SiteButtonSquare} from '../../../Components/SiteButtons/SiteButtons'
import {CustomHashLoader} from '../../../Components/Loader/Loader'
import {resetOrderStates} from '../../../Slices/orderSlice'


export default function RefundModal({isOpen, onClose, returnOrderOrProduct, orderOrProduct, onReasonWritten, reasonWritten}) {

  const [step, setStep] = useState("warning")

  const [images, setImages] = useState([])

  const {orderReturnRequested, loading, orderError} = useSelector(state=> state.order)

  const modalRef = useRef(null)
  useModalHelpers({open: isOpen, onClose, modalRef})

  const dispatch = useDispatch()

  useEffect(()=> {
    if(orderReturnRequested && isOpen){
      sonnerToast.info("Your return request has been sent.", {description: "The request will be processed within 24 hrs", duration: 4500})
      setStep("success")
      setTimeout(() => {
        setStep("warning")
        onClose()
      }, 2000)
      dispatch(resetOrderStates())
    }
  }, [orderReturnRequested])

  const handleConfirm = () => {
    returnOrderOrProduct(images)
    sonnerToast.info("Sending the return details...", {description: "please wait few seconds!", duration: 4500})
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const modalVariants = {
    hidden: { scale: 0.95, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>

            {/* Warning Step */}
            {step === "warning" && (
              <motion.div className="p-8 md:p-12" variants={contentVariants} initial="hidden" animate="visible" ref={modalRef}>
                {/* Header */}
                <motion.div className="flex items-center gap-4 mb-10" variants={itemVariants}>
                  <div className="p-3 bg-orange-100 rounded-full flex-shrink-0">
                    <AlertTriangle className="text-orange-600" size={28} />
                  </div>
                  <div>
                    <h1 className="text-[22px] md:text-[30px] font-bold text-secondary">Return Request</h1>
                    <p className="-mt-[5px] text-[14px] text-gray-600">Thank you for initiating the return process</p>
                  </div>
                </motion.div>

                {/* Info Cards */}
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-[10px]" variants={itemVariants}>
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <Clock className="text-purple-600 flex-shrink-0 mt-[2px]" size={20} />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-[15px] mb-1">Processing Time</h3>
                        <p className="text-gray-700 text-[13px]">
                          Your refund will be <span className="font-bold">thoroughly reviewed</span> and initiated
                          within <span className="font-bold">24 hours</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-green-600 flex-shrink-0 mt-[2px]" size={20} />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-[15px] mb-1">Quality Assurance</h3>
                        <p className="text-gray-700 text-[13px]">
                          Our team will inspect the returned item to ensure proper{" "}
                          <span className="font-bold">condition</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Details Section */}
                <motion.div className="mb-[10px] bg-gray-50 rounded-xl p-6" variants={itemVariants}>
                  <h3 className="text-[16px] font-semibold text-gray-900 mb-[10px]">What Happens Next</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center gap-3">
                      <span className="font-bold text-secondary flex-shrink-0">1.</span>
                      <span className="text-[15px]">
                        {
                          orderOrProduct === 'product' 
                            ? "We have already recorded the problem you face with product" 
                            : "Describe the exact problem you faced with the product"
                        }
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-secondary flex-shrink-0">2.</span>
                      <span className="text-[15px]">Upload 2-3 product images showing the current condition (Optional)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-secondary flex-shrink-0">3.</span>
                      <span className="text-[15px]">Our quality team will review your return request thoroughly</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-secondary flex-shrink-0">4.</span>
                      <span className="text-[15px]">Refund will be processed and initiated within 24 hours</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-secondary flex-shrink-0">5.</span>
                      <span className="text-[15px]">The refund amount will appear in your Fitlab wallet only</span>
                    </li>
                  </ul>
                </motion.div>

                {/* Problem Description */}
                { 
                  orderOrProduct === 'order' &&
                    <motion.div className="mb-4" variants={itemVariants}>
                      <label htmlFor="problemDesc" className="block text-[15px] text-secondary font-semibold text-gray-900 mb-[7px]">
                        Describe Your Problem
                      </label>
                      <textarea
                        id="problemDesc"
                        value={reasonWritten.reason}
                        onChange={(e)=> onReasonWritten({reasonTitle:'', reason: e.target.value})}
                        placeholder="Please describe the exact problem you faced with the product. Be as detailed as possible..."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none 
                          focus:ring-2 focus:ring-purple-200 transition-all resize-none text-gray-700 placeholder-gray-400
                          text-[14px] placeholder:text-[13px]"
                        rows="4"
                      />
                      <p className="text-[12px] text-gray-500">{reasonWritten.reason.length}/500 characters</p>
                    </motion.div>
                }

                {/* Image Upload */}
                <motion.div className="mb-6" variants={itemVariants}>
                  <h3 className="text-[15px] text-secondary font-semibold text-gray-900 mb-4">Product Images (Optional)</h3>

                  <FileUpload
                    images={images}
                    setImages={setImages}
                    imageLimit={5}
                    needThumbnail={false}
                    imageType="Return product"
                    imageCropperPositionFromTop={"0px"}
                    imageCropperBgBlur={true}
                    uploadBox={{
                      beforeUpload: "85px",
                      afterUpload: "55px",
                    }}
                  />

                  <p className="text-[11px] text-gray-600">{images.length}/5 images uploaded</p>
                </motion.div>

                {/* Disclaimer */}
                <motion.div
                  className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-8"
                  variants={itemVariants}
                >
                  <p className="text-[13px] text-amber-900">
                    <span className="font-semibold mr-[7px]">Important:</span>
                    Refunds will only be processed for items that meet our return criteria. Detailed review is mandatory before any refund is initiated.
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div className="flex flex-col sm:flex-row gap-4 justify-end" variants={itemVariants}>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 text-[15px] text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  {/* <button
                    onClick={handleConfirm}
                    disabled={orderOrProduct === 'order' && !reasonWritten.reason.trim()}
                    className="px-6 py-3 text-[15px] bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                  >
                    
                    {
                      loading ? <CustomHashLoader loading={loading} customStyle={{color: 'rgba(215, 241, 72, 1)'}}/> : "Confirm & Submit" 
                    }
                  </button> */}

                  <SiteButtonSquare 
                      isDisabled={orderOrProduct === 'order' && !reasonWritten.reason.trim()}
                      clickHandler={()=> handleConfirm()}
                      tailwindClasses='!py-[12px] !min-w-[11.1rem]'
                      customStyle={{display: 'flex', justifyContent:'center', alignItems:'center'}}
                  >
                      { 
                          loading? <CustomHashLoader loading={loading}/> : "Confirm & Submit" 
                      }

                  </SiteButtonSquare>

                </motion.div>
              </motion.div>
            )}

            {/* Success Step */}
            {step === "success" && (
              <motion.div
                className="p-8 md:p-12 flex flex-col items-center justify-center min-h-96"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5, repeat: 1 }} className="mb-6">
                  <div className="p-4 bg-green-100 rounded-full">
                    <CheckCircle className="text-green-600" size={48} />
                  </div>
                </motion.div>
                <h2 className="text-[21px] md:text-[25px] font-bold text-secondary text-center mb-2">
                  Return Request Confirmed
                </h2>
                <p className="text-gray-600 text-center text-[15px]">
                  Your return has been successfully submitted. You'll receive an update within 24 hours.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
