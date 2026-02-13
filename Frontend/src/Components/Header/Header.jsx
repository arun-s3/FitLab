import React, {useState, useEffect, useContext} from 'react'
import './Header.css'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {motion} from "framer-motion"


import {IoIosSearch} from "react-icons/io"
import {CiUser} from "react-icons/ci"
import {IoCartOutline} from "react-icons/io5"
import {MdFavoriteBorder} from "react-icons/md"
import {HiOutlineMenu, HiOutlineX} from "react-icons/hi"
import { MdSportsGymnastics } from "react-icons/md"
import {User, Heart, Headset, Store, Activity, ShoppingBag, CreditCard, Bot, LogIn} from "lucide-react"

import Logo from '../Logo/Logo'
import UserHead from '../UserHead/UserHead'
import NotificationBell from './NotificationBell'
import VideoCallCommonModal from '../../Pages/User/VideoCallCommonModal/VideoCallCommonModal'
import {SiteButton} from '../SiteButtons/SiteButtons'
import MobileSidebar from './MobileSidebar'
import CartSidebar from '../../Components/CartSidebar/CartSidebar'
import TextChatBox from '../../Pages/User/TextChatBox/TextChatBox'
import CoachPlus from '../../Pages/User/Coach+/Coach+'
import {SocketContext} from '../../Components/SocketProvider/SocketProvider'



