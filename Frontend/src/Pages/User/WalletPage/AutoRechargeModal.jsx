import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from 'react-redux'

import { CloudLightningIcon, X, IndianRupee, CreditCard, AlertCircle, CheckCircle, HelpCircle,
    ChevronDown, ChevronUp, Info } from 'lucide-react'

import {updateAutoRechargeSettings, resetWalletStates} from '../../../Slices/walletSlice'


export default function AutoRechargeModal({ isOpen, onClose, savedPaymentMethods = [], onSave, currentSettings = null }) {
    
  const [isEnabled, setIsEnabled] = useState(false)
  const [thresholdAmount, setThresholdAmount] = useState("")
  const [rechargeAmount, setRechargeAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentMethodExpanded, setPaymentMethodExpanded] = useState(false)
  const [errors, setErrors] = useState({})
  const [saveSuccess, setSaveSuccess] = useState(false)

  const dispatch = useDispatch()

  // Load current settings if available
  useEffect(() => {
    if (currentSettings) {
      setIsEnabled(currentSettings.isEnabled || false)
      setThresholdAmount(currentSettings.thresholdAmount?.toString() || "")
      setRechargeAmount(currentSettings.rechargeAmount?.toString() || "")
      setPaymentMethod(currentSettings.paymentMethod || "")
    }
  }, [currentSettings])

  // Reset form when modal is opened/closed
  useEffect(() => {
    if (!isOpen) {
      // Reset form state when modal closes
      setErrors({})
      setSaveSuccess(false)
    }
  }, [isOpen])

  const paymentOptions = [
    {name: 'razorpay', iconSrc: './razorpay.png'}, {name: 'paypal', iconSrc: './paypal.png'}, {name: 'stripe', iconSrc: './stripe.png'}
  ]

  // Handle amount input with validation
  const handleAmountChange = (value, setter, field) => {
    // Only allow numbers and decimals
    if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
      setter(value)
      // Clear error for this field if it exists
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }))
      }
    }
  }

  // Validate form before submission
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      const settings = {
        isEnabled,
        thresholdAmount: Number.parseFloat(thresholdAmount),
        rechargeAmount: Number.parseFloat(rechargeAmount),
        paymentMethod: paymentMethod,
      }

      // Call the onSave callback with the settings
      if (onSave) {
        onSave(settings)
      }

      // Show success message
      setSaveSuccess(true)

      // Hide success message after 2 seconds
      setTimeout(() => {
        setSaveSuccess(false)
        onClose()
      }, 2000)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md">

        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="flex items-center gap-[10px] text-[18px] tracking-[0.3px] font-semibold first-letter:text-[20px]">
            <CloudLightningIcon className='w-[30px] h-[35px] text-primaryDark' />
            <span> Auto-Recharge Settings </span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5 text-secondary" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {saveSuccess ? (
          <div className="p-6 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-[16px] text-secondary font-semibold mb-2">Settings Saved!</h3>
            <p className="text-[13px] text-center text-gray-600 dark:text-gray-300">
              Your auto-recharge settings have been updated successfully.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-4 space-y-5">
              {/* Enable/Disable Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`${isEnabled ? 'text-[14px] text-secondary' : 'text-[15px]'} font-medium`}>Enable Auto-Recharge</h3>
                  <p className={`${isEnabled ? 'text-[12px]' : 'text-[13px]'} text-gray-500 dark:text-gray-400`}>
                    Automatically add funds when your balance is low
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={() => setIsEnabled(!isEnabled)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-primary dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Conditional form fields - only shown when enabled */}
              {isEnabled && (
                <>
                  {/* Threshold Amount */}
                  <div className="flex items-center gap-[2rem]">
                  <div className="relative space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="thresholdAmount" className="block text-[13px] font-medium">
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
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-[16px] w-[16px] text-gray-500 dark:text-gray-400" />
                      <input
                        id="thresholdAmount"
                        type="text"
                        value={thresholdAmount}
                        onChange={(e) => handleAmountChange(e.target.value, setThresholdAmount, "thresholdAmount")}
                        placeholder="25.00"
                        className={`w-full h-[2.5rem] pl-10 pr-4 py-2 text-[14px] placeholder:text-[14px] border ${
                          errors.thresholdAmount ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800`}
                      />
                    <p className="absolute mt-[5px] w-[13rem] text-[11px] text-gray-500 dark:text-gray-400">
                      Your wallet will recharge when balance falls below this amount
                    </p>
                    </div>
                    {errors.thresholdAmount && (
                      <p className="absolute top-[6.3rem] text-[10px] text-red-500 flex items-center mt-[5px]">
                        <AlertCircle className="h-[15px] w-[15px] mr-1" />
                        {errors.thresholdAmount}
                      </p>
                    )}
                  </div>

                  {/* Recharge Amount */}
                  <div className="relative space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="rechargeAmount" className="block text-[13px] font-medium">
                        Recharge Amount
                      </label>
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        title="This amount will be added to your wallet when auto-recharge is triggered"
                      >
                        <HelpCircle className="h-[14px] w-[14px]" />
                      </button>
                    </div>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-[16px] w-[16px] text-gray-500 dark:text-gray-400" />
                      <input
                        id="rechargeAmount"
                        type="text"
                        value={rechargeAmount}
                        onChange={(e) => handleAmountChange(e.target.value, setRechargeAmount, "rechargeAmount")}
                        placeholder="50.00"
                        className={`w-full h-[2.5rem] pl-10 pr-4 py-2 text-[14px] placeholder:text-[14px] border ${
                          errors.rechargeAmount ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800`}
                      />
                      <p className="absolute mt-[5px] w-[13rem] text-[11px] text-gray-500 dark:text-gray-400">Minimum recharge amount is ₹10</p>
                    </div>
                    {errors.rechargeAmount && (
                      <p className="absolute top-[5.3rem] text-[10px] text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-[15px] w-[15px] mr-1" />
                        {errors.rechargeAmount}
                      </p>
                    )}
                  </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="!mt-[4rem] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium">Payment Method</label>
                    </div>

                    <div className="space-y-2">
                      {/* {paymentOptions.map((method) => (
                        <div
                          key={method.id}
                          className={`flex items-center p-3 border rounded-md ${
                            paymentMethod === method.id
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-300 dark:border-gray-600"
                          } ${!paymentMethodExpanded && method.id !== "razorpay" ? "hidden" : ""}`}
                        >
                          <input
                            type="radio"
                            id={method.id}
                            name="paymentMethod"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={() => {
                              setPaymentMethod(method.id)
                              if (errors.paymentMethod) {
                                setErrors((prev) => ({ ...prev, paymentMethod: "" }))
                              }
                            }}
                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <label htmlFor={method.id} className="ml-3 flex items-center cursor-pointer flex-1">
                            <CreditCard className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-300" />
                            <span className="font-medium">{method.name}</span>
                          </label>
                        </div>
                      ))} */}
                      {/* <div className={`space-y-4 ${paymentMethod === 'paypal' && 'hidden'}`}> */}
                      {
                        paymentOptions.map(option=> (
                            <div className={`border rounded-lg p-[10px] flex items-center justify-between 
                                ${paymentMethod === option.name && 'bg-primaryLight border-primaryDark'}
                                  hover:bg-primaryLight cursor-pointer`} onClick={()=> {
                                    // setPaypalPaymentStarted(false)
                                    setPaymentMethod(option.name)
                                  }}>
                                <div className="flex items-center">
                                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                                  <img src={option.iconSrc} className='w-[15px] h-[15px]'/>
                                  </div>
                                  <span className="text-[14px] font-medium capitalize"> {option.name} </span>
                                </div>
                                <input type="radio" name="payment-gateway" className="h-4 w-4 text-primaryDark focus:ring-0"
                                  onClick={()=> {
                                    // setPaypalPaymentStarted(false)
                                    setPaymentMethod(option.name)
                                  }} 
                                  checked={paymentMethod === option.name}/>
                            </div>
                        ))
                      }
                      {/* <div className={`border rounded-lg p-[10px] flex items-center justify-between 
                        ${paymentMethod === 'razorpay' && 'bg-primaryLight border-primaryDark'}
                          hover:bg-primaryLight cursor-pointer`} onClick={()=> {
                            // setPaypalPaymentStarted(false)
                            setPaymentMethod('razorpay')
                          }}>
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <img src='./razorpay.png' className='w-[15px] h-[15px]'/>
                          </div>
                          <span className="text-[14px] font-medium"> Razorpay </span>
                        </div>
                        <input type="radio" name="payment-gateway" className="h-4 w-4 text-primaryDark focus:ring-0"
                          onClick={()=> {
                            // setPaypalPaymentStarted(false)
                            setPaymentMethod('razorpay')
                          }} 
                          checked={paymentMethod === 'razorpay'}/>
                      </div>
        
                      <div className={`border rounded-lg p-[10px] flex items-center justify-between 
                       ${paymentMethod === true && 'bg-primaryLight border-primaryDark'}
                        hover:bg-primaryLight cursor-pointer`} onClick={()=> {
                          setPaymentMethod('paypal')
                        //   setPaypalPaymentStarted(true)
                        }}>
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <img src='/paypal.png' className='w-[15px] h-[15px]'/>
                          </div>
                          <span className="text-[14px] font-medium">PayPal</span>
                        </div>
                        <input type="radio" name="payment-gateway" className="h-4 w-4 text-primaryDark focus:ring-0" 
                          onClick={()=> {
                            setPaymentMethod('paypal')
                          }} checked={paymentMethod === 'paypal'}/>
                      </div> */}
                    {/* </div> */}
                    </div>

                    {errors.paymentMethod && (
                      <p className="text-[11px] text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-[15px] w-[15px] mr-1" />
                        {errors.paymentMethod}
                      </p>
                    )}
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md flex">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                      <p className="font-medium mb-1">How Auto-Recharge Works</p>
                      <p className="text-[13px]">
                        When your wallet balance falls below the threshold amount, we'll automatically add the recharge
                        amount using your selected payment method. You'll receive a notification each time your wallet
                        is recharged.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-4 border-t dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                Save Settings
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
