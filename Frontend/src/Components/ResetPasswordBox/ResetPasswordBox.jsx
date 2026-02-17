import React, {useState, useEffect} from "react"
import {Link} from 'react-router-dom'

import {Check, AlertCircle, Eye, EyeOff} from "lucide-react"
import {toast as sonnerToast} from 'sonner'
import apiClient from "../../Api/apiClient"

import {SiteSecondaryFillImpButton} from '../SiteButtons/SiteButtons'
import {CustomHashLoader} from '../Loader/Loader'


export default function ResetPasswordBox({setOpenSecurityMenu, admin}){

  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })
  const [showPasswords, setShowPasswords] = useState({current:false, new: false, confirm: false})
  const [requirements, setRequirements] = useState({uppercase: false, specialChars: false, number: false, length: false})
  const [passwordsMatch, setPasswordsMatch] = useState(true)

  const [error, setError] = useState({current: false, new: false, confirm: false, value:''})
  const [loading, setLoading] = useState(false)

  const requirementSubtitles = [
    {value: 'At least 1 upper case letter (A-Z)', requirement: requirements.uppercase},
    {value: 'At least 1 special character(@#$%^&*,etc)', requirement: requirements.specialChars},
    {value: 'At least 1 number (0-9)', requirement: requirements.number},
    {value: 'At least 5 characters', requirement: requirements.length},
  ]

  useEffect(()=> {
    setRequirements({
      uppercase: /[A-Z]/.test(passwords.new),
      specialChars: /[!@#$%^&*]/.test(passwords.new),
      number: /[0-9]/.test(passwords.new),
      length: passwords.new.length >= 5,
    })
    setPasswordsMatch(passwords.new === passwords.confirm || passwords.confirm === "")
  }, [passwords])

  useEffect(()=> {
    if(error.value && error.value.toLowerCase().includes('current')){
      setTimeout(()=> setError(error=> (
        {...error, current: false, value: ''}
      )), 6500)
    }
  },[error])

  const togglePasswordVisibility = (field)=> {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const checkError = (e, type)=> {
    const value = e.target.value.trim()
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[`~@#$%^&*()\-+={}[\]|:;"'<>,.?/_])[A-Za-z\d`~@#$%^&*()\-+={}[\]|:;"'<>,.?/_]{5,}$/
    if(value!=='' && !passwordPattern.test(value)){
      setError(error=> (
        {...error, [type]: true, value: "The password doesn't follow the given mandatory conditions!"}
      ))
    }else{
      setError(error=> (
        {...error, [type]: false, value: ''}
      ))
      return
    } 
  }

  const focusHandler = ()=> {
    if(error.value && error.value.toLowerCase().includes('current')){
      setError(error=> (
        {...error, current: false, value: ''}
      ))
    }
  }

  const submitPassword = async(e)=> {
    e.preventDefault()
    if (passwordsMatch && Object.values(requirements).every(Boolean)){
      setLoading(true)
      setError({new: false, confirm: false, value:''})

      try{
        let response = null
        if(admin) {
            response = await apiClient.post(`/admin/password/update`, {
                currentPassword: passwords.current, newPassword: passwords.new, confirmPassword: passwords.confirm
            })
        }else{
            response = await apiClient.post(`/password/update`, {
                currentPassword: passwords.current, newPassword: passwords.new, confirmPassword: passwords.confirm
            })
        }
        if(response.data.message.includes('success')){
          setOpenSecurityMenu(false)
          sonnerToast.success("Your password is successfully updated!")
        }
      }
      catch(error){
        if (!error.response) {
          sonnerToast.error("Network error. Please check your internet and try again.")
        }else if (error.response?.status === 400 ||error.response?.status === 401) {
          sonnerToast.error(error.response.data.message || "Error while resetting password. Please try again")
          const errorMessage = error.response.data.message
          if(errorMessage.toLowerCase().includes("current password is incorrect")){
            setError( {current: true, value: "The Current Pasword is wrong!"} )
            }
        } else {
          sonnerToast.error("Internal server error! Please retry later.")
        }
      }
      finally {
        setLoading(false)
      }
    }
  }


  return (
      <main className="p-8 w-full bg-white flex justify-between rounded-3xl">
        {/* <h1 className="text-[15px] font-bold text-[#2d1b69] mb-8">Change your password</h1> */}
        <div className="w-full flex justify-between">
        <form onSubmit={(e)=> submitPassword(e)} className="flex flex-col gap-[1.5rem] basis-[40%]">

        <div className="relative flex flex-col gap-[7px]">
            <input id="currentPassword" type={showPasswords.current ? "text" : "password"} value={passwords.current} placeholder="Current Password"
              className={`peer w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-secondary focus:outline-none
                    ${error.value.toLocaleLowerCase().includes('current') && "border-red-500 focus:ring-red-200"} 
                        focus:ring-2 focus:border-secondary focus:placeholder-transparent`} 
                          onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))}
                            onFocus={focusHandler}/>
            <label htmlFor="currentPassword"
              className={`absolute left-4 text-gray-500 text-[15px] transition-all duration-200  
                 ${passwords.current.length > 0 ? '-top-3' : 
                  'peer-placeholder-shown:top-3 peer-focus:-top-3 peer-placeholder-shown:text-base peer-focus:text-xs peer-focus:text-secondary'}
                peer-focus:bg-white peer-focus:px-1 text-xs bg-white px-1 cursor-text`}>
              Current Password
            </label>
            <button type="button" onClick={()=> togglePasswordVisibility("current")} className="absolute right-3 top-[43%]
             transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {error.value.toLocaleLowerCase().includes('current') &&
              <AlertCircle className="absolute right-12 top-[43%] transform -translate-y-1/2 text-red-500 w-5 h-5" />
            }
            <p className='w-full mt-[5px] h-[5px] text-center text-red-500 text-[10px] tracking-[0.2px] whitespace-nowrap'>
              {error.current && error.value} 
            </p>
          </div>

          <div className="relative">
            <input id="newPassword" type={showPasswords.new ? "text" : "password"} value={passwords.new} placeholder="New Password"
              className={`peer w-full px-4 py-3 rounded-lg border ${Object.values(requirements).every(Boolean)
                  ? "border-green-500 focus:ring-green-200" : "border-gray-300 focus:ring-secondary"} focus:outline-none
                     focus:ring-2 focus:border-secondary focus:placeholder-transparent`} 
                      onChange={(e) => setPasswords((prev) => ({ ...prev, new: e.target.value }))} onBlur={(e)=> checkError(e,'new')}/>
            <label htmlFor="newPassword"
              className={`absolute left-4 text-gray-500 text-[15px] transition-all duration-200  
                 ${passwords.new.length > 0 ? '-top-3' : 
                  'peer-placeholder-shown:top-3 peer-focus:-top-3 peer-placeholder-shown:text-base peer-focus:text-xs peer-focus:text-secondary'}
                peer-focus:bg-white peer-focus:px-1 text-xs bg-white px-1 cursor-text`}>
              New Password
            </label>
            <button type="button" onClick={()=> togglePasswordVisibility("new")} className="absolute right-3 top-[43%]
             transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {Object.values(requirements).every(Boolean) && (
              <Check className="absolute right-12 top-[43%] transform -translate-y-1/2 text-green-500 w-5 h-5" />
            )}
            <p className='w-full mt-[5px] h-[5px] text-center text-red-500 text-[10px] tracking-[0.2px] whitespace-nowrap'>
              {error.new && error.value} 
            </p>
          </div>

          <div className="relative">
            <input id="confirmPassword" type={showPasswords.confirm ? "text" : "password"} value={passwords.confirm} placeholder="Confirm New Password"
                className={`peer w-full px-4 py-3 placeholder:text-[15px] rounded-lg border ${passwords.confirm &&
                    (passwordsMatch ? "border-green-500 focus:ring-green-200" : "border-red-500 focus:ring-red-200")
                  } focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary focus:placeholder-transparent`}
              onChange={(e)=> setPasswords((prev) => ({ ...prev, confirm: e.target.value }))}  onBlur={(e)=> checkError(e, 'confirm')} />
            <label htmlFor="confirmPassword" className={`absolute left-4 text-gray-500 text-[15px] transition-all duration-200 
                ${passwords.confirm.length > 0 ? '-top-3' : 
                  'peer-placeholder-shown:top-3 peer-focus:-top-3 peer-placeholder-shown:text-base peer-focus:text-xs peer-focus:text-secondary'}
                  peer-focus:bg-white peer-focus:px-1 -top-3 text-xs bg-white px-1 cursor-text`}>
              Confirm New Password
            </label>
            <button type="button" className="absolute right-3 top-[43%] transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => togglePasswordVisibility("confirm")}>
              {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {passwords.confirm &&
              (passwordsMatch ? (
                <Check className="absolute right-12 top-[43%] transform -translate-y-1/2 text-green-500 w-5 h-5" />
              ) : (
                <AlertCircle className="absolute right-12 top-[43%] transform -translate-y-1/2 text-red-500 w-5 h-5" />
              ))}
            <p className='mt-[5px] h-[5px] w-full text-center text-red-500 text-[10px] tracking-[0.2px] whitespace-nowrap'>
             {error.confirm && error.value} 
            </p>
          </div>

          <div>
          {
            !admin &&
                <Link to='/forgot-password' className='ml-[3xp] text-[12px] text-secondary tracking-[0.2x] hover:underline cursor-pointer'>
                  Forgot Password? 
                </Link>
          }
          <SiteSecondaryFillImpButton 
            className='mt-[5xp] disabled:opacity-80 disabled:cursor-not-allowed' customStyle={{marginTop: '5px'}}
            isDisabled={!passwordsMatch || !Object.values(requirements).every(Boolean)} 
            shouldSubmit={true}
          >
            { loading? <CustomHashLoader loading={loading}/> : admin ? 'Change Password' : 'Change my Password' }  
          </SiteSecondaryFillImpButton>

          <SiteSecondaryFillImpButton variant='outline' clickHandler={()=> setOpenSecurityMenu(false)}>
              Cancel
          </SiteSecondaryFillImpButton>
          </div>

          {
            !passwordsMatch && passwords.confirm && 
            <p className="mt-[-22px] w-full h-[15px] text-center text-red-500 text-[12px] font-[500] tracking-[0.2px] whitespace-nowrap">
              Passwords do not match!
              </p>
          }

          </form>
              
            <ul className="space-y-2">
              <h2 className="font-semibold text-secondary mb-2">Password must contain:</h2>
            {
              requirementSubtitles.map(subtitle=> (
                <li className={`flex items-center gap-2 ${subtitle.requirement ? "text-green-500 line-through" : "text-gray-600"}`}>
                  <Check className="w-4 h-4" />
                  {subtitle.value}
                </li>
              ))
            }
            </ul>

          </div>

      </main>
  )
}


