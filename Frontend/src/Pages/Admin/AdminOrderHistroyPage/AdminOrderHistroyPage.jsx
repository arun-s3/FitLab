import React, {useState, useEffect, useRef} from 'react'
import './AdminOrderHistroyPage.css'
import {useDispatch, useSelector} from 'react-redux'

import {ShoppingBag, Package, RefreshCcw, CircleOff, Box, Download, Search, MoreHorizontal, MessageSquare, 
   Filter, Plus, CalendarArrowDown, CircleCheckBig, SquareCheckBig, Truck, PackageCheck, ChevronDown, ShoppingCart } from 'lucide-react'
import {RiArrowDropDownLine} from "react-icons/ri"
import {BiCartAdd} from "react-icons/bi"
import {TbCreditCardRefund} from "react-icons/tb"
import {MdSort} from "react-icons/md"
import {format} from "date-fns"
import axios from 'axios'

import AdminTitleSection from '../../../Components/AdminTitleSection/AdminTitleSection'
import {DateSelector} from '../../../Components/Calender/Calender'
import Modal from '../../../Components/Modal/Modal'
import CancelForm from '../../../Components/CancelForm/CancelForm'
import {SitePrimaryButtonWithShadow, SiteSecondaryFillImpButton} from '../../../Components/SiteButtons/SiteButtons' 
import PaginationV2 from '../../../Components/PaginationV2/PaginationV2'
import {getOrders, getAllUsersOrders, cancelOrder, cancelOrderProduct, changeOrderStatus,
          changeProductStatus, resetOrderStates} from '../../../Slices/orderSlice'


