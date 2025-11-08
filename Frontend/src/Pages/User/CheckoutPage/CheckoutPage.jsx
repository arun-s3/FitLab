import React, {useState, useEffect} from 'react'
import './CheckoutPage.css'
import {useNavigate, Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {motion} from 'framer-motion'

import {toast} from 'react-toastify'
import {toast as sonnerToast} from 'sonner'
import axios from 'axios'

import Header from '../../../Components/Header/Header'
import OrderManager from './OrderManager'
import AddressManager from './AddressManager'
import PaymentsManager from './PaymentsManager'
import OrderSummary from './OrderSummary'
import TextChatBox from '../TextChatBox/TextChatBox'
import PaymentFailedModal from './Modals/PaymentFailedModal'
import CheckoutPausedModal from './Modals/CheckoutPausedModal'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import OrderStepper from '../../../Components/OrderStepper/OrderStepper'
import FeaturesDisplay from '../../../Components/FeaturesDisplay/FeaturesDisplay'
import Footer from '../../../Components/Footer/Footer'
import {getTheCart, addToCart, reduceFromCart, removeFromCart} from '../../../Slices/cartSlice'
import {createOrder, resetOrderStates} from '../../../Slices/orderSlice'
import {getAllAddress, resetStates} from '../../../Slices/addressSlice'


export default function CheckoutPage(){
    
    const [shippingAddress, setShippingAddress] = useState({})
    const [deliverAddressMade, setDeliverAddressMade] = useState(false)

    const [paymentMethod, setPaymentMethod] = useState('')

    const [orderDetails, setOrderDetails] = useState({})

    const [orderReviewError, setOrderReviewError] = useState('')

    const [isLoading, setIsLoading] = useState(false)

    const [openChatBox, setOpenChatBox] = useState(false)
    const [isPaymentFailedModalOpen, setIsPaymentFailedModalOpen] = useState({status: false, msg: null})
    const [isCheckoutPauseModalOpen, setIsCheckoutPauseModalOpen] = useState(false)

    const [checkoutBlockedProducts, setCheckoutBlockedProducts] = useState([])
    
    const [orderFreshSources, setOrderFreshSources] = useState(false)

    const [retryStripePaymentStatus, setRetryStripePaymentStatus] = useState(false)

    const {cart, productRemoved} = useSelector(state=> state.cart)
    const {addresses} = useSelector(state=> state.address)
    const {orderCreated, orderMessage, orderError} = useSelector(state=> state.order)

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
      if(orderFreshSources){
        console.log("cart--->", cart)
        placeOrder()
        setOrderFreshSources(false)
      }
    }, [cart, orderFreshSources])

    useEffect(()=> {
      if(addresses && !deliverAddressMade){
        const defaultAddress = addresses.find(address=> address.defaultAddress)
        setShippingAddress(defaultAddress)
      }
      if(addresses && deliverAddressMade){
        setNewAddressAsShippingAddress()
        dispatch(resetStates())
      }
    },[addresses, deliverAddressMade])

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
        console.log("shippingAddress----->", shippingAddress)
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
        setIsLoading(false)
        sonnerToast.success(orderMessage)
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
      if(orderError){
        setIsLoading(false)
        console.log("orderError--->", orderError)
        toast.error(orderError, {autoClose: 3500})
        dispatch(resetOrderStates())
      }
    },[orderCreated, orderMessage, orderError, orderReviewError])

    useEffect(()=> {
      console.log("productRemoved--->", productRemoved)
      if(productRemoved){
        const unavailableProducts = cart.products.filter(product=> 
          !product.productId || product.productId.isBlocked || product.productId.stock < product.quantity
        )
        setCheckoutBlockedProducts(unavailableProducts)
        dispatch(resetOrderStates())
      }
    }, [productRemoved])

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

    const addQuantity = (id, quantity)=> {
      console.log("Inside addQuantity")
      dispatch( addToCart({productId: id, quantity}) )
    }
    
    const lessenQuantity = (id, quantity, currentQuantity)=> {
      console.log("Inside lessenQuantity")
      if(currentQuantity > 1){
        dispatch( reduceFromCart({productId: id, quantity}) )
      }else{
        setOrderReviewError('There must be atleast 1 item to ship!')
      }
    }

    const removeProduct = (id)=> {
        console.log("Inside removeProduct()")
        dispatch(removeFromCart({productId: id}))
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

    const setNewAddressAsShippingAddress = ()=> {
      console.log('addresses now------>', addresses)
      console.log("Inside setNewAddressAsShippingAddress")
      const today = new Date().toISOString().split("T")[0]
      console.log("today-->", today)

      const latestTodayAddress = addresses
        .filter(addr=> addr?.createdAt && new Date(addr.createdAt).toISOString().split("T")[0] === today)
        .sort((a, b)=> new Date(b.createdAt) - new Date(a.createdAt)) 
      console.log("latestTodayAddress-->", latestTodayAddress)

      if(latestTodayAddress && latestTodayAddress.length > 0){
        const newlyCreatedAddress = latestTodayAddress[0]
        console.log("newlyCreatedAddress-->", newlyCreatedAddress)
        setShippingAddress(newlyCreatedAddress)
      }
    }

  const checkProductsAvailability = () => {
    return cart.products.every(product => {
      return (
        product.productId && 
        !product.productId.isBlocked && 
        product.productId.stock >= product.quantity
      )
    })
  }

  const sourceItAgainAndOrder = async()=> {
    await dispatch(getTheCart()).unwrap()
    setOrderFreshSources(true)
  }

  const placeOrder= async()=> {
    setIsLoading(true)
    if(!checkProductsAvailability()){
      const unavailableProducts = cart.products.filter(product=> 
        !product.productId || product.productId.isBlocked || product.productId.stock < product.quantity
      )
      setCheckoutBlockedProducts(unavailableProducts)
      setIsLoading(false)
      setIsCheckoutPauseModalOpen(true)
      return
    } 
    try{
      console.log("Inside placeOrder")
      if(paymentMethod === ''){
        sonnerToast.error('Please select a payment Method!')
        setIsLoading(false)
        return
      }
      if(Object.keys(shippingAddress).length === 0){
        sonnerToast.error('Please select a delivery address!')
        setIsLoading(false)
        return
      }
      if(paymentMethod === 'razorpay'){
        try{
            const response = await axios.post(`${baseApiUrl}/payment/razorpay/order`,
              {amount: cart.absoluteTotalWithTaxes.toFixed(2)}, { withCredentials: true }
            )
            console.log("razorpay created order--->", response.data.data)
            handleRazorpayVerification(response.data.data)
            setIsLoading(false)
        }
        catch(error){
          console.log(error)
          setIsPaymentFailedModalOpen({status: true, msg: 'Network Error'})
          setIsLoading(false)
        }
      }
      else if(paymentMethod === 'wallet'){
        console.log('Paying with wallet...')
        try{  
           const response = await axios.post(`${baseApiUrl}/wallet/order`,
              {amount: cart.absoluteTotalWithTaxes.toFixed(2)}, { withCredentials: true }
            )
          console.log('response.data--->', response.data)
          if(response.data.transactionId){ 
            sonnerToast.success("Payment via Wallet successfull!", {autoClose: 4000})
            const paymentDetails = {paymentMethod: 'wallet', paymentStatus: 'completed', transactionId: response.data.transactionId}
            dispatch( createOrder({orderDetails: {...orderDetails, paymentDetails}}) ) 
          }
        }
        catch(error){
          sonnerToast.error(error.message, {duration: 4000})
          setIsPaymentFailedModalOpen({status: true, msg: 'Network Error'})
          setIsLoading(false)
        }
      }
      else{
        dispatch( createOrder({orderDetails}) ) 
      }
    }
    catch(error){
      setIsLoading(false)
      console.log('Error in placeOrder:', error.response.data?.message || error.message)
      if (error.response && error.response.status !== 500){
        sonnerToast.error(error.response.data?.message || error.message, {duration: 4000})
      }else{
        toast.error('Something went wrong.', {autoClose: 4000})
      }
    }
  }

  const handleRazorpayVerification = async (data) => {
    let res = null
    try{
      res = await axios.get(`${baseApiUrl}/payment/razorpay/key`, { withCredentials: true })
    }catch(error){
      console.log(error)
      setIsPaymentFailedModalOpen({status: true, msg: "Internal Server Error. Please try again later!"})
    }
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
            setIsPaymentFailedModalOpen({status: true, msg: "You closed the Razorpay gateway!"})
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
                    setIsLoading(true)
                    sonnerToast.success(verifiedData.data.message, {duration: 4000})
                    dispatch( createOrder({
                      orderDetails: {
                        ...orderDetails, 
                        paymentDetails: {paymentMethod: 'razorpay', transactionId: response.razorpay_payment_id, paymentStatus: 'completed'}
                      }
                    }) ) 
                }else{
                    toast.error('Payment Failed! Try again later!', {autoClose: 4000})
                    setIsPaymentFailedModalOpen({status: true, msg: "Payment Failed! Try again later!"})
                }
            } catch (error) {
                console.log(error)
                setIsPaymentFailedModalOpen({status: true, msg: "Unexpected error, Please try again!"})
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
  setIsLoading(true)
  sonnerToast.success("Payment Successfull!", {duration: 4000})
  const paymentMethod = paymentGateway
  dispatch( createOrder({
    orderDetails: {
      ...orderDetails, 
      paymentDetails: {paymentMethod, transactionId: paymentId, paymentStatus: 'completed'}
    }
  }) ) 
}

