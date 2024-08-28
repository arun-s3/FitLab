import React, {useEffect, useState, useRef} from 'react';
import './AdminCustomersPage.css';
import axios from '../../Utils/axiosConfig';
import { useSelector, useDispatch } from 'react-redux';
import { showUsers, toggleBlockUser, deleteUser, resetStates } from '../../Slices/adminSlice';

import {RiArrowDropDownLine} from 'react-icons/ri';
import {MdBlock, MdDeleteOutline} from 'react-icons/md';
import {FaSortUp,FaSortDown} from "react-icons/fa6";
import {toast} from 'react-toastify';

export default function AdminCustomersPage() {
    const dispatch = useDispatch();
    const { adminLoading, adminError, adminSuccess, adminMessage, allUsers } = useSelector(state => state.admin);

    const [localUsers, setLocalUsers] = useState([]);
    const [sortIconStyler, setSortIconStyler] = useState({current:false, default:true})
    // const usernameSortUpIcon, emailSortUpIcon, mobileSortUpIcon
    const [activeSorter, setActiveSorter] = useState({field:'',order:''})
    const mainBgImg = {
        colorImage : "linear-gradient(to right,rgba(255,255,255),rgba(255,255,255))"
    }

    
    useEffect(() => {
        if (sortIconStyler) {
            console.log("Sort icon styler is now true");
            // Perform actions that depend on sortIconStyler being true
        }
    }, [sortIconStyler]);

    useEffect(() => {
        dispatch(showUsers());
    }, [dispatch]);

    const deleteHandler = (id) => {
        setLocalUsers(prevUsers => prevUsers.filter(user => user._id !== id));
        dispatch(deleteUser(id));
    };

    useEffect(() => {
        if (allUsers) {
            setLocalUsers(allUsers);
        }
    }, [allUsers]);

    useEffect(() => {
        if (adminMessage) {
            toast.success(`The User is ${adminMessage.toLowerCase()}`);
        }
        if(adminError){
            toast.error(adminError)
        }
        dispatch(resetStates());
    }, [adminMessage, adminError, dispatch]);

    const toggleBlockHandler = (id) => {
        setLocalUsers(prevUsers =>
            prevUsers.map(user =>
                user._id === id ? { ...user, isBlocked: !user.isBlocked } : user
            )
        );
        dispatch(toggleBlockUser(id));
    };

    
    
    const searchHandler = (e)=>{
        console.log("Inside searchHandler")
        if(e.target.value.trim()==""){
            dispatch(showUsers());
        }
        else{
            const searchRegex = new RegExp(`^(${e.target.value.trim()})`)
            setLocalUsers(localUsers.filter(user=>searchRegex.test(user.username)||searchRegex.test(user.email)||searchRegex.test(user.mobile)))
        }
    }

    const sortHandler = (e,type,order)=>{
        console.log("typeof localUsers[0][type]-->"+typeof localUsers[0][type])

        if(e.target.style.height=='15px'){
                e.target.style.height='10px'
                e.target.style.color='rgba(159, 42, 240, 0.5)'
                console.log("Going to default icon settings and localUsers--")
                setLocalUsers(allUsers)
                console.log("Localusers now-->"+JSON.stringify(localUsers))
            }
            else {
                setActiveSorter({field:type, order})
                const sortedNames = order==1? localUsers.map(user=>user[type]).sort() 
                                        : typeof localUsers[0][type] == "string"? localUsers.map(user=>user[type]).sort((a,b)=>b.localeCompare(a))
                                                                         : localUsers.map(user=>user[type]).sort((a,b)=>b-a)
                const sortedUsers = []
                for(let i=0; i<sortedNames.length; i++){
                    for(let user in localUsers){
                        if(localUsers[user][type] == sortedNames[i])
                            sortedUsers.push(localUsers[user])
                    }
                }
                setLocalUsers(sortedUsers)
                console.log("SortedNames-->"+sortedNames)
                console.log("sortedUsers-->"+JSON.stringify(sortedUsers)) 
            }
            
    }

    return (
        <section className='h-screen pl-[3rem] z-[-1]' id='AdminCustomersPage'>
            <h1 className='text-h3Semibold'>Customers</h1>

            <p className='mt-[5rem] h-[30px] '>{showUsers && adminLoading?"LOADING...":""}</p>
            <main className='p-[1rem] border border-secondary flex items-center justify-center w-[80%] 
                                    rounded-[9px]' style={mainBgImg}>
                <table cellSpacing={10} cellPadding={10} className='border-spacing-[24px]'>
                    <thead>
                        <tr>
                            <td colSpan='2'>
                                <input type='search' placeholder='Search..' className='secondaryLight-box text-[13px] 
                                                    w-full h-[35px] pl-[10px]' onChange={(e)=>searchHandler(e)}/>
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
                        <tr className='secondaryLight-box border border-[rgb(220, 230, 166)] font-[500] text-secondary table-header'>
                            <td>
                                <div className='flex items-center'>
                                    <span>Name</span>
                                    <i className='flex flex-col h-[5px]'>
                                        <FaSortUp  onClick = {(e)=>{ sortHandler(e,"username",1)}} 
                                                style={{height: activeSorter.field === "username" && activeSorter.order === 1 ? '15px' : '10px',
                                                        color: activeSorter.field === "username" && activeSorter.order === 1 ? 'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                                        <FaSortDown onClick = {(e)=>sortHandler(e,"username",-1)} 
                                            style={{height: activeSorter.field === "username" && activeSorter.order === -1 ? '15px' : '10px',color: activeSorter.field === "username" && activeSorter.order === -1 ? 'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)' }}/>
                                    </i>
                                </div> 
                            </td>
                            <td>
                                <div className='flex items-center'>
                                    <span>Email</span>
                                    <i className='flex flex-col h-[5px]'>
                                        <FaSortUp onClick = {(e)=>sortHandler(e,"email",1)} 
                                            style={{height: activeSorter.field === "email" && activeSorter.order === 1 ? '15px' : '10px',color: activeSorter.field === "email" && activeSorter.order === 1 ? 'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                                        <FaSortDown onClick = {(e)=>sortHandler(e,"email",-1)} 
                                            style={{height: activeSorter.field === "email" && activeSorter.order === -1 ? '15px' : '10px',color: activeSorter.field === "email" && activeSorter.order === -1 ? 'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                                    </i>
                                </div>
                            </td>
                            <td>
                                <div className='flex items-center'>
                                    <span>Mobile</span>
                                    <i className='flex flex-col h-[5px]'>
                                        <FaSortUp onClick = {(e)=>sortHandler(e,"mobile",1)} 
                                            style={{height: activeSorter.field === "mobile" && activeSorter.order === 1 ? '15px' : '10px', color: activeSorter.field === "mobile" && activeSorter.order === 1 ? 'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                                        <FaSortDown onClick = {(e)=>sortHandler(e,"mobile",-1)} 
                                            style={{height: activeSorter.field === "mobile" && activeSorter.order === -1 ? '15px' : '10px', color: activeSorter.field === "mobile" && activeSorter.order === -1 ? 'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}} />
                                    </i>
                                </div>
                            </td>
                            <td>
                                <div className='flex items-center'>
                                    <span>Wallet</span>
                                    <i className='flex flex-col h-[5px]'>
                                        <FaSortUp onClick = {(e)=>sortHandler(e,"wallet",1)} 
                                            style={{height: activeSorter.field === "wallet" && activeSorter.order === 1 ? '15px' : '10px', color: activeSorter.field === "wallet" && activeSorter.order === 1 ? 'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                                        <FaSortDown onClick = {(e)=>sortHandler(e,"wallet",-1)} 
                                            style={{height: activeSorter.field === "wallet" && activeSorter.order === -1 ? '15px' : '10px', color: activeSorter.field === "wallet" && activeSorter.order === -1 ? 'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                                    </i>
                                </div>
                            </td>
                            <td></td>
                        </tr>
                    </thead>
                    <tr><td colSpan='5'></td></tr>
                    
                    <tbody className='text-[14px]'>
                        {
                            localUsers.length > 0 ? localUsers.map(user =>
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.mobile}</td>
                                    <td>--</td>
                                    <td>
                                        <div className='flex items-center gap-[10px] action-buttons'>
                                            <button type='button' className='basis-[103px]' onClick={() => toggleBlockHandler(user._id)}>
                                                 {user.isBlocked ? "Unblock" : "Block"} <MdBlock/>
                                            </button>
                                            <button type='button' onClick={() => deleteHandler(user._id)} 
                                                    className='text-red-500'> Delete <MdDeleteOutline/></button>
                                        </div>
                                    </td>
                                </tr>
                            ) :<tr><td>No Records!</td></tr>
                        }
                    </tbody>
                </table>
            </main>
        </section>
    );
}