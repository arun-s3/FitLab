import React, {useState, useEffect} from 'react'
import './CheckoutPage.css'
import {useNavigate, Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {motion} from 'framer-motion'

import {toast} from 'react-toastify'
import {toast as sonnerToast} from 'sonner'
import apiClient from '../../../Api/apiClient'

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
import {getTheCart, addToCart, reduceFromCart, removeFromCart, resetCartStates} from '../../../Slices/cartSlice'
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

    const {cart, productRemoved, error} = useSelector(state=> state.cart)
    const {addresses} = useSelector(state=> state.address)
    const {orderCreated, orderMessage, orderError} = useSelector(state=> state.order)

    const dispatch = useDispatch()
    const navigate = useNavigate()

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
        placeOrder()
        setOrderFreshSources(false)
      }
    }, [cart, orderFreshSources])

    useEffect(()=> {
      if(error){
        sonnerToast.error(error)
        dispatch(resetCartStates())
      }
    },[error])

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
        setOrderDetails(orderDetails=> {
          return {...orderDetails, shippingAddressId: shippingAddress._id}
        })
      }
    },[shippingAddress, paymentMethod])

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
    },[orderCreated, orderMessage, orderReviewError])

    useEffect(()=> {
      if(orderError){
          setIsLoading(false)
          toast.error(orderError, {autoClose: 3500})
          dispatch(resetOrderStates())
      }
    }, [orderError])

    useEffect(()=> {
      if(productRemoved){
        const unavailableProducts = cart.products.filter(product=> 
          !product.productId || product.productId.isBlocked || product.productId.stock < product.quantity
        )
        setCheckoutBlockedProducts(unavailableProducts)
        dispatch(resetOrderStates())
        dispatch(resetCartStates())
      }
    }, [productRemoved])

    const headerBg = {
        backgroundImage: "url('/Images/header-bg.png')",
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
      dispatch( addToCart({productId: id, quantity}) )
    }
    
    const lessenQuantity = (id, quantity, currentQuantity)=> {
      if(currentQuantity > 1){
        dispatch( reduceFromCart({productId: id, quantity}) )
      }else{
        setOrderReviewError('There must be atleast 1 item to ship!')
      }
    }

    const removeProduct = (id)=> {
        dispatch(removeFromCart({productId: id}))
    }

    const radioClickHandler = (e, type, value)=>{
      const checkStatus = type==='address' ? (shippingAddress === value) : (paymentMethod === value)
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
      const today = new Date().toISOString().split("T")[0]

      const latestTodayAddress = addresses
        .filter(addr=> addr?.createdAt && new Date(addr.createdAt).toISOString().split("T")[0] === today)
        .sort((a, b)=> new Date(b.createdAt) - new Date(a.createdAt)) 

      if(latestTodayAddress && latestTodayAddress.length > 0){
        const newlyCreatedAddress = latestTodayAddress[0]
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
            const response = await apiClient.post(`/payment/razorpay/order`, {amount: cart.absoluteTotalWithTaxes.toFixed(2)})
            if(response?.data){
                handleRazorpayVerification(response.data.data)
            }
        }
        catch(error){
          setIsPaymentFailedModalOpen({status: true, msg: 'Network Error'})
        }
        finally{
            setIsLoading(false)
        }
      }
      else if(paymentMethod === 'wallet'){
        try{  
           const response = await apiClient.post(`/wallet/order`, {amount: cart.absoluteTotalWithTaxes.toFixed(2)})
          if(response?.data.transactionId){ 
            sonnerToast.success("Payment via Wallet successfull!", {autoClose: 4000})
            const paymentDetails = {paymentMethod: 'wallet', paymentStatus: 'completed', transactionId: response.data.transactionId}
            dispatch( createOrder({orderDetails: {...orderDetails, paymentDetails}}) ) 
          }
        }
        catch(error){
          sonnerToast.error(error.message, {duration: 4000})
          setIsPaymentFailedModalOpen({status: true, msg: 'Network Error'})
        }
        finally{
            setIsLoading(false)
        }
      }
      else{
        dispatch( createOrder({orderDetails}) ) 
      }
    }
    catch(error){
      setIsLoading(false)
      if (!error.response) {
        sonnerToast.error("Network error. Please check your internet.")
      }else if (error.response && error.response.status !== 500){
        sonnerToast.error(error.response.data?.message || error.message, {duration: 4000})
      }else{
        toast.error('Internal server error!', {autoClose: 4000})
      }
    }
  }

  const handleRazorpayVerification = async (data) => {
    let res = null
    try{
      res = await apiClient.get(`/payment/razorpay/key`)
    }catch(error){
      setIsPaymentFailedModalOpen({status: true, msg: "Internal Server Error. Please try again later!"})
    }
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
            try {
                const verifiedData = await apiClient.post(`/payment/razorpay/verify`, {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    amount: data.amount
                })
                if (verifiedData?.data?.message.toLowerCase().includes('success')) {
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
                console.error(error)
                if (!error.response) {
                    sonnerToast.error("Network error. Please check your internet.")
                }
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
  sourceItAgainAndOrder()
}

const handleRetryPayment = ()=> {
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
                
                <Header currentPageChatBoxStatus={openChatBox}/>
                
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