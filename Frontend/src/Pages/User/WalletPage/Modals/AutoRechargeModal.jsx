import React, {useState, useEffect, useRef} from "react"
import {useDispatch, useSelector} from 'react-redux'
import {motion, AnimatePresence} from 'framer-motion'

import { CloudLightningIcon, X, IndianRupee, AlertCircle, CheckCircle, HelpCircle, Info } from 'lucide-react'
import {toast as sonnerToast} from 'sonner'
import apiClient from '../../../../Api/apiClient'

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"

import useModalHelpers from '../../../../Hooks/ModalHelpers'
import {resetWalletStates} from '../../../../Slices/walletSlice'
import {CustomHashLoader} from '../../../../Components/Loader/Loader'
import useTermsConsent from "../../../../Hooks/useTermsConsent"
import TermsDisclaimer from "../../../../Components/TermsDisclaimer/TermsDisclaimer"


export default function AutoRechargeModal({ isOpen, onClose, onSave, currentSettings = null }) {
    
  const [isEnabled, setIsEnabled] = useState(false)
  const [thresholdAmount, setThresholdAmount] = useState("")
  const [rechargeAmount, setRechargeAmount] = useState("") 

  const [paymentMethod, setPaymentMethod] = useState("stripe")
  const [openStripeSaveCard, setOpenStripeSaveCard] = useState(false)

  const [paymentMethodExpanded, setPaymentMethodExpanded] = useState(false)
  const [errors, setErrors] = useState({})
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const [userTermsConsent, setUserTermsConsent] = useState(false)
  const [warnUserForConsent, setWarnUserForConsent] = useState(false)

  const stripe = useStripe()
  const elements = useElements()

  const dispatch = useDispatch()

  const {walletSettingsUpdated, stripeClientSecret, walletError} = useSelector(state=> state.wallet)

  const modalRef = useRef(null)
  useModalHelpers({open: isOpen, onClose, modalRef})

  const {acceptTermsOnFirstAction} = useTermsConsent()

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  useEffect(()=> {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true
    document.body.appendChild(script)
  },[])

  useEffect(() => {
    if (currentSettings) {
      setIsEnabled(currentSettings.isEnabled || false)
      setThresholdAmount(currentSettings.thresholdAmount?.toString() || "")
      setRechargeAmount(currentSettings.rechargeAmount?.toString() || "")
      setPaymentMethod(currentSettings.paymentMethod || "")
      setOpenStripeSaveCard(currentSettings.paymentMethod === 'stripe' ? true : false)
    }
  }, [currentSettings])

  const confirmStripeCardSetup = async(clientSecret)=> {
    if (!stripe || !elements) return
    const cardElement = elements?.getElement(CardElement);

    let paymentMethodId
    const result = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    })
    if (result.error) {
      sonnerToast.error(result.error.message + " Please try after sometime!")
      return false
    }
    paymentMethodId = result.setupIntent.payment_method
    try{
      const response = await apiClient.post(`${baseApiUrl}/wallet/save-stripe-settings`, {paymentMethodId})
      if(response.data.success){
        sonnerToast.success("Auto-recharge settings updated!")
        return true
      }
    }
    catch(error){
        if (!error.response) {
          sonnerToast.error("Network error while saving the saving the card. Please check your internet and try again!")
        } else {
          sonnerToast.error("Internal server error. Please try again later!")
        }
      return false
    }
  }

  useEffect(()=> {
    if(walletSettingsUpdated && submitted && !stripeClientSecret){
      sonnerToast.error("Something went wrong. Please try again after sometime! ")
      setTimeout(() => {
        dispatch(resetWalletStates())
        setSubmitted(false)
        onClose()
      }, 2000)
    }
    if(walletSettingsUpdated && submitted && stripeClientSecret){
        const setup = async () => {
          const didCardSetup = await confirmStripeCardSetup(stripeClientSecret)

          if (didCardSetup) {
            setSaveSuccess(true)
          
            setTimeout(() => {
              dispatch(resetWalletStates())
              setIsLoading(false)
              setSubmitted(false)
              onClose()  
            }, 2000)
          }
        }

        setup()
    }
    else if(walletSettingsUpdated && submitted && paymentMethod === 'razorpay'){
      sonnerToast.success("Auto-recharge settings updated!")
      dispatch(resetWalletStates())
      setSubmitted(false)
      setIsLoading(false)
      setTimeout(()=> onClose(), 500)
    }
    else if(walletError && !walletSettingsUpdated && submitted){
      sonnerToast.error("Could not update the wallet settings. " + walletError)
      dispatch(resetWalletStates())
      setSubmitted(false)
      setIsLoading(false)
      setTimeout(()=> onClose(), 500)
    }
    else if(submitted && !walletSettingsUpdated){
      // sonnerToast.error("Something went wrong. Please try again after sometime! " + walletError?.length > 0 ? walletError : '')
      dispatch(resetWalletStates())
      setSubmitted(false)
      setIsLoading(false)
      setTimeout(()=> onClose(), 500)
    }
  }, [walletSettingsUpdated, stripeClientSecret, walletError])

  useEffect(() => {
    if (!isOpen) {
      setErrors({})
      setSaveSuccess(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (warnUserForConsent) {
      setTimeout(()=> setWarnUserForConsent(false), 5000)
    }
  }, [warnUserForConsent])

  const paymentOptions = [
    {name: 'razorpay', iconSrc: '/Images/razorpay.png'}, {name: 'stripe', iconSrc: '/Images/stripe.png'}
  ]

  const cardStyle = {
    style: {
      base: {
        fontSize: "16px",
        color: "#32325d",
        padding: "8px",
      },
    },
  }

  const handleAmountChange = (value, setter, field) => {
    if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
      setter(value)
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }))
      }
    }
  }

  const selectPaymentMethod = (method)=> {
    if(method === 'stripe'){
      setOpenStripeSaveCard(true)
    }else setOpenStripeSaveCard(false)
    setPaymentMethod(method)
  }

  const validateForm = () => {
    const newErrors = {}

    if (isEnabled) {
      if (!thresholdAmount || Number.parseFloat(thresholdAmount) <= 0) {
        newErrors.thresholdAmount = "Please enter a valid amount"
      }

      if (!rechargeAmount || Number.parseFloat(rechargeAmount) <= 0) {
        newErrors.rechargeAmount = "Please enter a valid amount"
      } else if (Number.parseFloat(rechargeAmount) < 10) {
        newErrors.rechargeAmount = "Recharge amount must be at least ₹10"
      }

      if (!paymentMethod) {
        newErrors.paymentMethod = "Please select a payment method"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    setIsLoading(true)
    acceptTermsOnFirstAction()
    e.preventDefault()

    if (validateForm()) {
      const settings = {
        isEnabled,
        thresholdAmount: Number.parseFloat(thresholdAmount),
        rechargeAmount: Number.parseFloat(rechargeAmount),
        paymentMethod: paymentMethod,
      }

      if (onSave) {
        onSave(settings)
      }
      setSubmitted(true)  
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {
        isOpen &&
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }} 
              className="fixed inset-0 !mt-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 mob:p-4"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 22,
                  duration: 0.35,
                }}
                className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md 
                  t:max-w-[95%] mob:max-w-[90%] s-sm:max-w-[85%] x-sm:max-w-[500px] max-h-[90vh] overflow-y-auto custom-scrollbar"
              >
                
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                  className="flex items-center justify-between p-3 mob:p-4 border-b dark:border-gray-700"
                >
                  <h2 className="flex items-center gap-[8px] t:gap-[6px] text-[17px] mob:text-[18px] font-semibold tracking-[0.3px] 
                    leading-tight first-letter:text-[20px]">
                    <CloudLightningIcon className="w-[26px] h-[30px] mob:w-[30px] mob:h-[35px] text-primaryDark" />
                    <span className="truncate">Auto-Recharge Settings</span>
                  </h2>

                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 
                      rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
                  >
                    <X className="h-5 w-5 text-secondary" />
                  </motion.button>
                </motion.div>

                <motion.div
                  ref={modalRef}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.08, 
                        delayChildren: 0.25,
                      },
                    },
                  }}
                >
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >

                      {saveSuccess ? (
                        <div className="p-5 flex flex-col items-center justify-center text-center">
                          <div className="w-14 h-14 mob:w-16 mob:h-16 bg-green-100 dark:bg-green-900 rounded-full flex 
                            items-center justify-center mb-4">
                            <CheckCircle className="h-7 w-7 mob:h-8 mob:w-8 text-green-600 dark:text-green-400" />
                          </div>
                          <h3 className="text-[15px] mob:text-[16px] text-secondary font-semibold mb-2">
                            Settings Saved!
                          </h3>
                          <p className="text-[12px] mob:text-[13px] text-gray-600 dark:text-gray-300">
                            Your auto-recharge settings have been updated successfully.
                          </p>
                        </div>
                        ) : (
                        <form onSubmit={handleSubmit}>
                          <div className="p-4 mob:p-5 space-y-5">
                      
                            <div className="flex items-center justify-between flex-wrap">
                              <div className="w-[70%] mob:w-[80%] t:w-full">
                                <h3 className={`${isEnabled ? "text-[14px]" : "text-[15px]"} text-secondary font-medium`}>
                                  Enable Auto-Recharge
                                </h3>
                                <p className={`${isEnabled ? "text-[11px]" : "text-[12px]"} text-gray-500 dark:text-gray-400`}>
                                  Automatically add funds when your balance is low
                                </p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer mt-2 t:mt-3">
                                <input
                                  type="checkbox"
                                  checked={isEnabled}
                                  onChange={() => setIsEnabled(!isEnabled)}
                                  className="sr-only peer"
                                />
                                <div className="w-10 mob:w-11 h-5 mob:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 rounded-full peer dark:bg-gray-700 
                                  peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                  after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 mob:after:h-5 
                                  after:w-4 mob:after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary">
                                </div>
                              </label>
                            </div>
                      
                            {isEnabled && (
                              <>
                                <div className="flex flex-col s-sm:flex-row items-start s-sm:items-start gap-5 s-sm:gap-[2rem]">
                            
                                  <div className="relative w-full space-y-2">
                                    <div className="flex items-center justify-between">
                                      <label htmlFor="thresholdAmount" className="text-[13px] mob:text-[14px] font-medium">
                                        Threshold Amount
                                      </label>
                                      <button
                                        type="button"
                                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        title="When your wallet balance falls below this amount, funds will be automatically added"
                                      >
                                        <HelpCircle className="h-[14px] w-[14px]" />
                                      </button>
                                    </div>
                                    <div className="relative">
                                      <IndianRupee className="absolute left-3 top-[26%] -translate-y-1/2 h-[15px] mob:h-[16px] w-[15px]
                                         mob:w-[16px] text-gray-500" />
                                      <input
                                        id="thresholdAmount"
                                        type="text"
                                        value={thresholdAmount}
                                        onChange={(e) => handleAmountChange(e.target.value, setThresholdAmount, "thresholdAmount")}
                                        placeholder="25.00"
                                        className={`w-full h-[2.4rem] pl-9 pr-4 py-2 text-[13px] mob:text-[14px] placeholder:text-[13px]
                                          mob:placeholder:text-[14px] rounded-md dark:bg-gray-800
                                          border ${errors.thresholdAmount ? "border-red-500" : "border-gray-300 dark:border-gray-600"} 
                                          focus:outline-none focus:ring-2 focus:ring-primary`}
                                      />
                                      <p className="mt-[5px] text-[10px] mob:text-[11px] text-gray-500 dark:text-gray-400">
                                        Wallet recharges when balance falls below this.
                                      </p>
                                    </div>
                                    {errors.thresholdAmount && (
                                      <p className="text-[10px] text-red-500 flex items-center mt-[2px]">
                                        <AlertCircle className="h-[13px] w-[13px] mr-1" />
                                        {errors.thresholdAmount}
                                      </p>
                                    )}
                                  </div>
                                  
                                  <div className="relative w-full space-y-2">
                                    <div className="flex items-center justify-between">
                                      <label htmlFor="rechargeAmount" className="text-[13px] mob:text-[14px] font-medium">
                                        Recharge Amount
                                      </label>
                                      <button
                                        type="button"
                                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        title="Amount added when auto-recharge triggers"
                                      >
                                        <HelpCircle className="h-[14px] w-[14px]" />
                                      </button>
                                    </div>
                                    <div className="relative">
                                      <IndianRupee className="absolute left-3 top-[33%] -translate-y-1/2 h-[15px] mob:h-[16px] w-[15px] 
                                        mob:w-[16px] text-gray-500" />
                                      <input
                                        id="rechargeAmount"
                                        type="text"
                                        value={rechargeAmount}
                                        onChange={(e) => handleAmountChange(e.target.value, setRechargeAmount, "rechargeAmount")}
                                        placeholder="50.00"
                                        className={`w-full h-[2.4rem] pl-9 pr-4 py-2 text-[13px] mob:text-[14px] placeholder:text-[13px]
                                          border ${errors.rechargeAmount ? "border-red-50 0" : "border-gray-300 dark:border-gray-600"} 
                                          rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800`}
                                      />
                                      <p className="mt-[5px] text-[10px] mob:text-[11px] text-gray-500 dark:text-gray-400">
                                        Minimum recharge amount is ₹10
                                      </p>
                                    </div>
                                    {errors.rechargeAmount && (
                                      <p className="text-[10px] text-red-500 flex items-center mt-[2px]">
                                        <AlertCircle className="h-[13px] w-[13px] mr-1" />
                                        {errors.rechargeAmount}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                  
                                <div className="mt-[2rem] space-y-3">
                                  <label className="block text-[13px] mob:text-[14px] font-medium">
                                    Payment Method
                                  </label>
                                  
                                  <div className="space-y-2">
                                    {paymentOptions.map(option => (
                                      <div
                                        key={option.name}
                                        className={`border rounded-lg p-[8px] mob:p-[10px] flex items-center justify-between 
                                          ${paymentMethod === option.name ? "bg-primaryLight border-primaryDark" : ""}
                                          hover:bg-primaryLight cursor-pointer transition-colors`}
                                        onClick={()=> selectPaymentMethod(option.name)} 
                                      >
                                        <div className="flex items-center gap-2 mob:gap-3">
                                          <div className="bg-blue-100 p-[6px] mob:p-2 rounded-full">
                                            <img src={option.iconSrc} className="w-[14px] h-[14px] mob:w-[15px] mob:h-[15px]" />
                                          </div>
                                          <span className={`text-[13px] mob:text-[14px] font-medium capitalize
                                             ${option.name !== 'stripe' && paymentMethod === 'stripe' && 'text-muted'}`}>
                                            {option.name}
                                          </span>
                                        </div>
                                        <div>
                                          <span className={`mr-4 text-[11px] mob:text-[12px] font-medium capitalize text-muted`}>
                                            {
                                              `(${option.name === 'stripe' ? 'Fully Auto' : 'Semi-auto'})`
                                            }
                                          </span>
                                          <input
                                            type="radio"
                                            name="payment-gateway"
                                            className="h-4 w-4 text-primaryDark focus:ring-0 disabled:cursor-not-allowed"
                                            checked={paymentMethod === option.name}
                                            disabled={option.name !== 'stripe' && paymentMethod === 'stripe'}
                                            onChange={()=> selectPaymentMethod(option.name)}
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  {
                                    openStripeSaveCard &&
                                      <motion.div
                                        className="mt-4 px-8"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.4 }}
                                      >
                                          <CardElement options={cardStyle} />
                                  
                                      </motion.div>
                                  }
                                  
                                  {errors.paymentMethod && (
                                    <p className="text-[10px] mob:text-[11px] text-red-500 flex items-center mt-1">
                                      <AlertCircle className="h-[13px] w-[13px] mr-1" />
                                      {errors.paymentMethod}
                                    </p>
                                  )}
                                </div>
                                
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md flex flex-col mob:flex-row">
                                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mb-1 mob:mb-0 mob:mr-2 flex-shrink-0" />
                                  <div className="text-[12px] mob:text-[13px] text-blue-800 dark:text-blue-300">
                                    <p className="font-medium mb-1">How Auto-Recharge Works</p>
                                    <p>
                                      When your wallet balance falls below the threshold, the recharge amount is added automatically 
                                      using your chosen payment method. You’ll be notified each time.
                                    </p>
                                  </div>
                                </div>

                                <TermsDisclaimer 
                                  fontSize='11px' 
                                  style='mt-[8px]' 
                                  checkboxType={true}
                                  acknowledgeStatementEndsWith= "and authorize FitLab to automatically recharge my wallet as per the selected settings."
                                  onChecked={(status)=> setUserTermsConsent(status)}
                                />
                                  
                                <p className="absolute bottom-[26px] h-[5px] text-[10px] text-red-500">
                                  {warnUserForConsent && 
                                     "* Please review and accept our Terms & Conditions and Privacy Policy to continue."
                                  }
                                </p>

                              </>
                            )}
                          </div>
                          
                          <div className="flex flex-col mob:flex-row !justify-end gap-2 mob:gap-3 p-4 border-t dark:border-gray-700">
                            <button
                              type="button"
                              onClick={onClose}
                              className="px-4 py-2 text-[12px] mob:text-[13px] font-medium text-gray-700 bg-white border
                                border-gray-300 rounded-md dark:border-gray-600 dark:hover:bg-gray-700
                                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-800
                                dark:text-gray-200 "
                            >
                              Cancel
                            </button>
                            <div  
                              className="min-w-28"
                              onMouseEnter={()=> {
                                if(!userTermsConsent){
                                  setWarnUserForConsent(true)
                                }else{
                                  setWarnUserForConsent(false)
                                }
                              }}
                            >
                            <button
                              type="submit"
                              disabled={!userTermsConsent}
                              className="w-full px-4 py-2 text-[12px] mob:text-[13px] font-medium text-white bg-secondary rounded-md 
                                hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-secondary disabled:cursor-not-allowed"
                            >
                               { 
                                  isLoading 
                                    ? <CustomHashLoader loading={isLoading} color="#d7f148" customStyle={{borderColor: '#d7f148'}}/>
                                    : 'Save Settings'
                               }
                            </button>
                            </div>
                          </div>
                        </form>
                      )}

                  </motion.div>
                </motion.div>                
                
              </motion.div>
            </motion.div>

          }

        </AnimatePresence>
  )
}
