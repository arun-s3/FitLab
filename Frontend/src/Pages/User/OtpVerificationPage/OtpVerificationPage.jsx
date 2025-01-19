import React,{useState, useEffect, useRef} from 'react'
import './OtpVerificationPage.css'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import axios from 'axios'
import {useDispatch, useSelector} from 'react-redux'

import {toast} from 'react-toastify'
import {IoMail} from "react-icons/io5";

import {SiteButtonSquare, SiteSecondaryBorderButtonSquare} from '../../../Components/SiteButtons/SiteButtons'
import {CustomHashLoader, CustomPacmanLoader} from '../../../Components/Loader/Loader'
import Header from '../../../Components/Header/Header'
import Footer from '../../../Components/Footer/Footer'

export default function OtpVerificationPage(){

    const bgImg = {
        backgroundImage:"url('/otp-bg.png')",
        backgroundSize:"cover"
    }

    const [values, setvalues] = useState({})
    const [otp, setOtp] = useState(null)
    const [error, setError] = useState('')
    const [verificationError, setVerificationError] = useState(false)
    const [otpBoxDisabled, setOtpBoxDisabled] = useState(false)

    const [resendState, setResendState] = useState(false)

    const [loading, setLoading] = useState(false)

    const [timer, setTimer] = useState(1)
    const [minutes, setMinutes] = useState('')
    let timerId = useRef(null)

    const [userEmail, setUserEmail] = useState('')

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(()=> {
        if(location){
            console.log("location.state.email---->", location?.state?.email)
            setUserEmail(location?.state?.email)
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
        // setTimer(500 * 60 * 1000)
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

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !values[index]) {
            const prevInput = e.target.previousElementSibling
            if (prevInput) prevInput.focus();
        }
        if (/^\d$/.test(e.key) && e.target.value.length && index < 4 ) {
            const nextInput = e.target.nextElementSibling
            if (nextInput) nextInput.focus();
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
                const response = await axios.post('http://localhost:3000/verifyOtp', {otp, email: userEmail, updateUser: true}, {withCredentials: true})
                console.log("RESPONSE from verifyOtp---->", response)
                console.log("RESPONSE from verifyOtp in JSON---->", JSON.stringify(response))
                if(response.data.message.includes('success')){
                    stopTimer()
                    setError('')
                    setVerificationError(false)
                    setOtpBoxDisabled(false)
                    toast.success("You are successfully verified!")
                    navigate('/signin',{replace:true})
                    setLoading(false)
                }
            }
            catch(error){
                setLoading(false)
                console.log("error from  frontend--->", error.message)
                const errorMessage = error.response.data.message.toLowerCase()
                if(errorMessage.includes('invalid')){
                    console.log("INAVLID OTP from frontend")
                    toast.error("Invalid OTP!")
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
            }   
        }
    }

    const cancelVerification = (e)=> {
        setvalues({})
        setLoading(false)
        stopTimer()
        navigate('/signin',{replace:true})
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
        const response = await axios.post('http://localhost:3000/sendOtp', { email: userEmail }, {withCredentials:true});
        if(response){
            startTimer()
            setLoading(false)
        }
    }

    const OtpBoxGenerator = (counts, verificationError)=> {
        const inputArr = Array.from({length: counts}, (_, index) => (
            <input key={index} type="text" autoComplete="off" disabled={otpBoxDisabled} className={`w-[2.5rem] p-[10px] pl-[12px] border-[2px] 
                        ${verificationError? 'border-red-500 bg-red-200' : 'border-white'} rounded-[6px] text-secondary`} 
                            value={values[index]} onChange={(e)=>handleChange(e, index)} onBlur={(e)=>{handleBlur(e)}}
                                onKeyDown={(e) => handleKeyDown(e, index)} onClick={otpClickHandler}/>
        ))
        return inputArr
    }
    
    return(
        <>
        <section style={bgImg} className='h-[130vh]' id="otp-verify">
            <Header/>
            <main className='transform translate-x-[-50%] translate-y-[-50%] absolute top-[50%] left-[50%] w-[35%]
                             rounded-[22px] px-[50px] ' style={{marginBlock:'7%'}}>
                <h1 className='text-secondary font-funCity text-[27px] mb-[40px] text-center my-[50px]'>
                    <span className='font-funCity'> Verification </span></h1>

                    <div className='flex flex-col gap-[15px] text-descReg1 items-start mb-[60px]' onSubmit={(e)=>submitData(e)} >
                        <div className='w-full flex items-center justify-center gap-[5px] check-mail'>
                            <h2 className='text-center text-[17px] tracking-[1px]' style={{wordSpacing:'0.5px'}}>Check your Email</h2>
                            <span> <IoMail/> </span>
                        </div>
                        <h4 className='w-full text-center text-secondary tracking-[0.3px]' style={{wordSpacing: '0.5px'}}>
                            Enter the verification code sent to 
                            <span className={`${userEmail? 'text-primary':'text-secondary'}`}> {userEmail ? userEmail : 'your mail'} </span>
                        </h4>
                        <hr className='w-[15rem] my-[20px] self-center border border-[#6f6e6e]'></hr>

                        <div className='self-center flex items-center gap-[1rem]'>
                            {   loading ? <CustomPacmanLoader loading={loading} size={25}/>
                                        : OtpBoxGenerator(5, verificationError)
                            }
                        </div>
                        <p className='w-full h-[3px] mt-[-2px] mb-[2px] text-center text-red-500 text-[10px] tracking-[0.2px]'> {error} </p>
                        <h5 className='w-full text-[12.5px] text-[#a5a5a5] text-center'> Haven't received the OTP yet? 
                            <span className='ml-[5px] text-secondary cursor-pointer' onClick={resendOtp}>Resend again</span>
                        </h5>
                        <div className='w-full text-center'>
                            <SiteButtonSquare customStyle={ {width:'25rem', marginTop:'1.5rem'} } clickHandler={(e)=> submitOtp(e)}>
                                { loading ? <CustomHashLoader loading={loading}/> : 'Verify Email '}
                            </SiteButtonSquare>
                            <SiteSecondaryBorderButtonSquare customStyle={ {width:'25rem', marginTop:'1.5rem'} } clickHandler={(e)=> cancelVerification(e)}>
                                Cancel and Verify Later
                            </SiteSecondaryBorderButtonSquare>
                        </div>
                        {   
                            loading ? null :
                                !otpBoxDisabled &&
                                    <h5 className='w-full text-[12.5px] text-[#a5a5a5] text-center tracking-[0.3px]'> 
                                        {timer? 'The OTP will expire in ' : 'The OTP is expired'}
                                    <span className='mr-[5px] text-primary tracking-[0.5px]'> {timer? minutes : null} </span>
                                    </h5>
                        }
                        <p className='mt-[5px] w-full text-center text-[#d2caca] text-[11px] tracking-[0.2px]'>
                            <span className='mr-[5px] text-primary'>Important: </span>
                            Please avoid using the back button during OTP verification to ensure a smooth and uninterrupted process.
                        </p>
                    </div>
            </main>
        </section>
        <Footer/>
        </>
    )
}