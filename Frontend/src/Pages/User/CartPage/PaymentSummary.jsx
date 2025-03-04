import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import {Minus, X} from 'lucide-react'

import RemoveCouponModal from './RemoveCouponModal'
import {removeCoupon} from '../../../Slices/cartSlice'
import {SiteButtonSquare} from '../../../Components/SiteButtons/SiteButtons'


export default function PaymentSummary({heading, absoluteTotal, absoluteTotalWithTaxes, deliveryCharge, couponDiscount, gst, couponCode}){


  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)

  const {cart} = useSelector(state=> state.cart)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const removeTheCoupon = ()=> {
    dispatch(removeCoupon())
  }


    return(
        <div className="h-fit  bg-whitesmoke rounded-[8px] p-[1.5rem] border border-dropdownBorder shadow-md" id='order-summary'>
            <h2 className="mb-[1.5rem] text-[20px] font-bold tracking-[0.5px]"> {heading} </h2>
            <div className="space-y-[1rem]">
              <div className="flex justify-between">
                <span className='order-title'> Subtotal </span>
                <span className='order-value tracking-[0.5px]'> ₹{absoluteTotal.toFixed(2).toLocaleString()} </span>
              </div>
              <div className="flex justify-between">
                <span className='order-title'>Shipping Cost</span>
                <span className='order-value'> ₹{deliveryCharge} </span>
              </div>
              <div className="flex justify-between">
                <span className='order-title'> GST (10%) </span>
                <span className='order-value'> ₹{gst} </span>
              </div>
              {
                couponDiscount && couponDiscount > 0 ?
                <div>
                  <div className="relative flex justify-between !mt-[2rem]">
                    <span className='order-title !text-green-500'> Coupon Discount </span>
                    <span className='order-value flex items-center gap-[5px]'>
                      <Minus className='w-[13px]'/> ₹{couponDiscount.toFixed(2)}
                    </span>
                    <X className='absolute top-[5px] right-[-19px] w-[15px] h-[15px] text-red-500 cursor-pointer'
                      onClick={()=> setIsRemoveModalOpen(true)}></X>
                  </div> 
                  <p className='mt-[-5px] text-[12px] !text-muted font-[450] uppercase'> { `( ${cart?.couponUsed?.code} )` } </p>
                </div>: null
              }

              <RemoveCouponModal isOpen={isRemoveModalOpen} onClose={()=> setIsRemoveModalOpen(false)} couponCode={cart?.couponUsed?.code}
                onConfirm={removeTheCoupon} />

              <div className="flex justify-between font-bold pt-[1rem] border-t border-dashed border-mutedDashedSeperation">
                <span> Order Total </span>
                <span> ₹{absoluteTotalWithTaxes} </span>
              </div>
            </div>
            {/* <button className="w-full bg-[#E6FF00] text-black font-bold py-[12px] rounded-[8px] mt-[1.5rem]
               hover:bg-[#E6FF00]/90 transition-colors">
              Checkout
            </button> */}
            <SiteButtonSquare tailwindClasses='mt-[1rem] w-full hover:bg-primaryDark transition-colors' 
              clickHandler={()=> navigate('/checkout')}>
                Checkout
            </SiteButtonSquare>
        </div>
    )
}