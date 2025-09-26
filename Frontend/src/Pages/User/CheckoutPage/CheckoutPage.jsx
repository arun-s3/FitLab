import React, {useState, useEffect} from 'react'
import './CheckoutPage.css'
import {useNavigate, Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {motion} from 'framer-motion'

import {toast} from 'react-toastify'
import axios from 'axios'

import Header from '../../../Components/Header/Header'
import OrderManager from './OrderManager'
import AddressManager from './AddressManager'
import PaymentsManager from './PaymentsManager'
import OrderSummary from './OrderSummary'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import OrderStepper from '../../../Components/OrderStepper/OrderStepper'
import FeaturesDisplay from '../../../Components/FeaturesDisplay/FeaturesDisplay'
import Footer from '../../../Components/Footer/Footer'
import {getTheCart} from '../../../Slices/cartSlice'
import {createOrder, resetOrderStates} from '../../../Slices/orderSlice'
import {getAllAddress} from '../../../Slices/addressSlice'


export default function CheckoutPage(){
    
    const [shippingAddress, setShippingAddress] = useState({})

    const [paymentMethod, setPaymentMethod] = useState('')

    const [orderDetails, setOrderDetails] = useState({})

    const [orderReviewError, setOrderReviewError] = useState('')

    const {cart, productAdded, productRemoved, loading, error, message} = useSelector(state=> state.cart)
    const {addresses} = useSelector(state=> state.address)
    const {orders, orderCreated, orderMessage, orderError} = useSelector(state=> state.order)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const baseApiUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(()=> {
      dispatch(getTheCart())
      dispatch(getAllAddress())

      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true
      document.body.appendChild(script)
    },[])

    useEffect(()=> {
      const defaultAddress = addresses.find(address=> address.defaultAddress)
      setShippingAddress(defaultAddress)
    },[addresses])
  
    useEffect(()=> {
      if(paymentMethod){
        let paymentDetails = {paymentMethod, paymentStatus: 'pending'}
        if(paymentMethod === 'cashOnDelivery'){
          paymentDetails = {...paymentDetails, transactionId: 'cod-payment' }
        }
        setOrderDetails(orderDetails=> {
          return {...orderDetails, paymentDetails}
        })
      }
      if(shippingAddress){
        setOrderDetails(orderDetails=> {
          return {...orderDetails, shippingAddressId: shippingAddress._id}
        })
      }
    },[shippingAddress, paymentMethod])

    useEffect(()=> {
      console.log("orderDetails------->", JSON.stringify(orderDetails))
    },[orderDetails])

    useEffect(()=> {
      if(orderCreated){
        toast.success(orderMessage)
        navigate('/order-confirm', 
          { replace: true,
            state: {
              NoDirectAccess: true
          }}
        )
        dispatch(resetOrderStates())
      }
      if(orderReviewError){
        setTimeout(()=> setOrderReviewError(''), 2500)
      }
    },[orderCreated, orderMessage, orderError, orderReviewError])

    const headerBg = {
        backgroundImage: "url('/header-bg.png')",
        backgrounSize: 'cover'
    }

    const containerVariants = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.25
        },
      },
    }

    const stepVariants = {
      hidden: { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
      },
    }

    const radioClickHandler = (e, type, value)=>{
      const checkStatus = type==='address' ? (shippingAddress === value) : (paymentMethod === value)
      console.log("checkStatus-->", checkStatus)
      if(checkStatus){
          if(type === 'address') setShippingAddress('')
          else setPaymentMethod('')
          return
      }else{
          if(type === 'address') setShippingAddress(value)
          else setPaymentMethod(value)
          const changeEvent = new Event('change', {bubbles:true})
          e.target.dispatchEvent(changeEvent)
      }
    }

    const radioChangeHandler = (e, type, value)=>{
      e.target.checked = type==='address' ? (shippingAddress === value) : (paymentMethod === value)
    }

    
    const handleApplyDiscount = (couponCode) => {
      setOrderDetails(orderDetails=> {
        return {...orderDetails, couponCode}
      })
    }

  const placeOrder= async()=> {
    try{
      console.log("Inside placeOrder")
      if(paymentMethod === ''){
        toast.error('Please select a payment Method!')
        return
      }
      if(Object.keys(shippingAddress).length === 0){
        toast.error('Please select a delivery address!')
        return
      }
      if(paymentMethod === 'razorpay'){
        const response = await axios.post(`${baseApiUrl}/payment/razorpay/order`,
          {amount: cart.absoluteTotalWithTaxes.toFixed(2)}, { withCredentials: true }
        )
        // const data = await response.json()
        console.log("razorpay created order--->", response.data.data)
        handleRazorpayVerification(response.data.data)
      }
      else if(paymentMethod === 'wallet'){
        console.log('Paying with wallet...')
        const response = await axios.post(`${baseApiUrl}/wallet/order`,
          {amount: cart.absoluteTotalWithTaxes.toFixed(2)}, { withCredentials: true }
        )
        console.log('response.data--->', response.data)
        if(response.data.transactionId){ 
          toast.success("Payment via Wallet successfull!")
          const paymentDetails = {paymentMethod: 'wallet', paymentStatus: 'completed', transactionId: response.data.transactionId}
          dispatch( createOrder({orderDetails: {...orderDetails, paymentDetails}}) ) 
        }
      }
      else{
        dispatch( createOrder({orderDetails}) ) 
      }
    }
    catch(error){
      console.log('Error in placeOrder:', error.response.data?.message || error.message)
      if (error.response && error.response.status !== 500){
        toast.error(error.response.data?.message || error.message)
      }else{
        toast.error('Something went wrong.')
      }
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
                    dispatch( createOrder({
                      orderDetails: {
                        ...orderDetails, 
                        paymentDetails: {paymentMethod: 'razorpay', transactionId: response.razorpay_payment_id, paymentStatus: 'completed'}
                      }
                    }) ) 
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
  dispatch( createOrder({
    orderDetails: {
      ...orderDetails, 
      paymentDetails: {paymentMethod, transactionId: paymentId, paymentStatus: 'completed'}
    }
  }) ) 
}


    return(
        <section id='CheckoutPage'>
            <header style={headerBg} className='h-[5rem]'>
                
                <Header />
                
            </header>
                
            <BreadcrumbBar heading='Checkout Details'/>
            
            <main className='mb-[7rem]'>
                <div className='my-[4rem]'>

                  {
                    cart?.products && cart.products.length > 0 ?
                      <OrderStepper stepNumber={2}/>
                      : null
                  }
                  
                </div>
                
                {
                  cart?.products && cart.products.length > 0 ?
                    <motion.div 
                      className='px-[2rem] flex items-center flex-col lg:flex-row lg:items-start gap-[2rem]'
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                    >
                        <div className='basis-[70%]'>

                            <motion.div className='flex flex-col gap-[20px]' variants={containerVariants}>

                                <motion.div id='checkout-step' 
                                  className='!flex-col !gap-0 x-lg:!flex-row x-lg:!gap-20'
                                  variants={stepVariants}
                                >
                                    <div className='checkout-step-header'>
                                        <h4> 01 </h4>
                                        <h2> Review Your Orders </h2>
                                    </div>

                                      <OrderManager
                                        products={cart.products} 
                                        orderReviewError={orderReviewError} 
                                        setOrderReviewError={setOrderReviewError}
                                      />

                                </motion.div>

                                <motion.div id='checkout-step' 
                                  style={{paddingBottom: '1rem'}} 
                                  className='!flex-col !gap-0 xx-xl:!flex-row xx-xl:!gap-20'
                                  variants={stepVariants}
                                >
                                    <div className='checkout-step-header'>
                                        <h4> 02 </h4>
                                        <h2> Choose Your Delivery Address </h2>
                                    </div>
                                    <div className='x-lg:!self-end xx-xl:self-auto'> 

                                      <AddressManager 
                                        addresses={addresses} 
                                        shippingAddress={shippingAddress} 
                                        setShippingAddress={setShippingAddress} 
                                        onAddressClick={radioClickHandler} 
                                        onAddresChange={radioChangeHandler}
                                      />

                                    </div>
                                </motion.div>
                                <motion.div 
                                  id='checkout-step' 
                                  style={{borderBottom: '0'}} 
                                  className='!flex-col !gap-0 x-xl:!flex-row x-xl:!gap-20'
                                  variants={stepVariants}
                                >
                                    <div className='checkout-step-header'>
                                        <h4> 03 </h4>
                                        <h2> Choose Your Payment Method </h2>
                                    </div>

                                    <PaymentsManager 
                                      paymentMethod={paymentMethod} 
                                      setPaymentMethod={setPaymentMethod} 
                                      optionClickHandler={radioClickHandler} 
                                      optionChangeHandler={radioChangeHandler} 
                                      cartTotal={cart && cart.absoluteTotalWithTaxes ? cart.absoluteTotalWithTaxes : null} 
                                      stripeOrPaypalPayment={handleStripeOrPaypalPayment}
                                    />

                                </motion.div>
                            </motion.div>
                        </div> 
                       {
                        cart?.products && 
                          (
                            <motion.div
                              variants={stepVariants}
                              initial="hidden"
                              animate="show"
                            >
                                <OrderSummary 
                                  shippingAddress={shippingAddress} 
                                  paymentMethod={paymentMethod} 
                                  onApplyDiscount={handleApplyDiscount}
                                  placeOrder={placeOrder}
                                />
                            </motion.div>
                          )
                       }
                    </motion.div>
                    :
                    <motion.div 
                      className='px-[2rem] flex items-center justify-center h-[15vh] xs-sm:h-[25vh]'
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                    >
                      <p className='hidden xx-md:inline-block text-[17px] text-muted capitalize tracking-[0.5px]'>
                        No products available for checkout. Click  
                        <Link to='/shop' className='mx-[5px] text-secondary hover:underline transition duration-300 cursor-pointer'>
                          here 
                        </Link> 
                        to return to the shop and continue shopping!
                      </p>
                      <div className='xx-md:hidden text-muted capitalize tracking-[0.5px]'>
                        <p className='text-center text-[15px] s-sm:text-[17px]'> No products available for checkout.  </p>
                        <p className='mt-4 max-mob:ml-auto max-mob:w-auto ml-[-24px] s-sm:ml-auto w-[118%] s-sm:w-auto text-[12px] 
                          s-sm:text-[17px]'> 
                          Click 
                          <Link to='/shop' className='mx-[5px] text-secondary hover:underline transition duration-300 cursor-pointer'>
                          here 
                          </Link> 
                          to return to the shop and continue shopping! 
                        </p>
                      </div>
                    </motion.div>
                }

            </main>

            <FeaturesDisplay />
            
            <Footer />

        </section>
    )
} 