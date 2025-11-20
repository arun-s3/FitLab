import React from 'react'
import { motion } from 'framer-motion'


export default function Fallback({ variant = 'default', height = 'h-40' }) {

  const variants = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: 'easeOut',
        },
      },
    },
  };

  // Shimmer animation for skeleton loaders
  const shimmerVariants = {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  }

  // Default skeleton loader with shimmer
  if (variant === 'default') {
    return (
      <div className={`${height} w-full flex items-center justify-center bg-gradient-to-r from-gray-100 via-white to-gray-100 overflow-hidden`}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          className="w-full h-full space-y-4 p-6"
        >
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              variants={shimmerVariants}
              animate="animate"
              className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full"
              style={{
                backgroundSize: '200% 100%',
              }}
            />
          ))}
        </motion.div>
      </div>
    )
  }

  // Product carousel loader
  if (variant === 'products') {
    return (
      <div className={`${height} w-full flex items-center justify-center bg-gray-50`}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          className="w-full px-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {[1, 2, 3, 4].map((item) => (
              <motion.div
                key={item}
                variants={shimmerVariants}
                animate="animate"
                className="aspect-square bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 rounded-lg"
                style={{
                  backgroundSize: '200% 100%',
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  // Brands carousel loader
  if (variant === 'brands') {
    return (
      <div className={`${height} w-full flex items-center justify-center bg-white`}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          className="w-full flex gap-6 px-4 overflow-x-hidden"
        >
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <motion.div
              key={item}
              variants={shimmerVariants}
              animate="animate"
              className="w-24 h-24 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 rounded-lg flex-shrink-0"
              style={{
                backgroundSize: '200% 100%',
              }}
            />
          ))}
        </motion.div>
      </div>
    )
  }

  if (variant === 'wave') {
    return (
      <div className={`${height} w-full flex items-center justify-center bg-gradient-to-r from-white to-gray-50`}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          className="w-full flex justify-center gap-1 px-8"
        >
          {[1, 2, 3, 4, 5].map((item) => (
            <motion.div
              key={item}
              animate={{
                height: ['8px', '32px', '8px'],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: item * 0.1,
                ease: 'easeInOut',
              }}
              className="w-1.5 bg-gradient-to-t from-blue-600 to-blue-400 rounded-full"
            />
          ))}
        </motion.div>
      </div>
    )
  }

  return null
}
