import React from "react"
import { motion } from "framer-motion"

import { Gift } from "lucide-react"


export default function CategoryDiscountBadge({ content, style, iconSize, color = "blue" }) {

    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-${color}-50 border border-${color}-200
                text-${color}-700 text-xs sm:text-sm font-medium transition-all duration-200 hover:border-${color}-300 
                hover:bg-${color}-100 ${style ? style : ""}`}
        >
            <motion.div
                animate={{ scale: [1, 1.12, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <Gift size={iconSize ? iconSize : 14} strokeWidth={2.5} className='text-${color}-600' />
            </motion.div>

            <span className='text-${color}-700'>{content ? content : "Category Deal"}</span>
            
        </motion.div>
    )
}
