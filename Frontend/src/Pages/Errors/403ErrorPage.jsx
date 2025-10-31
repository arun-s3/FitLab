import React from 'react'
import {Outlet, useNavigate} from "react-router-dom"
import {useSelector,useDispatch} from 'react-redux'
import {motion} from "framer-motion"

import {FaArrowRightLong, FaArrowLeftLong} from "react-icons/fa6"


export default function ErrorPage403({message = null}){

    const navigate = useNavigate()

    const {admin} = useSelector((state)=> state.admin)

    const goToHome = ()=> {
      user && !user.isAdmin && !admin
          ?  user.isBlocked
          ?  navigate('/blocked', {
                      replace: true, 
                      state: {NoDirectAccesss: true}
                  })
          : navigate('/', {replace: true})
          : admin && admin.isAdmin 
          ? navigate('/admin/dashboard/business', {replace: true})
          : navigate('/', {replace: true})
    }


    return(
        <section id='ErrorPage403' 
            className="h-screen bg-[url('/Error403Img.jpg')] bg-cover md:bg-none bg-[position:-10rem_0] 
              xs-sm:bg-[position:-7rem_0] md:bg-[position:0_0] md:bg-[#FAD42B] relative before:content-[''] before:absolute before:top-0
              before:left-0 before:w-full before:h-full before:bg-gradient-to-b before:from-white/50 before:backdrop-blur-[2px]
              md:before:content-none md:static"
        >

            <main className='h-full w-full flex justify-center md:justify-normal items-center gap-[2rem] overflow-y-hidden'>
                <div className='hidden md:inline-block h-full md:ml-[-80px] xx-md:ml-[-30px] lg:ml-0 md:mt-[3.5rem] 
                  xx-md:mt-0 md:basis-[70%] xx-md:basis-[63%] lg:basis-[55%]'>
                    <motion.figure 
                        className='h-full  w-auto md:h-[90%] md:w-[87%] xx-md:h-full xx-md:w-auto'
                        initial={{ x: -80, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.img alt='Error 403' 
                            src='/Error403Img.jpg' 
                            className='h-full w-auto md:h-[90%] md:w-[87%] xx-md:h-full xx-md:w-auto xx-md:ml-[-30px] lg:ml-0'
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.figure>
                </div>
                <div className='w-[85%] p-4 md:p-0 rounded-[9px] md:rounded-none xs-sm:w-auto mr-4 static md:absolute 
                  right-0 x-lg:static bg-gradient-to-b from-black/40 to-black/40 md:bg-transparent md:from-transparent
                  md:to-transparent z-20 md:z-0'
                >
                    <h1 className='w-full pl-[10px] text-[45px] xs-sm:text-[60px] xx-md:text-[80px] font-600 bg-red-500
                      tracking-[0.5px] rounded-[9px]'>
                         403 
                      </h1>
                    {/* <div className='mt-[-20px] w-[11%] h-[3px] bg-[#9a8585]'></div> */}
                    <h2 className='mt-[12px] text-[16px] xs-sm:text-[18px] xx-md:text-[22px] text-red-600 font-550 mb-[15px]'>
                         Forbidden Error 
                    </h2>
                    <h3 className='w-dull xs-sm:w-[30rem] text-[13px] xs-sm:text-[14px] xx-md:text-[18px] text-white md:text-black'>
                        {message ? message : "Oops! You’re not allowed to view this page. Please check your account or head back to the home page to continue shopping!"}
                    </h3>
                    <div className='w-full mt-[2rem] flex items-center justify-between'>
                        <motion.button 
                            className='px-[2rem] py-[5px] rounded-[10px] tracking-[0.3px] text-[14px] xx-md:text-[16px] bg-primaryDark border-[2px]
                             border-secondary flex items-center gap-[10px] hover:bg-green-500 hover:border-primary' 
                            style={{wordSpacing: '0.5px'}}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={()=> navigate(-1, {replace: true})}
                        > 
                            <FaArrowLeftLong/> Go Back 
                        </motion.button>
                        <motion.button 
                            className='px-[2rem] py-[5px] rounded-[10px] tracking-[0.3px] text-[14px] xx-md:text-[16px] bg-primaryDark border-[2px]
                                 border-secondary flex items-center gap-[10px] hover:bg-green-500 hover:border-primary' 
                            style={{wordSpacing: '0.5px'}}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={()=> admin ? navigate('/admin/dashboard/business', {replace: true}) : navigate('/', {replace: true})}
                        > 
                            Go Home <FaArrowRightLong/> 
                        </motion.button>
                    </div>
                </div>
            </main>
            
        </section>
    )
}