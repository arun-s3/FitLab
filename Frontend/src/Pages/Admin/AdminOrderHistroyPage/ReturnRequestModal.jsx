import React, {useEffect, useState, useRef} from "react"
import {useDispatch, useSelector} from 'react-redux'
import {motion, AnimatePresence} from "framer-motion"

import {X, ChevronLeft, ChevronRight, Package, Calendar, User, Mail, MessageSquare, Check, XCircle, Clock} from "lucide-react"
import {format} from "date-fns"
import {toast as sonnerToast} from 'sonner'

import {handleReturnDecision, resetOrderStates} from '../../../Slices/orderSlice'
import useModalHelpers from '../../../Hooks/ModalHelpers'


export default function ReturnRequestModal({returnRequestOrder = null, returnRequestProduct = null, returnOrderOrProduct, isOpen, onClose, onDecision}){

  const [currentImageIndex, setCurrentImageIndex] = useState(1)
  const [selectedAction, setSelectedAction] = useState(null)

  const [images, setImages] = useState(null)

  const {user} = useSelector(state=> state.user)
  const {handledOrderDecision, orderError} = useSelector(state=> state.order)
  const dispatch = useDispatch()

  const modalRef = useRef(null)
  useModalHelpers({open: isOpen, onClose, modalRef})

  useEffect(()=> {
    console.log(`returnRequestOrder--->${returnRequestOrder}, returnRequestProduct--->${returnRequestProduct}, returnOrderOrProduct--->${returnOrderOrProduct}`)
  }, [])

  useEffect(()=> {
    if(returnRequestOrder || returnRequestProduct){
        const images = returnOrderOrProduct === 'order' 
            ? returnRequestOrder.orderReturnImages
            : returnRequestProduct.productReturnImages
        setImages(images)
    }
  }, [returnOrderOrProduct])

  useEffect(()=> {
    if(handledOrderDecision){
        sonnerToast.success("Updated the decision to the user successfully!")
        dispatch(resetOrderStates())
    }
    if(orderError){
        sonnerToast.error(orderError)
        dispatch(resetOrderStates())
    }
  }, [handledOrderDecision, orderError])


  const statusColor = {
    pending: "bg-yellow-50 border-yellow-200",
    approved: "bg-green-50 border-green-200",
    rejected: "bg-red-50 border-red-200",
  }

  const statusBadgeColor = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleDecision = (didAccept) => {
    setSelectedAction("approved")
    const returnDetails = {orderId: returnRequestOrder._id, productId: returnOrderOrProduct._id, returnType: returnOrderOrProduct, didAccept}
    dispatch(handleReturnDecision({returnDetails}))
    if(onDecision){
        onDecision(returnRequestOrder.fitlabOrderId, didAccept)
    } 
    sonnerToast.info('Updating the user...')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border-2 ${statusColor[status]}`}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 p-6 flex justify-between items-center z-40"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3">
              <motion.div className="p-2 bg-white bg-opacity-10 rounded-lg" whileHover={{ scale: 1.05 }}>
                <Package className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-white">Return Request</h1>
                <p className="text-slate-300 text-sm mt-1"> {returnRequestOrder.fitlabOrderId} </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeColor['pending']}`}
                whileHover={{ scale: 1.05 }}
              >
                pending
              </motion.span>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </motion.div>

          <div className="p-8" ref={modalRef}>
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="lg:col-span-2 space-y-6" variants={itemVariants}>
                {
                    returnOrderOrProduct === 'product' &&
                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                          <motion.img
                            src={returnRequestProduct.thumbnail}
                            alt={product}
                            className="w-full h-64 object-cover rounded-lg"
                            whileHover={{ scale: 1.02 }}
                          />
                        </div>
                }

                <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-4" variants={itemVariants}>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Price</p>
                    <p className="text-lg font-bold text-slate-900">
                        ₹{
                            returnOrderOrProduct === 'order' 
                                ? returnRequestOrder.orderTotal.toFixed(2) 
                                : returnRequestProduct.price.toFixed(2)
                        }
                    </p>
                  </div>
                  {
                    returnOrderOrProduct === 'product' &&
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Quantity</p>
                          <p className="text-lg font-bold text-slate-900">{returnRequestProduct.quantity}</p>
                        </div>
                  }
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Delivered on</p>
                  </div>
                  {
                    returnOrderOrProduct === 'product' &&
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Total</p>
                            <p className="text-lg font-bold text-slate-900">
                                ₹{(returnRequestProduct.price.toFixed(2) * returnRequestProduct.quantity).toFixed(2)}
                            </p>
                        </div>
                  }
                </motion.div>

                {   
                    (
                        ()=> {
                            const images = returnOrderOrProduct === 'order' 
                                ? returnRequestOrder.orderReturnImages
                                : returnRequestProduct.productReturnImages
                            
                            return(
                                <motion.div className="space-y-4" variants={itemVariants}>
                                    <h3 className="text-lg font-semibold text-slate-900">Customer Evidence</h3>

                                    <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden border border-slate-200">
                                      <motion.img
                                        key={currentImageIndex}
                                        src={images[currentImageIndex]}
                                        alt={`Evidence ${currentImageIndex + 1}`}
                                        className="w-full h-80 object-cover"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                      />

                                      {images.length > 1 && (
                                        <>
                                          <motion.button
                                            onClick={prevImage}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                          >
                                            <ChevronLeft className="w-5 h-5 text-slate-900" />
                                          </motion.button>
                                          <motion.button
                                            onClick={nextImage}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                          >
                                            <ChevronRight className="w-5 h-5 text-slate-900" />
                                          </motion.button>
                                        </>
                                      )}

                                      <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {currentImageIndex + 1} / {images.length}
                                      </div>
                                    </div>
                                  
                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                      {images.map((img, idx) => (
                                        <motion.button
                                          key={idx}
                                          onClick={() => setCurrentImageIndex(idx)}
                                          className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                                            idx === currentImageIndex ? "border-slate-900" : "border-slate-200"
                                          }`}
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                        >
                                          <img
                                            src={img || "/placeholder.svg"}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="w-16 h-16 object-cover"
                                          />
                                        </motion.button>
                                      ))}
                                    </div>
                                </motion.div>
                            )
                        }
                    )()
                }

                <motion.div
                  className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-6"
                  variants={itemVariants}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <MessageSquare className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <h3 className="text-lg font-semibold text-slate-900">Reason for Return</h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {returnOrderOrProduct === 'order' ? returnRequestOrder.orderReturnReason : returnRequestProduct.productReturnReason}
                  </p>
                </motion.div>
              </motion.div>

              <motion.div className="lg:col-span-1" variants={itemVariants}>
                {user &&
                <motion.div
                  className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6 space-y-4 mb-6"
                  variants={itemVariants}
                >
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Customer Details</h3>

                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Uesrname</p>
                      <p className="text-slate-900 font-medium truncate">{user.username}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Email</p>
                      <p className="text-slate-900 font-medium text-sm truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Contact</p>
                      <p className="text-slate-900 font-medium">{user.mobile}</p>
                    </div>
                  </div>
                </motion.div>
                }

                <motion.div className="space-y-3" variants={itemVariants}>
                  <motion.button
                    onClick={()=> handleDecision(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Check className="w-5 h-5" />
                    Approve Return
                  </motion.button>

                  <motion.button
                    onClick={()=> handleDecision(false)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Return
                  </motion.button>

                  <motion.button
                    className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Clock className="w-5 h-5" />
                    Keep Pending
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
