import React, { useState, useEffect } from "react"

import apiClient from '../../../Api/apiClient'
import {toast as sonnerToast} from 'sonner'
import {toast} from 'react-toastify'

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

import {CustomHashLoader} from '../../../Components/Loader/Loader'


export default function PaypalPayment({amount, onPayment, onError}) {

    const [message, setMessage] = useState("")
    const [clientId, setClientId] = useState(null)

    const currencyApiKey = import.meta.env.VITE_EXCHANGERATEAPI_KEY
    const baseApiUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        apiClient.get(`${baseApiUrl}/payment/paypal/clientid`)
            .then(res=> setClientId(res.data.id))
            .catch(err=> {
                setMessage("Could not load PayPal client ID") 
                onError("Invalid credentials or network error!")
            })
    }, [])

    const findUsdAmount = async(amount)=> {
        const currencyRateResponse = await fetch(`https://v6.exchangerate-api.com/v6/${currencyApiKey}/latest/INR`)
        const data = await currencyRateResponse.json()
        const usdRate = data.conversion_rates.USD
        return (amount * usdRate)
    }

    const findInrAmount = async(amount)=> {
        const currencyRateResponse = await fetch(`https://v6.exchangerate-api.com/v6/${currencyApiKey}/latest/USD`)
        const data = await currencyRateResponse.json()
        const inrRate = data.conversion_rates.INR
        return (amount * inrRate)
    }

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
            const usdAmount = await findUsdAmount(amount)
            
            const response = await fetch(`${baseApiUrl}/payment/paypal/order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({amount: usdAmount.toFixed(2)})
            })
            
            const orderData = await response.json()

            if (orderData.id) {
                return orderData.id
            }else{
                const errorDetail = orderData?.details?.[0]
                const errorMessage = errorDetail
                    ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                    : JSON.stringify(orderData)
                
                sonnerToast.error(errorMessage)
                onError(errorMessage)
                return
            }
        }
        catch(error){
            setMessage(`Could not initiate PayPal Checkout...${error}`)
            sonnerToast.error(`Could not initiate PayPal Checkout...${error}`)
            onError(`Could not initiate PayPal Checkout...${error}`)
        }
    }

    const onPaypalApproval = async(data, actions)=> {
        try {
            const response = await apiClient.post(`${baseApiUrl}/payment/paypal/capture`, {orderId: data.orderID})

            const orderData = response.data
            const errorDetail = orderData?.details?.[0]

            if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                return actions.restart()
            } else if (errorDetail) {
                toast.error(`${errorDetail.description} (${orderData.debug_id})`)
                onError(errorDetail.description)
                return
            } else {
                const transaction = orderData.captureResult.purchase_units[0].payments.captures[0]
                setMessage(`Transaction ${transaction.status}: ${transaction.id}. See console for all available details`)
                const inrAmount = await findInrAmount(transaction.amount.value)

                await apiClient.post(`${baseApiUrl}/payment/paypal/save`, {captureResult: orderData.captureResult, inrAmount})

                onPayment(transaction.id)
            }
        }
        catch (error){
            setMessage(`Sorry, your transaction could not be processed...${error}`)
            onError(`Sorry, your transaction could not be processed...${error}`)
            toast.error(`Sorry, your transaction could not be processed...${error}`)
        }
    }


    return (
        <div className="PaypalPayment w-full">
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
                            return orderId
                        }}
                       onApprove={(data, actions)=> onPaypalApproval(data, actions)}
                    />
                </PayPalScriptProvider>
                
                : <CustomHashLoader loading={!clientId}/>
            }
            <p className="text-[12px] text-red-500 tracking-[0.2px]"> {message} </p>
        </div>
    );
}

