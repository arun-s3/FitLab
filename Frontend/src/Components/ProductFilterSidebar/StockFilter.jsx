import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

import { RotateCcw } from 'lucide-react'


export default function StockFilter({ onStockChange, onReset, givenStock }) {

  const [maxStock, setMaxStock] = useState('')

  useEffect(()=> {
        setMaxStock(givenStock === null ? '' : givenStock)
  }, [givenStock])

  const handleStockChange = (e) => {
    const value = e.target.value
  
    const regex = /^[0-9]*$/
    if (!regex.test(value)) {
      return
    }
  
    setMaxStock(value)
    if (onStockChange) {
      onStockChange(value !== "" ? parseInt(value, 10) : null)
    }
  }

  const handleReset = () => {
    setMaxStock('')
    if (onReset) {
      onReset()
    }
  }


  return (
    <motion.div
      className="border border-gray-200 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="p-4 space-y-4 border-t border-gray-200">
            <div>
              <label className="block text-[14px] font-semibold text-gray-700 tracking-wide mb-2">
                Minimum Stock
              </label>
              <motion.input
                type="text"
                value={maxStock}
                onChange={handleStockChange}
                placeholder="Enter stock quantity"
                className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-[13px] bg-white text-gray-900
                placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                  transition-all duration-200"
                whileFocus={{ scale: 1.02 }}
                min="0"
              />
            </div>
            {maxStock && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="p-2 bg-purple-50 rounded border border-purple-200"
              >
                <p className="text-xs text-purple-700">
                  Products with stock below{' '}
                  <span className="font-bold">{maxStock}</span> units will be shown
                </p>
              </motion.div>
            )}
            <div className="flex gap-2">
              <motion.button
                onClick={handleReset}
                disabled={!maxStock}
                className="flex-1 px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium
                   text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex
                   items-center justify-center gap-2"
                whileHover={maxStock ? { backgroundColor: '#f9fafb' } : {}}
                whileTap={maxStock ? { scale: 0.98 } : {}}
              >
                <RotateCcw size={16} />
                Reset
              </motion.button>
            </div>
          </div>
        </motion.div>
    </motion.div>
  )
}
