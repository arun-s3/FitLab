
import {useState, useEffect} from "react"
import './CardPayment.css'

import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"



export default function CardPayment({setCardElementChanged, onPayment}){

  const [message, setMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const stripe = useStripe()
  const elements = useElements()

  const handleChange = (e)=> {
    console.log("PaymentElement changed")
    if(!e.empty){
      setCardElementChanged(true)
    }else{
      setCardElementChanged(false)
    }
  }


  const handleSubmit = async (e)=> {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:5173/order-confirm",
      }
    })

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  }

  return (
    <div className="w-full mx-auto rounded-lg overflow-hidden p-6" id='CardPayment'>

      <form className="space-y-6" onSubmit={handleSubmit}> 
        
        <PaymentElement onChange={handleChange}/> 

          <button type="submit" disabled={isLoading || !stripe || !elements} className="w-full bg-secondary text-white py-3
             px-4 rounded-md font-medium hover:bg-purple-800 transition-colors" >
           {isLoading ? "Processing..." : "Pay and Place Order"}
          </button>

      </form>

    </div>
  )
}

