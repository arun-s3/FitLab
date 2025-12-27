import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"

import {ChevronDown} from "lucide-react"

import FaqDatas from "../../../../data/FaqDatas"


export default function FaqSection(){

  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null)
  const [activeCategory, setActiveCategory] = useState("Strength Equipment")

  const [faqData, setFaqData] = useState(null)
  const [currentFaqCategory, setCurrentFaqCategory] = useState(null)

  useEffect(()=> {
    if(FaqDatas){
        const faqDataObj = FaqDatas()
        setFaqData(faqDataObj)
    }
  }, [FaqDatas])

  useEffect(()=> {
    if(faqData && activeCategory){
        console.log("faqData[activeCategory]----->", faqData[activeCategory])
        setCurrentFaqCategory(faqData[activeCategory])
    }
  }, [faqData, activeCategory])

  const toggleFaq = (index) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index)
  }


  return (
        <section className="max-w-[83rem] mb-20 bg-[#f3eff7] rounded-[16px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-2">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Do you have any questions for us?</h2>
            <p className="text-gray-600">Quick answers to common questions about FitLab and all its features</p>
          </motion.div>
              
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2 md:gap-3 mb-8 overflow-x-auto pb-2"
          >
            {
              faqData &&
                Object.keys(faqData).map((category) => {
                  const CategoryIcon = faqData[category].icon
                  return (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setActiveCategory(category)
                        setExpandedFaqIndex(null)
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
                        activeCategory === category
                          ? "bg-purple-600 text-white shadow-lg"
                          : "bg-white text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <CategoryIcon className="w-4 h-4 text-primaryDark" />
                      <span className="hidden sm:inline text-[15px]">{category}</span>
                    </motion.button>
                  )
                })
            }
          </motion.div>
        
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            {
              faqData && currentFaqCategory &&
                currentFaqCategory.questions.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-white border border-gray-200 rounded-[12px] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <motion.button
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-6 py-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors"
                      whileHover={{ backgroundColor: "#f9fafb" }}
                    >
                      <span className="text-left font-semibold text-gray-900 text-sm md:text-base">{item.question}</span>
                      <motion.div
                        animate={{ rotate: expandedFaqIndex === idx ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      </motion.div>
                    </motion.button>
                
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: expandedFaqIndex === idx ? 1 : 0,
                        height: expandedFaqIndex === idx ? "auto" : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))
            }
          </motion.div>
        </section>
  )
}

