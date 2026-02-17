import React, { useState, useEffect } from 'react'
import {useDispatch} from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'

import { Zap, X, CheckCircle2, AlertCircle } from 'lucide-react'
import {toast as sonnerToast} from 'sonner'
import apiClient from "../../Api/apiClient"

import {getOrCreateWallet} from '../../Slices/walletSlice'


export default function SemiAutoRechargeModal({ isOpen,  onClose, walletAmount, autoRechargeAmount, onRecharged}) {

  const [isVisible, setIsVisible] = useState(isOpen);
  const [timeRemaining, setTimeRemaining] = useState(10)
  const [isAutoClosing, setIsAutoClosing] = useState(false)

  const [stopTimer, setStopTimer] = useState(false)

  const dispatch = useDispatch()

  useEffect(()=> {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true
    document.body.appendChild(script)
  },[])

  useEffect(() => {
    setIsVisible(isOpen)
    if (isOpen) {
      setTimeRemaining(10)
      setIsAutoClosing(false)
    }
  }, [isOpen])
  
  const handleWalletRecharge = async (amount) => {
    try {
      const response = await apiClient.post(`/payment/razorpay/order`, { amount })
      if(response.status === 200){
        await handleRazorpayRechargeVerification(response.data.data)
      }
    } catch (error) {
        if (!error.response) {
          sonnerToast.error("Could not initiate recharge due to network error. Please check your internet.")
        } else {
          sonnerToast.error("Internal server error! Please retry later.")
        }
    }
  }
  
  const getRazorpayKey = async()=> {
      let response
      try{
            response = await apiClient.get(`/payment/razorpay/key`)
            return response.data.key
        }
      catch(error){
            sonnerToast.error("Something went wrong. Please try again after sometime!")
            return null
        }

  }
  
  const handleRazorpayRechargeVerification = async (data) => {
    const razorpayKey = await getRazorpayKey()
    if(!razorpayKey) return
    
    const options = {
      key: razorpayKey,
      amount: data.amount,
      currency: data.currency,
      name: "FitLab Wallet Recharge",
      description: "Wallet top-up",
      order_id: data.id,
      modal: {
        ondismiss: function () {
          sonnerToast.error("Recharge cancelled");
        }
      },
      handler: async (response) => {
        try {
          const verifiedData = await apiClient.post(
            `/payment/razorpay/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: data.amount
            }
          )
          if (verifiedData.status === 200) {
              const razorpayPaymentId = response.razorpay_order_id
              const rechargeResponse  = await apiClient.post(`/wallet/recharge/razorpay`, {amount: data.amount, razorpayPaymentId})
              if(rechargeResponse.status === 200){
                sonnerToast.success("Auto-recharge successful!")
                dispatch(getOrCreateWallet())
                onRecharged()
              }
          } 
        } catch (error) {
            if (!error.response) {
              sonnerToast.error("Recharge verification failed due to network error. Please check your internet.")
            } 
            else sonnerToast.error("Recharge verification failed due to server issues. Please try later!")
            onClose()
        }
      },
      theme: {
        color: "#9f2af0"
      }
    }
    
    const razorpayWindow = new window.Razorpay(options)
    razorpayWindow.open()
  }

  const handleRecharge = async() => {
    setStopTimer(true)
    await handleWalletRecharge(autoRechargeAmount)
  }

  useEffect(() => {
    if (!isVisible) return

    const timer = !stopTimer && setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsAutoClosing(true)
          setTimeout(() => {
            setIsVisible(false)
            handleRecharge()
          }, 1500)
          return 0
        }
        return prev - 1
      })
    }, 1000) 

    if(stopTimer){
      clearInterval(timer)
    }

    return () => clearInterval(timer)
  }, [isVisible, handleRecharge, stopTimer])

  const skipRecharge = async()=> {
      try{
            const response = await apiClient.post(`/wallet/recharge/skip`, {})
            if(response.status === 200){
                sonnerToast.success(
                  "Auto-recharge skipped!", 
                  {
                    description: "It will retry when your balance falls below the threshold. Manage settings in your FitLab Wallet.",
                    duration: 6000
                  }
                )
              }
          }
      catch(error){
            sonnerToast.error("Something went wrong. Please try again after sometime!")
        }
      onClose()
  }

  const handleSkip = async() => {
    setStopTimer(true)
    await skipRecharge()
  }


  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleSkip}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <div
              className={`relative w-full max-w-md rounded-[10px] shadow-2xl overflow-hidden ${
                isAutoClosing
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200'
                  : 'bg-gradient-to-br from-blue-50 to-purple-50 border border-purple-200'
              }`}
            >
              <div className="relative px-6 sm:px-8 pt-6 sm:pt-8 pb-4 bg-gradient-to-r from-purple-500 to-purple-600">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    delay: 0.2,
                  }}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6"
                >
                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={onClose}
                    className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </motion.button>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                  }}
                  className="flex items-center gap-3"
                >
                  <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <Zap size={28} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">
                      Auto-Recharge 
                    </h2>
                    <p className="text-[13px] text-purple-100">
                      Wallet semi-auto recharge
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="px-6 sm:px-8 py-6 sm:py-8">
                <div className="space-y-4 mb-4">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl p-[14px] border border-purple-100"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 font-medium">
                        Current Balance
                      </p>
                      <AlertCircle size={16} className="text-purple-500" />
                    </div>
                    <p className="text-[22px] font-bold text-gray-900">
                      {walletAmount}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl p-[14px] border border-cyan-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600 font-medium">
                        Recharge Amount
                      </p>
                      <Zap size={16} className="text-purple-500" />
                    </div>
                    <p className="text-[22px] font-bold text-gray-900">
                      {autoRechargeAmount}
                    </p>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mb-6"
                >
                  <p className="text-[13px] sm:text-[15px] text-gray-700 leading-relaxed text-center">
                    Your wallet is configured for semi-auto recharge. The system
                    will proceed with recharging{' '}
                    <span className="font-semibold text-gray-900">
                      {autoRechargeAmount}
                    </span>{' '}
                    in a few moments.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mb-8 flex justify-center"
                >
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg
                      className="absolute inset-0 transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#9f2af0"
                        strokeWidth="3"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={
                          isAutoClosing ? '#10b981' : '#9f2af0'
                        }
                        strokeWidth="3"
                        strokeDasharray={`${
                          ((7 - timeRemaining) / 7) * 282.74
                        } 282.74`}
                        transition={{ duration: 0.5 }}
                      />
                    </svg>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {timeRemaining}s
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {isAutoClosing ? 'Launching…...' : 'Auto-closes'}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex gap-3 sm:gap-4"
                >
                  <button
                    onClick={handleSkip}
                    disabled={isAutoClosing}
                    className="flex-1 px-4 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base text-gray-700
                     bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all 
                     disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleRecharge}
                    disabled={isAutoClosing}
                    className="flex-1 px-4 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base text-white bg-gradient-to-r
                     from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all 
                     disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {isAutoClosing ? 'Processing...' : 'Continue'}
                  </button>
                </motion.div>

                {isAutoClosing && (
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 flex items-center justify-center gap-2 text-green-700 bg-green-50 rounded-lg p-3 border
                     border-green-200"
                  >
                    <CheckCircle2 size={18} />
                    <p className="text-sm font-medium">
                      Recharge initiating....
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
