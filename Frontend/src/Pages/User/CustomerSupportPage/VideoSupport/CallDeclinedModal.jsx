import React, {useRef} from 'react'
import { motion, AnimatePresence } from "framer-motion"

import { X, PhoneOff, Clock, Headphones } from "lucide-react"

import useModalHelpers from '../../../../Hooks/ModalHelpers'



export default function CallDeclinedModal({ isOpen, onClose }) {

  const modalRef = useRef(null)
  useModalHelpers({open: isOpen, onClose, modalRef})
    
  return (

    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{
                duration: 0.4,
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white hover:text-red-200 transition-colors duration-200"
                >
                  <X size={24} />
                </button>

                <div className="flex items-center space-x-3" ref={modalRef}>
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{
                      duration: 0.6,
                      delay: 0.2,
                      repeat: 1,
                    }}
                    className="bg-white bg-opacity-20 p-3 rounded-full"
                  >
                    <PhoneOff className="text-white" size={24} />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Call Declined</h2>
                    <p className="text-red-100 text-sm">Unable to connect</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-6">
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.3,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4"
                  >
                    <Clock className="text-red-600" size={32} />
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg font-semibold text-gray-800 mb-2"
                  >
                    Our Experts Are Currently Busy
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-600 text-sm leading-relaxed"
                  >
                    We apologize, but our customer care experts are currently assisting other members and cannot take
                    your call right now.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gray-50 rounded-lg p-4 mb-6"
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                      <Headphones className="text-blue-600" size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 text-sm mb-1">Alternative Support Options</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Try calling again in a few minutes</li>
                        <li>• Send us a message through live chat</li>
                        <li>• Schedule a callback for later</li>
                        <li>• Browse our FAQ section</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-sm"
                    onClick={onClose}
                  >
                    Try Again Later
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-sm"
                    onClick={() => {
                      onClose()
                      setTimeout(() => {
                        if (window.showChatTooltip) {
                          window.showChatTooltip()
                        }
                      }, 300)
                    }}
                  >
                    Live Chat
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
