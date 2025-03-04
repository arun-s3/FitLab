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
import ProductRemovalModal from '../../../Components/ProductRemovalModal/ProductRemovalModal'
import {SiteSecondaryFillButton, SiteButtonSquare} from '../../../Components/SiteButtons/SiteButtons'
import {addToCart, removeFromCart, getTheCart, resetCartStates} from '../../../Slices/cartSlice'
import {getBestCoupon, resetCouponStates} from '../../../Slices/couponSlice'

import {CustomHashLoader, CustomScaleLoader} from '../../../Components/Loader//Loader'
import Footer from '../../../Components/Footer/Footer'

export default function ShoppingCartPage(){

  const [couponCode, setCouponCode] = useState('')
  const [currentProductIndex, setCurrentProductIndex] = useState(0)

  const [isProductRemovalModalOpen, setIsProductRemovalModalOpen] = useState(false)
  const [productToRemove, setProductToRemove] = useState({})

  // const [shipping, setShipping] = useState(0)
  // const [gst, setGst] = useState(0)
  // const [absoluteTotalWithTaxes, setAbsoluteTotalWithTaxes] = useState(0)

  const {cart, productAdded, productRemoved, loading, error, message, couponApplied} = useSelector(state=> state.cart)
  const {bestCoupon, couponMessage} = useSelector(state=> state.coupons)

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const headerBg = {
     backgroundImage: "url('/header-bg.png')",
     backgrounSize: 'cover'
  }

  useEffect(()=> {
    dispatch(getTheCart())
    if(!bestCoupon){
      console.log("Getting the best coupon...")
      dispatch(getBestCoupon())
    }
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

  useEffect(()=> {
    if(bestCoupon && couponApplied && couponMessage.includes('Best')){
      toast.success(couponMessage + ' and applied to the cart!')
      dispatch(resetCartStates())
    }
  },[couponApplied, bestCoupon])

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
    
  const removeFromTheCart = (id, name)=> {
    setProductToRemove({id, name})
    setIsProductRemovalModalOpen(true)
  }

  const confirmProductRemoval = ()=> {
    if(productToRemove !== null){
      dispatch(removeFromCart({productId: productToRemove.id}))
      setIsProductRemovalModalOpen(false)
      setProductToRemove({})
    }
  }

  const cancelProductRemoval = ()=> {
    setIsProductRemovalModalOpen(false)
    setProductToRemove({})
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
                    <button className="text-red-500 hover:text-red-700" onClick={()=> removeFromTheCart(product.productId, product.title)}>
                      <Trash2 className="w-[16px] h-[16px]" />
                    </button>

                      <ProductRemovalModal isOpen={isProductRemovalModalOpen} productToRemove={productToRemove} 
                        onConfirm={confirmProductRemoval} onCancel={cancelProductRemoval}/>

                  </div>
                </div>
              ))}
            </div>

            <CouponCodeInput couponCode={couponCode} setCouponCode={setCouponCode}/>
            
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

      <div className="mt-[2rem] mx-[3rem]">
        <h2 className="text-[1.5rem] font-bold mb-[2rem]">Similar Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[1.5rem] relative">
          {similarProducts.slice(currentProductIndex, currentProductIndex + 4).map((product) => (
            <div key={product.id} className="relative border rounded-[8px] overflow-hidden">
              {product.discount && (
                <span className="absolute top-[8px] left-[8px] bg-purple-600 text-white px-[8px] py-[4px] rounded-[4px] text-[14px]">
                  {product.discount}
                </span>
              )}
              <div className="p-[1rem]">
                <img src={product.image} alt={product.name} className="w-full h-auto mb-[1rem]" />
                <div className="flex items-center gap-[4px] mb-[8px]">
                  {Array.from({ length: product.rating }).map((_, i) => (
                    <Star key={i} className="w-[16px] h-[16px] fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="font-bold mt-[4px]">{product.price}</p>
              </div>
            </div>
          ))}
          <button
            className="absolute left-[-1rem] top-1/2 transform -translate-y-1/2 bg-white p-[8px] rounded-full shadow-md"
            onClick={handlePrevProduct}
          >
            <ChevronLeft className="w-[1.5rem] h-[1.5rem]" />
          </button>
          <button
            className="absolute right-[-1rem] top-1/2 transform -translate-y-1/2 bg-white p-[8px] rounded-full shadow-md"
            onClick={handleNextProduct}
          >
            <ChevronRight className="w-[1.5rem] h-[1.5rem]" />
          </button>
        </div>
      </div>

    </main>

    <FeaturesDisplay />

    <Footer/>

  </section>
    
  )
}





