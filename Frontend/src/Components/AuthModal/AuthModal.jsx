import React, {useEffect, useRef} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import {motion, AnimatePresence} from "framer-motion"

import {X, Lock, ArrowRight, UserPlus} from "lucide-react"

import useModalHelpers from '../../Hooks/ModalHelpers'



export default function AuthModal({isOpen, onClose, accessFor = "this feature"}){

    const navigate = useNavigate()
    const currentLocation = useLocation()

    const modalRef = useRef(null)
    useModalHelpers({open: isOpen, onClose, modalRef})

    const handleSignIn = () => {
        navigate('/signin', {replace: true, state: {currentPath: currentLocation.pathname}})
        onClose()
    }

    const handleSignUp = () => {
        navigate('/signup', {replace: true, state: {currentPath: currentLocation.pathname}})
        onClose()
    }   

    useEffect(()=> {
      console.log("Is AuthModal Open------------>", isOpen)
    }, [isOpen])


    return (

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            ref={modalRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
            onClick={onClose}
          >

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className="relative w-full max-w-md bg-whitesmoke border border-primary rounded-[9px] shadow-2xl overflow-hidden
               backdrop-blur-sm"
              onClick={(e)=> e.stopPropagation()}
            >
              <div className="absolute inset-0 bg-neutral-900 bg-gradient-to-br from-neutral-700 via-neutral-800 to-[#2c0f4a] pointer-events-none -z-10" />

              <div className="relative px-8 pt-10 pb-6">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground transition-colors
                    rounded-full hover:bg-gray-200 group"
                >
                  <X size={20} className="group-hover:rotate-90 text-muted transition-transform duration-200" />
                </button>   
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-4 text-center"
                >
                  <div className="flex justify-center items-center gap-[10px]">
                    <div className="p-3  rounded-2xl">
                      <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <img src="/Logo_main.png" alt="Fitlab" className="mt-[7px] h-[5rem] "/>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl text-white font-bold text-foreground tracking-[0.7px]"> Welcome to Fitlab </h2>
                    <p className="text-white text-[15px] leading-relaxed">
                      You need to sign in to access {accessFor}. Join thousands of users enjoying our platform.
                    </p>
                  </div>
                </motion.div>
              </div>    

              <div className="px-8 pb-12 space-y-4">
                <motion.button
                  onClick={handleSignIn}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold py-[13px] px-6 
                    rounded-[7px] transition-all duration-200 focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-lg 
                    hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  Sign In to Continue
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                </motion.button>    
                <div className="relative my-6">
                  <div className='w-full flex justify-center items-center'>
                    <div className='w-[45%] h-[1px] border-t border-dashed border-whitesmoke'></div>
                    <span className="px-[10px] text-primary font-medium"> or </span>
                    <div className='w-[45%] h-[1px] border-t border-dashed border-whitesmoke'></div>
                  </div>
                </div>  
                <motion.button
                  onClick={handleSignUp}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="w-full flex items-center justify-center px-6 py-[13px] rounded-[7px]
                     text-foreground text-white bg-purple-600 hover:bg-purple-700 transition-all duration-200 font-medium
                     shadow-sm hover:shadow-md gap-2 group"
                >
                  <UserPlus size={19} className="text-whitesmoke group-hover:rotate-6 transition-transform duration-200" />
                  Create New Account
                </motion.button>    
                <div className="mt-6 text-center">
                  <p className="text-[12px] text-inputBgSecondary leading-relaxed">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    )
}
