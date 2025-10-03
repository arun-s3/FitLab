import React, { useEffect, useRef } from "react"
import {AnimatePresence, motion} from "framer-motion"

import {BadgePercent, X, CheckCircle2, Truck, CalendarClock} from "lucide-react"
import {format} from "date-fns"


export default function BestCouponModal({open, onClose, coupon}) {

  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const previouslyFocusedRef = useRef(null)

  useEffect(() => {
    if (!open) return
    previouslyFocusedRef.current = document.activeElement

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose?.()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    const id = requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
    })

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      cancelAnimationFrame(id)
      previouslyFocusedRef.current?.focus?.()
    }
  }, [open, onClose])


  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            className="absolute inset-0 h-full w-full backdrop-blur-sm"
            onClick={() => onClose?.()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            ref={dialogRef}
            className="relative w-full max-w-md rounded-[10px] border border-border bg-white shadow-2xl md:max-w-lg"
            initial={{ y: 24, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 12, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute right-2 top-2">
              <button
                ref={closeButtonRef}
                onClick={() => onClose?.()}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-dropdownBorder 
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-5 w-5"/>
                <span className="sr-only">Close</span>
              </button>
            </div>

            <div className="flex flex-col gap-5 p-6 md:p-7">
              <motion.div
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-md"
                initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.05 }}
              >
                <BadgePercent className="h-6 w-6 text-secondary"/>
              </motion.div>

              <div className="space-y-2">
                <h2 id="coupon-modal-title" className="text-pretty text-secondary text-[18px] font-semibold leading-tight md:text-[22px]">
                  Best coupon applied
                </h2>
                <p
                  id="coupon-modal-description"
                  className="text-pretty text-[13px] leading-relaxed sm:text-[14px]"
                >
                  {"We found the best available deal and applied it automatically to your cart!"}
                </p>
              </div>

              <motion.div
                className="flex flex-wrap items-center gap-3"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
                  show: { transition: { staggerChildren: 0.08 } },
                }}
              >
                <motion.div
                  className="inline-flex items-center text-[12px] gap-2 rounded-[7px] border bg-inputBgSecondary
                    px-3 py-1.5 text-sm font-medium "
                  variants={{ hidden: { y: 8, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                >
                  <CheckCircle2 className="h-4 w-4 text-secondary"/>
                  <span className="text-[12px]">Applied to your cart</span>
                </motion.div>

                <motion.div
                  className="inline-flex items-center text-[12px] gap-2 rounded-[7px] border bg-inputBgSecondary
                    px-3 py-1.5 text-sm font-medium"
                  variants={{ hidden: { y: 8, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                >
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-[7px] border border-secondary
                    text-[10px] text-secondary font-bold">
                    %
                  </span>
                  <span className="font-medium text-[12px]">
                    { coupon.discountType !== 'buyOneGetOne' &&
                      `${
                          `( ${coupon.discountType === 'percentage' ? 
                            coupon.discountValue + '%' + ' Off' : coupon.discountType === 'fixed' ?
                             '₹' + coupon.discountValue + ' Off' : null
                            }
                          )`
                        }`  
                    }
                  </span>
                  <span className="font-medium  text-[12px]">•</span>
                  <span className="font-semibold tracking-wide text-[12px]">{coupon.code}</span>
                </motion.div>
              </motion.div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {coupon.discountType === 'freeShipping' ? (
                  <div className="flex items-center gap-2 rounded-[7px] border bg-inputBgSecondary px-3 py-1.5">
                    <Truck className="h-4 w-4 text-secondary" />
                    <p className="text-[12px] font-medium">Free shipping eligible</p> 
                  </div>
                ) : null}
                {coupon.endDate ? (
                  <div className="flex items-center gap-2 rounded-[7px] border border-border bg-inputBgSecondary px-3 py-1.5">
                    <CalendarClock className="h-4 w-4 text-secondary" />
                    <p className="text-[12px] font-medium"> Expires on: {format(new Date(coupon.endDate), "MMMM dd, yyyy" )}</p>
                  </div>
                ) : null}
              </div>

              <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  onClick={() => onClose?.()}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold 
                    shadow-sm transition-colors hover:bg-primaryDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Continue
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
