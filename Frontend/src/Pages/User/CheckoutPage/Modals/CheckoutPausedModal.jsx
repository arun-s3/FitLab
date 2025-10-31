import React, {useState, useRef} from 'react'
import {motion, AnimatePresence} from "framer-motion"

import {X, AlertTriangle, ShoppingCart, Trash2} from "lucide-react"

import useModalHelpers from '../../../../Hooks/ModalHelpers'


export default function CheckoutPausedModal({isOpen, onClose, products = [], onDecQuantity, onRemoveProduct, onRetryCheckout}){
    
  const [removingProducts, setRemovingProducts] = useState(new Set())

  const modalRef = useRef(null)
  useModalHelpers({open: isOpen, onClose, modalRef})

  const getStatusColor = (product) => {
    if (product.productId.isBlocked) {
      return "text-red-600 bg-red-50 border-red-200"
    } else if (product.productId.stock < product.quantity) {
      return "text-gray-600 bg-gray-50 border-gray-200"
    } else if (!product.productId) {
      return "text-green-600 bg-green-50 border-green-200"
    } else {
      return "text-green-600 bg-green-50 border-green-200"
    } 
  }
  
  const getStatusText = (product) => {
    if (product.productId.isBlocked) {
      return "Blocked"
    } else if (product.productId.stock < product.quantity) {
      return "Out of stock"
    } else if (!product.productId) {
      return "Unavailable"
    } else {
      return "Unavailable"
    }
  }

  const handleRemoveProduct = async (productId) => {
    setRemovingProducts((prev) => new Set([...prev, productId]))

    onRemoveProduct(productId)
    await new Promise((resolve) => setTimeout(resolve, 200))

    setRemovingProducts((prev) => {
      const newSet = new Set(prev)
      newSet.delete(productId)
      return newSet
    })
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="bg-white dark:bg-gray-900 rounded-[8px] shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-[13px] bg-red-100 dark:bg-red-900/30 rounded-full">
                    <AlertTriangle className="w-[26px] h-[26x] text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-red-500 dark:text-white"> Checkout Paused</h2>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400"> Some items need attention </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-6" ref={modalRef}>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-[13px] xxs-sm:text-sm leading-relaxed">
                  The following items in your cart are currently unavailable or blocked or out of stock. 
                  Please remove them/decrease the quanity to continue with your checkout.
                </p>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  <AnimatePresence>
                    {products.map((product, index) => (
                      <motion.div
                        key={product.productId._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
                          {product.thumbnail ? (
                            <img
                              src={product.thumbnail || "/placeholder.svg"}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingCart className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 capitalize dark:text-white text-sm truncate">{product.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`px-2 py-1 rounded-full text-[10px] tracking-[0.3px] font-medium border ${getStatusColor(product)}`}
                            >
                              {getStatusText(product)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Qty: {product.quantity}</span>
                            {product.productId.stock < product.quantity && !product.productId.isBlocked &&(
                              <div className='flex items-center gap-[5px]'>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">Avail: {product.productId.stock}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div  className='flex flex-col justify-between items-center gap-[5px]'> 
                          <button
                            onClick={()=> handleRemoveProduct(product.productId._id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          > 
                              {removingProducts.has(product.id) ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full"
                              />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={onClose}
                  className="flex-1 p-[11px] xxs-sm:px-4 xxs-sm:py-2.5 text-[13px] xxs-sm:text-[15px] text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-[7px] font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={onRetryCheckout}
                  disabled={products.length <= 0}
                  className="flex-1 p-[11px] xxs-sm:px-4 xxs-sm:py-2.5 text-[13px] xxs-sm:text-[15px] bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed rounded-[7px] font-medium transition-colors"
                >
                  Place Order Again
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

