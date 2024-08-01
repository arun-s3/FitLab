import React from 'react'
import './SignUpAndInPage.css'
import { SiteButtonSquare } from '../Components/SiteButton'
import Header from '../Components/Header'
import Footer from '../Components/Footer'

export default function SignUpAndInPage(){
    const bgImg = {
        backgroundImage:"url('/SignIn-bg.png')",
        backgroundSize:"cover"
    }

    return(
       <>
        <section style={bgImg} className='h-[120vh]' id="signup-and-in">
            <Header/>
            <main className='transform translate-x-[-50%] translate-y-[-50%] absolute top-[50%] left-[50%] w-[40%] 
                             rounded-[22px] px-[50px] my-[4%]'>
                <h1 className='text-secondary font-funCity text-[35px] mb-[60px] text-left my-[50px]'>SIGN UP</h1>
                <div className='flex flex-col gap-[35px] text-descReg1 items-start'>
                    <div>
                        <label htmlFor='email'>Enter your email address</label>
                        <input type="email" placeholder="Email Address" id="email"/>
                    </div>
                    <div className='flex gap-[20px]'>
                        <div>
                            <label htmlFor='username'>User Name</label>
                            <input type="text" placeholder="Username" id="username" />
                        </div>
                        <div>
                            <label htmlFor='mobile'>Contact Number</label>
                            <input type="text" placeholder="Contact Number" id="mobile"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor='password'>Enter your Password</label>
                        <input type="text" placeholder="Password" id="password" />
                        <p className='text-white mt-[1rem]'>Have an account yet? 
                            <a className='text-secondary ml-[10px] cursor-pointer font-medium'>Sign In</a>
                        </p>
                    </div>
                    <SiteButtonSquare text='Sign up' customStyle={{ marginBottom:'60px', width:'31.5rem'}}/>
                    {/* remove ml in all siteButtons nd thereby change pages accordingly*/ }
                </div>
            </main>
        </section>
        <Footer/>
      </>
    )
}