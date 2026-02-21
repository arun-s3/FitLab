import React, {useState, useEffect, useRef} from 'react'
import {useOutletContext} from 'react-router-dom'
import './AdminOrderHistoryPage.css'
import {useDispatch, useSelector} from 'react-redux'

import {ShoppingBag, Package, RefreshCcw, CircleOff, Download, Search, MoreHorizontal, TriangleAlert,
   Filter, Plus, CalendarArrowDown, SquareCheckBig, Truck, PackageCheck, ChevronDown, TextSearch } from 'lucide-react'
import {RiArrowDropDownLine} from "react-icons/ri"
import {TbCreditCardRefund} from "react-icons/tb"
import {MdSort} from "react-icons/md"
import {format} from "date-fns"

import {toast as sonnerToast} from 'sonner'

import apiClient from '../../../Api/apiClient'

import AdminTitleSection from '../../../Components/AdminTitleSection/AdminTitleSection'
import {DateSelector} from '../../../Components/Calender/Calender'
import Modal from '../../../Components/Modal/Modal'
import CancelForm from '../../../Components/CancelForm/CancelForm'
import ReturnRequestModal from './ReturnRequestModal'
import {SitePrimaryButtonWithShadow, SiteSecondaryFillImpButton} from '../../../Components/SiteButtons/SiteButtons' 
import PaginationV2 from '../../../Components/PaginationV2/PaginationV2'
import {getAllUsersOrders, cancelOrder, cancelOrderProduct, changeOrderStatus,
          changeProductStatus, processRefund, resetOrderStates} from '../../../Slices/orderSlice'


