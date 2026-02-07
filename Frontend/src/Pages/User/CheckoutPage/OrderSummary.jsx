import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {motion, AnimatePresence} from "framer-motion"

import {MapPin, Minus} from 'lucide-react'
import {toast as sonnerToast} from 'sonner'

import PaypalPayment from '../PaymentPages/PayPalPayment'
import {SiteSecondaryFillImpButton} from '../../../Components/SiteButtons/SiteButtons'
import {CustomHashLoader} from '../../../Components/Loader/Loader'
import useTermsConsent from "../../../Hooks/useTermsConsent"
import TermsDisclaimer from "../../../Components/TermsDisclaimer/TermsDisclaimer"


export default function OrderSummary({shippingAddress, paymentMethod, onApplyDiscount, placeOrder, onPaymentError, isLoading}){

    const [couponCode, setCouponCode] = useState('')
    const [appliedDiscount, setAppliedDiscount] = useState('')
    const [discountAmount, setDiscountAmount] = useState(0)

    const [isCouponFocused, setIsCouponFocused] = useState(false)

    const {cart} = useSelector(state=> state.cart)

    const [userTermsConsent, setUserTermsConsent] = useState(false)

    const {acceptTermsOnFirstAction} = useTermsConsent()
    

    return (
        <motion.div
            className='self-baseline mt-[-20px] w-full lg:w-auto border border-inputBorderSecondary lg:border-0 
           rounded-[7px] lg:rounded-none'
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}>
            <motion.div
                id='checkout-payment'
                className='w-full lg:w-[400px] bg-white rounded-lg shadow-lg p-6'
                style={{ boxShadow: "2px 2px 25px rgba(0,0,0,0.1)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}>
                <motion.h2
                    className='text-[20px ] text-secondary font-[650] tracking-[0.5px] mb-6'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}>
                    ORDER SUMMARY
                </motion.h2>
                {shippingAddress && (
                    <motion.div
                        className='mb-6 p-4 border border-primary rounded-lg'
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15, duration: 0.35 }}>
                        <div className='flex items-center mb-2'>
                            <MapPin className='w-5 h-5 text-gray-500 mr-2' />
                            <h3 className='font-semibold text-[16px]'>Delivery Address</h3>
                        </div>
                        {shippingAddress && (
                            <motion.div
                                className='text-[14px] text-gray-700 capitalize'
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.35 }}>
                                <p className='break-words whitespace-pre-wrap line-clamp-3'>
                                    {shippingAddress.firstName + " " + shippingAddress.lastName}
                                </p>
                                <p className='break-words whitespace-pre-wrap line-clamp-3'>{shippingAddress.street}</p>
                                <p className='break-words whitespace-pre-wrap line-clamp-3'>
                                    {shippingAddress.district}, {shippingAddress.state}
                                </p>
                                <p className='break-words whitespace-pre-wrap line-clamp-3'>
                                    {shippingAddress.pincode}
                                </p>
                                <p className='break-words whitespace-pre-wrap line-clamp-3'>
                                    {shippingAddress?.landmark ? shippingAddress.landmark : null}
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                )}
                <AnimatePresence>
                    {!cart.couponDiscount && (
                        <motion.div
                            className='mb-4 relative'
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}>
                            <label
                                htmlFor='couponCode'
                                className={`absolute ${
                                    isCouponFocused || couponCode
                                        ? "-top-2 left-2 px-1 bg-white text-xs"
                                        : "top-2 left-2 text-gray-500"
                                } 
                                transition-all duration-200 pointer-events-none`}>
                                Coupon code
                            </label>
                            <div className='flex items-center'>
                                <input
                                    type='text'
                                    id='couponCode'
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    onFocus={(e) => setIsCouponFocused(true)}
                                    onBlur={() => setIsCouponFocused(false)}
                                    className='flex-1 p-2 border border-[#e5e7eb] border-r-0 rounded-l-md focus:border-primary 
                                        focus:outline-none focus:ring-0 focus:ring-primary caret-primaryDark'
                                />
                                <motion.button
                                    className={`text-orange-500 px-4 py-[0.55rem] max-xs-sm2:ml-[-75px] border border-l-0 rounded-r-md 
                                    ${isCouponFocused ? "border-primary" : ""} hover:text-orange-600 transition-colors`}
                                    onClick={onApplyDiscount}>
                                    Apply
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {appliedDiscount && (
                        <motion.div
                            className='flex justify-between items-center mb-4 text-sm'
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.35 }}>
                            <div className='flex-1'>
                                <p className='text-gray-600'>Discount</p>
                                <p className='text-gray-500'>{appliedDiscount}</p>
                            </div>
                            <span className='text-red-500'>-{discountAmount.toFixed(2)}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className='space-y-2 text-sm border-t pt-4'>
                    <div className='flex justify-between'>
                        <span className='text-gray-600'> Subtotal </span>
                        <span> ₹{cart.absoluteTotal.toFixed(2)} </span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-gray-600'> Shipping Cost </span>
                        <span> {cart.deliveryCharge === 0 ? "Free" : `₹${cart.deliveryCharge}`} </span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-gray-600'> GST </span>
                        <span> {cart.deliveryCharge === 0 ? "Free" : `₹${cart.gst}`} </span>
                    </div>
                    {cart?.couponDiscount ? (
                        <motion.div
                            className='flex justify-between !mt-[2rem]'
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}>
                            <span className='text-green-600'> Coupon Discount </span>
                            <span className='flex items-center gap-[5px]'>
                                <Minus className='w-[13px]' /> ₹{cart.couponDiscount.toFixed(2)}
                            </span>
                        </motion.div>
                    ) : null}
                    <motion.div
                        className='flex justify-between text-lg font-bold pt-2'
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}>
                        <span> Total </span>
                        <span> ₹{cart.absoluteTotalWithTaxes.toFixed(2)} </span>
                    </motion.div>

                    <TermsDisclaimer
                        fontSize='12px'
                        style='!mt-8 !mb-[10px] !items-center gap-[10px]'
                        checkboxType={true}
                        onChecked={(status) => setUserTermsConsent(status)}
                    />
                </div>
                <motion.div
                    className=''
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.35 }}>
                    {paymentMethod !== "paypal" ? (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                            <SiteSecondaryFillImpButton
                                className={`!mt-0 px-[50px] py-[9px] rounded-[7px] ${paymentMethod === "cards" && "hidden"}`}
                                clickHandler={() => {
                                    if (userTermsConsent) {
                                        acceptTermsOnFirstAction()
                                        placeOrder()
                                    } else {
                                        sonnerToast.warning(
                                            "Please review and accept our Terms & Conditions and Privacy Policy to continue.",
                                            { duration: 5500 },
                                        )
                                    }
                                }}>
                                {isLoading ? (
                                    <CustomHashLoader loading={isLoading} color='#fff' />
                                ) : paymentMethod === "cashOnDelivery" || paymentMethod === "" ? (
                                    "Place Order"
                                ) : (
                                    "Pay and Place Order"
                                )}
                            </SiteSecondaryFillImpButton>
                        </motion.div>
                    ) : cart && cart?.absoluteTotalWithTaxes ? (
                        <motion.div className='mt-[1rem]' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <PaypalPayment
                                amount={cart.absoluteTotalWithTaxes.toFixed(2)}
                                onPayment={(id) => handleStripeOrPaypalPayment("paypal", id)}
                                onError={(msg = null) => onPaymentError(msg)}
                            />
                        </motion.div>
                    ) : null}
                </motion.div>
            </motion.div>
        </motion.div>
    )
}