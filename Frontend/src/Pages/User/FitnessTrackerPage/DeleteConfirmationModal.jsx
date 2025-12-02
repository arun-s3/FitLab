import React, {useEffect, useRef} from "react"
import {AlertTriangle, X} from "lucide-react"

import {motion, AnimatePresence} from "framer-motion"

import useModalHelpers from '../../../Hooks/ModalHelpers'


export default function DeleteConfirmationModal({ isOpen, exercise, onConfirm, onCancel }) {

  const modalRef = useRef(null)
  useModalHelpers({open: isOpen, onClose: onCancel, modalRef})

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
          >
            <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-[9px] shadow-2xl border border-slate-200
             dark:border-slate-700 overflow-hidden">
              <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 px-6 sm:px-8 py-6
                 border-b border-red-200 dark:border-red-800 flex items-start justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                    className="flex-shrink-0"
                  >
                    <AlertTriangle className="size-6 text-red-600 dark:text-red-400" />
                  </motion.div>
                  <div className="flex-1">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Delete Exercise?</h2>
                  </div>
                </div>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={onCancel}
                  className="flex-shrink-0 p-1 hover:bg-red-200 dark:hover:bg-red-800 rounded-lg transition-colors duration-200"
                >
                  <X className="size-5 text-slate-600 dark:text-slate-400" />
                </motion.button>
              </div>

              <div className="px-6 sm:px-8 py-6 bg-white dark:bg-slate-800" ref={modalRef}>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">You are about to delete the exercise:</p>

                {exercise && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border border-inputBgSecondary dark:border-slate-600"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg">
                        <AlertTriangle className="size-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-[600] text-[14px] capitalize text-slate-900 dark:text-white truncate">{exercise.name}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-medium text-[13px] capitalize">{exercise.bodyPart}</span>
                          {" • "}
                          <span className="font-medium text-[13px] capitalize">{exercise.equipment}</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

              </div>

              <div className="bg-slate-50 dark:bg-slate-700 px-6 sm:px-8 py-4 border-t border-slate-200 
                dark:border-slate-600 flex gap-3 sm:flex-row flex-col-reverse">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCancel}
                  className="flex-1 px-4 py-2.5 text-[14px] border border-slate-300 dark:border-slate-600 text-slate-700 
                    dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-200"
                >
                  Keep Exercise
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  className="flex-1 px-4 py-2.5 text-[14px] bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg 
                    transition-colors duration-200"
                >
                  Delete Exercise
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
