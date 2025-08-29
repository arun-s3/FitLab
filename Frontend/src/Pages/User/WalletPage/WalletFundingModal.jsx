import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import { CreditCard, PlusCircle, X, Globe, ChevronLeft } from "lucide-react" 
import {toast} from 'react-toastify'
import axios from 'axios'

import PaypalPayment from '../PaymentPages/PayPalPayment'
import StripePayment from '../PaymentPages/StripePayment'
import {addFundsToWallet} from '../../../Slices/walletSlice'


export default function WalletFundingModal({showFundingModal, closeFundingModal, paymentVia, setPaymentVia}){

    if (!showFundingModal) return null

    const [amount, setAmount] = useState(0)
    const [notes, setNotes] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('')

    const [PaypalPaymentStarted, setPaypalPaymentStarted] = useState(false)
    const [stripePaymentStarted, setStripePaymentStarted] = useState(false)

    const [error, setError] = useState('')

    const dispatch = useDispatch()

    const baseApiUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(()=> {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true
      document.body.appendChild(script)
    },[])

    useEffect(()=> {
      console.log("amount--->", amount)
      console.log("notes--->", notes)
      console.log("paymentMethod--->", paymentMethod)
    },[amount, notes, paymentMethod])

    const amountHandler = (e)=> {
      const value = parseFloat(e.target.value)
      setAmount(isNaN(value) ? 0 : value)
    }

    const handleNotesChange = (e)=> {
      setNotes(e.target.value)
    }

    const validateAndContinue = (continuePayment, minAmount = 1)=> {
      console.log('Inside validateAndContinue')
      if(amount && Number(amount) > Number(minAmount)){
        continuePayment()
      }else{
        setError(`The amount must be higher than ₹ ${minAmount}`)
      }
    }

    const handlRazorpayPayment = async()=> {
      if(paymentMethod === 'razorpay'){
        const response = await axios.post(`${baseApiUrl}/payment/razorpay/order`,
          {amount: parseInt(amount).toFixed(2)}, { withCredentials: true }
        )
        console.log("razorpay created order--->", response.data.data)
        handleRazorpayVerification(response.data.data)
      }
    }

    const handleRazorpayVerification = async (data) => {
        const res = await axios.get(`${baseApiUrl}/payment/razorpay/key`, { withCredentials: true })
        console.log("Razorpay key --->", res.data.key)
        const options = {
            key: res.data.key,
            amount: data.amount,
            currency: data.currency,
            name: "Fitlab",
            description: "Fitlab test Mode",
            order_id: data.id,
            modal: {
              ondismiss: function() {
                alert("Payment was not completed!")
              }
            },
            handler: async (response) => {
                console.log("response from handler-->", response)
                try {
                    const verifiedData = await axios.post(`${baseApiUrl}/payment/razorpay/verify`, {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        amount: data.amount
                    }, 
                    { withCredentials: true }
                    )
                    console.log("verifiedData--->", verifiedData)
                    if (verifiedData.data.message.toLowerCase().includes('success')) {
                        toast.success(verifiedData.data.message)
                        const paymentDetails = {
                          amount,
                          notes,
                          paymentMethod,
                          paymentId: response.razorpay_payment_id
                        }
                        console.log('Dispatching addFundsToWallet()...')

                        dispatch( addFundsToWallet({paymentDetails}) )

                        closeFundingModal()
                    }else{
                        toast.error('Payment Failed! Try again later!')
                    }
                } catch (error) {
                    console.log(error)
                }
            },
            theme: {
                color: "#9f2af0"
            }
        };
        const razorpayWindow = new window.Razorpay(options)
        razorpayWindow.open()
    }

    const handleStripeOrPaypalPayment = (paymentGateway, paymentId)=> {
      toast.success("Payment Successfull!")
      const paymentMethod = paymentGateway
      const paymentDetails = {
        amount,
        notes,
        paymentMethod,
        paymentId
      }
      console.log('Dispatching addFundsToWallet()...')
      dispatch( addFundsToWallet({paymentDetails}) )
      closeFundingModal()
    }


    return(
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4" role="dialog">

                <div className={`flex justify-between items-center p-6 border-b ${paymentMethod === 'paypal' && 'hidden'}`}>
                  <h3 id="add-money-modal-title" className="text-xl font-semibold">
                    Add Money
                  </h3>
                  <button className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2
                   focus:ring-purple-500 rounded-full"  onClick={closeFundingModal}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </button>
                </div>
        
                <div className={`${paymentMethod === 'cards' ? 'p-0' : 'p-6'}`}>
                  <div className="flex border-b mb-6">
                    <button className={`flex-1 py-3 font-medium text-[15px] text-center ${
                        paymentVia === "razorpayAndPaypal"
                          ? "text-purple-600 border-b-2 border-purple-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={()=> {
                        setPaymentVia("razorpayAndPaypal")
                        setPaymentMethod('')
                        setPaypalPaymentStarted(false)
                        setStripePaymentStarted(false)
                      }}>
                        Razorpay / Paypal
                    </button>
                    <button
                      className={`flex-1 py-3 font-medium text-[15px] text-center ${
                        paymentVia === "cards"
                          ? "text-purple-600 border-b-2 border-purple-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={()=> {
                        setPaypalPaymentStarted(false)
                        setStripePaymentStarted(true)
                        setPaymentMethod('')
                        setPaymentVia("cards")
                      }}>
                      Cards 
                    </button>
                  </div>

                  <div className={`${paymentMethod === 'cards' && 'hidden'}`}>   
                    <div className="mb-6">
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500"> ₹ </span>
                        </div>
                        <input type="number" id="amount" className="pl-8 w-full h-10 px-3 py-2 border border-gray-300 rounded-md
                           focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="0.00" min="1" step='0.1'
                            onChange={(e)=> amountHandler(e)} onBlur={()=> {
                              console.log('Inside amount onBlur, amount-->', amount)
                              const numericAmount = parseFloat(amount)
                              if(isNaN(numericAmount) || numericAmount <= 1){
                                setError('Amount must be higher than ₹ 1')
                              }else{
                                setError('')
                              }
                            }}/>
                        <p className='h-[5px] text-[11px] text-red-500 tracking-[0.2px]'> {error && error} </p>
                      </div>
                    </div>

                    <div className={`mb-6`}>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                        Notes (Optional)
                      </label>
                      <textarea id="notes" value={notes} placeholder="Add any notes about this transaction" rows="3"
                        className="w-full px-3 py-2 text-[12px] resize-none border border-gray-300 rounded-md focus:outline-none
                         focus:ring-2 focus:ring-purple-500" onChange={handleNotesChange}></textarea>
                      <p className="ml-[2px] text-[10px] font-[480] text-gray-500">
                        Add any details about this transaction for your records.
                      </p>
                    </div>
                  </div>
        
                  {paymentVia === "razorpayAndPaypal" && (
                    <div className={`space-y-4 ${paymentMethod === 'paypal' && 'hidden'}`}>
                      <div className={`border rounded-lg p-4 flex items-center justify-between 
                        ${paymentMethod === 'razorpay' && 'bg-primaryLight border-primaryDark'}
                          hover:bg-primaryLight cursor-pointer`} onClick={()=> {
                            setPaypalPaymentStarted(false)
                            setPaymentMethod('razorpay')
                          }}>
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <img src='./razorpay.png' className='w-[20px] h-[20px]'/>
                          </div>
                          <span className="font-medium"> Razorpay </span>
                        </div>
                        <input type="radio" name="payment-gateway" className="h-4 w-4 text-primaryDark focus:ring-0"
                          onClick={()=> {
                            setPaypalPaymentStarted(false)
                            setPaymentMethod('razorpay')
                          }} 
                          checked={paymentMethod === 'razorpay'}/>
                      </div>
        
                      <div className={`border rounded-lg p-4 flex items-center justify-between 
                       ${PaypalPaymentStarted === true && 'bg-primaryLight border-primaryDark'}
                        hover:bg-primaryLight cursor-pointer`} onClick={()=> {
                          setPaymentMethod('')
                          setPaypalPaymentStarted(true)
                        }}>
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <img src='/paypal.png' className='w-[20px] h-[20px]'/>
                          </div>
                          <span className="font-medium">PayPal</span>
                        </div>
                        <input type="radio" name="payment-gateway" className="h-4 w-4 text-primaryDark focus:ring-0" 
                          onClick={()=> {
                            setPaymentMethod('')
                            setPaypalPaymentStarted(true)
                          }} checked={PaypalPaymentStarted === true}/>
                      </div>
                    </div>
                  )}
      
                  { paymentVia === 'cards' &&  paymentMethod === 'cards' &&
                    <div className='px-[1rem] pb-[1rem] flex flex-col gap-0 items-center'>

                      <i className='ml-[1.5rem] p-[5px] self-start border border-dropdownBorder rounded-[4px] cursor-pointer'>
                        <ChevronLeft className='w-[20px] h-[20px] text-muted' onClick={()=> setPaymentMethod('')}/>
                      </i>

                      <StripePayment amount={amount} onPayment={(id)=> handleStripeOrPaypalPayment('stripe', id)} 
                        payButtonText='Add Money'/>

                      {/* <div className='px-[1rem]'>
                        <button className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium 
                            rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                              onClick={()=> {setPaymentMethod('')}}>
                            Go Back
                        </button>
                      </div> */}
                    </div>
                  }

                </div>
        
                <div className={`p-6 border-t bg-gray-50 rounded-b-lg 
                  ${paymentMethod === 'paypal' && 'max-h-[19rem] overflow-y-scroll'} ${paymentMethod === 'cards' && 'hidden'}`}>

                  {
                    paymentMethod !== 'paypal' && !PaypalPaymentStarted && !stripePaymentStarted && paymentMethod !== 'cards' &&
                    <button className={`w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium 
                      rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                        ${error && amount < 1 && 'cursor-not-allowed'}`}
                          onClick={()=> validateAndContinue(()=> handlRazorpayPayment())}>
                      Add Money
                    </button>
                    
                  }
                  {
                    PaypalPaymentStarted && paymentMethod !== 'paypal' &&
                      <button className={`w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium 
                        rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                          ${error && amount < 1 && 'cursor-not-allowed'}`}
                            onClick={()=> validateAndContinue(()=> setPaymentMethod('paypal'))}>
                        Continue Via Paypal
                      </button> 
                  }
                  {
                    stripePaymentStarted && paymentMethod !== 'cards' &&
                      <button className={`w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium 
                        rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                          ${error && amount < 3.10 && 'cursor-not-allowed'}`}
                            onClick={()=> validateAndContinue(()=> setPaymentMethod('cards'), 3.10)}>
                        Continue 
                      </button>
                  }
                  
                  {
                    paymentMethod === 'paypal' &&

                    <div className='flex flex-col gap-[10px] items-center'>
                  
                      <PaypalPayment amount={amount} onPayment={(id)=> handleStripeOrPaypalPayment('paypal', id)} />

                      <button className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium 
                        rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                          onClick={()=> {setPaymentMethod(''); setPaypalPaymentStarted(false)}}>
                        Go Back
                      </button>
                  
                    </div>
                  }
                  

                </div>
              </div>
            </div>
                
    )
}