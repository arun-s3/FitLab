import React,{useState, useEffect} from 'react'
import './UserSidebar.css'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux';

import {Camera, ChevronsDown, Clock, CreditCard, Heart, BadgePercent, Home, Key, LogOut, MapPin, RefreshCw, ShoppingCart} from 'lucide-react'
import {IoMdPerson} from "react-icons/io"
import {IoBagCheckOutline} from "react-icons/io5"


export default function UserSidebar({currentPath, openMenuByDefault = true, flexiOpen}){

    const [isMenuOpen, setIsMenuOpen] = useState(openMenuByDefault)

    const {user} = useSelector(state=> state.user)

    const navigate = useNavigate()

    const menuItems = [
        { icon: Home, label: 'Account', path: '/account'},
        { icon: Clock, label: 'Order History', path: '/orders' },
        { icon: IoBagCheckOutline, label: 'Checkout', path: '/checkout' },
        { icon: CreditCard, label: 'Wallet', path: '/wallet' },
        { icon: ShoppingCart, label: 'Shopping Cart', path: '/cart' },
        { icon: Heart, label: 'Wishlist', path: '/wishlist' },
        { icon: BadgePercent, label: 'Coupons', path: '/coupons' },
        { icon: RefreshCw, label: 'Compare', path: '/' },
        { icon: MapPin, label: 'Manage Addresses', path: '/account/addresses' },
        { icon: Key, label: 'Change Password', path: '' },
        { icon: LogOut, label: 'Sign out', path: '/orders' },
    ]

    const listMouseOverHandler = (e)=> {
        e.currentTarget.firstElementChild.style.color = '#f1c40f' // primaryDark
    }

    const listMouseLeaveHandler = (e)=> {
         e.currentTarget.firstElementChild.style.color = 'rgba(215, 241, 72, 1)' // muted-kind
    }

    useEffect(()=> {
        console.log("Path now--->", location.path)
        console.log("currentPath--->", currentPath)
    },[])

    return(
        <section id='userSidebar' className='mt-[4rem] w-[13.5rem] z-[20]'>
            <div className='user flex flex-col justify-center items-center'>
                <div className='relative w-[75px] h-[75px] rounded-[45px] profilePic'>
                    {
                        user?.profilePic ? 
                        <img src={user.profilePic} alt='ProfilePic' className='rounded-[35px]'/> :
                        <img src='/DefaultDp.png' alt='ProfilePic' className='rounded-[35px]'/>
                    }
                    <div className='absolute bottom-[2px] right-[3px] p-[5px] rounded-[25px]  bg-white border border-white'>
                        <Camera className='w-[15px] h-[15px] text-secondaryLight2 z-[1]' />
                    </div>
                </div>
                <div className='flex items-center gap-[4px]'>
                    <h1 className='text-[17px] font-[550]'> {user?.username ? user.username : 'User'} </h1>
                    <ChevronsDown className='w-[20px] h-[20px] text-muted hover:text-secondary hover:scale-110 cursor-pointer' 
                        onMouseEnter={()=> setIsMenuOpen(status=> !status)}/>
                </div>
            </div>

            {
            isMenuOpen &&
            <main className='mt-[10px] w-full h-auto px-[18px] py-[20px] bg-white border border-[#E4E7E9] rounded-[7px]'
                onMouseLeave={()=> flexiOpen && setIsMenuOpen(false)}>
                <ul className='w-full list-none flex flex-col justify-center gap-[1rem]'>
                    {
                        menuItems.map((item, index)=> (
                            <li key={item.label} className={`relative w-full flex items-center gap-[10px] cursor-pointer z-[1] 
                                ${currentPath === item.path &&
                                 'text-secondary font-[500] before:content-[""] before:absolute before:top-[-24%] before:left-[-11%] before:w-[121%] before:h-[149%] before:bg-primary before:z-[-1]'}`}
                                    onMouseOver={(e)=> listMouseOverHandler(e)} 
                                        onMouseLeave={(e)=> currentPath !== item.path && listMouseLeaveHandler(e)}
                                            onClick={()=> navigate(item.path)} >
                                <item.icon className={`h-[16px] w-[16px] 
                                    ${currentPath === item.path ? 'text-primaryDark' : 'text-primary' }`}/>   {/* text-[#5F6C72] */}
                                <Link className={`text-[13px] text-[#5F6C72] capitalize tracking-[0.3px] hover:text-secondary
                                     hover:font-[500] ${currentPath === item.path && 'text-secondary font-[500]'}`} 
                                        to={item.path} >
                                    {item.label}
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </main>
            }

        </section>
    )
}