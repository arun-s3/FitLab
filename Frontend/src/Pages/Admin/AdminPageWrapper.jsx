import React, { useEffect } from 'react'
import  './AdminPageWrapper.css'
import {FaRegBell} from "react-icons/fa";
import {Link, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {adminSignout} from '../../Slices/adminSlice'

import {MdOutlineDashboardCustomize, MdLogout} from "react-icons/md";
import {FaCartShopping, FaChartLine} from "react-icons/fa6";
import {BsCart3} from "react-icons/bs";
import {HiOutlineUsers} from "react-icons/hi";
import {LuLayoutList} from "react-icons/lu";
import {IoPricetagOutline, IoSettingsOutline} from "react-icons/io5";
import {TbTruckDelivery} from "react-icons/tb";
// import {BiSolidOffer} from "react-icons/bi";
import {RiDiscountPercentLine} from "react-icons/ri";
import {RiSignpostLine} from "react-icons/ri";
import {GrGallery} from "react-icons/gr";


export default function AdminCustomersPage(){

    const asideBgImg={
        // backgroundImage:"url('/mask-bg.png')",
        // backgroundSize:"cover"
        backgroundImage:"linear-gradient(to bottom,black,var(--SECONDARY) 400%)"
    }
    const headerBgImg = {
        backgroundImage: "linear-gradient(to right, black, var(--SECONDARY) 400%)"
    }

    const {adminToken, admin} = useSelector(state=>state.admin)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(()=>{
        console.log("Inside useEffect of AdminWrapperPage")
        !admin && navigate('/admin/signin',{replace:true})
    })

    return(
        <div>
            <header className='bg-black h-[5rem] w-full flex justify-between items-center px-[33px]' id='admin-wrapper-header'
                            style={headerBgImg}>
                <img src="/Logo_main.png" alt="Fitlab" className="h-[5rem] mt-[15px]"/> 
                <div className='flex gap-[15px] justify-between items-center'>
                    <i className='relative'>
                        <FaRegBell className='h-[15px] w-[24px] text-secondary mt-[2px]'/>
                        <span className='h-[5px] w-[5px] rounded-[10px] bg-gray-500 absolute top-[15%] right-[19%]'></span>
                    </i>
                    <div className='flex gap-[5px] justify-center items-center'>
                        <span className='w-[30px] h-auto rounded-[20px] relative'>
                            <img alt='admin-dp' src={admin.profilePic} className='w-[30px] h-auto rounded-[20px]'/> {/*'/admin-dp.jpg'*/}
                            <span className='h-[8px] w-[8px] rounded-[10px] bg-green-400 absolute bottom-0 right-0'></span>
                        </span>
                        <div className='flex flex-col'>
                            <span className='text-[13px] font-bold text-white'>{admin.username}</span>
                            <span className='text-[12px] text-[#b2afaf]'>Admin</span>
                        </div>
                    </div>
                </div>
            </header>
            <aside className='inline-flex gap-0' id='admin-wrapper-aside'>
                <div className='h-screen w-[14rem] bg-black' style={asideBgImg}id='aside-content' >
                    <nav className='flex justify-center items-center mt-[4rem]'>
                        <ul className='list-none flex flex-col gap-[2rem] justify-center items-start text-white text-descReg1'>
                            <li> 
                                <Link> <MdOutlineDashboardCustomize className='inline-block'/> Dashboard</Link> 
                            </li>
                            <li> 
                                <Link> <HiOutlineUsers/> Customers</Link> 
                            </li>
                            <li> 
                                <Link> <BsCart3/> Products</Link> 
                            </li>
                            <li>
                                 <Link> <LuLayoutList/> Category</Link> 
                            </li>
                            <li> 
                                <Link> <IoPricetagOutline/> Coupon Generator</Link> 
                            </li>
                            <li> 
                                <Link> <TbTruckDelivery/> Orders</Link>
                             </li>
                            <li>
                                 <Link> <FaChartLine/> Sales Report</Link> 
                            </li>
                            <li> 
                                <Link> <RiDiscountPercentLine/> Offers</Link> 
                            </li>
                            <li> 
                                <Link> <GrGallery/> Banners</Link>
                             </li>
                            <hr className='bg-gray-600 text-gray-600 w-[70%] mt-[5px]'></hr>
                            <ul className='list-none flex flex-col gap-[1rem] justify-center items-start
                                             text-white text-descReg1 mt-[-10px] '>
                                <li>
                                    <Link> <IoSettingsOutline/> Settings</Link>
                                </li>
                                <li>
                                    <Link onClick={()=>{
                                        dispatch(adminSignout())
                                        console.log("Dispatching adminSignout()....")}}> <MdLogout/> Logout</Link>
                                </li>
                            </ul>
                        </ul>
                    </nav> 
                </div>
                {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.25 -2.25 2.25 2.25">
	                <path d="M 0 0 L 2 -2 Q -1 -3 0 0 Z" fill="#000000"/>
                </svg> */}
                <div id="admin-wrapper-curve" className='relative'>
                    <svg xmlns="http://www.w3.org/2000/svg" className='h-[40px] w-[40px]'>
                        {/* <defs>
                            <filter id="shadow" x="0" y="0" width="150%" height="150%">
                                <feDropShadow dx="5" dy="5" stdDeviation="3" flood-color="rgba(0, 0, 0, 0.5)" />
                            </filter>
                        </defs> */}
	                    <path d="M 0 40 L-20 -40 L40 0 Q0 0 0 40" fill="#000000" filter="url(#shadow)"/>
                    </svg>
                </div>
                    
                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.25 -2.25 2.25 2.25">
	                    <path d="M 0 0 L 2 -2 Q -1 -3 0 0" stroke="#FF0000" stroke-width="0.1" fill="none"/>
                    </svg> */}
                    
            </aside>
            <p>
            sd,csnnsokfvkfv
            </p>
       </div>
    )
}






// <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 12">
// 	<path d="M 0 0 L 16 0 L 16 1 L 3 1 Q 2 1 2 4 L 2 12 H 0 Z" fill="#000000"/> //d="M 0 0 L 16 0 L 16 1 L 3 1 Q 2 1 2 4 L 2 12 H 0 Z"
//     <foreignObject x="50" y="50" width="200" height="100">
//     <h1> {/*mt-[4px]*/}
//                     wjsdcsmdkclsdmcs;cldc;sdlcsdc
//     </h1>
//     </foreignObject>
    
// </svg>

{/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 12">
	<path d="M 0 0 L 16 0 L 16 3 L 4 3 Q 3 3 3 4 L 3 12 H 0 Z" fill="#000000"/>
</svg>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 12">
	<path d="M 0 0 L 16 0 L 16 1 L 3 1 Q 2 1 2 4 L 2 12 H 0 Z" fill="#000000"/> //d="M 0 0 L 16 0 L 16 1 L 3 1 Q 2 1 2 4 L 2 12 H 0 Z"
</svg>  */}