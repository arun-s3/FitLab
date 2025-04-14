import React, {useState, useEffect} from 'react'

import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

import CardPayment from "./CardPayment"


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)


export default function StripePayment({ amount, onPayment }){


  const [clientSecret, setClientSecret] = useState("")

  console.log('import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY--->', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  console.log('stripePromise--->', stripePromise)

  useEffect(() => {
    fetch("http://localhost:3000/payment/stripe/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    })
      .then(res=> res.json())
      .then(data=> setClientSecret(data.clientSecret))
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
          <CardPayment onPayment={(id)=> onPayment(id)}/>
        </Elements>
      ) : 'Loading.....'}
    </>
  );
}
