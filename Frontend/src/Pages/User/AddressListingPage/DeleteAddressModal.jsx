import React, {useEffect, useRef, useCallback} from "react"
import {AnimatePresence, motion} from "framer-motion"

import {Trash2, X} from "lucide-react"

import useModalHelpers from '../../../Hooks/ModalHelpers'


export default function DeleteAddressModal({open, onClose, onConfirm, loading = false}){

  const overlayRef = useRef(null)
  const cancelRef = useRef(null)
  const confirmRef = useRef(null)

  const modalRef = useRef(null)
  useModalHelpers({open, onClose, modalRef})

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => cancelRef.current?.focus())
      return () => cancelAnimationFrame(id)
    }
  }, [open])

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        e.stopPropagation()
        onClose?.()
      }
    },
    [onClose],
  )


  const onOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose?.()
    }
  }

  const variants = {
    overlay: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.2 } },
      exit: { opacity: 0, transition: { duration: 0.15 } },
    },
    dialog: {
      initial: { opacity: 0, y: 16, scale: 0.98 },
      animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 320, damping: 28, mass: 0.9 },
      },
      exit: {
        opacity: 0,
        y: 12,
        scale: 0.98,
        transition: { duration: 0.18 },
      },
    },
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-50 bg-background/70 dark:bg-foreground/60 backdrop-blur-sm"
          onMouseDown={onOverlayClick}
          variants={variants.overlay}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="fixed inset-0 flex items-end md:items-center justify-center p-4">
            <motion.div
              id="delete-address-dialog"
              className="w-full max-w-md bg-whitesmoke rounded-t-2xl md:rounded-lg bg-card text-card-foreground shadow-xl
               border border-border focus:outline-none"
              onKeyDown={handleKeyDown}
              variants={variants.dialog}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <motion.div
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-red-500/10"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </motion.div>
                  <h2 id="delete-address-title" className="text-base text-red-500 font-semibold text-pretty">
                    Delete address?
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md p-1.5 hover:bg-grayMuted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div className="px-5 py-4" ref={modalRef}>
                <p id="delete-address-description" className="text-sm text-muted-foreground"> Are you sure you want to delete this address?
                  {" This action cannot be undone. "}
                </p>
              </div>

              <div className="px-5 py-4 flex items-center justify-end gap-2.5">
                <motion.button
                  type="button"
                  ref={cancelRef}
                  disabled={loading}
                  onClick={onClose}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ y: -1 }}
                  className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium 
                    hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dropdownBorder"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="button"
                  ref={confirmRef}
                  disabled={loading}
                  onClick={onConfirm}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ y: -1 }}
                  className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium bg-red-500 
                    hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
                >
                  {loading ? "Deleting…" : "Delete"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

 
