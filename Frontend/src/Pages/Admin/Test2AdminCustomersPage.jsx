

import React,{useEffect, useState, useRef} from 'react'
import './AdminCustomersPage.css'
import axios from '../../Utils/axiosConfig'
import {useSelector, useDispatch} from 'react-redux'
import {showUsers, toggleBlockUser, deleteUser, resetStates} from '../../Slices/adminSlice'

import {RiArrowDropDownLine} from "react-icons/ri";
import {MdBlock, MdDeleteOutline} from "react-icons/md";
import {toast} from 'react-toastify'


export default function AdminCustomersPage(){

    const dispatch = useDispatch()
    const {adminLoading, adminError, adminSuccess, adminMessage, allUsers} = useSelector(state=>state.admin)

    const [blockStatus, setblockStatus] = useState("")
    const [loadUsers, setLoadUsers] = useState([])
    const blockRef = useRef(null)
    
    const mainBgImg = {
        backgroundImage : "linear-gradient(to right,rgba(255,255,255),rgba(255,255,255))"
    }
    
    useEffect(()=>{
        console.log("INSIDE FORONCE USEFFECT")
        dispatch(showUsers())
        setLoadUsers(allUsers)
    },[])

    useEffect(()=>{
        
        // console.log("Inside useEffect allUsers-->"+ JSON.stringify(allUsers))
        
        if(adminMessage){
            console.log("Inside if cond for adminMessage, adminMeassage-->"+adminMessage)
            // adminMessage.split(" ")[1]=="Blocked!"? setblockStatus("Unblock") : setblockStatus("Block")
            toast.success(`The User is ${adminMessage.toLowerCase()}`)
        }
        dispatch(resetStates())
    },[adminMessage])

    // useEffect(()=>{
    //     if(loadUser){
    //         console.log("Inside if of useEffect for loaduser")
    //         dispatch(showUsers())
    //         setLoadUser(false)
    //     }
    // })

    const toggleBlockUserHandler = (id,e)=>{
        console.log("Inside toggleBlockUserHandler,e--> "+JSON.stringify(e.target.value))
        e.target.textContent = loadUsers.find(user=>user._id==id).isBlocked? "Unblock":"Block"
        dispatch(toggleBlockUser(id))
        console.log("Dispatched toggleBlockUser().. ")
    }

    return(
        <section className='h-screen' id='AdminCustomersPage'>
            <h1 className='text-h3Semibold'>Customers</h1>

            <main className='mt-[5rem] p-[1rem] border border-secondary flex items-center justify-center w-[80%]'>
                <table cellSpacing={10} cellPadding={10} className='border-spacing-[24px]'>
                    <thead>
                        <tr>
                            <td colSpan='2'>
                                <input type='search' placeholder='Search..' className='secondaryLight-box text-[13px] 
                                                    w-full h-[35px] pl-[10px]'/>
                            </td>
                            <td></td>
                            <td>
                                <div className='inline-flex items-center secondaryLight-box text-[13px] w-[75%] h-[35px] '>
                                    <button className='ml-[15px]'>Status</button>
                                    <RiArrowDropDownLine/>
                                </div>
                            </td>
                            <td>
                                <div className='inline-flex items-center secondaryLight-box text-[13px] w-[75%] h-[35px] '> 
                                    <button className='ml-[15px]'>Show Entries: </button>
                                    <RiArrowDropDownLine/>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan='5'>
                                <hr></hr>
                            </td>
                        </tr>
                        <tr className='secondaryLight-box border border-secondary font-[500]'>
                            <td>Name</td>
                            <td>Email</td>
                            <td>Mobile</td>
                            <td>Wallet</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tr><td colSpan='5'></td></tr>
                    <tbody className='text-[14px]'>
                        {
                            adminLoading? "LOADING...." : loadUsers? loadUsers.map(user=>
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.mobile}</td>
                                    <td>--</td>
                                    <td>
                                        <div className='flex items-center gap-[10px] action-buttons'>
                                            <button type='button' className='basis-[103px]' onClick={(e)=>{
                                                // setblockStatus(user.isBlocked? "Unblock":"Block")
                                                
                                                toggleBlockUserHandler(user._id,e)
                                            }}>
                                                 {user.isBlocked?"Unblock":"Block"} <MdBlock/>
                                            </button>
                                            <button type='button' onClick={()=>dispatch(deleteUser(user._id))} 
                                                    className='text-red-500'> Delete <MdDeleteOutline/></button>
                                        </div>
                                    </td>
                                </tr>
                            )
                            :"ERROR WHILE LOADING"
                        }
                    </tbody>
                </table>
            </main>
        </section>
    )
}
