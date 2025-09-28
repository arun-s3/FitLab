import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {motion, AnimatePresence} from "framer-motion"

import {Check, Plus} from 'lucide-react'
import {toast} from 'react-toastify'

import NewAddressModal from './Modals/NewAddressModal'
import {createNewAddress, getAllAddress, resetStates} from '../../../Slices/addressSlice'


export default function AddressManager({addresses, shippingAddress, setShippingAddress, onAddressClick, onAddresChange, setDeliverAddressMade}){

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [addressSubmitted, setAddressSubmitted] = useState(false)

    const dispatch = useDispatch()
    const {error, addressCreated} = useSelector(state=> state.address)
    const {user} = useSelector(state=> state.user)
      
    useEffect(()=> {
        if(error){
            console.log("Just after before toast!-->"+error)
            toast.error(error)
            console.log("Just after error toast, resetting..")
            dispatch(resetStates())
        }
        if(addressSubmitted && addressCreated){
            dispatch(getAllAddress())
            toast.success("New Address registered successfully!") 
            setIsModalOpen(false)
            setDeliverAddressMade(true)
            setAddressSubmitted(false)
        }
    },[addressCreated, addressSubmitted, error])

    const submitAddress = (addressData)=> {
        console.log("Inside submitAddress()--");
        console.log("addressData----->", addressData)
        const {alternateMobileNumber, mobileNumber, ...rest} = addressData
        const newAddressData = {...rest, mobile: mobileNumber, alternateMobile: alternateMobileNumber}

        const optionalFieldNames = ["nickName", "landmark", "alternateMobile", "deliveryInstructions"];
        const requiredFields = Object.keys(newAddressData).filter(
            (field) => !optionalFieldNames.includes(field) 
        )
        const missingRequiredFields = requiredFields.filter(
            (field) => !newAddressData[field] || newAddressData[field] === ""
        )
        console.log(`Required Fields Length----> ${requiredFields.length} Required Fields--->, ${requiredFields}`)
        if (requiredFields.length < 9) {
            console.log("Missing required fields:", missingRequiredFields)
            toast.error("Please enter all required fields!")
            return;
        }

        if (missingRequiredFields.length > 0 || Object.values(newAddressData).some((value) => value === undefined)) {
            console.log("Undefined values found in addressData:", newAddressData)
            toast.error("Some of non-optional fields are not filled. Please check and submit again!")
            return;
        }

        console.log("Inside else (no errors) of submitAddress()")
        console.log("addressData now -->", JSON.stringify(newAddressData))
        dispatch(createNewAddress({id: user._id, addressData: newAddressData}))
        setAddressSubmitted(true)
        console.log("Dispatched successfully!")
    }
    

    return (
        <>
            <motion.div 
                className={`mt-[30px] ${addresses.length > 4 ? 'overflow-y-scroll' : 'overflow-y-auto'} overflow-x-hidden 
                  flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-x-4 x-lg:gap-x-[3rem] gap-y-[1rem] max-h-[30rem]`}
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
                            className={`m-[5px] flex justify-between pl-[10px] py-[5px] rounded-[6px] 
                              ${shippingAddress && (shippingAddress._id === address._id) 
                                ? 'outline outline-[2px] outline-primary outline-offset-2 scale-[97%]' 
                                : ''}`}
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
                                        <span className='ml-[1px] text-muted text-[12px] tracking-[0.2px]'>
                                            {`(${address?.nickName ? address.nickName : 'Nickname: N/A'})`}
                                        </span>
                                    </span>
                                    <span> {address.street} </span>
                                    <span> {address.district} </span>
                                    <span> {address.state} </span>
                                    <span> {address.pincode} </span>
                                    <span> {`(${address.landmark ? address.landmark : 'Landmark: N/A'})`} </span>
                                    <span className='inner-fields'>
                                        <span className='field-name text-muted'>
                                            Mobile:
                                        </span>
                                        <span className='ml-[5px]'>
                                            {address.mobile}
                                        </span>
                                    </span>
                                    <span className='inner-fields'>
                                        <span className='field-name text-muted whitespace-nowrap'>
                                            Alternate Mobile:
                                        </span>
                                        <span className='ml-[5px]'>
                                            {address.alternateMobile ? address.alternateMobile : 'N/A'}
                                        </span>
                                    </span>
                                    <span className='inner-fields'>
                                        <span className='field-name text-muted'>
                                            Email:
                                        </span>
                                        <span className='ml-[5px]'>
                                            {address.email}
                                        </span>
                                    </span>
                                    <span className='inner-fields'>
                                        <span className='field-name text-muted whitespace-nowrap'>
                                            Delivery Instructions:
                                        </span>
                                        <span className='ml-[5px]'>
                                            {address.deliveryInstructions ? address.deliveryInstructions : 'N/A'}
                                        </span>
                                    </span>
                                </address>
                            </div>
                        </motion.div>
                ))
            }
            </AnimatePresence>

            </motion.div>
            <motion.p className='mt-[1rem] bottom-[10px] flex items-center gap-[10px] uppercase cursor-pointer'
                onClick={()=> setIsModalOpen(true)}
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
                    Deliver to a New Address 
                </span>
            </motion.p>

            {
                isModalOpen &&
                    <NewAddressModal 
                        isOpen={isModalOpen} 
                        onClose={()=> setIsModalOpen(false)} 
                        onSubmit={submitAddress} 
                    />
            }

        </> 
    )

}