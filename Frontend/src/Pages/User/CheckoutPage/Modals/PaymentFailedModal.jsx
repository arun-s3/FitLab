import React, {useState, useRef} from "react"
import {motion, AnimatePresence} from "framer-motion"

import {XCircle, X, RefreshCw, HelpCircle, ArrowLeft, AlertTriangle} from "lucide-react"

import useModalHelpers from '../../../../Hooks/ModalHelpers'



export default function PaymentFailedModal({ isOpen, message, onClose, onRetry, paymentMethod, onContactSupport }){

  const [isRetrying, setIsRetrying] = useState(false)

  const modalRef = useRef(null)
  useModalHelpers({open: isOpen, onClose, modalRef})

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      await onRetry?.()
    } finally {
      setTimeout(() => setIsRetrying(false), 1000)
    }
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  }

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  }

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        delay: 0.2,
        duration: 0.5,
        ease: "easeOut",
        type: "spring",
        damping: 15,
      },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.4,
        ease: "easeOut",
      },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.4 + i * 0.1,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-sm bg-whitesmoke dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
             rounded-[9px] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 
               dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 z-10"
            >
              <X size={20} />
            </motion.button>

            <div className="px-6 pt-6 pb-4 text-center" ref={modalRef}>
              <motion.div
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                className="inline-flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-red-100 dark:bg-red-900/30 rounded-full"
              >
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </motion.div>

              <motion.div variants={contentVariants} initial="hidden" animate="visible">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Payment Failed</h2>
                <p className="text-[13px] text-gray-600 dark:text-gray-400 text-balance leading-relaxed">
                  {
                    "We couldn't process your payment. This might be due to insufficient funds, an expired card, or a temporary issue."
                  }
                </p>
              </motion.div>
            </div>

            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="mx-6 mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-1"> Transaction Error </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <span> {`PAYMENT DECLINED ${message ? ':' : ''}`} </span>
                    <span> {message} </span>
                  </p>
                </div>
              </div>
            </motion.div>

            {
              !message || message !== 'Network Error' &&
                <motion.div 
                  variants={contentVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="px-6 mb-4"
                >
                  <h3 className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-2">Also you can try:</h3>
                  <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full mt-1.5 flex-shrink-0" />
                      Check your card details and billing address
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full mt-1.5 flex-shrink-0" />
                      Ensure you have sufficient funds available
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full mt-1.5 flex-shrink-0" />
                      Try a different payment method
                    </li>
                  </ul>
                </motion.div>
            }

            <div className="px-6 pb-5 space-y-2.5">
              <motion.button
                custom={0}
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                onClick={handleRetry}
                disabled={isRetrying}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary dark:bg-gray-100 
                text-white dark:text-gray-900 rounded-[7px] font-medium hover:bg-purple-700 dark:hover:bg-gray-200 
                 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200 
                 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={isRetrying ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1, repeat: isRetrying ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
                >
                  <RefreshCw size={16} />
                </motion.div>
                {isRetrying ? "Retrying..." : "Try Again"}
              </motion.button>

              {/* <div className="grid grid-cols-2 gap-2.5"> */}
                <motion.button
                  custom={2}
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => {
                    onContactSupport()
                    onClose()
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-[8px] border border-secondary dark:bg-gray-100 
                   text-secondary hover:text-white dark:text-gray-900 rounded-[7px] 8pfont-medium hover:border-purple-700 
                   hover:bg-secondary dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 
                    transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <HelpCircle size={16} />
                  <span className="text-[15px] text-inherit">Get Help</span>
                </motion.button>
              {/* </div> */}

              {
                paymentMethod !== 'paypal' &&
                  <motion.button
                    custom={3}
                    variants={buttonVariants}
                    initial="hidden"
                    animate="visible"
                    onClick={onClose}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-500 dark:text-gray-400 
                    hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowLeft size={14} />
                    <span className="text-xs">Back to Checkout</span>
                  </motion.button>
              }
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

