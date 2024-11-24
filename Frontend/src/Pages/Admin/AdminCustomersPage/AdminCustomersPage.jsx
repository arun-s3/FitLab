import React, {useEffect, useState, useRef} from 'react';
import './AdminCustomersPage.css';
import axios from '../../../Utils/axiosConfig';
import {useSelector, useDispatch} from 'react-redux';

import AdminHeader from '../../../Components/AdminHeader/AdminHeader';
import Modal from '../../../Components/Modal/Modal';
import {showUsers, showUsersofStatus, toggleBlockUser, deleteUser, deleteUsersList, resetStates} from '../../../Slices/adminSlice';

import {IoArrowBackSharp} from "react-icons/io5";
import {RiArrowDropDownLine} from 'react-icons/ri';
import {MdBlock, MdDeleteOutline} from 'react-icons/md';
import {FaSortUp,FaSortDown} from "react-icons/fa6";
import {FaTrashAlt} from "react-icons/fa";
import {LuCaseSensitive} from "react-icons/lu";
import {VscCaseSensitive} from "react-icons/vsc";
import {CiSquareChevRight} from "react-icons/ci";
import {toast} from 'react-toastify';

export default function AdminCustomersPageV1() {
    const dispatch = useDispatch();
    const { adminLoading, adminError, adminSuccess, adminMessage, allUsers } = useSelector(state => state.admin);

    const [localUsers, setLocalUsers] = useState([]);
    const [tempUsers, setTempUsers] = useState([])

    const [trashUserList, setTrashUserList] = useState(false)

    const [deleteDelay, setDeleteDelay ] = useState(null)
    const [deleteThisId, setDeleteThisId] = useState(null)
    const [initiateDeleteHandler, setInitiateDeleteHandler] = useState(false)
    let timerId = useRef(null)

    const [matchCase, setMatchCase] = useState(false)

    const [activeSorter, setActiveSorter] = useState({field:'',order:''})

    const statusDropdownRef = useRef(null)
    const statusButtonRef = useRef(null)
    const [showStatusDropdown, setShowStatusDropdown] = useState(false)

    const [openModel, setOpenModel] = useState(false)

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
            setTempUsers(allUsers);
        }
    }, [allUsers]);

    useEffect(() => {
        console.log("Inside useEffect for tempUsers");
        let tempUserList = [...tempUsers];

        if (activeSorter.field && activeSorter.order) {
            console.log("Sorting users based on activeSorter...");
            console.log(`Field: ${activeSorter.field}, Order: ${activeSorter.order}`);
            tempUserList = sortUsers(activeSorter.field, activeSorter.order, true);
        }
        const status = statusButtonRef.current?.textContent?.trim().toLowerCase();
        if (status && status !== 'status' && status !== 'all') {
            const isBlocked = status === 'blocked';
            tempUserList = tempUserList.filter(user => user.isBlocked === isBlocked);
        }
    
        setLocalUsers(tempUserList);

    }, [tempUsers, activeSorter.field, activeSorter.order, statusButtonRef.current?.textContent]);
    

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
    }

    const preDeleteHandler = (id)=> {
        setOpenModel(true)
        setDeleteThisId(id)
    }

    const deleteHandler = (clearTimer=false) => {
        if(deleteThisId){
            setDeleteDelay(15);
            const id = deleteThisId
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
            }, 1000)
        }
    }

    const undoDeleteHandler = ()=>{
        if(timerId.current){
            clearInterval(timerId.current)
            setDeleteDelay(0)
            timerId.current = null
            setDeleteThisId(null)
        }
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
                sortUsers(type, order, false)
            }
            
    }

    const sortUsers = (type, order, returnData)=> {
        console.log("Sorting.....")
        console.log(`type-->${type}, order-->${order}`)
        console.log("tempUsers now inside sortUsers-->", tempUsers)
        const sortedNames = order==1? tempUsers.map(user=>user[type]).sort() 
                                        : typeof tempUsers[0][type] == "string"? tempUsers.map(user=>user[type]).sort((a,b)=>b.localeCompare(a))
                                                                         : tempUsers.map(user=>user[type]).sort((a,b)=>b-a)
        const sortedUsers = []
        for(let i=0; i<sortedNames.length; i++){
            for(let user in tempUsers){ 
                if(tempUsers[user][type] == sortedNames[i])
                    sortedUsers.push(tempUsers[user])
            }
        }
        console.log("SortedNames-->"+sortedNames)
        console.log("sortedUsers-->"+JSON.stringify(sortedUsers)) 
        if(returnData){
            return sortedUsers
        }else{
            setLocalUsers(sortedUsers)
        }
    }

    const statusDropdownToggle = (e)=>{
        setShowStatusDropdown(false)
        e.target.tagName=='BUTTON'?e.target.parentElement.style.borderBottomLeftRadius = e.target.parentElement.style.borderBottomRightRadius = showStatusDropdown?'8px' : '0px'
                                  :e.target.style.borderBottomLeftRadius = e.target.style.borderBottomRightRadius = showStatusDropdown?'8px' : '0px'
        statusDropdownRef.current.style.display = 'inline-block'
        setShowStatusDropdown(!showStatusDropdown)
    }

    const statusSelector = (status)=> {
        console.log("Inside statusSelector--")
        statusButtonRef.current.textContent = status
        console.log("dispatching-- showUsersofStatus({status})")
        dispatch(showUsersofStatus({status}))
    }

    return (
        <section className='h-screen z-[-1]' id='AdminCustomersPage'>
            {/* <h1 className='text-h3Semibold mb-[2rem]'>Customers</h1> */}
            <header>
                <AdminHeader heading='Customers' subHeading='View, Update, and Oversee Customer accounts'/>
            </header>
            <main className='p-[1rem] border border-secondary flex items-center justify-center w-[80%] 
                                    rounded-[9px] gap-[5px]' style={mainBgImg}>
                { openModel &&
                    <Modal openModel={openModel} setOpenModel={setOpenModel} title='Important' content='You are about to delete a customer. Do this only if he/she is a recognized spammer.
                        Also confirm as many times as possible' instruction="If you are sure, write 'sure' and press 'Ok', else click 'Close' button"
                            buttonText1='Ok' buttonText2='Cancel' deleteHandler={deleteHandler}/>
                }
                <table cellSpacing={10} cellPadding={10} className='border-spacing-[24px]'>
                    <thead>
                        <tr>
                            <td colSpan='2'>
                                <div className='flex gap-[8px]' id='searcher'>
                                    <input type='search' placeholder='Search..' className='secondaryLight-box text-[13px] border-primary
                                                   rounded-[8px] text-secondary w-full h-[35px] pl-[10px]' onChange={(e)=>searchHandler(e)}/>
                                    <span className='self-end px-[3px] mb-[3px] bg-primary rounded-[4px] cursor-pointer relative case-tooltip' 
                                            style={matchCase? {outlineWidth:'1.5px', outlineColor:'#9f2af0', outlineOffset:'2px', outlineStyle:'solid'}:null}
                                                    onClick={()=>{console.log("clicked Matchcase-->"+matchCase); setMatchCase(!matchCase)}}>
                                        <VscCaseSensitive/>
                                    </span>
                                </div>
                            </td>
                            <td></td>
                            <td>
                                <div className='inline-flex relative items-center justify-between secondaryLight-box cursor-pointer 
                                     text-[13px] px-[11px] w-[75%] h-[35px] border-solid bottom-0 border-secondary customer-dropdown' 
                                                 style={showStatusDropdown? {borderWidth:'1px', borderBottom:'0', borderBottomLeftRadius:'0px', borderBottomRightRadius:'0px', background:'white', boxShadow:'2px -5px 6px rgba(72, 69, 75, 0.2)'}:{border:0, borderBottomLeftRadius:'8px', borderBottomRightRadius:'8px'}}
                                                 onClick={(e)=>{statusDropdownToggle(e)}}>
                                    
                                    <div className='absolute top-full left-[-1px] w-[101.5%] rounded-none rounded-bl-[8px] rounded-br-[8px] 
                                       secondaryLight-box cursor-pointer border border-secondary border-t-0 pb-[10px] hidden' ref={statusDropdownRef}
                                                                style={showStatusDropdown? {display:'inline-block', background:'white', boxShadow:'2px 5px 6px rgba(72, 69, 75, 0.2)'}: null}>
                                        <ul className='list-none text-[11px] text-secondary font-[450]'>
                                            <li className='text-right flex items-center pl-[20px] hover:bg-primary' onClick={()=> statusSelector('active')}>
                                               <span className='flex items-center gap-[10px]'> <CiSquareChevRight/> <span>Active</span> </span> 
                                            </li>

                                            <li className='text-right flex items-center pl-[20px] hover:bg-primary' onClick={()=> statusSelector('blocked')}> 
                                                <span className='flex items-center gap-[10px]'> <CiSquareChevRight/> <span>Blocked</span> </span> 
                                            </li>
                                            
                                            <li className='text-right flex items-center pl-[20px] hover:bg-primary' onClick={()=> statusSelector('all')}> 
                                            <span className='flex items-center gap-[10px]'> <CiSquareChevRight/> <span>All</span> </span> 
                                            </li>
                                        </ul>
                                    </div>
                                    <button className='ml-[15px] capitalize' ref={statusButtonRef} >Status</button>
                                    <RiArrowDropDownLine style={{color:'rgba(159, 42, 240, 1)'}}/>
                                </div>
                            </td>  
                            <td>
                                <div className='inline-flex items-center justify-between secondaryLight-box cursor-pointer
                                                                                            text-[13px] px-[11px] w-[75%] h-[35px] customer-dropdown'> 
                                    <button className='ml-[15px]'>Show Entries: </button>
                                    <RiArrowDropDownLine style={{color:'rgba(159, 42, 240, 1) '}}/>
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
                            <td className='text-left'>
                                <p className=''>{showUsers && adminLoading?"LOADING...":""}</p>
                                <p className=''>
                                    <span className='text-[12px]'>
                                    {deleteDelay?
                                        (<span className='text-red-500 ml-[6px] tracking-[0.3px] whitespace-nowrap align-[1px]'>
                                            <span className='text-green-500 font-bold mr-[4px] cursor-pointer'
                                                         onClick={(e)=> undoDeleteHandler()}>
                                                Undo?
                                            </span> Deleting in {deleteDelay} seconds...`
                                        </span>
                                        ) : null
                                    }
                                    </span>
                                </p>
                            </td>
                        </tr> 
                    </thead>
                    <tr>
                        <td colSpan='5'>
                        </td>
                    </tr>
                    
                    <tbody className='text-[13px]'>
                        {   
                            localUsers.length > 0 ? localUsers.map((user,index) =>
                                <tr key={user._id} className={`${(index % 2 == 0)? 'bg-[#eee]': 'bg-transparent'} cursor-pointer hover:bg-[#f3f7df]`}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.mobile}</td>
                                    <td>--</td>
                                    <td>
                                        <div className='flex items-center gap-[10px] text-[14px] action-buttons'>
                                            <button type='button' className='basis-[103px]' onClick={() => toggleBlockHandler(user._id)}>
                                                 {user.isBlocked ? "Unblock" : "Block"} <MdBlock style={user.isBlocked? {color:'#22c55e'}:{color:'#e74c3c'}}/>
                                            </button>
                                            <button type='button' onClick={() => preDeleteHandler(user._id)} style={{paddingBlock: '5px'}}
                                                    className='text-red-500 '> <MdDeleteOutline/></button>
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
