import React, { useState } from "react"
import { motion } from "framer-motion"


export default function PrivacyTopicsSection({privacyPolicies, activeSectionIndex, onClickSection}) {

  const sidebarItemVariants = {
    hover: { x: 4, transition: { duration: 0.2 } },
  }


  return (
        <motion.aside
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:w-64 flex-shrink-0"
        >
            <nav className="sticky top-12">
                <ul className="space-y-2">
                    {privacyPolicies.map((section, index) => {
                        const isActive = index === activeSectionIndex
                        const Icon = section.icon   
                        return (
                            <motion.li key={section.id} variants={sidebarItemVariants}>
                                <motion.button
                                    onClick={() => onClickSection(index)}
                                    whileHover="hover"
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 
                                        flex items-center gap-3 ${
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
  )
}
