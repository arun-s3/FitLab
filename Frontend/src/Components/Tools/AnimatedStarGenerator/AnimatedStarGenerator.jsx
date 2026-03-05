import React from 'react'
import {motion} from 'framer-motion'

export default function AnimatedStarGenerator({product}){

    return(
        <div className="flex justify-center gap-1 mb-3">
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
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              </motion.div>
            ))}
        </div>

        // <div className="flex justify-center gap-1 mb-3">
        //   {[...Array(5)].map((_, i) => {
        //     const isFilled = i < Math.floor(product?.averageRating || 0)
        //     return (
        //       <motion.div
        //         key={i}
        //         initial={{ opacity: 0, scale: 0 }}
        //         whileInView={{ opacity: 1, scale: 1 }}
        //         transition={{ delay: 0.2 + i * 0.05 }}
        //       >
        //         <svg
        //           xmlns="http://www.w3.org/2000/svg"
        //           viewBox="0 0 24 24"
        //           fill={isFilled ? "#facc15" : "none"}     // yellow-400 for filled, none for outline
        //           stroke={isFilled ? "#facc15" : "#d1d5db"} // gray-300 for outline stroke
        //           strokeWidth="2"
        //           className="w-[16px] h-[16px]"
        //         >
        //           <path
        //             strokeLinecap="round"
        //             strokeLinejoin="round"
        //             d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.911c.969 0 1.371 1.24.588 1.81l-3.975 2.888a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.975-2.888a1 1 0 00-1.176 0l-3.975 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.082 10.1c-.783-.57-.38-1.81.588-1.81h4.911a1 1 0 00.95-.69l1.518-4.674z"
        //           />
        //         </svg>
        //       </motion.div>
        //     )
        //   })}
        // </div>

    )
}