import React, { useState } from "react"
import { motion } from "framer-motion" 

import {CustomHashLoader} from '../../../Components/Loader/Loader'


export default function UserActionBar({onUserConsent, loading, termsVersion, user}) {

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
          className='bg-gray-200 border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-6 sm:py-8'
          variants={buttonVariants}
          initial='hidden'
          animate='visible'>
          <div className='max-w-7xl ml-auto'>
              <div className='flex flex-col sm:flex-row gap-3 justify-end sm:gap-4 w-full sm:w-auto'>
                  <motion.button
                      onClick={() => {
                          setUserClickedOption("decline")
                          onUserConsent(false)
                      }}
                      className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-all 
                duration-300 active:scale-95 text-base border text-red-500 border-red-500 bg-red-50 hover:text-white hover:bg-red-700
                `}
                      whileTap={{ scale: 0.98 }}>
                      {loading && userClickedOption === "decline" ? <CustomHashLoader loading={loading} /> : "Decline"}
                  </motion.button>

                  {(!user || (user && !user?.hasAcceptedTerms && user?.termsVersion !== termsVersion)) && (
                      <motion.button
                          onClick={() => {
                              setUserClickedOption("accept")
                              onUserConsent(true)
                          }}
                          className='px-6 sm:px-8 py-2.5 min-h-12 sm:py-3 rounded-lg bg-teal-600 text-white font-semibold 
                        transition-all duration-300 hover:bg-teal-700 active:scale-95 text-base'
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}>
                          {loading && userClickedOption === "accept" ? (
                              <CustomHashLoader loading={loading} />
                          ) : (
                              "Agree and Continue"
                          )}
                      </motion.button>
                  )}
              </div>
          </div>
      </motion.div>
  )
}
