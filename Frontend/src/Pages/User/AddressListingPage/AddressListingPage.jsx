import React, {useState, useEffect, useContext} from 'react'
import './AddressListingPage.css'
import {useNavigate, useLocation} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {motion} from 'framer-motion'

import {HousePlus} from 'lucide-react'
import {toast as sonnerToast} from 'sonner'

import AddressLists from './AddressLists'
import DeleteAddressModal from './DeleteAddressModal'
import {UserPageLayoutContext} from '../UserPageLayout/UserPageLayout'
import {getAllAddress, deleteAddress, resetStates} from '../../../Slices/addressSlice'
import AuthPrompt from '../../../Components/AuthPrompt/AuthPrompt'

 

export default function AddressListingPage(){

    const {setBreadcrumbHeading, setSidebarTileClasses, setPageWrapperClasses, setPageLocation, setPageBgUrl} = useContext(UserPageLayoutContext)
    setBreadcrumbHeading('Manage Addresses')
    setPageWrapperClasses(`gap-[2rem] px-[4rem] pb-[10rem] justify-center xx-md:justify-normal`)
    setSidebarTileClasses('hidden xx-md:inline-block')
    setPageBgUrl(`linear-gradient(to right,rgba(255,255,255,0.96),rgba(255,255,255,0.96)), url('/patternBg2.png')`)
      
    const location = useLocation()
    setPageLocation(location.pathname)

    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [deleteAddressId, setDeleteAddressId] = useState('')

    const {addresses, loading, error, addressDeleted} = useSelector(state=> state.address)
    const {user} = useSelector((state)=> state.user)
    const dispatch = useDispatch()  

    const navigate = useNavigate()

    useEffect(()=> {
        dispatch(getAllAddress())
    },[])

    useEffect(()=> {
        if(addressDeleted){
            sonnerToast.success('Deleted the address successfully!')
            dispatch(resetStates())
        }
        if(error){
            sonnerToast.error(error)
            dispatch(resetStates())
        }
        if(addresses){
            console.log("addresses--->", addresses)
        }
    },[addressDeleted, error, addresses])

    const onDeleteConfirm = async ()=> {
        console.log("Address deleting..")
        dispatch(deleteAddress({ addressId: deleteAddressId }))
        setOpenDeleteModal(false)
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
                    <motion.div
                      className="text-center mb-[3rem] px-2"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <h1 className="text-[18px] mob:text-[19px] xs-sm:text-[20px] x-md:text-[22px] font-[500] capitalize">
                        Manage Addresses
                      </h1>
                      <h2 className="text-[11px] w-[80%] xxs-sm:w-auto ml-12 xxs-sm:ml-auto xxs-sm:text-[12px] xs-sm:text-[13px]
                       x-md:text-[14px] font-[450] tracking-[0.2px] text-secondary mt-1">
                        Easily view, edit, delete, or set your default address from your list of saved addresses
                      </h2>
                    </motion.div>

                    <motion.div
                      className="mb-[2rem] ml-12 xxs-sm:ml-8 xs-sm2:ml-auto w-[75%] xxs-sm:w-[80%] xs-sm2:w-full h-[3rem] pl-[0.75rem]
                       sm:pl-[1rem] border border-dashed border-primaryDark rounded-[5px] 
                       flex items-center gap-[8px] sm:gap-[10px] cursor-pointer hover:bg-primary/5 transition"
                      onClick={() => navigate("/account/addresses/add")}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: 0.2, ease: 'easeInOut' }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <HousePlus className="text-secondary w-[18px] h-[18px] mob:w-[20px] mob:h-[20px]" />
                      <span className="text-[12px] mob:text-[13px] font-[400] tracking-[0.5px] capitalize">
                        Add New Address
                      </span>
                    </motion.div> 

                    {
                        addresses && addresses.length > 0 ?

                            <AddressLists 
                                addresses={addresses} 
                                setOpenDeleteModal={setOpenDeleteModal} 
                                setDeleteAddressId={setDeleteAddressId}
                            />
                            :
                             <motion.div
                                className="w-full h-auto flex items-center justify-center flex-col l-md:flex-row 
                                  text-[12px] l-md:text-[13px] xx-md:text-[14px] lg:text-[17px] text-muted tracking-[0.3px]"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            >
                               <img src='/address.png' className='w-[22rem] md:w-[45%] h-auto'/> 
                               <p className='whitespace-normal xs-sm:whitespace-nowrap md:whitespace-normal'> 
                                    You don’t have any saved addresses yet. Add one to make checkout faster! 
                               </p>

                            </motion.div>
                    }

                    
                    {
                        openDeleteModal &&
                            <DeleteAddressModal
                              open={openDeleteModal}
                              onClose={() => setOpenDeleteModal(false)}
                              onConfirm={onDeleteConfirm}
                              loading={loading}
                            />
                    }

                </>
             }
            
        </section>

    )
}