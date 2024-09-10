import React,{useState, useEffect, useLayoutEffect, useRef} from 'react'
import './SignUpAndInPage.css'
import {SiteButtonSquare, GoogleButtonSquare} from '../../../Components/SiteButtons/SiteButtons'
import Header from '../../../Components/Header/Header'
import Footer from '../../../Components/Footer/Footer'
import {Link, useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {signup, signin, googleSignin, resetStates} from '../../../Slices/userSlice'
import {useDispatch, useSelector} from 'react-redux'
import { CustomHashLoader } from '../../../Components/Loader/Loader'
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios'

export default function SignUpAndInPage({type}){
    const bgImg = {
        backgroundImage:"url('/SignIn-bg.png')",
        backgroundSize:"cover"
    }

    const [formData,setFormData] = useState({})
    const [googlePromptLoading, setGooglePromptLoading] = useState(false)

    const navigate = useNavigate()
    const identifierRef = useRef(null)
    const passwordRef = useRef(null)
 
    const dispatch = useDispatch()
    const {error, loading, success, userToken, googleSuccess} = useSelector((state)=>state.user)
     
    useEffect(()=>{
        console.log("Inside useEffect()")
        if(type=='signup' && success && (!googleSuccess||googleSuccess)){
            console.log("success state now-->"+success)
            toast.success("Registered succesfully!")
            console.log("Just after success toast!")
            navigate('/signin',{replace:true})
            dispatch(resetStates())
        }
        if(type=='signin' && success){
            navigate('/',{replace:true})
            dispatch(resetStates())
        }
        if(error){
            console.log("Just after before toast!-->"+error)
            toast.error(error)
            console.log("Just after error toast!")
            dispatch(resetStates())
        }
        if(userToken){
            console.log("Cannot go coz u got token")
            navigate('/',{replace:true})
        } 
    })
    useLayoutEffect(()=>{
        console.log("inside typecheck useEffect--,formData-->"+JSON.stringify(formData))
        setFormData({})
        console.log("inside same typecheck useEffect after clearing properties of formdata--,formData-->"+JSON.stringify(formData))
        if(identifierRef.current) identifierRef.current.value=""
        passwordRef.current.value=""
    },[type])

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
        usernamePattern: /^[\w-]{5,15}$/,
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
                    return regexPatterns.validator(e,"Username can be alphanumeric. Must have atleast 5 letters! ")
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
                toast.error("Please enter all the fields!")
            }
            else{
                console.log("Check errors"+JSON.stringify(formData))
                toast.error("Please check the fields and submit again!")
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
            toast.error("Couldn't find the user details!")
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

    return(
       <>
        <section style={bgImg} className='h-[130vh]' id="signup-and-in">
            <Header/>
            <main className='transform translate-x-[-50%] translate-y-[-50%] absolute top-[50%] left-[50%] w-[40%]
                             rounded-[22px] px-[50px] ' style={ type=='signup'? {marginBlock:'10%'}:{marginBlock:'2%'} }>
                <h1 className='text-secondary font-funCity text-[35px] mb-[60px] text-left my-[50px]'>
                    SIGN<span className='font-funCity'> {type.slice(4).toUpperCase()} </span></h1>

                <form className='flex flex-col gap-[15px] text-descReg1 items-start' onSubmit={(e)=>submitData(e)} >
                    <div>
                    {type=='signup'? <>
                                        <label htmlFor='email'>Enter your email address</label>
                                        <input type="email" placeholder="Email Address" id="email" onChange={(e)=>handleChange(e)} autoFocus
                                                             onBlur={(e)=>{handleInput(e)}} value={formData.email}/>
                                    </>
                                    :<> 
                                        <label htmlFor='identifier'>Enter your username or email address</label>
                                        <input type="text" placeholder="Username or email address" id="identifier" className='w-[31.5rem]' autoComplete="off" ref={identifierRef}
                                                onChange={(e)=>handleChange(e)} onBlur={(e)=>{handleInput(e)}} />
                                     </>
                        }
                        <p className='error'></p>
                    </div>
                    {
                        type==="signup"? 
                                        (<div className='flex gap-[20px]'>
                                            <div>
                                                <label htmlFor='username'>User Name</label>
                                                <input type="text" placeholder="Username" id="username" onChange={(e)=>handleChange(e)} 
                                                                        onBlur={(e)=>{handleInput(e)}} value={formData.username} />
                                                <p className='error'></p>
                                            </div>
                                            <div>
                                                <label htmlFor='mobile'>Contact Number</label>
                                                <input type="text" placeholder="Contact Number" id="mobile" onChange={(e)=>handleChange(e)} 
                                                                        onBlur={(e)=>{handleInput(e)}} value={formData.mobile}/>
                                                <p className='error'></p>
                                            </div>
                                        </div>)
                                      : <></>
                    }
                    
                    <div className='flex flex-col gap-[15px]'>
                        <div>
                            <label htmlFor='password'>Enter your Password</label>
                            <input type="password" placeholder="Password" id="password" onChange={(e)=>handleChange(e)} 
                                                autoComplete="off" ref={passwordRef}  onBlur={(e)=>{handleInput(e)}} />
                            <p className='error' ></p>
                        </div>
                        
                        {
                            type==="signup"?
                                            (<>
                                                <div>   {/*className='mt-[15px]'*/}
                                                    <label htmlFor='confirmPassword'>Confirm your Password</label>
                                                    <input type="password" placeholder="Password" id="confirmPassword" className='w-[31.5rem]'
                                                        onBlur={(e)=>{handleInput(e)}} onChange={(e)=>handleChange(e)}/>
                                                    <p className='error'></p>

                                                    <p className='text-white mt-[1rem] text-subtitleSmall1 ml-[4px]'>Already have an account?
                                                        <Link to={"/signin"} className='text-secondary ml-[10px] cursor-pointer font-medium'>
                                                          Sign In</Link>
                                                    </p>
                                                </div>
                                                
                                             </>
                                             )

                                          :(<div className='text-white mt-[5px] flex justify-between text-subtitleSmall1'>
                                                <p className='ml-[4px]'>Don’t have an account yet?
                                                    <Link to={"/signup"} className='text-secondary ml-[10px] cursor-pointer 
                                                    font-medium'>
                                                      Sign Up</Link>
                                                </p>
                                                <Link to=""> Forgot Password</Link>
                                            </div>
                                           )
                        }
                    
                    </div>   
                    <SiteButtonSquare shouldSubmit={true} customStyle={ type=='signup'?{width:'31.5rem'}:{width:'31.5rem',marginBottom:'60px'} } >
                        { loading? <CustomHashLoader loading={loading}/>: 'Sign'+' '+type.slice(4,5).toUpperCase()+type.slice(5) }
                    </SiteButtonSquare>
                    {
                        type=="signup"? <GoogleButtonSquare customStyle={{marginBottom:'60px', width:'31.5rem', display:'flex',
                                                                         justifyContent:'center', alignItems:'center'}}
                                                            clickHandler={()=>{
                                                                setGooglePromptLoading(true)
                                                                googleLogin()
                                                            }}>
                                             <img src="/google.png" alt="" className='mr-[15px] inline-block'/> 
                                             { (loading||googlePromptLoading)? <CustomHashLoader loading={googlePromptLoading||loading}/>: "Continue with Google" }
                                        </GoogleButtonSquare>: <></>
                    }
                </form>
            </main>
        </section>
        <Footer/>
      </>
    )
}
