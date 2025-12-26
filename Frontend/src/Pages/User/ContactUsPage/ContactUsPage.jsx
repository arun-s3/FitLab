import React, { useState } from "react"
import { motion } from "framer-motion"

import {Mail, Phone, Send} from "lucide-react"

import Header from '../../../Components/Header/Header'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import Footer from '../../../Components/Footer/Footer'


export default function ContactUsPage(){

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  })

  const headerBg = {
     backgroundImage: "url('/header-bg.png')",
     backgrounSize: 'cover'
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    })
  }


  return (
    <section id='ShoppingCartPage'>
    
        <header style={headerBg} className='h-[5rem]'>
        
            <Header pageChatBoxStatus={true}/>
        
        </header>
        
        <BreadcrumbBar heading='Contact Us'/>
    
        <main className='mt-[5px]'>

            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
                    <p className="text-gray-600 text-lg mb-8">
                      Email, call, or complete the form to learn how FitLab can solve your messaging problem.
                    </p>
        
                    <div className="space-y-6 mb-12">
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
                      <h3 className="font-semibold text-gray-900">Support Options</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          {
                            title: "Customer Support",
                            desc: "Our support team is available around the clock to address any concerns.",
                          },
                          {
                            title: "Feedback & Suggestions",
                            desc: "We value your feedback and are continuously working to improve.",
                          }
                        ].map((option, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                            className="text-sm"
                          >
                            <p className="font-semibold text-gray-900 mb-1">{option.title}</p>
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
                    className="bg-white rounded-xl shadow-lg p-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Get in Touch</h2>
                    <p className="text-gray-600 mb-6">You can reach us anytime</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 }}
                        >
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="First name"
                            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.35 }}
                        >
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Last name"
                            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                          />
                        </motion.div>
                      </div>
                    
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                      >
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Your email"
                          className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                        />
                      </motion.div>
                    
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.45 }}
                        className="flex gap-2"
                      >
                        <input 
                          type="text"
                          placeholder="+91"
                          className="w-16 px-3 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                        />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Phone number"
                          className="flex-1 px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                        />
                      </motion.div>
                    
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                      >
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="How can we help?"
                          rows="5"
                          className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all resize-none"
                        />
                      </motion.div>
                    
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.55 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Submit
                      </motion.button>
                    
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                        className="text-xs text-gray-500 text-center"
                      >
                        By contacting us, you agree to our{" "}
                        <a href="#" className="text-purple-600 hover:underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-purple-600 hover:underline">
                          Privacy Policy
                        </a>
                      </motion.p>
                    </form>
                  </motion.div>
                </div>
              </section>
                    
              <section className="bg-white py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                      className="bg-gray-200 rounded-xl overflow-hidden h-96 md:h-96 relative shadow-lg"
                    >
                      <div style={{ width: "100%", borderRadius: "12px", overflow: "hidden" }}>
                        <iframe 
                          title="FitLab Location"
                          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1372.161982659852!2d76.21072184298876!3d10.550784881690953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1766769691062!5m2!1sen!2sin" 
                          width="100%" 
                          height="350" 
                          style={{border: 0}} 
                          allowfullscreen="" 
                          loading="lazy" 
                          referrerpolicy="no-referrer-when-downgrade"
                        >
                        </iframe>
                        <p className="mt-[9px] pl-[10px] text-[13px] text-[#666]">
                          Use mouse scroll to zoom or click “View larger map” for full controls.
                        </p>
                      </div>

                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-2">Our Location</p>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Connecting Near and Far</h2>
                    
                      <div className="space-y-8">
                        <div>
                          <h3 className="font-bold text-gray-900 mb-3">Headquarters</h3>
                          <div className="space-y-2 text-gray-600">
                            <p className="font-semibold text-gray-900">FitLab Inc.</p>
                            <p>VRA 17</p>
                            <p>Mundur-Kottekad road, Viyyur</p>
                            <p>Thrissur, Kerala 680010</p>
                            <p>India</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </section>
                    

              
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-purple-600 to-purple-700 py-12 md:py-16 mt-12 md:mt-20"
              >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Still have questions?</h2>
                  <p className="text-purple-100 mb-8 text-lg">
                    Can't find the answer you're looking for? Please chat with our friendly team.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block bg-white text-purple-600 hover:bg-purple-50 font-semibold py-3 px-8 rounded-lg transition-colors"
                  >
                    Get in Touch
                  </motion.button>
                </div>
              </motion.section>
            </div>

        </main>
        <Footer/>
                
    </section>
  )
}

