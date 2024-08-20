import React from 'react'
import './AdminSignInPage.css'
import {Link} from 'react-router-dom'
import Logo from '../../Components/Logo'
import {useSelector,useDispatch} from 'react-redux'
import {SiteButtonSquare} from '../../Components/SiteButton'
import { RiAdminLine } from "react-icons/ri";

export default function AdminSignInPage(){

    const bgImg = {
        backgroundImage:"url('/SignIn-bg.png')",
        backgroundSize:"cover"
    }

    // const {loading} = useSelector(state=>state.admin)
    const loading = false
    
    return(
            <section style={bgImg} className='h-[130vh]' id="admin-signin">
                <main className='transform translate-x-[-50%] translate-y-[-50%] absolute top-[50%] left-[50%] my-[2%] flex gap-[2rem] 
                                    items-center'>
                    <div>
                        {/* <img src="/Logo_main.png" alt="Fitlab"/> */}
                        <Logo customStyle={{height:'30rem', width:'30rem'}}/>
                    </div>
                    <div className='rounded-[22px] px-[50px] admin-form'>
                        <div className='flex gap-[1rem] items-center'>
                            <RiAdminLine className='text-[40px] text-secondary'/>
                            <div className='mb-[50px] my-[50px]'>
                                <h1 className='text-secondary font-funCity text-[27px] text-left uppercase'>ADMIN LOGIN</h1>
                            </div>
                        </div>
                       <form className='flex flex-col gap-[15px] text-descReg1 items-start' onSubmit={(e)=>submitData(e)} >
                            <div>
                                <label htmlFor='identifier'>Enter your username or email address</label>
                                <input type="text" placeholder="Username or email address" id="identifier" className='w-[31.5rem]' 
                                        autoComplete="off" onChange={(e)=>handleChange(e)} onBlur={(e)=>{handleInput(e)}} />
                                <p className='error'></p>
                            </div>
                            <div>
                                <label htmlFor='password'>Enter your Password</label>
                                <input type="password" placeholder="Password" id="password" onChange={(e)=>handleChange(e)} 
                                                    autoComplete="off" onBlur={(e)=>{handleInput(e)}} />
                                <p className='error' ></p>
                            </div>
                            <Link to="" className='text-subtitleSmall1 text-secondary ml-[4px]'> Forgot Password</Link>
                            <SiteButtonSquare shouldSubmit={true} customStyle={{width:'31.5rem', marginBottom:'60px'}} >
                                { loading? <CustomHashLoader loading={loading}/>: "Sign In" }
                             </SiteButtonSquare>
                        </form>
                    </div>
                    
                </main>
            </section>
    )
}