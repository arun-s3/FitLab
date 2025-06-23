import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Check, Clock, Star, X } from "lucide-react"

export default function ScheduleModal({ isOpen, onClose, onSchedule }) {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Generate next 7 days for date selection
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      value: date.toISOString().split("T")[0],
      label: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      dayName: date.toLocaleDateString("en-US", { weekday: "long" }),
    }
  })

  // Sample time slots
  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"]

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedDate("")
      setSelectedTime("")
      setIsSubmitted(false)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedDate && selectedTime) {
      onSchedule({ date: selectedDate, time: selectedTime })
      setIsSubmitted(true)
      // Close modal after 3 seconds
      setTimeout(() => {
        onClose()
      }, 3000)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  if (isSubmitted) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={handleBackdropClick}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative max-w-md w-full max-h-[90vh] overflow-hidden"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl"></div>

              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 text-center">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200 shadow-lg"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>

                {/* Success icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="relative w-24 h-24 mx-auto mb-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full"></div>
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>

                  {/* Success rings */}
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="absolute inset-0 bg-green-400 rounded-full"
                  ></motion.div>
                </motion.div>

                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                  Session Scheduled!
                </h2>

                <p className="text-gray-600 text-[15px] mb-6">Your video support session has been confirmed for:</p>

                <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl mb-6 border border-green-200/50">
                  <div className="flex items-center justify-center mb-3">
                    <Calendar className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-semibold">Scheduled Session</span>
                  </div>
                  <p className="text-[18px] font-bold text-green-700 mb-1">
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-[16px] text-green-600 font-semibold">at {selectedTime}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-2xl border border-blue-200/50">
                  <p className="text-secondary font-medium mb-1">What happens next?</p>
                  <p className="text-purple-600 text-[13px] leading-relaxed">
                    You'll receive a confirmation email with session details and a reminder 30 minutes before your
                    appointment.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleBackdropClick}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative max-w-2xl w-full max-h-[90vh]"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl"></div>

            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6 md:p-8">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200 shadow-lg z-10"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-[25px] text-secondary font-bold mb-2 flex items-center justify-center">
                  <Calendar className="mr-3 h-7 w-7 text-priaryDark" />
                  Schedule Your Session
                </h2>
                <p className="text-[15px] text-gray-600">Choose your preferred date and time for a personalized consultation</p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Date selection */}
                <div className="mb-8">
                  <label className="block text-primaryDark font-semibold mb-4 text-[15px]">Select a Date</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {availableDates.map((date) => (
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{duration: 0.2, delay: 0}}
                        type="button"
                        key={date.value}
                        onClick={() => setSelectedDate(date.value)}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                          selectedDate === date.value
                            ? "border-purple-500 bg-gradient-to-br from-purple-100 to-purple-200 shadow-lg"
                            : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
                        }`}
                      >
                        <div className="text-center">
                          <div
                            className={`text-sm font-medium ${
                              selectedDate === date.value ? "text-purple-700" : "text-gray-500"
                            }`}
                          >
                            {date.dayName}
                          </div>
                          <div
                            className={`text-[16px] font-bold ${
                              selectedDate === date.value ? "text-purple-600" : "text-gray-800"
                            }`}
                          >
                            {date.label.split(" ").slice(1).join(" ")}
                          </div>
                        </div>
                        {selectedDate === date.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                          >
                            <Check className="h-3 w-3 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Time selection */}
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                  >
                    <label className="text-primaryDark font-semibold mb-4 text-[15px] flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-secondary" />
                      Select a Time
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {timeSlots.map((time) => (
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{duration: 0.2, delay: 0}}
                          type="button"
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                            selectedTime === time
                              ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-100 shadow-lg"
                              : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md"
                          }`}
                        >
                          <div
                            className={`text-center text-[15px] font-semibold ${
                              selectedTime === time ? "text-green-600" : "text-gray-700"
                            }`}
                          >
                            {time}
                          </div>
                          {selectedTime === time && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                            >
                              <Check className="h-3 w-3 text-white" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Submit button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: selectedDate && selectedTime ? 1 : 0.5,
                    y: selectedDate && selectedTime ? 0 : 10,
                  }}
                  className="flex justify-center"
                >
                  <button
                    type="submit"
                    disabled={!selectedDate || !selectedTime}
                    className={`group relative overflow-hidden py-[12px] px-12 rounded-[10px] font-semibold text-lg transition-all duration-300 transform ${
                      selectedDate && selectedTime
                        ? "bg-purple-600 text-white hover:bg-purple-800 hover:scale-105 shadow-xl hover:shadow-2xl"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}  
                  >
                    <span className="relative z-10 flex items-center text-[16px]">
                      <Star className="mr-2 h-[1.2rem] w-[1.2rem]" />
                      Confirm Booking
                    </span>
                    {/* {selectedDate && selectedTime && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )} */}
                  </button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
