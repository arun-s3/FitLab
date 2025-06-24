import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

import {Plus, Minus} from "lucide-react"

import FaqDatas from './FaqDatas'
import ContactUsModule from "./ContactUsModule"


export default function FaqSection() {

  const [selectedTopic, setSelectedTopic] = useState("Strength Equipment")
  const [openQuestion, setOpenQuestion] = useState(null)
  const [hoveredTopic, setHoveredTopic] = useState(null)
  const [hoveredQuestion, setHoveredQuestion] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 180, y: 210 })
  const [searchQuery, setSearchQuery] = useState("")

  const faqContainerRef = useRef(null)

  const [faqData, setFaqData] = useState(null)


  useEffect(()=> {
    if(FaqDatas){
        const faqDataObj = FaqDatas()
        setFaqData(faqDataObj)
    }
  }, [FaqDatas])

  useEffect(()=> {
    console.log("faqData--->",faqData)
  },[faqData])

  const faqContainerEffectStyle = {
    background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,1)))'
  }

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index)
  }

  const handleMouseMove = (e) => {
    if (faqContainerRef.current) {
      const rect = faqContainerRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  return (
    <div className="min-h-screen bg-white">

      <div className="relative">

        {/* Torn Paper Effect at Top - More detailed and precise */}
        {/* <div className="relative z-10">
          <svg className="w-full h-16 text-black" viewBox="0 0 1200 60" preserveAspectRatio="none" fill="currentColor">
            <path d="M0,60 C50,45 100,55 150,40 C200,25 250,50 300,35 C350,20 400,45 450,30 C500,15 550,40 600,25 C650,10 700,35 750,20 C800,5 850,30 900,15 C950,0 1000,25 1050,10 C1100,5 1150,20 1200,5 L1200,0 L0,0 Z" />
          </svg>
        </div> */}
        <div className="relative z-10" style={faqContainerEffectStyle}>
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-8 md:h-12 lg:h-16 fill-black block"
          >
            <path d="M0,0 L48,8 L96,3 L144,12 L192,5 L240,15 L288,2 L336,18 L384,7 L432,22 L480,4 L528,16 L576,9 L624,25 L672,6 L720,19 L768,11 L816,28 L864,8 L912,21 L960,13 L1008,30 L1056,10 L1104,24 L1152,14 L1200,32 L1200,120 L0,120 Z" />
          </svg>
        </div>

      {/* <div className="w-full h-4 bg-black backdrop-blur filter-blur-[1px]"></div> */}

        <div ref={faqContainerRef} className="-mt-[3px] pb-8 bg-black relative overflow-hidden" onMouseMove={handleMouseMove}>
          {/* Base grid - more visible */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `
                linear-gradient(rgba(75, 85, 99, 0.7) 1px, transparent 1px),
                linear-gradient(90deg, rgba(75, 85, 99, 0.7) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Interactive grid overlay with mouse-following glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, 
                  rgba(168, 85, 247, 0.4) 0%, 
                  rgba(168, 85, 247, 0.2) 30%, 
                  transparent 70%
                )
              `,
              opacity: 0.6,
            }}
          />

          <div className="flex gap-4">
          <div className="relative z-10 container mx-auto px-4 pt-0 pb-12">
            {/* Header */}
            
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="pl-4 text-left mb-12"
            >
              <h1 className="text-[30px] font-bold text-white">
                Frequently
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-purple-700">
                  {" "}
                  Asked Questions
                </span>
              </h1>
              <p className="text-gray-300 text-[13px] max-w-3xl">
                Welcome to our FAQ section, where you'll find answers to all your burning questions about our gym and
                fitness services!
              </p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Simple Sidebar - matching the image */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                className="lg:w-1/4"
              >
                <div className="sticky top-8">
                  <div className="space-y-2">
                    {
                    faqData &&
                    Object.entries(faqData).map(([topic, data]) => {
                      const isSelected = selectedTopic === topic
                      const isHovered = hoveredTopic === topic

                      return (
                        <motion.button
                          key={topic}
                          className={`block w-full text-left py-2.5 px-4 rounded-lg transition-all duration-200 text-[13px] ${
                            isSelected
                              ? "text-purple-400 bg-purple-500/10"
                              : isHovered
                                ? "text-purple-300 bg-purple-500/5"
                                : "text-gray-400 hover:text-gray-300"
                          }`}
                          onClick={() => setSelectedTopic(topic)}
                          onMouseEnter={() => setHoveredTopic(topic)}
                          onMouseLeave={() => setHoveredTopic(null)}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {topic}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              </motion.div>

              {/* FAQ Content */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                className="lg:w-3/4 space-y-6"
              >
                {/* Section Header */}
                <div className="mb-6">
                  <h2 className="text-[17px] font-semibold text-white mb-2 flex items-center gap-3">
                    <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                      <div className="w-2 h-2 bg-purple-400 rounded-sm"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-sm"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-sm"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-sm"></div>
                    </div>
                    {selectedTopic} Questions
                  </h2>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedTopic}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="space-y-3"
                  >
                    {
                    faqData &&
                    faqData[selectedTopic].questions.map((faq, index) => {
                      const isOpen = openQuestion === index
                      const isHovered = hoveredQuestion === index

                      return (
                        <motion.div
                          key={index}
                          className="relative"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          onMouseEnter={() => setHoveredQuestion(index)}
                          onMouseLeave={() => setHoveredQuestion(null)}
                        >
                          {/* Question box with lighting effect */}
                          <motion.div
                            className="relative rounded-xl overflow-hidden bg-black"
                            animate={{
                              borderTop:
                                isHovered || isOpen
                                  ? "2px solid rgba(168, 85, 247, 0.8)"
                                  : "2px solid rgba(168, 85, 247, 0.3)",
                              borderLeft:
                                isHovered || isOpen
                                  ? "2px solid rgba(168, 85, 247, 0.8)"
                                  : "2px solid rgba(168, 85, 247, 0.3)",
                              borderRight:
                                isHovered || isOpen
                                  ? "2px solid rgba(168, 85, 247, 0.8)"
                                  : "2px solid rgba(168, 85, 247, 0.3)",
                              borderBottom:
                                isHovered || isOpen
                                  ? "2px solid rgba(168, 85, 247, 0.2)"
                                  : "2px solid rgba(168, 85, 247, 0.1)",
                            }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                          >
                            {/* Question button with top lighting */}
                            <motion.button
                              className="w-full p-4 text-left relative"
                              onClick={() => toggleQuestion(index)}
                              style={{
                                backgroundImage:
                                  isHovered || isOpen
                                    ? "linear-gradient(180deg, rgba(168, 85, 247, 0.15) 0%, rgba(0, 0, 0, 1) 100%)"
                                    : "linear-gradient(180deg, rgba(168, 85, 247, 0.05) 0%, rgba(0, 0, 0, 1) 100%)",
                              }}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <div className="flex justify-between items-center">
                                <h3 className="text-[14px] text-white pr-4">{faq.question}</h3>
                                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                  {isOpen ? (
                                    <Minus className="w-5 h-5 text-primary" />
                                  ) : (
                                    <Plus className="w-5 h-5 text-primary" />
                                  )}
                                </motion.div>
                              </div>
                            </motion.button>

                            {/* Answer section */}
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2, ease: "easeOut" }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-4 bg-black border-t border-purple-500/20">
                                    <p className="text-[12px] text-gray-300 leading-relaxed">{faq.answer}</p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>

          </div> 

            <ContactUsModule/>

          </div> {/* neww */}

        </div>
      </div>
    </div>
  )
}
