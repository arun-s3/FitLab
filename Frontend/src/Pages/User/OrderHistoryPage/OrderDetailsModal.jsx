import React, {useRef} from 'react'
import {motion, AnimatePresence} from "framer-motion"

import {X, Package, ShoppingBag, Truck, CreditCard, Tag, Calendar, MapPin, CheckCircle, Clock, AlertCircle} from "lucide-react"

import useModalHelpers from '../../../Hooks/ModalHelpers'


export default function OrderDetailsModal({ isOpen, onClose, order }){

  if (!order) return null

  const modalRef = useRef(null)
  useModalHelpers({open: isOpen, onClose, modalRef})

  const getStatusColor = (status) => {
    const statusColors = {
      processing: "bg-purple-50 text-purple-700 border-purple-200",
      confirmed: "bg-indigo-50 text-indigo-700 border-indigo-200",
      shipped: "bg-cyan-50 text-cyan-700 border-cyan-200",
      delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cancelled: "bg-rose-50 text-rose-700 border-rose-200",
      returning: "bg-amber-50 text-amber-700 border-amber-200",
      refunded: "bg-pink-50 text-pink-700 border-pink-200",
    }
    return statusColors[status] || "bg-slate-100 text-slate-700 border-slate-200"
  }

  const getStatusIcon = (status) => {
    if (status === "delivered") return <CheckCircle className="w-4 h-4" />
    if (status === "shipped") return <Truck className="w-4 h-4" />
    if (status === "cancelled" || status === "refunded") return <AlertCircle className="w-4 h-4" />
    return <Clock className="w-4 h-4" />
  }

  const getPaymentMethodLabel = (method) => {
    const methods = {
      cashOnDelivery: "Cash on Delivery",
      razorpay: "Razorpay",
      stripe: "Stripe",
      paypal: "PayPal",
      wallet: "Wallet",
    }
    return methods[method] || method
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const formatDate = (date) => {
    if (!date) return "N/A"
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date))
  }

  const subtotal = order.orderTotal

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="sticky top-0 bg-gray-100 px-8 py-8 z-10 flex-shrink-0 border-b border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-[30px] h-[30px] text-primaryDark" />
                      <h2 className="text-2xl font-bold text-secondary tracking-tight">Order Details</h2>
                    </div>
                    <p className="text-sm text-muted font-medium ml-[2.3rem]">{order.fitlabOrderId}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Content */}
              <div 
                className="flex-1 overflow-y-auto px-8 py-8 space-y-8" 
                ref={modalRef}
                style={{backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url('/Images/admin-bg1.png')" }}
              >
                {/* Status Badges */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex flex-wrap gap-3"
                >
                  <div
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm border ${getStatusColor(order.orderStatus)}`}
                  >
                    {getStatusIcon(order.orderStatus)}
                    <span className="capitalize">{order.orderStatus}</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm border ${getStatusColor(order.paymentDetails.paymentStatus)}`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="capitalize">{`Payment ${order.paymentDetails.paymentStatus}`}</span>
                  </div>
                </motion.div>

                {/* Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg mt-1">
                        <Calendar className="w-4 h-4 text-purple-700" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Order Placed</p>
                        <p className="font-semibold text-slate-900 mt-1">{formatDate(order.orderDate)}</p>
                      </div>
                    </div>
                  </div>

                  {order.estimtatedDeliveryDate && (
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
                      <div className="flex items-start gap-3">
                        <div className="bg-amber-100 p-2 rounded-lg mt-1">
                          <Clock className="w-4 h-4 text-amber-700" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Est. Delivery</p>
                          <p className="font-semibold text-slate-900 mt-1">
                            {formatDate(order.estimtatedDeliveryDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {order.deliveryDate && (
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border border-emerald-200">
                      <div className="flex items-start gap-3">
                        <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                          <CheckCircle className="w-4 h-4 text-emerald-700" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Delivered</p>
                          <p className="font-semibold text-slate-900 mt-1">{formatDate(order.deliveryDate)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Products Section */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-slate-700" />
                    Items ({order.products.length})
                  </h3>
                  <div className="space-y-4">
                    {order.products.map((product, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        className="border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-slate-300 transition-all duration-200 bg-slate-50/50"
                      >
                        <div className="flex gap-4 mb-4">
                          <img
                            src={product.thumbnail || "/placeholder.svg"}
                            alt={product.title}
                            className="w-24 h-24 object-cover rounded-lg bg-white border border-slate-200 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-900 text-sm">{product.title}</h4>
                            <p className="text-xs text-slate-600 mt-1">{product.subtitle}</p>
                            {product.category && (
                              <div className="flex gap-2 mt-2 flex-wrap">
                                {product.category.map((cat, i) => (
                                  <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          <div className="bg-white border border-slate-200 p-3 rounded-lg">
                            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Qty</p>
                            <p className="font-bold text-slate-900 mt-1">{product.quantity}</p>
                          </div>
                          <div className="bg-white border border-slate-200 p-3 rounded-lg">
                            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Price</p>
                            <p className="font-bold text-slate-900 mt-1">{formatCurrency(product.price)}</p>
                          </div>
                          <div className="bg-white border border-slate-200 p-3 rounded-lg">
                            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Total</p>
                            <p className="font-bold text-slate-900 mt-1">{formatCurrency(product.total)}</p>
                          </div>
                          <div className={`p-3 rounded-lg border ${getStatusColor(product.productStatus)}`}>
                            <p className="text-xs font-medium uppercase tracking-wide">Status</p>
                            <p className="text-xs font-semibold mt-1 capitalize">{product.productStatus}</p>
                          </div>
                        </div>

                        {/* Discount Info */}
                        {product.offerDiscount > 0 && (
                          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 p-4 rounded-lg mt-3">
                            <div className="bg-emerald-100 p-2 rounded-lg">
                              <Tag className="w-4 h-4 text-emerald-700" />
                            </div>
                            <div className="text-sm flex-1">
                              <span className="font-semibold text-emerald-900">
                                {product.offerOrProductDiscount === "offer" ? "Offer" : "Discount"}
                              </span>
                              <p className="text-emerald-700 mt-1">
                                {product.offerDiscountType === "percentage"
                                  ? `${product.offerDiscount}% off`
                                  : product.offerDiscountType === "freeShipping"
                                    ? "Free Shipping"
                                    : product.offerDiscountType === "buyOneGetOne"
                                      ? "Buy One Get One"
                                      : `${formatCurrency(product.offerDiscount)} off`}
                              </p>
                            </div>
                            <span className="font-bold text-emerald-700">{formatCurrency(product.offerDiscount)}</span>
                          </div>
                        )}

                        {product.extraQuantity > 0 && (
                          <p className="text-sm text-emerald-700 mt-3 font-semibold bg-emerald-50 px-3 py-2 rounded-lg inline-block">
                            Extra Quantity: +{product.extraQuantity}
                          </p>
                        )}

                        {product.productCancelReason && (
                          <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg mt-3 text-rose-800 text-sm">
                            <p className="font-semibold text-rose-900 mb-1">Cancellation Reason</p>
                            <p className="text-rose-700">{product.productCancelReason}</p>
                          </div>
                        )}

                        {product.productReturnReason && (
                          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mt-3 text-amber-800 text-sm">
                            <p className="font-semibold text-amber-900 mb-1">Return Reason</p>
                            <p className="text-amber-700">{product.productReturnReason}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Shipping Address */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-purple-700" />
                    </div>
                    Shipping Address
                  </h3>
                  {/* <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap break-words font-medium">
                    {order.shippingAddress}
                  </p> */}
                  {order.shippingAddress && (
                    <div className="text-slate-700 text-sm leading-relaxed font-medium space-y-1">
                      <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                      <p>{order.shippingAddress.street}, {order.shippingAddress.landmark}</p>
                      <p>{order.shippingAddress.district}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                      <p>Mobile: {order.shippingAddress.mobile}</p>
                    </div>
                  )}

                  {order.deliveryNote && (
                    <p className="text-sm text-slate-600 mt-4 border-t border-purple-200 pt-4">
                      <span className="font-semibold text-slate-900">Delivery Note:</span> {order.deliveryNote}
                    </p>
                  )}
                </motion.div>

                {/* Payment Information */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <CreditCard className="w-5 h-5 text-purple-700" />
                    </div>
                    Payment Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-purple-200">
                      <span className="text-slate-700 font-medium">Payment Method</span>
                      <span className="font-semibold text-slate-900">
                        {getPaymentMethodLabel(order.paymentDetails.paymentMethod)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-purple-200">
                      <span className="text-slate-700 font-medium">Status</span>
                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${getStatusColor(order.paymentDetails.paymentStatus)}`}
                      >
                        {order.paymentDetails.paymentStatus}
                      </span>
                    </div>
                    {order.paymentDetails.transactionId && (
                      <div className="py-3">
                        <span className="text-slate-700 font-medium block mb-2">Transaction ID</span>
                        <span className="font-mono text-xs bg-white/60 text-slate-800 px-3 py-2 rounded-lg inline-block border border-purple-200">
                          {order.paymentDetails.transactionId}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Price Breakdown */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-6 space-y-4"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-5">Price Breakdown</h3>

                  <div className="flex justify-between items-center py-3 border-b border-slate-300">
                    <span className="text-slate-700">Subtotal</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
                  </div>

                  {order.couponDiscount > 0 && (
                    <div className="flex justify-between items-center py-3 border-b border-slate-300">
                      <div>
                        <span className="text-slate-700">Coupon Discount</span>
                        <span className="text-xs text-slate-600 ml-2">({order.couponUsed})</span>
                      </div>
                      <span className="font-semibold text-emerald-700">-{formatCurrency(order.couponDiscount)}</span>
                    </div>
                  )}

                  {order.discount > 0 && (
                    <div className="flex justify-between items-center py-3 border-b border-slate-300">
                      <span className="text-slate-700">Discount</span>
                      <span className="font-semibold text-emerald-700">-{formatCurrency(order.discount)}</span>
                    </div>
                  )}

                  {order.deliveryCharge > 0 && (
                    <div className="flex justify-between items-center py-3 border-b border-slate-300">
                      <span className="text-slate-700">Delivery Charge</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(order.deliveryCharge)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-3 border-b border-slate-300">
                    <span className="text-slate-700">GST (Tax)</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(order.gst)}</span>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-5 mt-6 flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total Amount</span>
                    <span className="text-2xl font-bold text-primaryDark">
                      {formatCurrency(order.absoluteTotalWithTaxes)}
                    </span>
                  </div>
                </motion.div>

                {/* Cancellation/Return Reasons */}
                {(order.orderCancelReason || order.orderReturnReason) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                  >
                    {order.orderCancelReason && (
                      <div className="bg-rose-50 border border-rose-300 p-6 rounded-xl">
                        <p className="font-bold text-rose-900 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          Order Cancellation Reason
                        </p>
                        <p className="text-rose-700 text-sm">{order.orderCancelReason}</p>
                      </div>
                    )}
                    {order.orderReturnReason && (
                      <div className="bg-amber-50 border border-amber-300 p-6 rounded-xl">
                        <p className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                          <Truck className="w-5 h-5" />
                          Order Return Reason
                        </p>
                        <p className="text-amber-700 text-sm">{order.orderReturnReason}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-8 py-5 flex-shrink-0"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-sm hover:shadow-md"
                >
                  Close
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