export default function Header({lighterLogo, customStyle, goToShopByCategorySec, currentPageChatBoxStatus = false,
    currentPageCoachStatus = false
}){

    const [isCartOpen, setIsCartOpen] = useState(false)

    const [openChatBox, setOpenChatBox] = useState(false)

    const [openCoach, setopenCoach] = useState(false)
    
    const {user} = useSelector((state)=>state.user)
    const {cart} = useSelector(state=> state.cart)    

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()

    const {isAdminOnline, isConnected, notifications, setNotifications, markNotificationRead, markAllNotificationRead,
         deleteNotification} = useContext(SocketContext)

    // const {setOpenVideoCallModal, VideoCallCommonModal} = useContext(SocketContext)
    // const {socket} = socketContextItems

    // const [openVideoCallModal, setOpenVideoCallModal] = useState(false)

    const openCartSidebar = ()=> {
            setIsCartOpen(true)
    }

    const jumpToShopByCategorySec = ()=> {
        if(location.pathname !== '/' ){
            console.log("Navigating now...")
            setTimeout(() => navigate('/', { state: { scrollTo: "shopByCategories" }}), 0)
        }else{
            goToShopByCategorySec()
        }
    }

    const menuItems = [
        {label: 'Home', path: '/'},
        {label: 'Browse Categories', handleClick: ()=> jumpToShopByCategorySec(),
             mobileLabel: 'Browse', className: 'hidden lg:hidden xl:inline-block', mobileClassName: 'xl:hidden'},
        {label: 'Shop', path: '/shop'},
        {label: 'Wallet', path: '/wallet'},
        {label: 'Fitness Training', path: '/fitness/training', 
            mobileLabel: 'Training', className: 'hidden lg:hidden x-lg:inline-block', mobileClassName: 'x-lg:hidden'},
        {label: 'Tracker', path: '/fitness/tracker'},
        {label: 'Coach+', handleClick: ()=> setopenCoach(status=> !status)},
        {label: 'Support', path: '/support'},
        // {label: 'About Us', path: '/about'}
    ]


    return (
        <motion.div
            className='flex justify-between items-center relative lg:sticky text-white px-[30px] overflow-x-clip z-10'
            id='headerMenu'
            style={customStyle}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}>
            {/* <Logo/> */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}>
                <Link to='/' className='absolute top-[5px] max-xs-sm:left-0 lg:static'>
                    <img
                        src={!lighterLogo ? "/Images/Logo_main.png" : "/Images/logoDesign1.png"}
                        alt='Fitlab'
                        className='h-[5rem] '
                    />{" "}
                    {/*mt-[10px]*/}
                </Link>
            </motion.div>

            <motion.nav
                className='hidden lg:block ml-0 lg:ml-[-75px] x-lg:ml-[-50px]'
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}>
                <motion.ul
                    className='inline-flex items-center lg:gap-[15px] xl:gap-[22px] xx-xl:gap-[30px] list-none 
                      lg:text-[14px] x-xl:text-descReg1 tracking-[0.2px]'
                    id='menu'
                    initial='hidden'
                    animate='visible'
                    variants={{
                        hidden: {},
                        visible: {
                            transition: { staggerChildren: 0.12, delayChildren: 0.8 },
                        },
                    }}>
                    {menuItems.map((item, i) => (
                        <motion.li
                            key={i}
                            className={`${(item.label === "Support" || item.label === "Coach+") && "flex items-center gap-[5px]"}`}
                            variants={{
                                hidden: { opacity: 0, y: -8 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                            }}>
                            {item?.mobileLabel && (
                                <Link
                                    className={`${item?.mobileClassName ? item.mobileClassName : ""}`}
                                    to={!item.handleClick && item.path}
                                    onClick={() => item.handleClick && item.handleClick()}>
                                    {item.mobileLabel}
                                </Link>
                            )}
                            <Link
                                className={`${item?.className ? item.className : ""}`}
                                to={!item.handleClick && item.path}
                                onClick={() => item.handleClick && item.handleClick()}>
                                {item.label}
                            </Link>

                            {item.label === "Support" && (
                                <motion.div
                                    className={`w-[5px] h-[5px] rounded-full ${isAdminOnline ? "bg-green-400" : "bg-red-400"}`}
                                    animate={{ scale: [1, 1.4, 1] }}
                                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                                />
                            )}
                            {item.label === "Coach+" && (
                                <motion.div
                                    className={`w-[5px] h-[5px] rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`}
                                    animate={{ scale: [1, 1.4, 1] }}
                                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                                />
                            )}
                        </motion.li>
                    ))}
                </motion.ul>
            </motion.nav>

            <motion.div
                className='hidden x-sm:inline-flex x-sm:gap-[15px] l-md:gap-[1.8rem] x-md:gap-[2.2rem] lg:gap-[12px] x-xl:gap-[15px]
                    sm:ml-[13rem] x-sm:ml-[17rem] lg:ml-0 mt-[25px] lg:mt-0 items-center'
                id='icons'
                initial='hidden'
                animate='visible'
                variants={{
                    hidden: {},
                    visible: {
                        transition: { staggerChildren: 0.1, delayChildren: 1 },
                    },
                }}>
                {/* <i> 
                    <IoIosSearch className='h-[23px] w-[23px] lg:h-[20px] lg:w-[20px] xl:h-[22px] xl:w-[22px] s-xl:h-[23px] s-xl:w-[23px]'/>
                </i> */}
                <i onClick={() => navigate("/account")}>
                    <User className='h-[22px] w-[22px] lg:h-[20px] lg:w-[20px] xl:w-[22px] xl:h-[21px] x-xl:w-[21px] x-xl:h-[22px]' />
                </i>
                <i onClick={() => navigate("/shop")} className='inline-block lg:hidden'>
                    <Store className='h-[20px] w-[20px' />
                </i>
                <i className='relative' onClick={() => setOpenChatBox()} onMouseEnter={() => openCartSidebar()}>
                    <IoCartOutline className='h-[23px] w-[23px] lg:h-[20px] lg:w-[20px] xl:h-[22px] xl:w-[22px] x-xl:h-[23px] x-xl:w-[23px]' />
                    {/* <ShoppingCart className='w-[20px] h-[20px]'/> */}
                    {cart?.products && cart.products.length > 0 && (
                        <span
                            className={`absolute top-[-32%] left-[45%] ${cart.products.length > 100 && "px-[12px] py-[10px]"}
                             h-[18px] w-[18px] flex justify-center items-center text-secondary bg-primary text-[10px]
                                 font-[600] not-italic rounded-[10px]`}>
                            {cart.products.length}
                        </span>
                    )}
                </i>
                <i onClick={() => navigate("/wishlist")}>
                    {/* <MdFavoriteBorder style={{fontSize:'25px'}}/> */}
                    <Heart className='w-[20px] h-[20px] lg:w-[19px] lg:h-[19px] x-xl:h-[20px] x-xl:w-[20px]' />
                </i>
                <i onClick={() => setopenCoach((status) => !status)} className='inline-block lg:hidden'>
                    <Bot className='w-[23px] h-[23px] lg:w-[21px] lg:h-[21px] xl:w-[22px] xl:h-[22px] x-xl:w-[23px] x-xl:h-[23px]' />
                </i>
                <i onClick={() => navigate("/fitness/training")} className='inline-block lg:hidden'>
                    <MdSportsGymnastics className='h-[20px] w-[20px]' />
                </i>
                <i onClick={() => navigate("/fitness/tracker")} className='inline-block lg:hidden'>
                    <Activity className='h-[20px] w-[20px]' />
                </i>
                <i onClick={() => setOpenChatBox(true)}>
                    <Headset className='w-[21px] h-[21px] lg:w-[19px] lg:h-[19px] xl:w-[20px] xl:h-[20px] x-xl:w-[21px] x-xl:h-[21px]' />
                </i>

                <NotificationBell
                    notifications={notifications}
                    setNotifications={setNotifications}
                    onNotificationRead={(id) => markNotificationRead(id, user._id)}
                    onAllNotifcationsRead={() => markAllNotificationRead(user._id)}
                    onNotificationDelete={(id) => deleteNotification(id, user._id)}
                />

                <motion.div
                    className='hidden lg:inline-block ml-0 xx-lg:ml-[-7px] xxx-lg:ml-[-20px] deskt:ml-0'
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4, duration: 0.6, ease: "easeOut" }}>
                    {user ? (
                        <UserHead />
                    ) : (
                        <div className='flex items-center gap-[10px]'>
                            <div className='hidden xl:inline-block x-xl:hidden'>
                                <SiteButton customStyle={{ marginLeft: "25px", paddingBlock: "6px" }}>
                                    <Link to='/signin' className='xl:text-[14px]'>
                                        {" "}
                                        Sign In{" "}
                                    </Link>
                                </SiteButton>
                            </div>
                            <div className='hidden x-xl:inline-block'>
                                <SiteButton customStyle={{ marginLeft: "25px" }}>
                                    <Link to='/signin'> Sign In </Link>
                                </SiteButton>
                            </div>
                            <div className='hidden lg:ml-[-20px] lg:inline-block xl:hidden x-xl:hiden'>
                                <SiteButton
                                    customStyle={{
                                        marginLeft: "25px",
                                        paddingInline: "13px",
                                        paddingBlock: "8px",
                                        borderRadius: "10px",
                                    }}>
                                    <Link to='/signin'>
                                        {" "}
                                        <LogIn className='w-[19px] h-[19px]' />{" "}
                                    </Link>
                                </SiteButton>
                            </div>
                            <button
                                id='signup-icon'
                                className='px-[22px] lg:px-[13px] xl:px-[22px] py-[9px] lg:py-[6px] x-xl:py-[9px] bg-white text-[15px]
                                text-secondary font-medium tracking-[0.2px] rounded-[19px] lg:rounded-[10px] xl:rounded-[19px] hover:bg-purple-500
                               hover:text-white transition duration-300'>
                                <Link to='/signup'> Sign Up </Link>
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>

            <div className='inline-block x-sm:hidden'>
                <NotificationBell
                    notifications={notifications}
                    setNotifications={setNotifications}
                    onNotificationRead={(id) => markNotificationRead(id, user._id)}
                    onAllNotifcationsRead={() => markAllNotificationRead(user._id)}
                    onNotificationDelete={(id) => deleteNotification(id, user._id)}
                    containerStyle='absolute top-[27px] right-20'
                    bellStyle='w-[20px] h-[20px]'
                />
            </div>

            <div className='mt-[25px] lg:hidden'>
                <MobileSidebar
                    currentPageChatBoxStatus={currentPageChatBoxStatus}
                    currentPageCoachStatus={currentPageCoachStatus}
                />
            </div>

            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} retractedView={true} />

            {openChatBox && !currentPageChatBoxStatus && (
                <div className='fixed bottom-[2rem] right-[2rem] z-50'>
                    <TextChatBox closeable={true} onCloseChat={() => setOpenChatBox(false)} />
                </div>
            )}

            {openCoach && !currentPageCoachStatus && (
                <div className='fixed bottom-[2rem] left-[2rem] z-50'>
                    <CoachPlus closeable={true} autoOpen={true} onCloseChat={() => setopenCoach(false)} />
                </div>
            )}

            {/* { */}
            {/* openVideoCallModal && */}
            {/* <div className="fixed inset-0 bg-black bg-opacity-50 z-50 "> */}
            {/* {
                         VideoCallCommonModal &&
                        <VideoCallCommonModal/>
                       } */}

            {/* </div> */}

            {/* } */}
        </motion.div>
    )
}