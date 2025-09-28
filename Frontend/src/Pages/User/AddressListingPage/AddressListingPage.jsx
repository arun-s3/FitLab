import React, {useState, useEffect, useContext} from 'react'
import './AddressListingPage.css'
import {useNavigate, useLocation} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'

import {toast} from 'react-toastify'
import {SquarePlus, MapPinPlus, HousePlus, Check, Trash} from 'lucide-react'
import {MdBlock} from 'react-icons/md'
import {RiFileEditLine} from "react-icons/ri"

import {UserPageLayoutContext} from '../UserPageLayout/UserPageLayout'
import {SitePrimaryButtonWithShadow} from '../../../Components/SiteButtons/SiteButtons'
import {getAllAddress, setAsDefaultAddress, deleteAddress} from '../../../Slices/addressSlice'
import AuthPrompt from '../../../Components/AuthPrompt/AuthPrompt'

 

export default function AddressListingPage(){

    const {setBreadcrumbHeading, setPageLocation} = useContext(UserPageLayoutContext)
    setBreadcrumbHeading('Manage Addresses')
      
    const location = useLocation()
    setPageLocation(location.pathname)

    const {addresses, message} = useSelector(state=> state.address)
    const {user} = useSelector((state)=> state.user)
    const dispatch = useDispatch()  

    const navigate = useNavigate()

    useEffect(()=> {
        dispatch(getAllAddress())
    },[])

    useEffect(()=> {
        if(message && message.includes('deleted')){
            toast.success('Deleted the address successfully!')
        }
    },[message])

    const headerBg = {
        backgroundImage: "url('/header-bg.png')",
        backgrounSize: 'cover'
    }

    return(

        <section id='AddressListingPage'>
             {
               !user ?
                 <div className='flex justify-center items-center mt-12'>
                 
                   <AuthPrompt />    

                 </div>
                :
                <>
                    <div className='text-center mb-[3rem]'>
                        <h1 className='text-[20px] font-[500] capitalize'> Manage Addresses </h1>
                        <h2 className='text-[12px] font-[450] tracking-[0.2px] text-secondary'> Easily view, edit, delete, or set your default address from your list of saved addresses </h2>
                    </div>
                    <div className='mb-[2rem] w-full h-[3rem] pl-[1rem] border border-dashed border-primaryDark rounded-[5px] flex
                         items-center gap-[10px] cursor-pointer' onClick={()=> navigate('/account/addresses/add')}>
                        {/* <SquarePlus className='text-secondary w-[20px] h-[20px]'/> */}
                        {/* <MapPinPlus className='text-secondary w-[20px] h-[20px]'/> */}
                        <HousePlus className='text-secondary w-[20px] h-[20px]'/>
                        <span className='text-[13px] font-[400] tracking-[0.5px] capitalize'> Add New Address </span>
                    </div>
                    <div className='flex flex-col justify-center gap-[2rem] address-content'>
                        {
                            addresses.map(address=> (
                                    <div className='flex justify-between pl-[10px] py-[5px] border-l-[4px] border-primary rounded-[6px]'>
                                        <address className='not-italic flex flex-col justify-center text-[13px] text-[#3C3D37]'>
                                            <span className='mb-[5px] flex items-center justify-between'>
                                                <span className='px-[6px] w-fit text-[11px] text-white capitalize bg-secondary
                                                     rounded-[5px] '>
                                                        {address.type}
                                                </span>
                                                {address.defaultAddress &&
                                                    <span className='flex items-center'>
                                                        <Check className='px-[4px] h-[23px] w-[23px] text-white bg-primary rounded-[10px]'/>
                                                        <span className='ml-[-7px] pl-[12px] pr-[15px] text-[11px] text-[rgb(239, 68, 68)] 
                                                                tracking-[0.2px] bg-primary rounded-[6px] z-[-1]'>
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
                                        <div className={`flex flex-col ${!address.defaultAddress? 'justify-between':'justify-end'} items-end`}>
                                            {!address.defaultAddress &&
                                               <SitePrimaryButtonWithShadow tailwindClasses='hover:bg-green-500' customStyle={{fontSize:'11px'}}
                                                    clickHandler={()=> dispatch( setAsDefaultAddress({addressId: address._id}) )}>
                                                 Set this as Default
                                               </SitePrimaryButtonWithShadow>
                                            }
                                            <div className='w-[35px] flex flex-col gap-[2rem] text-secondary address-options'>
                                                <span data-label='Edit' className='w-[30px] p-[5px] border rounded-[20px] z-[2] flex items-center justify-center 
                                                      relative cursor-pointer address-control' 
                                                        onClick={()=> navigate('./edit', {state: {address}})}>    
                                                  <i> <RiFileEditLine/> </i>  
                                                </span>
                                                <span data-label='Delete' className='w-[30px] p-[5px] border rounded-[20px] z-[2] flex items-center justify-center
                                                     relative cursor-pointer address-control' 
                                                        onClick={()=> dispatch( deleteAddress({addressId: address._id}) )}>  
                                                  <i> <Trash className='w-[15px] h-[15px]'/> </i>           
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                            ))
                        }
                    </div>

                </>
             }
            
        </section>

    )
}