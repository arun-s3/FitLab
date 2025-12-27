import React from "react"
import { motion } from "framer-motion"

import {MapPin} from 'lucide-react'


export default function LocationInfo(){

  return (        
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
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Fitness support without boundaries</h2>

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

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      <a 
                        className="text-yellow-500 flex items-center gap-[7px]"
                        href="https://www.google.com/maps/dir/?api=1&destination=10.550784881690953,76.21072184298876"
                        target="_blank"
                        rel="noopener noreferrer"
                      > 
                        <MapPin className="w-5 h-5" />
                        Get Directions
                      </a>
                    </motion.button>
                  </div>
                </motion.div>
            </div>
        </div>
      </section>

  )
}

