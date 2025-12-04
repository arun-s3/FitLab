import React, { useState } from "react"
import { motion } from "framer-motion"

const HeartIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

export default function BMICalculator() {
    
  const [formData, setFormData] = useState({
    gender: "male",
    age: "",
    height: "",
    weight: "",
    waistCircumference: "",
    hipCircumference: "",
    systolic: "",
    diastolic: "",
    bodyFat: "",
    glucose: "",
  })

  const [results, setResults] = useState(null)
  const [showResults, setShowResults] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    if (value === "" || /^[0-9]+$/.test(value)){
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    } 
  }

  const calculateBMI = (e) => {
    e.preventDefault()

    const weight = Number.parseFloat(formData.weight)
    const height = Number.parseFloat(formData.height)
    const age = Number.parseFloat(formData.age)
    const waist = Number.parseFloat(formData.waistCircumference)
    const hip = Number.parseFloat(formData.hipCircumference)
    const systolic = Number.parseFloat(formData.systolic)
    const diastolic = Number.parseFloat(formData.diastolic)
    const bodyFat = Number.parseFloat(formData.bodyFat)
    const glucose = Number.parseFloat(formData.glucose)

    const bmi = weight / (height / 100) ** 2

    let bmiCategory = ""
    let bmiColor = ""
    if (bmi < 18.5) {
      bmiCategory = "Underweight"
      bmiColor = "text-purple-600"
    } else if (bmi < 25) {
      bmiCategory = "Normal Weight"
      bmiColor = "text-green-600"
    } else if (bmi < 30) {
      bmiCategory = "Overweight"
      bmiColor = "text-yellow-600"
    } else {
      bmiCategory = "Obese"
      bmiColor = "text-red-600"
    }

    const whr = (waist / hip).toFixed(2)
    let wherCategory = ""
    if (formData.gender === "male") {
      wherCategory = whr < 0.9 ? "Good" : "High"
    } else {
      wherCategory = whr < 0.85 ? "Good" : "High"
    }

    let bpCategory = ""
    let bpColor = ""
    if (systolic < 120 && diastolic < 80) {
      bpCategory = "Normal"
      bpColor = "text-green-600"
    } else if (systolic < 130 && diastolic < 80) {
      bpCategory = "Elevated"
      bpColor = "text-yellow-600"
    } else if (systolic < 140 || diastolic < 90) {
      bpCategory = "Stage 1 Hypertension"
      bpColor = "text-orange-600"
    } else {
      bpCategory = "Stage 2 Hypertension"
      bpColor = "text-red-600"
    }

    let glucoseCategory = ""
    let glucoseColor = ""
    if (glucose < 100) {
      glucoseCategory = "Normal (Fasting)"
      glucoseColor = "text-green-600"
    } else if (glucose < 126) {
      glucoseCategory = "Prediabetic"
      glucoseColor = "text-yellow-600"
    } else {
      glucoseCategory = "Diabetic"
      glucoseColor = "text-red-600"
    }

    let bodyFatCategory = ""
    let bodyFatColor = ""
    if (formData.gender === "male") {
      if (bodyFat < 6) {
        bodyFatCategory = "Essential Fat"
        bodyFatColor = "text-gray-600"
      } else if (bodyFat < 13) {
        bodyFatCategory = "Athletes"
        bodyFatColor = "text-purple-600"
      } else if (bodyFat < 17) {
        bodyFatCategory = "Fitness"
        bodyFatColor = "text-green-600"
      } else if (bodyFat < 25) {
        bodyFatCategory = "Average"
        bodyFatColor = "text-yellow-600"
      } else {
        bodyFatCategory = "Obese"
        bodyFatColor = "text-red-600"
      }
    } else {
      if (bodyFat < 13) {
        bodyFatCategory = "Essential Fat"
        bodyFatColor = "text-gray-600"
      } else if (bodyFat < 20) {
        bodyFatCategory = "Athletes"
        bodyFatColor = "text-purple-600"
      } else if (bodyFat < 24) {
        bodyFatCategory = "Fitness"
        bodyFatColor = "text-green-600"
      } else if (bodyFat < 32) {
        bodyFatCategory = "Average"
        bodyFatColor = "text-yellow-600"
      } else {
        bodyFatCategory = "Obese"
        bodyFatColor = "text-red-600"
      }
    }

    setResults({
      bmi: bmi.toFixed(1),
      bmiCategory,
      bmiColor,
      whr,
      wherCategory,
      bpCategory,
      bpColor,
      glucoseCategory,
      glucoseColor,
      bodyFatCategory,
      bodyFatColor,
    })
    setShowResults(true)
  }

  const resetForm = () => {
    setFormData({
      gender: "male",
      age: "",
      height: "",
      weight: "",
      waistCircumference: "",
      hipCircumference: "",
      systolic: "",
      diastolic: "",
      bodyFat: "",
      glucose: "",
    })
    setResults(null)
    setShowResults(false)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-8" variants={itemVariants} initial="hidden" animate="visible">
          <div className="flex items-center justify-center gap-3 ">
            <h1 className="text-[30px] md:text-[42px] font-bold text-gray-900">Health Metrics</h1>
          </div>
          <p className="text-gray-600 text-lg">Calculate your BMI and comprehensive health indicators. Helps us track your health!</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-8"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <form onSubmit={calculateBMI} className="space-y-6">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <div className="flex gap-4">
                  {["male", "female"].map((gender) => (
                    <motion.button
                      key={gender}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, gender }))}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                        formData.gender === gender
                          ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                  Age (years)
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg placeholder:text-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="25"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="height" className="block text-sm font-semibold text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg placeholder:text-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="175"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg placeholder:text-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="70"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="waistCircumference" className="block text-sm font-semibold text-gray-700 mb-2">
                  Waist Circumference (cm)
                </label>
                <input
                  type="number"
                  id="waistCircumference"
                  name="waistCircumference"
                  value={formData.waistCircumference}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg placeholder:text-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="80"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="hipCircumference" className="block text-sm font-semibold text-gray-700 mb-2">
                  Hip Circumference (cm)
                </label>
                <input
                  type="number"
                  id="hipCircumference"
                  name="hipCircumference"
                  value={formData.hipCircumference}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg placeholder:text-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="90"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="systolic" className="block text-sm font-semibold text-gray-700 mb-2">
                    Blood Pressure: Systolic (mmHg)
                  </label>
                  <input
                    type="number"
                    id="systolic"
                    name="systolic"
                    value={formData.systolic}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg placeholder:text-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="120"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="diastolic" className="block text-sm font-semibold text-gray-700 mb-2">
                    Blood Pressure: Diastolic (mmHg)
                  </label>
                  <input
                    type="number"
                    id="diastolic"
                    name="diastolic"
                    value={formData.diastolic}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg placeholder:text-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="80"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="bodyFat" className="block text-sm font-semibold text-gray-700 mb-2">
                  Body Fat (%)
                </label>
                <input
                  type="number"
                  id="bodyFat"
                  name="bodyFat"
                  value={formData.bodyFat}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg placeholder:text-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="20"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="glucose" className="block text-sm font-semibold text-gray-700 mb-2">
                  Glucose (mg/dL)
                </label>
                <input
                  type="number"
                  id="glucose"
                  name="glucose"
                  value={formData.glucose}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg placeholder:text-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="100"
                  required
                />
              </motion.div>

              <motion.div className="flex gap-4 pt-6" variants={itemVariants}>
                <motion.button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-purple-600/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Calculate
                </motion.button>
                <motion.button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reset
                </motion.button>
              </motion.div>
            </form>
          </motion.div>

          {showResults && results && (
            <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
              <motion.div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-8" variants={itemVariants}>
                <h3 className="text-sm font-semibold text-gray-600 mb-4">BMI</h3>
                <div className="flex items-end gap-4">
                  <div>
                    <div className={`text-5xl font-bold ${results.bmiColor}`}>{results.bmi}</div>
                    <p className={`text-lg font-semibold ${results.bmiColor} mt-2`}>{results.bmiCategory}</p>
                  </div>
                  <div className="flex-1 h-20 bg-gradient-to-r from-purple-200 via-green-200 to-red-200 rounded-lg opacity-50"></div>
                </div>
              </motion.div>

              <motion.div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-8" variants={itemVariants}>
                <h3 className="text-sm font-semibold text-gray-600 mb-4">Waist-to-Hip Ratio</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-4xl font-bold text-gray-900">{results.whr}</div>
                    <p className="text-lg font-semibold text-green-600 mt-2">{results.wherCategory}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>Ideal Range:</p>
                    <p className="font-semibold">{formData.gender === "male" ? "< 0.9" : "< 0.85"}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-8" variants={itemVariants}>
                <h3 className="text-sm font-semibold text-gray-600 mb-4">Blood Pressure</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">
                      {formData.systolic}/{formData.diastolic}
                    </div>
                    <p className={`text-lg font-semibold ${results.bpColor} mt-2`}>{results.bpCategory}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-8" variants={itemVariants}>
                <h3 className="text-sm font-semibold text-gray-600 mb-4">Body Fat Percentage</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-4xl font-bold text-gray-900">{formData.bodyFat}%</div>
                    <p className={`text-lg font-semibold ${results.bodyFatColor} mt-2`}>{results.bodyFatCategory}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-8" variants={itemVariants}>
                <h3 className="text-sm font-semibold text-gray-600 mb-4">Blood Glucose</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-4xl font-bold text-gray-900">{formData.glucose}</div>
                    <p className="text-sm text-gray-600 mt-1">mg/dL</p>
                    <p className={`text-lg font-semibold ${results.glucoseColor} mt-2`}>{results.glucoseCategory}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {!showResults && (
            <motion.div
              className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-lg shadow-gray-200/50 p-8 flex items-center justify-center"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 opacity-20">📊</div>
                <p className="text-gray-600 text-lg font-semibold">
                  Fill in your information and click Calculate to see your health metrics
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
