import React from "react"
import { motion } from "framer-motion"

import { Zap } from "lucide-react"


export default function OfferDiscountBadge() {

    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border 
                border-red-200 text-red-700 text-xs sm:text-sm font-medium transition-all duration-200 
                hover:border-red-300 hover:bg-red-100'
        >
            <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <Zap size={14} strokeWidth={2.5} className='text-red-600' />
            </motion.div>
            
            <span className='text-red-700'>Limited Offer</span>

        </motion.div>
    )
}
