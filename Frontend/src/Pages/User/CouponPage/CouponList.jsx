import React, {useState} from "react"
import './CouponPage.css'
import {useSelector} from 'react-redux'
import {motion, AnimatePresence} from "framer-motion"

import {IndianRupee, BadgeIndianRupee, ShoppingBag, Truck, Calendar, ShoppingCart, User, PercentCircle, Tag} from "lucide-react"
import {TbRosetteDiscountCheck} from "react-icons/tb"
import {format} from "date-fns"


export default function CouponList({coupons, onCouponApply}){
  
  const [showItemsOf, setShowItemsOf] = useState({})
  const {cart} = useSelector(state=> state.cart)

  const discounTypeIcons = [
    {name:'percentage', Icon: PercentCircle}, 
    {name:'fixed', Icon: BadgeIndianRupee}, 
    {name:'buyOneGetOne', Icon: ShoppingBag},
    {name:'freeShipping', Icon: Truck}
  ]

  return (
    <div className="mr-8 xx-md:mr-auto grid grid-cols-1 xx-md:grid-cols-2 x-xl:grid-cols-3 gap-6">
      {coupons.map((coupon, index) => (
        <motion.div 
          key={coupon._id} 
          className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: index * 0.1, duration: 0.4, ease: "easeOut"}}
          whileHover={{scale: 1.02}}
        >
          <div className="p-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <h2 className="flex items-center gap-[5px] text-lg font-bold">
                {coupon.code} 
                {(cart?.couponUsed  === coupon._id || cart?.couponUsed?._id === coupon._id ) &&
                  <span className="ml-[5px] text-[15px] text-primaryDark"> (Applied) </span>
                }
              </h2>
              <span className="px-[10px] py-[5px] bg-purple-100 text-secondary text-xs font-semibold rounded-full flex items-center">
                {(()=>{
                  const Icon = discounTypeIcons.find(type=> type.name === coupon.discountType).Icon
                  return (<Icon className="mr-1 w-4 h-4 text-secondary" />)
                })()}
                {coupon.discountType === 'percentage' 
                  ? coupon.discountValue + '%' + ' OFF'
                  : coupon.discountType === 'fixed' 
                    ? '₹' + coupon.discountValue + ' OFF'
                    : coupon.discountValue
                } 
              </span>
            </div>
          </div>
          <div className="p-4 flex-grow">
            <p className="text-sm text-gray-600 mb-4">{coupon.description}</p>
            <div className="space-y-2 text-sm">
              {coupon.minimumOrderValue &&
                <p className="flex items-center">
                  <ShoppingCart className="w-4 h-4 mr-2 text-gray-400" />
                  Min. Order: <span className="ml-[5px]"> ₹{coupon.minimumOrderValue} </span>
                </p>
              }
              {coupon.maxDiscount &&
                <p className="flex items-center">
                  <IndianRupee className="w-4 h-4 mr-2 text-gray-400" />
                  Max Discount: <span className="ml-[5px]"> ₹{coupon.maxDiscount} </span>
                </p>
              }
              <p className="flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-400" />
                Usage Limit: <span className="ml-[5px]"> {coupon.usageLimitPerCustomer} </span>
              </p>
              <p className='flex items-center'>
                <TbRosetteDiscountCheck className="w-4 h-4 mr-2 text-gray-400" />
                Used Count: 
                <span className={`ml-[5px] ${coupon.usedCount < coupon.usageLimitPerCustomer ? 'text-green-500' : 'text-red-500'}`}> 
                  {coupon.usedCount < coupon.usageLimitPerCustomer ? coupon.usedCount : 'Exhausted'}
                </span>
              </p>
              <p className="relative flex items-center">
                <Tag className="w-4 h-4 mr-2 text-gray-400" />
                Appicable for: 
                <span className="ml-[5px]">
                  {coupon.applicableType === 'allProducts' ? 'All' 
                    :  coupon.applicableType === 'products' ? 'Products -'  : 'Categories -'
                  } &nbsp;
                </span>
                <span 
                  className={`text-[13px] text-secondary hover:underline transition duration-300 ease-in cursor-pointer
                    ${coupon.applicableType === 'allProducts' && 'hidden'}`}
                  onMouseEnter={()=> setShowItemsOf({
                    type: (coupon.applicableType === 'products' ? 'applicableProducts' : 'applicableCategories'),
                    code: coupon.code
                  })} 
                  onMouseLeave={()=> setShowItemsOf({})}
                >
                  { coupon.applicableType !== 'allProducts' ? ' show' : null }
                </span>

                <AnimatePresence>
                  {showItemsOf.code === coupon.code && (
                    <motion.ul
                      key="dropdown"
                      initial={{opacity: 0, scale: 0.9, y: 10}}
                      animate={{opacity: 1, scale: 1, y: 0}}
                      exit={{opacity: 0, scale: 0.9, y: 10}}
                      transition={{duration: 0.2}}
                      className={`absolute bottom-[100%] left-[50%] py-[10px] px-[22px] list-disc bg-white 
                        ${coupon[showItemsOf.type].length > 6 ? "h-[10rem] overflow-y-scroll" : "h-fit"} border
                        border-dropdownBorder rounded-[4px] z-[10]`}
                    >
                      {coupon[showItemsOf.type].map((categoryOrProduct) => (
                        <li key={categoryOrProduct._id} className="capitalize text-muted">
                          {(()=>{
                            const name = showItemsOf.type === 'applicableProducts' ? categoryOrProduct.title : categoryOrProduct.name
                            return (name.length > 17 ? name.slice(0, 15) + '...' : name)
                          })()}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </p>
              <p className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                Expires: <span className="ml-[5px]"> {format(new Date(coupon.endDate), "MMM dd, yyyy")} </span>
              </p>
            </div>
          </div>
          <div className="p-4 bg-gray-50">
            <motion.button 
              whileTap={{scale: 0.95}} 
              whileHover={{scale: 1.02}}
              transition={{duration: 0.2}}
              className={`w-full text-white py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2
                focus:ring-secondary focus:ring-offset-2
                ${(cart?.couponUsed  === coupon._id || cart?.couponUsed?._id === coupon._id )
                  ? 'bg-purple-800 hover:bg-purple-900' 
                  : 'bg-secondary hover:bg-purple-700'} `}
              onClick={()=> onCouponApply(coupon)}
            >
              {(cart?.couponUsed  === coupon._id || cart?.couponUsed?._id === coupon._id ) ? 'Ignore' : 'Apply Coupon'}
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