const handleRetryCheckout = ()=> {
  sonnerToast.info("Retrying to place the order..")
  console.log("Inside handleRetryCheckout()...")
  sourceItAgainAndOrder()
}

const handleRetryPayment = ()=> {
  console.log('Retrying Payment....')
  sonnerToast.info("Retrying Payment..")
  if(paymentMethod === 'cards'){
    setRetryStripePaymentStatus(true)
  }
  else if(paymentMethod === 'paypal'){
    setIsPaymentFailedModalOpen({status: false, msg: null})
  }
  else{
    placeOrder()
  } 
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
                                        onIncQuantity={addQuantity}
                                        onDecQuantity={lessenQuantity}
                                        orderReviewError={orderReviewError} 
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
                                        setDeliverAddressMade={setDeliverAddressMade}
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
                                      retryStripePaymentStatus={retryStripePaymentStatus} 
                                      setRetryStripePaymentStatus={setRetryStripePaymentStatus}
                                      onPaymentError={(msg)=> setIsPaymentFailedModalOpen({status: true, msg})}
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
                                  placeOrder={sourceItAgainAndOrder}
                                  onPaymentError={(msg)=> setIsPaymentFailedModalOpen({status: true, msg})}
                                  isLoading={isLoading}
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

              {
                isCheckoutPauseModalOpen && checkoutBlockedProducts &&
                  <CheckoutPausedModal
                    isOpen={isCheckoutPauseModalOpen}
                    onClose={()=> setIsCheckoutPauseModalOpen(false)}
                    products={checkoutBlockedProducts}
                    onDecQuantity={lessenQuantity}
                    onRemoveProduct={removeProduct}
                    onRetryCheckout={handleRetryCheckout}
                  />
              }
              
              {
                isPaymentFailedModalOpen.status &&
                  <PaymentFailedModal
                    isOpen={isPaymentFailedModalOpen.status} 
                    message={isPaymentFailedModalOpen.msg}
                    onClose={()=> setIsPaymentFailedModalOpen({status: false, msg: null})}
                    onRetry={handleRetryPayment}
                    paymentMethod={paymentMethod} 
                    onContactSupport={()=> setOpenChatBox(true)}
                  />
              }

              {
                  openChatBox &&
                  <div className="fixed bottom-[2rem] right-[2rem] z-50">
                
                      <TextChatBox 
                        closeable={true} 
                        openChats={true}
                        onCloseChat={()=> setOpenChatBox(false)}
                      />
                        
                  </div>
              }

            </main>

            <FeaturesDisplay />
            
            <Footer />

        </section>
    )
} 