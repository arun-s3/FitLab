import React, {useState, useEffect, useContext} from 'react'
import './Header.css'
import {Link, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'

import {IoIosSearch} from "react-icons/io"
import {CiUser} from "react-icons/ci"
import {IoCartOutline} from "react-icons/io5"
import {MdFavoriteBorder} from "react-icons/md"
import {HiOutlineMenu, HiOutlineX} from "react-icons/hi"
import {User, Heart, Headset, LogIn} from "lucide-react"


import Logo from '../Logo/Logo'
import UserHead from '../UserHead/UserHead'
import VideoCallCommonModal from '../../Pages/User/VideoCallCommonModal/VideoCallCommonModal'
import {SiteButton} from '../SiteButtons/SiteButtons'
import MobileSidebar from './MobileSidebar'
import CartSidebar from '../../Components/CartSidebar/CartSidebar'
import TextChatBox from '../../Pages/User/TextChatBox/TextChatBox'
import {SocketContext} from '../../Components/SocketProvider/SocketProvider'



export default function Header({customStyle}){

    const [isCartOpen, setIsCartOpen] = useState(false)

    const [openChatBox, setOpenChatBox] = useState(false)

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    
    const {userToken,user} = useSelector((state)=>state.user)
    const {cart} = useSelector(state=> state.cart)    

    const navigate = useNavigate()
    const dispatch = useDispatch()

    // const {setOpenVideoCallModal, VideoCallCommonModal} = useContext(SocketContext)
    // const {socket} = socketContextItems

    // const [openVideoCallModal, setOpenVideoCallModal] = useState(false)

    const openCartSidebar = ()=> {
        if(cart?.products && cart.products.length > 0){
            setIsCartOpen(true)
        }
    }


    return(
        <div className="flex justify-between items-center relative lg:sticky text-white padding-main z-10" 
            id='headerMenu'  
            style={customStyle}>
            {/* <Logo/> */}
            
            <Link to='/' className='absolute top-[5px] lg:static'>
                <img src="/Logo_main.png" alt="Fitlab" className="h-[5rem] "/>   {/*mt-[10px]*/}
            </Link>

            <nav className='hidden lg:block lg:ml-[-50px] xl:ml-[-20px] x-xl:ml-0'>
                <ul className="inline-flex items-center lg:gap-[15px] xl:gap-[22px] x-xl:gap-[30px] list-none lg:text-[14px] x-xl:text-descReg1 
                    tracking-[0.2px]"> 
                    <li>
                        <Link to='/'> Home </Link>
                    </li>
                    <li>
                        <Link className='xl:hidden'> Shop </Link>
                        <Link className='hidden lg:hidden xl:inline-block'> Shop By Categories</Link>
                    </li>
                    <li>
                        <Link to='/shop'> Products </Link>
                    </li>
                    <li>
                        <Link to='/support'> Support </Link>
                    </li>
                    <li>
                        <Link> Blogs </Link>
                    </li>
                    <li>
                        <Link> About Us </Link> 
                    </li>
                </ul>
            </nav>
            <div className="hidden sm:inline-flex sm:gap-[20px] lg:gap-[12px] x-xl:gap-[15px] sm:ml-[20rem] lg:ml-0 mt-[25px] lg:mt-0 items-center" 
                id="icons">
                <i>
                    <IoIosSearch className='h-[23px] w-[23px] lg:h-[20px] lg:w-[20px] xl:h-[22px] xl:w-[22px] s-xl:h-[23px] s-xl:w-[23px]'/>
                </i>
                <i onClick={()=> navigate('/account')}>
                    <User className='h-[22px] w-[22px] lg:h-[20px] lg:w-[20px] xl:w-[22px] xl:h-[21px] x-xl:w-[21px] x-xl:h-[22px]'/>
                </i>
                <i className='relative' 
                    onClick={()=> setOpenChatBox()} 
                    onMouseEnter={()=> openCartSidebar()} >
                        <IoCartOutline className='h-[23px] w-[23px] lg:h-[20px] lg:w-[20px] xl:h-[22px] xl:w-[22px] x-xl:h-[23px] x-xl:w-[23px]'/>
                        {/* <ShoppingCart className='w-[20px] h-[20px]'/> */}
                        {
                         cart?.products && cart.products.length > 0 &&
                         <span className={`absolute top-[-32%] left-[45%] ${cart.products.length > 100 && 'px-[12px] py-[10px]'}
                             h-[18px] w-[18px] flex justify-center items-center text-secondary bg-primary text-[10px]
                                 font-[600] not-italic rounded-[10px]`}>
                            {cart.products.length}
                         </span>
                        }
                </i >
                <i onClick={()=> navigate('/wishlist')}>
                    {/* <MdFavoriteBorder style={{fontSize:'25px'}}/> */}
                    <Heart className='w-[20px] h-[20px] lg:w-[19px] lg:h-[19px] x-xl:h-[20px] x-xl:w-[20px]'/>
                </i>
                <i onClick={()=> setOpenChatBox(true)}>
                    <Headset className='w-[21px] h-[21px] lg:w-[19px] lg:h-[19px] xl:w-[20px] xl:h-[20px] x-xl:w-[21px] x-xl:h-[21px]'/>
                </i>
                <div className='hidden lg:inline-block'>
                  {
                    (userToken && user) ?
                        <UserHead/> 
                        :<div className='flex items-center gap-[10px]'> 
                            <div className='hidden xl:inline-block x-xl:hidden'>
                              <SiteButton customStyle={{marginLeft:'25px', paddingBlock:'6px'}}> 
                               <Link to='/signin' className='xl:text-[14px]'> Sign In </Link>
                              </SiteButton>
                            </div>
                            <div className='hidden x-xl:inline-block'>
                              <SiteButton customStyle={{marginLeft:'25px'}}> 
                               <Link to='/signin'> Sign In </Link>
                              </SiteButton>
                            </div>
                            <div className='hidden lg:ml-[-20px] lg:inline-block xl:hidden x-xl:hiden'>
                              <SiteButton customStyle={{marginLeft:'25px', paddingInline:'13px', paddingBlock:'8px', borderRadius:'10px'}}> 
                               <Link to='/signin'> <LogIn className='w-[19px] h-[19px]'/> </Link>
                              </SiteButton>
                            </div>
                           <button id='signup-icon'
                              className='px-[22px] lg:px-[13px] xl:px-[22px] py-[9px] lg:py-[6px] x-xl:py-[9px] bg-white text-[15px]
                                text-secondary font-medium tracking-[0.2px] rounded-[19px] lg:rounded-[10px] xl:rounded-[19px] hover:bg-purple-500
                               hover:text-white transition duration-300'>
                              <Link to='/signin'> Sign Up </Link>
                           </button>
                        </div>
                  }
                </div>
            </div>

            <div className='mt-[25px] lg:hidden'>

              <MobileSidebar />

            </div>
                
                <CartSidebar isOpen={isCartOpen} onClose={()=> setIsCartOpen(false)} retractedView={true} />

                {
                    openChatBox &&
                    <div className="fixed bottom-[2rem] right-[2rem] z-50">
                  
                        <TextChatBox closeable={true} onCloseChat={()=> setOpenChatBox(false)}/>
                          
                    </div>
                }

                {/* { */}
                    {/* openVideoCallModal && */}
                    {/* <div className="fixed inset-0 bg-black bg-opacity-50 z-50 "> */}
                       {/* {
                         VideoCallCommonModal &&
                        <VideoCallCommonModal/>
                       } */}

                    {/* </div> */}

                {/* } */}

        </div>
    )
}