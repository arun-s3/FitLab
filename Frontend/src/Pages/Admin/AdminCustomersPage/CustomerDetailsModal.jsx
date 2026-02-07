import React, {useRef} from "react"
import { motion, AnimatePresence } from "framer-motion"

import {X, User, Phone, Calendar, MapPin, Wallet, ShieldCheck, ShieldAlert, ShoppingBag, Package, RotateCcw, IndianRupee , XCircle,
  TrendingUp, Ticket, Clock} from "lucide-react"

import useModalHelpers from '../../../Hooks/ModalHelpers'


export default function CustomerDetailsModal({ isOpen, onClose, customerData, orderStats, address }){
    
  if (!customerData) return null

  const modalRef = useRef(null)
  useModalHelpers({open: isOpen, onClose, modalRef})

  const { profilePic, firstName, lastName, username, gender, mobile, dob, isVerified, walletBalance = 0 } = customerData

  const {
    totalOrders = 0,
    activeOrders = 0,
    totalReturns = 0,
    totalRefunds = 0,
    totalCancelled = 0,
    totalProductsReturned = 0,
    totalProductsRefunded = 0,
    totalProductsCancelled = 0,
    totalMoneySpent = 0,
    totalMoneySaved = 0,
    lastOrder = null,
  } = orderStats || {}

  const formatDate = (date) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatAddress = () => {
    if (!address) return "No address available"
    return `${address.street}, ${address.landmark ? address.landmark + ", " : ""}${address.district}, ${address.state} - ${address.pincode}`
  }

  const StatCard = ({ icon: Icon, label, value, color = "blue" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-gradient-to-br from-${color}-50 to-${color}-100 p-4 rounded-xl border border-${color}-200 shadow-sm`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 bg-${color}-500 bg-opacity-10 rounded-lg`}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-600 font-medium">{label}</p>
          <p className="text-lg font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </motion.div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-[9px] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden pointer-events-auto"
            >
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-5 flex items-center justify-between">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-bold text-white"
                >
                  Customer Details
                </motion.h2>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6" ref={modalRef}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border border-gray-200"
                >
                  <div className="flex items-start gap-6 mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="relative"
                    >
                      <img
                        src={
                          profilePic ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" ||
                          "/placeholder.svg"
                        }
                        alt={`${firstName && lastName ? `${firstName} ${lastName}` : `${username}` }`}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1">
                        {isVerified ? (
                          <div className="bg-green-500 p-1.5 rounded-full border-2 border-white">
                            <ShieldCheck className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="bg-red-500 p-1.5 rounded-full border-2 border-white">
                            <ShieldAlert className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </motion.div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {`${firstName && lastName ? `${firstName} ${lastName}` : `${username}` }`}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            isVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isVerified ? "Verified" : "Not Verified"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Gender</p>
                            <p className="text-sm font-semibold text-gray-900 capitalize">{gender || "N/A"}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Wallet className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Wallet Balance</p>
                            <p className="text-sm font-semibold text-gray-900">{formatCurrency(walletBalance)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Phone className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Mobile Number</p>
                            <p className="text-sm font-semibold text-gray-900">{mobile || "N/A"}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Calendar className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Date of Birth</p>
                            <p className="text-sm font-semibold text-gray-900">{formatDate(dob)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm mt-4">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <MapPin className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium mb-1">Address</p>
                          <p className="text-sm text-gray-900 max-w-10 line-clamp-2 break-words overflow-hidden leading-relaxed">
                            {formatAddress()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-purple-600" />
                    Order Stats
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <StatCard icon={ShoppingBag} label="Total Orders" value={totalOrders} color="purple" />
                    <StatCard icon={Package} label="Active Orders" value={activeOrders} color="blue" />
                    <StatCard icon={RotateCcw} label="Total Returns" value={totalReturns} color="orange" />
                    <StatCard icon={IndianRupee} label="Total Refunds" value={totalRefunds} color="yellow" />
                    <StatCard icon={XCircle} label="Total Cancelled" value={totalCancelled} color="red" />
                    <StatCard
                      icon={TrendingUp}
                      label="Total Money Spent"
                      value={formatCurrency(totalMoneySpent)}
                      color="purple"
                    />
                    <StatCard
                      icon={Ticket}
                      label="Money Saved (Coupons)"
                      value={formatCurrency(totalMoneySaved)}
                      color="green"
                    />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="mb-6"
                  >
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5 text-purple-600" />
                      Product Level Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <StatCard
                        icon={RotateCcw}
                        label="Products Returned"
                        value={totalProductsReturned}
                        color="orange"
                      />
                      <StatCard
                        icon={IndianRupee}
                        label="Products Refunded"
                        value={totalProductsRefunded}
                        color="purple"
                      />
                      <StatCard icon={XCircle} label="Products Cancelled" value={totalProductsCancelled} color="red" />
                    </div>
                  </motion.div>

                  {lastOrder && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-5 h-5 text-purple-600" />
                        <h4 className="text-lg font-bold text-gray-900">Last Order</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-xs text-gray-500 font-medium mb-1">Order ID</p>
                          <p className="text-sm font-bold text-purple-600">{lastOrder.fitlabOrderId || "N/A"}</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-xs text-gray-500 font-medium mb-1">Order Date</p>
                          <p className="text-sm font-semibold text-gray-900">{formatDate(lastOrder.orderDate)}</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-xs text-gray-500 font-medium mb-1">Total Amount</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatCurrency(lastOrder.absoluteTotalWithTaxes)}
                          </p>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-xs text-gray-500 font-medium mb-1">Order Status</p>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              lastOrder.orderStatus === "delivered"
                                ? "bg-green-100 text-green-700"
                                : lastOrder.orderStatus === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : lastOrder.orderStatus === "shipped"
                                    ? "bg-blue-100 text-purple-700"
                                    : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {lastOrder.orderStatus}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

