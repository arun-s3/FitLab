import React, {useState, useEffect} from 'react'
import './CheckoutPage.css'
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import {Check, Plus, Minus, X, CreditCard, Lock, MapPin} from 'lucide-react'
import {BsFillCreditCard2BackFill} from "react-icons/bs"
import {SiRazorpay} from "react-icons/si"
import {IoWallet} from "react-icons/io5"
import {GiTakeMyMoney} from "react-icons/gi"
import {toast} from 'react-toastify'
import axios from 'axios'

import Header from '../../../Components/Header/Header'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import OrderStepper from '../../../Components/OrderStepper/OrderStepper'
import FeaturesDisplay from '../../../Components/FeaturesDisplay/FeaturesDisplay'
import StripePayment from './StripePayment'
import PaypalPayment from './PayPalPayment'
// import StripeCheckout from './StripePayment'
// import CardPayment from './CardPayment'
import Footer from '../../../Components/Footer/Footer'
import {addToCart, reduceFromCart, removeFromCart, getTheCart, resetCartStates} from '../../../Slices/cartSlice'
import {createOrder, resetOrderStates} from '../../../Slices/orderSlice'
import {getAllAddress} from '../../../Slices/addressSlice'
import {SiteButtonSquare, SiteSecondaryFillImpButton} from '../../../Components/SiteButtons/SiteButtons'
import {camelToCapitalizedWords, capitalizeFirstLetter, convertToCamelCase} from '../../../Utils/helperFunctions'


