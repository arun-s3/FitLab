import React, {useEffect} from 'react'
import {motion, AnimatePresence} from 'framer-motion'

import { X } from 'lucide-react'


export default function NotificationModal({
  isOpen = false,
  onClose,
  header = null,
  content = null,
  icon: IconComponent = null,
  type = 'success', 
  actionButton = null,
  closeButton = true,
  autoClose = true,
  autoCloseDuration = 5000,
}) {

  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose()
      }, autoCloseDuration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, autoClose, autoCloseDuration, onClose])

  const typeStyles = {
    success: {
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      iconBgColor: 'bg-emerald-100 dark:bg-emerald-900',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      defaultIcon: '✓',
    },
    error: {
      bgColor: 'bg-red-50 dark:bg-red-950',
      borderColor: 'border-red-200 dark:border-red-800',
      iconBgColor: 'bg-red-100 dark:bg-red-900',
      iconColor: 'text-red-600 dark:text-red-400',
      defaultIcon: '✕',
    },
    warning: {
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      iconBgColor: 'bg-yellow-100 dark:bg-yellow-900',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      defaultIcon: '!',
    },
    info: {
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      borderColor: 'border-blue-200 dark:border-blue-800',
      iconBgColor: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-400',
      defaultIcon: 'ℹ',
    },
  }

  const currentStyle = typeStyles[type] || typeStyles.info
  

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{
              duration: 0.3,
              ease: 'easeOut',
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className={`w-full max-w-sm rounded-lg border-2 ${currentStyle.bgColor} ${currentStyle.borderColor} shadow-2xl overflow-hidden`}
              layout
            >
              <div className="p-6 pb-4">
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.1,
                      duration: 0.4,
                      ease: 'easeOut',
                    }}
                    className={`flex-shrink-0 w-12 h-12 rounded-full ${currentStyle.iconBgColor} flex items-center justify-center`}
                  >
                    {IconComponent ? (
                      <IconComponent className={`w-6 h-6 ${currentStyle.iconColor}`} />
                    ) : (
                      <span className={`text-xl font-bold ${currentStyle.iconColor}`}>
                        {currentStyle.defaultIcon}
                      </span>
                    )}
                  </motion.div>

                  <div className="flex-1">
                    <motion.h3
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15, duration: 0.3 }}
                      className="text-lg font-semibold text-gray-900 dark:text-gray-50"
                    >
                      {header}
                    </motion.h3>
                  </div>

                  {closeButton && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="px-6 pb-4"
              >
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                  {content}
                </p>
              </motion.div>

              {actionButton && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.3 }}
                  className="px-6 pb-6 flex gap-3"
                >
                  <button
                    onClick={() => {
                      actionButton.onClick?.()
                      onClose()
                    }}
                    className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                      actionButton.variant === 'secondary'
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-50 hover:bg-gray-300 dark:hover:bg-gray-600'
                        : 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {actionButton.label}
                  </button>
                </motion.div>
              )}

              {autoClose && (
                <motion.div
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{
                    duration: autoCloseDuration / 1000,
                    ease: 'linear',
                  }}
                  className={`h-1 bg-gradient-to-r from-blue-500 to-purple-500 origin-left`}
                />
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
