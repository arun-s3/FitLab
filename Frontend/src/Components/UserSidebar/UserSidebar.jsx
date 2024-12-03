import React,{useState, useEffect} from 'react'
import {useSelector} from 'react-redux';

import './UserSidebar.css'

import {Camera, Clock, CreditCard, Heart, Home, Key, LogOut, MapPin, RefreshCw, ShoppingCart} from 'lucide-react'
import {IoMdPerson} from "react-icons/io";

export default function UserSidebar(){

    const {user} = useSelector(state=> state.user)

    const menuItems = [
        { icon: Home, label: 'Profile'},
        { icon: Clock, label: 'Order History' },
        { icon: CreditCard, label: 'Wallet' },
        { icon: ShoppingCart, label: 'Shopping Cart' },
        { icon: Heart, label: 'Wishlist' },
        { icon: RefreshCw, label: 'Compare' },
        { icon: MapPin, label: 'Manage Address' },
        { icon: Key, label: 'Change Password' },
        { icon: LogOut, label: 'Log-out' },
      ]

    const listMouseOverHandler = (e)=> {
        e.currentTarget.firstElementChild.style.color = '#f1c40f'
    }

    const listMouseLeaveHandler = (e)=> {
         e.currentTarget.firstElementChild.style.color = 'rgba(215, 241, 72, 1)'
    }

    return(
        <section id='userSidebar' className='mt-[6rem] w-[13.5rem]'>
            <div className='user flex flex-col justify-center items-center'>
                <div className='relative w-[75px] h-[75px] rounded-[45px] profilePic'>
                    {
                        user?.profilePic ? 
                        <img src={user.profilePic} alt='ProfilePic' /> :
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
                            <li key={item.label} className='relative w-full flex items-center gap-[10px] cursor-pointer z-[1]'
                                    onMouseOver={(e)=> listMouseOverHandler(e)} onMouseLeave={(e)=> listMouseLeaveHandler(e)}>
                                <item.icon className='h-[16px] w-[16px] text-primary'/>   {/* text-[#5F6C72] */}
                                <span className='text-[13px] text-[#5F6C72] capitalize tracking-[0.3px] hover:text-secondary hover:font-[500]'>
                                    {item.label}
                                </span>
                            </li>
                        ))
                    }
                </ul>
            </main>
        </section>
    )
}