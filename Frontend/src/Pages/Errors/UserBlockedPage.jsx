import React, {useState} from 'react'
import {motion} from "framer-motion"

import {Mail, Phone, MapPin, AlertTriangle} from "lucide-react"

import TextChatBox from '../../Pages/User/TextChatBox/TextChatBox'


export default function BlockedPage(){

  const [openChatBox, setOpenChatBox] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 dark:from-slate-900
     dark:via-red-950/20 dark:to-orange-950/20">

      <motion.main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-[25px] h-[25px] text-red-600 dark:text-red-400" />
                </div>
                <span className="text-[16px] text-red-600 dark:text-red-400 font-semibold text-lg"> Account Restricted </span>
              </div>

              <h1 className="text-[50px] md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-[0.7px] leading-tight">
                Access
                <span className="my-[10px] ml-[-2px] text-red-600 dark:text-red-400 block"> Temporarily </span>
                <span className="text-gray-600 dark:text-gray-300"> Blocked </span>
              </h1>

              <p className="text-[17px] text-gray-600 dark:text-gray-300 leading-relaxed">
                Your account has been temporarily suspended due to suspicious activity or violation of our terms of
                service.
              </p>
            </motion.div>

            <motion.div
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-red-100 dark:border-red-900/20"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4"> Why was my account blocked? </h2>
              <div className="space-y-3 text-[15px]">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Suspicious login attempts detected from multiple locations
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Potential violation of community guidelines or terms of service
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Your account behavior has been unusual
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-purple-50 dark:bg-purple-950/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-800/30"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4"> What happens next? </h2>
              <p className="text-gray-700 text-[15px] dark:text-gray-300 mb-4">
                Our security team will review your account within 24-48 hours. You can contact our admin team using the information shown or can chat with us right now.
              </p>
              <motion.button
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-[7px] font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={()=> setOpenChatBox(true)} 
              >
                Chat With Admin
              </motion.button>
            </motion.div>
          </div>

          <div className="space-y-8">
            <motion.div className="text-center" variants={itemVariants}>
              <motion.div animate="float" className="inline-block">
                <img
                  src="/Images/blocked.png"
                  alt="Access Denied Illustration"
                  className="w-full max-w-md mx-auto h-80 object-contain"
                />
              </motion.div>
            </motion.div>

            <motion.div
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-bold text-secondary dark:text-white mb-6 text-center">Contact Admin Team</h2>

              <div className="space-y-6">
                <motion.div
                  className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl"
                  whileHover={{ scale: 1.01 }}
                  transition={{ ease: 'easeInOut', duration: 0.1 }}
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Email Support</p>
                    <a href="mailto:admin@company.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                      fitlab0101@gmail.com
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ ease: 'easeInOut', duration: 0.1 }}
                >
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Phone Support</p>
                    <a href="tel:+1-555-0123" className="text-green-600 dark:text-green-400 hover:underline">
                      +91 9074688913
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ ease: 'easeInOut', duration: 0.1 }}
                >
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div> 
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Office Address</p>
                    <p className="text-purple-600 dark:text-purple-400">
                      Fitlab HQ
                      <br />
                      Viyyur Jn, Thrissur
                      <br />
                      Kerala, India (680010)
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800/30">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
                  <strong>Response Time:</strong> Our team typically responds within 24-48 hours. Please include your
                  account details when contacting us.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.main>

      <motion.footer
        className="bg-white/60 dark:bg-slate-900/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-white ">
            This restriction is temporary and subject to review. Thank you for your understanding and cooperation.
          </p>
        </div>
      </motion.footer>

    {
        openChatBox &&

        <div className="fixed bottom-[2rem] right-[2rem] z-50">
      
            <TextChatBox 
              openChats={true}
              closeable={true} 
              onCloseChat={()=> setOpenChatBox(false)}/>
              
        </div>
    }

    </div>
  )
}
