import React,{useState, useEffect, useRef, useCallback} from 'react'
import './AddressManagementPage.css'
import {useLocation} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import {toast} from 'react-toastify'

import Header from '../../../Components/Header/Header'
import Footer from '../../../Components/Footer/Footer'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import UserSidebar from '../../../Components/UserSidebar/UserSidebar'
import {InputAndLabelGenerator} from '../../../Components/InputAndLabelGenerator/InputAndLabelGenerator'
import {SiteButtonSquare} from '../../../Components/SiteButtons/SiteButtons'
import {capitalizeFirstLetter} from '../../../Utils/helperFunctions'
import {createNewAddress, editAddress, resetStates} from '../../../Slices/addressSlice'
import {CustomHashLoader} from '../../../Components/Loader/Loader'


export default function AddressManagementPage({editAddresses}){

    const primaryColor = useRef('rgb(218 179 246)')

    const [addressData, setAddressData] = useState({})

    const addressTypes = ['home', 'work', 'temporary', 'gift']
    const [radioCheckedAddressType, setradioCheckedAddressType] = useState('')

    const dispatch = useDispatch()
    const {user} = useSelector(state=> state.user)
    const {loading, error, addressCreated, addressUpdated} = useSelector(state=> state.address)

    const location = useLocation()

    const [addressId, setAddressId] = useState(null)

    useEffect(()=> {
        console.log("editAddresses----->", editAddresses)
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
            toast.error(error)
            console.log("Just after error toast, resetting..")
            dispatch(resetStates())
        }
        if(addressCreated){
            toast.success("New Address registered successfully!") 
            console.log("Just after error toast, resetting..")
            dispatch(resetStates())
        }
        if(addressUpdated){
            toast.success("Address Updated successfully!")
            console.log("Just after error toast, resetting..")
            dispatch(resetStates())
        }
    },[addressCreated, addressUpdated, error])

    useEffect(() => {
        dispatch(resetStates())
    }, [dispatch])
                                                           
    const headerBg = {
        backgroundImage: "url('/header-bg.png')",
        backgrounSize: 'cover'
    }

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
    
        const optionalFieldNames = ["nickName", "landmark", "alternateMobile", "deliveryInstructions"];
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
            toast.error("Please check the fields and submit again!")
            return;
        }
    
        console.log("Inside else (no errors) of submitAddress()")
        console.log("addressData now -->", JSON.stringify(addressData))
        if(addressId) console.log("addressId------>", addressId)
        !editAddresses ? dispatch(createNewAddress({ id: user._id, addressData })): dispatch(editAddress({ id: user._id, addressId, addressData }))
        console.log("Dispatched successfully!")
    }
    

    return(

        <section id='AddressManagementPage'>
            <header style={headerBg}>

                <Header />

            </header>

            <BreadcrumbBar heading={`${editAddresses? 'edit address' : 'add address'}`}/>

            <main className='flex gap-[2rem] px-[4rem] mb-[10rem]'>
                <div className='basis-[25%]'>
                    
                    <UserSidebar />

                </div>
                <div className='basis-[75%] mt-[2rem]'>
                    <div className='text-center'>
                        <h1 className='text-[20px] font-[500] capitalize'>  {`${editAddresses? 'Edit address' : 'Add New Address'}`} </h1>
                        <h2 className='text-[12px] font-[450] tracking-[0.2px] text-secondary'> {`Fill in the below fields to ${editAddresses? 'edit the' : 'add an'} address`}</h2>
                    </div>
                    <div id='address-content'>
                        <div className='address-fields'>
                            <InputAndLabelGenerator key='firstName' name='firstName' dataObj={addressData} setDataObj={setAddressData}
                                 primaryColor={primaryColor} onChange={inputChangeHandler}/>
                            <InputAndLabelGenerator  key='lastName' name='lastName' onChange={inputChangeHandler} dataObj={addressData}
                                 setDataObj={setAddressData} primaryColor={primaryColor} />
                        </div>
                        <div className='address-fields'>
                            <div className='basis-1/2'>   
                                <InputAndLabelGenerator key='nickName' name='nickName' onChange={inputChangeHandler} optionalField={true} optionalMsg= "(Optional- Keeping Nickname would give a personal touch, if it's a Gift Address)"
                                    dataObj={addressData} setDataObj={setAddressData} primaryColor={primaryColor} />
                                {/* <p className='mt-[2px] text-[11px] text-muted tracking-[0.2px]'> (Optional- Keeping Nickname would give a personal touch, if it's a Gift Address) </p> */}
                            </div>
                            <InputAndLabelGenerator/>
                        </div>
                        <div className='address-fields'>
                            <InputAndLabelGenerator key='district' name='district' onChange={inputChangeHandler} dataObj={addressData} 
                                setDataObj={setAddressData} primaryColor={primaryColor} />
                            <InputAndLabelGenerator key='state' name='state' onChange={inputChangeHandler} 
                                dataObj={addressData} setDataObj={setAddressData} primaryColor={primaryColor} />
                        </div>
                        <div className='address-fields'>
                            <InputAndLabelGenerator key='street' name='street' fieldType='textarea' parentStyles="w-full" rows={3}
                                 onChange={inputChangeHandler} dataObj={addressData} setDataObj={setAddressData} primaryColor={primaryColor}/>
                        </div>
                        <div className='address-fields justify-start items-baseline'>
                            <InputAndLabelGenerator key='pincode' name='pincode' parentStyles="basis-[30%]" onChange={inputChangeHandler} 
                                    dataObj={addressData} setDataObj={setAddressData} primaryColor={primaryColor} />
                            <div>
                                <h5 className='text-[13.5px] tracking-[0.3px]'> Address Type </h5>
                                <div className='mt-[10px] flex items-center gap-[1rem] address-types'>
                                        {
                                            addressTypes.map(type=> (
                                                <div>
                                                    <input type='radio' id={type} onClick={(e)=> radioClickHandler(e)} 
                                                        onChange={(e)=> radioChangeHandler(e)} checked={radioCheckedAddressType === type}/>
                                                    <label htmlFor={type}> { capitalizeFirstLetter(type) } </label>
                                                </div>
                                            ))
                                        }
                                </div>
                            </div>
                            <div className='basis-[50%]'>
                                <InputAndLabelGenerator key='landmark' name='landmark' optionalField={true} onChange={inputChangeHandler} 
                                    dataObj={addressData} setDataObj={setAddressData} primaryColor={primaryColor} optionalMsg='(Optional)'/>
                                {/* <p className='mt-[2px] text-[11px] text-muted tracking-[0.2px]'> (Optional) </p> */}
                            </div>
                        </div>
                        <div className='address-fields'>
                            <InputAndLabelGenerator key='deliveryInstr' name='deliveryInstructions' fieldType='textarea' parentStyles="w-full" 
                                onChange={inputChangeHandler} dataObj={addressData} setDataObj={setAddressData} primaryColor={primaryColor}
                                    optionalField={true} optionalMsg="Example- 'Leave at the front door. @123 (Optional)'" rows={4}/>
                        </div>  
                        
                        <div className='mt-[1rem] w-[40%] h-[2px] border-b-[1px] border-dashed border-mutedDashedSeperation'></div>
                        <h3 className='mt-[-10px] text-[15px] text-secondary font-[550] capitalize'> Contact Information </h3>

                        <div className='address-fields'>
                            <InputAndLabelGenerator key='mobileNumber' name='mobile' label='mobileNumber' onChange={inputChangeHandler} 
                                dataObj={addressData} setDataObj={setAddressData} primaryColor={primaryColor} />
                            <InputAndLabelGenerator key='email' name='email' onChange={inputChangeHandler} dataObj={addressData} 
                                setDataObj={setAddressData} primaryColor={primaryColor} />
                        </div>
                        <div className='address-fields'>
                            <div className='basis-1/2'>   
                                <InputAndLabelGenerator key='alternateMobileNumber' name='alternateMobile' label='alternateMobileNumber'
                                     optionalField={true} optionalMsg="(Optional)" onChange={inputChangeHandler} dataObj={addressData}
                                         setDataObj={setAddressData} primaryColor={primaryColor} />
                                {/* <p className='mt-[2px] text-[11px] text-muted tracking-[0.2px]'> (Optional) </p> */}
                            </div>
                            <InputAndLabelGenerator/>
                        </div>
                        <div className='text-center'>
                            <SiteButtonSquare customStyle={{fontWeight:'600', paddingInline:'50px', paddingBlock:'9px', borderRadius:'7px'}} 
                                    clickHandler={()=> submitAddress()}>
                                {loading? <CustomHashLoader loading={loading}/> : 'Add Address'}   
                            </SiteButtonSquare>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

        </section>
    )
}