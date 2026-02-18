import React, {useState, useEffect} from 'react'
import './UserSidebar.css'
import {Link, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {motion, AnimatePresence} from 'framer-motion'

import {Camera, ChevronsDown, Clock, CreditCard, Heart, BadgePercent, Home, Key, LogOut, MapPin, RefreshCw,
     ShoppingCart, Headset} from 'lucide-react'
import {IoBagCheckOutline} from "react-icons/io5"
import {toast as sonnerToast} from 'sonner'

import SelfieModal from '../SelfieModal/SelfieModal'
import {updateUserProfilePic, resetStates} from '../../Slices/userSlice'
import {CustomPuffLoader} from '../Loader/Loader'


export default function UserSidebar({currentPath, openMenuByDefault = true, flexiOpen}){

    const [isMenuOpen, setIsMenuOpen] = useState(openMenuByDefault)

    const [showCamera, setShowCamera] = useState(false)
    const [isHoveringCam, setIsHoveringCam] = useState(false)
    const [userSystemPic, setUserSystemPic] = useState([])
    const [photoDispatched, setPhotoDispatched] = useState(false)

    const {user, loading, userDpUpdated, error} = useSelector(state=> state.user)

    const navigate = useNavigate()
    const dispatch = useDispatch()

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
        { icon: Headset, label: 'Support (Chat/Video)', path: '/support' },
        { icon: LogOut, label: 'Sign out', path: '/orders' },
    ]

    const listMouseOverHandler = (e)=> {
        e.currentTarget.firstElementChild.style.color = '#f1c40f' // primaryDark
    }

    const listMouseLeaveHandler = (e)=> {
         e.currentTarget.firstElementChild.style.color = 'rgba(215, 241, 72, 1)' // muted-kind
    }

    useEffect(()=> {
        if(photoDispatched && userDpUpdated){
            sonnerToast.success("Your profile pic has been updated!")
            dispatch(resetStates())
            setPhotoDispatched(false)
        }
        if(error){
            setPhotoDispatched(false)
        }
    }, [userDpUpdated, error])

    const sidebarVariants = {
        hidden: { opacity: 0, x: -25 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: 'tween',
                duration: 0.2,
                ease: [0.22, 1, 0.36, 1],
                when: 'beforeChildren',
                staggerChildren: 0.06, 
                delayChildren: 0.1,
           },
    },
    exit: {
        opacity: 0,
        x: -25,
        transition: { duration: 0.25, ease: 'easeInOut' },
    },
  }

  const listVariants = {
        hidden: { opacity: 0, y: 15, scale: 0.98 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              type: 'spring',
              stiffness: 420,
              damping: 22,
            },
        },
  }

  const uploadPhoto = async (dataUrl) => {
      const blob = await (await fetch(dataUrl)).blob()
      const formData = new FormData()
      formData.append("image", blob, "photo.jpg")
      dispatch(updateUserProfilePic({formData}))
      setPhotoDispatched(true)
  }

    return(
        <section id='userSidebar' className='mt-[4rem] w-[13.5rem] z-[20]'>
            <div className='user flex flex-col justify-center items-center'>
                <div className='relative w-[75px] h-[75px] rounded-[45px] profilePic'>
                    {
                        user?.profilePic  
                            ? <img src={user.profilePic} alt='ProfilePic' className='w-full h-full object-cover rounded-[35px]'/> 
                            : <img src='/Images/DefaultDp.png' alt='ProfilePic' className='rounded-[35px]'/>
                    }
                    <button 
                        className={`absolute bottom-[2px] right-[3px] p-[5px] rounded-[25px] bg-white 
                            hover:bg-gray-100 border border-gray-300 hover:border-primary hover:scale-110 transition duration-300`}
                        onClick={()=> setShowCamera(true)}
                        onMouseEnter={()=> setIsHoveringCam(true)}
                        onMouseLeave={()=> setIsHoveringCam(false)}
                    >   
                        {
                            loading 
                                ? <CustomPuffLoader loading={loading} customStyle={{marginLeft: '5px', alignSelf: 'center'}}/>
                                : <Camera 
                                    className={`w-[15px] h-[15px] focus:outline-none focus:ring-2 focus:ring-purple-300 z-[1]
                                      ${isHoveringCam 
                                            ? 'text-purple-600 hover:drop-shadow-[0_0_6px_rgba(139,92,246,0.8)]'
                                            : 'text-primaryDark'}
                                        `}
                                  />
                        }
                    </button>
                     {
                        showCamera && 
                            <SelfieModal isOpen={showCamera}
                                onClose={()=> setShowCamera(false)}
                                onCapture={(photo)=> {
                                  uploadPhoto(photo)
                                  setShowCamera(false)
                                }}
                                userSystemPic={userSystemPic}
                                setUserSystemPic={setUserSystemPic}
                            />
                     }
                </div>
                <div className='flex items-center gap-[4px]'>
                    <h1 className='text-[17px] font-[550]'> {user?.username ? user.username : 'User'} </h1>
                    <ChevronsDown className='w-[20px] h-[20px] text-muted hover:text-secondary hover:scale-110 cursor-pointer' 
                        onMouseEnter={()=> setIsMenuOpen(status=> !status)}/>
                </div>
            </div>
            
            <AnimatePresence mode="wait">
                
                {
                    isMenuOpen &&
                        <motion.main 
                            key="sidebar"
                            id='main'
                            className='mt-[10px] w-full h-auto px-[18px] py-[27px] bg-white border border-[#E4E7E9] rounded-[7px]'
                            variants={sidebarVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onMouseLeave={()=> flexiOpen && setIsMenuOpen(false)}
                        >
                            <motion.ul 
                                className='w-full list-none flex flex-col justify-center gap-[1rem]'
                                variants={sidebarVariants}
                            >
                                {
                                    menuItems.map((item)=> (
                                        <motion.li 
                                            key={item.label}
                                            variants={listVariants}
                                            className={`relative w-full flex items-center gap-[10px] cursor-pointer z-[1] 
                                              ${currentPath === item.path && `text-secondary font-[500] before:content-[""] 
                                                before:absolute before:top-[-24%] before:left-[-11%] before:w-[121%] before:h-[149%]
                                                before:bg-primary before:z-[-1]`}`}
                                            onMouseOver={(e)=> listMouseOverHandler(e)} 
                                            onMouseLeave={(e)=> currentPath !== item.path && listMouseLeaveHandler(e)}
                                            onClick={()=> navigate(item.path)} 
                                        >
                                            <item.icon 
                                                className={`h-[16px] w-[16px] 
                                                    ${currentPath === item.path ? 'text-primaryDark' : 'text-primary' }`}
                                            />   
                                            <Link 
                                                className={`text-[13px] text-[#5F6C72] capitalize tracking-[0.3px] hover:text-secondary
                                                    hover:font-[500] ${currentPath === item.path && 'text-secondary font-[500]'}`} 
                                                to={item.path} 
                                            >
                                                {item.label}
                                            </Link>
                                        </motion.li>
                                    ))
                                }
                            </motion.ul>
                        </motion.main>
                }
            </AnimatePresence>
        </section>
    )
}