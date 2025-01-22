import React, {useState, useEffect, useRef} from 'react'
import './UserAccountPage.css'
import {useSelector, useDispatch} from 'react-redux'

import {User, Mail, Phone, MapPin, MapPinHouse, Lock, Camera, Edit2, Check, X} from 'lucide-react'
import {RiArrowDropDownLine} from "react-icons/ri"
import {format} from "date-fns"

import Header from '../../../Components/Header/Header'
import Footer from '../../../Components/Footer/Footer'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import UserSidebar from '../../../Components/UserSidebar/UserSidebar'
import {SingleDateSelector} from '../../../Components/Calender/Calender' 
import {updateUserDetails, resetStates as resetUserStates} from '../../../Slices/userSlice'
import {getDefaultAddress, editAddress, resetStates as resetAddressStates} from '../../../Slices/addressSlice'
import {InputAndLabelGenerator} from '../../../Components/InputAndLabelGenerator/InputAndLabelGenerator'
import {SiteButtonSquare} from '../../../Components/SiteButtons/SiteButtons'
import {camelToCapitalizedWords} from '../../../Utils/helperFunctions'
import {handleInputValidation, displaySuccess, displayErrorAndReturnNewFormData, cancelErrorState} from '../../../Utils/fieldValidator'
import {CustomHashLoader} from '../../../Components/Loader/Loader'
import { toast } from 'react-toastify'


