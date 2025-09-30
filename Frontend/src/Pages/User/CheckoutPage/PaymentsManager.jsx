import React, {useState, useEffect, useRef} from 'react'
import {motion, AnimatePresence} from 'framer-motion'

import StripePayment from '../PaymentPages/StripePayment'
import {camelToCapitalizedWords} from '../../../Utils/helperFunctions'


export default function PaymentManager({paymentMethod, setPaymentMethod, optionClickHandler, optionChangeHandler, 
  cartTotal, stripeOrPaypalPayment, onPaymentError, retryStripePaymentStatus, setRetryStripePaymentStatus}){

    const [cardsEnterError, setCardsEnterError] = useState('')
    
    const retryStripePaymentRef = useRef()

    useEffect(()=> {
      if(retryStripePaymentStatus && retryStripePaymentRef.current){
        retryStripePaymentRef.current.retryStripePayment()
        setRetryStripePaymentStatus(false)
      }
    }, [retryStripePaymentStatus])

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

    return (

        <motion.div 
          className='mt-[30px] flex flex-col gap-4 s-sm:grid s-sm:grid-cols-2 s-sm:gap-x-[3rem] s-sm:gap-y-[1rem]'
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <AnimatePresence>
            {
              paymentOptions.map((option, index)=> (
                    <div 
                      className={`px-[15px] py-[10px] 
                        ${option.name === 'cards' 
                            ? 'col-span-2 xx-xl:w-[38rem] deskt:w-[42rem]' 
                            : 'xx-xl:w-[18rem] deskt:w-[20rem]'} xx-xl:w-[18rem] deskt:w-[20rem] w-full s-sm:w-auto 
                        flex items-center justify-between flex-wrap rounded-[5px] cursor-pointer
                        hover:border-primaryDark hover:bg-primaryLight
                        ${paymentMethod === option.name 
                            ? 'border-2 border-primaryDark bg-primaryLight'
                            :'border border-mutedDashedSeperation'}`} 
                      id='checkout-payment-methods'
                      onClick={()=> setPaymentMethod(option.name)}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.08, duration: 0.35, ease: "easeOut" }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.97 }}
                    >
                        <div className='w-full flex items-center justify-between'>
                            <div className='flex items-center gap-[10px]'>
                                <motion.img 
                                  src={option.icon} 
                                  className='w-[20px] h-[20px]'
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: index * 0.1 + 0.2 }}
                                />
                                <span className={`text-[15px] flex items-center 
                                    ${paymentMethod === option.name && 'text-secondary font-medium'}`}>
                                { camelToCapitalizedWords(option.name) } 
                                {
                                    option.name === 'cards' &&
                                    <span className='ml-[5px] mt-[1px] text-[9px] lg:text-[12px] text-muted font-normal'> 
                                        (All global cards accepted - Visa, Mastercard, American Express, Discover, JCB, etc)
                                    </span>
                                }
                                </span>
                            </div>
                            <motion.input 
                              type='radio' 
                              className='border border-primaryDark cursor-pointer checked:bg-primaryDark' 
                              onClick={(e)=> optionClickHandler(e, "paymentOption", option.name)} 
                              onChange={(e)=> optionChangeHandler(e, "paymentOption", option.name)}
                              checked={paymentMethod === option.name}
                              whileTap={{ scale: 1.3 }}
                              transition={{ duration: 0.2 }}
                            />
                        </div>
                        {
                        option.name === 'cards' &&
                            <motion.div 
                              className='relative w-full'
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.4, delay: 0.2 }}
                            >
                                <p className='absolute top-[5px] text-[10px] text-red-500 font-medium tracking-[0.3px] z-[30]'>
                                  {cardsEnterError && cardsEnterError} 
                                </p>
                                { 
                                  cartTotal &&
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                  >
                                    <StripePayment 
                                      amount={cartTotal.toFixed(2)} 
                                      onPayment={(id)=> stripeOrPaypalPayment('stripe', id)}
                                      ref={retryStripePaymentRef}
                                      onError={onPaymentError}
                                    />
                                  </motion.div>
                                }
                                {  
                                 paymentMethod !== 'cards' &&
                                 <div 
                                    className='absolute top-[1.5rem] left-[1.5rem] right-[1.5rem] bottom-[1.5rem]
                                      cursor-not-allowed z-[10]' 
                                    style={{background: 'rgba(255,255,255,0.3)'}} 
                                    onMouseEnter={()=> setCardsEnterError("Please select the cards' radiobutton first!")}
                                    onMouseLeave={()=> setCardsEnterError('')}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                  />
                                }
                            </motion.div>
                      }
                    </div>
              ))
            }
          </AnimatePresence>
        </motion.div>
    )
}