import React from 'react'

import {FaArrowRightLong} from "react-icons/fa6";

export default function UserPresenceErrorPage(){

    return(
        // <h1 className='text-center text-[22px] mt-[5rem]'> An admin cannot log in while a non-admin user is logged in. Please log out the current user first.</h1>
        <section id='UserPresenceErrorPage' className='h-full bg-[#FAD42B]'>
            <main className='h-full w-full flex items-center gap-[2rem] overflow-y-hidden'>
                <div className='h-full basis-[55%]'>
                    <figure className='h-full'>
                        <img alt='Error 403' src='/Error403Img.jpg' className='h-full w-auto'/>
                    </figure>
                </div>
                <div className=''>
                    <h1 className='text-[80px] font-600 tracking-[0.5px]'> 403 </h1>
                    <div className='mt-[-20px] w-[11%] h-[3px] bg-[#9a8585]'></div>
                    <h2 className='text-[22px] font-550 mb-[15px]'> Forbidden Error </h2>
                    <h3 className='w-[30rem] text-[18px]'> An admin cannot log in while a non-admin user is logged in. Please log out the current user first. </h3>
                    <button className='mt-[2rem] px-[2rem] py-[5px] rounded-[10px] tracking-[0.3px] bg-primaryDark border-[2px]
                             border-secondary flex items-center gap-[10px] hover:bg-green-500' style={{wordSpacing: '0.5px'}}> 
                        Go Home <FaArrowRightLong/> 
                    </button>
                </div>
            </main>
        </section>
    )
}