export default function AdminOrderHistoryPage(){

  const [statusCounts, setStatusCounts] = useState({})
    
  const [activeTab, setActiveTab] = useState('All')
  const [orderDuration, setOrderDuration] = useState('All Orders')

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 20
  const [limit, setLimit] = useState(10) 

  const [queryDetails, setQueryDetails] = useState({'page': 1, 'limit': 10, 'sort': -1, 'orderStatus': 'orders'})

  const mouseInSort = useRef(true)

  const [openOrderCancelModal, setOpenOrderCancelModal] = useState(false)
  const [cancelThisOrderId, setCancelThisOrderId] = useState(null)
  const [openCancelForm, setOpenCancelForm] = useState({type:'', status:false, options:{}})
  const [openSelectReasons, setOpenSelectReasons] = useState({status:false, reasonTitle:'', reason:''})
  const productCancelFormRef = useRef(null)
  const orderCancelFormRef = useRef(null)

  const [isHovered, setIsHovered] = useState({})
  const [showProducts, setShowProducts] = useState({})

  const {orders, orderCreated, orderMessage, orderError} = useSelector(state=> state.order)
  const dispatch = useDispatch()

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  const [openDropdowns, setOpenDropdowns] = useState({showTab: false, durationDropdown: false, sortDropdown: false, limitDropdown: false})
    const dropdownRefs = {
      showTab: useRef(null),
      durationDropdown: useRef(null),
      sortDropdown: useRef(null),
      limitDropdown: useRef(null)
    }
  
    const toggleDropdown = (dropdownKey)=> {
      setOpenDropdowns((prevState)=>
        Object.keys(prevState).reduce((newState, key)=> {
          newState[key] = key === dropdownKey? !prevState[key] : false
          return newState
        }, {})
      )
    }
  
    useEffect(()=> {
      const handleClickOutside = (e)=> {
        const isOutside = !Object.values(dropdownRefs).some( (ref)=> ref.current?.contains(e.target) )
        console.log("isOutside--->", isOutside)
  
        if (isOutside){
          setOpenDropdowns((prevState)=>
            Object.keys(prevState).reduce((newState, key)=> {
              newState[key] = false
              return newState
            }, {})
          )
        }
      }
      document.addEventListener("click", handleClickOutside)
      return ()=> {
        document.removeEventListener("click", handleClickOutside)
      }
    }, [])

    useEffect(()=> {
      async function findStatus(){
        const response = await axios.get(`${baseApiUrl}/order/statusCounts`, {withCredentials: true})
        console.log("Response from statusCounts", response.data)
        setStatusCounts(response.data.statusCounts) 
      }
      findStatus()
    },[])

    useEffect(()=> {
        setQueryDetails(query=> {
          return {...query, startDate, endDate}
        })
    },[startDate, endDate])

    useEffect(()=> {
        if(Object.keys(queryDetails).length > 0){
          console.log("queryDetails---->", JSON.stringify(queryDetails))
          dispatch( getAllUsersOrders({queryDetails}) )
        }
    },[queryDetails])


  const metrics = [
    {
      title: 'Total orders',
      value: statusCounts.totalOrders,
      icon: <ShoppingBag className="w-6 h-6 text-white" />,
    },
    {
      title: 'Delivered Orders',
      value: statusCounts.deliveredOrders,
      icon: <Package className="w-6 h-6 text-white" />,
    },
    {
      title: 'Returned Orders',
      value: statusCounts.returningOrders,
      icon: <RefreshCcw className="w-6 h-6 text-white" />,
    },
    {
      title: 'Cancelled Orders',
      value: statusCounts.cancelledOrders,
      icon: <CircleOff className="w-6 h-6 text-white" />,
    }
  ]

  const tabs = ['all', 'cancelled', 'delivered', 'processing', 'refunded', 'confirmed', 'shipped', 'returning']

  const orderStatusStyles = [
    {status:'processing', textColor:'text-orange-300', bg:'bg-orange-300', lightBg:'bg-orange-50', border:'border-orange-300', shadow: '#fdba74'},
    {status:'confirmed', textColor:'text-yellow-500', bg:'bg-yellow-500', lightBg:'bg-yellow-50', border:'border-yellow-300', shadow: '#fde047'},
    {status:'shipped', textColor: 'text-blue-500', bg: 'bg-blue-500', lightBg: 'bg-blue-50', border: 'border-blue-300', shadow: '#93c5fd'},
    {status:'delivered', textColor:'text-green-500', bg:'bg-green-500', lightBg:'bg-green-50', border:'border-green-300', shadow: '#86efac'}, 
    {status:'cancelled', textColor:'text-red-700', bg:'bg-red-700', lightBg:'bg-red-50', border:'border-red-300', shadow: '#fca5a5'},
    {status:'returning', textColor:'text-red-500', bg:'bg-red-500', lightBg:'bg-red-50', border:'border-red-300', shadow: '#fca5a5'},
    {status:'refunded', textColor:'text-green-500', bg:'bg-green-500', lightBg:'bg-green-50', border:'border-green-300', shadow: '#86efac'},
  ]
  const paymentStatusStyles = [
    {status:'pending', textColor:'text-yellow-500', bg:'bg-yellow-500', lightBg:'bg-yellow-50', border:'border-yellow-300', shadow: '#fde047'}, 
    {status:'completed', textColor:'text-green-500', bg:'bg-green-500', lightBg:'bg-green-50', border:'border-green-300', shadow: '#86efac'}, 
    {status:'failed', textColor:'text-red-500', bg:'bg-red-500', lightBg:'bg-red-50', border:'border-red-300', shadow: '#fca5a5'},
  ]

  const findStyle = (statusType, status, styler)=> {
    if(statusType === 'order' || statusType === 'product'){
      return orderStatusStyles.find(orderStatus=> orderStatus.status === status)[styler]
    }
    if(statusType === 'payment'){
      return paymentStatusStyles.find(paymentStatus=> paymentStatus.status === status)[styler]
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    setQueryDetails((query) => {
      return {...query, page}
    })
  }

  const limitHandler = (value)=> {
    setQueryDetails(query=> {
      return {...query, limit: value}
    })
    setLimit(value)
  }

  const radioClickHandler = (e)=>{
    const value = Number.parseInt(e.target.value)
    console.log("value---->", value)
    const checkStatus = queryDetails.sort === value
    console.log("checkStatus-->", checkStatus)
    if(checkStatus){
        console.log("returning..")
        return
    }else{
        console.log("Checking radio..")
        setQueryDetails(query=> {
          return {...query, sort: value}
        })
        const changeEvent = new Event('change', {bubbles:true})
        e.target.dispatchEvent(changeEvent)
    }
  }

  const radioChangeHandler = (e, value)=>{
    e.target.checked = (queryDetails.sort === Number.parseInt(value))
  }

  const orderDurationHandler = (e)=> {
    const value = e.target.textContent.trim()
    const monthNumber = value.match(/\d+/).toString()
    setQueryDetails(query=> {
      return {...query, month: Number.parseInt(monthNumber)}
    })
  }

  const activateTab = (name)=> {
    setActiveTab(name)
    setQueryDetails(query=> {
      return {...query, orderStatus: name.toLowerCase().trim()}
    })
  }

  const changeStatus = (status)=> {
    switch(status.toLowerCase()){
      case 'processing':
        return {status:'confirm', icon:SquareCheckBig}
      case 'confirmed':
        return {status:'ship', icon:Truck}
      case 'shipped':
        return {status:'delivered', icon:PackageCheck}
      case 'returning':
        return {status:'refund', icon:TbCreditCardRefund}
      default:
        return {status: null, icon: null}
    }
  }

  const preCancelTheOrder = (e, orderId)=> {
    console.log("Opening the modal for cancelOrder...")
    setOpenCancelForm({type:'order', status:true, options: {orderId}})
    window.scrollTo( {top: orderCancelFormRef.current.getBoundingClientRect().top, scrollBehavior: 'smooth'} )
  }

  const cancelThisOrder = ()=> {
    if(cancelThisOrderId){
      let orderCancelReason = '';
      if(openSelectReasons.reasonTitle.trim()){
        orderCancelReason = openSelectReasons.reasonTitle.trim() + '.'
      }
      if(openSelectReasons.reason.trim()){
        orderCancelReason = orderCancelReason + openSelectReasons.reason.trim()
      }
      console.log("orderCancelReason----->", orderCancelReason)
      setOpenSelectReasons(({status:false, reasonTitle:'', reason:''}))
      dispatch( cancelOrder({orderId: cancelThisOrderId, orderCancelReason}) )
      setCancelThisOrderId(null)
    }
  }

  const cancelReasonHandler = (e, options)=> {
    if(options.admin){
      setOpenSelectReasons(selectReason=> (
        {...selectReason, reasonTitle: "Cancelled By Admin:"}
      ))
    }
    if(options.content){
      setOpenSelectReasons(selectReason=> (
        {...selectReason, reason: e.target.value}
      ))
    }
  }

  const submitReason = (formFor)=> {
    if(formFor === 'product'){
      console.log("Cancelling the Product..")
      let productCancelReason = '';
      if(openSelectReasons.reasonTitle.trim()){
        productCancelReason = openSelectReasons.reasonTitle.trim() + '.'
      }
      if(openSelectReasons.reason.trim()){
        productCancelReason = productCancelReason + openSelectReasons.reason.trim()
      }
      setOpenSelectReasons(({status:false, reasonTitle:'', reason:''}))
      dispatch(cancelOrderProduct({orderId: openCancelForm.options.orderId, productId: openCancelForm.options.productId, productCancelReason}))
      setOpenCancelForm({type:'', status:false, options:{}})
    }
    if(formFor === 'order'){
      console.log("Cancelling the Order..")
      setOpenOrderCancelModal(true)
      setCancelThisOrderId(openCancelForm.options.orderId)
      setOpenCancelForm({type:'', status:false, options:{}})
    }
  }

  const changeTheOrderStatus = (orderId, newStatus)=> {
    console.log("Inside changeTheOrderStatus..")
    console.log("newStatus---->", newStatus)
    dispatch(changeOrderStatus({orderId, newStatus}))
  }

  const changeTheProductStatus = (orderId, productId, newProductStatus)=> {
    console.log("Inside changeTheProductStatus..")
    console.log(`productId--->${productId} and orderId---> ${orderId} and newStatus---> ${newProductStatus}`)
    dispatch(changeProductStatus({orderId, productId, newProductStatus}))
  }

  const cancelTheOrderProduct = (productId, orderId)=> {
    console.log("Inside cancelTheOrderProduct..")
    console.log(`productId--->${productId} and orderId---> ${orderId}`)
    setOpenCancelForm({type:'product', status:true, options: {productId, orderId}})
    window.scrollTo( {top: productCancelFormRef.current.getBoundingClientRect().top, scrollBehavior: 'smooth'} )
  }

  return (
    <section id='AdminOrderHistoryPage'>
      <header className='mb-[2.5rem] flex justify-between items-center'>
          <div className='basis-[40%]'>

            <AdminTitleSection heading='Orders' subHeading="Detailed records of every users' orders, enabling you to track and manage order statuses and
               history seamlessly."/>

          </div>
          
            <SitePrimaryButtonWithShadow tailwindClasses='h-[30px] self-end'>
              <i>
                  <Download className='h-[15px] w-[15px]'/>
              </i>
              <span> Export </span>
              <i>
                  <RiArrowDropDownLine/>
              </i>
            </SitePrimaryButtonWithShadow>
            
      </header>
      <main>

        <div className="bg-gray-50 min-h-screen">
          {/* Metrics Grid */}
          <div className="mb-[3rem] grid grid-cols-4 gap-6">
            { metrics &&
            metrics.map((metric, index) => (
              <div key={index} className="bg-white p-[10px] flex items-start gap-[10px] border border-primary rounded-xl">
                  <div className='p-3 bg-primaryDark rounded-lg'>
                    {metric.icon}
                  </div>
                  <div className="flex flex-col items-baseline">
                    <h3 className="text-sm text-gray-500 mb-1">{metric.title}</h3>
                    <span className="text-[15px] font-semibold text-gray-900">{metric.value}</span>
                  </div>
                  
              </div>
            ))}
          </div>
          <div id='order-menu' className='mb-[2rem] flex justify-between items-center'>

            <DateSelector dateGetter={{startDate, endDate}} dateSetter={{setStartDate, setEndDate}} labelNeeded={true}/>


            <div className='flex items-center gap-[1rem]'>
               <div className='h-[35px] text-[14px] text-muted bg-white flex items-center gap-[10px]
                 justify-between border border-dropdownBorder rounded-[8px] shadow-sm cursor-pointer hover:bg-gray-50 transition-colors
                  optionDropdown sort-dropdown' onClick={(e)=> toggleDropdown('limitDropdown')}
                    id='limit-dropdown' ref={dropdownRefs.limitDropdown}>
                   <span className='relative flex items-center border-r border-dropdownBorder py-[8px] pl-[10px] pr-[2px]'> 
                     {limit} 
                     <i> <RiArrowDropDownLine/> </i>
                     {limit && openDropdowns.limitDropdown &&
                       <ul className='absolute top-[44px] left-[3px] right-0 py-[10px] w-[101%] rounded-b-[4px] flex flex-col items-center
                          gap-[10px] text-[13px] bg-white border border-dropdownBorder rounded-[6px] cursor-pointer'>
                           <li onClick={()=> limitHandler(10)}> 10 </li>
                           <li onClick={()=> limitHandler(20)}> 20 </li>
                           <li onClick={()=> limitHandler(30)}> 30 </li>
                           <li className='pb-[5px]' onClick={()=> limitHandler(18)}> 40 </li>
                       </ul>
                   }
                   </span>
                   <span className='flex items-center py-[8px] pr-[16px]'>
                     <span className='font-[470]'> Orders </span> 
                   </span>
               </div>
               <div className='relative h-[35px] px-[16px] py-[8px] text-[14px] text-muted bg-white flex items-center gap-[10px]
                 justify-between border border-dropdownBorder rounded-[8px] shadow-sm cursor-pointer hover:bg-gray-50 transition-colors
                    optionDropdown sort-dropdown' onClick={(e)=> toggleDropdown('sortDropdown')} id='sort-options' 
                       ref={dropdownRefs.sortDropdown}>
                 <span className='text-[13px] font-[470]'> Sort By </span>
                 <MdSort lassName='h-[15px] w-[15px] text-[#EF4444]'/>
                 {openDropdowns.sortDropdown && 
                 <ul className='list-none  px-[10px] py-[1rem] absolute top-[44px] left-0 flex flex-col gap-[10px] justify-center 
                         w-[12rem] text-[10px] bg-white border border-borderLight2 rounded-[8px] z-[5] cursor-pointer' 
                             onMouseLeave={()=> mouseInSort.current = false} onMouseEnter={()=>  mouseInSort.current = true}>
                     <li> 
                         <span>  
                             <input type='radio' value='-1' onClick={(e)=> radioClickHandler(e)}
                                 onChange={(e)=> radioChangeHandler(e, -1)} checked={queryDetails.sort === -1} />
                             <span> Orders: Recent to Oldest </span>
                         </span>
                     </li>
                     <li> 
                         <span>  
                             <input type='radio' value='1' onClick={(e)=> radioClickHandler(e)}
                                 onChange={(e)=> radioChangeHandler(e, 1)} checked={queryDetails.sort === 1} />
                             <span> Orders: Oldest to Recent  </span>
                         </span>
                     </li>
                 </ul>
                 }
               </div>
               <div className="relative h-[35px] px-[16px] py-[8px] text-[13px] text-muted font-500 bg-white flex items-center gap-[10px]
                 justify-between border border-dropdownBorder rounded-[8px] shadow-sm cursor-pointer hover:bg-gray-50 transition-colors
                    optionDropdown" id='duration-options'
                   onClick={()=> toggleDropdown('durationDropdown')} ref={dropdownRefs.durationDropdown}>
                 <span className='font-[470]'> {orderDuration} </span>
                 <CalendarArrowDown className='h-[15px] w-[15px]'/>      {/*text-[#EF4444]*/}
                 {openDropdowns.durationDropdown &&
                 <div className='options'>
                   {
                    ["Past 1 Month", "Past 3 Months", "Past 6 Months", "Past 12 Months", "All Orders"].map(option=> (
                      <span onClick={(e)=> orderDurationHandler(e)}> {option} </span>
                    ))
                   }
                 </div>
                 }
               </div>
             </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg" id='order-list-table'>
            <div className="p-6 border border-dropdownBorder">
              <div className="flex items-center justify-between">
                <div className="p-[5px] flex gap-2 bg-gray-100 rounded-[9px]">
                  {tabs.slice(0,5).map((tab) => (
                    <button key={tab} className={`px-4 py-2 rounded-lg text-sm capitalize ${activeTab === tab ? 'bg-white text-secondary'
                        : 'text-gray-500 hover:bg-gray-50'}`} style={activeTab === tab? {boxShadow:'2px 2px 8px 1px rgba(0,0,0,0.09)'} : {}}
                          onClick={()=> activateTab(tab)}>
                      {tab}
                    </button>
                  ))}
                  <button className="relative px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-lg">
                    <Plus className="w-4 h-4" onClick={()=> toggleDropdown('showTab')} ref={dropdownRefs.showTab}/>
                      {openDropdowns.showTab &&
                        <div className='absolute bottom-[44px] px-4 py-[3px] flex gap-[10px] bg-gray-100 text-left rounded-[9px]'>
                        {
                          tabs.slice(5).map((tab)=> (
                            <button key={tab} className={`px-4 py-2 rounded-lg text-sm capitalize ${activeTab === tab ? 'bg-white text-secondary'
                                : 'text-gray-500 hover:bg-gray-50'}`} style={activeTab === tab? {boxShadow:'2px 2px 8px 1px rgba(0,0,0,0.09)'} : {}}
                                  onClick={()=> activateTab(tab)}>
                              {tab}
                            </button>
                          ))
                        }
                    </div>
                      }
                  </button>
                </div>
                <div className="flex gap-3">
                  <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
                    <Search className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
                    <Filter className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
                
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {
                      ["Customer Name", "City", "Date", "Products", "Status", "Tax(GST)", "Total", "Payment Status"].map(tableHeader=> (
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 capitalize"> {tableHeader} </th>
                      ))
                    }
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 capitalize"> Action </th>
                  </tr>
                </thead>
                <tbody>
                  {orders && orders.map((order) => (
                    <React.Fragment  key={order._id}>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={order.userId.profilePic} alt={order.userId.username} className="w-8 h-8 rounded-full"/>
                          <span className="text-sm font-medium text-gray-900">
                            {order.userId.username}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.shippingAddress.district}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{ format(new Date(order.orderDate), "MMMM dd, yyyy" ) }</td>
                      <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-[15px]">
                        <span> {order.products.length} </span>
                        <button className="relative overflow-hidden rounded-[8px] p-[2px]"
                              onMouseEnter={()=> setIsHovered({orderId: order._id})}  onMouseLeave={()=> setIsHovered({})}
                                onClick={()=> setShowProducts(showProducts=> showProducts.orderId ? {} : {orderId: order._id})}>
                          <div className="relative flex items-center gap-[2px] rounded-2xl  transition-all duration-300">
                            <ShoppingBag  className={`h-[15px] w-[15px] text-muted transition-all duration-300 
                              ${(isHovered.orderId === order._id) ?'rotate-[-5deg] scale-110' : '' }`}/>
                            <ChevronDown className={`h-[10px] w-[10px] text-secondary self-end transition-all duration-300
                               ${(isHovered.orderId === order._id) ? 'translate-y-[5px]' : ''}`}/>
                          </div>
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        {
                          <span className='px-[5px] py-[3px] w-[10%] flex gap-[10px] items-center'>
                             <span className={`w-[3px] h-[3px] p-[3px] ${findStyle("order", order.orderStatus, 'bg')} rounded-[5px]`} 
                                 style={{boxShadow: `0px 0px 5px 2px  ${findStyle("order", order.orderStatus, 'shadow')}`}}>
                             </span>
                             <span className={`capitalize ${ findStyle("order", order.orderStatus, 'textColor') } text-[13px] font-[500]`}>
                               {order.orderStatus}
                             </span>
                          </span>
                        } 
                      </td>
                      <td className={`px-6 py-4 text-sm font-medium
                           ${order.orderStatus === 'cancelled' ? 'text-muted' : 'text-gray-900'}`}>
                        {order.gst}
                      </td>
                      <td className={`px-6 py-4 text-sm font-medium
                           ${order.orderStatus === 'cancelled' ? 'text-muted' : 'text-gray-900'}`}>
                       {order.absoluteTotalWithTaxes}
                      </td>
                      <td className={`px-6 py-4 text-sm text-gray-500 capitalize 
                          ${order.orderStatus !== 'cancelled'? findStyle("payment", order.paymentDetails.paymentStatus, 'textColor') : ''} `}>
                        {order.orderStatus === 'cancelled'? '---' : order.paymentDetails.paymentStatus}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-2">
                          {
                             ['delivered', 'cancelled', 'refunded'].every(status=> status !== order.orderStatus) &&
                             <button className='relative py-[4px] px-4 text-secondary bg-white border border-secondary rounded-[6px]
                                 hover:bg-secondary hover:text-white transition duration-300 cancel-button' data-label='Order'
                                    onClick={(e)=> preCancelTheOrder(e, order._id)}>
                               <CircleOff className="w-4 h-4" />
                             </button>
                          }
                          { 
                            ['delivered', 'cancelled', 'refunded'].every(status=> status !== order.orderStatus) &&
                            <SiteSecondaryFillImpButton className="text-[11px] capitalize" 
                                clickHandler={(e)=> changeTheOrderStatus(order._id, changeStatus(order.orderStatus).status)}
                                  customStyle={{width:'auto', marginTop:'0', paddingBlock:'4px', borderRadius:'6px'}}>
                            {
                              (()=> {
                                const {status, icon:Icon} = changeStatus(order.orderStatus)
                                return(
                                  <span className='flex items-center gap-[7px]'>
                                      <span> {status} </span>
                                      {Icon && <Icon className="w-4 h-4"/>} 
                                  </span>
                                )
                              })()
                            }
                            </SiteSecondaryFillImpButton>
                          }

                          { openOrderCancelModal &&
                          <Modal openModal={openOrderCancelModal} setOpenModal={setOpenOrderCancelModal} title='Important' 
                              content={`You are about to cancel an order. Do you want to continue?`} okButtonText='Continue'
                                closeButtonText='Cancel' contentCapitalize={false} clickTest={true} activateProcess={cancelThisOrder}/>
                          } 
                        </div>
                      </td>
                    </tr>
                    <tr>

                    <td colSpan='9' className='pl-[4rem]'>
                    {showProducts.orderId === order._id  && order.products.map((product, index) => ( 
                        <div key={product._id} className={`p-[1.5rem] ${index != order.products.length -1 ? 'border-b': ''} border-gray-100`}
                           id='item-details'>
                          <div className="flex items-center gap-[2rem]">
                            <figure className="w-[60px] h-[60px] bg-gray-50 rounded-xl overflow-hidden">
                              <img src={product.thumbnail} alt={product.title} className={`w-full h-full object-cover transform
                                   hover:scale-105 transition-transform duration-200
                                     ${product.productStatus === 'cancelled' || product.productStatus === 'returning' ? 'filter grayscale' : ''} `}/>
                            </figure>
                            <div className="flex-1">
                              <h4 className="mb-[8px] flex items-center gap-[4rem]">
                                <span className='text-gray-800 text-[14px] font-[600] hover:text-secondary transition-colors cursor-pointer'>
                                   {product.title}
                               </span>
                                { 
                                  <span className='px-[5px] py-[3px] w-[10%] flex gap-[10px] items-center'>
                                     <span className={`w-[4px] h-[4px] ${ findStyle('product', product.productStatus, 'bg') } rounded-[5px]`} 
                                         style={{boxShadow: `0px 0px 6px 3px  ${findStyle('product', product.productStatus, 'shadow')}`}}>
                                     </span>
                                     <span className={`capitalize ${ findStyle('product', product.productStatus, 'textColor') } text-[11px] font-[500]`}>
                                       {product.productStatus}
                                     </span>
                                  </span>
                                } 
                              </h4>
                              <p className="mb-[8px] text-[11px] text-gray-600">{product.subtitle}</p>
                              {product.deliveryNote && (
                                <p className="mt-[8px] text-[13px] leading-[20px] text-gray-500 flex items-center gap-[4px]">
                                  <Package className="w-[1rem] h-[1rem]" />
                                  {'Delivery Note:' + product.deliveryNote}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-[20px]">
                          {
                             ['processing', 'confirmed', 'shipped',].includes(product.productStatus) &&
                             <button className='relative py-[4px] px-4 text-secondary bg-white border border-secondary rounded-[6px]
                                 hover:bg-secondary hover:text-white transition duration-300  before:bg-white cancel-button'
                                     data-label='Product' data-bottom='50'
                                        onClick={(e)=> cancelTheOrderProduct(product.productId, order._id)} >  
                               <CircleOff className="w-4 h-4" />
                             </button>
                          }
                          { 
                            !['cancelled', 'refunded'].includes(product.productStatus) &&
                            <SiteSecondaryFillImpButton className="text-[11px] capitalize" 
                                clickHandler={(e)=> changeTheProductStatus(order._id, product.productId, changeStatus(product.productStatus).status)}
                                  customStyle={{width:'auto',marginTop:'0', paddingBlock:'4px', borderRadius:'6px'}}> 
                            {
                              (()=> {
                                const {status, icon:Icon} = changeStatus(product.productStatus)
                                return(
                                  <span className='flex items-center gap-[10px]'>
                                      <span className='capitalize'> 
                                        {status + '  Product' } 
                                      </span>
                                      {Icon && <Icon className="w-4 h-4"/>} 
                                  </span>
                                )
                              })()
                            }
                            </SiteSecondaryFillImpButton>
                          }
                        </div>

                            </div>
                          </div>
                          
                          <div ref={productCancelFormRef} className='flex justify-center items-center'>
                          {openCancelForm.type === 'product' && openCancelForm.options.productId === product.productId &&
                              openCancelForm.options.orderId === order._id && openCancelForm.status &&
                            <CancelForm openSelectReasons={openSelectReasons} setOpenSelectReasons={setOpenSelectReasons} 
                              cancelReasonHandler={cancelReasonHandler} setOpenCancelForm={setOpenCancelForm} submitReason={submitReason}
                                 formFor='product' canceledByAdmin={true}/>
                          }
                          </div>
                          
                        </div>
                      ))} 
                    </td>

                    </tr>
                    <tr ref={orderCancelFormRef}>
                      <td colSpan='9'>
                        {
                          openCancelForm.type === 'order' && openCancelForm.options.orderId === order._id && openCancelForm.status &&
                          <CancelForm openSelectReasons={openSelectReasons} setOpenSelectReasons={setOpenSelectReasons} 
                            cancelReasonHandler={cancelReasonHandler} setOpenCancelForm={setOpenCancelForm} submitReason={submitReason}
                              formFor='order' canceledByAdmin={true}/>
                        }
                      </td>
                    </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </main>

      <div className='mb-[7rem]'>

        <PaginationV2 currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      </div>

    </section>

  )
}


