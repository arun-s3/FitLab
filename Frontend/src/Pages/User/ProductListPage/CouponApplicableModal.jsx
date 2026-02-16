import React, {useEffect, useRef, useCallback} from "react"
import {createPortal} from "react-dom"

import {AnimatePresence, motion} from "framer-motion"
import {X, Tag } from "lucide-react"

import useModalHelpers from '../../../Hooks/ModalHelpers'


export default function CouponApplicableModal({open, onClose, couponLabel = "Selected Coupon", products = [], categories=[]}){

  const panelRef = useRef(null)

  useLockBodyScroll(open)

  const modalRef = useRef(null)
  useModalHelpers({open, onClose, modalRef})

  useEffect(()=> {
    if(products.length === 0 && categories.length === 0){
      onClose()
    }
  }, [products, categories])

  function useLockBodyScroll(lock) {
    useEffect(() => {
      if (!lock) return
      const original = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = original
      }
    }, [lock])
  }

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        e.stopPropagation()
        onClose?.()
      }
    },
    [onClose],
  )

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.()
    }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const panelVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 400, damping: 30, mass: 0.6 },
    },
    exit: { opacity: 0, y: 16, scale: 0.98, transition: { duration: 0.15 } },
  }

  const listContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05, delayChildren: 0.05 },
    },
  }

  const listItem = {
    hidden: { opacity: 0, y: 6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 500, damping: 30, mass: 0.7 },
    },
  }

  if (typeof document === "undefined") return null


  return createPortal(

    <AnimatePresence>

      {open ? (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleOverlayClick}
          onKeyDown={onKeyDown}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            variants={overlayVariants}
          />
          <motion.div
            key="panel"
            ref={panelRef}
            tabIndex={-1}
            className="relative z-10 w-full max-w-lg md:max-w-xl lg:max-w-2xl rounded-xl bg-white text-gray-900
              shadow-2xl ring-1 ring-black/5 focus:outline-none"
            variants={panelVariants}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <Tag className="h-[25px] w-[25px] text-secondary" />
                </span>
                <div className="min-w-0">
                  <h2 id="coupon-modal-title" className="text-[20px] text-secondary capitalize font-semibold leading-6 text-gray-900">
                    Coupon Eligibility
                  </h2>
                  <p id="coupon-modal-desc" className="mt-0.5 text-xs text-gray-500">
                    {`Showing ${products.length > 0 ? 'products' : 'categories'} eligible for:`} 
                    <span className="font-medium text-gray-800">{couponLabel}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-gray-700 
                  hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 
                    focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <X className="h-5 w-5"/>
                <span className="sr-only">Close</span>
              </button>
            </div>

            <div 
                className={`px-5 py-4 ${products.length > 3 ? 'overflow-y-scroll' : categories.length > 2 ? 'overflow-scroll' : null}`}
                ref={modalRef}
            >
                {
                  products.length > 0 &&
                    <motion.ul
                      className="divide-y divide-gray-200 border border-gray-200 rounded-[12px]"
                      variants={listContainer}
                      initial="hidden"
                      animate="visible"
                    >
                        {
                          products.map(product => (
                            <motion.li
                              key={product._id}
                              className="flex items-center justify-between gap-4 px-4 py-3 bg-white"
                              variants={listItem}
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <img
                                  src={product.thumbnail.url || "/placeholder.svg?height=48&width=48&query=product-thumbnail"}
                                  alt={product.title ? `${product.title} thumbnail` : "Product thumbnail"}
                                  className="h-12 w-12 flex-shrink-0 rounded-md object-cover ring-1 ring-gray-200"
                                  loading="lazy"
                                  width={48}
                                  height={48}
                                />
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium capitalize text-gray-900">{product.title}</p>
                                  <p className="mt-0.5 text-xs text-gray-500">Eligible with {couponLabel}</p>
                                </div>
                              </div>
                              <p className="text-sm font-semibold text-gray-900">
                                {'₹' + product.price}
                              </p>
                            </motion.li>
                          ))
                        }
                    </motion.ul>
                  }

                  {
                    categories.length > 0 &&
                     <motion.ul
                        role="list"
                        className="grid grid-cols-2 gap-5 sm:grid-cols-2 md:grid-cols-3"
                        variants={listContainer}
                        initial="hidden"
                        animate="visible"
                      >
                        {categories.map(category => (
                          <motion.li
                            key={category._id}
                            className="group overflow-hidden rounded-xl ring-1 ring-gray-200 bg-gray-50 shadow-sm
                             transition-all hover:shadow-md"
                            variants={listItem}
                          >
                            <div className="aspect-square w-full overflow-hidden bg-white">
                              <img
                                src={category.image.url || "/placeholder.svg?height=256&width=256&query=category-thumbnail"}
                                alt={category.name ? `${category.name} thumbnail` : "Category thumbnail"}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                                width={256}
                                height={256}
                              />
                            </div>
                            <div className="p-3">
                              <p className="line-clamp-1 text-sm capitalize font-semibold text-gray-900">{category.name}</p>
                              <p className="mt-0.5 text-xs text-gray-500">Eligible with {couponLabel}</p>
                            </div>
                          </motion.li>
                        ))}
                      </motion.ul>
                  }
              
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-4">
              <button
                onClick={onClose}
                className="inline-flex h-9 items-center justify-center rounded-md bg-gray-100 px-3 text-sm font-medium 
                  text-gray-700 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 
                  focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Close
              </button>
              <button
                onClick={onClose}
                className="inline-flex h-9 items-center justify-center rounded-md bg-purple-600 px-3 text-sm font-medium
                  text-white hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 
                  focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  )
}
