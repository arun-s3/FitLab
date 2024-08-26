
import React,{useEffect, useState} from 'react'
import './AdminCustomersPage.css'
import axios from '../../Utils/axiosConfig'
import {useSelector, useDispatch} from 'react-redux'
import {showUsers, toggleBlockUser, deleteUser, resetStates} from '../../Slices/adminSlice'

import {RiArrowDropDownLine} from "react-icons/ri";
import {MdBlock, MdDeleteOutline} from "react-icons/md";
import {toast} from 'react-toastify'


export default function AdminCustomersPage(){

    const mainBgImg = {
        backgroundImage : "linear-gradient(to right,rgba(255,255,255),rgba(255,255,255))"
    }

    const dispatch = useDispatch()
    const {adminLoading, adminError, adminSuccess, adminMessage, allUsers} = useSelector(state=>state.admin)

    // const [loadUsers, setLoadUsers] = useState([])

    // useEffect(()=>{
    //     dispatch(showUsers())
    //     console.log("EXECUTING FORONCE USEFFECT()--")
    // },[])

    useEffect(()=>{
        dispatch(showUsers())
        console.log("Inside useEffect allUsers-->"+ JSON.stringify(allUsers))
        
        if(adminMessage){
            console.log("Inside if cond for adminMessage, adminMeassage-->"+adminMessage)
            // adminMessage.split(" ")[1]=="Blocked!"? setblockStatus("Unblock") : setblockStatus("Block")
            toast.success(`The User is ${adminMessage.toLowerCase()}`)
        }
        dispatch(resetStates())
    },[adminMessage])

    

    return(
        <section className='h-screen pl-[3rem] z-[-1]' id='AdminCustomersPage'>
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
                        <tr className='secondaryLight-box border border-[rgb(220, 230, 166)] border-secondary font-[500] table-header'>
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
                            adminLoading? "LOADING...." : allUsers? allUsers.map(user=>
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.mobile}</td>
                                    <td>--</td>
                                    <td>
                                        <div className='flex items-center gap-[10px] action-buttons'>
                                            <button type='button' className='basis-[103px]' onClick={()=>{dispatch(toggleBlockUser(user._id))}}>
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
