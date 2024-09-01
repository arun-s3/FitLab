import React, {useEffect, useState, useRef} from 'react';
import './AdminCustomersPage.css';
import axios from '../../Utils/axiosConfig';
import {useSelector, useDispatch} from 'react-redux';
import {showUsers, toggleBlockUser, deleteUser, deleteUsersList, resetStates} from '../../Slices/adminSlice';

import {RiArrowDropDownLine} from 'react-icons/ri';
import {MdBlock, MdDeleteOutline} from 'react-icons/md';
import {FaSortUp,FaSortDown} from "react-icons/fa6";
import {FaTrashAlt} from "react-icons/fa";
import {LuCaseSensitive} from "react-icons/lu";
import {VscCaseSensitive} from "react-icons/vsc";
import {toast} from 'react-toastify';

export default function AdminCustomersPageV1() {
    const dispatch = useDispatch();
    const { adminLoading, adminError, adminSuccess, adminMessage, allUsers } = useSelector(state => state.admin);

    const [localUsers, setLocalUsers] = useState([]);

    const [trashUserList, setTrashUserList] = useState(false)

    const [deleteDelay, setDeleteDelay ] = useState(null)
    let timerId = useRef(null)

    const [matchCase, setMatchCase] = useState(false)

    const [activeSorter, setActiveSorter] = useState({field:'',order:''})

    const statusDropdownRef = useRef(null)
    const statusButtonRef = useRef(null)
    const [showStatusDropdown, setShowStatusDropdown] = useState(false)

    const mainBgImg = {
        colorImage : "linear-gradient(to right,rgba(255,255,255),rgba(255,255,255))"
    }

    useEffect(() => {
        console.log("Dispatching showUsers()--- ")
        dispatch(showUsers());
    }, [dispatch, adminMessage]);

    useEffect(() => {
        console.log("Setting localUsers to allUsers--- ")
        if (allUsers) {
            setLocalUsers(allUsers);
        }
        if(statusButtonRef.current){
            console.log("Inside useEffet, statusButtonRef.current")
            if(statusButtonRef.current.textContent == "Blocked"){
                console.log("Inside useEffect, statusButtonRef.current.textContent == Blocked ")
                setLocalUsers(currentUsers=>currentUsers.filter(user=>user.isBlocked))
            }
            if(statusButtonRef.current.textContent == "Active"){
                console.log("Inside useEffect, statusButtonRef.current.textContent == Active ")
                setLocalUsers(currentUsers=>currentUsers.filter(user=>!user.isBlocked))
            }
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
        console.log("Dispatching toggleBlockUser()-- ")
        dispatch(toggleBlockUser(id));
    };

    const deleteHandler = (id,clearTimer=false) => {
        setDeleteDelay(10);
        console.log("Set delete delay to 10 seconds");
        
        timerId.current = setInterval(() => {
            setDeleteDelay(prevCount => {
                if (prevCount <= 1) {
                    clearInterval(timerId.current); 
                    dispatch(deleteUser(id)); 
                    setLocalUsers(prevUsers => prevUsers.filter(user => user._id !== id));
                    console.log("User deletion dispatched");
                    return null;
                } else {
                    console.log(`Countdown: ${prevCount - 1} seconds remaining`);
                    return prevCount - 1;
                }
            });
        }, 1000);
    };

    const undoDeleteHandler = ()=>{
        if(timerId.current){
            clearInterval(timerId.current)
            setDeleteDelay(0)
            timerId.current = null
        }
    }

    const trashHandler = (userIdList)=>{
        setLocalUsers(prevUsers => prevUsers.filter(user => userIdList.userList.every(userId=> user._id !== userId)));
        dispatch(deleteUsersList(userIdList))
    }

    const searchHandler = (e)=>{
        console.log("Inside searchHandler")
        if(e.target.value.trim()==""){
            dispatch(showUsers());
        }
        else{
            if(matchCase){
                console.log("Inside searchHandler matchCase true case")
                const searchRegex = new RegExp(`^(${e.target.value.trim()})`) 
                setLocalUsers( localUsers.filter(user=>searchRegex.test(user.username)||searchRegex.test(user.email)||searchRegex.test(user.mobile)) )
            }
            else{
                const searchValue = e.target.value.toString().toLowerCase()
                console.log("Inside searchHandler matchCase false case")
                console.log("localUsers.filter(user=> user.username.includes(e.target.value))-->"+JSON.stringify(localUsers.filter(user=> user.username.includes(e.target.value.toLowerCase||e.target.value.toUpperCase))) )
                setLocalUsers( localUsers.filter(user=> user.username.toLowerCase().includes(searchValue)||user.email.toLowerCase().includes(searchValue)||user.mobile.toString().toLowerCase().includes(searchValue)) )
            }
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

    const statusDropdownToggle = (e)=>{
        setShowStatusDropdown(false)
        e.target.tagName=='BUTTON'?e.target.parentElement.style.borderBottomLeftRadius = e.target.parentElement.style.borderBottomRightRadius = showStatusDropdown?'8px' : '0px'
                                  :e.target.style.borderBottomLeftRadius = e.target.style.borderBottomRightRadius = showStatusDropdown?'8px' : '0px'
        statusDropdownRef.current.style.display = 'inline-block'
        setShowStatusDropdown(!showStatusDropdown)
    }

    return (
        <section className='h-screen pl-[3rem] z-[-1]' id='AdminCustomersPage'>
            <h1 className='text-h3Semibold'>Customers</h1>

            <p className='mt-[2rem] h-[30px] '>{showUsers && adminLoading?"LOADING...":""}</p>
            <p className='h-[27px] ml-[4px]'><span className='text-[12px]'>{deleteDelay? (<span className='text-red-500 ml-[6px] whitespace-nowrap align-[1px]'>
                                                                <span className='text-secondary font-bold mr-[4px] cursor-pointer' onClick={(e)=>{
                                                                                undoDeleteHandler(); 
                                                                                // e.target.parentElement.style.display = 'none'
                                                                             }}>
                                                                    Undo?
                                                                </span> Deleting in {deleteDelay} seconds...`
                                                            </span>): null}</span></p>
            <main className='p-[1rem] border border-secondary flex items-center justify-center w-[80%] 
                                    rounded-[9px] gap-[5px]' style={mainBgImg}>
                <table cellSpacing={10} cellPadding={10} className='border-spacing-[24px]'>
                    <thead>
                        <tr>
                            <td colSpan='2'>
                                <div className='flex gap-[8px]' id='searcher'>
                                    <input type='search' placeholder='Search..' className='secondaryLight-box text-[13px] 
                                                    w-full h-[35px] pl-[10px]' onChange={(e)=>searchHandler(e)}/>
                                    <span className='self-end px-[3px] mb-[3px] bg-primary rounded-[4px] cursor-pointer relative case-tooltip' 
                                            style={matchCase? {outlineWidth:'1.5px', outlineColor:'#9f2af0', outlineOffset:'2px', outlineStyle:'solid'}:null}
                                                    onClick={()=>{console.log("clicked Matchase-->"+matchCase); setMatchCase(!matchCase)}}>
                                        <VscCaseSensitive/>
                                    </span>
                                </div>
                            </td>
                            <td></td>
                            <td>
                                <div className='inline-flex relative items-center justify-between secondaryLight-box cursor-pointer
                                     text-[13px] px-[11px] w-[75%] h-[35px] border-solid bottom-0 border-secondary customer-dropdown' 
                                                 style={showStatusDropdown? {borderWidth:'1px', borderBottom:'0', borderBottomLeftRadius:'0px', borderBottomRightRadius:'0px', background:'rgb(227, 219, 232)', boxShadow:'2px -5px 6px rgba(72, 69, 75, 0.2)'}:{border:0, borderBottomLeftRadius:'8px', borderBottomRightRadius:'8px'}}
                                                 onClick={(e)=>{statusDropdownToggle(e)}}>
                                    
                                    <div className='absolute top-full left-[-1px] w-[102%] rounded-none rounded-bl-[8px] rounded-br-[8px]
                                       secondaryLight-box cursor-pointer border border-secondary border-t-0 pb-[10px] hidden' ref={statusDropdownRef}
                                                                style={showStatusDropdown? {display:'inline-block', background:'rgb(227, 219, 232)', boxShadow:'2px 5px 6px rgba(72, 69, 75, 0.2)'}: null}>
                                        <ul className='list-none text-[11px] text-secondary font-[450]'>
                                            <li className='text-right flex items-center justify-center' onClick={()=>{
                                                setLocalUsers(allUsers)
                                                statusButtonRef.current.textContent = "Active"
                                                console.log("Indide onClick of Blocked users, AllUsers-->"+JSON.stringify(allUsers))
                                                setLocalUsers(currentUsers=>currentUsers.filter(user=>!user.isBlocked))
                                            }}>
                                                 <hr/>Active<hr/> </li>

                                            <li className='text-right flex items-center justify-center'onClick={()=>{
                                                setLocalUsers(allUsers)
                                                statusButtonRef.current.textContent = "Blocked"
                                                setLocalUsers(currentUsers=>currentUsers.filter(user=>user.isBlocked))
                                            }}> 
                                                <hr/>Blocked<hr/> </li>
                                            
                                                <li className='text-right flex items-center justify-center'onClick={()=>{
                                                setLocalUsers(allUsers)
                                                statusButtonRef.current.textContent = "Status"
                                            }}> 
                                                <hr/>Status<hr/> </li>
                                        </ul>
                                    </div>
                                    <button className='ml-[15px]' ref={statusButtonRef} >Status</button>
                                    <RiArrowDropDownLine/>
                                </div>
                            </td>
                            <td>
                                <div className='inline-flex items-center justify-between secondaryLight-box cursor-pointer
                                                                                            text-[13px] px-[11px] w-[75%] h-[35px] customer-dropdown'> 
                                    <button className='ml-[15px]'>Show Entries: </button>
                                    <RiArrowDropDownLine />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan='6'>
                                <hr></hr>
                            </td>
                        </tr>
                        <tr className='secondaryLight-box border border-[rgb(220, 230, 166)] font-[500] text-secondary table-header'>
                            <td>
                                <div className='flex items-center'>
                                    <span>Name</span>
                                    <i className='flex flex-col h-[5px]'>
                                        <FaSortUp  onClick = {(e)=>{ sortHandler(e,"username",1)}} 
                                                style={{height: activeSorter.field === "username" && activeSorter.order === 1 ?'15px':'10px',
                                                            color: activeSorter.field === "username" && activeSorter.order === 1 ? 
                                                                        'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                                        <FaSortDown onClick = {(e)=>sortHandler(e,"username",-1)} 
                                            style={{height: activeSorter.field === "username" && activeSorter.order === -1 ?'15px':'10px',
                                                        color: activeSorter.field === "username" && activeSorter.order === -1 ? 
                                                        'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)' }}/>
                                    </i>
                                </div> 
                            </td>
                            <td>
                                <div className='flex items-center'>
                                    <span>Email</span>
                                    <i className='flex flex-col h-[5px]'>
                                        <FaSortUp onClick = {(e)=>sortHandler(e,"email",1)} 
                                            style={{height: activeSorter.field === "email" && activeSorter.order === 1 ?'15px':'10px',
                                                        color: activeSorter.field === "email" && activeSorter.order === 1 ?
                                                            'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                                        <FaSortDown onClick = {(e)=>sortHandler(e,"email",-1)} 
                                            style={{height: activeSorter.field === "email" && activeSorter.order === -1 ?'15px':'10px',
                                                        color: activeSorter.field === "email" && activeSorter.order === -1 ? 
                                                         'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                                    </i>
                                </div>
                            </td>
                            <td>
                                <div className='flex items-center'>
                                    <span>Mobile</span>
                                    <i className='flex flex-col h-[5px]'>
                                        <FaSortUp onClick = {(e)=>sortHandler(e,"mobile",1)} 
                                            style={{height: activeSorter.field === "mobile" && activeSorter.order === 1 ?'15px':'10px',
                                                    color: activeSorter.field === "mobile" && activeSorter.order === 1 ? 
                                                       'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                                        <FaSortDown onClick = {(e)=>sortHandler(e,"mobile",-1)} 
                                            style={{height: activeSorter.field === "mobile" && activeSorter.order === -1 ?'15px':'10px',
                                                        color: activeSorter.field === "mobile" && activeSorter.order === -1 ? 
                                                            'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}} />
                                    </i>
                                </div>
                            </td>
                            <td>
                                <div className='flex items-center'>
                                    <span>Wallet</span>
                                    <i className='flex flex-col h-[5px]'>
                                        <FaSortUp onClick = {(e)=>sortHandler(e,"wallet",1)}
                                            style={{height: activeSorter.field === "wallet" && activeSorter.order === 1 ?'15px':'10px',
                                                        color: activeSorter.field === "wallet" && activeSorter.order === 1 ? 
                                                            'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                                        <FaSortDown onClick = {(e)=>sortHandler(e,"wallet",-1)}
                                            style={{height: activeSorter.field === "wallet" && activeSorter.order === -1 ?'15px':'10px',
                                                         color: activeSorter.field === "wallet" && activeSorter.order === -1 ? 
                                                            'rgba(159, 42, 240, 1)' : 'rgba(159, 42, 240, 0.5)'}}/>
                                    </i>
                                </div>
                            </td>
                            <td></td>
                            <td>
                                 <div className='flex gap-[5px] items-center'>
                                     <input type='checkbox' name='trashAllItems'/>
                                     <FaTrashAlt onClick={()=>{
                                        const userIdList = {userList:trashUserList}
                                        console.log('userList from AdmnCustomerPage.jsx-->'+JSON.stringify())
                                        trashHandler(userIdList)
                                        }} /> 
                                </div>
                            </td>
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
                                    <td className='text-left'>
                                        <input type='checkbox' name='trashItem' value={user._id} 
                                                    onClick={()=>setTrashUserList([...trashUserList, user._id])}/> 
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
