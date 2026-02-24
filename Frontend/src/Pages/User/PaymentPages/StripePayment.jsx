import React, {useState, useEffect, forwardRef, useImperativeHandle, useRef} from 'react'

import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

import {toast} from 'react-toastify'

import apiClient from '../../../Api/apiClient'

import CardPayment from "./CardPayment"


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)


const StripePayment = forwardRef( ({ amount, onPayment, payButtonText = 'Pay and Place Order', onError }, ref)=> {


  const [clientSecret, setClientSecret] = useState("")

  const clickStripePayment = useRef()

  const tryStripePaymentAgain = ()=> clickStripePayment.current.clickStripePaymentAgain()

  useImperativeHandle(ref, () => ({
      retryStripePayment: () => {
        tryStripePaymentAgain()
      }
  }), [tryStripePaymentAgain])

  useEffect(() => {
  const createStripeIntent = async () => {
    try {
      const response = await apiClient.post(`/payment/stripe/order`, { amount })
      if (response?.data?.clientSecret) {
        setClientSecret(response.data.clientSecret)
      }else {
        toast.error("Unable to initialize Stripe payment.")
      }
    }
    catch (error) {
      toast.error(error.response?.data?.message || "Payment initialization failed.")
    }
  }

  if (amount) {
    createStripeIntent()
  }
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
      {clientSecret 
        ? (
        <Elements stripe={stripePromise} options={options}>

          <CardPayment 
            onPayment={(id)=> onPayment(id)} 
            payButtonText={payButtonText} 
            displayError={onError} 
            ref={clickStripePayment}
          />

        </Elements>

      ) 
        :
        <p className='mt-4 text-muted text-[15px]'> Loading..... </p>
       }
    </>
  );
}
)
export default StripePayment
