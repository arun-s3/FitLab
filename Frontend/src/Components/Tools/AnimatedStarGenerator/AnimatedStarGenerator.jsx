import React from "react"
import { motion } from "framer-motion"


export default function AnimatedStarGenerator({ product }) {

    return (
        <div className='flex justify-center gap-1 mb-3'>
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                >
                    <svg
                        className={`w-[15px] h-[15x] ${
                            i < Math.floor(product?.averageRating || 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                        }`}
                        viewBox='0 0 20 20'
                    >
                        <path d='M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z' />
                    </svg>
                </motion.div>
            ))}
        </div>
    )
}
