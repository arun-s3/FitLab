
import React, {useState, forwardRef, useImperativeHandle} from "react"
import './CardPayment.css'

import axios from 'axios'
import {toast} from 'react-toastify'

import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"



const CardPayment = forwardRef( ({onPayment, payButtonText, displayError}, ref)=> {

  const [message, setMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  const stripe = useStripe()
  const elements = useElements()

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  const handleElementChange = (e)=> {
    console.log("PaymentElement out of focus")
    if(!e.complete){
      setIsDisabled(true)
    }else{
      setIsDisabled(false)
    }
  }

  const handleSubmit = async ()=> {
    if (!stripe || !elements) {
      return
    }
    setIsLoading(true)

    try{
      const {error, paymentIntent} = await stripe.confirmPayment({
        elements,
        redirect: "if_required", 
      })
    
      if (error){
        console.log(error)
        setMessage(error.message)
        toast.error(error.message)
        setIsLoading(false)
        displayError("Only Test Cards Allowed as of now via Stripe!")
        return
      }
    
      if (paymentIntent && paymentIntent.status === "succeeded") {
        const paymentDatas = {
          amount: paymentIntent.amount / 100,
          paymentOrderId: paymentIntent.client_secret,
          paymentId: paymentIntent.id,
          paymentMethod: "stripe",
        }
        await axios.post(`${baseApiUrl}/payment/stripe/save`, {paymentDatas}, {withCredentials: true})
        onPayment(paymentIntent.id)
      }
    
      setMessage("Payment succeeded!")
      setIsLoading(false)
  
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message)
        toast.error(error.message)
        displayError(error.message)
      } else {
        setMessage("An unexpected error occurred.")
        toast.error("An unexpected error occurred.")
        displayError("An unexpected error occurred.")
      }
  
      setIsLoading(false)
    }
    catch(error){
      if(error.response.status !== 500){
        toast.error(error.message)
      }else{
        toast.error("An unexpected error occurred.")
        displayError("An unexpected error occurred.")
      }
    }
  }

  useImperativeHandle(ref, () => ({
    clickStripePaymentAgain: () => {
      handleSubmit()
    }
  }), [handleSubmit])


  return (
    <div className="w-full mx-auto rounded-lg overflow-hidden p-6" id='CardPayment'>

      <form className="space-y-6" > 
        
        <PaymentElement onChange={handleElementChange}/> 

          <button 
            type="submit" 
            disabled={isLoading || !stripe || !elements || isDisabled} 
            className={`w-full bg-secondary text-white py-3 px-4 rounded-md font-medium hover:bg-purple-800 transition-colors 
              ${ (isLoading || !stripe || !elements || isDisabled) && 'cursor-not-allowed'}`} onClick={handleSubmit}>

                {isLoading ? "Processing..." : payButtonText}
                
          </button>

      </form>

    </div>
  )
}
)

export default CardPayment