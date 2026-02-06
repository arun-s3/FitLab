import React, {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'

import {FaRegBell} from "react-icons/fa"
import {Menu} from "lucide-react"

import {adminSignout} from '../../Slices/adminSlice'
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar'




export default function AdminHeader({headerZIndex}){


    const [sidebarOpen, setSidebarOpen] = useState(false)
    
    const {admin} = useSelector(state=> state.admin)
    const dispatch = useDispatch()

    const headerBgImg = {
       backgroundImage: "linear-gradient(to right, black, var(--SECONDARY) 400%)"
    }


    return (
        <header className='bg-black h-[5rem] w-full flex justify-between items-center px-[33px] fixed top-0'
            id='admin-wrapper-header' 
            style={{...headerBgImg, zIndex: headerZIndex}} 
        >

            <div className="xx-md:hidden mt-[15p] p-[5px] bg-transparent border border-[#7f7d8085] rounded-[7px] shadow-sm">
                <button
                  onClick={()=> setSidebarOpen(true)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <Menu size={22} className='text-primary'/>
                </button>
            </div>

            <AdminSidebar 
                isOpen={sidebarOpen} 
                onClose={()=> setSidebarOpen(false)} 
            />

            <img src="/Logo_main.png"
                alt="Fitlab" 
                className="hidden sm:inline-block sm:absolute sm:left-[17rem] sm:top-[-3px] x-md:static h-[5rem] mt-[5px]
                    xx-md:mt-[15px] ml-[-27rem] l-md:w-[-13rem] xx-md:ml-0"
            /> 

            <div className='flex gap-[15px] justify-between items-center'>
                {/* <i className='relative'>
                    <FaRegBell className='h-[15px] w-[24px] text-secondary mt-[2px]'/>
                    <span className='h-[5px] w-[5px] rounded-[10px] bg-gray-500 absolute top-[15%] right-[19%]'></span>
                </i> */}
                <div className='flex gap-[5px] justify-center items-center'>
                    <span className='w-[30px] h-auto rounded-[20px] relative'>
                        <img alt='admin-dp' 
                            src={admin.profilePic} 
                            className='w-[30px] h-auto rounded-[20px]'
                        /> 
                        <span className='h-[8px] w-[8px] rounded-[10px] bg-green-400 absolute bottom-0 right-0'></span>
                    </span>
                    <div className='flex flex-col'>
                        <span className='text-[13px] font-bold text-white'> {admin.username} </span>
                        <span className='text-[12px] text-[#b2afaf]'> Admin </span>
                    </div>
                </div>
            </div>

        </header>
    )
}