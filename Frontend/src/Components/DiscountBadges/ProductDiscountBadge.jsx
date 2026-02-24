import React from 'react'
import { motion } from 'framer-motion'

import { Tag } from 'lucide-react'


export default function ProductDiscountBadge({content, style}) {

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200
         text-emerald-700 text-xs sm:text-sm font-medium transition-all duration-200 hover:border-emerald-300 
         hover:bg-emerald-100 ${style ? style : ''}`}
    >
      <motion.div
        animate={{ y: [0, -1, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Tag size={14} strokeWidth={2.5} className="text-emerald-600" />
      </motion.div>
      <span className="text-emerald-700">{content ? content : "Product Discount"}</span>
    </motion.div>
  )
}
