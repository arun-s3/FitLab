import React, {useState, useEffect, forwardRef, useImperativeHandle, useRef} from 'react'

import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

import {toast} from 'react-toastify'

import CardPayment from "./CardPayment"


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)


const StripePayment = forwardRef( ({ amount, onPayment, payButtonText = 'Pay and Place Order', onError }, ref)=> {


  const [clientSecret, setClientSecret] = useState("")

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  const clickStripePayment = useRef()

  const tryStripePaymentAgain = ()=> clickStripePayment.current.clickStripePaymentAgain()

  useImperativeHandle(ref, () => ({
      retryStripePayment: () => {
        tryStripePaymentAgain()
      }
  }), [tryStripePaymentAgain])

  useEffect(() => {
    fetch(`${baseApiUrl}/payment/stripe/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    })
      .then(res=> res.json())
      .then(data=> setClientSecret(data.clientSecret))
      .catch(error=> toast.error(error.message))
  }, [amount])

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        // colorPrimary: 'transparent',
        // fontFamily: 'saira, sans-serif'
      },
      rules: {
        '.Tab': {
          display: 'none',
          color: '#000',
          fontSize: '15px'
        },
        '.TabIcon': {
          display: 'none',
        },
        '.TabLabel': {
          display: 'none',
          color: '#000',
          fontSize: '15px'
        },
        '.PaymentElement': {
          border: 'none',
        },
      }
    },
  }


  return (
    <>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={options}>

          <CardPayment 
            onPayment={(id)=> onPayment(id)} 
            payButtonText={payButtonText} 
            displayError={onError} 
            ref={clickStripePayment}
          />

        </Elements>

      ) : 'Loading.....'}
    </>
  );
}
)
export default StripePayment
