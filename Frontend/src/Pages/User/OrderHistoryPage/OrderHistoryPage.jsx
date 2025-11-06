import React, {useEffect, useState, useRef} from 'react'
import './OrderHistoryPage.css'
import {useNavigate, Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {motion} from 'framer-motion'

import {ShoppingBag, ShoppingCart, Truck, PackagePlus, PackageX , CalendarArrowDown, Star, MoreHorizontal, X, CheckCircle,
           MessageSquare, RefreshCcw, Package, ChevronDown, FileText, CircleX, CircleOff  }  from 'lucide-react'
import {RiArrowDropDownLine} from "react-icons/ri"
import {BiCartAdd} from "react-icons/bi"
import {MdSort} from "react-icons/md"
import {toast as sonnerToast} from 'sonner'
import {format} from "date-fns"
import axios from 'axios'


import Header from '../../../Components/Header/Header'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import FeaturesDisplay from '../../../Components/FeaturesDisplay/FeaturesDisplay'
import PaginationV2 from '../../../Components/PaginationV2/PaginationV2'
import Footer from '../../../Components/Footer/Footer'
import CartSidebar from '../../../Components/CartSidebar/CartSidebar'
import Modal from '../../../Components/Modal/Modal'
import RefundModal from './RefundModal'
import TextChatBox from '../TextChatBox/TextChatBox'
import CancelForm from '../../../Components/CancelForm/CancelForm'
import {handleImageCompression} from '../../../Utils/compressImages'
import {CustomPuffLoader} from '../../../Components/Loader//Loader'
import {DateSelector} from '../../../Components/Calender/Calender'
import {addToCart, resetCartStates} from '../../../Slices/cartSlice'
import {getOrders, cancelOrder, cancelOrderProduct, deleteProductFromOrderHistory, changeProductStatus, initiateReturn, cancelReturnRequest,
    resetOrderStates} from '../../../Slices/orderSlice'
import {SiteButtonSquare, SiteSecondaryFillImpButton} from '../../../Components/SiteButtons/SiteButtons'


export default function OrderHistoryPage(){

    const [activeTab, setActiveTab] = useState('Orders')
    const [showRating, setShowRating] = useState(true)
    const [showChat, setShowChat] = useState(false)

    const [orderDuration, setOrderDuration] = useState('All Orders')

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(20)  
    const [limit, setLimit] = useState(5) 

    const mouseInSort = useRef(true)
    
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)

    const [queryDetails, setQueryDetails] = useState({'page': 1, 'limit': 5, 'sort': -1, 'orderStatus': 'orders'})

    const [isCartOpen, setIsCartOpen] = useState(false)
    
    const [quantity, setQuantity] = useState(1)
    const [currentProductId, setCurrentProductId] = useState(null)
    const [showLoader, setShowLoader] = useState(false)

    const [openCancelConfirmModal, setOpenCancelConfirmModal] = useState(false)
    const [cancelThisOrderId, setCancelThisOrderId] = useState(null)

    const [cancelReturnReq, setCancelReturnReq] = useState({orderId: null, productId: null, cancelType: null})

    const [openCancelForm, setOpenCancelForm] = useState({type:'', status:false, return:false, options:{}})
    const [openSelectReasons, setOpenSelectReasons] = useState({status:false, reasonTitle:'', reason:''})
    const productCancelFormRef = useRef(null)
    const orderCancelFormRef = useRef(null)

    const returnWindowTime = 30 * 24 * 60 * 60 * 1000

    const [openRefundModal, setOpenRefundModal] = useState({status: false, orderOrProduct: null})

    const {orders, totalOrders, orderCreated, orderReturnRequested, canceledReturnRequest, loading, 
        orderMessage, orderError} = useSelector(state=> state.order)

    const {cart, productAdded, productRemoved, error, message} = useSelector(state=> state.cart)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  const [openDropdowns, setOpenDropdowns] = useState({durationDropdown: false, limitDropdown: false, sortDropdown: false})
  const dropdownRefs = {
    durationDropdown: useRef(null),
    limitDropdown: useRef(null),
    sortDropdown: useRef(null)
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
    if(orders && totalOrders && totalPages && limit){
      console.log(`totalPages------>${totalPages}, limit------>${limit}`)
      setTotalPages(Math.ceil(totalOrders/limit))
    }
  }, [orders, totalOrders])
  

  useEffect(()=> {
    setQueryDetails(query=> {
      return {...query, startDate, endDate}
    })
  },[startDate, endDate])

  useEffect(()=> {
    if(Object.keys(queryDetails).length > 0){
      console.log("queryDetails---->", JSON.stringify(queryDetails))
      dispatch( getOrders({queryDetails}) )
    }
  },[queryDetails])

  useEffect(()=> {
    console.log("Fetched all the orders------>", orders)
  },[orders])

  useEffect(()=> {
      if(productAdded){
        console.log("Product added to cart successfully!")
        // setPackedupCart(cart)
        setIsCartOpen(true)
        dispatch(resetCartStates())
      }
      if(!loading){
        setTimeout(()=> setShowLoader(false), 1000)
      }else setShowLoader(true)
      if(error){
        sonnerToast.error(error)
        dispatch(resetCartStates())
      }
      if(orderError){
        sonnerToast.error(orderError)
        dispatch(resetCartStates())
      }
      dispatch(resetCartStates())
    },[loading, error, orderError, productAdded])

    useEffect(()=> {
      if(canceledReturnRequest){ 
        sonnerToast.success("The return request has been declined, and the return process has been permanently closed!")
        dispatch(resetOrderStates())
      }
    }, [canceledReturnRequest])
    
    const orderTabs = [
      {name: 'Orders', subtitle:'All Orders', icon: ShoppingBag},
      {name: 'Shipped', subtitle:'On Delivery', icon: Truck},
      {name: 'Delivered', subtitle:'Order Completed', icon: PackagePlus},
      {name: 'Cancelled', subtitle:'Cancelled orders', icon: PackageX}
    ]

    const orderStatusStyles = [
      {status:'processing', textColor:'text-orange-500', bg:'bg-orange-500', lightBg:'bg-orange-50', border:'border-orange-300', shadow: '#fdba74'},
      {status:'confirmed', textColor:'text-yellow-500', bg:'bg-yellow-500', lightBg:'bg-yellow-50', border:'border-yellow-300', shadow: '#fde047'},
      {status:'shipped', textColor: 'text-blue-500', bg: 'bg-blue-500', lightBg: 'bg-blue-50', border: 'border-blue-300', shadow: '#93c5fd'},
      {status:'delivered', textColor:'text-green-500', bg:'bg-green-500', lightBg:'bg-green-50', border:'border-green-300', shadow: '#86efac'}, 
      {status:'cancelled', textColor:'text-red-700', bg:'bg-red-700', lightBg:'bg-red-50', border:'border-red-300', shadow: '#fca5a5'},
      {status:'returning', textColor:'text-red-500', bg:'bg-red-500', lightBg:'bg-red-50', border:'border-red-300', shadow: '#fca5a5'},
      {status:'refunded', textColor:'text-green-500', bg:'bg-green-500', lightBg:'bg-green-50', border:'border-green-300', shadow: '#86efac'},
    ]

    const variantSymbol = {weight: 'Kg', motorPower: 'Hp', color: '', size: ''}

    const findStyle = (status, styler)=> {
      return orderStatusStyles.find(orderStatus=> orderStatus.status === status)[styler]
    }

    const headerBg = {
        backgroundImage: "url('/header-bg.png')",
        backgrounSize: 'cover'
    }

    const handlePageChange = (page) => {
      setCurrentPage(page)
      setQueryDetails((query) => {
        return {...query, page}
      })
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
    
    const handleAddToCart = (productId)=> {
        console.log("Inside handleAddToCart()--")
        dispatch( addToCart({productId, quantity}) )
        console.log("Dispatched successfully")
    }

    const viewProduct = async(id)=> {
      navigate(`/shop/product?id=${id}`)
    }

    const cancelOrReturnProduct = (e, productId, orderId, orderDate)=> {
      console.log(`orderId---> ${orderId}, productId---> ${JSON.stringify(productId)}`)
      if(e.target.textContent.toLowerCase().includes('cancel')){
        console.log("Opening the CancelForm..")
        setOpenCancelForm({type:'product', status:true, options: {productId: productId, orderId}, return: false},)
        // window.scrollTo( {top: productCancelFormRef.current.getBoundingClientRect().top, scrollBehavior: 'smooth'} )
        sonnerToast.warning("You are about to cancel the product!")
      }else{
        console.log("Opening the ReturnForm..")
        const isReturnEligible = Date.now() <= new Date(orderDate).getTime() + returnWindowTime
        if(!isReturnEligible){
          sonnerToast.error("Sorry! Return requests are accepted within 30 days of purchase!", {duration: 4500})
        }
        setOpenCancelForm({type:'product', status:true, options: {productId, orderId}, return: true})
        // window.scrollTo( {top: productCancelFormRef.current.getBoundingClientRect().top, scrollBehavior: 'smooth'} )
        sonnerToast.warning("You are about to return the product!")
      }
    }

    const preCancelTheOrder = (e, orderId)=> {
      console.log("Opening the modal for cancelOrder...")
      setOpenCancelForm({type:'order', status:true, options: {orderId}})
      // window.scrollTo( {top: orderCancelFormRef.current.getBoundingClientRect().top, scrollBehavior: 'smooth'} )
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

    const clearProduct = (orderId, productId)=> {
      console.log("Clearing the product...")
      dispatch(deleteProductFromOrderHistory({orderId, productId}))
    }

    const cancelReasonHandler = (e, options)=> {
      if(options.title){
        setOpenSelectReasons(selectReason=> (
          {...selectReason, reasonTitle: e.target.textContent}
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
        if(!openCancelForm.return){
          setOpenSelectReasons(({status:false, reasonTitle:'', reason:''}))
          dispatch(cancelOrderProduct({orderId: openCancelForm.options.orderId, productId: openCancelForm.options.productId._id, productCancelReason}))
          setOpenCancelForm({type:'', status:false, options:{}})
        }else{
          console.log('openSelectReasons inside submitReason()--->', openSelectReasons)
          setOpenRefundModal({status: true, orderOrProduct: 'product'})
        }
      }
      if(formFor === 'order'){
        console.log("Cancelling the Order..")
        setOpenCancelConfirmModal(true)
        setCancelThisOrderId(openCancelForm.options.orderId)
        setOpenCancelForm({type:'', status:false, options:{}})
      }
    }

    const compressedImageBlobs = async(images)=>{
      return await Promise.all( images.map( async(image)=> {
          if(image.size > (5*1024*1024)){
              const newBlob = await handleImageCompression(image.blob)
              sonnerToast.info("Some images have been compressed as its size exceeded 5 MB!")
              return newBlob
          }else{
              return image.blob
          }
      }) )
    }

    const initiateReturnProduct = async (images = [])=> {
      console.log('openSelectReasons--->', openSelectReasons)
      console.log('images--->', images)
      console.log(`orderId---> ${openCancelForm.options.orderId}, productId---> ${openCancelForm.options.productId}, 
          returnType---> ${openRefundModal.orderOrProduct}`)
      console.log("Inside initiateReturnProduct()..")

      const formData = new FormData()
      formData.append('orderId', openCancelForm.options.orderId)
      formData.append('returnType', openRefundModal.orderOrProduct)
      formData.append('returnReason', openSelectReasons.reason)

      if (openCancelForm.options.productId) formData.append('productId', openCancelForm.options.productId._id)

      const compressedImages = await compressedImageBlobs(images)
            
      compressedImages.forEach((blob, index) => {
          formData.append('images', blob, `returnImg${index}`)
      })

      dispatch(
        initiateReturn({
          orderId: openCancelForm.options.orderId, 
          productId: openCancelForm?.options?.productId ? openCancelForm.options.productId._id : null, 
          returnType: openRefundModal.orderOrProduct,
          returnReason: openSelectReasons.reason,
          formData
        })
      )
      setOpenCancelForm({type:'', status:false, options:{}})
      setOpenSelectReasons(({status:false, reasonTitle:'', reason:''}))
    }

    const initiateCancelReturnReq = (orderId, productId, cancelType)=> {
      setCancelReturnReq({orderId, productId, cancelType })
      setOpenCancelConfirmModal(true)
    }

    const confirmCancelReturn = ()=> {
      if(cancelReturnReq.cancelType){
        const returnDetails = {orderId: cancelReturnReq.orderId, productId: cancelReturnReq.productId, returnType: cancelReturnReq.cancelType}
        console.log('returnDetails------------>', returnDetails)
        dispatch(cancelReturnRequest({returnDetails}))
      }
    }


    return(
        <section id='OrderHistoryPage'>
            <header style={headerBg} className='h-[5rem]'>
                
                <Header />
                
            </header>
                
            <BreadcrumbBar heading='Order History'/>
            
            <main className='mt-[3rem]'>

            <div className="min-h-screen p-[1rem] bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="max-w-[90rem] mx-auto">

                <div className="mb-[2rem] flex items-center justify-between" id='orderHistory-header'>
                  <h1 className="text-[25px] font-bold flex items-center gap-2 text-gray-800">
                    Your Orders
                    <span className="px-[12px] py-[4px] text-[13px] text-white font-[500] bg-gradient-to-r
                     from-[#BE72F2] to-secondary rounded-full shadow-sm">
                      6
                    </span>
                  </h1>

                  <DateSelector dateGetter={{startDate, endDate}} dateSetter={{setStartDate, setEndDate}} labelNeeded={true}/>
                  
                </div>

                <div className="mb-[2rem] flex justify-between items-center" id='order-menu'>
                  <div className="px-[8px] py-[6px] flex gap-4 bg-white rounded-[9px] border border-primary shadow-sm">
                    {orderTabs.map((tab)=> (
                      <button key={tab.name} className={`px-[1.5rem] py-[8px] flex items-center gap-[5px] rounded-[7px] transition-all
                           duration-200 
                          ${activeTab === tab.name ? 
                            'text-black shadow-md transform scale-105'
                            : 'text-gray-600 hover:bg-gray-50' }`} onClick={()=> activateTab(tab.name)}>
                        <tab.icon className='w-[35px] h-[35px] p-[8px] text-white bg-primaryDark rounded-[5px]'/>
                        <div className='flex flex-col justify-between items-start'>
                          <span className='text-[15px]'> {tab.name} </span>
                          <span className='text-[10px] text-muted'> {tab.subtitle} </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className='flex justify-between items-center gap-[3rem]'>

                      <div className='h-[2.5rem] text-[14px] text-muted bg-white flex items-center gap-[10px]
                      justify-between border border-dropdownBorder rounded-[8px] shadow-sm cursor-pointer hover:bg-gray-50 transition-colors
                         optionDropdownsort-dropdown' onClick={(e)=> toggleDropdown('limitDropdown')}
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

                  <div className='relative h-[2.5rem] px-[16px] py-[8px] text-[14px] text-muted bg-white flex items-center gap-[10px]
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

                  <div className="relative h-[2.5rem] px-[16px] py-[8px] text-[13px] text-muted font-500 bg-white flex items-center gap-[10px]
                      justify-between border border-dropdownBorder rounded-[8px] shadow-sm cursor-pointer hover:bg-gray-50 transition-colors
                         optionDropdown" id='duration-options'
                        onClick={()=> toggleDropdown('durationDropdown')} ref={dropdownRefs.durationDropdown}>
                      <span className='font-[470]'> {orderDuration} </span>
                      <CalendarArrowDown className='h-[15px] w-[15px]'/>      {/*text-[#EF4444]*/}
                      {openDropdowns.durationDropdown &&
                      <div className='options'>
                        <span onClick={(e)=> orderDurationHandler(e)}>Past 1 Month</span>
                        <span onClick={(e)=> orderDurationHandler(e)}>Past 3 Month</span>
                        <span onClick={(e)=> orderDurationHandler(e)}>Past 6 Months</span>
                        <span onClick={(e)=> orderDurationHandler(e)}>Past 12 Month</span>
                        <span onClick={(e)=> orderDurationHandler(e)}>All Orders</span>
                    </div>
                    }
                  </div>
                </div>
              </div>
                  
                {
                  orders && Object.keys(orders).length > 0  
                    ?
                    <div className="space-y-6" id='orders-table'>
                      {  orders.map((order)=> 
                            ( order?.products.length > 0 && 
                              !order?.products.every(product=> product.isDeleted) &&
                            <div key={order._id} className="pb-[1rem] bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow
                               duration-200">
                              <div className={`p-[1.5rem] grid grid-cols-4 gap-4 border-b border-dashed
                                 ${order.orderStatus === 'cancelled' || order.orderStatus === 'returning'? 'border-red-300':'border-mutedDashedSeperation'}`}>
                                <div className="space-y-1">
                                  <h3 className="label">Order placed</h3> 
                                  <span className="name">{format( new Date(order.orderDate), "MMMM dd, yyyy" )}</span>
                                </div>
                                <div className="space-y-1">
                                  <h3 className="label">Total</h3>      
                                  <span className="name text-secondary">&#8377; {order.absoluteTotalWithTaxes}</span>
                                </div>
                                {
                                  order.shippingAddress && order.shippingAddress.firstName &&
                                    <div className="space-y-1">
                                      <h3 className="label">Ship to</h3>       
                                      <span className="name capitalize">{order.shippingAddress.firstName + ' ' + order.shippingAddress.lastName}</span>
                                    </div>
                                }
                                {
                                  order.paymentDetails?.transactionId &&
                                    <div className="text-right space-y-1">            
                                      <h3 className="label">Order # {order.paymentDetails.transactionId}</h3>
                                      <div className="space-x-4 order-details">
                                        <Link to="#" className="hover:text-primaryDark transition-colors">                  
                                          <FileText/>
                                          View order details
                                        </Link>
                                        <Link to="#" className="hover:text-primaryDark transition-colors">                      
                                          <FileText/>
                                          View invoice
                                        </Link>
                                      </div>
                                    </div>
                                }
                              </div>
                              
                              {showRating && order.orderStatus === 'delivered' && (
                                <div className="mx-[1.5rem] mt-[1.5rem]">
                                  <div className="p-[11px] text-[13px] font-[500] flex justify-between items-center
                                     bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100 rounded-xl">
                                    <div className="flex items-center gap-[8px]">
                                      <Star className="w-[20px] h-[20px] text-yellow-400 fill-current" />
                                      <span className="font-[13px] cursor-pointer hover:text-secondary transition-colors duration-300">
                                        Please rate your experience using this product
                                      </span>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600 transition-colors"
                                       onClick={()=> setShowRating(false)}>
                                      <X className="w-[20px] h-[20px]" />
                                    </button>
                                  </div>
                                </div>
                              )}

                              
                              {
                                order.orderStatus === 'returning' && order?.orderReturnStatus && order.orderReturnStatus === 'accepted'
                                    ? (
                                      <div className="mx-[1.5rem] mt-[1.5rem]">
                                        <div className="p-[11px] text-[13px] font-[500] flex justify-between items-center
                                           bg-gradient-to-r from-green-50 to-green-100 border border-primary rounded-xl">
                                          <div className="flex items-center gap-[8px]">
                                            <CheckCircle className="w-[20px] h-[20px] text-green-400" />
                                            <span className="font-[13px]">
                                                Your return request has been thoroughly reviewed and approved. 
                                                Your refund will be processed within 24 hours.
                                            </span>   
                                          </div>
                                          <p className="text-xs md:text-sm text-gray-600" onClick={()=> setShowChat(true)}>
                                            Questions?{" "}
                                            <span className="text-emerald-600 font-semibold cursor-pointer hover:underline">
                                              Contact our support team
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                    )
                                    : order.orderStatus === 'delivered' && order?.orderReturnStatus && order.orderReturnStatus === 'rejected'
                                    ? (
                                      <div className="mx-[1.5rem] mt-[1.5rem] bg-gradient-to-r from-red-50 to-red-100 border border-red-500 rounded-xl">
                                        <div className="p-[11px] pb-0 text-[13px] font-[500] flex justify-between items-center
                                           ">
                                          <div className="flex items-center gap-[8px]">
                                            <X className="w-[20px] h-[20px] text-red-700" strokeWidth={3} />
                                            <span className="font-[13px]">
                                              Your return request has been thoroughly reviewed by our team. 
                                              Unfortunately, we're unable to process this return at this time.
                                            </span>
                                          </div>
                                          <p className="text-xs md:text-sm text-gray-600" onClick={()=> setShowChat(true)}>
                                            Questions?{" "}
                                            <span className="text-emerald-600 font-semibold cursor-pointer hover:underline">
                                              Contact our support team
                                            </span>
                                          </p>
                                        </div>
                                        <div className='-mt-[5px] ml-8 px-[11px] pb-[11px]'>
                                          <span className='text-[13px] font-medium'> Probable Reasons: </span>
                                          <ul className='list-disc ml-4 text-muted text-[11px]'>
                                            <li>Product shows signs of significant wear and damage</li>
                                            <li>Item appears to have been used professionally</li>
                                          </ul>
                                        </div>
                                      </div>
                                      )
                                    : null
                              }

                              <div className="p-[1.5rem] pb-0 flex items-center justify-between">
                                    <div className='flex items-center gap-[3rem] basis-[40%]'>
                            
                                      { order.orderStatus !== 'cancelled' && order.orderStatus !== 'returning' && order.orderStatus !== 'refunded' &&
                                        <h3 className="text-[16px] font-[450] text-secondary">
                                        <span>
                                          {
                                            order.orderStatus === 'delivered' ? 'Delivered:' :
                                              order.orderStatus === 'confirmed' ? 'Estimated Delivery Date:' : null
                                          }
                                        </span>
                                        {/* <span className='ml-[5px] font-[550] tracking-[0.5px]'>
                                          { 
                                            order.orderStatus === 'delivered' ? 
                                              format(new Date(order.deliveryDate), "MMMM dd, yyyy" ) 
                                            : order.orderStatus === 'confirmed' 
                                            ? format(new Date(order.estimtatedDeliveryDate), "MMMM dd, yyyy" ) 
                                            : null
                                          } 
                                        </span> */}
                                      </h3>
                                      }
                                      <h3 className={`px-[5px] py-[3px] ${order.orderStatus === 'returning' ? 'w-[35%]' : 'w-[23%]'} 
                                        flex gap-[15px] justify-center items-center
                                        ${ findStyle(order.orderStatus, 'lightBg') } border ${ findStyle(order.orderStatus, 'border') } rounded-[5px]`}>
                                         <span className={`w-[8px] h-[8px] ${ findStyle(order.orderStatus, 'bg') } rounded-[5px]`} 
                                             style={{boxShadow: `0px 0px 6px 3px ${findStyle(order.orderStatus, 'shadow')}`}}>
                                         </span>
                                         <span className={`capitalize ${ findStyle(order.orderStatus, 'textColor') } text-[14px]`}>
                                            {order.orderStatus === 'returning' ? 'Appied for return' : order.orderStatus}
                                         </span>
                                      </h3>
                                    </div>
                                <div className='flex flex-col'>
                                  {order.orderStatus !== 'cancelled' && order.orderStatus !== 'returning' && order.orderStatus !== 'refunded' &&
                                    order.orderStatus !== 'delivered' && !order.orderReturnStatus &&
                                      <SiteButtonSquare lowerFont={true} lighter={true} lowShadow={true} clickHandler={(e)=> preCancelTheOrder(e, order._id)}
                                           customStyle={{paddingBlock:'7px', paddingInline:'18px', borderRadius:'7px'}}>
                                         Cancel Order
                                      </SiteButtonSquare>
                                  } 
                                  {
                                    order.orderStatus != 'cancelled' &&  order.orderStatus != 'returning' && order.orderStatus != 'refunded'
                                        && order.orderStatus === 'delivered' && !order.orderReturnStatus &&
                                        <SiteSecondaryFillImpButton
                                          className={`px-[18px] py-[7px] !w-auto !text-[13px] rounded-[7px]`} 
                                          clickHandler={(e)=> {
                                            setOpenRefundModal({status: true, orderOrProduct: 'order'})
                                            setOpenCancelForm({type:'order', status:false, options: {orderId: order._id}, return: true})
                                          }}
                                        >
                                            Return Order
                                        </SiteSecondaryFillImpButton>
                                  }
                                  {
                                    order.orderStatus === 'returning' &&
                                        <SiteSecondaryFillImpButton
                                          className={`px-[18px] py-[7px] !w-auto !text-[13px] rounded-[7px]`} 
                                          clickHandler={(e)=> {
                                            initiateCancelReturnReq(order._id, null, 'order')
                                          }}
                                        >
                                            Cancel Return Request
                                        </SiteSecondaryFillImpButton>
                                  }
                                </div>

                                { openCancelConfirmModal &&
                                  <Modal openModal={openCancelConfirmModal} setOpenModal={setOpenCancelConfirmModal} title='Important' 
                                      content={`You are about to cancel an ${cancelThisOrderId ? 'order' : 'return request'}.
                                         Do you want to continue?`} 
                                      okButtonText='Continue' closeButtonText='Cancel' contentCapitalize={false} 
                                      instruction="If you are sure, write 'cancel' and press 'Continue', else click 'Close' button"
                                      typeTest={true} typeValue='cancel'
                                      clickTest={true} activateProcess={cancelThisOrderId ? cancelThisOrder : confirmCancelReturn}/>
                                }     
{/* 
                                { openReturnCancelModal.status &&
                                  <Modal openModal={openReturnCancelModal.status} setOpenModal={setOpenCancelConfirmModal} title='Important' 
                                      content={`You are about to cancel an order. Do you want to continue?`} okButtonText='Continue'
                                        closeButtonText='Cancel' contentCapitalize={false} clickTest={true} activateProcess={cancelThisOrder}/>
                                }  */}

                              </div>
{/* 
                              {
                                order.orderStatus === 'returning' && order?.orderReturnStatus && order.orderReturnStatus === 'accepted'
                                    ? <ReturnAcceptedMsg />
                                    : order.orderStatus === 'returning' && order?.orderReturnStatus && order.orderReturnStatus === 'rejected'
                                    ? <ReturnRejectedMsg />
                                    : null
                              } */}
                              
                              {order.products.map((product, index) => ( !product.isDeleted &&
                                <div key={product._id} className={`p-[1.5rem] ${index != order.products.length -1 ? 'border-b': ''}
                                     border-gray-100`}
                                   id='item-details'>
                                  <div className="flex gap-[2rem]">
                                    <figure className="w-[120px] h-[120px] bg-gray-50 rounded-xl overflow-hidden">
                                      <img src={product.thumbnail} alt={product.title} className={`w-full h-full object-cover transform
                                           hover:scale-105 transition-transform duration-200
                                             ${product.productStatus === 'cancelled' || product.productStatus === 'returning' ? 'filter grayscale' : ''} `}/>
                                    </figure>
                                    <div className="flex-1">
                                      <h4 className="mb-[8px] flex items-center gap-[4rem]">
                                        <span className='text-gray-800 font-bold hover:text-secondary transition-colors cursor-pointer'>
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
                                          order.products.some(item=> product.productStatus !== item.productStatus) &&  
                                          <span className='px-[5px] py-[3px] w-[10%] flex gap-[10px] items-center'>
                                             <span className={`w-[7px] h-[7px] ${ findStyle(product.productStatus, 'bg') } rounded-[5px]`} 
                                                 style={{boxShadow: `0px 0px 6px 3px  ${findStyle(product.productStatus, 'shadow')}`}}>
                                             </span>
                                             <span className={`capitalize ${ findStyle(product.productStatus, 'textColor') } text-[13px] font-[500]`}>
                                               {product.productStatus}
                                             </span>
                                          </span>
                                        } 
                                      </h4>
                                      <p className="mb-[8px] text-[13px] text-gray-600">{product.subtitle}</p>
                                      {
                                      !product.productReturnStatus &&
                                        <p className="w-fit text-[13px] text-gray-500 tracking-[0.3px] flex items-center gap-[4px]
                                            hover:text-secondary transition-colors duration-300 cursor-default"
                                        >
                                        { product.productStatus === 'cancelled'||product.productStatus === 'returning' ?
                                             <CircleOff className="w-[1rem] h-[1rem]"/> : <RefreshCcw className="w-[1rem] h-[1rem]" /> 
                                        }
                                        { !product.productReturnStatus && product.productStatus === 'cancelled' 
                                            ? 'This product is cancelled' 
                                            : product.productStatus === 'returning' 
                                            ? 'Applied for return request'
                                            : Date.now() <= new Date(order.deliveryDate).getTime() + returnWindowTime 
                                            ? 'Return item: Eligible through ' + 
                                                  format( new Date(order.deliveryDate).getTime() + returnWindowTime, "MMMM dd, yyyy" )
                                            : 'Return date expired'
                                        }
                                        { !['cancelled', 'returning', 'refunded'].includes(product.productStatus) &&
                                            Date.now() > new Date(order.deliveryDate).getTime() + returnWindowTime &&
                                              <span className='ml-[10px]'> (Eligible within 30 days of delivery only). </span>
                                        }
                                      </p>
                                      }
                                      {product.deliveryNote && (
                                        <p className="mt-[8px] text-[13px] leading-[20px] text-gray-500 flex items-center gap-[4px]">
                                          <Package className="w-[1rem] h-[1rem]" />
                                          {product.deliveryNote}
                                        </p>
                                      )}
                                      <div className="flex gap-[12px] mt-[1.5rem] item-buttons">
                                        <button className="px-[16px] py-[4px] text-[14px] text-white bg-gradient-to-r from-[#B863F2]
                                           to-secondary flex items-center gap-[8px] rounded-[7px] hover:shadow-md transition-all duration-300 
                                                transform hover:!bg-purple-800 hover:translate-y-px"
                                                 onClick={()=> {handleAddToCart(product.productId); setCurrentProductId(product.productId)}}>
                                          {
                                            product.productStatus === 'cancelled'||product.productStatus === 'returning' ?
                                                <> <ShoppingCart className="w-[1rem] h-[1rem]" /> Buy </>
                                              : <> <BiCartAdd className="w-[1rem] h-[1rem]" /> Buy it again </>
                                          }
                                        </button>
                                        <motion.button 
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.96 }}
                                          className="hover:!bg-primary hover:!text-secondary hover:!border-yellow-300 
                                            !transition !duration-300"
                                            onClick={()=> viewProduct(product.productId._id)}
                                        > 
                                           {product.productStatus === 'cancelled'||product.productStatus === 'returning' ? 'View this item' : 'View your item'}
                                        </motion.button>
                                          {
                                           !['cancelled', 'returning', 'refunded'].includes(product.productStatus) 
                                              && !product.productReturnStatus &&
                                            <motion.button 
                                              whileHover={{ scale: 1.02 }}
                                              whileTap={{ scale: 0.96 }}
                                              className="hover:!bg-primary hover:!text-secondary transition duration-300"
                                                  onClick={(e)=> cancelOrReturnProduct(e, product.productId, order._id, order.orderDate)}> 
                                              {
                                                product.productStatus === 'delivered' 
                                                   ? 'Return Product' 
                                                   : 'Cancel Product'
                                              }
                                            </motion.button>
                                          }
                                          { (product.productStatus === 'cancelled' || product.productStatus === 'refunded') && 
                                            <motion.button 
                                              className="hover:!bg-primary hover:!text-secondary transition duration-300"
                                              whileHover={{ scale: 1.02 }}
                                              whileTap={{ scale: 0.96 }}
                                                  onClick={(e)=> clearProduct(order._id, product.productId)}> 
                                              Clear this item
                                            </motion.button>
                                          }
                                          { (product.productStatus === 'returning') && 
                                            <motion.button 
                                              className="hover:!bg-primary hover:!text-secondary transition duration-300"
                                              whileHover={{ scale: 1.02 }}
                                              whileTap={{ scale: 0.96 }}
                                              onClick={(e)=> initiateCancelReturnReq(order._id, product.productId._id, 'product')}> 
                                              Cancel return request
                                            </motion.button>
                                          }

                                        <button className="border !border-primary hover:border-gray-300 transition-all duration-200">      
                                          <MoreHorizontal className="w-[20px] h-[20px] text-primaryDark" />
                                        </button>

                                        { showLoader && currentProductId === product.productId &&    
                                           <CustomPuffLoader loading={showLoader} 
                                               customStyle={{marginLeft: '5px', alignSelf: 'center'}}/>
                                        }

                                      </div>

                                        {
                                          product.productStatus === 'returning' && product?.productReturnStatus && 
                                            product.productReturnStatus === 'accepted' && !order.orderReturnStatus 
                                              ? (
                                                <div className="mx-[1.5rem] mt-[1.5rem]">
                                                  <div className="p-[11px] text-[13px] font-[500] flex justify-between items-center
                                                     bg-gradient-to-r from-green-50 to-green-100 border border-primary rounded-xl">
                                                    <div className="flex items-center gap-[8px]">
                                                      <CheckCircle className="w-[20px] h-[20px] text-green-400" />
                                                      <span className="font-[13px]">
                                                          Your return request for the product has been thoroughly reviewed and approved. 
                                                          Your refund will be processed within 24 hours.
                                                      </span>   
                                                    </div>
                                                    <p className="text-xs md:text-sm text-gray-600" onClick={()=> setShowChat(true)}>
                                                      Questions?{" "}
                                                      <span className="text-emerald-600 font-semibold cursor-pointer hover:underline">
                                                        Contact our support team
                                                      </span>
                                                    </p>
                                                  </div>
                                                </div>
                                              )
                                              : order.orderStatus === 'delivered' && order?.orderReturnStatus &&
                                                 order.orderReturnStatus === 'rejected' && !order.orderReturnStatus 
                                              ? (
                                                <div className="mx-[1.5rem] mt-[1.5rem] bg-gradient-to-r from-red-50 to-red-100 border border-red-500 rounded-xl">
                                                  <div className="p-[11px] pb-0 text-[13px] font-[500] flex justify-between items-center
                                                     ">
                                                    <div className="flex items-center gap-[8px]">
                                                      <X className="w-[20px] h-[20px] text-red-700" strokeWidth={3} />
                                                      <span className="font-[13px]">
                                                        Your return request for the product has been thoroughly reviewed by our team. 
                                                        Unfortunately, we're unable to process this return at this time.
                                                      </span>
                                                    </div>
                                                    <p className="text-xs md:text-sm text-gray-600" onClick={()=> setShowChat(true)}>
                                                      Questions?{" "}
                                                      <span className="text-emerald-600 font-semibold cursor-pointer hover:underline">
                                                        Contact our support team
                                                      </span>
                                                    </p>
                                                  </div>
                                                  <div className='-mt-[5px] ml-8 px-[11px] pb-[11px]'>
                                                    <span className='text-[13px] font-medium'> Probable Reasons: </span>
                                                    <ul className='list-disc ml-4 text-muted text-[11px]'>
                                                      <li>Product shows signs of significant wear and damage</li>
                                                      <li>Item appears to have been used professionally</li>
                                                    </ul>
                                                  </div>
                                                </div>
                                                )
                                              : null
                                          }           

                                    </div>
                                  </div>

                                  <div>
                                      {/* {
                                        order?.orderReturnStatus && order.orderReturnStatus === 'accepted'
                                            ? <ReturnAcceptedMsg />
                                            : <ReturnRejectedMsg />
                                      } */}
                                  </div>
                                      
                                  <div className='flex justify-center items-center'>
                                  { 
                                    openCancelForm.type === 'product' && openCancelForm.options.productId === product.productId &&
                                      openCancelForm.options.orderId === order._id && openCancelForm.status &&

                                    <CancelForm openSelectReasons={openSelectReasons} setOpenSelectReasons={setOpenSelectReasons} 
                                      cancelReasonHandler={cancelReasonHandler} setOpenCancelForm={setOpenCancelForm} 
                                        submitReason={(formFor)=> submitReason(formFor)}
                                         formFor='product' returnAndRefund={openCancelForm.return}/>
                                  }
                                  </div>

                                </div>
                              ))}
                                <div ref={orderCancelFormRef}>
                                  {
                                    openCancelForm.type === 'order' && openCancelForm.options.orderId === order._id && openCancelForm.status &&

                                    <CancelForm openSelectReasons={openSelectReasons} setOpenSelectReasons={setOpenSelectReasons} 
                                      cancelReasonHandler={cancelReasonHandler} setOpenCancelForm={setOpenCancelForm} submitReason={submitReason}
                                        formFor='order'/>
                                  }
                                </div>

                                  {
                                    openRefundModal.status &&
                                      <RefundModal isOpen={openRefundModal.status} onClose={()=> setOpenRefundModal(info=> ({...info, status: false}))} 
                                          returnOrderOrProduct={initiateReturnProduct} orderOrProduct={openRefundModal.orderOrProduct}
                                            onReasonWritten={setOpenSelectReasons} reasonWritten={openSelectReasons}/>
                                  }

                            </div>
                          ))}
                      </div>
                    :
                      <h3 className='w-full h-full flex justify-center items-center mt-[12rem] 
                        text-[13px] xs-sm2:text-[16px] xs-sm:text-[17px] text-muted capitalize tracking-[0.5px]'>
                         You Haven't Ordered Anything Yet! 
                      </h3>
                }
                
                <div className="fixed bottom-[2rem] right-[2rem] z-50">

                  <TextChatBox openChats={showChat}/>
                  
                </div>
              </div>
            </div>

            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />


            </main>
            
            <div className='mb-[7rem]'>

              {
                orders && totalPages &&
                  <PaginationV2 currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              }

            </div>

            <FeaturesDisplay />
                        
            <Footer />

        </section>
            
    )
}



