import React, { useState, useEffect, useRef, useContext } from "react"
import {useSelector} from 'react-redux'
import { motion, AnimatePresence } from "framer-motion"

import { X, Send, MessageCircle, User } from "lucide-react"

import useModalHelpers from '../../../Hooks/ModalHelpers'
import {AdminSocketContext} from '../../../Components/AdminSocketProvider/AdminSocketProvider'


export default function CustomerMessageModal({ isOpen, onClose, customer }) {

  const [message, setMessage] = useState("")
  const [title, setTitle] = useState("")

  const modalRef = useRef(null)
  useModalHelpers({open: isOpen, onClose, modalRef})

  const {sendUserNotification} = useContext(AdminSocketContext)

  const { admin } = useSelector(state => state.admin)

  const handleSendMessage = () => {
    if (title.trim() && message.trim()) {
      console.log("Sending message to customer:", customer, message, title)

      const data = {userId: customer._id, title, message, type: 'admin', referenceModel: 'Admin', referenceId: admin._id}
      sendUserNotification(data)

      setTitle("")
      setMessage("")
      onClose()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleOpenChat = () => {
    console.log("Redirecting to chat page for customer:", customer)
  }
  

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[9px] shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col pointer-events-auto overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                  >
                    <User className="w-5 h-5 text-white" />
                  </motion.div> 
                  <div>
                    <h2 className="text-white font-semibold text-lg">
                        {`${customer?.firstName && customer?.lastName ? `${customer.firstName} ${customer.lastName}` : `${customer.username}` }`}
                    </h2>
                    <p className="text-purple-100 text-sm">{customer?.email || "customer@example.com"}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                 ref={modalRef}
                className="flex-1 overflow-y-auto p-6 bg-gray-50"
              >
                <div className="bg-purple-50 border border-purple-200 rounded-[7px] p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-purple-900 font-medium text-sm mb-1">Send Quick Message</h3>
                      <p className="text-purple-700 text-sm leading-relaxed">
                        Compose a one-way message to notify this customer. For real-time conversations, use the chat
                        button below.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">

                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium text-sm">Message Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter message title..."
                      className="w-full px-4 py-3 text-[15px] placeholder:text-[14px] bg-white border border-gray-300 rounded-[7px]
                        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 placeholder-gray-400 
                        text-sm md:text-base shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium text-sm">Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message to the customer..."
                      rows="8"
                      className="w-full px-4 py-3 text-[15px] placeholder:text-[14px] bg-white border border-gray-300 rounded-[7px]
                        resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800
                        placeholder-gray-400 text-sm md:text-base shadow-sm"
                    />
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <p className="text-gray-600 text-xs font-medium">Quick Templates:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Your order has been confirmed!",
                        "Your package has been shipped.",
                        "Thank you for your purchase!",
                        "We're here to help if you need anything.",
                      ].map((quick, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setMessage(quick)}
                          className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 text-xs md:text-sm rounded-lg 
                            transition-colors border border-gray-200 shadow-sm"
                        >
                          {quick}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border-t border-gray-200 px-4 py-4 md:px-6"
              >
                <div className="flex gap-3 flex-col sm:flex-row">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                     text-white rounded-[8px] px-4 py-3 transition-colors shadow-md hover:shadow-lg font-medium text-sm md:text-base 
                     flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleOpenChat}
                    className="flex-1 sm:flex-none bg-primaryDark hover:bg-green-500 text-white rounded-[8px] px-4 py-3 
                      transition-colors shadow-md hover:shadow-lg font-medium text-sm md:text-base flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Open Chat
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
