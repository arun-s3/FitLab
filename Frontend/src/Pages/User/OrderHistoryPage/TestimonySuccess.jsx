import React, {useEffect} from 'react'
import {motion} from 'framer-motion'

import {Star} from 'lucide-react'


export default function TestimonySuccess({onTimeout}){

    useEffect(()=> {
        setTimeout(()=> onTimeout(), 5000)
    }, [])

    const containerVariants = {
       hidden: { opacity: 0, y: -20 },
       visible: {
         opacity: 1,
         y: 0,
         transition: { duration: 0.5, ease: "easeOut" },
       },
       exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
     }  

     const successVariants = {
       hidden: { opacity: 0, scale: 0.8 },
       visible: {
         opacity: 1,
         scale: 1,
         transition: { duration: 0.5, ease: "easeOut" },
       },
     }


     return(
        
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="m-8 bg-gradient-to-r from-purple-50 to-purple-50 border-l-4 border-purple-400 rounded-lg p-4 shadow-lg"
        >
            <div className="flex items-center gap-3 md:gap-4">
              <motion.div variants={successVariants} initial="hidden" animate="visible">
                <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                  <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ duration: 0.8, ease: "easeOut" }}>
                    <Star className="w-8 h-8 md:w-11 md:h-11 text-purple-500 fill-purple-500" />
                  </motion.div>
                </div>
              </motion.div>
              <div className="flex-1">
                <p className="text-sm md:text-base font-bold text-gray-800">Thank you for your feedback!</p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">Your feedback helps us deliver better experiences</p>
              </div>
            </div>
        </motion.div>
     )
}