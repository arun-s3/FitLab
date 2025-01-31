import React,{useState, useEffect} from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux';

import './UserSidebar.css'

import {Camera, Clock, CreditCard, Heart, Home, Key, LogOut, MapPin, RefreshCw, ShoppingCart} from 'lucide-react'
import {IoMdPerson} from "react-icons/io";

export default function UserSidebar({currentPath}){

    const {user} = useSelector(state=> state.user)

    const navigate = useNavigate()

    const menuItems = [
        { icon: Home, label: 'Account', path: '/account'},
        { icon: Clock, label: 'Order History', path: '/orders' },
        { icon: CreditCard, label: 'Wallet', path: '' },
        { icon: ShoppingCart, label: 'Shopping Cart', path: '/cart' },
        { icon: Heart, label: 'Wishlist', path: '/wishlist' },
        { icon: RefreshCw, label: 'Compare', path: '/' },
        { icon: MapPin, label: 'Manage Address', path: '/account/addresses' },
        { icon: Key, label: 'Change Password', path: '' },
        { icon: LogOut, label: 'Log-out', path: '/orders' },
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
        <section id='userSidebar' className='mt-[4rem] w-[13.5rem]'>
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
                <h1 className='text-[17px] font-[550]'> {user?.username ? user.username : 'User'} </h1>
            </div>
            <main className='mt-[10px] w-full h-auto px-[18px] py-[20px] bg-white border border-[#E4E7E9] rounded-[7px]'>
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
        </section>
    )
}