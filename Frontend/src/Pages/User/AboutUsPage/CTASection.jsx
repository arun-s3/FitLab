import React, {useRef} from "react"
import {useNavigate} from 'react-router-dom'
import { motion, useInView } from "framer-motion"

import { ArrowRight } from "lucide-react"


export default function CTASection() {

    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })

    const navigate = useNavigate()

    return (
      <section ref={ref} className="pb-10 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-12 text-white text-center"
          >
            <h3 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h3>
            <p className="text-lg mb-8 text-orange-100">
              Join thousands of members who have transformed their fitness with FitLab
            </p>
            <button 
                onClick={()=> setTimeout(navigate('/signup'), 500)}
                className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-full font-semibold hover:bg-orange-50 transition-colors">
              Get Started Today
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>
    )
}
