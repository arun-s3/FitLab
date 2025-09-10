import React, {useEffect, useState} from 'react'
import  './AdminPageLayout.css'
import {Link, useNavigate, Outlet} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {motion, AnimatePresence} from 'framer-motion'

import {FaRegBell} from "react-icons/fa"
import {MdOutlineDashboardCustomize, MdLogout} from "react-icons/md"
import {BsCart3} from "react-icons/bs"
import {HiOutlineUsers} from "react-icons/hi"
import {LuLayoutList} from "react-icons/lu"
import {IoPricetagOutline, IoSettingsOutline} from "react-icons/io5"
import {TbTruckDelivery} from "react-icons/tb"
import {RiDiscountPercentLine} from "react-icons/ri"
import {GrGallery} from "react-icons/gr"
import {RiArrowDropDownLine} from "react-icons/ri"
import {CiSquareChevRight} from "react-icons/ci"
import {Menu, MapPinned, Headset} from "lucide-react"

import {adminSignout} from '../../../Slices/adminSlice'
import AdminSidebar from '../../../Components/AdminSidebar/AdminSidebar'


export default function AdminPageLayout(){

    const asideBgImg={
        backgroundImage:"linear-gradient(to bottom,black,var(--SECONDARY) 400%)"
    }
    const headerBgImg = {
        backgroundImage: "linear-gradient(to right, black, var(--SECONDARY) 400%)"
    }
    const adminContentBgImg = {
        backgroundImage: "linear-gradient(to right,rgba(255,255,255,0.9),rgba(255,255,255,0.9)), url('/admin-bg.jpg')"
    }

    const {admin} = useSelector(state=> state.admin)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [headerZIndex, setHeaderZIndex] = useState(10)

    const [isDashboardOpen, setIsDashboardOpen] = useState(false)

    const [compressList, setCompressList] = useState(false)

    const [sidebarOpen, setSidebarOpen] = useState(false)

    const [showSubmenu, setShowSubmenu] = useState({
        dashboard:false, customerHeatmap:false, customers:false, product: false, category: false, couponManager:false, orders:false,
        offers:false, banners:false, support:false, settings:false
    })
        
    const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: MdOutlineDashboardCustomize,
      hasSubmenu: true,
      submenu: [
        { id: "business-overview", label: "Business Overview", path: '/admin/dashboard/business', desc: "Sales, Orders and Customers Insights"},
        { id: "operations-overview", label: "Operations Overview", path: '/admin/dashboard/operations', desc: "Inventory, Payments, Offers and Coupons Insights"}
      ]
    },
    {
      id: "customerHeatmap",
      label: "Customer Heatmap",
      icon: MapPinned,
      path: '/admin/dashboard/heatmap'
    },
    {
      id: "customers",
      label: "Customers",
      icon: HiOutlineUsers,
      path: '/admin/customers'
    },
    {
      id: "product",
      label: "Products",
      icon: BsCart3,
      hasSubmenu: true,
      submenu: [
        { id: "add-product", label: "Add Product", path: '/admin/products/add' },
        { id: "list-edit-product", label: "List/Edit Product", path: '/admin/products/list' },
      ],
    },
    {
      id: "category",
      label: "Category",
      icon: LuLayoutList,
      hasSubmenu: true,
      submenu: [
        { id: "add-category", label: "Add Category", path: '/admin/category/add' },
        { id: "list-edit-categories", label: "List/Edit Categories", path: '/admin/category' },
      ],
    },
    {
      id: "couponManager",
      label: "Coupon Manager",
      icon: IoPricetagOutline,
      path: '/admin/coupons' 
    },
    {
      id: "orders",
      label: "Orders",
      icon: TbTruckDelivery,
      path: '/admin/orders'
    },
    {
      id: "offers",
      label: "Offers",
      icon: RiDiscountPercentLine,
      hasSubmenu: true,
      submenu: [
        { id: "add-offer", label: "Add Offer", path: '/admin/offers/add'},
        { id: "list-edit-offers", label: "List/Edit Offers", path: '/admin/offers' },
      ],
    },
    {
      id: "banners",
      label: "Banners",
      icon: GrGallery,
    },
    {
      id: "support",
      label: "Support",
      icon: Headset,
      hasSubmenu: true,
      submenu: [
        { id: "text-chat", label: "Text Chat", path: '/admin/support/text' },
        { id: "video-chat", label: "Video Chat", path: '/admin/support/video' },
      ],
    },
  ]

  const bottomMenuItems = [
    {
      id: "settings",
      label: "Settings",
      icon: IoSettingsOutline,
    },
    {
      id: "logout",
      label: "Logout",
      icon: MdLogout,
    },
  ]


    useEffect(()=> {
        const {dashboard, product, category, offers, support} = showSubmenu
        if(dashboard || product || category || offers || support){
            setTimeout(()=> setCompressList(true), 300)
        }else{
             setCompressList(false)
        }
    },[showSubmenu])

    const toggleSublist = (type) => {
        setShowSubmenu((prevState) => {
            const updatedState = Object.keys(prevState).reduce((acc, key)=> {
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

    const container = {
      hidden: { opacity: 0, height: 0 },
      show: {
        opacity: 1,
        height: "auto",
        transition: {
          duration: 0.3,
          when: "beforeChildren",
          staggerChildren: 0.1,
        },
      },
      exit: { opacity: 0, height: 0 },
    }

    const child = {
      hidden: { opacity: 0, x: -20 },
      show: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    }


    return(
        <div id='admin-wrapper'>
            <header className='bg-black h-[5rem] w-full flex justify-between items-center px-[33px] fixed top-0'
              id='admin-wrapper-header' 
              style={{...headerBgImg, zIndex: headerZIndex}} >

                <div className="xx-md:hidden mt-[15p] p-[5px] bg-transparent border border-[#7f7d8085] rounded-[7px] shadow-sm">
                    <button
                      onClick={()=> setSidebarOpen(true)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <Menu size={22} className='text-primary'/>
                    </button>
                </div>

                <AdminSidebar isOpen={sidebarOpen} onClose={()=> setSidebarOpen(false)} />

                <img src="/Logo_main.png"
                    alt="Fitlab" 
                    className="h-[5rem] mt-[5px] xx-md:mt-[15px] ml-[-13rem] xx-md:ml-0"
                /> 

\                <div className='flex gap-[15px] justify-between items-center'>
                    <i className='relative'>
                        <FaRegBell className='h-[15px] w-[24px] text-secondary mt-[2px]'/>
                        <span className='h-[5px] w-[5px] rounded-[10px] bg-gray-500 absolute top-[15%] right-[19%]'></span>
                    </i>
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

            <div className='flex fixed top-[5rem] w-full'>
            
                <aside className='hidden xx-md:inline-flex gap-0 z-[10]' id='admin-wrapper-aside'>
                    <div className='h-screen w-[14rem] bg-black'
                        style={asideBgImg} 
                        id='aside-content' 
                    >   
             
                        <nav className='flex justify-center items-center mt-[3.3rem]'>
                            <motion.ul className='w-full ml-[3rem] list-none flex flex-col gap-[1.5rem] justify-center
                                 items-start text-white text-[13.5px]'
                                variants={container}
                                initial="hidden"
                                animate="show"
                                exit="hidden"
                            >
                            {
                                menuItems.map(item=> (
                                    <motion.li className={`${compressList && item.id !== 'dashboard' ? 'mt-[-10px]' : 'mt-0'}`} 
                                        onClick={()=>toggleSublist(item.id)}
                                        variants={child}
                                    > 
                                        {
                                        item.hasSubmenu 
                                            ? 
                                                <>
                                                    <div className={`${ showSubmenu[item.id] && 'toggleSublist-custom-after'} flex items-start
                                                        justify-between gap-[1.5rem] pr-[1.5rem] option list-dropdown`}> 
                                                        <span className='flex justify-center items-center gap-[5px] cursor-pointer list-name'> 
                                                            <item.icon className={`inline-block ${item.id === 'support' && 'w-[16px] h-[16px]'}`}/> 
                                                            <span className={`${ showSubmenu[item.id] && 'text-primaryDark'}`}>
                                                                 {item.label} 
                                                            </span>
                                                        </span>
                                                        <RiArrowDropDownLine/>
                                                    </div>
                                                    {   
                                                    showSubmenu[item.id] &&
                                                        item.submenu.map(subItem=> (
                                                            <AnimatePresence>
                                                                <motion.ul className='pt-[1rem] pl-[1rem] list-none flex flex-col
                                                                     gap-[10px] justify-center items-start text-white text-[12.5px] sublist'
                                                                    variants={container}
                                                                    initial="hidden"
                                                                    animate="show"
                                                                    exit="hidden"    
                                                                >
                                                                    <motion.li variants={child}>
                                                                       <div>
                                                                            <Link to={subItem.path} className='flex items-start'> 
                                                                                <CiSquareChevRight/> 
                                                                                <div className='flex flex-col gap-[5px]'>
                                                                                    <span> {subItem.label} </span> 
                                                                                    {
                                                                                        subItem?.desc &&
                                                                                        <span 
                                                                                            className='text-[10px]
                                                                                             text-[rgba(235,235,235,0.73)] 
                                                                                                first-letter:text-[12px]'>
                                                                                            {subItem.desc}
                                                                                        </span> 
                                                                                    }
                                                                                </div>
                                                                            </Link>
                                                                       </div> 
                                                                    </motion.li>
                                                                </motion.ul>
                                                            </AnimatePresence>
                                                        ))
                                                    }
                                                </>
                                            :
                                            <div className={`${ showSubmenu[item.id] && 'toggleSublist-custom-after'} option`}>
                                                <Link to={item.path}> 
                                                    <item.icon className='w-[13px] h-[13px]'/> 
                                                    <span className={`${ showSubmenu[item.id] && 'text-primaryDark'} ml-[5px]`}> 
                                                         {item.label} 
                                                    </span> 
                                                </Link> 
                                            </div> 
                                        }
                                    </motion.li>
                                ))
                                }
                                <div className={`bg-[#5c5858] w-[85%] h-[1.3px] ${showSubmenu.dashboard ? 'mt-[2px]' : 'mt-[5px]'}`}></div>
                                <li className={`mt-[-10px] text-[14px] tracking-[0.5px] 
                                     ${showSubmenu.dashboard ? 'mt-[-15px]' : 'mt-[-10px]'}`}
                                    onClick={()=>toggleSublist('settings')}>
                                    <div className={`${ showSubmenu.settings && 'toggleSublist-custom-after'} option`}> 
                                        <Link> 
                                            <IoSettingsOutline className='h-[15px] w-[15px]'/>  
                                            <span className={`${ showSubmenu.settings && 'text-primaryDark'}`}> Settings </span> 
                                        </Link> 
                                    </div>
                                </li>
                                <li className={`mt-[-10px] text-[14px] tracking-[0.5px] 
                                    ${showSubmenu.dashboard ? 'mt-[-15px]' : 'mt-[-10px]'}`}> 
                                    <div className='option'>
                                        <Link className='hover:text-red-500' onClick={()=> logoutAdmin()}> 
                                            <MdLogout className='h-[15px] w-[15px]'/> Logout
                                        </Link>
                                    </div>
                                </li>
                            </motion.ul>
                            
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
            
                <div className='basis-full pt-[2rem] pl-[3rem] flex-grow overflow-scroll h-screen'
                    id='admin-content-outlet' 
                    style={adminContentBgImg}
                >

                        <Outlet context={{setHeaderZIndex}}/>

                </div>  

        </div>
       </div>
    )
}

