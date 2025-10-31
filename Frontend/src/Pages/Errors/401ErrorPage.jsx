import React from 'react'
import {useNavigate} from "react-router-dom"
import {useSelector} from 'react-redux'
import {motion} from "framer-motion"

import {Home, Headset, ArrowLeft} from "lucide-react"


export default function ErrorPage401() {

  const navigate = useNavigate()

  const {user} = useSelector(state=> state.user)

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
    },
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center
     px-4 sm:px-6 lg:px-8">
      <motion.div className="max-w-4xl w-full" 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
                className="relative hidden lg:inline-block"
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.img
                src="/Error401Img.png"
                className="w-80 h-80 sm:w-96 sm:h-96 object-contain"
                crossOrigin="anonymous"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

          <motion.div className="space-y-8 text-center lg:text-left order-1 lg:order-2">
            <motion.div variants={itemVariants} 
              className='flex items-center justify-center flex-row-reverse gap-4 lg:inline-block'
            >
              <h1 className="text-8xl sm:text-9xl font-black text-transparent bg-gradient-to-r from-purple-500 to-purple-600
               bg-clip-text tracking-tight">
                401
              </h1>
              <motion.img
                src="/Error401Img3.png"
                className="w-[6rem] h-[6rem] sm:w-[8rem] sm:h-[8rem] inline-block lg:hidden"
                crossOrigin="anonymous"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-balance leading-tight">
                Oops! Access Denied
              </h2>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="text-gray-600 text-[16px] leading-relaxed text-pretty max-w-md mx-auto lg:mx-0">
                You don't have the right permissions to view this page. Please check your credentials or contact your
                administrator for access.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center pt-6"
              variants={itemVariants}
            >
              <motion.button
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold focus:outline-none text-white
                  bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all
                    duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto border-nonw"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={()=> navigate(-1, {replace: true})}
              >
                <ArrowLeft className="h-5 w-5" />
                Go Back
              </motion.button>

              <motion.button
                className="inline-flex items-center gap-2 bg-white text-gray-700 border-2 border-gray-200 px-8 py-4
                  rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2
                  focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg w-full sm:w-auto"
                variants={buttonVariants}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={()=> user && user.isBlocked ? navigate('/blocked', {replace: true}) : navigate('/', {replace: true})}
              >
                <Home className="h-5 w-5" />
                Return Home
              </motion.button>
            </motion.div>

            <motion.div variants={itemVariants} className="">
              <motion.button
                className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors text-sm font-medium"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={()=>  navigate('/support', {replace: true})}
              >
                <Headset className="h-4 w-4" />
                Need help? Contact Support
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="pt-16 mt-16 border-t border-gray-200 text-center">
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-gray-500">
            <motion.a
              href="/privacy"
              className="hover:text-purple-500 transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
            >
              Privacy Policy
            </motion.a>
            <span className="hidden sm:inline text-gray-300">•</span>
            <motion.a
              href="/terms"
              className="hover:text-purple-500 transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
            >
              Terms of Service
            </motion.a>
            <span className="hidden sm:inline text-gray-300">•</span>
            <motion.a
              href="/help"
              className="hover:text-purple-500 transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
            >
              Help Center
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
