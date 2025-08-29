import React, {useState, useEffect, useRef}  from 'react'
import './ForgotAndResetPasswordPage.css'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'

import {Eye, EyeOff} from 'lucide-react'
import {toast} from 'react-toastify'

import Header from '../../../Components/Header/Header'
import Footer from '../../../Components/Footer/Footer'
import {SiteButtonSquare, SiteSecondaryFillImpButton} from '../../../Components/SiteButtons/SiteButtons'
import {CustomHashLoader} from '../../../Components/Loader/Loader'


export default function ForgotAndResetPasswordPage(){

    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [phase, setPhase] = useState({timerPhase: false, resetPhase: false})

    const [code, setCode] = useState(null)
    const [error, setError] = useState('')
    const [verificationError, setVerificationError] = useState(false)
    const [codeBoxDisabled, setCodeBoxDisabled] = useState(false)

    const inputRef = useRef(null)

    const [resendState, setResendState] = useState(false)

    const [timer, setTimer] = useState(1)
    const [minutes, setMinutes] = useState('')
    let timerId = useRef(null)

    const [passwords, setPasswords] = useState({newPass: '', confirmPass: '' })
    const [showPasswords, setShowPasswords] = useState({newPass: false, confirmPass: false})

    const navigate = useNavigate()

    const baseApiUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(()=>{
        console.log("email is --->", email)
        console.log("Passwords--->",JSON.stringify(passwords))
    }, [email, passwords])

    useEffect(()=> {
        if(timer === 0 && !phase.resetPhase && !resendState){
            setVerificationError(true)
            setError("Timeout; Code is expired! Click 'resend again' to resend the Code again to your mail")
        }
        setMinutes(convertToMinutes(timer))
    }, [timer])

    useEffect(()=> {
        console.log("Code is--->", code)
    },[code])

    useEffect(()=> {
      if(error.toLowerCase().includes('timeout')){
        setTimeout(()=> {
          setError('')
          setPhase({...phase, timerPhase: false})
        }, 4000)
      }
      else setTimeout(()=> setError(''), 2500)
    },[error])

    const bgImg = {
        backgroundImage:"url('/ForgotPasswordBg.png')",
        backgroundSize:"cover"
    }

    const regexPatterns = {
        emailPattern: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,10})([\.a-z]?)$/,
        passwordPattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[`~@#$%^&*()\-+={}\\/;:"'|,.?<>])[a-zA-Z\d`~@#$%^&*()\-+={}\\/;:"'|,.\?<>]{5,}/
    }

    const submitEmail = async(e)=> {
        e.preventDefault()

        if(!regexPatterns.emailPattern.test(email)){
          setError("Please enter a valid email Id!")
          setVerificationError(true)
          setLoading(false)
          return
        }
        else{
            setError('')
            setVerificationError(false)
            setResendState(false)
            setLoading(true)
            console.log('Password reset requested for:', email)

            try{
              const response = await axios.post(`${baseApiUrl}/sendOt`, {email}, {withCredentials:true})
              if(response){
                  console.log("Timer Starting...")
                  setPhase({...phase, timerPhase: true})
                  inputRef.current.value = '';
                  startTimer()
                  // setResetPhase(true)
                  setLoading(false)
                }
              }catch(error){
              console.log("Error during sending Code...", error.message)
              setLoading(false)
              } 
        }    
    }

    const startTimer = ()=> {
        setTimer(5 * 60 * 1000)
        timerId.current = setInterval(() => {
            setTimer(prevCount => {
                if (prevCount <= 1000) {
                    clearInterval(timerId.current)
                    console.log("Time Over!")
                    setError("Timeout; Code is expired!")
                    return 0
                } else {
                    console.log(`Countdown: ${prevCount - 1000} seconds remaining`)
                    return prevCount - 1000
                }
            });
        }, 1000)
    }

    const stopTimer = ()=> {
        setPhase({...phase, timerPhase: false})
        setTimer(0)
        clearInterval(timerId.current)
    }

    const convertToMinutes = (millisecs) => {
        const totalSeconds = Math.floor(millisecs / 1000)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds
        return `${formattedMinutes}:${formattedSeconds} min`;
    }

    const submitCode = async(e)=>{
        e.preventDefault()
        console.log("Inside submitCode...")
        console.log("Code-->", code)
        setLoading(true)
        if( !/^\d{5}$/.test(code.trim()) ){
          console.log("Input Code is not a valid 5-digit number!")
          setVerificationError(true)
          setError("Please enter a valid 5-digit Code!")
          setLoading(false)
          return
      }else{
            console.log("Submitting Code.....")
            try{
                const response = await axios.post(`${baseApiUrl}/verifyOtp`, {otp: code, email, updateUser: false}, {withCredentials: true})
                console.log("RESPONSE from verifyOtp---->", response)
                console.log("RESPONSE from verifyOtp in JSON---->", JSON.stringify(response))
                if(response.data.message.includes('success')){
                    stopTimer()
                    setError('')
                    setVerificationError(false)
                    setCodeBoxDisabled(false)
                    toast.success("You are successfully verified!")
                    console.log("You are successfully verified!")
                    setLoading(false)
                    setPhase({...phase, resetPhase: true})    
                }
            }
            catch(error){
                setLoading(false)
                console.log("error from  frontend--->", error.message)
                const errorMessage = error.response.data.message.toLowerCase()
                if(errorMessage.includes('invalid')){
                    console.log("INAVLID Code from frontend")
                    toast.error("Invalid Code!")
                    setError("Inavlid Code. Please click 'resend again' to try again!")
                    setCode(null)
                    setVerificationError(true)
                }
                if(errorMessage.includes('expired')){
                    console.log("Code is expired!")
                    toast.error("Code is expired!")
                    setError("The Code is no longer valid. Please click 'resend again' to try again!")
                    setCode(null)
                    setVerificationError(true)
                    setCodeBoxDisabled(true)
                }
            }   
        }
    }

    const cancelVerification = ()=> {
        setCode(null)
        setLoading(false)
        stopTimer()
        navigate('/', {replace: true})
      }

    const resendCode = async()=> {
        console.log("Inside resendCode()--")
        setCode(null)
        setLoading(true)
        stopTimer()
        setError('')
        setVerificationError(false)
        setCodeBoxDisabled(false)
        setResendState(true)
        const response = await axios.post(`${baseApiUrl}/sendOtp`, {email}, {withCredentials:true});
        if(response){
            console.log("Timer Restarting...")
            startTimer()
            setLoading(false)
            setResendState(false)
            setPhase({...phase, timerPhase: true})    
        }
    }
    
    const togglePasswordVisibility = (field)=> {
      setShowPasswords(prev=> ({ ...prev, [field]: !prev[field] }))
    }

    const submitPassword = async(e)=> {
      e.preventDefault()
      setLoading(true)

      if(passwords.newPass !== passwords.confirmPass){
        setVerificationError(true)
        setError("The passwords doesn't match")
        setLoading(false)
        return
      }
      if(!regexPatterns.passwordPattern.test(passwords.newPass)){
        setVerificationError(true)
        setError("Password should have atleast a special characteer and a number. Must have atleast 5 letters!")
        setLoading(false)
        return
      }
      else{
        try{
          console.log("{newPassword: passwords.newPass}--->", JSON.stringify({newPassword: passwords.newPass}))
          const response = await axios.post(`${baseApiUrl}/password/reset`, {newPassword: passwords.newPass}, {withCredentials:true})
          if(response.data.message.includes('success')){
            setError('')
            setVerificationError(false)
            toast.success("Your password is successfully updated!")
            console.log("Your password is successfully updated!")
            setLoading(false)
            navigate('/signin', {replace: true})
            } 
        }
        catch(error){
          setLoading(false)
          console.log("error from  frontend--->", error.message)
        }
      }
    }
    

    
    return(

        <>
            <section style={bgImg} className='h-[130vh] pt-[1rem]' id="ForgotAndResetPasswordPage">

                <header>
                
                  <Header/>
                                
                </header>
                
                <main className='transform translate-x-[-50%] translate-y-[-50%] absolute top-[50%] left-[50%] w-[35%]
                                 rounded-[22px] px-[50px] ' style={{marginBlock:'3%'}}>
                    <div className="w-full max-w-md rounded-[22px] p-8 container">
                      <h1 className="text-[2rem] font-funCity font-bold text-secondary text-center mb-8">
                        { !phase.resetPhase ? 'FORGOT PASSWORD' : 'RESET PASSWORD' }
                      </h1>
                    
                      {
                        !phase.resetPhase ?
                            <form  className="flex flex-col gap-[1rem]" onSubmit={(e)=> !phase.timerPhase ? submitEmail(e) : submitCode(e)}>  
                                <div className="space-y-2">
                                  <label htmlFor="input" className="block text-gray-600 text-sm tracking-[0.3px]">
                                    {!phase.timerPhase ? "Enter your Email Address" : "Enter the Code sent to your Email Address" }
                                  </label>
                                  <input type="text" id="input" placeholder={ !phase.timerPhase ? "Email address" : "Enter Code" }
                                     required className={`w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-secondary 
                                       text-[13px] placeholder:text-muted placeholder:text-[11px] focus:outline-none focus:border
                                        focus:border-secondary focus:ring-1 focus:ring-secondary 
                                            ${verificationError? 'border-red-500 bg-red-200' : 'border-gray-200'}`}
                                              disabled={codeBoxDisabled} ref={inputRef}
                                                onChange={(e)=> {!phase.timerPhase ? setEmail(e.target.value) : setCode(e.target.value)}}/>
                                </div>

                                <SiteButtonSquare tailwindClasses={`w-full ${!loading && 'hover:bg-primaryDark'}`} shouldSubmit={true}>
                                   { loading? <CustomHashLoader loading={loading}/> : !phase.timerPhase ? 'Send Code' : 'Verify Code' }  
                                </SiteButtonSquare>
                                
                                <p className='mt-[-7px] w-full h-[15px] text-center text-red-500 text-[10px]
                                      tracking-[0.2px] whitespace-nowrap'>
                                   {error} 
                                </p>
                                {
                                  resendState &&
                                  <p className='w-full text-center text-secondary text-[12px]
                                    tracking-[0.2px] whitespace-nowrap'>
                                      Sending code to  
                                    <span className='inline-block font-[500]'> {email + '....'} </span>
                                  </p>
                                }

                                {   
                                phase.timerPhase ? 
                                    !codeBoxDisabled &&
                                    <>  
                                        <h5 className='mt-[-12px] w-full text-[12.5px] text-[rgb(238,68,,68)] text-center'> Haven't received the Code yet? 
                                            <span className='ml-[5px] text-secondary cursor-pointer hover:underline' 
                                                onClick={resendCode}>Resend again</span>
                                        </h5>

                                        <SiteSecondaryFillImpButton className='text-[15px]' customStyle={{marginTop:'0.5rem'}} 
                                          clickHandler={()=> cancelVerification()}>
                                            Cancel and Reset Later
                                        </SiteSecondaryFillImpButton>

                                        <h5 className='w-full text-[12.5px] text-[rgb(238,68,,68)] text-center tracking-[0.3px]'> 
                                            {timer? 'The Code will expire in ' : 'The Code is expired'}
                                        <span className='mr-[5px] text-secondary tracking-[0.5px]'> {timer? minutes : null} </span>
                                        </h5>  
                                        <p className='mt-[5px] w-full text-center text-gray-600 text-[11px] tracking-[0.2px]'>
                                            <span className='mr-[5px] text-red-500'>Important: </span>
                                            Please avoid using the back button during Code verification to ensure a smooth and uninterrupted process.
                                        </p>
                                    </> : null
                                }
                            </form> : 

                            <form onSubmit={(e)=> submitPassword(e)}>
                              <div className="space-y-2">
                                <label htmlFor="newPassword" className="block text-gray-600 text-sm tracking-[0.3px]">
                                  New Password
                                </label>
                                <div className="relative">
                                  <input id="newPassword" type={showPasswords.newPass ? 'text' : 'password'} value={passwords.newPass}
                                    className={`w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-secondary 
                                       text-[13px] placeholder:text-muted placeholder:text-[11px] focus:outline-none focus:border
                                        focus:border-secondary focus:ring-1 focus:ring-secondary 
                                            ${verificationError? 'border-red-500 bg-red-200' : 'border-gray-200'}`} required
                                            onChange={(e) => setPasswords(prev => ({...prev, newPass: e.target.value}))} />
                                  <button type="button"className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400
                                      hover:text-gray-600" onClick={() => togglePasswordVisibility('newPass')}>
                                    { showPasswords.newPass ? ( <EyeOff className="h-5 w-5" /> ) : ( <Eye className="h-5 w-5" /> ) }
                                  </button>
                                </div>
                              </div>
                          
                              <div className="space-y-2 mt-[1rem]">
                                <label htmlFor="confirmPassword" className="block text-gray-600 text-sm tracking-[0.3px]">
                                  Confirm New Password
                                </label>
                                <div className="relative">
                                  <input id="confirmPassword" type={showPasswords.confirmPass ? 'text' : 'password'} required
                                    value={passwords.confirmPass} className={`w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-secondary 
                                      text-[13px] placeholder:text-muted placeholder:text-[11px] focus:outline-none focus:border
                                       focus:border-secondary focus:ring-1 focus:ring-secondary 
                                           ${verificationError? 'border-red-500 bg-red-200' : 'border-gray-200'}`}
                                        onChange={(e) => setPasswords(prev => ({ ...prev, confirmPass: e.target.value }))} />
                                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400
                                     hover:text-gray-600" onClick={() => togglePasswordVisibility('confirmPass')} >
                                    { showPasswords.confirmPass ? ( <EyeOff className="h-5 w-5" /> ) : ( <Eye className="h-5 w-5" /> )}
                                  </button>
                                </div>
                              </div>

                              <p className='mt-[10px] mb-[5px] w-full h-[15px] text-center text-red-500 text-[10px]
                                tracking-[0.2px]'>
                                   {error} 
                              </p>

                              <SiteButtonSquare tailwindClasses={`mt-[14px] w-full ${!loading && 'hover:bg-primaryDark'} 
                                  transition-colors duration-200`}   shouldSubmit={true}>
                                   { loading? <CustomHashLoader loading={loading}/> : 'Submit' }  
                              </SiteButtonSquare>
                              
                            </form>
                      }
                        
                      {
                        (!phase.timerPhase || phase.resetPhase) &&
                        <>
                        <div className="mt-6 text-center space-y-2">
                        <p className="text-gray-600 text-sm">
                          Already have an account?{' '}
                          <Link to="/signin" className="text-secondary hover:underline">
                            Sign In
                          </Link>
                        </p>
                        <p className="text-gray-600 text-sm">
                          Don't have an account yet?{' '}
                          <Link to="/signup" className="text-secondary hover:underline">
                            Sign Up
                          </Link>
                        </p>
                      </div>
                        
                      <p className="mt-8 text-center text-[12px] text-gray-600" style={{wordSpacing: '0.3px'}}>
                        You may contact{' '}
                        <Link to="/support" className="text-secondary hover:underline">
                          Customer Service
                        </Link>{' '}
                        for help restoring access to your account.
                      </p>
                      </>
                      }
                    </div>
                </main>
            </section>
            <Footer/>
        </>

    )
}