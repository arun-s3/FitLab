import React, { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Check, Clock, Star } from "lucide-react"

export default function ScheduleForm({ onSchedule }) {
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedDate && selectedTime) {
      onSchedule({ date: selectedDate, time: selectedTime })
      setIsSubmitted(true)
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl"></div>

        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 text-center">
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative w-32 h-32 mx-auto mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <Check className="h-12 w-12 text-green-600" />
            </div>

            {/* Success rings */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="absolute inset-0 bg-green-400 rounded-full"
            ></motion.div>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Session Scheduled!
          </h2>

          <p className="text-gray-600 mb-8 text-lg">Your video support session has been confirmed for:</p>

          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-2xl mb-8 border border-green-200/50">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-green-600 mr-2" />
              <span className="text-green-800 font-semibold">Scheduled Session</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-green-700 mb-2">
              {new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <p className="text-xl text-green-600 font-semibold">at {selectedTime}</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200/50">
            <p className="text-blue-800 font-medium mb-2">What happens next?</p>
            <p className="text-blue-700 text-sm leading-relaxed">
              You'll receive a confirmation email with session details and a reminder 30 minutes before your
              appointment.
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl"></div>

      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center justify-center">
            <Calendar className="mr-3 h-8 w-8 text-blue-600" />
            Schedule Your Session
          </h2>
          <p className="text-gray-600">Choose your preferred date and time for a personalized consultation</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Date selection */}
          <div className="mb-8">
            <label className="block text-gray-800 font-semibold mb-4 text-lg">Select a Date</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableDates.map((date) => (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  key={date.value}
                  onClick={() => setSelectedDate(date.value)}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedDate === date.value
                      ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`text-sm font-medium ${selectedDate === date.value ? "text-blue-700" : "text-gray-500"}`}
                    >
                      {date.dayName}
                    </div>
                    <div
                      className={`text-lg font-bold ${selectedDate === date.value ? "text-blue-600" : "text-gray-800"}`}
                    >
                      {date.label.split(" ").slice(1).join(" ")}
                    </div>
                  </div>
                  {selectedDate === date.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
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
              <label className="block text-gray-800 font-semibold mb-4 text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-600" />
                Select a Time
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {timeSlots.map((time) => (
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
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
                      className={`text-center font-semibold ${selectedTime === time ? "text-green-600" : "text-gray-700"}`}
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
              className={`group relative overflow-hidden py-4 px-12 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${
                selectedDate && selectedTime
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-xl hover:shadow-2xl"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <span className="relative z-10 flex items-center">
                <Star className="mr-2 h-5 w-5" />
                Confirm Booking
              </span>
              {selectedDate && selectedTime && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  )
}
