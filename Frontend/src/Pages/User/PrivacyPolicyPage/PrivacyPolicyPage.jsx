import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import PrivacyPolicies from "../../../../data/PrivacyPolicies"
import Header from "../../../Components/Header/Header"
import Footer from "../../../Components/Footer/Footer"


export default function PrivacyPolicyPage() {

  const [activeSection, setActiveSection] = useState(0)

  const lastUpdated = "28 December 2025" ;

  const activeSectionData = PrivacyPolicies[activeSection]

  const fadeInOut = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4, ease: "easeInOut" },
  }

  const sidebarItemVariants = {
    hover: { x: 4, transition: { duration: 0.2 } },
  }

  return (
    <section id='PrivacyPolicyPage'>
    
        <header className='h-[5rem] bg-gradient-to-r from-purple-600 to-purple-800'>

          <Header lighterLogo={true} pageChatBoxStatus={true}/>

        </header>

        <div className="w-full min-h-screen bg-gradient-to-b from-white to-gray-50">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-r from-purple-600 to-purple-800 text-white pt-12 pb-20 px-6 md:px-12"
          >
            {/* Curved Bottom */}
            <svg
              className="absolute bottom-0 left-0 w-full h-24 text-white"
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
            >
              <path fill="currentColor" d="M0,40 Q360,80 720,80 T1440,40 L1440,120 L0,120 Z" />
            </svg>

            {/* Content */}
            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl font-bold mb-4 text-white"
              >
                Privacy Policy
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[15px] text-purple-100"
              >
                {`Last updated: ${lastUpdated}`}
              </motion.p>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-6 md:px-12 py-12 gap-8 lg:gap-12">
            {/* Sidebar Navigation */}
            <motion.aside
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-64 flex-shrink-0"
            >
              <nav className="sticky top-12">
                <ul className="space-y-2">
                  {PrivacyPolicies.map((section, index) => {
                    const isActive = index === activeSection
                    const Icon = section.icon

                    return (
                      <motion.li key={section.id} variants={sidebarItemVariants}>
                        <motion.button
                          onClick={() => setActiveSection(index)}
                          whileHover="hover"
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3 ${
                            isActive
                              ? "text-purple-700 font-semibold bg-purple-50"
                              : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                          }`}
                        >
                          <Icon size={20} className={`flex-shrink-0 ${isActive ? "text-purple-600" : "text-gray-400"}`} />
                          <span className="text-sm md:text-base">{section.title}</span>
                        </motion.button>
                        {isActive && (
                          <motion.div
                            layoutId="underline"
                            className="h-1 bg-purple-600 rounded-full mt-1"
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </motion.li>
                    )
                  })}
                </ul>
              </nav>
            </motion.aside>

            {/* Main Content */}
            <motion.main
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1 lg:min-h-screen"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  variants={fadeInOut}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12"
                >
                  {/* Section Title */}
                  <motion.div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      {activeSectionData.icon && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                          className="p-3 bg-purple-100 rounded-lg"
                        >
                          <activeSectionData.icon size={24} className="text-purple-600" />
                        </motion.div>
                      )}
                      <h2 className="text-4xl font-bold text-purple-700 tracking-[0.9px]">{activeSectionData.title}</h2>
                    </div>
                    <motion.div
                      layoutId="contentUnderline"
                      className="w-16 h-1 bg-purple-600 rounded-full"
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>

                  {/* Section Content */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4"
                  >
                    {activeSectionData.content.split("\n").map(
                      (paragraph, idx) =>
                        paragraph.trim() && (
                          <motion.p
                            key={idx}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.2 + idx * 0.05,
                            }}
                            className="text-base text-gray-600 leading-8"
                          >
                            {paragraph.trim()}
                          </motion.p>
                        ),
                    )}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </motion.main>
          </div>
        </div>
        
        <Footer/>

    </section>
  )
}
