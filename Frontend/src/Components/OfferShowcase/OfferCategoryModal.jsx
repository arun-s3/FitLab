import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { ChevronLeft, ChevronRight, X } from "lucide-react"
import apiClient from "../../Api/apiClient"

import {capitalizeFirstLetter} from '../../Utils/helperFunctions'


export default function OfferCategoryModal({ categories, onClose }) {
    
    const [currentIndex, setCurrentIndex] = useState(0)

    const [productCount, setProductCount] = useState(0)

    const getProductsCountUnderCategory = async()=> { 
        try { 
          const response = await apiClient.get(`/admin/products/category/count/${categories[currentIndex]._id}`)
          if(response.status === 200){
            setProductCount(response.data.productCount)
          }
        }catch (error) {
            console.error(error)
        }
    }

    useEffect(()=> {
        getProductsCountUnderCategory()
    }, [categories, currentIndex])

    const handlePreviousCategory = () => {
      setCurrentIndex(prev =>
        prev === 0 ? categories.length - 1 : prev - 1
      )
    }

    const handleNextCategory = () => {
      setCurrentIndex(prev =>
        prev === categories.length - 1 ? 0 : prev + 1
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
          <h3 className="text-xl font-bold text-secondary dark:text-white">Applicable Categories</h3>
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
            categories && categories.length > 0 &&
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
                      <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-lg h-40 flex items-center justify-center">
                        {categories[currentIndex]?.image?.url ? (
                          <img
                            src={categories[currentIndex].image.url || "/placeholder.svg"}
                            alt={categories[currentIndex].name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-slate-400 dark:text-slate-500 text-center text-lg font-semibold">
                            {categories[currentIndex]?.name?.[0]?.toUpperCase() || "C"}
                          </div>
                        )}
                      </div>
                    
                      <div>
                        <h4 className="text-lg font-bold capitalize text-slate-900 dark:text-white mb-2">
                          {categories[currentIndex]?.name || "Category"}
                        </h4>
                        <p className="text-slate-600  dark:text-slate-400 text-sm mb-3">
                          {capitalizeFirstLetter(categories[currentIndex]?.description) || "No description available"}
                        </p>
                    
                        {productCount ? (
                          <div className="text-sm text-slate-700 dark:text-slate-300 bg-slate-100 
                            dark:bg-slate-800 tracking-[0.3px] px-3 py-2 rounded-lg inline-block">
                            {`${productCount} ${productCount === 1 ? 'product' : 'products'}`}  available
                          </div>
                          ) : null
                        }
                      </div>
                    
                      <div className="text-sm text-slate-600 dark:text-slate-400 text-center">
                        {currentIndex + 1} of {categories.length}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
        }
        {categories.length > 1 && (
          <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePreviousCategory}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white py-2 rounded-lg transition-colors font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextCategory}
              className="flex-1 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition-colors font-medium"
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
