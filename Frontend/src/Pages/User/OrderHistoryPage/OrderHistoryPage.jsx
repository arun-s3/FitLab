import React, {useEffect, useState, useRef} from 'react'
import './OrderHistoryPage.css'
import {useDispatch, useSelector} from 'react-redux'
import {motion, AnimatePresence} from 'framer-motion'

import {Star, X}  from 'lucide-react'
import {toast as sonnerToast} from 'sonner'
import {format} from "date-fns"
import axios from 'axios'

import Header from '../../../Components/Header/Header'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import FeaturesDisplay from '../../../Components/FeaturesDisplay/FeaturesDisplay'
import PaginationV2 from '../../../Components/PaginationV2/PaginationV2'
import Footer from '../../../Components/Footer/Footer'
import CartSidebar from '../../../Components/CartSidebar/CartSidebar'
import OrderTools from './OrderTools'
import OrderHeader from './OrderHeader'
import OrderProuctsHub from './OrderProuctsHub'
import Modal from '../../../Components/Modal/Modal'
import RefundModal from './RefundModal'
import OrderDetailsModal from './OrderDetailsModal'
import TextChatBox from '../TextChatBox/TextChatBox'
import CancelForm from '../../../Components/CancelForm/CancelForm'
import ReviewForm from '../../../Components/ReviewForm/ReviewForm'
import FitLabExperienceRating from './FitLabExperienceRating'
import TestimonySuccess from './TestimonySuccess'
import RefundMessage from './RefundMessage'
import {handleImageCompression} from '../../../Utils/compressImages'
import {CustomPuffLoader} from '../../../Components/Loader//Loader'
import {DateSelector} from '../../../Components/Calender/Calender'
import {addToCart, resetCartStates} from '../../../Slices/cartSlice'
import {getOrders, cancelOrder, cancelOrderProduct, deleteProductFromOrderHistory, initiateReturn, cancelReturnRequest,
    resetOrderStates} from '../../../Slices/orderSlice'
import {SiteButtonSquare, SiteSecondaryFillImpButton} from '../../../Components/SiteButtons/SiteButtons'