export default function CheckoutPage(){
    
    const [currentProductIndex, setCurrentProductIndex] = useState(0)

    const [shippingAddress, setShippingAddress] = useState({})

    const [paymentMethod, setPaymentMethod] = useState('')

    const [cardsEnterError, setCardsEnterError] = useState('')

    const [couponCode, setCouponCode] = useState('')
    const [appliedDiscount, setAppliedDiscount] = useState('')
    const [discountAmount, setDiscountAmount] = useState(0)
    const [isCouponFocused, setIsCouponFocused] = useState(false)

    const [orderDetails, setOrderDetails] = useState({})

    const [orderReviewError, setOrderReviewError] = useState('')

    const {cart, productAdded, productRemoved, loading, error, message} = useSelector(state=> state.cart)
    const {addresses} = useSelector(state=> state.address)
    const {orders, orderCreated, orderMessage, orderError} = useSelector(state=> state.order)
    const dispatch = useDispatch()

    const navigate = useNavigate()

    // useEffect(()=> {
    //   dispatch(getTheCart())
    //   dispatch(getAllAddress())

    //   const script = document.createElement("script")
    //   script.src = "https://checkout.razorpay.com/v1/checkout.js";
    //   script.async = true
    //   document.body.appendChild(script)
    // },[])

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
        navigate('/order-confirm')
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

    const paymentOptions = [
      {
        name: 'razorpay',
        icon: './razorpay.png'
      },
      {
        name: 'wallet',
        icon: '/wallet.png'
      },
      {
        name: 'paypal',
        icon: '/paypal.png'
      },
      {
        name: 'cashOnDelivery',
        icon: '/cod.png'
      },
      {
        name: 'cards',
        icon: '/card3.png',
      }
    ]

    const goToProductDetailPage = async(id)=> {
      try {
        console.log("Inside goToProductDetailPage")
        const response = await axios.get(`http://localhost:3000/products/${id}`, { withCredentials: true })
        console.log("Response from /products/:id", response.data[0])
        const product = response.data[0]
        console.log("Product received-->", product)
        if(product) navigate('/shop/product', {state: {product}})
      }catch(error){
        console.error("Error in goToProductDetailPage -->", error.message)
      }
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
        
    const removeFromTheCart = (id) => {
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

    
    const handleApplyDiscount = () => {
      setOrderDetails(orderDetails=> {
        return {...orderDetails, couponCode}
      })
    }

  const checkoutHandler= async()=> {
    try{
      console.log("Inside checkoutHandler")
      if(paymentMethod === ''){
        toast.error('Please select a payment Method!')
        return
      }
      if(Object.keys(shippingAddress) === 0){
        toast.error('Please select a delivery address!')
        return
      }
      if(paymentMethod === 'razorpay'){
        const response = await axios.post(`http://localhost:3000/payment/razorpay/order`,
          {amount: cart.absoluteTotalWithTaxes.toFixed(2)}, { withCredentials: true }
        )
        // const data = await response.json()
        console.log("razorpay created order--->", response.data.data)
        handleRazorpayVerification(response.data.data)
      }
      else if(paymentMethod === 'card'){

      }
      else{
        dispatch( createOrder({orderDetails}) ) 
      }
    }
    catch(error){
      console.log('Error in checkoutHandler:', error.message)
    }
  }

  const handleRazorpayVerification = async (data) => {
    const res = await axios.get('http://localhost:3000/payment/razorpay/key', { withCredentials: true })
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
                const verifiedData = await axios.post('http://localhost:3000/payment/razorpay/verify', {
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
            <header style={headerBg}>
                
                <Header />
                
            </header>
                
            <BreadcrumbBar heading='Checkout Details'/>
            
            <main className='mb-[7rem]'>
                <div className='my-[4rem]'>

                  <OrderStepper stepNumber={2}/>

                </div>
                <div className='px-[2rem] flex items-center gap-[2rem]'>
                    <div className='basis-[70%]'>
                        <div className='flex flex-col gap-[20px]'>
                            <div id='checkout-step'>
                                <div className='checkout-step-header'>
                                    <h4> 01 </h4>
                                    <h2> Review Your Orders </h2>
                                </div>
                                <div className='mt-[30px] grid grid-cols-2 gap-x-[3rem] gap-y-[1rem]'>

                                  {cart.products &&
                                  cart.products.map((product) => (
                                  <div key={product.productId}>
                                    <div className="flex cursor-pointer">
                                      <img src={product.thumbnail} alt={product.title} className="w-20 h-20 object-cover rounded"
                                        onClick={()=> goToProductDetailPage(product.productId)}/>
                                      <div className="flex-1 flex flex-col justify-between ml-4">
                                        <div className="flex justify-between">
                                          <div>
                                            <h3 className="text-[15px] font-[450] uppercase" onClick={()=> goToProductDetailPage(product.productId)}> 
                                              {!product.title.length > 22 ? product.title : product.title.slice(0,15) + '...'}
                                            </h3>
                                            {
                                              product?.weight? 
                                              <p className="text-sm text-[13px] text-gray-500">Weight: { product.weight }</p>
                                              : null
                                            }
                                          </div>
                                        </div>
                                        <div className="flex justify-between items-center gap-[30px] mt-2">
                                          <div className="flex items-center space-x-2">
                                            <button className="w-[20px] h-[20px] flex items-center justify-center
                                                 border-primaryDark border rounded" onClick={()=> lessenQuantity(product.productId._id, 1, product.quantity)}>
                                              <Minus size={14} className='text-primaryDark'/>
                                            </button>
                                            <span className="w-8 text-center text-[14px]">{product.quantity}</span>
                                            <button className="w-[20px] h-[20px] flex items-center justify-center border-primaryDark
                                                 border rounded" onClick={()=> addQuantity(product.productId._id, 1)}>
                                              <Plus size={14} className='text-primaryDark'/>
                                            </button>
                                          </div>
                                          <span className="text-[14px] font-[450] flex flex-col">
                                            <span className={`${ product?.offerApplied && 'line-through decoration-[1.6px] decoration-red-500'}`}>
                                              &#8377; {(product.price).toFixed(2)} 
                                            </span>
                                            { product?.offerApplied && product?.offerDiscount &&
                                              <span>
                                                ₹{(product.price - product.offerDiscount).toFixed(2)}
                                              </span>
                                            }
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <p className='mt-[5px] h-[5px] text-[10px] text-red-500 tracking-[0.3px]'> {orderReviewError} </p>
                                  </div>
                                  ))}
                                </div>

                            </div>
                            <div id='checkout-step' style={{paddingBottom: '1rem'}}>
                                <div className='checkout-step-header'>
                                    <h4> 02 </h4>
                                    <h2> Choose Your Delivery Address </h2>
                                </div>
                                <div>
                                <div className='mt-[30px] grid grid-cols-2 gap-x-[3rem] gap-y-[1rem]'>
                                {/* <div className='flex flex-col justify-center gap-[2rem] address-content'> */}
                                {
                                  [...addresses].sort((a, b)=> {
                                    if (b.defaultAddress && !a.defaultAddress){
                                      return 1
                                    }else if(a.defaultAddress && !b.defaultAddress){
                                      return -1
                                    }
                                    return 0
                                  }).map(address=> (
                                            <div key={address._id} id='checkout-address' className={`flex justify-between pl-[10px] py-[5px] rounded-[6px] 
                                                ${shippingAddress && (shippingAddress._id === address._id) ? 'outline outline-[2px] outline-primary outline-offset-2' : ''}`}
                                                    onClick={()=> setShippingAddress(address)}>
                                              <div className='flex gap-[5px]'>
                                                <input type='radio' onClick={(e)=> radioClickHandler(e, "address", address)}
                                                   onChange={(e)=> radioChangeHandler(e, "address", address)} checked={shippingAddress && shippingAddress._id === address._id}/>
                                                <address className='not-italic flex flex-col justify-center text-[12px] text-[#3C3D37] capitalize cursor-pointer'>
                                                      <span className='mb-[5px] flex items-center justify-between'>
                                                          <span className='px-[6px] w-fit text-[11px] text-white capitalize bg-secondary
                                                               rounded-[5px] '>
                                                                  {address.type}
                                                          </span>
                                                          {address.defaultAddress &&
                                                              <span className='flex items-center'>
                                                                  <Check className='px-[1px] h-[15px] w-[15px] text-white bg-primary rounded-[10px]'/>
                                                                  <span className='ml-[-7px] pl-[12px] pr-[15px] text-[11px] text-[rgb(239, 68, 68)]
                                                                     text-primaryDark font-[550] tracking-[0.2px] rounded-[6px] z-[-1]'>
                                                                      Default 
                                                                  </span>
                                                              </span> 
                                                          }
                                                      </span>
                                                      <span className='flex items-center gap-[2px]'> 
                                                          <span>
                                                              {address.firstName + ' ' + address.lastName} 
                                                          </span>
                                                          {
                                                              address.nickName && 
                                                                  <span className='ml-[1px] text-muted text-[12px] tracking-[0.2px]'>
                                                                      {`(${address.nickName})`}
                                                                  </span>
                                                          }
                                                      </span>
                                                      <span> {address.street} </span>
                                                      <span> {address.district} </span>
                                                      <span> {address.state} </span>
                                                      <span> {address.pincode} </span>
                                                      {/* <span> {address._id} </span> */}
                                                      {
                                                          address.landmark &&
                                                              <span> {`(${address.landmark})`} </span>
                                                      }
                                                      <span className='inner-fields'>
                                                          <span className='field-name'>
                                                              Mobile:
                                                          </span>
                                                          <span className='ml-[2px]'>
                                                              {address.mobile}
                                                          </span>
                                                      </span>
                                                      {
                                                          address.alternateMobile &&
                                                              <span className='inner-fields'>
                                                                  <span className='field-name'>
                                                                      Alternate Mobile:
                                                                  </span>
                                                                  <span className='ml-[2px]'>
                                                                      {address.alternateMobile}
                                                                  </span>
                                                              </span>
                                                      }
                                                      <span className='inner-fields'>
                                                          <span className='field-name'>
                                                              Email:
                                                          </span>
                                                          <span className='ml-[2px]'>
                                                              {address.email}
                                                          </span>
                                                      </span>
                                                      {
                                                          address.deliveryInstructions &&
                                                              <span className='inner-fields'>
                                                                  <span className='field-name'>
                                                                      Delivery Instructions:
                                                                  </span>
                                                                  <span className='ml-[2px]'>
                                                                      {address.deliveryInstructions}
                                                                  </span>
                                                              </span>
                                                      }
                                                  </address>
                                                </div>
                                            </div>
                                    ))
                                }
                                </div>
                                <p className='mt-[1rem] bottom-[10px] flex items-center gap-[10px] uppercase cursor-pointer'
                                    onClick={()=> navigate('/profile/addresses')}> 
                                  <Plus className='h-[22px] w-[22px] text-primaryDark'/>
                                  <span className='text-[12px] tracking-[0.5px] text-secondary' style={{wordSpacing: '1px'}}>
                                     Add New Address / Manage All Addresses 
                                  </span>
                                </p>
                                </div>
                            </div>
                            <div id='checkout-step' style={{borderBottom: '0'}}>
                                <div className='checkout-step-header'>
                                    <h4> 03 </h4>
                                    <h2> Choose Your Payment Method </h2>
                                </div>
                                <div className='mt-[30px] grid grid-cols-2 gap-x-[3rem] gap-y-[1rem]'>
                                {
                                  paymentOptions.map(option=> (
                                      <div className={`px-[15px] py-[10px] ${option.name === 'cards' ? 'col-span-2 w-[102%]' : 'w-[20rem]'}
                                         flex items-center justify-between flex-wrap rounded-[5px] cursor-pointer
                                           hover:border-primaryDark hover:bg-primaryLight
                                               ${paymentMethod === option.name ? 'border-2 border-primaryDark bg-primaryLight': 
                                                    'border border-mutedDashedSeperation'}`} id='checkout-payment-methods'
                                                        onClick={()=> setPaymentMethod(option.name)}>
                                        <div className='flex items-center gap-[10px]'>
                                          {/* <option.icon className='text-muted'/> */}
                                          <img src={option.icon} className='w-[20px] h-[20px]'/>
                                          <span className={`text-[15px] flex items-center 
                                              ${paymentMethod === option.name && 'text-secondary font-medium'}`}>
                                          { camelToCapitalizedWords(option.name) } 
                                          {
                                              option.name === 'cards' &&
                                              <span className='ml-[5px] mt-[1px] text-[12px] text-muted font-normal'> 
                                                  (All global cards accepted - Visa, Mastercard, American Express, Discover, JCB, etc)
                                              </span>
                                          }
                                          </span>
                                        </div>
                                        <input type='radio' className='border border-primaryDark cursor-pointer checked:bg-primaryDark' 
                                            onClick={(e)=> radioClickHandler(e, "paymentOption", option.name)} 
                                                onChange={(e)=> radioChangeHandler(e, "paymentOption", option.name)}
                                                    checked={paymentMethod === option.name}/>
                                        {
                                          option.name === 'cards' &&
                                            <div className='relative w-full'>
                                                <p className='absolute top-[5px] text-[10px] text-red-500 font-medium tracking-[0.3px] z-[30]'>
                                                  {cardsEnterError && cardsEnterError} 
                                                </p>

                                                {
                                                  cart && cart?.absoluteTotalWithTaxes &&
                                                  <StripePayment amount={cart.absoluteTotalWithTaxes.toFixed(2)} 
                                                    onPayment={(id)=> handleStripeOrPaypalPayment('stripe', id)}/>
                                                }

                                               {
                                                 paymentMethod !== 'cards' &&
                                                 <div className='absolute top-[1.5rem] left-[1.5rem] right-[1.5rem] bottom-[1.5rem]
                                                   cursor-not-allowed z-[10]' 
                                                    style={{background: 'rgba(255,255,255,0.3)'}} 
                                                      onMouseEnter={()=> setCardsEnterError("Please select the cards' radiobutton first!")}
                                                        onMouseLeave={()=> setCardsEnterError('')}/>
                                               }
                                            </div>
                                        }
                                      </div>
                                  ))
                                }
                                </div>
                            </div>
                        </div>
                    </div>
                   {
                    cart?.products &&
                    <div className='self-baseline mt-[-20px]'>
                    <div id='checkout-payment' className="w-[400px] bg-white rounded-lg shadow-lg p-6" style={{boxShadow: '2px 2px 25px rgba(0,0,0,0.1)'}}>
                        <h2 className="text-[20px ] text-secondary font-[650] tracking-[0.5px] mb-6">ORDER SUMMARY</h2>

                        <div className="mb-6 p-4 border border-primary rounded-lg">
                          <div className="flex items-center mb-2">
                            <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                            <h3 className="font-semibold text-[16px]">Delivery Address</h3>
                          </div>
                          {
                            shippingAddress &&
                            <div className="text-[14px] text-gray-700 capitalize">
                            <p>{shippingAddress.firstName + ' ' + shippingAddress.lastName}</p>
                            <p>{shippingAddress.street}</p>
                            <p>{shippingAddress.district}, {shippingAddress.state}</p>
                            <p>{shippingAddress.pincode}</p>
                            <p>{shippingAddress?.landmark ? shippingAddress.landmark : null}</p>
                          </div>
                          }
                        </div>

                        {
                          !cart.couponDiscount &&
                          <div className="mb-4 relative">
                          <label htmlFor="couponCode" 
                            className={`absolute ${isCouponFocused || couponCode ? '-top-2 left-2 px-1 bg-white text-xs' : 'top-2 left-2 text-gray-500'} 
                              transition-all duration-200 pointer-events-none`}>
                            Coupon code
                          </label>
                          <div className="flex items-center">
                            <input type="text" id="couponCode" value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
                                onFocus={(e)=> setIsCouponFocused(true)} onBlur={() => setIsCouponFocused(false)}
                                    className="flex-1 p-2 border border-[#e5e7eb] border-r-0 rounded-l-md focus:border-primary focus:outline-none
                                         focus:ring-0 focus:ring-primary caret-primaryDark"/>
                            <button className={`text-orange-500 px-4 py-[0.55rem] border border-l-0 rounded-r-md ${isCouponFocused ? 'border-primary' : ''}
                               hover:text-orange-600 transition-colors`}
                              onClick={handleApplyDiscount}>
                              Apply
                            </button>
                          </div>
                        </div>
                        }

                        {appliedDiscount && (
                          <div className="flex justify-between items-center mb-4 text-sm">
                            <div className="flex-1">
                              <p className="text-gray-600">Discount</p>
                              <p className="text-gray-500">{appliedDiscount}</p>
                            </div>
                            <span className="text-red-500">-{discountAmount.toFixed(2)}</span>
                          </div>
                        )}

                        <div className="space-y-2 text-sm border-t pt-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600"> Subtotal </span>
                            <span> ₹{cart.absoluteTotal.toFixed(2)} </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600"> Shipping Cost </span>
                            <span> {cart.deliveryCharge === 0 ? 'Free' : `₹${cart.deliveryCharge}`} </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600"> GST </span>
                            <span> {cart.deliveryCharge === 0 ? 'Free' : `₹${cart.gst}`} </span>
                          </div>
                          {
                            cart?.couponDiscount ?
                            <div className="flex justify-between !mt-[2rem]">
                              <span className="text-green-600"> Coupon Discount </span>
                              <span className='flex items-center gap-[5px]'>
                                <Minus className='w-[13px]'/> ₹{cart.couponDiscount.toFixed(2)}
                              </span>
                            </div> : null
                          }
                          <div className="flex justify-between text-lg font-bold pt-2">
                            <span> Total </span>
                            <span> ₹{cart.absoluteTotalWithTaxes.toFixed(2)} </span>
                          </div>
                        </div>
                      
                          {
                            paymentMethod !== 'paypal' ?
                            <SiteSecondaryFillImpButton className={`px-[50px] py-[9px] rounded-[7px] 
                              ${paymentMethod === 'cards' && 'hidden'}`} clickHandler={()=> checkoutHandler()}>
                                {
                                  paymentMethod === 'cashOnDelivery' || paymentMethod === '' ? 'Place Order' : 'Pay and Place Order'
                                }
                            </SiteSecondaryFillImpButton>
                            :
                            (cart && cart?.absoluteTotalWithTaxes) ?

                            <div className='mt-[1rem]'>

                                <PaypalPayment amount={cart.absoluteTotalWithTaxes.toFixed(2)} 
                                    onPayment={(id)=> handleStripeOrPaypalPayment('paypal', id)} />

                            </div>
                            :null
                          }

                    </div>

                    </div>
                   }
                </div>

            </main>

            <FeaturesDisplay />
            
            <Footer />

        </section>
    )
}