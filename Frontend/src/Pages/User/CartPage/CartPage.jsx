import React, {useEffect, useState} from 'react';
import './CartPage.css'
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import {Trash2, Plus, Minus, Star, ChevronLeft, ChevronRight, ShoppingCart} from 'lucide-react';
import {toast} from 'react-toastify'
import axios from 'axios'

import Header from '../../../Components/Header/Header'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import OrderStepper from '../../../Components/OrderStepper/OrderStepper'
import FeaturesDisplay from '../../../Components/FeaturesDisplay/FeaturesDisplay'
import PaymentSummary from './PaymentSummary'
import CouponCodeInput from './CouponCodeInput'
import {capitalizeFirstLetter} from '../../../Utils/helperFunctions'
import {SiteSecondaryFillButton, SiteButtonSquare} from '../../../Components/SiteButtons/SiteButtons'
import {addToCart, removeFromCart, getTheCart, resetCartStates} from '../../../Slices/cartSlice'
import {CustomHashLoader, CustomScaleLoader} from '../../../Components/Loader//Loader'
import Footer from '../../../Components/Footer/Footer'

export default function ShoppingCartPage(){

  const [couponCode, setCouponCode] = useState('')
  const [currentProductIndex, setCurrentProductIndex] = useState(0)

  // const [shipping, setShipping] = useState(0)
  // const [gst, setGst] = useState(0)
  // const [absoluteTotalWithTaxes, setAbsoluteTotalWithTaxes] = useState(0)

  const {cart, productAdded, productRemoved, loading, error, message, couponApplied} = useSelector(state=> state.cart)
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const headerBg = {
     backgroundImage: "url('/header-bg.png')",
     backgrounSize: 'cover'
  }

  useEffect(()=> {
    dispatch(getTheCart())
  },[])

  useEffect(()=> {
    if(cart){
      console.log("Cart---->", cart)
    }
  },[cart])

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

  // useEffect(()=> {
  //   if(coupon)
  // },[couponApplied])

  useEffect(()=> {
    if(error){
      console.log("Error-->", error)
      toast.error(error)
      dispatch(resetCartStates())
    }
  },[error])

  const similarProducts = [
    {
      id: 1,
      name: "Chest Biceps Curler",
      price: "Rs 45,500",
      image: "/placeholder.svg?height=200&width=200",
      rating: 5,
      discount: "-20%"
    },
    {
      id: 2,
      name: "PowerKettle Pro 30kg",
      price: "Rs 10,799",
      image: "/placeholder.svg?height=200&width=200",
      rating: 5
    },
    {
      id: 3,
      name: "45 Degree Leg Press",
      price: "Rs 83,900",
      image: "/placeholder.svg?height=200&width=200",
      rating: 5,
      discount: "-20%"
    },
    {
      id: 4,
      name: "CE 300G Lateral Raise",
      price: "Rs 67,000",
      image: "/placeholder.svg?height=200&width=200",
      rating: 5
    }
  ]

  const handlePrevProduct = () => {
    setCurrentProductIndex((prevIndex) => 
      prevIndex === 0 ? similarProducts.length - 1 : prevIndex - 1
    )
  }

  const handleNextProduct = () => {
    setCurrentProductIndex((prevIndex) => 
      prevIndex === similarProducts.length - 1 ? 0 : prevIndex + 1
    )
  }

  const updateQuantity = (id, newQuantity) => {
      dispatch( addToCart({productId: id, quantity: newQuantity}) )
  }
    
  const removeFromTheCart = (id) => {
      dispatch(removeFromCart({productId: id}))
  }


  return (
    <section id='ShoppingCartPage'>
      <header style={headerBg}>
    
        <Header />
    
      </header>
    
      <BreadcrumbBar heading='Shopping Cart'/>

      <main>
        <div className="max-w-[87.5rem] mx-auto px-[1rem] py-[3rem]">
          {cart?.products && cart.products.length > 0 ?
            <OrderStepper stepNumber={1}/>
          : null
          }

        {
          cart?.products && cart.products.length > 0 ?
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[2rem]" id='cart-main'>
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-muted text-[14px] font-[430] text-white grid grid-cols-4 p-[1rem] rounded-t-[8px]"> {/*bg-[#2D2D2D] */}
              <div>ITEMS</div>
              <div className="text-center">PRICE</div>
              <div className="text-center">QTY</div>
              <div className="text-center">SUBTOTAL</div>
            </div>

            <div className="border rounded-b-[8px]">
              {cart.products.map(product => (
                <div key={product.productId} className="grid grid-cols-4 items-center p-[1rem] border-b last:border-b-0">
                  <div className="flex items-center space-x-[1rem]">
                    <img src={product.thumbnail} alt={product.title} className="w-[6rem] h-[6rem] object-cover rounded"/>
                    <div>
                      <h3 className="text-[15px] text-secondary font-medium"> 
                        { !product.title.length > 22 ? product.title : product.title.slice(0,22) + '...'}
                      </h3>
                      {product?.category.length > 0 &&
                        <p className="text-[12px] text-mutedLight"> 
                          {'CATEGORY: '+ product.category.map(cat=> capitalizeFirstLetter(cat)).toString()} 
                        </p>
                      }  {/*{product.sku}*/}
                    </div>
                  </div>
                  <div className="text-center text-[15px] tracking-[0.3px]"> ₹{product.price.toLocaleString()} </div>
                  <div className="flex items-center justify-center space-x-[8px]">
                    <button className="p-[4px] bg-primary hover:bg-primaryDark rounded-[4px]" style={{boxShadow: '2px 2px 9px rgb(219, 214, 223)'}}
                        onClick={()=> updateQuantity(product.productId, -1)}>
                      <Minus className="w-[10px] h-[10px] text-secondary" />
                    </button>
                    <span className="w-[2rem] text-center text-[15px]"> {product.quantity} </span>
                    <button className="p-[4px] bg-primary hover:bg-primaryDark rounded-[4px]" style={{boxShadow: '2px 2px 9px rgb(219, 214, 223)'}}
                          onClick={() => updateQuantity(product.productId, 1)}>
                      <Plus className="w-[10px] h-[10px] text-secondary" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-center flex-1 text-[15px] tracking-[0.3px]">
                      ₹{(product.price * product.quantity).toLocaleString()}
                    </span>
                    <button className="text-red-500 hover:text-red-700" onClick={()=> removeFromTheCart(product.productId)}>
                      <Trash2 className="w-[16px] h-[16px]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <CouponCodeInput couponCode={couponCode} setCouponCode={setCouponCode} />
            
          </div>

          <PaymentSummary heading='Order Summary' absoluteTotal={cart.absoluteTotal} absoluteTotalWithTaxes={cart.absoluteTotalWithTaxes}
               deliveryCharge={cart.deliveryCharge} couponDiscount={cart?.couponDiscount} gst={cart.gst} couponCode={cart?.couponUsed?.code} />

        </div>
        : <div className='flex flex-col justify-center items-center gap-[1rem]'>
            <ShoppingCart className='h-[30px] w-[30px] text-muted'/>
            <h2 className='text-[17px] text-muted tracking-[0.5px]'> Your Cart Is Empty. 
              <span className='text-secondary cursor-pointer' onClick={()=> navigate('/shop')}> Click here </span> 
              to search for products
            </h2>
          </div>
        }

      </div>
    </main>

    <FeaturesDisplay />

    <Footer/>

  </section>
    
  )
}





