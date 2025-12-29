import React, { useState } from "react"
import { motion } from "framer-motion" 

import {CustomHashLoader} from '../../../Components/Loader/Loader'


export default function UserActionBar({onUserConsent, loading, termsVersion, user}) {

  const [emailChecked, setEmailChecked] = useState(false)
  const [userClickedOption, setUserClickedOption] = useState(false)

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.3 },
    },
  }


  return (
      <motion.div
        className="bg-gray-200 border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <motion.label className="flex items-center gap-3 cursor-pointer group" whileHover={{ scale: 1.02 }}>
            <input
              type="checkbox"
              checked={emailChecked}
              onChange={(e) => setEmailChecked(e.target.checked)}
              className="w-5 h-5 rounded border-2 border-gray-300 cursor-pointer accent-teal-600 transition-colors duration-200"
            />
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
              Send a copy on my email
            </span>
          </motion.label>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <motion.button
              onClick={()=> {
                setUserClickedOption("decline")
                onUserConsent(false)
              }} 
              className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-all 
                duration-300 active:scale-95 text-base
                ${user && user?.hasAcceptedTerms && user?.termsVersion === termsVersion 
                    ? 'text-red-500 bg-red-50 hover:text-red-700' 
                    : 'text-teal-600 bg-none hover:text-teal-700 '
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
                {
                    loading && userClickedOption === 'decline' ? <CustomHashLoader loading={loading} /> : "Decline"
                }
            </motion.button>

            {
                !user || (user && !user?.hasAcceptedTerms && user?.termsVersion !== termsVersion) &&
                    
                    <motion.button
                      onClick={()=> {
                        setUserClickedOption("accept")
                        onUserConsent(true)
                      }}
                      className="px-6 sm:px-8 py-2.5 min-h-12 sm:py-3 rounded-lg bg-teal-600 text-white font-semibold 
                        transition-all duration-300 hover:bg-teal-700 active:scale-95 text-base"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                        {
                            loading && userClickedOption === 'accept' ? <CustomHashLoader loading={loading}/> : "Agree and Continue"
                        }
                    </motion.button>
            }
            
          </div>
        </div>
      </motion.div>
  )
}
