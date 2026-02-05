import React,{useState, useEffect} from 'react'
import './AdminSignInPage.css'
import {Link,useNavigate} from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux'

import {toast as sonnerToast} from 'sonner'
import {toast} from 'react-toastify'
import {RiAdminLine} from "react-icons/ri"
import {Eye, EyeOff} from 'lucide-react'

import {SiteButtonSquare} from '../../../Components/SiteButtons/SiteButtons'
import {CustomHashLoader} from '../../../Components/Loader/Loader'
import Logo from '../../../Components/Logo/Logo'
import {resetStates, adminSignin} from '../../../Slices/adminSlice'



export default function AdminSignInPage(){

    const bgImg = {
        backgroundImage:"url('/SignIn-bg.png')",
        backgroundSize:"cover"
    }

    const [formData,setFormData] = useState({})

    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const {adminError, adminLoading, adminSuccess, adminToken,admin} = useSelector((state)=> state.admin)
    const {user} = useSelector(state=> state.user)

    useEffect(() => {
        console.log("Inside useEffect()")
        console.log("adminSuccess--->", adminSuccess)
        if (adminSuccess) {
            console.log("ADMIN TOKEN-->"+adminToken)
            console.log("ADMIN DATA-->"+JSON.stringify(admin))
            navigate('/admin/dashboard/business', { replace: true });
            dispatch(resetStates())
        } else if (adminError) {
            sonnerToast.error(adminError)
            dispatch(resetStates())
        } else if (!adminSuccess && adminToken) {
            navigate('/admin/dashboard/business', {replace: true })
        }
    }, [adminSuccess, adminError, adminToken, dispatch, navigate])
    

    const handleChange = (e)=>{
        setFormData({...formData, [e.target.id.toString()]:e.target.value})
    }

    const displaySuccess = (e)=>{
        console.log("Success!")
        e.target.nextElementSibling.style.visibility = 'hidden'
        e.target.style.borderColor = 'green'
    }
    const displayError = (e,errorMessage)=>{
        e.target.style.borderColor = 'red'
        e.target.nextElementSibling.style.visibility = 'visible'
        console.log("msg-->"+errorMessage)
        delete formData[e.target.id.toString()]
        e.target.nextElementSibling.innerText = errorMessage
    }

    const handleInput = (e)=>{

        const emailPattern = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,10})([\.a-z]?)$/
        const usernamePattern =  /^[\w-]{5,15}$/
        const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[`~@#$%^&*()\-+={}\\/;:"'|,.?<>])[a-zA-Z\d`~@#$%^&*()\-+={}\\/;:"'|,.\?<>]{5,}/

        if(!e.target.value.trim().length){
            displayError(e,"This field cannot be empty")
        }
        else{
            if(e.target.id=="identifier"){
                if(new RegExp(`^(${emailPattern.source})|(${usernamePattern.source})$`).test(e.target.value)){
                    displaySuccess(e)
                }
                else{
                    displayError(e,"Enter a valid username or email address!")
                }
            }
            else{
                if(passwordPattern.test(e.target.value)){
                    displaySuccess(e)
                }
                else{
                    displayError(e,"Password should have atleast a special characteer and a number. Must have atleast 5 letters!")
                }
            }
          }
    }

    const submitData = (e)=>{
        e.preventDefault()
        console.log("Inside submitData()--")
        if((Object.keys(formData).length<2) || Object.values(formData).find(inputValues=>inputValues==='undefined')){
            if(!Object.keys(formData).length){
                console.log("No Fields entered!")
                toast.error("Please enter all the fields!")
            }
            else{
                console.log("Check errors"+JSON.stringify(formData))
                sonnerToast.error("Please check the fields and submit again!")
            }
        } 
        else{
            console.log("Inside else(no errors) of submitData() ")
            console.log("FormData now-->"+JSON.stringify(formData))
            dispatch(adminSignin(formData))
            console.log("Dispatched successfully--")
        }
        
    }
    
    return(
            <section style={bgImg} 
                className='h-[130vh]'
                id="admin-signin">

                <main className='transform translate-x-[-50%] translate-y-[-50%] absolute top-[50%] left-[50%] my-[2%] flex gap-[2rem] 
                                    items-center'>
                    <div className='hidden x-lg:inline-block'>
                        {/* <img src="/Logo_main.png" alt="Fitlab"/> */}
                        <Logo customStyle={{height:'30rem', width:'30rem'}}/>
                    </div>
                    <div className='rounded-[22px] px-[50px] admin-form w-[24rem] s-sm:w-[29rem] sm:w-[31.5rem]'>
                        <div className='flex gap-[1rem] items-center'>
                            <RiAdminLine className='text-[40px] text-secondary'/>
                            <div className='mb-[50px] my-[50px]'>
                                <h1 className='text-secondary font-funCity text-[21px] s-sm:text-[27px] text-left uppercase'> ADMIN LOGIN </h1>
                            </div>
                        </div>

                       <form className='flex flex-col gap-[15px] items-start' 
                            onSubmit={(e)=>submitData(e)} >

                            <div className='w-full'>
                                <label htmlFor='identifier' 
                                    className='text-[13px] s-sm:text-descReg1'>
                                         Enter your username or email address 
                                </label>
                                <input type="text"
                                    placeholder="Username or email address"
                                    id="identifier"
                                    className='w-full' 
                                    autoComplete="off"
                                    onChange={(e)=> handleChange(e)}
                                    onBlur={(e)=> handleInput(e)} />
                                <p className='error'></p>
                            </div>
                            <div className='w-full relative'>
                                <label htmlFor='password'
                                    className='text-[13px] s-sm:text-descReg1 '>
                                        Enter your Password
                                </label>
                                <input type={showPassword ? 'text' : 'password'} 
                                    placeholder="Password"
                                    id="password"
                                    className='w-full'
                                    onChange={(e)=> handleChange(e)} 
                                    autoComplete="off"
                                    oonBlur={(e) => {
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

                                <p className='error' ></p>
                            </div>
                            <Link to=""
                                className='text-[11px] s-sm:text-subtitleSmall1 text-secondary ml-[4px]'>
                                    Forgot Password
                            </Link>
                            <SiteButtonSquare shouldSubmit={true} 
                                tailwindClasses='w-full' 
                                customStyle={{marginBottom:'60px'}} >
                                { adminLoading? <CustomHashLoader adminLoading={adminLoading}/>: "Sign In" }
                            </SiteButtonSquare>
                        </form>

                    </div>
                    
                </main>
            </section>
    )
}