import React, {useState} from 'react'
import { motion } from "framer-motion"


export default function TermsDisclaimer({startWith, fontSize, style, acknowledgeStatementEndsWith, checkboxType = false, onChecked,
  acknowledgementStyle
}){

    const [acknowledged, setAcknowledged] =  useState(false)


    return (
        <>
            {
                !checkboxType 
                    ?
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                      className={` ${fontSize ? `text-[${fontSize}]` : 'text-xs'} text-gray-500 text-center ${style ? style : ''}`}
                    >
                      {`${startWith ? startWith : 'By contacting us'}, you agree to Fitlab's`}
                      <a href="/terms" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-secondary hover:underline decoration-secondary transition duration-150 underline-offset-2"
                      >
                        {" "}Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-secondary hover:underline decoration-secondary transition duration-150 underline-offset-2"
                      >
                        Privacy Policy
                      </a>
                    </motion.p>
                    :
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                      className={` flex items-start ${style ? style : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={acknowledged} 
                        onChange={(e) => {
                            setAcknowledged(e.target.checked)
                            onChecked(e.target.checked)
                        }}
                        className="w-[15px] h-[15px] rounded border-2 border-gray-300 cursor-pointer text-secondary
                            transition-colors duration-200 focus:ring-2 focus:ring-secondary"
                      />
                      <p className={` ${fontSize ? `text-[${fontSize}]` : 'text-xs'} text-gray-500 text-center 
                        ${acknowledgementStyle ? acknowledgementStyle : ''}`}
                      >
                        {`${startWith ? startWith : "I agree to Fitlab's"}`}
                        <a href="/terms" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-secondary hover:underline decoration-secondary transition duration-150 underline-offset-2"
                        >
                          {" "}Terms & Conditions
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-secondary hover:underline decoration-secondary transition duration-150 underline-offset-2"
                        >
                          Privacy Policy
                        </a>
                        {" "}
                        {acknowledgeStatementEndsWith}
                      </p>
                    </motion.p>

            }
        </>
        
    )
}