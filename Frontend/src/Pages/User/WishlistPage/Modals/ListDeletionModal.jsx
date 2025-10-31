import React, {useRef} from 'react'
import {useDispatch} from 'react-redux'
import {motion, AnimatePresence} from "framer-motion"

import { X, AlertTriangle } from "lucide-react"

import {deleteList} from '../../../../Slices/wishlistSlice'
import useModalHelpers from '../../../../Hooks/ModalHelpers'


export default function ListDeletionModal({ isOpen, onClose, listDetails, setListDetails }){

    if (!isOpen) return null

    const dispatch = useDispatch()

    const modalRef = useRef(null)
    useModalHelpers({open: isOpen, onClose, modalRef})
    
    const handleDeleteConfirm = ()=> {
        dispatch( deleteList({listId: listDetails.listId}) )
        setListDetails(null)
        onClose()
    }


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <motion.div
              className="flex justify-between items-center p-[1rem] border-b"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.25 }}
            >
              <h2 className="text-[18px] font-semibold text-red-500">
                Confirm Deletion
              </h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9, rotate: -90 }}
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </motion.button>
            </motion.div>

            <motion.div
              className="p-6"
              ref={modalRef}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <motion.div
                className="flex items-center space-x-4 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.25 }}
              >
                <div className="bg-yellow-100 rounded-full p-3">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-900">
                    Are you sure?
                  </h3>
                  <p className="text-[13px] text-sm text-gray-500">
                    This action cannot be undone.
                  </p>
                </div>
              </motion.div>

              <motion.p
                className="text-[14px] text-gray-600 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.25 }}
              >
                You are about to delete the list{" "}
                <span className="font-semibold text-gray-800">
                  "{listDetails.listName}"
                </span>
                . All products in this list will be removed as well.
              </motion.p>

              <motion.div
                className="flex justify-end space-x-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white
                    hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                    transition duration-150 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                    bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 
                    transition duration-150 ease-in-out"
                >
                  Delete List
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


