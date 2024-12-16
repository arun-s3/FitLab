import React, { useState } from 'react';

import { Trash2, Plus, Minus, Star, ChevronLeft, ChevronRight} from 'lucide-react';

import Header from '../../../Components/Header/Header'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import {SiteSecondaryFillButton} from '../../../Components/SiteButtons/SiteButtons'
import {addToCart, resetCartStates} from '../../../Slices/cartSlice'
import {CustomHashLoader, CustomScaleLoader} from '../../../Components/Loader//Loader'
import Footer from '../../../Components/Footer/Footer'

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Cosco Biceps Curler',
      sku: 'CTG 65',
      price: 45300,
      quantity: 2,
      image: '/placeholder.svg?height=100&width=100'
    },
    {
      id: 2,
      name: 'Cosco Incline Chest Press',
      sku: 'CTG 15',
      price: 57300,
      quantity: 1,
      image: '/placeholder.svg?height=100&width=100'
    }
  ]);

  const [couponCode, setCouponCode] = useState('')
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

 const headerBg = {
    backgroundImage: "url('/header-bg.png')",
    backgrounSize: 'cover'
    }

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
  ];

  const handlePrevProduct = () => {
    setCurrentProductIndex((prevIndex) => 
      prevIndex === 0 ? similarProducts.length - 1 : prevIndex - 1
    );
  };

  const handleNextProduct = () => {
    setCurrentProductIndex((prevIndex) => 
      prevIndex === similarProducts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const updateQuantity = (id, change) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0;
  const tax = 5000;
  const gst = subtotal * 0.10;
  const total = subtotal + shipping + tax + gst;


  return (
        <section id='ProductDetailPage'>
            <header style={headerBg}>
    
                <Header />
    
            </header>
    
            <BreadcrumbBar heading='Shopping Cart'/>

            <main>
            <div className="max-w-[87.5rem] mx-auto px-[1rem] py-[3rem]">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-[3rem]">
        <div className="flex items-center space-x-[1rem]">
          {['Shopping cart', 'Checkout details', 'Order complete'].map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex items-center">
                <div className={`w-[2rem] h-[2rem] rounded-full flex items-center justify-center text-[14px] ${index === 0 ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {index + 1}
                </div>
                <span className={`ml-[8px] ${index === 0 ? 'font-medium' : 'text-gray-500'}`}>{step}</span>
              </div>
              {index < 2 && (
                <div className="w-[4rem] h-[2px] bg-gray-300"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[2rem]">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-[#2D2D2D] text-white grid grid-cols-4 p-[1rem] rounded-t-[8px]">
            <div>ITEMS</div>
            <div className="text-center">PRICE</div>
            <div className="text-center">QTY</div>
            <div className="text-center">SUBTOTAL</div>
          </div>

          <div className="border rounded-b-[8px]">
            {cartItems.map(item => (
              <div key={item.id} className="grid grid-cols-4 items-center p-[1rem] border-b last:border-b-0">
                <div className="flex items-center space-x-[1rem]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-[6rem] h-[6rem] object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-[14px] text-gray-500">SKU: {item.sku}</p>
                  </div>
                </div>
                <div className="text-center">₹{item.price.toLocaleString()}</div>
                <div className="flex items-center justify-center space-x-[8px]">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-[4px] hover:bg-gray-100 rounded"
                  >
                    <Minus className="w-[16px] h-[16px]" />
                  </button>
                  <span className="w-[2rem] text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-[4px] hover:bg-gray-100 rounded"
                  >
                    <Plus className="w-[16px] h-[16px]" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-center flex-1">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-[20px] h-[20px]" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Coupon Section */}
          <div className="mt-[2rem]">
            <h3 className="font-medium mb-[8px]">Have a coupon?</h3>
            <p className="text-[14px] text-gray-500 mb-[8px]">Add your code for an instant cart discount</p>
            <div className="flex space-x-[8px]">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon Code"
                className="flex-1 p-[8px] border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="px-[1.5rem] py-[8px] text-purple-600 font-medium">
                Apply
              </button>
            </div>
          </div>        
        </div>

        {/* Order Summary */}
        <div className="bg-[#F8F1FF] rounded-[8px] p-[1.5rem]">
          <h2 className="text-[1.5rem] font-bold mb-[1.5rem]">Order Summary</h2>
          <div className="space-y-[1rem]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{shipping}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (10%)</span>
              <span>₹{gst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold pt-[1rem] border-t">
              <span>Order Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
          <button className="w-full bg-[#E6FF00] text-black font-bold py-[12px] rounded-[8px] mt-[1.5rem] hover:bg-[#E6FF00]/90 transition-colors">
            Checkout
          </button>
        </div>
      </div>

      {/* Similar Products */}
      <div className="mt-[4rem]">
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
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto mb-[1rem]"
                />
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

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[2rem] mt-[4rem] bg-[#F8F1FF] p-[2rem] rounded-[8px]">
        <div className="text-center">
          <div className="w-[4rem] h-[4rem] bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-[1rem]">
            <svg className="w-[2rem] h-[2rem] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-bold mb-[8px]">Product Support</h3>
          <p className="text-[14px] text-gray-600">
            Up to 3 years on-site warranty available for your peace of mind.
          </p>
        </div>
        <div className="text-center">
          <div className="w-[4rem] h-[4rem] bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-[1rem]">
            <svg className="w-[2rem] h-[2rem] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="font-bold mb-[8px]">Personal Account</h3>
          <p className="text-[14px] text-gray-600">
            With big discounts, free delivery and a dedicated support specialist.
          </p>
        </div>
        <div className="text-center">
          <div className="w-[4rem] h-[4rem] bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-[1rem]">
            <svg className="w-[2rem] h-[2rem] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-bold mb-[8px]">Amazing Savings</h3>
          <p className="text-[14px] text-gray-600">
            Up to 70% off new Products, you can be sure of the best price.
          </p>
        </div>
      </div>
    </div>
            </main>

            <Footer/>

        </section>
    
  );
};

export default ShoppingCart;



