import React, {useEffect, useState} from 'react'
import  './AdminPageLayout.css'
import {FaRegBell} from "react-icons/fa";
import {Link, useNavigate, Outlet} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {adminSignout} from '../../../Slices/adminSlice'

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
import {MdOutlineArrowDropDownCircle} from "react-icons/md";
import {IoIosArrowDropdown} from "react-icons/io";
import {RiArrowDropDownLine} from "react-icons/ri";
import {FaRegCaretSquareRight} from "react-icons/fa";
import {CiSquareChevRight} from "react-icons/ci";


export default function AdminPageLayout(){

    const asideBgImg={
        // backgroundImage:"url('/mask-bg.png')",
        // backgroundSize:"cover"
        backgroundImage:"linear-gradient(to bottom,black,var(--SECONDARY) 400%)"
    }
    const headerBgImg = {
        backgroundImage: "linear-gradient(to right, black, var(--SECONDARY) 400%)"
    }
    const adminContentBgImg = {
        backgroundImage: "linear-gradient(to right,rgba(255,255,255,0.9),rgba(255,255,255,0.9)), url('/admin-bg.jpg')"
    }

    const {adminToken, admin} = useSelector(state=>state.admin)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [headerZIndex, setHeaderZIndex] = useState(10)

    const [showSublist, setShowSublist] = useState({
        dashboard:false, customers:false, product: false, category: false, couponManager:false, orders:false, salesReport:false, offers:false, banners:false, settings:false
    })

    const toggleSublist = (type) => {
        setShowSublist((prevState) => {
            const updatedState = Object.keys(prevState).reduce((acc, key) => {
                acc[key] = (key === type)? !prevState[key] : false
                return acc
            }, {})
            return updatedState
        })
    }
    
    const logoutAdmin = ()=> {
        dispatch(adminSignout())
        console.log("Dispatching adminSignout()....")
    }

    return(
        <div id='admin-wrapper'>
            <header className='bg-black h-[5rem] w-full flex justify-between items-center px-[33px] fixed top-0'
              id='admin-wrapper-header' style={{...headerBgImg, zIndex: headerZIndex}} >
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
            <div className='flex fixed top-[5rem] w-full'>
            
                <aside className='inline-flex gap-0 z-[10]' id='admin-wrapper-aside'>
                    <div className='h-screen w-[14rem] bg-black' style={asideBgImg}id='aside-content' >
                        <nav className='flex justify-center items-center mt-[3.3rem]'>
                            <ul className='w-full ml-[3rem] list-none flex flex-col gap-[1.5rem] justify-center items-start text-white text-[13.5px]'>
                                <li onClick={()=>toggleSublist('dashboard')}> 
                                    <div className={`${ showSublist.dashboard && 'toggleSublist-custom-after'} option`}> 
                                        <Link to='/admin/dashboard'> 
                                            <MdOutlineDashboardCustomize className='inline-block'/> 
                                            <span className={`${ showSublist.dashboard && 'text-primaryDark'}`}> Dashboard </span>
                                        </Link>
                                    </div> 
                                </li>
                                <li onClick={()=>toggleSublist('customers')}> 
                                    <div className={`${ showSublist.customers && 'toggleSublist-custom-after'} option`}>
                                        <Link to='/admin/customers'> 
                                            <HiOutlineUsers/> 
                                            <span className={`${ showSublist.customers && 'text-primaryDark'}`}>  Customers </span> 
                                        </Link> 
                                    </div> 
                                </li>
                                <li> 
                                    <div className={`${ showSublist.product && 'toggleSublist-custom-after'} flex items-center gap-[1.5rem] option list-dropdown`}>
                                        <span className='flex justify-center items-center gap-[5px] cursor-pointer list-name'>
                                            <BsCart3/> 
                                            <span className={`${ showSublist.product && 'text-primaryDark'}`}>  Products </span> 
                                        </span>
                                        {/* <MdOutlineArrowDropDownCircle/> */}
                                        {/* <IoIosArrowDropdown/> */}
                                        <RiArrowDropDownLine onClick={()=>toggleSublist('product')}/>
                                     </div> 
                                     {
                                        showSublist.product &&
                                        <ul className='pt-[1rem] pl-[1rem] list-none flex flex-col gap-[10px] justify-center items-start
                                             text-white text-[12.5px] sublist'>
                                            <li>
                                               <div> 
                                                    <Link to='/admin/products/add' className='flex items-center'> 
                                                        <CiSquareChevRight/> 
                                                        <span> Add Product </span> 
                                                    </Link>
                                               </div> 
                                            </li>
                                            <li>
                                               <div>
                                                    <Link to='/admin/products/list' className='flex items-center'> 
                                                        <CiSquareChevRight/>
                                                        <span> List/Edit Products </span> 
                                                    </Link>
                                               </div> 
                                            </li>
                                     </ul>
                                     }
                                </li>
                                <li> 
                                    <div className={`${ showSublist.category && 'toggleSublist-custom-after'} flex items-center gap-[1.5rem] option list-dropdown`}>
                                        <span className='flex justify-center items-center gap-[5px] cursor-pointer list-name'>
                                            <LuLayoutList/> 
                                            <span>Category</span> 
                                        </span>
                                        {/* <MdOutlineArrowDropDownCircle/> */}
                                        {/* <IoIosArrowDropdown/> */}
                                        <RiArrowDropDownLine onClick={()=>toggleSublist('category')}/>
                                     </div> 
                                     {
                                        showSublist.category &&
                                        <ul className='pt-[1rem] pl-[1rem] list-none flex flex-col gap-[10px] justify-center items-start
                                             text-white text-[12.5px] sublist'>
                                            <li>
                                               <div>
                                                    <Link to='/admin/category/add'  className='flex items-center'> 
                                                        <CiSquareChevRight/> 
                                                        <span> Add Category </span> 
                                                    </Link>
                                               </div> 
                                            </li>
                                            <li>
                                               <div className='flex items-center'>
                                                    <Link to='/admin/category'  className='flex items-center'> 
                                                        <CiSquareChevRight/>
                                                        <span> List/Edit Categories </span> 
                                                    </Link>
                                               </div> 
                                            </li>
                                     </ul>
                                     }
                                </li>
                                <li onClick={()=>toggleSublist('couponManager')}> 
                                    <div className={`${ showSublist.couponManager && 'toggleSublist-custom-after'} option`}> 
                                        <Link  to='/admin/coupons'  className='flex items-center'> 
                                            <IoPricetagOutline/>
                                            <span className={`${ showSublist.couponManager && 'text-primaryDark'}`}>  Coupon Manager </span> 
                                        </Link> 
                                    </div> 
                                </li>
                                <li onClick={()=>toggleSublist('orders')}> 
                                    <div className={`${ showSublist.orders && 'toggleSublist-custom-after'} option`}>
                                        <Link to='/admin/orders'>
                                            <TbTruckDelivery/> 
                                            <span className={`${ showSublist.orders && 'text-primaryDark'}`}> Orders </span> 
                                        </Link> 
                                    </div>
                                 </li>
                                <li onClick={()=>toggleSublist('salesReport')}>
                                     <div className={`${ showSublist.salesReport && 'toggleSublist-custom-after'} option`}>
                                        <Link>
                                            <FaChartLine/> 
                                            <span className={`${ showSublist.salesReport && 'text-primaryDark'} option`}> Sales Report </span> 
                                        </Link> 
                                    </div> 
                                </li>
                                <li onClick={()=>toggleSublist('offers')}> 
                                    <div className={`${ showSublist.offers && 'toggleSublist-custom-after'} option`}>
                                        <Link> 
                                            <RiDiscountPercentLine/> 
                                            <span className={`${ showSublist.offers && 'text-primaryDark'}`}> Offers </span>
                                        </Link> 
                                    </div> 
                                </li>
                                <li onClick={()=>toggleSublist('banners')}> 
                                    <div className={`${ showSublist.banners && 'toggleSublist-custom-after'} option`}>
                                        <Link>
                                            <GrGallery/>
                                            <span className={`${ showSublist.banners && 'text-primaryDark'}`}> Banners </span> 
                                        </Link> 
                                    </div>
                                 </li>
                                <div className='bg-[#5c5858] w-[85%] h-[1.3px] mt-[5px]'></div>
                                {/* <ul className='list-none flex flex-col gap-[1rem] justify-center items-start
                                                 text-white text-descReg1 mt-[-10px] '> */}
                                    <li className='mt-[-10px] text-[14px] tracking-[0.5px]' onClick={()=>toggleSublist('settings')}>
                                        <div className={`${ showSublist.settings && 'toggleSublist-custom-after'} option`}> 
                                            <Link>
                                                <IoSettingsOutline className='h-[15px] w-[15px]'/>  
                                                <span className={`${ showSublist.settings && 'text-primaryDark'}`}> Settings </span> 
                                            </Link> 
                                        </div>
                                    </li>
                                    <li className='mt-[-10px] text-[14px] tracking-[0.5px]'> 
                                        <div className='option'>
                                            <Link className='hover:text-red-500' onClick={()=> logoutAdmin()}> 
                                                <MdLogout className='h-[15px] w-[15px]'/> Logout
                                            </Link>
                                        </div>
                                    </li>
                                {/* </ul> */}
                            </ul>
                        </nav> 
                    </div>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.25 -2.25 2.25 2.25">
	                    <path d="M 0 0 L 2 -2 Q -1 -3 0 0 Z" fill="#000000"/>
                    </svg> */}
                    <div id="admin-wrapper-curve" className='relative w-0 h-0'>
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
            
                <div className='basis-full pt-[2rem] pl-[3rem] flex-grow overflow-scroll h-screen' id='admin-content-outlet' style={adminContentBgImg}>

                        <Outlet context={{setHeaderZIndex}}/>
                </div>  

                {/* <div style={{display:'inline-block'}}>
                    <Outlet/>
                </div> */}
        </div>
       </div>
    )
}

