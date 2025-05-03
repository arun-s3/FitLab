import React, {useState, useRef, useEffect} from "react"
import {motion, AnimatePresence} from "framer-motion"

import {Calendar, ChevronDown} from "lucide-react"

export default function DateRangePicker({value, onChange}){

  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  const options = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "year", label: "This year" },
  ]

  const currentOption = options.find((option) => option.value === value) || options[1]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-3 py-2 bg-white
       dark:bg-gray-800 border rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700" >
        <Calendar size={16} className="w-[15px] h-[15px] text-muted"/>
        <span className="text-[13px] font-[450]"> {currentOption.label} </span>
        <ChevronDown size={16} className={`text-secondary transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-1 w-full bg-white dark:bg-gray-800 border rounded-md shadow-lg z-10">

            <div className="py-1">
              {options.map((option) => (
                <button key={option.value} onClick={()=> { onChange(option.value); setIsOpen(false)}}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    value === option.value
                      ? "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                      : ""  }`}>
                  {option.label}
                </button>
              ))}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
