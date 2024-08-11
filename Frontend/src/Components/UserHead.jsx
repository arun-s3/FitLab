import React,{useState, useRef, useEffect} from 'react'
import './UserHead.css'
import {IoMdArrowDropdown, IoMdArrowDropup} from "react-icons/io";
import {useSelector, useDispatch} from 'react-redux'
import {Link} from 'react-router-dom'
import {signout} from '../Slices/userSlice'

export default function UserHead(){

    const {user, userToken} = useSelector((state)=>state.user)
    const dispatch = useDispatch()
    console.log("Userdata from UserHead-->"+JSON.stringify(user))
    console.log("UserToken from UserHead-->"+JSON.stringify(userToken))

    const listRef = useRef(null)
    const [beVisible, setBeVisible] = useState(false)
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
    return(
            <div className='ml-[70px] relative' onMouseEnter={toggleList.showList} onMouseLeave={mouseLeaveHandler} onClick={clickHandler}>
                <div className='flex' onMouseEnter={toggleList.showList}>
                    <div className='w-[33px] h-[33px] rounded-[15px]' id="image">
                        <img src={user.profilePic} alt="" className='rounded-[15px]' id="image"/>
                    </div>
                    <div className='self-end' id="dropdown">
                        { beVisible? <IoMdArrowDropup/>:<IoMdArrowDropdown/>}
                    </div>
                </div>
                <div className='absolute right-0 pt-[5px]' onMouseEnter={toggleList.showList}>
                    <ul className='bg-white text-black pt-[5px] text-[14px] rounded-[8px] hidden'
                                 id="userhead-list" ref={listRef} >
                        <li> {user.email} </li>
                        <li> <Link to={"/"}>Dashboard</Link> </li>
                        <li> <Link to={"/"}>Profile</Link> </li>
                        <li> <Link onClick={()=>dispatch(signout())}>Sign Out</Link> </li>
                    </ul>
                </div>
            </div>
    )
}