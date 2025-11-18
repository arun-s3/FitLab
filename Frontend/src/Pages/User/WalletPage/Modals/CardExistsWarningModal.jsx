import React, {useState, useRef} from 'react'
import {motion, AnimatePresence} from 'framer-motion'

import {CreditCard, ArrowRight, X} from 'lucide-react'

import useModalHelpers from '../../../../Hooks/ModalHelpers'



export default function CardExistsWarningModal({ isOpen = true, onClose = () => {}, onUpdateCard = () => {} }) {

  const [isClosing, setIsClosing] = useState(false)

  const modalRef = useRef(null)
  useModalHelpers({open: isOpen, onClose, modalRef})

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 300)
  }

  const handleUpdateCard = () => {
    setIsClosing(true)
    setTimeout(() => {
      onUpdateCard()
      setIsClosing(false)
    }, 300)
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.85,
      y: 20,
      transition: { duration: 0.3 },
    },
  }

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 200,
        delay: 0.2,
      },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: 0.1,
      },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: 0.3 + custom * 0.1,
      },
    }),
  }

  const hoverScale = {
    scale: 1.02,
    transition: { duration: 0.2 },
  }

  const tapScale = {
    scale: 0.98,
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
          />

          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="relative bg-white dark:bg-slate-900 rounded-[10px] shadow-2xl max-w-md w-full overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.button
                onClick={handleClose}
                whileHover={{ rotate: 90, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10 p-1"
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>

              <div className="h-1 bg-gradient-to-r from-purple-300 via-purple-500 to-fuchsia-500" ref={modalRef}/>

              <div className="p-8">
                <motion.div
                  className="flex justify-center mb-6"
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="bg-gradient-to-br from-purple-100 to-purple-100 dark:from-purple-900/30
                   dark:to-purple-900/30 rounded-full p-4">
                    <CreditCard size={32} className="text-purple-600 dark:text-purple-400" />
                  </div>
                </motion.div>

                <motion.h2
                  className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  Auto-Recharge Active
                </motion.h2>

                <motion.p
                  className="text-center text-gray-600 dark:text-gray-300 text-sm mb-6"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  You have already applied for automatic recharge. Would you like to update your card details?
                </motion.p>


                <div className="flex flex-col gap-3">
                  <motion.button
                    onClick={handleUpdateCard}
                    custom={0}
                    variants={buttonVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={hoverScale}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-700 hover:to-purple-800
                     text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 
                     active:shadow-none"
                  >
                    <span>Update Card Details</span>
                    <ArrowRight size={18} />
                  </motion.button>

                  <motion.button
                    onClick={handleClose}
                    custom={1}
                    variants={buttonVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={hoverScale}
                    whileTap={tapScale}
                    className="w-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700
                     text-gray-900 dark:text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 border
                      border-gray-200 dark:border-slate-700"
                  >
                    Continue with Current Card
                  </motion.button>
                </div>

                <motion.p
                  className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  You can update your card anytime from settings
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
