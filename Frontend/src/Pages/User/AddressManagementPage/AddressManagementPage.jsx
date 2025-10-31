import React, {useState, useEffect, useRef, useContext, useCallback} from 'react'
import './AddressManagementPage.css'
import {useLocation, useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import {toast as sonnerToast} from 'sonner'
import {toast} from 'react-toastify'

import AddressFields from './AddressFields'
import {UserPageLayoutContext} from '../UserPageLayout/UserPageLayout'
import {createNewAddress, editAddress, resetStates} from '../../../Slices/addressSlice'
import AuthPrompt from '../../../Components/AuthPrompt/AuthPrompt'


export default function AddressManagementPage({editAddresses = false}){

    const {setBreadcrumbHeading, setContentTileClasses, setSidebarTileClasses, setPageLocation} = useContext(UserPageLayoutContext)
    editAddresses
        ? setBreadcrumbHeading('Edit Address') 
        : setBreadcrumbHeading('Add Address')
    setContentTileClasses('basis-full l-md:basis-[75%] mt-[2rem] content-tile')
    setSidebarTileClasses('hidden l-md:inline-block')

    const location = useLocation()

    const [addressData, setAddressData] = useState({})

    const [radioCheckedAddressType, setradioCheckedAddressType] = useState('')

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector(state=> state.user)
    const {error, addressCreated, addressUpdated} = useSelector(state=> state.address)

    const [addressId, setAddressId] = useState(null)

    useEffect(()=> {
        console.log("editAddresses----->", editAddresses)
        setPageLocation(location.pathname)
        if(location?.state?.address){
            const {type, _id, userId, __v, ...rest} = location.state.address
            setAddressId(_id)
            setradioCheckedAddressType(type)
            setAddressData(rest)
        }
    },[location])


    useEffect(()=> {
            setAddressData(addressData=> {
                return {...addressData, type: radioCheckedAddressType}
            })
    },[radioCheckedAddressType])

    useEffect(()=> {
        if(addressData){
            console.log("addressData--->", JSON.stringify(addressData))
        }
    },[addressData])
    
    useEffect(()=> {
        if(error){
            console.log("Just after before toast!-->"+error)
            sonnerToast.error(error)
            console.log("Just after error toast, resetting..")
            dispatch(resetStates())
        }
        if(addressCreated){
            sonnerToast.success("New Address registered successfully!") 
            console.log("Just after error toast, resetting..")
            dispatch(resetStates())
            navigate('/account/addresses', {replace: true})
        }
        if(addressUpdated){
            sonnerToast.success("Address Updated successfully!")
            console.log("Just after error toast, resetting..")
            dispatch(resetStates())
            navigate('/account/addresses', {replace: true})
        }
    },[addressCreated, addressUpdated, error])

    useEffect(() => {
        dispatch(resetStates())
    }, [dispatch])


    const inputChangeHandler = useCallback((e) => {
        const {id, value} = e.target;
        setAddressData((prevData) => ({ ...prevData, [id]: value }))
    }, [])

    const radioClickHandler = (e)=>{
        const type = e.target.id
        const checkStatus = radioCheckedAddressType === type
        console.log("checkStatus-->", checkStatus)
        if(checkStatus){
            setradioCheckedAddressType('')
            return
        }else{
            setradioCheckedAddressType(type)
            const changeEvent = new Event('change', {bubbles:true})
            e.target.dispatchEvent(changeEvent)
        }
    }

    const radioChangeHandler = (e)=>{
        const type = e.target.id
        e.target.checked = (radioCheckedAddressType === type)
    }

    const submitAddress = () => {
        console.log("Inside submitAddress()--");
        console.log("addressData----->", addressData)
    
        const optionalFieldNames = ["nickName", "landmark", "alternateMobile", "deliveryInstructions", "defaultAddress"];
        const requiredFields = Object.keys(addressData).filter(
            (field) => !optionalFieldNames.includes(field) 
        )
        const missingRequiredFields = requiredFields.filter(
            (field) => !addressData[field] || addressData[field] === ""
        )
        console.log(`Required Fields Length----> ${requiredFields.length} Required Fields--->, ${requiredFields}`)
        if (requiredFields.length < 9) {
            console.log("Missing required fields:", missingRequiredFields)
            toast.error("Please enter all required fields!")
            return;
        }
    
        if (missingRequiredFields.length > 0 || Object.values(addressData).some((value) => value === undefined)) {
            console.log("Undefined values found in addressData:", addressData)
            sonnerToast.error("Please check the fields and submit again!")
            return;
        }
    
        console.log("Inside else (no errors) of submitAddress()")
        console.log("addressData now -->", JSON.stringify(addressData))
        if(addressId) console.log("addressId------>", addressId)
        !editAddresses 
            ? dispatch(createNewAddress({ id: user._id, addressData }))
            : dispatch(editAddress({ id: user._id, addressId, addressData }))
        console.log("Dispatched successfully!")
    }
    

    return(
        
        <section className='basis-[75%] mt-[2rem]' id='AddressManagementPage'>
            {
              !user ?
                <div className='flex justify-center items-center mt-12'>
                
                  <AuthPrompt />

                </div>
                :
                <>
                    <div className='text-center mb-auto xs-sm2:mb-[4rem] s-sm:mb-auto'>
                        <h1 className='text-[20px] font-[500] capitalize'> 
                             {`${editAddresses? 'Edit address' : 'Add New Address'}`}
                        </h1>
                        <h2 className='max-mob:text-[10px] text-[12px] font-[450] tracking-[0.2px] text-secondary'>
                             {`Fill in the below fields to ${editAddresses? 'edit the' : 'add an'} address`}
                        </h2>
                    </div> 

                    <AddressFields 
                        editAddresses
                        addressData={addressData} 
                        setAddressData={setAddressData}
                        onChange={inputChangeHandler}
                        onRadioClick={radioClickHandler}
                        onRadioChange={radioChangeHandler}
                        radioCheckedAddressType={radioCheckedAddressType}
                        onSubmit={submitAddress}
                    />

                </>
            }
            
        </section>

    )
}