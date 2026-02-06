import React,{useState, useEffect, useRef} from 'react'
import './OtpVerificationPage.css'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import axios from 'axios'
import {useDispatch, useSelector} from 'react-redux'
import {motion, AnimatePresence} from 'framer-motion'

import {toast as sonnerToast} from 'sonner'
import {toast} from 'react-toastify'
import {IoMail} from "react-icons/io5"

import OtpBoxGenerator from './OtpBoxGenerator'
import {SiteButtonSquare, SiteSecondaryBorderButtonSquare} from '../../../Components/SiteButtons/SiteButtons'
import {CustomHashLoader, CustomPacmanLoader} from '../../../Components/Loader/Loader'
import {makeUserVerified} from '../../../Slices/userSlice'
import Header from '../../../Components/Header/Header'
import Footer from '../../../Components/Footer/Footer'


export default function OtpVerificationPage(){

    const [values, setvalues] = useState({})
    const [otp, setOtp] = useState(null)
    const [error, setError] = useState('')
    const [verificationError, setVerificationError] = useState(false)
    const [otpBoxDisabled, setOtpBoxDisabled] = useState(false)

    const [cancelAllowed, setCancelAllowed] = useState(true)

    const [resendState, setResendState] = useState(false)

    const [loading, setLoading] = useState(false)

    const [timer, setTimer] = useState(1)
    const [minutes, setMinutes] = useState('')
    let timerId = useRef(null)

    const [userEmail, setUserEmail] = useState('')

    const {user} = useSelector((state)=> state.user)

    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const baseApiUrl = import.meta.env.VITE_API_BASE_URL

    const bgImg = {
        backgroundImage:"url('/otp-bg.png')",
    }

    const [bgLoaded, setBgLoaded] = useState(false)

    useEffect(()=> {
      const img = new Image()
      img.src = "/otp-bg.png" 
      img.onload = ()=> setBgLoaded(true)
    }, [])

    useEffect(()=> {
        if(location){
            console.log("location.state.email---->", location?.state?.email)
            setUserEmail(location?.state?.email)
            setCancelAllowed(location.state?.from === 'signup' ? true : false)
            startTimer()
        }
        if(timerId.current) return () => clearInterval(timerId.current)
    },[location])

    useEffect(()=> {
        if(timer === 0 && !resendState){
            setVerificationError(true)
            setError("Timeout; OTP is expired! Click 'resend again' to resend the OTP again to your mail")
        }
        setMinutes(convertToMinutes(timer))
    },[timer])

    useEffect(()=> {
        if(Object.keys(values).length){
            console.log("Values are--->", JSON.stringify(values))
            const otpValues = Object.values(values).join('')
            setOtp(otpValues)
        }
    },[values])

    useEffect(()=> {
        console.log("OTP is--->", JSON.stringify(otp))
    },[otp])

    const startTimer = ()=> {
        setTimer(5 * 60 * 1000)
        timerId.current = setInterval(() => {
            setTimer(prevCount => {
                if (prevCount <= 1000) {
                    clearInterval(timerId.current)
                    console.log("Time Over!")
                    return 0
                } else {
                    console.log(`Countdown: ${prevCount - 1000} seconds remaining`)
                    return prevCount - 1000
                }
            });
        }, 1000)
    }

    const stopTimer = ()=> {
        setTimer(0)
        clearInterval(timerId.current)
    }

    const otpClickHandler = ()=> {
        if(otpBoxDisabled){
            setError("Cannot Input the OTP. Kindly click 'resend again'")
            return
        }
    }

    const handleChange = (e, index)=> {
        const value = e.target.value.trim()
        const isNumber = /^\d$/.test(value)
        setError('')
        setVerificationError(false)
        setResendState(false)

        if(otpBoxDisabled){
            setError("Cannot Input the OTP. Kindly click 'resend again'")
            return
        }
        if(value === '') {
            setvalues((val) => {
                const updatedValues = { ...val, [index]: '' }
                return updatedValues
            })
            return
        }    
        if(isNumber) {
            setvalues((val) => {
                const updatedValues = { ...val, [index]: value }
                return updatedValues
            })
        }else{
            setError('Please enter a valid OTP')
            const updatedValues = { ...val, [index]: '' }
            return updatedValues  
        }
    }

    const handleBlur = (e)=>{
        setTimeout(setError(''), 1500)
    }
    
    const convertToMinutes = (millisecs) => {
        const totalSeconds = Math.floor(millisecs / 1000)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds
        return `${formattedMinutes}:${formattedSeconds} min`;
    }

    const submitOtp = async(e)=>{
        setLoading(true)
        console.log("Object.keys(values).length--->", Object.keys(values).length)
        console.log("Values object---->", JSON.stringify(values))
        const nonEmptyValues = Object.values(values).filter(val=> val!== '')
        console.log("nonEmptyValues object---->", JSON.stringify(nonEmptyValues))
        if(Object.keys(nonEmptyValues).length < 5){
            setError("Please enter a valid otp!")
            setLoading(false)
            return
        }else{
            console.log("Submitting Otp.....")
            try{
                const response = await axios.post(`${baseApiUrl}/verifyOtp`, {otp, email: userEmail, updateUser: true}, {withCredentials: true})
                console.log("RESPONSE from verifyOtp---->", response)
                console.log("RESPONSE from verifyOtp in JSON---->", JSON.stringify(response))
                if(response.data.message.includes('success')){
                    stopTimer()
                    setError('')
                    setVerificationError(false)
                    setOtpBoxDisabled(false)
                    sonnerToast.success("You are successfully verified!")
                    if(user) dispatch(makeUserVerified())
                    location.state?.from === 'signup' 
                        ? navigate('/',{replace:true}) 
                        : navigate('/cart',{
                            replace:true, state: {OtpVerified: true}
                        }) 
                    setLoading(false)
                }
            }
            catch(error){
                setLoading(false)
                console.log("error from  frontend--->", error.message)
                const errorMessage = error.response.data.message.toLowerCase()
                if(errorMessage.includes('invalid')){
                    console.log("INAVLID OTP from frontend")
                    sonnerToast.error("Invalid OTP!")
                    setError("Inavlid OTP. Please click 'resend again' to try again!")
                    setvalues({})
                    setVerificationError(true)
                }
                if(errorMessage.includes('expired')){
                    console.log("OTP is expired!")
                    toast.error("OTP is expired!")
                    setError("The OTP is no longer valid. Please click 'resend again' to try again!")
                    setvalues({})
                    setVerificationError(true)
                    setOtpBoxDisabled(true)
                }
                else{
                    toast.error("Internal Server Error!")
                }
            }   
        }
    }

    const cancelVerification = (e)=> {
        sonnerToast.info("You have cancelled the verification!")
        setvalues({})
        setLoading(false)
        stopTimer()
        navigate('/',{replace:true})
    }

    const resendOtp = async()=> {
        console.log("Inside resendOtp()--")
        setvalues({})
        setLoading(true)
        stopTimer()
        setError('')
        setVerificationError(false)
        setOtpBoxDisabled(false)
        setResendState(true)
        const response = await axios.post(`${baseApiUrl}/sendOtp`, { email: userEmail }, {withCredentials:true});
        if(response){
            startTimer()
            setLoading(false)
        }
    }

    const container = {
      hidden: { opacity: 0, y: 12 },
      enter: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.06 }
      },
      exit: { opacity: 0, y: 8, transition: { duration: 0.25 } }
    }

    const item = {
      hidden: { opacity: 0, y: 8 },
      enter: { opacity: 1, y: 0, transition: { duration: 0.36, ease: "easeOut" } },
      exit: { opacity: 0, y: 6, transition: { duration: 0.18 } }
    }

    const pulse = {
      animate: { scale: [1, 1.03, 1], opacity: [1, 0.95, 1] },
      transition: { duration: 1.6, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }
    }



    return(
        <>
        <section className='relative h-[130vh] overflow-hidden' id="otp-verify">

            <AnimatePresence>
                {bgLoaded && (
                  <motion.div
                    id="otp-verify-bg"
                    className="absolute inset-0 h-[130vh] x-xl:bg-cover"
                    style={{ backgroundImage: `url('/otp-bg.png')` }}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {
                    bgLoaded &&
                    <>
                        <header className='h-[5rem]'>

                            <Header/>

                        </header>

                        <main className='flex justify-center items-center'>
                            
                            <motion.div className='animate-border mt-[2.5rem] w-[18rem] xs-sm:w-[26rem] s-sm:w-[30rem] sm:w-[33rem] 
                              rounded-[22px] px-[50px] border-l border-secondary z-50'
                                variants={container}
                                initial="hidden"
                                animate="enter"
                                exit="exit"
                            >
                                <motion.h1 className='text-secondary font-funCity text-[18px] xs-sm:text-[22px] s-sm:text-[27px] mb-[40px] 
                                  text-center my-[50px]'
                                    variants={item}
                                >
                                    <span className='font-funCity'> Verification </span>
                                </motion.h1>

                                <div className='flex flex-col gap-[10px] xs-sm:gap-[15px] text-descReg1 items-start mb-[60px]' 
                                    onSubmit={(e)=>submitData(e)} 
                                >
                                    <motion.div 
                                        className='w-full flex items-center justify-center gap-[10px] s-sm:gap-[5px] check-mail'
                                    >
                                        <h2 className='text-center text-[13px] xs-sm:text-[14px] s-sm:text-[17px] tracking-[0.5px] 
                                          s-sm:tracking-[1px]' 
                                            style={{wordSpacing:'0.5px'}}
                                        >
                                                Check your Email
                                            </h2>
                                        <motion.span className='mt-[-5px] s-sm:mt-0 p-[7px] xs-sm:p-[9px] s-sm:p-[14px]'
                                            {...pulse}
                                        >
                                            <IoMail className='w-[17px] h-[17px] xs-sm:w-[20px] xs-sm:h-[20px] s-sm:w-[35px]
                                              s-sm:h-[35px] text-primary'/>
                                        </motion.span>
                                    </motion.div>
                                    <h4 className='xs-sm:!ml-0 w-full text-center text-[11px] xs-sm:text-[13px] s-sm:text-[15px] 
                                      whitespace-normal md:whitespace-nowrap text-secondary tracking-[0.3px]' 
                                        style={{wordSpacing: '0.5px'}}
                                    >
                                        Enter the verification code sent to 
                                        <span className={`ml-[5px] ${userEmail? 'text-primary':'text-secondary'}`}>
                                             {userEmail ? userEmail : 'your mail'} 
                                        </span>
                                    </h4>
                                    <motion.hr className='w-[10rem] xs-sm:w-[15rem] my-[20px] self-center border border-[#6f6e6e]'
                                        variants={item}>
                                    </motion.hr>
                                    <motion.div className='self-center flex items-center gap-[1rem]'
                                        variants={item}
                                    >
                                        {   loading ? 
                                                <CustomPacmanLoader loading={loading} size={25}/>
                                                : 
                                                <OtpBoxGenerator counts={5} 
                                                    verificationError={verificationError}
                                                    values={values}
                                                    handleChange={handleChange}
                                                    handleBlur={handleBlur}
                                                    otpClickHandler={otpClickHandler}
                                                    otpBoxDisabled={otpBoxDisabled}/>
                                        }
                                    </motion.div>
                                    <motion.p className='w-full h-[3px] mt-[-2px] mb-[2px] text-center text-red-500 text-[10px]
                                      tracking-[0.2px]'
                                        variants={item}
                                    >
                                         {error} 
                                    </motion.p>
                                    <motion.h5 className='w-full mt-[-15px] xs-sm:mt-0 text-[11px] xs-sm:text-[12.5px]
                                     text-[#a5a5a5] text-center'
                                        variants={item}
                                    > 
                                        Haven't received the OTP yet? 
                                        <span className='ml-0 xs-sm:ml-[5px] text-secondary cursor-pointer' 
                                            onClick={resendOtp}
                                        >
                                                Resend again
                                        </span>
                                    </motion.h5>
                                    <motion.div className='w-full text-center'
                                        variants={item}
                                    >
                                        <SiteButtonSquare tailwindClasses='w-[11rem] xs-sm:w-[18rem] s-sm:w-[25rem]' 
                                            customStyle={{marginTop:'1.5rem'}} 
                                            clickHandler={(e)=> submitOtp(e)}>
                                          {loading ? <CustomHashLoader loading={loading}/> : 'Verify Email '}
                                        </SiteButtonSquare>
                                        {
                                            cancelAllowed &&
                                            <SiteSecondaryBorderButtonSquare  tailwindClasses='w-[11rem] xs-sm:w-[18rem] s-sm:w-[25rem]'
                                                customStyle={{marginTop:'1.5rem'}} 
                                                clickHandler={(e)=> cancelVerification(e)}>
                                              Cancel and Verify Later
                                            </SiteSecondaryBorderButtonSquare>
                                        }
                                    </motion.div>
                                    {   
                                        loading ? null :
                                            !otpBoxDisabled &&
                                                <h5 className='w-full text-[10px] xs-sm:text-[12.5px] text-[#a5a5a5]
                                                  text-center tracking-[0.3px]'> 
                                                    {timer? 'The OTP will expire in ' : 'The OTP is expired'}
                                                <span className='mr-[5px] text-primary tracking-[0.5px]'> 
                                                    {timer? minutes : null} 
                                                </span>
                                                </h5>
                                    }
                                    <p className='mt-[5px] w-full text-center text-[#d2caca] text-[9px] xs-sm:text-[11px] tracking-[0.2px]'>
                                        <span className='mr-[5px] text-primary'> Important: </span>
                                        Please avoid using the back button during OTP verification to ensure a smooth and uninterrupted process.
                                    </p>
                                </div>
                            </motion.div>
                        </main>
                    </>
                }
             </AnimatePresence>
        </section>
        <AnimatePresence>
            {
                bgLoaded &&

                    <Footer/>
            }
        </AnimatePresence>
        </>
    )
}