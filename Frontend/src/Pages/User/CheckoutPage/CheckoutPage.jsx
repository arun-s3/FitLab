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
import Footer from '../../../Components/Footer/Footer'
import {addToCart, removeFromCart, getTheCart, resetCartStates} from '../../../Slices/cartSlice'
import {createOrder, resetOrderStates} from '../../../Slices/orderSlice'
import {getAllAddress} from '../../../Slices/addressSlice'
import {SiteButtonSquare, SiteSecondaryFillImpButton} from '../../../Components/SiteButtons/SiteButtons'
import {camelToCapitalizedWords, capitalizeFirstLetter, convertToCamelCase} from '../../../Utils/helperFunctions'


export default function CheckoutPage(){
    
    const [currentProductIndex, setCurrentProductIndex] = useState(0)
  
    // const [shipping, setShipping] = useState(0)
    // const [gst, setGst] = useState(0)
    // const [absoluteTotalWithTaxes, setAbsoluteTotalWithTaxes] = useState(0)

    const [shippingAddress, setShippingAddress] = useState({})

    const [paymentMethod, setPaymentMethod] = useState('')

    const [couponCode, setCouponCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [isCouponFocused, setIsCouponFocused] = useState(false);

    const [orderDetails, setOrderDetails] = useState({})

    const {cart, productAdded, productRemoved, loading, error, message} = useSelector(state=> state.cart)
    const {addresses} = useSelector(state=> state.address)
    const {orders, orderCreated, orderMessage, orderError} = useSelector(state=> state.order)
    const dispatch = useDispatch()

    const navigate = useNavigate()

    useEffect(()=> {
      dispatch(getTheCart())
      dispatch(getAllAddress())
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
        navigate('/order-confirm')
        dispatch(resetOrderStates())
      }
    },[orderCreated, orderMessage, orderError])

    // useEffect(() => {
    //   async function loadCharges() {
    //     try {
    //       const response = await axios.post("http://localhost:3000/cart/calculate-charges", {absoluteTotal: cart.absoluteTotal, products: cart.products},
    //         { withCredentials: true }
    //       )
    //       console.log("Response from calculate-charges", response.data)
    //       const {deliveryCharges, gstCharge, absoluteTotalWithTaxes} = response.data.rates
  
    //       setShipping(deliveryCharges)
    //       setGst(gstCharge)
    //       setAbsoluteTotalWithTaxes(absoluteTotalWithTaxes)
    //     }catch(error){
    //       console.error("Error in loadCharges -->", error.message);
    //     }
    //   }
  
    //   if (cart.products.length > 0) {
    //     setAbsoluteTotalWithTaxes(cart.absoluteTotal)
    //     loadCharges()
    //   }
    // }, [cart])

    const headerBg = {
        backgroundImage: "url('/header-bg.png')",
        backgrounSize: 'cover'
    }

    const paymentOptions = [
      {
        name: 'razorpay',
        icon: SiRazorpay
      },
      {
        name: 'wallet',
        icon: IoWallet
      },
      {
        name: 'cashOnDelivery',
        icon: GiTakeMyMoney
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

    const updateQuantity = (id, newQuantity) => {
          dispatch( addToCart({productId: id, quantity: newQuantity}) ) 
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
      // if (couponCode === 'SPRING2021') {
      //   setAppliedDiscount(couponCode)
      //   setDiscountAmount(20.95)
      // } else {
      //   setAppliedDiscount('')
      //   setDiscountAmount(0)
      // }
  }

  const checkoutHandler= ()=> {
    dispatch( createOrder({orderDetails}) ) 
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
                                    {/* <div className='flex gap-[10px]'>
                                        <figure className='h-[100px] w-[100px] rounded-[5px]'>
                                            <img alt='' src='https://placehold.co/100x100' className='h-[100px] w-[100px] rounded-[5px]'/>
                                        </figure>
                                        <div className='flex flex-col justify-between'>
                                            <div>
                                                <h5 className='text-[15px] font-[500]'> Barbell M15 </h5>
                                                <h6 className='text-[10px] text-muted'> WEIGHT: 10kg </h6>
                                            </div>
                                            <p className='text-[10px] text-muted'> QTY: 2 </p>
                                        </div>
                                        <h5 className='self-end ml-[10px]'> &#8377;50000 </h5>
                                    </div> */}
                                    {/* <div className="space-y-4 mb-6"> */}
                                  {cart.products &&
                                  cart.products.map((product) => (
                                    <div key={product.productId} className="flex cursor-pointer">
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
                                          <button className="text-gray-400 hover:text-gray-600"
                                              onClick={() =>  removeFromTheCart(product.productId)}>
                                            <X size={16} className='text-secondary' />
                                          </button>
                                        </div>
                                        <div className="flex justify-between items-center gap-[30px] mt-2">
                                          <div className="flex items-center space-x-2">
                                            <button className="w-[20px] h-[20px] flex items-center justify-center
                                                 border-primaryDark border rounded" onClick={() => updateQuantity(product.productId, -1)}>
                                              <Minus size={14} className='text-primaryDark'/>
                                            </button>
                                            <span className="w-8 text-center text-[14px]">{product.quantity}</span>
                                            <button className="w-[20px] h-[20px] flex items-center justify-center border-primaryDark
                                                 border rounded" onClick={() => updateQuantity(product.productId, 1)}>
                                              <Plus size={14} className='text-primaryDark'/>
                                            </button>
                                          </div>
                                          <span className="text-[14px] font-[450]">
                                            &#8377; {(product.price * product.quantity).toFixed(2)}
                                          </span>
                                        </div>
                                      </div>
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
                                                   onChange={(e)=> radioChangeHandler(e, "address", address)} checked={shippingAddress._id === address._id}/>
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
                                      <div className={`px-[15px] py-[10px] w-[18rem] flex items-center justify-between
                                            rounded-[5px] cursor-pointer hover:border-primaryDark hover:bg-primaryLight
                                               ${paymentMethod === option.name ? 'border-2 border-primaryDark bg-primaryLight': 
                                                    'border border-mutedDashedSeperation'}`} id='checkout-payment-methods'
                                                        onClick={()=> setPaymentMethod(option.name)}>
                                        <div className='flex items-center gap-[10px]'>
                                          <option.icon className='text-muted'/>
                                          <span className='text-[15px]'> { camelToCapitalizedWords(option.name) } </span>
                                        </div>
                                        <input type='radio' className='border border-primaryDark cursor-pointer checked:bg-primaryDark' 
                                            onClick={(e)=> radioClickHandler(e, "paymentOption", option.name)} 
                                                onChange={(e)=> radioChangeHandler(e, "paymentOption", option.name)}
                                                    checked={paymentMethod === option.name}/>
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
                            cart?.couponDiscount &&
                            <div className="flex justify-between !mt-[2rem]">
                              <span className="text-green-600"> Coupon Discount </span>
                              <span className='flex items-center gap-[5px]'>
                                <Minus className='w-[13px]'/> ₹{cart.couponDiscount}
                              </span>
                            </div>
                          }
                          <div className="flex justify-between text-lg font-bold pt-2">
                            <span> Total </span>
                            <span> ₹{cart.absoluteTotalWithTaxes} </span>
                          </div>
                        </div>
                      
                        <SiteSecondaryFillImpButton className='px-[50px] py-[9px] rounded-[7px]' clickHandler={()=> checkoutHandler()}>
                          Place Order
                        </SiteSecondaryFillImpButton>
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