export default function OrderHistoryPage(){

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(20)  
    const [limit, setLimit] = useState(5) 
    
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)

    const [queryDetails, setQueryDetails] = useState({'page': 1, 'limit': 5, 'sort': -1, 'orderStatus': 'orders'})

    const [isCartOpen, setIsCartOpen] = useState(false)

    const [showChat, setShowChat] = useState(false)
    
    const [quantity, setQuantity] = useState(1)

    const [showOrderDetailsModal, setShowOrderDetailsModal] = useState({status: false, order: null})

    const [openCancelConfirmModal, setOpenCancelConfirmModal] = useState(false)
    const [cancelThisOrderId, setCancelThisOrderId] = useState(null)

    const [cancelReturnReq, setCancelReturnReq] = useState({orderId: null, productId: null, cancelType: null})

    const [openCancelForm, setOpenCancelForm] = useState({type:'', status:false, return:false, options:{}})
    const [openSelectReasons, setOpenSelectReasons] = useState({status:false, reasonTitle:'', reason:''})
    const productCancelFormRef = useRef(null)
    const orderCancelFormRef = useRef(null)

    const [showReviewForm, setShowReviewForm] = useState({status: false, orderId: null, productId: null, testimony: false})
    const [noShowRating, setNoShowRating] = useState([])
    const [fitlabRating, setFitlabRating] = useState(0)
    const [testimonyShared, setTestimonyShared] = useState(false)

    const returnWindowTime = 30 * 24 * 60 * 60 * 1000

    const [openRefundModal, setOpenRefundModal] = useState({status: false, orderOrProduct: null})

    const {orders, totalOrders, orderReturnRequested, canceledReturnRequest, loading, orderError} = useSelector(state=> state.order)

    const {cart, productAdded, productRemoved, error, message} = useSelector(state=> state.cart)

    const dispatch = useDispatch()

    const baseApiUrl = import.meta.env.VITE_API_BASE_URL


  useEffect(()=> {
    if(orders && totalOrders && totalPages && limit){
      console.log(`totalPages------>${totalPages}, limit------>${limit}`)
      setTotalPages(Math.ceil(totalOrders/limit))
    }
    console.log("showOrderDetailsModal--------------------->", showOrderDetailsModal)
  }, [orders, totalOrders, showOrderDetailsModal])
  

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

    useEffect(()=> {
      console.log("showReviewForm--------------->", showReviewForm)
      console.log("noShowRating--------------->", noShowRating)
    }, [showReviewForm, noShowRating])

    const orderStatusStyles = [
      {status:'processing', textColor:'text-orange-500', bg:'bg-orange-500', lightBg:'bg-orange-50', border:'border-orange-300', shadow: '#fdba74'},
      {status:'confirmed', textColor:'text-yellow-500', bg:'bg-yellow-500', lightBg:'bg-yellow-50', border:'border-yellow-300', shadow: '#fde047'},
      {status:'shipped', textColor: 'text-blue-500', bg: 'bg-blue-500', lightBg: 'bg-blue-50', border: 'border-blue-300', shadow: '#93c5fd'},
      {status:'delivered', textColor:'text-green-500', bg:'bg-green-500', lightBg:'bg-green-50', border:'border-green-300', shadow: '#86efac'}, 
      {status:'cancelled', textColor:'text-red-700', bg:'bg-red-700', lightBg:'bg-red-50', border:'border-red-300', shadow: '#fca5a5'},
      {status:'returning', textColor:'text-red-500', bg:'bg-red-500', lightBg:'bg-red-50', border:'border-red-300', shadow: '#fca5a5'},
      {status:'refunded', textColor:'text-green-500', bg:'bg-green-500', lightBg:'bg-green-50', border:'border-green-300', shadow: '#86efac'},
    ]

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

    const handleAddToCart = (productId)=> {
        console.log("Inside handleAddToCart()--")
        dispatch( addToCart({productId, quantity}) )
        console.log("Dispatched successfully")
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
        const returnDetails = {orderId: cancelReturnReq.orderId, productId: cancelReturnReq.productId._id, returnType: cancelReturnReq.cancelType}
        console.log('returnDetails------------>', returnDetails)
        dispatch(cancelReturnRequest({returnDetails}))
        // setCancelReturnReq({orderId: null, productId: null, cancelType: null})
      }
    }

    const handleAddReview = async(newReview, isTestimony, id) => {
        try{
          let response;
          if(isTestimony){
            response = await axios.post(`${baseApiUrl}/testimony/add`, {...newReview}, { withCredentials: true })
          }else{
            response = await axios.post(`${baseApiUrl}/review/add`, {productId: id, ...newReview},
                { withCredentials: true }
              )
          }
          console.log("handleAddReview response----->", response)
          if(response.data.success){
            sonnerToast.success(`Your ${showReviewForm.testimony ? 'testimony' : 'review'} has been submitted successfully!`)
            setShowReviewForm({ status: false, orderId: null, productId: null, testimony: false })
            setNoShowRating(ids=> ([...ids, id]))
            isTestimony && setTestimonyShared(true)
          }
        }
        catch(error){
          console.log(error)
          if (error.response && (error.response.status === 400 || error.response.status === 404)) {
            sonnerToast.error(error.response.data.message || "Error while submitting!")
          }else{
            sonnerToast.error("Internal Server Error")
          }
        }
    }


    return(
        <section id='OrderHistoryPage' className='bg-gradient-to-br from-gray-50 to-gray-100'>
            <header style={headerBg} className='h-[5rem]'>
                
                <Header pageChatBoxStatus={true}/>
                
            </header>
                
            <BreadcrumbBar heading='Order History'/>
            
            <motion.main 
              className='mt-[3rem]'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >

            <div className="min-h-screen p-[1rem] bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="max-w-[90rem] mx-auto">

                <div className="mb-[2rem] flex items-center justify-between" id='orderHistory-header'>
                  <h1 className="text-[25px] font-bold flex items-center gap-2 text-gray-800">
                    Your Orders
                    <span className="px-[12px] py-[4px] text-[13px] text-white font-[500] bg-gradient-to-r
                     from-[#BE72F2] to-secondary rounded-full shadow-sm">
                      {totalOrders}
                    </span>
                  </h1>

                  <DateSelector 
                    dateGetter={{startDate, endDate}} 
                    dateSetter={{setStartDate, setEndDate}} 
                    labelNeeded={true}
                  />
                  
                </div>

                <OrderTools 
                  limit={limit}
                  setLimit={setLimit}
                  queryDetails={queryDetails}
                  setQueryDetails={setQueryDetails}
                />
                <AnimatePresence mode="popLayout">
                {
                  orders && Object.keys(orders).length > 0  
                    ?
                    <motion.div className="space-y-6" 
                      id='orders-table'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      {  orders.map((order)=> 
                            ( order?.products.length > 0 && 
                              !order?.products.every(product=> product.isDeleted) &&
                            <motion.div 
                              key={order._id} 
                              className="pb-[1rem] bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow
                                duration-200"
                              layout
                              initial={{ opacity: 0, y: 40 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.4, ease: "easeOut" }}
                            >

                              <OrderHeader 
                                order={order} 
                                onViewOrderDetails={()=> setShowOrderDetailsModal({status: true, order: order})}
                              />

                              {
                                !noShowRating.includes(order._id) && order.orderStatus === 'delivered' && (
                                  <FitLabExperienceRating 
                                    onSubmit={(rating)=> {
                                      setFitlabRating(rating) 
                                      setShowReviewForm(({status: true, orderId: order._id, productId: null, testimony: true}))
                                    }}
                                    onClose={()=> setNoShowRating(order._id)}
                                  />
                                )
                              }

                              {
                                !noShowRating.includes(order._id) && order.orderStatus === 'delivered' && showReviewForm.status &&
                                  showReviewForm.orderId === order._id && showReviewForm.testimony && fitlabRating &&
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="my-8"
                                    >
                                      <ReviewForm
                                        onSubmit={(newReview) => handleAddReview(newReview, true, order._id)}
                                        containerStyle="mx-16"
                                        provideRating={fitlabRating}
                                        hideRating={true}
                                      />
                                    </motion.div>
                              }

                              {
                                testimonyShared &&
                                  <TestimonySuccess onTimeout={()=> setTestimonyShared(false)}/>
                              }
                              
                              {
                                order.orderStatus === 'returning' && order?.orderReturnStatus && order.orderReturnStatus === 'accepted'

                                    ? <RefundMessage 
                                          refundReqAccepted={true} 
                                          onOpenChat={()=> setShowChat(true)}
                                      />

                                    : order.orderStatus === 'delivered' && order?.orderReturnStatus && order.orderReturnStatus === 'rejected'

                                    ? <RefundMessage 
                                          refundReqAccepted={false} 
                                          onOpenChat={()=> setShowChat(true)}
                                      />

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
                                        <span className='ml-[5px] font-[550] tracking-[0.5px]'>
                                          { 
                                            order.orderStatus === 'delivered' ? 
                                              format(new Date(order.deliveryDate), "MMMM dd, yyyy" ) 
                                            : order.orderStatus === 'confirmed' 
                                            ? format(new Date(order.estimtatedDeliveryDate), "MMMM dd, yyyy" ) 
                                            : null
                                          } 
                                        </span>
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
                                      content={`You are about to cancel ${cancelThisOrderId ? 'an order' : 'a return request'}.
                                         Do you want to continue?`} 
                                      okButtonText='Continue' closeButtonText='Cancel' contentCapitalize={false} 
                                      instruction="If you are sure, write 'cancel' and press 'Continue', else click 'Close' button"
                                      typeTest={true} typeValue='cancel'
                                      activateProcess={cancelThisOrderId ? cancelThisOrder : confirmCancelReturn}/>
                                }     

                              </div>
                              
                              {order.products.map((product, index) => ( !product.isDeleted &&
                                <div key={product._id} className={`p-[1.5rem] ${index != order.products.length -1 ? 'border-b': ''} border-gray-100`} id='item-details'>

                                <OrderProuctsHub 
                                  order={order} 
                                  product={product} 
                                  onOpenOrderDetailsModal={()=> setShowOrderDetailsModal({status: true, order: order})}
                                  onAddToCart={handleAddToCart}
                                  onCancelOrReturnProduct={cancelOrReturnProduct}
                                  onCancelReturnReq={initiateCancelReturnReq}
                                  onOpenChat={()=> setShowChat(true)}
                                />

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


                                  { product && Object.keys(product).length > 0 &&
                                    !noShowRating.includes(product?.productId?._id) && product?.productStatus === 'delivered' && (
                                      <div
                                        className="mx-[1.5rem] mt-[1.5rem]"
                                        onClick={() => {
                                          setShowReviewForm(prev => ({
                                            status: prev?.productId === product?.productId?._id ? !prev.status : true,
                                            orderId: null,
                                            productId: product?.productId?._id,
                                            testimony: false
                                          }));
                                        }}
                                      >
                                        <div className="p-[11px] text-[13px] font-[500] flex justify-between items-center
                                          bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100 rounded-xl">
                                          <div className="flex items-center gap-[8px]">
                                            <Star className="w-[20px] h-[20px] text-yellow-400 fill-current" />
                                            <span className="font-[13px] cursor-pointer hover:text-secondary transition-colors duration-300">
                                              Please rate your experience using this product
                                            </span>
                                          </div>
                                          <button
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setNoShowRating(ids => [...ids, product.productId._id]);
                                              setShowReviewForm({ status: false, orderId: null, productId: null, testimony: false });
                                            }}
                                          >
                                            <X className="w-[20px] h-[20px]" />
                                          </button>
                                        </div>
                                      </div>
                                    )
                                  }
                                
                                  { product && Object.keys(product).length > 0 &&
                                    !noShowRating.includes(product?.productId?._id) &&
                                      product?.productStatus === 'delivered' &&
                                      showReviewForm.status &&
                                      showReviewForm?.productId === product?.productId?._id &&
                                      !showReviewForm.testimony && (
                                        <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: "auto" }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={{ duration: 0.3 }}
                                          className="my-8"
                                        >
                                          <ReviewForm
                                            onSubmit={(newReview) => handleAddReview(newReview, false, product?.productId?._id)}
                                            containerStyle="mx-16"
                                          />
                                        </motion.div>
                                    )
                                  } 
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

                                  {
                                    showOrderDetailsModal.status &&

                                      <OrderDetailsModal order={showOrderDetailsModal.order} isOpen={showOrderDetailsModal.status} 
                                          onClose={()=> setShowOrderDetailsModal({status: false, order: null})}/>
                                  }

                            </motion.div>
                          ))}
                      </motion.div>
                    :
                      <motion.h3 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className='w-full h-full flex justify-center items-center mt-[12rem] 
                          text-[13px] xs-sm2:text-[16px] xs-sm:text-[17px] text-muted capitalize tracking-[0.5px]'>
                         No records yet! 
                      </motion.h3>
                }
                </AnimatePresence>
                
                <div className="fixed bottom-[2rem] right-[2rem] z-50">

                  <TextChatBox openChats={showChat}/>
                  
                </div>
              </div>
            </div>

            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />


            </motion.main>
            
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



