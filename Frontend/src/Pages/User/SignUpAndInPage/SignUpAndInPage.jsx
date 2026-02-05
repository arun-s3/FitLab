import React,{useState, useEffect, useLayoutEffect, useRef} from 'react'
import './SignUpAndInPage.css'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {motion} from "framer-motion"

import {toast} from 'react-toastify'
import {toast as sonnerToast} from 'sonner'
import {useGoogleLogin} from '@react-oauth/google'
import {Eye, EyeOff} from 'lucide-react'
import axios from 'axios'

import {SiteButtonSquare, SiteSecondaryBorderButtonSquare} from '../../../Components/SiteButtons/SiteButtons'
import Header from '../../../Components/Header/Header'
import Footer from '../../../Components/Footer/Footer'
import {signup, signin, googleSignin, resetStates} from '../../../Slices/userSlice'
import {CustomHashLoader, CustomScaleLoader} from '../../../Components/Loader/Loader'


export default function SignUpAndInPage({type}){

    const bgImg = {
        backgroundImage:"url('/SignIn-bg.png')",
        backgroundSize:"cover"
    }

    const [formData,setFormData] = useState({})
    const [googlePromptLoading, setGooglePromptLoading] = useState(false)

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const navigate = useNavigate()
    const identifierRef = useRef(null)
    const passwordRef = useRef(null)

    const location = useLocation()

    const [otpPageLoading, setOtpPageLoading] = useState(false)
 
    const dispatch = useDispatch()
    const {error, loading, success, userToken, googleSuccess} = useSelector((state)=>state.user)

    const baseApiUrl = import.meta.env.VITE_API_BASE_URL

    const clearCookiesAndSignIn = async()=> {
        console.log("Inside clearCookiesAndSignIn()")
        const response = await axios.get(`${baseApiUrl}/clear-cookies`, {withCredentials:true})
        if(response.status === 200){
            console.log("Cookies cleared!")
            dispatch(signin(formData))
        }else{
            toast.error("Internal Server Error. Please try after sometime!")
        }
    }
     
    useEffect(()=>{
        console.log("Inside useEffect()")
        const checkSuccessAndSendOtp = async()=> {
                console.log("success state now-->"+success)
                sonnerToast.success("Registered succesfully!")
                console.log("Just after success toast!")
                // const response = await axios.post('/sendOtp', formData.email)
                const response = await axios.post(`${baseApiUrl}/sendOtp`, { email: formData.email }, {withCredentials:true});
                if(response){
                    console.log("Redirecting to OTP Verification page...")
                    navigate('/otp-verify', {
                        replace:true, 
                        state:{email: formData.email, from: 'signup', NoDirectAccess: true}
                    }) 
                    setOtpPageLoading(false)
                }
                // navigate('/signin',{replace:true})
        }
        if(type=='signup' && success && (!googleSuccess||googleSuccess)){
            setOtpPageLoading(true)
            checkSuccessAndSendOtp();
        }
        if(type=='signin' && success){
            if(location && location.state?.currentPath){
                const redirectingtPath = location.state.currentPath 
                console.log("redirectingtPath---->", redirectingtPath)
                navigate(`${redirectingtPath}`, {replace:true})
            }
            else{
                navigate('/', {replace:true})
            }
            dispatch(resetStates())
        }
        if(error){
            console.log("error---->", error)
            if(error === 'Bad request- User already logged in!'){
                if(userToken){
                    navigate('/',{replace:true})
                }else clearCookiesAndSignIn()
            }
            else if(error.includes('is Blocked')){
                toast.error(error)
                navigate('/blocked', {
                    replace: true, 
                    state: {NoDirectAccesss: true}
                })
            }
            else{
                console.log("Just after before toast!-->"+error)
                sonnerToast.error(error || "Something went wrong.")
                console.log("Just after error toast!")
                dispatch(resetStates())
            }
        }
        dispatch(resetStates())
    })
    
    useLayoutEffect(()=>{
        console.log("inside typecheck useEffect--,formData-->"+JSON.stringify(formData))
        setFormData({})
        console.log("inside same typecheck useEffect after clearing properties of formdata--,formData-->"+JSON.stringify(formData))
        if(identifierRef.current) identifierRef.current.value=""
        passwordRef.current.value=""
    },[type])

    useEffect(()=> {
        if(location){
            console.log("location----->", location)
        }
    }, [location])

    const handleChange = (e)=>{
        setFormData({...formData, [e.target.id.toString()]:e.target.value})
    }

    const displaySuccess = (e)=>{
        console.log("Success!")
        e.target.nextElementSibling.style.visibility = 'hidden'
        e.target.style.borderColor = 'green'
    }
    const displayError = (e,message)=>{
        e.target.style.borderColor = 'red'
        e.target.nextElementSibling.style.visibility = 'visible'
        console.log("msg-->"+message)
        delete formData[e.target.id.toString()]
        e.target.nextElementSibling.innerText = message
    } 
    const regexPatterns = {
        emailPattern: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,10})([\.a-z]?)$/,
        usernamePattern: /^[\w-]{5,15}(?!@)$/,
        mobilePattern: /^\d{10}$/,
        passwordPattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[`~@#$%^&*()\-+={}\\/;:"'|,.?<>])[a-zA-Z\d`~@#$%^&*()\-+={}\\/;:"'|,.\?<>]{5,}/,
        // identifierPattern: new RegExp(`^(${this.emailPattern.toString().slice(2,-2).trim()})|(${this.usernamePattern.toString().slice(2,-2).trim()})$`),
        validator: function(e,errorMessage){
            const currentPattern = Object.keys(this).find( (pattern,index)=> {
                if(pattern.toString().match(e.target.id.toString())) return pattern[index]
            } )
            if(currentPattern){
                if(this[currentPattern].test(e.target.value)){
                    displaySuccess(e)
                }
                else{
                    displayError(e,errorMessage)
                }
            }
            else{
                if(new RegExp(`^(${this.emailPattern.source})|(${this.usernamePattern.source})$`).test(e.target.value)){
                    displaySuccess(e)
                }
                else{
                    displayError(e, errorMessage)
                }
            }
        }
    }
    
    const handleInput = (e)=>{
        if(!e.target.value.trim().length){
            displayError(e,"This field cannot be empty")
        }
        else{
            switch(e.target.id){
                case "email":
                    return regexPatterns.validator(e,"Please enter a valid email-id!")
                case "username":
                    return regexPatterns.validator(e,"Username can be alphanumeric. Avoid special characters and must have atleast 5 letters! ")
                case "identifier":
                    return regexPatterns.validator(e,"Enter a valid username or email address!")
                case "mobile":
                    return regexPatterns.validator(e,"Please enter a valid Mobile number!")
                case "password":
                    return regexPatterns.validator(e,"Password should have atleast a special characteer and a number. Must have atleast 5 letters!")
                case "confirmPassword":
                    if(e.target.value == formData.password){
                        e.target.nextElementSibling.style.visibility = 'hidden'
                        e.target.style.borderColor = 'green'
                    }
                    else {
                        displayError(e,"The passwords doesn't match!")
                    }
            }
        }
    }

    const submitData = (e)=>{
        e.preventDefault()
        console.log("Inside submitData()--")
        if((type=="signup"? Object.keys(formData).length<5: Object.keys(formData).length<2) || Object.values(formData).find(inputValues=>inputValues==='undefined')){
            if(!formData.size){
                console.log("No Fields entered!")
                sonnerToast.error("Please enter all the fields!")
            }
            else{
                console.log("Check errors"+JSON.stringify(formData))
                sonnerToast.error("Please check the fields and submit again!")
            }
        } 
        else{
            console.log("Inside else(no errors) of submitData() ")
            console.log("FormData now-->"+JSON.stringify(formData))
            console.log("type of this page-->"+type)
            type=="signup"? dispatch(signup(formData)):dispatch(signin(formData))
            console.log("Dispatched successfully--")
        }
        
    }

    const googleSuccessHandler = async (response)=>{
        console.log("Inside googleSuccessHandler Success login from google-->"+JSON.stringify(response))
        const googleToken = response.access_token
        console.log("Inside googleSuccessHandler Fetching userDetails..")
        const userDetails = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {headers:{
            Authorization:`Bearer ${googleToken}`
        }})
        if(userDetails){
            console.log("Fetched userDetails-->"+JSON.stringify(userDetails))
            const {email,name,sub,picture} = userDetails.data
            console.log("Fetched name & email-->"+name+" "+email+ "sub-(id)->"+sub+"picture-->"+picture)
            const username = name.split(" ").join("").trim() + Math.random().toString().substr(2,4) 
            const userData = {username, email, sub, picture}
            console.log("Inside googleSignin userData(Dispatching....)-->"+JSON.stringify(userData))
            setGooglePromptLoading(false)
            dispatch(googleSignin(userData))
            console.log("Success from googleSuccessHandler, dispatched googleSignin() successfully")
        } 
        else{
            console.log("Inside googleSuccessHandler else-userDetails, couldn't fetch userDetails")
            sonnerToast.error("Couldn't find the user details!")
        }  
    }
    const googleFailureHandler = (error)=>{
        console.log("Success login from google-->"+JSON.stringify(error))
        toast.error("Please check your gmail id")
    }
    const googleLogin = useGoogleLogin({
            onSuccess:googleSuccessHandler,
            onFailure:googleFailureHandler
    })
    

    console.log("Store states from signUpAndInPage- loading-->"+loading)
    console.log("Success before JSX"+success)

    const sectionVariants = {
      hidden: { opacity: 0,},
      visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
    }

    const mainVariants = {
      hidden: { opacity: 0, scale: 0.97 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.7,
          ease: "easeOut",
          when: "beforeChildren",
          staggerChildren: 0.12,
        },
      }
    }

    const childVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    }


    return (
        <>
            <motion.section
                style={bgImg}
                className={`${type == "signup" ? "h-[165vh] sm:h-[145vh] before:h-[165vh] sm:before:h-[145vh]" : "h-[120vh] before:h-[120vh]"}`}
                id='signup-and-in'
                variants={sectionVariants}
                initial='hidden'
                animate='visible'>
                <header>
                    <Header />
                </header>

                <main
                    className={`-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2
                    rounded-[22px] px-[50px] sm:px-10 
                    ${
                        type == "signup"
                            ? "w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] my-[16rem] sm:my-[12rem] sm:border"
                            : "w-[90%] x-md:w-[65%] lg:w-[50%] x-lg:w-[40%] my-[2%] before:h-[120vh]"
                    }`}>
                    <motion.div
                        className='absolute inset-0 border border-secondary rounded-[22px] pointer-events-none'
                        initial={{ clipPath: "inset(0 100% 100% 0)" }}
                        animate={{ clipPath: "inset(0 0% 0% 0)" }}
                        transition={{ duration: 1.6, ease: "easeInOut" }}
                    />
                    <motion.h1
                        className='text-secondary font-funCity text-3xl sm:text-4xl mb-[60px] text-left my-[50px]'
                        variants={childVariants}>
                        SIGN
                        <span className='font-funCity'> {type.slice(4).toUpperCase()} </span>
                    </motion.h1>

                    <motion.form
                        className='flex flex-col gap-[15px] text-descReg1 items-start'
                        onSubmit={(e) => submitData(e)}
                        variants={mainVariants}>
                        <motion.div className='w-full' variants={childVariants}>
                            {type == "signup" ? (
                                <>
                                    <label htmlFor='email'> Enter your email address </label>
                                    <input
                                        type='email'
                                        placeholder='Email Address'
                                        id='email'
                                        onChange={(e) => handleChange(e)}
                                        autoFocus
                                        onBlur={(e) => {
                                            handleInput(e)
                                        }}
                                        value={formData.email}
                                    />
                                </>
                            ) : (
                                <>
                                    <label htmlFor='identifier'>Enter your username or email address</label>
                                    <input
                                        type='text'
                                        placeholder='Username or email address'
                                        id='identifier'
                                        autoComplete='off'
                                        ref={identifierRef}
                                        onChange={(e) => handleChange(e)}
                                        onBlur={(e) => {
                                            handleInput(e)
                                        }}
                                    />
                                </>
                            )}
                            <p className='error'></p>
                        </motion.div>
                        {type === "signup" ? (
                            <motion.div
                                className='flex flex-col sm:flex-row gap-[20px] w-full'
                                variants={childVariants}>
                                <div className='flex-1'>
                                    <label htmlFor='username'> User Name </label>
                                    <input
                                        type='text'
                                        placeholder='Username'
                                        id='username'
                                        className='w-full'
                                        onChange={(e) => handleChange(e)}
                                        onBlur={(e) => {
                                            handleInput(e)
                                        }}
                                        value={formData.username}
                                    />
                                    <p className='error'></p>
                                </div>
                                <div className='flex-1'>
                                    <label htmlFor='mobile'>Contact Number</label>
                                    <input
                                        type='text'
                                        placeholder='Contact Number'
                                        id='mobile'
                                        onChange={(e) => handleChange(e)}
                                        className='w-full'
                                        onBlur={(e) => {
                                            handleInput(e)
                                        }}
                                        value={formData.mobile}
                                    />
                                    <p className='error'></p>
                                </div>
                            </motion.div>
                        ) : (
                            <></>
                        )}

                        <motion.div className='flex flex-col gap-[15px] w-full' variants={childVariants}>
                            <div className='relative'>
                                <label htmlFor='password'>Enter your Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder='Password'
                                    id='password'
                                    onChange={(e) => handleChange(e)}
                                    autoComplete='off'
                                    ref={passwordRef}
                                    onBlur={(e) => {
                                        if (e.relatedTarget?.dataset?.passwordToggle) return
                                        handleInput(e)
                                    }}
                                />
                                <button
                                    type='button'
                                    data-password-toggle
                                    onClick={() => setShowPassword((status) => !status)}
                                    className='absolute top-[55%] -translate-y-1/2 right-4 text-secondary'>
                                    {showPassword ? (
                                        <Eye className='w-[18px] h-[18px]' />
                                    ) : (
                                        <EyeOff className='w-[18px] h-[18px]' />
                                    )}
                                </button>
                                <p className='error'></p>
                            </div>

                            {type === "signup" ? (
                                <div className='relative'>
                                    <label htmlFor='confirmPassword'> Confirm your Password </label>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder='Password'
                                        id='confirmPassword'
                                        onBlur={(e) => {
                                            if (e.relatedTarget?.dataset?.passwordToggle) return
                                            handleInput(e)
                                        }}
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <button
                                        type='button'
                                        data-password-toggle
                                        onClick={() => setShowConfirmPassword((status) => !status)}
                                        className='absolute top-[40%] -translate-y-1/2 right-4 text-secondary'>
                                        {showConfirmPassword ? (
                                            <Eye className='w-[18px] h-[18px]' />
                                        ) : (
                                            <EyeOff className='w-[18px] h-[18px]' />
                                        )}
                                    </button>
                                    <p className='error'></p>

                                    <p className='text-white mt-[1rem] text-subtitleSmall1 ml-[4px]'>
                                        Already have an account?
                                        <Link
                                            to={"/signin"}
                                            className='text-secondary ml-[10px] cursor-pointer font-medium'>
                                            Sign In
                                        </Link>
                                    </p>
                                </div>
                            ) : (
                                <div className='text-white mt-[5px] flex flex-col s-sm:flex-row justify-between text-subtitleSmall1'>
                                    <p className='ml-0 s-sm:ml-[4px] mb-0 s-sm:mb-[5px]'>
                                        Don’t have an account yet?
                                        <Link
                                            to={"/signup"}
                                            className='text-secondary ml-[10px] cursor-pointer font-medium'>
                                            Sign Up
                                        </Link>
                                    </p>
                                    <Link to=''> Forgot Password</Link>
                                </div>
                            )}
                        </motion.div>
                        <motion.div variants={childVariants} className='w-full'>
                            <SiteButtonSquare
                                shouldSubmit={true}
                                customStyle={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginBottom: type === "signup" ? "10px" : "3rem",
                                }}>
                                {loading ? (
                                    <CustomHashLoader loading={loading} />
                                ) : otpPageLoading ? (
                                    <span className='flex justify-center items-center gap-[5px]'>
                                        <span className='text-secondary text-[11px] tracking-[0.3px] mb-[3px]'>
                                            Redirecting to OTP Verification Page
                                        </span>
                                        <CustomScaleLoader loading={true} />
                                    </span>
                                ) : (
                                    "Sign" + " " + type.slice(4, 5).toUpperCase() + type.slice(5)
                                )}
                            </SiteButtonSquare>
                        </motion.div>
                        {type == "signup" ? (
                            <motion.div variants={childVariants} className='w-full'>
                                <SiteSecondaryBorderButtonSquare
                                    customStyle={{
                                        marginBottom: "60px",
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                    tailwindClasses={"!text-[13px] xxs-sm:!text-[15px]"}
                                    clickHandler={() => {
                                        setGooglePromptLoading(true)
                                        googleLogin()
                                    }}>
                                    <img src='/google.png' alt='' className='mr-[15px] inline-block' />
                                    {loading || googlePromptLoading ? (
                                        <CustomHashLoader loading={googlePromptLoading || loading} />
                                    ) : (
                                        "Continue with Google"
                                    )}
                                </SiteSecondaryBorderButtonSquare>
                            </motion.div>
                        ) : (
                            <></>
                        )}
                    </motion.form>
                </main>
            </motion.section>
            <Footer />
        </>
    )
}
