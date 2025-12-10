import React, { useState, useEffect } from "react"
import {useNavigate} from 'react-router-dom'
import { motion, AnimatePresence } from "framer-motion"

import { ChevronLeft, ChevronRight, X } from "lucide-react"

import {capitalizeFirstLetter} from '../../Utils/helperFunctions'


export default function OfferProductsModal({ offer, applicableProducts, onClose }) {

  const [products, setProducts] = useState([])

  const [currentIndex, setCurrentIndex] = useState(0)

  const navigate = useNavigate()

  const getDiscountedPrice = (productPrice) => {
    if (offer.discountType === "percentage") {
      const discountAmount = (productPrice * offer.discountValue) / 100
      return productPrice - discountAmount
    }
    if (offer.discountType === "fixed") {
      return productPrice - offer.discountValue
    }

    return productPrice
  }

  useEffect(() => {
    const productsWithoutVariants = applicableProducts
      .filter(p => !p.variantOf) 
      .map(parent => {
        const variantPrices = parent.variants
          .map(variantId =>
            applicableProducts.find(product => 
              product._id.toString() === variantId.toString()
            )
          )
          .filter(Boolean) 
          .map(variant => variant.price)

        const prices = [parent.price, ...variantPrices]

        const minPrice = Math.min(...prices)
        let discountedPrice = null
        if(offer.discountType !== 'freeShipping' || offer.discountType !== 'buyOneGetOne'){
          discountedPrice = getDiscountedPrice(minPrice)
        }

        return { ...parent, minPrice, discountedPrice }
      });

    console.log("productsWithoutVariants------->", productsWithoutVariants)
    setProducts(productsWithoutVariants)
  }, [applicableProducts])


  const handlePreviousProducts = () => {
    setCurrentIndex(prev =>
      prev === 0 ? products.length - 1 : prev - 1
    )
  }

  const handleNextProducts = () => {
    setCurrentIndex(prev =>
      prev === products.length - 1 ? 0 : prev + 1
    )
  }


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-[8px] shadow-2xl max-w-md w-full overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-xl text-secondary font-bold dark:text-white">Applicable Products</h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        {
            products && products.length > 0 &&
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg h-40 flex items-center justify-center">
                        {products[currentIndex].thumbnail.url ? (
                          <img
                            src={products[currentIndex].thumbnail.url}
                            alt={products[currentIndex].title}
                            className="w-full h-full object-cover rounded-lg cursor-pointer"
                            onClick={()=> navigate({
                                pathname: '/shop/product', 
                                search: `?id=${products[currentIndex]._id}`
                              }, 
                              {state: {product: products[currentIndex]}}
                            )}
                          />
                        ) : (
                          <div className="text-slate-400 dark:text-slate-500 text-center">
                            <p className="text-sm">No image available</p>
                          </div>
                        )}
                      </div>
                    
                      <div>
                        <h4 
                          className="text-lg capitalize font-bold text-slate-900 dark:text-white hover:underline hover:underline-offset-[5px]              
                            decoration-secondary transition duration-300 mb-2 cursor-pointer"
                          onClick={()=> navigate({
                              pathname: '/shop/product', 
                              search: `?id=${products[currentIndex]._id}`
                            }, 
                            {state: {product: products[currentIndex]}}
                          )}
                        >
                          {products[currentIndex]?.title || "Product"}
                        </h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
                          {capitalizeFirstLetter(products[currentIndex]?.subtitle) || "No description available"}
                        </p>
                    
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                            ₹ {products[currentIndex]?.discountedPrice?.toFixed(2) || "0.00"}
                          </span>
                          {products[currentIndex]?.discountedPrice && (
                            <span className="text-sm text-slate-500 line-through">
                              ₹ {products[currentIndex].minPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-sm text-slate-600 dark:text-slate-400 text-center">
                        {currentIndex + 1} of {products.length}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

        }

        {products.length > 1 && (
          <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePreviousProducts}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300
               dark:hover:bg-slate-600 text-slate-900 dark:text-white py-2 rounded-lg transition-colors font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextProducts}
              className="flex-1 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white py-2
               rounded-lg transition-colors font-medium"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
