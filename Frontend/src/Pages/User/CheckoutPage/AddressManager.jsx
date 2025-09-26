import React from 'react'
import {motion, AnimatePresence} from "framer-motion"

import {Check, Plus} from 'lucide-react'


export default function AddressManager({addresses, shippingAddress, setShippingAddress, onAddressClick, onAddresChange}){

    const addNewAddress = ()=> {
        console.log("Opening address modal...")
    }
    

    return (
        <>
            <motion.div className='mt-[30px] flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-x-4 x-lg:gap-x-[3rem] gap-y-[1rem]'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >

            <AnimatePresence>
            {
              [...addresses].sort((a, b)=> {
                if (b.defaultAddress && !a.defaultAddress){
                  return 1
                }else if(a.defaultAddress && !b.defaultAddress){
                  return -1
                }
                return 0
              }).map((address, index)=> (
                        <motion.div key={address._id} 
                            id='checkout-address' 
                            className={`flex justify-between pl-[10px] py-[5px] rounded-[6px] 
                              ${shippingAddress && (shippingAddress._id === address._id) ? 'outline outline-[2px] outline-primary outline-offset-2' : ''}`}
                            onClick={()=> setShippingAddress(address)}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: index * 0.05, duration: 0.1, ease: "easeOut" }}
                            whileTap={{ scale: 0.98 }}
                            whileHover={{ scale: 1.01 }}
                        >
                            <div className='flex gap-[5px]'>
                                <motion.input 
                                    type='radio' 
                                    onClick={(e)=> onAddressClick(e, "address", address)}
                                    onChange={(e)=> onAddresChange(e, "address", address)} 
                                    checked={shippingAddress && shippingAddress._id === address._id}
                                    whileTap={{ scale: 1.3 }}
                                    transition={{ duration: 0.2 }}
                                />
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
                        </motion.div>
                ))
            }
            </AnimatePresence>

            </motion.div>
            <motion.p className='mt-[1rem] bottom-[10px] flex items-center gap-[10px] uppercase cursor-pointer'
                onClick={()=> addNewAddress()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
            > 
                <motion.span
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <Plus className='h-[22px] w-[22px] text-primaryDark'/>
                </motion.span>
                <span className='text-[12px] tracking-[0.5px] text-secondary' 
                    style={{wordSpacing: '1px'}}
                >
                    Add New Address / Manage All Addresses 
                </span>
            </motion.p>
        </> 
    )

}