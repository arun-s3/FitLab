import React, {useState, useEffect, useRef} from "react"
import {motion, AnimatePresence} from "framer-motion"

import {X, MapPin, User, Phone, Mail, Home, Briefcase, Clock, Gift, AlertCircle} from "lucide-react"

import AddressField from "./AddressField"
import useModalHelpers from '../../../../../Hooks/ModalHelpers'


export default function NewAddressModal({ isOpen, onClose, onSubmit }){

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nickName: "",
    district: "",
    state: "",
    street: "",
    pincode: "",
    addressType: "Home",
    landmark: "",
    mobileNumber: "",
    email: "",
    alternateMobileNumber: "",
    deliveryInstructions: "",
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const modalRef = useRef(null)
  useModalHelpers({open: isOpen, onClose, modalRef})

  const validationPatterns = {
    firstName: {
      pattern: /^[A-Za-z]{1,49}$/,
      message: "First name must contain only letters (1-49 characters)",
    },
    lastName: {
      pattern: /^[A-Za-z]{1,49}$/,
      message: "Last name must contain only letters (1-49 characters)",
    },
    nickName: {
      pattern: /^(?=.*[A-Za-z]{3,})[A-Za-z0-9]{3,20}( [A-Za-z0-9]{3,20})?$/,
      message: "Nickname must be 3-20 characters with at least 3 letters, optional second word",
    },
    district: {
      pattern: /^[a-zA-Z\s]{1,49}$/,
      message: "District must contain only letters and spaces (1-49 characters)",
    },
    state: {
      pattern: /^[a-zA-Z\s]{1,49}$/,
      message: "State must contain only letters and spaces (1-49 characters)",
    },
    street: {
      pattern: /^[a-zA-Z0-9\s,.-]{3,100}$/,
      message: "Street address must be 3-100 characters with letters, numbers, spaces, and basic punctuation",
    },
    pincode: {
      pattern: /^[1-9][0-9]{5}$/,
      message: "Pincode must be 6 digits starting with 1-9",
    },
    landmark: {
      pattern: /^[a-zA-Z0-9\s,.-]{3,100}$/,
      message: "Landmark must be 3-100 characters with letters, numbers, spaces, and basic punctuation",
    },
    deliveryInstructions: {
      pattern: /^[a-zA-Z0-9.,'()\-:!?@#$%&+_[\]"/\\ ]{5,200}$/,
      message: "Delivery instructions must be 5-200 characters",
    },
    mobileNumber: {
      pattern: /^\d{10}$/,
      message: "Mobile number must be exactly 10 digits",
    },
    alternateMobileNumber: {
      pattern: /^\d{10}$/,
      message: "Alternate mobile number must be exactly 10 digits",
    },
    email: {
      pattern: /^([a-z\d.-]+)@([a-z\d-]+)\.([a-z]{2,10})([.a-z]?)$/,
      message: "Please enter a valid email address",
    },
  }

  const validateField = (name, value) => {
    if (!value && ["nickName", "landmark", "alternateMobileNumber", "deliveryInstructions"].includes(name)) {
      return null
    }

    const validation = validationPatterns[name]
    if (validation && !validation.pattern.test(value)) {
      return validation.message
    }
    return null
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))

    const error = validateField(name, value)
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }

  const handleSubmit = (e) => {
    console.log("Inside handleSubmit")
    e.preventDefault()

    const newErrors = {}
    const newTouched = {}

    Object.keys(formData).forEach((key) => {
      newTouched[key] = true
      const error = validateField(key, formData[key])
      if (error) {
        newErrors[key] = error
      }
    })

    setTouched(newTouched)
    setErrors(newErrors)

    // if (Object.keys(newErrors).length === 0) {
      console.log("Submitting formData---->", formData)
      onSubmit(formData)
      // onClose()
    // }
  }

  const personalInfo = ["firstName", "lastName", "nickName"]

  const addressInfo = ["district", "state", "street"]

  const contactInfo = ["mobileNumber", "email", "alternateMobileNumber"]

  const addressTypeOptions = [
    { value: "Home", label: "Home", icon: Home },
    { value: "Work", label: "Work", icon: Briefcase },
    { value: "Temporary", label: "Temporary", icon: Clock },
    { value: "Gift", label: "Gift", icon: Gift },
  ]


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-[9px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-[20px] max-xs-sm2:text-[18px] font-bold tracking-[0.5px] text-gray-900 flex items-center gap-2">
                      <MapPin className="w-[22px] h-[22px] text-purple-600" />
                      <span className="first-letter:text-[21px] max-xs-sm2:first-letter:text-[19px]"> Add New Address </span>
                    </h2>
                    <p className="text-purple-600 text-sm max-xs-sm2:text-[12px] mt-1"> Fill in the below fields to add a new address </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 hover:bg-white hover:bg-opacity-80 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </motion.button>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-140px)]" ref={modalRef}>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-primaryDark" />
                      <h3 className="text-[15px] font-semibold text-gray-900">Personal Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-[1.7rem] max-xs-sm2:flex max-xs-sm2:flex-col">
                        {
                            <AddressField 
                                infoArray={personalInfo} 
                                formData={formData} 
                                onChange={handleInputChange} 
                                onBlur={handleBlur} 
                                errors={errors}
                            />
                        }
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-5 h-5 text-primaryDark" />
                      <h3 className="text-[15px] font-semibold text-gray-900">Address Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-[1.7rem] max-xs-sm2:flex max-xs-sm2:flex-col">
                        {
                            <AddressField 
                                infoArray={addressInfo} 
                                formData={formData} 
                                onChange={handleInputChange} 
                                onBlur={handleBlur} 
                                errors={errors}
                            />
                        }
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <AddressField 
                            infoArray={['pincode']} 
                            formData={formData} 
                            onChange={handleInputChange} 
                            onBlur={handleBlur} 
                            errors={errors}
                        />

                        <div className="ml-8">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                          <div className="flex flex-wrap gap-2">
                            {
                                addressTypeOptions.map((option) => {
                                  const IconComponent = option.icon
                                  return (
                                    <motion.label
                                      key={option.value}
                                      whileHover={{ scale: 1.01 }}
                                      whileTap={{ scale: 0.98 }}
                                      transition={{ease:'easeOut', duration: 0.1}}
                                      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${
                                        formData.addressType === option.value
                                          ? "bg-purple-600 text-white"
                                          : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name="addressType"
                                        value={option.value}
                                        checked={formData.addressType === option.value}
                                        onChange={handleInputChange}
                                        className="sr-only"
                                      />
                                      <IconComponent className="w-[15px] h-[15px]" />
                                      <span className="text-[12px] font-medium">{option.label}</span>
                                    </motion.label>
                                  )
                            })}
                          </div>
                        </div>

                      <div>
                        <AddressField 
                            infoArray={['landmark']} 
                            formData={formData} 
                            onChange={handleInputChange} 
                            onBlur={handleBlur} 
                            errors={errors}
                        />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Phone className="w-5 h-5 text-primaryDark" />
                      <h3 className="text-[15px] font-semibold text-gray-900">Contact Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-[1.7rem] max-xs-sm2:flex max-xs-sm2:flex-col">
                        {
                            <AddressField 
                                infoArray={contactInfo} 
                                formData={formData} 
                                onChange={handleInputChange} 
                                onBlur={handleBlur} 
                                errors={errors}
                            />
                        }
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                  >
                    <div className="mt-8 flex items-center gap-2 mb-4">
                      <Mail className="w-5 h-5 text-primaryDark" />
                      <h3 className="text-[15px] font-semibold text-gray-900">Delivery Instructions</h3>
                    </div>
                    {
                        <AddressField 
                            infoArray={["deliveryInstructions"]} 
                            fieldType='textarea'
                            formData={formData} 
                            onChange={handleInputChange} 
                            onBlur={handleBlur} 
                            errors={errors}
                        />
                    }
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="pt-6 border-t border-gray-100"
                  >
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-secondary text-[17px] max-xs-sm2:text-[15px] text-white tracking-[0.7px] font-semibold 
                        py-4 px-6 rounded-[7px] shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-4 focus:ring-purple-200"
                    >
                      Save And Deliver to this Address
                    </motion.button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

