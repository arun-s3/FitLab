import React, {useState, useEffect} from 'react'

import { CreditCard, PlusCircle, X, Globe } from "lucide-react" 
import {toast} from 'react-toastify'
import axios from 'axios'


export default function WalletFundingModal({showFundingModal, closeFundingModal, paymentVia, setPaymentVia}){

    if (!showFundingModal) return null

    const [amount, setAmount] = useState(1)
    const [notes, setNotes] = useState('')
    const [paymentMethod,setPaymentMethod] = useState('')

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
      const amount = e.target.value.trim()
      if(parseInt(amount) && amount > 0){
        setAmount(amount)
      }else return
    }

    const handleNotesChange = (e)=> {
      setNotes(e.target.value)
    }

    const payAmount = async()=> {
      if(paymentMethod === 'razorpay'){
        const response = await axios.post(`http://localhost:3000/payment/razorpay/order`,
          {amount: parseInt(amount).toFixed(2)}, { withCredentials: true }
        )
        console.log("razorpay created order--->", response.data.data)
        handleRazorpayVerification(response.data.data)
      }
    }

    const handleRazorpayVerification = async (data) => {
        const res = await axios.get('http://localhost:3000/payment/razorpay/key', { withCredentials: true })
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
                    const verifiedData = await axios.post('http://localhost:3000/payment/razorpay/verify', {
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
                        await axios.post('http://localhost:3000/wallet/add', {
                          amount,
                          notes,
                          paymentMethod,
                          paymentId: response.razorpay_payment_id
                          }, { withCredentials: true }
                        )
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


    return(
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div
                className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4"
                role="dialog"
                aria-labelledby="add-money-modal-title"
                aria-modal="true"
              >
                <div className="flex justify-between items-center p-6 border-b">
                  <h3 id="add-money-modal-title" className="text-xl font-semibold">
                    Add Money
                  </h3>
                  <button
                    onClick={closeFundingModal}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full"
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </button>
                </div>
        
                <div className="p-6">
                  {/* Payment Method Tabs */}
                  <div className="flex border-b mb-6">
                    <button
                      className={`flex-1 py-3 font-medium text-[15px] text-center ${
                        paymentVia === "razorpayAndPaypal"
                          ? "text-purple-600 border-b-2 border-purple-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setPaymentVia("razorpayAndPaypal")}
                    >
                      Razorpay / Paypal
                    </button>
                    <button
                      className={`flex-1 py-3 font-medium text-[15px] text-center ${
                        paymentVia === "cards"
                          ? "text-purple-600 border-b-2 border-purple-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setPaymentVia("cards")}
                    >
                      Cards (via Stripe)
                    </button>
                  </div>
        
                  {/* Amount Input */}
                  <div className="mb-6">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500"> ₹ </span>
                      </div>
                      <input
                        type="number"
                        id="amount"
                        className="pl-8 w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="0.00"
                        min="1"
                        onChange={(e)=> amountHandler(e)}
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={handleNotesChange}
                      className="w-full px-3 py-2 text-[12px] resize-none border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Add any notes about this transaction"
                      rows="3"
                    ></textarea>
                    <p className="ml-[2px] text-[10px] font-[480] text-gray-500">Add any details about this transaction for your records.</p>
                  </div>
        
                  {/* Payment Gateways */}
                  {paymentVia === "razorpayAndPaypal" && (
                    <div className="space-y-4">
                      <div className={`border rounded-lg p-4 flex items-center justify-between 
                        ${paymentMethod === 'razorpay' && 'bg-primaryLight border-primaryDark'}
                          hover:bg-primaryLight cursor-pointer`} onClick={()=> setPaymentMethod('razorpay')}>
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <img src='./razorpay.png' className='w-[20px] h-[20px]'/>
                          </div>
                          <span className="font-medium">Razorpay</span>
                        </div>
                        <input type="radio" name="payment-gateway" className="h-4 w-4 text-primaryDark focus:ring-0"
                          onClick={()=> setPaymentMethod('razorpay')} checked={paymentMethod === 'razorpay'}/>
                      </div>
        
                      <div className={`border rounded-lg p-4 flex items-center justify-between 
                       ${paymentMethod === 'paypal' && 'bg-primaryLight border-primaryDark'}
                        hover:bg-primaryLight cursor-pointer`} onClick={()=> setPaymentMethod('paypal')}>
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <img src='/paypal.png' className='w-[20px] h-[20px]'/>
                          </div>
                          <span className="font-medium">PayPal</span>
                        </div>
                        <input type="radio" name="payment-gateway" className="h-4 w-4 text-primaryDark focus:ring-0" 
                          onClick={()=> setPaymentMethod('paypal')} checked={paymentMethod === 'paypal'}/>
                      </div>
                    </div>
                  )}
        
                  {/* {paymentVia === "cards" && (
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center">
                          <div className="bg-purple-100 p-2 rounded-full mr-3">
                            <CreditCard className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <span className="font-medium block">•••• •••• •••• 4242</span>
                            <span className="text-sm text-gray-500">Expires 12/24</span>
                          </div>
                        </div>
                        <input type="radio" name="payment-card" className="h-4 w-4 text-purple-600" defaultChecked />
                      </div> */}
        
                      {/* <div className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center">
                          <div className="bg-purple-100 p-2 rounded-full mr-3">
                            <CreditCard className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <span className="font-medium block">•••• •••• •••• 5678</span>
                            <span className="text-sm text-gray-500">Expires 08/25</span>
                          </div>
                        </div>
                        <input type="radio" name="payment-card" className="h-4 w-4 text-purple-600" />
                      </div>
        
                      <button className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                        <PlusCircle className="h-4 w-4" />
                        <span>Add new card</span>
                      </button> */}
                    {/* </div>
                  )} */}
                </div>
        
                <div className="p-6 border-t bg-gray-50 rounded-b-lg">
                  <button
                    className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    onClick={()=> payAmount()}
                  >
                    Add Money
                  </button>
                </div>
              </div>
            </div>
                
    )
}