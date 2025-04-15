import React, { useState, useEffect } from "react"

import axios from 'axios'
import {toast} from 'react-toastify'

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'


function Message({ content }) {
    return <p>{content}</p>;
}

export default function PaypalPayment({amount, onPayment}) {

    const [message, setMessage] = useState("")
    const [clientId, setClientId] = useState(null)

    useEffect(() => {
        axios.get('http://localhost:3000/payment/paypal/clientid', {withCredentials: true})
            .then(res=> setClientId(res.data.id))
            .catch(err=> setMessage("Could not load PayPal client ID"))
    }, [])

    useEffect(()=> {
        if(clientId){
            console.log('clientId from useEffect-->', clientId)
        }
    },[clientId])

    const initialOptions = {
        "client-id": clientId,
        intent: "capture",
        "enable-funding": ["venmo", "paylater"],
        "disable-funding": "",
        "buyer-country": "US",
        currency: "USD",
        // "data-page-type": "product-details",
        components: "buttons",
        // "data-sdk-integration-source": "developer-studio",
    }

    const makePaypalOrder = async()=> {
        try {
            console.log('clientId--->', clientId)
            const currencyApiKey = import.meta.env.VITE_EXCHANGERATEAPI_KEY
            const currencyRateResponse = await fetch(`https://v6.exchangerate-api.com/v6/${currencyApiKey}/latest/INR`)
            const data = await currencyRateResponse.json()
            const usdRate = data.conversion_rates.USD
            console.log("usdRate--->", usdRate)

            const usdAmount = amount * usdRate

            const response = await fetch("http://localhost:3000/payment/paypal/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({amount: usdAmount.toFixed(2)})
            })
            
            console.log("clientId-->", clientId)
            const orderData = await response.json()

            if (orderData.id) {
                return orderData.id
            } else {
                const errorDetail = orderData?.details?.[0]
                const errorMessage = errorDetail
                    ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                    : JSON.stringify(orderData)

                // throw new Error(errorMessage)
                toast.error(errorMessage)
                return
            }
        }
        catch(error){
            console.error(error)
            setMessage(`Could not initiate PayPal Checkout...${error}`)
            toast.error(`Could not initiate PayPal Checkout...${error}`)
        }
    }

    const onPaypalApproval = async(data, actions)=> {
        try {
            console.log('Inside onApprove')
            console.log("PayPal Approval Data:", data)
            const response = await fetch("http://localhost:3000/payment/paypal/capture",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({orderId: data.orderID})
                }
            );

            const orderData = await response.json()
            const errorDetail = orderData?.details?.[0]

            if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                return actions.restart();
            } else if (errorDetail) {
                // (2) Other non-recoverable errors -> Show a failure message
                // throw new Error(
                //     `${errorDetail.description} (${orderData.debug_id})`
                // )
                toast.error(`${errorDetail.description} (${orderData.debug_id})`)
                return
            } else {
                // (3) Successful transaction -> Show confirmation or thank you message
                // Or go to another URL:  actions.redirect('thank_you.html');
                const transaction = orderData.captureResult.purchase_units[0].payments.captures[0]
                setMessage(
                    `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
                );
                console.log('Payment Completed!')
                console.log(
                    "Capture result",
                    orderData,
                    JSON.stringify(orderData, null, 2)
                );

                const currencyApiKey = import.meta.env.VITE_EXCHANGERATEAPI_KEY

                const currencyRateResponse = await fetch(`https://v6.exchangerate-api.com/v6/${currencyApiKey}/latest/USD`)
                const data = await currencyRateResponse.json()
                const inrRate = data.conversion_rates.INR
                console.log("inrRate--->", inrRate)
                
                const inrAmount = transaction.amount.value * inrRate
                console.log("inrRate--->", inrAmount)

                await axios.post('http://localhost:3000/payment/paypal/save', 
                    {captureResult: orderData.captureResult, inrAmount}, 
                    {withCredentials: true}
                )

                onPayment(transaction.id)
            }
        } catch (error) {
            console.error(error);
            setMessage(
                `Sorry, your transaction could not be processed...${error}`
            );
            toast.error(`Sorry, your transaction could not be processed...${error}`)
        }
    }


    return (
        <div className="App">
            {
                clientId ?
                <PayPalScriptProvider options={initialOptions}>
                    <PayPalButtons
                       style={{
                            shape: "rect",
                            layout: "vertical",
                            color: "gold",
                            label: "paypal",
                        }}
                       createOrder={async()=> {
                            const orderId = await makePaypalOrder()
                            console.log("Returned PayPal order ID:", orderId)
                            return orderId
                        }}
                       onApprove={(data, actions)=> onPaypalApproval(data, actions)}
                    />
                </PayPalScriptProvider>
                : <p> Loading PayPal... </p>
            }
            <Message content={message} />
        </div>
    );
}

