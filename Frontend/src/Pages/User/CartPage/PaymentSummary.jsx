import React, {forwardRef, useImperativeHandle, useState, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import {Minus, X} from 'lucide-react'
import axios from 'axios'

import RemoveCouponModal from './RemoveCouponModal'
import {removeCoupon} from '../../../Slices/cartSlice'
import {SiteButtonSquare} from '../../../Components/SiteButtons/SiteButtons'
import {CustomScaleLoader} from '../../../Components/Loader/Loader'
import { toast } from 'react-toastify'


const PaymentSummary = forwardRef((
  {heading, absoluteTotal, absoluteTotalWithTaxes, deliveryCharge, couponDiscount, gst, couponCode}, ref
)=> {


  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)

  const [otpPageLoading, setOtpPageLoading] = useState(false)

  const {cart} = useSelector(state=> state.cart)
  const {user} = useSelector(state=> state.user)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  const removeTheCoupon = ()=> {
    dispatch(removeCoupon())
  }

  const handleCheckout = useCallback( async ()=> {
    if(user.isVerified){
      console.log("Going to checkout page...")
      navigate('/checkout')
    }
    else{
      setOtpPageLoading(true)
      try{
        const response = await axios.post(`${baseApiUrl}/sendOtp`, {email: user.email}, {withCredentials:true})
        if(response && response.status === 200){
          console.log("Redirecting to OTP Verification page...")
          setOtpPageLoading(false)
          navigate('/otp-verify', {
              replace:true, 
              state:{email: user.email, from: 'cart', NoDirectAccess: true}
          }) 
        }
      }
      catch(error){
        console.log("Error in handleCheckout", error.message)
        toast.error(error.message)
      }
    }
  }, [user, navigate, baseApiUrl])

  useImperativeHandle(ref, () => ({
    clickCheckout: () => {
      handleCheckout()
    }
  }), [handleCheckout])


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
                <span className='order-title flex flex-col'>
                  <span> GST (12-18%) </span>
                  <span className='text-[10px] text-muted'>  (12% for supplements and 18% for others are added to each item) </span>
                </span>
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
                <span> ₹{absoluteTotalWithTaxes.toFixed(2)} </span>
              </div>
            </div>
            {/* <button className="w-full bg-[#E6FF00] text-black font-bold py-[12px] rounded-[8px] mt-[1.5rem]
               hover:bg-[#E6FF00]/90 transition-colors">
              Checkout
            </button> */}
            <SiteButtonSquare tailwindClasses='mt-[1rem] w-full hover:bg-primaryDark transition-colors' 
              clickHandler={()=> handleCheckout()}>
                { 
                    otpPageLoading ? 
                      <span className='flex justify-center items-center gap-[5px]'>  
                          <span className='text-secondary text-[11px] tracking-[0.3px] mb-[3px]'> 
                              Redirecting to OTP Verification Page 
                          </span>
                          <CustomScaleLoader loading={true}/>
                      </span>
                      : 'Checkout' 
                }
            </SiteButtonSquare>
        </div>
    )
  }
)
export default PaymentSummary