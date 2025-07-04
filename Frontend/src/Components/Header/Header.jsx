import React, {useState} from 'react'
import './Header.css'
import {Link, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'

import {IoIosSearch} from "react-icons/io"
import {CiUser} from "react-icons/ci"
import {IoCartOutline} from "react-icons/io5"
import {MdFavoriteBorder} from "react-icons/md"
import {Headset} from "lucide-react"


import Logo from '../Logo/Logo'
import UserHead from '../UserHead/UserHead'
import {SiteButton} from '../SiteButtons/SiteButtons'
import CartSidebar from '../../Components/CartSidebar/CartSidebar'
import TextChatBox from '../../Pages/User/TextChatBox/TextChatBox'



export default function Header({customStyle}){

    const [isCartOpen, setIsCartOpen] = useState(false)

    const [openChatBox, setOpenChatBox] = useState(false)
    
    const {userToken,user} = useSelector((state)=>state.user)
    const {cart} = useSelector(state=> state.cart)    

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const openCartSidebar = ()=> {
        if(cart?.products && cart.products.length > 0){
            setIsCartOpen(true)
        }
    }


    return(
        <div className="flex justify-between items-center text-white padding-main sticky z-10" id='headerMenu'  style={customStyle}>
            {/* <Logo/> */}
            
            <Link to='/'>
                <img src="/Logo_main.png" alt="Fitlab" className="h-[5rem] "/>   {/*mt-[10px]*/}
            </Link>

            <nav>
                <ul className="inline-flex items-center gap-[30px] list-none text-descReg1 tracking-[0.2px]"> {/*mt-[4px]*/}
                    <li>
                        <Link to='/'>Home</Link>
                    </li>
                    <li>
                        <Link>Shop by Categories</Link>
                    </li>
                    <li>
                        <Link to='/shop'>Products</Link>
                    </li>
                    <li>
                        <Link>Blogs</Link>
                    </li>
                    <li>
                        <Link>About Us</Link> 
                    </li>
                </ul>
            </nav>
            <div className="inline-flex gap-[15px] items-center" id="icons">
                <i>
                    <IoIosSearch style={{fontSize:'23px'}}/>
                </i>
                <i onClick={()=> navigate('/account')}>
                    <CiUser style={{fontSize:'25px'}}/>
                </i>
                <i className='relative' onClick={()=> setOpenChatBox()} onMouseEnter={()=> openCartSidebar()} >
                    <IoCartOutline style={{fontSize:'23px'}}/>
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
                    <MdFavoriteBorder style={{fontSize:'25px'}}/>
                </i>
                <i onClick={()=> setOpenChatBox(true)}>
                    <Headset className='w-[21px] h-[21px]'/>
                </i>
                {
                    (userToken && user)?<UserHead/> 
                             :<SiteButton customStyle={{marginLeft:'25px'}}> <Link to='/signin'> Sign In </Link></SiteButton>
                }
            </div>
                
                <CartSidebar isOpen={isCartOpen} onClose={()=> setIsCartOpen(false)} retractedView={true} />

                {
                    openChatBox &&
                    <div className="fixed bottom-[2rem] right-[2rem] z-50">
                  
                        <TextChatBox closeable={true} onCloseChat={()=> setOpenChatBox(false)}/>
                          
                    </div>
                }

        </div>
    )
}