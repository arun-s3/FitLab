import React,{useState} from 'react'
import './SignUpAndInPage.css'
import { SiteButtonSquare } from '../Components/SiteButton'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function SignUpAndInPage({type}){
    const bgImg = {
        backgroundImage:"url('/SignIn-bg.png')",
        backgroundSize:"cover"
    }

    const [formData,setFormData] = useState({})
      
    const handleChange = (e)=>{
        setFormData({...formData, [e.target.id.toString()]:e.target.value})
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

        validator: function(e,errorMessage){
            const currentPattern = Object.keys(this).find( (pattern,index)=> {
                if(pattern.toString().match(e.target.id.toString())) return pattern[index]
            } )
            if(this[currentPattern].test(e.target.value)){
                console.log("Success!")
                e.target.nextElementSibling.style.visibility = 'hidden'
                e.target.style.borderColor = 'green'
            }
            else{
                displayError(e,errorMessage)
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
            console.log("Check errors"+JSON.stringify(formData))
            toast.error("Please check the fields and submit again!",{bodyClassName:"toastStyle"})
        } 
        else{
            console.log("no errors--"+JSON.stringify(formData))
            toast.success("Registered Successfullly!")
        }
        
    }

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
                        <label htmlFor='email'>Enter your email address</label>
                        <input type="email" placeholder="Email Address" id="email" onChange={(e)=>handleChange(e)} 
                                                             onBlur={(e)=>{handleInput(e)}} value={formData.email}/>
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
                    
                    <div>
                        <label htmlFor='password'>Enter your Password</label>
                        <input type="password" placeholder="Password" id="password" onChange={(e)=>handleChange(e)} 
                                                                        onBlur={(e)=>{handleInput(e)}} value={formData.password} />
                        <p className='error' ></p>
                        {
                            type==="signup"?
                                            (<>
                                                <div className='mt-[15px]'>
                                                    <label htmlFor='confirmPassword'>Confirm your Password</label>
                                                    <input type="password" placeholder="Password" id="confirmPassword" className='w-[31.5rem]'
                                                        onBlur={(e)=>{handleInput(e)}} onChange={(e)=>handleChange(e)} value={formData.confirmPassword} />
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
                    <SiteButtonSquare text={'Sign'+' '+type.slice(4,5).toUpperCase()+type.slice(5)} shouldSubmit={true}
                                      customStyle={{ marginBottom:'60px', width:'31.5rem'}}  />
                </form>
            </main>
        </section>
        <Footer/>
      </>
    )
}
