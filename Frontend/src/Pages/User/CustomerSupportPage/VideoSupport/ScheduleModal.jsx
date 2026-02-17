import React, { useState, useEffect, useRef} from "react"
import { motion, AnimatePresence } from "framer-motion"

import { Calendar, Check, Clock, Star, MessageSquare, Tag, X } from "lucide-react"
import {toast as sonnerToast} from 'sonner'
import {toast} from "react-toastify"
import apiClient from '../../../../Api/apiClient'

import useModalHelpers from '../../../../Hooks/ModalHelpers'


export default function ScheduleModal({ userId, isOpen, onClose }) {

  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [currentStep, setCurrentStep] = useState(1)

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"]

  const modalRef = useRef(null)
  useModalHelpers({open: isOpen, onClose, modalRef})

  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      value: date.toISOString().split("T")[0],
      label: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      dayName: date.toLocaleDateString("en-US", { weekday: "long" }),
    }
  })

  const problemTopics = [
    {
      category: "Equipment Setup & Assembly",
      topics: [
        "Home gym equipment assembly",
        "Equipment installation guidance",
        "Space planning and layout",
        "Equipment calibration and setup",
      ],
    },
    {
      category: "Workout Form & Technique",
      topics: [
        "Proper lifting form and technique",
        "Exercise demonstration and guidance",
        "Form correction and safety tips",
        "Beginner workout instruction",
      ],
    },
    {
      category: "Equipment Selection & Recommendations",
      topics: [
        "Choosing the right equipment for goals",
        "Equipment comparison and features",
        "Budget-friendly equipment options",
        "Space-efficient equipment solutions",
      ],
    },
    {
      category: "Supplements & Nutrition",
      topics: [
        "Supplement selection and timing",
        "Protein powder recommendations",
        "Pre/post workout nutrition",
        "Supplement dosage and usage",
      ],
    },
    {
      category: "Workout Programming",
      topics: [
        "Custom workout plan creation",
        "Progressive overload strategies",
        "Training split recommendations",
        "Goal-specific program design",
      ],
    },
    {
      category: "Equipment Maintenance & Troubleshooting",
      topics: [
        "Equipment maintenance and care",
        "Troubleshooting equipment issues",
        "Warranty and repair guidance",
        "Equipment longevity tips",
      ],
    },
    {
      category: "Safety & Injury Prevention",
      topics: [
        "Safe workout practices",
        "Injury prevention strategies",
        "Proper warm-up and cool-down",
        "Equipment safety guidelines",
      ],
    },
    {
      category: "Product Compatibility & Usage",
      topics: [
        "Equipment compatibility questions",
        "Accessory recommendations",
        "Product feature explanations",
        "Usage tips and best practices",
      ],
    },
  ]

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

  useEffect(() => {
    if (isOpen) {
      setSelectedDate("")
      setSelectedTime("")
      setSelectedTopic("")
      setNotes("")
      setIsSubmitted(false)
      setCurrentStep(1) 
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

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

  const allTopics = problemTopics.flatMap((category) =>
    category.topics.map((topic) => ({
      value: topic,
      label: topic,
      category: category.category,
    })),
  )

  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleNextStep = () => {
    if (currentStep === 1 && selectedDate && selectedTime) {
      setCurrentStep(2)
    } else if (currentStep === 2) {
      setCurrentStep(3)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const bookSession = async(sessionDetails)=> {
    try{
      const response = await apiClient.post(`/video-chat/book`, sessionDetails)
      if(response.status === 201){
        setIsSubmitted(true)
        return true
      }else return false
    }
    catch(error){
      if (!error.response) {
          sonnerToast.error("Network error. Please check your internet.")
      } else if (error.response?.status === 400 || error.response?.status === 401 || error.response?.status === 409) {
          sonnerToast.error(error.response.data?.message || "Something went wrong. Please try again later.")
      } else {
          sonnerToast.error("Something went wrong! Please retry later.")
      }
      return false
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    if(userId.startsWith('guest')){
      toast.error('Guest cannot book a session. Please sign up and then book the session!')
      setTimeout(() => {
        onClose()
      }, 2500)
    }
    if (userId && selectedDate && selectedTime) {
      const isSessionBooked = await bookSession({ userId, scheduledDate: selectedDate, scheduledTime: selectedTime, subjectLine: selectedTopic, notes: notes.trim()})
      if(isSessionBooked){
        sonnerToast.success('Session booked successfully!')
      }else{
        sonnerToast.error('Error booking the session')
      }
      setTimeout(() => {
        onClose()
      }, 5000)
    }else{
      if(!userId){
        toast.error('Error in the connection. Try again Later!')
      }else sonnerToast.error('Error provide the date and time and retry!')
    }
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
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl"></div>

              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 text-center">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200 shadow-lg"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="relative w-24 h-24 mx-auto mb-6"
                  ref={modalRef}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full"></div>
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>

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
                    You'll receive a video call from our expert at the time you scheduled. Make sure you are available
                    and active at your scheduled time
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
              <div className="text-center mb-[1.5rem]">
                <h2 className="text-[25px] text-secondary font-bold mb-2 flex items-center justify-center">
                  <Calendar className="mr-3 h-7 w-7 text-priaryDark" />
                  Schedule Your Session
                </h2>
                <p className="text-[15px] text-gray-600">Choose your preferred date and time for a personalized consultation</p>
              </div>

              {/* Step indicator */}
              <div className="flex items-center justify-center mb-[10px]">
                <div className="flex items-center space-x-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                          currentStep >= step
                            ? "bg-primaryDark text-white shadow-lg"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {currentStep > step ? <Check className="h-5 w-5" /> : step}
                      </div>
                      {step < 3 && (
                        <div
                          className={`w-12 h-1 mx-2 transition-all duration-300 ${
                            currentStep > step ? "bg-primary" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step labels */}
              <div className="flex justify-center mb-8">
                <div className="flex space-x-8 text-sm">
                  <span className={`font-medium ${currentStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>
                    Date & Time
                  </span>
                  <span className={`font-medium ${currentStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>Details</span>
                  <span className={`font-medium ${currentStep >= 3 ? "text-blue-600" : "text-gray-400"}`}>Confirm</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="h-[350px] px-[10px] overflow-y-scroll overflow-x-hidden">
                {currentStep === 1 && (
                  <>
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
                {/* {selectedDate && ( */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="mb-[1.5rem]"
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
                {/* )} */}

                  {/* Next button for step 1 */}
                    {selectedDate && selectedTime && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-end mb-[10px]"
                      >
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-[15px] py-2 px-8 rounded-[8px] font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          Next
                        </button>
                      </motion.div>
                    )}
                  </>
                )}


                {/* Step 2: Topic, Notes, and Summary */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Selected Date/Time Summary */}
                    {/* <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl border border-blue-200/50">
                      <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                        <Calendar className="mr-2 h-5 w-5" />
                        Selected Date & Time
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-lg font-bold text-blue-700">
                            {new Date(selectedDate).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-blue-600 font-semibold">{selectedTime}</p>
                        </div>
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="mt-3 sm:mt-0 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Change Date/Time
                        </button>
                      </div>
                    </div> */}

                    {/* Topic selection */}
                    <div className="mb-8">
                      <label className="block mb-[10px] text-gray-800 text-[16px] font-semibold flex items-center">
                        <Tag className="mr-2 h-[15px] w-[15px] text-purple-600" />
                        What do you need help with?
                      </label>
                      <select
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        className="w-full px-4 py-[10px] text-[14px] placeholder:text-[13px] placeholder:text-muted border-2 border-gray-200 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm text-gray-700 font-medium"
                      >
                        <option value="">Select a topic (optional)</option>
                        {problemTopics.map((category) => (
                          <optgroup key={category.category} label={category.category}>
                            {category.topics.map((topic) => (
                              <option key={topic} value={topic}>
                                {topic}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      {selectedTopic && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200"
                        >
                          <p className="text-sm text-purple-700">
                            <span className="font-medium">Selected:</span> {selectedTopic}
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {/* Notes section */}
                    <div className="mb-8">
                      <label className="block text-[16px] text-gray-800 font-semibold mb-[10px] flex items-center">
                        <MessageSquare className="mr-2 h-[15px] w-[15px] text-secondary" />
                        Additional Notes
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Tell us more about your specific problem and need or any questions you have..."
                        rows={4}
                        className="w-full p-4 text-[14px] placeholder:text-[13px] placeholder:text-muted border-2 border-gray-200 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white shadow-sm resize-none"
                        maxLength={500}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-[12px] text-gray-500">
                          Help us prepare for your session by sharing specific details
                        </p>
                        <span className="text-[12px] text-gray-400">{notes.length}/500</span>
                      </div>
                    </div>

                    {/* Session summary */}
                    <div className="mb-8 bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-primary">
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <Star className="mr-2 h-5 w-5 text-[17px] text-yellow-500" />
                        Session Summary
                      </h3>
                      <div className="flex flex-col gap-[5px]">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600 font-medium text-[14px]">Date:</span>
                          <span className="font-semibold text-gray-800 text-[15px]">
                            {
                              (
                                ()=> {
                                  // const [year, month, day] = selectedDate.split('-').map(Number)
                                  // const localDate = new Date(year, month - 1, day) // Month is 0-based
                                  const localDate = new Date(selectedDate + 'T00:00:00')
                                  localDate.setDate(localDate.getDate() + 1)
                                  return localDate.toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                  })
                                }
                              )()
                            }
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600 font-medium text-[14px]">Time:</span>
                          <span className="font-semibold text-gray-800 text-[15px]">{selectedTime}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600 font-medium text-[14px]">Duration:</span>
                          <span className="font-semibold text-gray-800 text-[15px]">30-60 minutes</span>
                        </div>
                        {selectedTopic && (
                          <div className="flex justify-between items-start py-2 border-b border-gray-100">
                            <span className="text-gray-600 font-medium text-[14px]">Topic:</span>
                            <span className="font-semibold text-gray-800 text-[15px] text-right max-w-xs">{selectedTopic}</span>
                          </div>
                        )}
                        {notes.trim() && (
                          <div className="py-2">
                            <span className="text-gray-600 font-medium block mb-2 text-[14px]">Notes:</span>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-gray-700 text-[13px] leading-relaxed">{notes}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-[15px] py-[8px] px-6 rounded-[8px] font-semibold transition-all duration-300"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-[15px] text-white py-[8px] px-8 rounded-[8px] font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        Review & Confirm
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Final Confirmation */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-[1.3rem]">
                      <h3 className="text-[20px] font-bold text-gray-800">Confirm Your Booking</h3>
                      <p className="text-[14px] text-gray-600">Please review your session details before confirming</p>
                    </div>

                    {/* Final summary card */}
                    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-8 py-4 rounded-3xl border border-blue-200/50 mb-8">
                      <div className="text-center mb-6">
                        <div className="h-[3.5rem] w-[3.5rem] bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar className="h-[1.5rem] w-[1.5rem] text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">Your Session Details</h4>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div className="bg-white/70 backdrop-blur-sm py-2 px-[1.5rem] rounded-[7px]">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium text-[15px]">Date & Time:</span>
                            <div className="text-right">
                              <p className="font-bold text-gray-800 text-[14px]">
                                {new Date(selectedDate).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                              <p className="text-secondary text-[14px] font-semibold">{selectedTime}</p>
                            </div>
                          </div>
                        </div>

                        {selectedTopic && (
                          <div className="bg-white/70 backdrop-blur-sm py-2 px-[1.5rem] rounded-[7px]">
                            <div className="flex justify-between items-start">
                              <span className="text-gray-600 font-medium text-[15px]">Topic:</span>
                              <span className="font-semibold text-gray-800 text-right max-w-xs text-[14px]">{selectedTopic}</span>
                            </div>
                          </div>
                        )}

                        {notes.trim() && (
                          <div className="bg-white/70 backdrop-blur-sm py-2 px-[1.5rem] rounded-[7px]">
                            <span className="text-gray-600 font-medium block mb-2 text-[15px]">Your Notes:</span>
                            <p className="text-gray-700 text-sm leading-relaxed italic text-[14px]">"{notes}"</p>
                          </div>
                        )}

                        <div className="bg-white/70 backdrop-blur-sm py-2 px-[1.5rem] rounded-[7px]">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium text-[15px]">Duration:</span>
                            <span className="font-semibold text-gray-800 text-[14px]">30-60 minutes</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-[15px] py-[12px] px-6 rounded-[8px] font-semibold transition-all duration-300"
                      >
                        Back to Edit
                      </button>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-[12px] px-12 rounded-[8px] font-semibold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                      >
                        <span className="flex items-center text-[16px]">
                          <Star className="mr-2 h-5 w-5" />
                          Confirm Booking
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}

              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
