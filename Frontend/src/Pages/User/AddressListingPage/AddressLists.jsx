import React from 'react'
import {useNavigate} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {motion} from 'framer-motion'

import {Check, Trash} from 'lucide-react'
import {RiFileEditLine} from "react-icons/ri"

import {SitePrimaryButtonWithShadow} from '../../../Components/SiteButtons/SiteButtons'
import {setAsDefaultAddress} from '../../../Slices/addressSlice'

 

export default function AddressLists({addresses, setOpenDeleteModal, setDeleteAddressId}){

    const dispatch = useDispatch() 
    const navigate = useNavigate()


    return(
                                
        <motion.div
          className="h-[28rem] xs-sm:h-[30rem] ml-12 xxs-sm:ml-8 xs-sm2:ml-auto w-[70%] xxs-sm:w-[80%] xs-sm2:w-full overflow-y-scroll px-1 xs-sm:px-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          <div className="pt-4 flex flex-col justify-center gap-[1.5rem] xs-sm:gap-[2rem] address-content">
            {addresses &&
            addresses.map((address) => (
              <motion.div
                key={address._id}
                className="w-full flex flex-col x-sm:flex-row justify-between pl-[8px] xs-sm:pl-[10px] py-[6px] 
                           border-l-[4px] border-primary rounded-[6px] gap-3 shadow-sm"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ type: "spring", stiffness: 80, damping: 15 }}
                whileHover={{ scale: 1.01, boxShadow: "0px 4px 12px rgba(0,0,0,0.1)" }}
              >
                <address className="w-full not-italic flex flex-col justify-center text-[12px] mob:text-[13px] text-[#3C3D37] break-words">
                  <span className="mb-[5px] flex flex-wrap items-center justify-between">
                    <span className="px-[5px] mob:px-[6px] w-fit text-[10px] mob:text-[11px] text-white capitalize bg-secondary rounded-[5px]">
                      {address.type}
                    </span>
                    {address.defaultAddress && (
                      <motion.span
                        className="flex items-center flex-shrink-0 ml-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 150, damping: 12 }}
                      >
                        <Check className="px-[3px] mob:px-[4px] h-[20px] mob:h-[23px] w-[20px] mob:w-[23px] text-white bg-primary rounded-[10px]" />
                        <span className="ml-[-6px] pl-[10px] pr-[12px] mob:pl-[12px] mob:pr-[15px] text-[10px] mob:text-[11px] 
                                         text-[rgb(239,68,68)] tracking-[0.2px] bg-primary rounded-[6px]">
                          Default
                        </span>
                      </motion.span>
                    )}
                  </span>
                
                  <span className="w-full flex flex-wrap items-center gap-[4px]">
                    <span>{address.firstName + " " + address.lastName}</span>
                    <span className="text-muted text-[11px] mob:text-[12px] tracking-[0.2px] break-words">
                      {`(${address?.nickName ? address.nickName : "Nickname: N/A"})`}
                    </span>
                  </span>
                
                  <span className="break-words">{address.street}</span>
                  <span className="break-words">{address.district}</span>
                  <span className="break-words">{address.state}</span>
                  <span className="break-words">{address.pincode}</span>
                  <span className="break-words">
                    {`(${address.landmark ? address.landmark : "Landmark: N/A"})`}
                  </span>
                
                  <span className="inner-fields break-words">
                    <span className="field-name text-muted">Mobile:</span>
                    <span className="ml-[5px]">{address.mobile}</span>
                  </span>
                  <span className="inner-fields break-words">
                    <span className="field-name text-muted whitespace-nowrap">Alternate Mobile:</span>
                    <span className="ml-[5px]">{address.alternateMobile ? address.alternateMobile : "N/A"}</span>
                  </span>
                  <span className="inner-fields break-words">
                    <span className="field-name text-muted">Email:</span>
                    <span className="ml-[5px]">{address.email}</span>
                  </span>
                  <span className="inner-fields break-words">
                    <span className="field-name text-muted whitespace-nowrap">Delivery Instructions:</span>
                    <span className="ml-[5px]">{address.deliveryInstructions ? address.deliveryInstructions : "N/A"}</span>
                  </span>
                </address>
                
                <motion.div
                  className={`mr-[7px] flex flex-row x-sm:flex-col gap-3 x-sm:gap-[2rem] items-end min-w-[90px] x-sm:min-w-[35px] 
                              ${!address.defaultAddress ? "justify-between" : "justify-end"}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {!address.defaultAddress && (
                    <SitePrimaryButtonWithShadow
                      tailwindClasses="!hover:bg-green-500 !w-[7rem] !text-[12px] !px-2 py-[2px] !rounded-[5px]"
                      clickHandler={() => dispatch(setAsDefaultAddress({ addressId: address._id }))}
                    >
                      Set as default
                    </SitePrimaryButtonWithShadow>
                  )}
                  <div className="flex x-sm:flex-col gap-3 x-sm:gap-[2rem] text-secondary address-options">
                    <span
                      data-label="Edit"
                      className="w-[28px] mob:w-[30px] p-[4px] border rounded-[20px] flex items-center justify-center 
                                 relative cursor-pointer address-control hover:border-0"
                      onClick={() => navigate("./edit", { state: { address } })}
                    >
                      <i><RiFileEditLine /></i>
                    </span>
                    <span
                      data-label="Delete"
                      className="w-[28px] mob:w-[30px] p-[4px] border rounded-[20px] flex items-center justify-center
                                 relative cursor-pointer address-control hover:border-0"
                      onClick={()=> {
                          setOpenDeleteModal(true)
                          setDeleteAddressId(address._id)
                      }}
                    >
                      <i><Trash className="w-[14px] h-[14px] mob:w-[15px] mob:h-[15px]" /></i>
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )) 
        }
          </div>
        </motion.div>
    )
}