export default function UserAccountPage(){

  const [editing, setEditing] = useState(false)
  const [userDetails, setUserDetails] = useState({})
  const [addressDetails, setAddressDetails] = useState({})
  const [dob, setDob] = useState(null)
  const [gender, setGender] = useState('')
  const [addressType, setAddressType] = useState('')
  const allAddressTypes = ["home", "work", "temporary", "gift"]

  const [openDropdowns, setOpenDropdowns] = useState({genderDropdown: false, addressDropdown: false})
  const dropdownRefs = {
    genderDropdown: useRef(null),
    addressDropdown: useRef(null),
  }

  const primaryColor = useRef('rgb(209 213 219)')
  const errorRef = useRef(null)

  const dispatch = useDispatch()
  const {user, userUpdated} = useSelector(state=> state.user)
  const {currentDefaultAddress, addressUpdated} = useSelector(state=> state.address)

  useEffect(()=> {
    const handleClickOutside = (e)=> {
      const isOutside = !Object.values(dropdownRefs).some( (ref)=> ref.current?.contains(e.target) )
      console.log("isOutside--->", isOutside)
       if (isOutside){
        setOpenDropdowns((prevState)=>
          Object.keys(prevState).reduce((newState, key)=> {
            newState[key] = false
            return newState
          }, {})
        )
      }
    }
    document.addEventListener("click", handleClickOutside)
    return ()=> {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  useEffect(()=> {
    const getUserDefaultAddress = async()=>{
      if(user){
        console.log('user----->', JSON.stringify(user))
        // const userDatas = Object.create(user, {configurable: true, writable: true})
        setUserDetails({...user})
        setDob(new Date(user.dob))
        dispatch( getDefaultAddress({id: user._id}) )
      }
    }
    getUserDefaultAddress()
    dispatch(resetAddressStates())
    dispatch(resetUserStates())
  },[])

  useEffect(()=> {
    if(currentDefaultAddress){
      setAddressDetails({...currentDefaultAddress})
    }
  },[currentDefaultAddress])

  useEffect(()=> {
    if(gender){
      setUserDetails(userDetails=> ( {...userDetails, gender} ))
    }
    if(dob){
      console.log("DOB-->",dob)
      console.log("new Date(dob)-->",new Date(dob))
      setUserDetails(userDetails=> ( {...userDetails, dob: new Date(dob)} ))
    }
    if(addressType){
      setAddressDetails(addressDetails=> ( {...addressDetails, type: addressType} ))
    }
  },[gender, dob, addressType])

  useEffect(()=> {
    if(Object.keys(userDetails).length){

    } 
    if(Object.keys(addressDetails).length){
      
    }
  },[userDetails, addressDetails])

  useEffect(()=> {
    if(userUpdated && addressUpdated){
      toast.success('The details have been succesfully Updated!')
      dispatch(resetAddressStates())
      dispatch(resetUserStates())
    }
  },[userUpdated, addressUpdated])

  const personalnfoTypes = [
    {type: 'firstName', Icon: User, optionalField: true}, {type: 'lastName', optionalField: true}, {type: 'username'},
    {type:'email', Icon: Mail}, {type:'mobile', Icon: Phone}
  ]

  const addressInfoTypes = [
    {type: 'street' , Icon: MapPin}, {type: 'district'} , {type: 'state'}, {type: 'pincode'},
    {type: 'landmark', Icon: MapPinHouse, optionalField: true}, {type: 'alternateMobile', Icon: Phone, optionalField: true}
  ]

  const headerBg = {
    backgroundImage: "url('/header-bg.png')",
    backgrounSize: 'cover'
  }

  const toggleDropdown = (dropdownKey)=> {
    setOpenDropdowns((prevState)=>
      Object.keys(prevState).reduce((newState, key)=> {
        newState[key] = key === dropdownKey? !prevState[key] : false
        return newState
      }, {})
    )
  }

  const inputBlurHandler = (e, fieldName, options, detailType)=>{
    console.log("inside inputBlurHandler, fieldname", fieldName)
    if(fieldName){
       const value = e.target.value
       const statusObj = (options?.optionalField) ? handleInputValidation(fieldName, value, {optionalField: true}) : handleInputValidation(fieldName, value)
       console.log("statusObj from inputBlurHandler--> ", JSON.stringify(statusObj))
       if(!statusObj.error && statusObj.message.startsWith("Optional")){
           console.log("Inside here----")
           e.target.nextElementSibling.textContent = ''
           e.target.style.borderColor = primaryColor.current
           return
       }
       if(statusObj.error){
           const message = statusObj.message
           const newDetails = detailType === 'personal' ? 
                displayErrorAndReturnNewFormData(e, message, userDetails, fieldName) : displayErrorAndReturnNewFormData(e, message, addressDetails, fieldName)
           detailType === 'personal' ? setUserDetails(newDetails) : setAddressDetails(newDetails)
       }else{
           displaySuccess(e)
       }
    }
  }

  const handleSave = () => {
    setEditing(false)
    if(user){
      dispatch( updateUserDetails({userDetails}) )
    }
    if(user && currentDefaultAddress){
      dispatch( editAddress({id: user._id, addressId: addressDetails._id, addressData: addressDetails}) )
    }
  }
  
  const InputFieldsGenerator = (infoTypes, detailType)=> {

    return(
      infoTypes.map(infoType=> (
        <div key={infoType.type}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
             { camelToCapitalizedWords(infoType.type) } 
          </label>
          <div className={`${infoType?.Icon ? 'relative' : ''}`}>
              <input type="text" value={detailType === 'personal' ? userDetails[infoType.type] : addressDetails[infoType.type]} 
                disabled={!editing} className={`w-full px-4 py-2 capitalize ${editing ? 'text-secondary' : 'text-muted'}
                ${infoType?.Icon ? 'pl-10' : ''} text-[13px] rounded-lg border border-gray-300 focus:ring-2
                   focus:ring-purple-600 focus:border-transparent disabled:bg-gray-50`} id={infoType.type}
                      onChange={(e)=> detailType === 'personal' ? setUserDetails({ ...userDetails, [infoType.type]: e.target.value }) 
                                        : setAddressDetails({ ...addressDetails, [infoType.type]: e.target.value })}
                        onBlur={(e)=> infoType?.optionalField ? inputBlurHandler(e, infoType.type, {optionalField: true}, detailType)
                                     : inputBlurHandler(e, infoType.type, detailType)}/>
              {infoType?.Icon && <infoType.Icon className="absolute left-3 top-[14px] w-4 h-4 text-gray-400"/> }
              <p className='mt-[3px] h-[7px] text-[10px] text-red-500 visible tracking-[0.2px] error' ref={errorRef}
                  onClick={(e)=> { console.log("Clicked error..."); infoType?.optionalField ? cancelErrorState(e, primaryColor.current, {optionalField: true})
                      : cancelErrorState(e, primaryColor.current)}}></p>
          </div>
        </div>
      )
    ))
  }


  

    return(
        <section id='UserAccountPage'>
            <header style={headerBg}>
        
                <Header />
        
            </header>
        
            <BreadcrumbBar heading='Account'/>
        
            <main className='flex gap-[2rem] px-[4rem] mb-[10rem]'>

                <div className='basis-[15%]'>
                            
                    <UserSidebar />
        
                </div>
                <div className='basis-[75%] mt-[2rem] content-tile'>

                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

                    <div className="pt-[2rem] px-8 pb-8">
                      <div className="flex justify-between items-center mb-8">
                        <h1 className="text-[30px] text-secondary font-bold tracking-[0.5px]">Account Details</h1>
                        {!editing ? (
                          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-[15px] text-white font-[500] rounded-lg
                           hover:bg-purple-700 transition-colors" onClick={()=> setEditing(true)}>
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-[15px] text-white rounded-lg
                              hover:bg-green-700 transition-colors"  onClick={handleSave}>
                                  <Check className="w-[15px] h-[15px]" />
                                  Save
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-[15px] text-white rounded-lg
                               hover:bg-gray-700 transition-colors"  onClick={() => setEditing(false)}>
                                  <X className="w-[15px] h-[15px]" />
                                  Cancel
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id='personal-details'>
                        <div className="space-y-6">
                          <h2 className="text-[20px] font-semibold text-gray-900">Personal Information</h2>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              {
                                InputFieldsGenerator(personalnfoTypes.slice(0,2), 'personal')
                              }
                            </div>
                            {
                              InputFieldsGenerator(personalnfoTypes.slice(2), 'personal')
                            }
                            <div className="grid grid-cols-2 gap-4">
                              <div className='w-full dob'>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Date Of Birth
                                </label>
                                <div className={`relative ${!editing ? 'bg-gray-50' : ''}`}>
                                  <SingleDateSelector date={dob} setDate={setDob} placeholderText={`${editing ? 'Select your DOB' : ''}`} isDisabled={!editing}
                                      value={ (userDetails.dob ) || dob}/>
                                  { !editing && (<div className='absolute top-0 left-0 w-full h-full bg-transparent'></div>) }
                                </div>
                              </div>
                              <div className='h-[63%]'>
                                <span className="block text-sm font-medium text-gray-700 mb-1"> Gender </span>
                                <div className={`relative w-full h-full px-4 py-2 flex justify-between items-center rounded-lg border 
                                  border-gray-300 ${!editing ? 'bg-gray-50' : ''} cursor-pointer`} 
                                      onClick={()=> editing && toggleDropdown('genderDropdown')} ref={dropdownRefs.genderDropdown} >
                                    <span className={`text-[13px]  ${editing ? 'text-secondary' : 'text-muted'}`}>
                                      { (gender && camelToCapitalizedWords(gender)) || userDetails?.gender && camelToCapitalizedWords(userDetails.gender)} 
                                    </span>
                                    <i className=''> <RiArrowDropDownLine/> </i>
                                    {
                                      openDropdowns.genderDropdown &&
                                      <ul className='absolute top-[43px] left-0 list-none w-full h-fit bg-white border border-dropdownBorder
                                       rounded-[6px] py-[8px] pl-[10px] pr-[2px] text-[14px] cursor-pointer'>
                                        <li className='hover:text-secondary' onClick={()=> setGender('male')}> 
                                          Male 
                                        </li>
                                        <li className='hover:text-secondary' onClick={()=> setGender('female')}> 
                                          Female
                                        </li>
                                      </ul>
                                    }
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                                  
                        <div className="space-y-6">
                          <h2 className="text-[20px] font-semibold text-gray-900">Default Address Information</h2>
                          <div className="space-y-4">
                          {
                            InputFieldsGenerator(addressInfoTypes.slice(0,1), 'address')
                          }
                            <div className="grid grid-cols-2 gap-4">
                              {
                                InputFieldsGenerator(addressInfoTypes.slice(1,3), 'address')
                              }
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              {
                                InputFieldsGenerator(addressInfoTypes.slice(3,5), 'address')
                              }
                            </div>
                            <div className='h-[100%]'>
                                <span className="block text-sm font-medium text-gray-700 mb-1"> Address Type </span>
                                <div className={`relative w-full h-full mb-[21px] px-4 py-[12px] flex justify-between items-center rounded-lg border 
                                  border-gray-300 ${!editing ? 'bg-gray-50' : ''} cursor-pointer`}
                                      onClick={()=> editing && toggleDropdown('addressDropdown')} ref={dropdownRefs.addressDropdown}>
                                    <span className={`text-[13px]  ${editing ? 'text-secondary' : 'text-muted'}`}>
                                      { (addressType && camelToCapitalizedWords(addressType)) || addressDetails?.type && camelToCapitalizedWords(addressDetails.type) } 
                                    </span>
                                    <i className=''> <RiArrowDropDownLine/> </i>
                                    {
                                      openDropdowns.addressDropdown &&
                                      <ul className='absolute top-[47px] left-0 list-none w-full h-fit bg-white border border-dropdownBorder
                                       rounded-[6px] py-[8px] pl-[10px] pr-[2px] text-[14px] z-[5] cursor-pointer'>
                                        {
                                          allAddressTypes.map(type=> (
                                            <li className='hover:text-secondary' onClick={()=> setAddressType(type)}> 
                                              { (type && camelToCapitalizedWords(type)) } 
                                            </li>
                                          ))
                                        }
                                      </ul>
                                    }
                                </div>
                              </div>
                              {
                                InputFieldsGenerator(addressInfoTypes.slice(5), 'address')
                              }
                          </div>
                        </div>
                      </div>
                            
                      <div className="mt-8 pt-8 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <h2 className="text-[20px] font-semibold text-gray-900">Security</h2>
                            <p className="text-sm text-gray-500 mt-1">Change your password </p>
                          </div>
                          <button className="flex items-center gap-2 px-4 py-2 border border-secondaryLight2 rounded-lg
                             hover:bg-secondary hover:text-white transition-colors">
                            <Lock className="w-4 h-4" />
                            Change Password
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

            </main>

            <Footer />

        </section>
    )
}