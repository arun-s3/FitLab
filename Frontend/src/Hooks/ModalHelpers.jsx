import { useEffect, useRef } from "react"



export default function useModalHelpers({ open, onClose, modalRef }){

  const previouslyFocusedRef = useRef(null)


  useEffect(() => {
    if (!open) return

    // previouslyFocusedRef.current = document.activeElement

    const modal = modalRef.current
    if (!modal) return

    const focusableSelectorElements = [
      "a[href]",
      "area[href]",
      "input:not([disabled]):not([type='hidden'])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "button:not([disabled])",
      "iframe",
    ]

    const focusableElements = modal.querySelectorAll(focusableSelectorElements.join(","))
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    firstElement?.focus()

    const handleKeyDown = (e) => {

      if (e.key === "Escape"){
        e.preventDefault()
        onClose?.()
      }

      if (e.key === "Tab"){
        if (focusableElements.length === 0){
          e.preventDefault()
          return
        }else{
          if (document.activeElement === lastElement){
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    //   previouslyFocusedRef.current?.focus?.()
    }

  }, [open, onClose, modalRef])
}