export default function AdminOrderHistoryPage(){

  const [statusCounts, setStatusCounts] = useState({})
    
  const [activeTab, setActiveTab] = useState('All')
  const [orderDuration, setOrderDuration] = useState('All Orders')

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(20)  
  const [limit, setLimit] = useState(8) 

  const [metricError, setMetricError] = useState(false)

  const [queryDetails, setQueryDetails] = useState({'page': 1, 'limit': 8, 'sort': -1, 'orderStatus': 'orders'})

  const mouseInSort = useRef(true)

  const [openGenericModal, setOpenGenericModal] = useState(false)
  const [cancelThisOrderId, setCancelThisOrderId] = useState(null)
  const [openCancelForm, setOpenCancelForm] = useState({type:'', status:false, options:{}})
  const [openSelectReasons, setOpenSelectReasons] = useState({status:false, reasonTitle:'', reason:''})
  const productCancelFormRef = useRef(null)
  const orderCancelFormRef = useRef(null)

  const [isHovered, setIsHovered] = useState({})
  const [showProducts, setShowProducts] = useState({})

  const [refundDetails, setRefundDetails] = useState({orderId: null, productId: null, refundType: null})

  const [showReturnRequestModal, setshowReturnRequestModal] = useState({status: false, order: null, product: null, returnOrderOrProduct: null})

  const {orders, totalUsersOrders, handledOrderDecision, refundSuccess, orderError} = useSelector(state=> state.order)
  const dispatch = useDispatch()

  const {setHeaderZIndex, setPageBgUrl} = useOutletContext() 
  setPageBgUrl(`linear-gradient(to right,rgba(255,255,255,0.93),rgba(255,255,255,0.93)), url('/Images/admin-ProductsListBg.jpg')`)

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

    async function findStatus(){
      try{
          const response = await apiClient.get(`/order/statusCounts`)
          if(response?.data.statusCounts) {
              setStatusCounts(response.data.statusCounts) 
          }
      }catch (error) {
          setMetricError(true)
      }
    }

    useEffect(()=> {
      findStatus()
    },[])

    useEffect(()=> {
      if(orders && totalUsersOrders && totalPages && limit){
        setTotalPages(Math.ceil(totalUsersOrders/limit))
      }
    }, [orders, totalUsersOrders])

    useEffect(()=> {
        setQueryDetails(query=> {
          return {...query, startDate, endDate}
        })
    },[startDate, endDate])

    useEffect(()=> {
        if(Object.keys(queryDetails).length > 0){
          dispatch( getAllUsersOrders({queryDetails}) )
        }
    },[queryDetails])

    useEffect(()=> {
      if(handledOrderDecision){
          sonnerToast.success("Updated the status of return request to the user successfully!")
          dispatch(resetOrderStates())
      }
      if(refundSuccess){ 
        sonnerToast.success("The user is successfully refunded!")
        dispatch(resetOrderStates())
      }
    }, [handledOrderDecision, refundSuccess])

    useEffect(()=> {
      if(orderError){
          sonnerToast.error(orderError)
          dispatch(resetOrderStates())
      }
    }, [orderError])

    useEffect(()=> {
        if(setHeaderZIndex && showReturnRequestModal && showReturnRequestModal.status){
            setHeaderZIndex(0)
        }else{
            setHeaderZIndex(10)
        }
    }, [showReturnRequestModal.status])


  const metrics = [
    {
      title: 'Total orders',
      value: statusCounts?.totalOrders ? statusCounts.totalOrders : 0,
      icon: <ShoppingBag className="w-6 h-6 text-white" />,
    },
    {
      title: 'Delivered Orders',
      value: statusCounts?.deliveredOrders ? statusCounts?.deliveredOrders : 0,
      icon: <Package className="w-6 h-6 text-white" />,
    },
    {
      title: 'Returned Orders',
      value: statusCounts?.returningOrders ? statusCounts?.returningOrders : 0,
      icon: <RefreshCcw className="w-6 h-6 text-white" />,
    },
    {
      title: 'Cancelled Orders',
      value: statusCounts?.cancelledOrders ? statusCounts.cancelledOrders : 0,
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

  const variantSymbol = {weight: 'Kg', motorPower: 'Hp', color: '', size: ''}

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
    const checkStatus = queryDetails.sort === value
    if(checkStatus) return
    else{
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

  const changeStatus = (status, returnStatus = null)=> {
    switch(status.toLowerCase()){
      case 'processing':
        return {status:'confirm', icon:SquareCheckBig}
      case 'confirmed':
        return {status:'ship', icon:Truck}
      case 'shipped':
        return {status:'delivered', icon:PackageCheck}
      case 'returning': 
        return {  
          status: !returnStatus ? 'Review return request' : returnStatus === 'accepted' ? 'refund' : null, 
          icon: !returnStatus ? TextSearch : returnStatus === 'accepted' ? TbCreditCardRefund : null
        }
      default:
        return {status: null, icon: null}
    }
  }

  const preCancelTheOrder = (e, orderId)=> {
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
      setOpenSelectReasons(({status:false, reasonTitle:'', reason:''}))
      dispatch( cancelOrder({orderId: cancelThisOrderId, orderCancelReason}) )
      setCancelThisOrderId(null)
      setOpenGenericModal(false)
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
      let productCancelReason = '';
      if(openSelectReasons.reasonTitle.trim()){
        productCancelReason = openSelectReasons.reasonTitle.trim() + '.'
      }
      if(openSelectReasons.reason.trim()){
        productCancelReason = productCancelReason + openSelectReasons.reason.trim()
      }
      setOpenSelectReasons(({status:false, reasonTitle:'', reason:''}))
      dispatch(cancelOrderProduct({orderId: openCancelForm.options.orderId, productId: openCancelForm.options.productId._id, productCancelReason}))
      setOpenCancelForm({type:'', status:false, options:{}})
    }
    if(formFor === 'order'){
      setOpenGenericModal(true)
      setCancelThisOrderId(openCancelForm.options.orderId)
      setOpenCancelForm({type:'', status:false, options:{}})
    }
  }

  const changeTheOrderStatus = (orderId, order = null, newStatus)=> {
    if(newStatus === 'Review return request'){
      setshowReturnRequestModal({status: true, order, product: null, returnOrderOrProduct: 'order'})
    }
    else dispatch(changeOrderStatus({orderId, newStatus}))
  }

  const changeTheProductStatus = (orderId, productId, newProductStatus)=> {
    dispatch(changeProductStatus({orderId, productId, newProductStatus}))
  }

  const cancelTheOrderProduct = (productId, orderId)=> {
    setOpenCancelForm({type:'product', status:true, options: {productId, orderId}})
    window.scrollTo( {top: productCancelFormRef.current.getBoundingClientRect().top, scrollBehavior: 'smooth'} )
  }

  const initiateRefundProcess = ()=> {
    const refundInfos = {orderId: refundDetails.orderId, productId: refundDetails.productId, refundType: refundDetails.refundType}
    dispatch(processRefund({refundInfos}))
    setRefundDetails({orderId: null, productId: null, refundType: null})
  }


  return (
    <section id='AdminOrderHistoryPage'>
      <header className='mb-[2.5rem] flex justify-between items-center'>
          <div className='basis-[40%]'>

            <AdminTitleSection heading='Orders' subHeading="Detailed records of every users' orders, enabling you to track and manage order statuses and
               history seamlessly."/>

          </div>
            
      </header>
      <main>

        <div className="bg-gray-50 min-h-screen">
          {/* Metrics Grid */}
          <div className="mb-[3rem] grid grid-cols-4 gap-6">
            { metrics && !metricError &&
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
            { metricError &&
                <div className='w-full h-full col-span-4'>
                    <div className='flex justify-center items-center gap-[5px] w-full h-full'>
                        <TriangleAlert className='mb-[18px] text-primary w-[32px] h-[32px]' />
                        <p className='flex flex-col'>
                            <span className='flex items-center gap-[7px] text-[17px] text-[#686262] font-medium'>
                                Unable to load
                                <RotateCcw
                                    className="w-[20px] h-[20px] text-muted p-1 rounded-full border border-dropdownBorder cursor-pointer 
                                        hover:text-black transition-all duration-150 ease-in"
                                    onClick={() => findStatus()}
                                />
                            </span>
                            <span className='text-[13px] text-muted'>Check connection</span>
                        </p>
                    </div>
                </div>
            }
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

          <div className={`${orders && orders.length && 'bg-white rounded-xl shadow-lg' }`} id='order-list-table'>
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
                
            {
              orders && orders.length > 0 ?
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
                          <td className="px-6 py-4 text-sm text-gray-500">{order?.shippingAddress ? order.shippingAddress.district : ''}</td>
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
                          <td className="px-6 py-4 ">
                            {
                              <span className='px-[5px] py-[3px] w-[10%] flex gap-[10px] items-center relative'>
                                 <span className={`w-[3px] h-[3px] p-[3px] ${findStyle("order", order.orderStatus, 'bg')} rounded-[5px]`} 
                                     style={{boxShadow: `0px 0px 5px 2px  ${findStyle("order", order.orderStatus, 'shadow')}`}}>
                                 </span> 
                                 <span className={`capitalize ${ findStyle("order", order.orderStatus, 'textColor') } text-[13px] 
                                   font-[500] !whitespace-nowrap`}>
                                   {
                                      order.orderStatus !== 'returning' 
                                        ? order.orderStatus 
                                        : !order?.orderReturnStatus
                                        ? 'Return request'
                                        : order.orderReturnStatus === 'accepted'
                                        ? 'Accepted request'
                                        : 'Rejected request'
                                   }
                                 </span>
                                    {
                                      (order.orderReturnStatus === 'accepted' || order.orderReturnStatus === 'rejected') &&
                                        <p className='absolute mt-[5px] top-[17px] left-[21px] text-[11px] text-muted whitespace-nowrap'>
                                           {`Return request has been reviewed ${order.orderReturnStatus === 'rejected' ? 'and rejected' : ''}`}
                                        </p>
                                    }
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
                          <td className="px-6 py-4 relative">
                            <div className="flex justify-center items-center gap-2">
                              {
                                 ['delivered', 'cancelled', 'returning', 'refunded'].every(status=> status !== order.orderStatus) &&
                                 <button className='relative py-[4px] px-4 text-secondary bg-white border border-secondary rounded-[6px]
                                     hover:bg-secondary hover:text-white transition duration-300 cancel-button' data-label='Order'
                                        onClick={(e)=> preCancelTheOrder(e, order._id)}>
                                   <CircleOff className="w-4 h-4" />
                                 </button>
                              }
                              { 
                                ['delivered', 'cancelled', 'refunded'].every(status=> status !== order.orderStatus) &&
                                <SiteSecondaryFillImpButton className="!py-[6px] text-[11px] capitalize" 
                                    clickHandler={
                                      (e)=> {
                                        const requiredStatus = changeStatus(order.orderStatus, order.orderReturnStatus).status
                                        if(requiredStatus !== 'refund'){
                                          changeTheOrderStatus(order._id, order, changeStatus(order.orderStatus, order.orderReturnStatus).status)
                                        }else{
                                          setRefundDetails({orderId: order._id, productId: null, refundType: 'order'})
                                          setOpenGenericModal(true)
                                        }
                                      }
                                    }
                                    customStyle={{width:'auto', marginTop:'0', paddingBlock:'4px', borderRadius:'6px'}}>
                                {
                                  (()=> {
                                    const {status, icon:Icon} = changeStatus(order.orderStatus, order.orderReturnStatus)
                                    return(
                                      <span className='flex items-center gap-[7px]'>
                                          <span className='whitespace-nowrap'> {status} </span>
                                          {Icon && <Icon className="w-4 h-4"/>} 
                                      </span>
                                    )
                                  })()
                                }
                                </SiteSecondaryFillImpButton>
                              }

                              { openGenericModal &&
                              <Modal openModal={openGenericModal} setOpenModal={setOpenGenericModal} title='Important' 
                                  content={`You are about to ${cancelThisOrderId ? ' cancel an order' : 'refund this user'}. Do you want to continue?`} 
                                  okButtonText='Continue'  closeButtonText='Cancel' contentCapitalize={false}
                                  instruction="If you are sure, write 'start' and press 'Continue', else click 'Close' button"
                                  typeTest={true} typeValue='start'
                                  activateProcess={cancelThisOrderId ? cancelThisOrder : initiateRefundProcess}/>
                              } 
                            </div>
                            {
                              order.orderStatus === 'returning' && !order.orderReturnStatus &&
                              <p className='block absolute text-[11px] text-red-500 hover:underline transition-all duration-300 cursor-pointer'
                                  onClick={()=> setshowReturnRequestModal({status: true, order, product: null, returnOrderOrProduct: 'order'})}>
                                View customer grievances with evidences and more for refund. 
                              </p>
                            }
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
                                       <span> {product.title} </span>
                                       <span className='ml-[3px] capitalize text-[#a09fa8]'> 
                                          {
                                              product.productId?.variantType 
                                              ? ' - ' + ' ' + product.productId[`${product.productId.variantType}`] 
                                                + ' ' + variantSymbol[`${product.productId.variantType}`]
                                              : ''
                                          }
                                        </span>
                                   </span>
                                    { 
                                      <span className='px-[5px] py-[3px] w-[10%] flex gap-[10px] items-center relative'>
                                         <span className={`w-[4px] h-[4px] ${ findStyle('product', product.productStatus, 'bg') } rounded-[5px]`} 
                                             style={{boxShadow: `0px 0px 6px 3px  ${findStyle('product', product.productStatus, 'shadow')}`}}>
                                         </span>
                                         <span className={`capitalize ${ findStyle('product', product.productStatus, 'textColor') } 
                                           text-[11px] font-[500] !whitespace-nowrap`}>
                                           {
                                              product.productStatus === 'returning' 
                                                ? 'Return request received'
                                                : product.productStatus !== 'returning' 
                                                ? product.productStatus
                                                : !product?.productReturnStatus
                                                ? 'Return request'
                                                : product.productReturnStatus === 'accepted'
                                                ? 'Accepted request'
                                                : 'Rejected request'
                                           }
                                         </span>
                                          {
                                            product.productReturnStatus === 'accepted' || product.productReturnStatus === 'rejected' &&
                                              <p className='absolute text-[11px] text-muted whitespace-nowrap'>
                                                 {`Return request has been reviewed 
                                                    ${product.productReturnStatus === 'rejected' ? 'and rejected' : ''}`}
                                              </p>
                                          }
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
                                !['delivered', 'cancelled', 'refunded'].includes(product.productStatus) &&
                                <SiteSecondaryFillImpButton className="!py-[6px] text-[11px] capitalize" 
                                    clickHandler={
                                      (e)=> {
                                        const requiredStatus = changeStatus(product.productStatus, product.productReturnStatus).status
                                        if(requiredStatus !== 'refund'){
                                          changeTheProductStatus(order._id, product.productId._id, requiredStatus)
                                        }else{
                                          setRefundDetails({orderId: order._id, productId: product.productId._id, refundType: 'product'})
                                          setOpenGenericModal(true)
                                        }
                                      }
                                    }
                                      customStyle={{width:'auto',marginTop:'0', paddingBlock:'4px', borderRadius:'6px'}}> 
                                {
                                  (()=> {
                                    const {status, icon:Icon} = changeStatus(product.productStatus, product.productReturnStatus)
                                    return(
                                      <span className='flex items-center gap-[10px]'>
                                          <span className='capitalize whitespace-nowrap'> 
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
              :
              <h3 className='w-full h-full flex justify-center items-center mt-[6rem] 
                text-[13px] xs-sm2:text-[16px] xs-sm:text-[17px] text-muted capitalize tracking-[0.5px]'>
                 No Order Records ! 
              </h3>
            }

          </div>
        </div>

      </main>

      <div className='mb-[7rem]'>

        {
          orders && totalPages &&
            <PaginationV2 currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        }

      </div>

      {
      showReturnRequestModal.status &&
        <ReturnRequestModal
          returnRequestOrder={showReturnRequestModal.order}
          returnRequestProduct={showReturnRequestModal.product}
          returnOrderOrProduct={showReturnRequestModal.returnOrderOrProduct}
          isOpen={()=> showReturnRequestModal.status}
          onClose={() => setshowReturnRequestModal({status: false, order: null, product: null, returnOrderOrProduct: null})} 
          onDecision={(orderId, didAccept) => {
            setshowReturnRequestModal({status: false, order: null, product: null, returnOrderOrProduct: null})
          }}
        />
      }

    </section>

  )
}


