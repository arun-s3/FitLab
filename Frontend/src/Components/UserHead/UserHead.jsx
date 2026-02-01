import React,{useState, useEffect, useRef} from 'react'
import './UserHead.css'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'

import {Clock, CreditCard, BadgePercent, Home, LogOut, MapPin, ShoppingCart, Heart} from 'lucide-react'
import {IoMdArrowDropdown, IoMdArrowDropup} from "react-icons/io"
import {IoBagCheckOutline} from "react-icons/io5"
import {toast} from 'react-toastify'
import axios from 'axios'

import {signout} from '../../Slices/userSlice'
import {resetStore} from "../../Store/resetActions"
import {persistor} from "../../Store/reduxStore"


export default function UserHead(){

    const {user, userToken} = useSelector((state)=> state.user)
    const dispatch = useDispatch()
    console.log("Userdata from UserHead-->"+JSON.stringify(user))
    console.log("UserToken from UserHead-->"+JSON.stringify(userToken))

    const listRef = useRef(null)
    const [beVisible, setBeVisible] = useState(false)

    const location = useLocation()
    const navigate = useNavigate()

    const menuItems = [
        { icon: Home, label: 'Account', path: '/account'},
        { icon: CreditCard, label: 'Wallet', path: '/wallet' },
        { icon: BadgePercent, label: 'Coupons', path: '/coupons' },
        { icon: IoBagCheckOutline, label: 'Checkout', path: '/checkout' },
        { icon: Clock, label: 'Orders', path: '/orders' },
        { icon: ShoppingCart, label: 'Cart', path: '/cart' },
        { icon: Heart, label: 'Wishlist', path: '/wishlist' },
        { icon: MapPin, label: 'Manage Addresses', path: '/account/addresses' },
    ]

    const fitlabMenuItems = [
        { label: 'Privacy policy', path: '/privacy'},
        { label: 'Terms & condition', path: '/terms'},
        { label: 'Contact Us', path: '/contact'},
        { label: 'About Us', path: '/about'},
    ]

    const toggleList = {
        showList: ()=>listRef.current.style.display='inline-block',
        hideList: ()=>listRef.current.style.display='none'
    }
   const mouseLeaveHandler = ()=>{
        if(!beVisible){
            console.log("executing hideList by onMouseLeave");
            toggleList.hideList()
        }
        console.log("beVisible onMouseLeave-->"+beVisible);
   }
   const clickHandler =()=>{
        setBeVisible(!beVisible)
        console.log("beVisible now-->"+beVisible)
        if(beVisible) toggleList.showList()
   }

   const [profilePic, setProfilePic] = useState('')
   useEffect(()=>{
       const fetchPicAndSetDp = async()=>{
            try{
                const response = await axios.get(
                    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
                    {responseType:'blob'} )
                console.log("response.data-->"+JSON.stringify(response.data))
                setProfilePic(URL.createObjectURL(response.data))    
            }
            catch(error){
                console.log("Can't load deafultPic")
            }
        }
        if(!user.profilePic){
            fetchPicAndSetDp()
        }
        else{
            setProfilePic(user.profilePic)
        }
    },[])

    const handleSignout = async()=> {
      try {
        console.log("Inside handleSignout")
        let result = null
        if(user.googleId){
            result = await dispatch(signout(user.googleId)).unwrap()
        }else{
            result = await dispatch(signout()).unwrap()
        }
        console.log("Signout success:", result)
        if(result){
            await persistor.purge()
            localStorage.clear()
            sessionStorage.clear()
            dispatch(resetStore())

            localStorage.setItem("completeLogout", Date.now())
        }
      }catch(error){
        console.error("Signout failed:", error)
        toast.error("Internal server error. Please try again later!")
      }
    }


    return(
            <div className='ml-[70px] relative' onMouseEnter={toggleList.showList} onMouseLeave={mouseLeaveHandler} onClick={clickHandler}> 
                <div className='flex' onMouseEnter={toggleList.showList}>  
                    <div className='w-[33px] h-[33px] rounded-[15px]' id="image">
                        <img src={profilePic} alt="" className='rounded-[15px]' id="image"/>
                    </div>
                    <div className='self-end' id="dropdown">
                        { beVisible? <IoMdArrowDropup/>:<IoMdArrowDropdown/>}
                    </div>
                </div>
                <div className='absolute w-[200px] right-[-40px] pt-[5px] z-[20]' onMouseEnter={toggleList.showList}> 
                    <ul className='py-[1rem] w-[175px] bg-white text-black pt-[5px] text-[13px] border border-dropdownBorder
                         rounded-[8px] hidden' id="userhead-list" ref={listRef} >
                        <li className='my-[3px]'> {user.email.length>15? user.email.slice(0,15)+"...": user.email} </li>
                        {
                            menuItems.map(item=> (
                                <li     
                                     key={item.label}
                                    className='hover:text-secondary hover:font-[500]'
                                > 
                                    <Link to={item.path} className='flex items-center gap-[6px]'> 
                                        <item.icon className={` h-[14px] w-[14px]
                                         text-orange-400 hover:text-primary`} />  
                                        <span> {item.label} </span>
                                    </Link>
                                </li>
                            )) 
                        }
                        <li className="mt-[6px] border-t border-gray-200 pt-[6px] !pl-[5px]">
                            <ul className='my-[3px]'>
                                {
                                    fitlabMenuItems.map(item=> (
                                        <li 
                                            key={item.label}
                                            className='hover:text-orange-400 hover:font-[500] text-[13px]'
                                        > 
                                            <Link to={item.path} className='flex items-center gap-[10px]'> 
                                                <span className=''> {item.label} </span>
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </li>
                        <li className='ml-[3px] pt-[12px] text-red-600 hover:text-[15px] hover:font-[500] border-t-[1px] 
                            border-dotted border-secondary'> 
                            <Link onClick={handleSignout}
                               className='flex items-center gap-[10px]'>
                                <LogOut className='h-[15px] w-[15px]' />  
                                <span className='!text-[14px]'> Sign Out </span>
                            </Link> 
                        </li>
                    </ul>
                </div>
            </div>
    )
}