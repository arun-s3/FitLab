import React, { useState } from "react"
import { motion } from "framer-motion"

import {Mail, Phone, Send} from "lucide-react"
import {toast as sonnerToast} from 'sonner'

import useTermsConsent from "../../../Hooks/useTermsConsent"
import TermsDisclaimer from "../../../Components/TermsDisclaimer/TermsDisclaimer"
import {camelToCapitalizedWords} from '../../../Utils/helperFunctions'
import {CustomHashLoader} from '../../../Components/Loader/Loader'


export default function ContactForm({isSupportConnected, isCoachConnected, onSubmit}){

    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "",
      phone: "",
      message: "",
    })

    const [error, setError] = useState({
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "",
      phone: ""
    })

    const [loading, setLoading] = useState(false)

    const {acceptTermsOnFirstAction} = useTermsConsent()

    const supportOptions = [
      {
        title: "Customer Support",
        desc: "Our support team is available around the clock to address any concerns."
      },
      {
        title: "Feedback & Suggestions",
        desc: "We value your feedback and are continuously working to improve."
      },
      {
        title: "Coach+ Assistance",
        desc: "Get help using Coach+, including workout guidance, recovery tips, and training insights."
      },
      {
        title: "Orders & Payments",
        desc: "Get assistance with orders, payments, refunds, and FitLab wallet transactions.",
      }
    ]

    const handleInputChange = (e) => {
      const { id, value } = e.target
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }))
    }

    const regexPatterns = {
        emailPattern: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,10})([\.a-z]?)$/,
        firstNamePattern: /^[A-Za-z]{1,49}$/,
        lastNamePattern: /^[A-Za-z]{1,49}$/,
        countryCodePattern: /^\+[1-9]\d{0,3}$/,
        phonePattern: /^\d{10}$/,
        validator: function(e, errorMessage){
            const currentPattern = Object.keys(this).find( (pattern, index)=> {
                if(pattern.toString().match(e.target.id.toString())) return pattern[index]
            } )
            if(currentPattern){
                if(this[currentPattern].test(e.target.value.trim())){
                  setError(errors=> ({...errors, [e.target.id]: ''}))
                }
                else{
                  setError(errors=> ({...errors, [e.target.id]: errorMessage}))
                }
            }
        }
    }
    
    const handleBlurInput = (e)=>{
        if(!e.target.value.trim().length){
            setError(errors=> ({...errors, [e.target.id]: "This field cannot be empty"}))
        }
        else{
          regexPatterns.validator(e,`Please enter a valid ${camelToCapitalizedWords(e.target.name)}!`)
        }
    }

    const submitDetails = async(e)=> {
      setLoading(true)
      e.preventDefault()
      acceptTermsOnFirstAction()
      console.log("formData---->", formData)
      const fields = Object.keys(formData)
      console.log("fields---->", fields)
      if(fields.some(field=> !formData[field])){
        sonnerToast.error("Please fill all the details!")
        setLoading(false)
        return
      }
      if(Object.values(error).some(Boolean)){
        sonnerToast.error("Some of the entered fields are not valid. Please correct it and try again!")
        setLoading(false)
        return
      }
      if(formData.message.length < 2){
        sonnerToast.error("Please enter a meaningful message!")
        setLoading(false)
        return
      }
      if(formData.message.length >  5000){
        sonnerToast.error("The message exceeds the limits of 5000 letters!")
        setLoading(false)
        return
      }
      try{
        const {phone, countryCode, firstName, lastName, ...rest} = formData
        const name = `${firstName} ${lastName}`
        const mobile = countryCode + phone
        const details = {...rest, name, phone: mobile}
        console.log("Details to submit---->", details)
        const status = await onSubmit({details})
        if(status){
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            countryCode: "",
            phone: "",
            message: "",
          })
        }
      }catch (error) {
        console.error("Submit error:", error)
        sonnerToast.error("Something went wrong. Please check your network and try again later.")
      } finally {
        setLoading(false)
      }
    }


  return (
            
        <section className="mt-8 max-w-[83rem] bg-[#f3eff7] rounded-[16px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
              <p className="text-gray-600 text-[17px] mb-8">
                Reach out for support, feedback, or assistance with FitLab.
                Our team is ready to assist you at every step of your fitness journey.
                Email, call, or complete the form for queries.
              </p>

              <div className="space-y-6 mb-16">
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <a href="mailto:fitlab0101@gmail.com" className="text-purple-600 hover:underline">
                      fitlab0101@gmail.com
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <a href="tel:+91 9074688913" className="text-purple-600 hover:underline">
                      +91 9074688913
                    </a>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-[17px] text-orange-500">Support Options</h3>
                <div className="mt-10 grid grid-cols-3 gap-x-6 gap-y-8">
                  {supportOptions.map((option, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                      className="text-sm"
                    >
                      <div className="flex items-center gap-[7px] mb-1">
                        <p className="font-semibold text-gray-900">{option.title}</p>
                        { option.title === 'Customer Support' &&
                            <motion.div
                              className={`w-[5px] h-[5px] rounded-full ${isSupportConnected ? "bg-green-400" : "bg-red-400"}`}
                              animate={{ scale: [1, 1.4, 1] }}
                              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                            />
                        }
                        { option.title === 'Coach+ Assistance' &&
                            <motion.div
                              className={`w-[5px] h-[5px] rounded-full ${isCoachConnected ? "bg-green-400" : "bg-red-400"}`}
                              animate={{ scale: [1, 1.4, 1] }}
                              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                            />
                        }
                      </div>
                      <p className="text-gray-600 text-xs">{option.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
              
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 bg-white rounded-xl shadow-lg p-8 border-t border-t-primary"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Get in Touch</h2>
              <p className="text-gray-600 mb-6">You can reach us anytime</p>
              
              <form onSubmit={submitDetails} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="relative"
                  >
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onBlur={handleBlurInput}
                      placeholder="First name"
                      className={`w-full px-4 py-3 text-[15px] placeholder:text-[14px] border rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900
                       placeholder-gray-400 transition-all 
                       ${error.firstName ? 'bg-red-50 border-red-300' : 'bg-gray-100 border-gray-200 '}`}
                    />
                    <p className="absolute -bottom-[17px] left-0 text-[11px] text-red-500 tracking-[0.3px]"> {error.firstName && error.firstName} </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                    className="relative"
                  >
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onBlur={handleBlurInput}
                      placeholder="Last name"
                      className={`w-full px-4 py-3 text-[15px] placeholder:text-[14px] bg-gray-100 border border-gray-200 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900
                       placeholder-gray-400 transition-all
                       ${error.lastName ? 'bg-red-50 border-red-300' : 'bg-gray-100 border-gray-200 '}`}
                    />
                    <p className="absolute -bottom-[17px] left-0 text-[11px] text-red-500 tracking-[0.3px]"> {error.lastName && error.lastName} </p>
                  </motion.div>
                </div>
              
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="relative"
                >
                  <input
                    type="email"
                    name="email Id"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlurInput}
                    placeholder="Your email"
                    className={`w-full px-4 py-3 text-[15px] placeholder:text-[14px] bg-gray-100 border border-gray-200 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900
                     placeholder-gray-400 transition-all
                     ${error.email ? 'bg-red-50 border-red-300' : 'bg-gray-100 border-gray-200 '}`}
                  />
                  <p className="absolute -bottom-[17px] left-0 text-[11px] text-red-500 tracking-[0.3px]"> {error.email && error.email} </p>
                </motion.div>
              
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.45 }}
                  className="flex gap-2 relative"
                >
                  <input 
                    type="text"
                    placeholder="+91"
                    name="country code"
                    id="countryCode"
                    onBlur={handleBlurInput}
                    onChange={handleInputChange}
                    className={`w-16 px-3 py-3 text-[15px] placeholder:text-[14px] bg-gray-100 border border-gray-200 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900
                    ${error.countryCode ? 'bg-red-50 border-red-300' : 'bg-gray-100 border-gray-200 '}`}
                  />
                  <p className="absolute -bottom-[17px] left-0 text-[11px] text-red-500 tracking-[0.3px]"> {error.countryCode && error.countryCode} </p>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlurInput}
                    placeholder="Phone number"
                    className={`flex-1 px-4 py-3 text-[15px] placeholder:text-[14px] bg-gray-100 border border-gray-200 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900
                    placeholder-gray-400 transition-all
                    ${error.phone ? 'bg-red-50 border-red-300' : 'bg-gray-100 border-gray-200 '}`}
                  />
                  <p className="absolute -bottom-[17px] right-0 text-[11px] text-red-500 tracking-[0.3px]"> {error.phone && error.phone} </p>
                </motion.div>
              
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <textarea
                    name="message"
                    id="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="How can we help?"
                    rows="5"
                    maxLength={5000}
                    className="w-full px-4 py-3 text-[15px] placeholder:text-[15px] bg-gray-100 border border-gray-200 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900
                    placeholder-gray-400 transition-all resize-none"
                  />
                  <p className="text-[11px] text-muted tracking-[0.3px]"> { `${formData.message.length}/ 5000 charaters typed` } </p>
                </motion.div>
              
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.55 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full min-h-10 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg
                  transition-colors flex items-center justify-center gap-2"
                >
                  {
                    loading 
                      ? <CustomHashLoader loading={loading} color='#fff'/> 
                      : 
                        <>
                          <Send className="w-4 h-4" />
                          Submit
                        </>
                  }
                </motion.button>
              
                <TermsDisclaimer />

              </form>
            </motion.div>
          </div>
        </section>
  )
}

