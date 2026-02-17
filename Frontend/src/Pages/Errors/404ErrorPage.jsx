import React from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {motion} from "framer-motion"

import {Home} from "lucide-react"


export default function ErrorPage404() {

  const navigate = useNavigate()

  const {admin} = useSelector(state=> state.admin)
  const {user} = useSelector(state=> state.user)
  
  const goToHome = ()=> {
    user && !user.isAdmin && !admin
        ?  user.isBlocked
        ?  navigate('/blocked', {
                    replace: true, 
                    state: {NoDirectAccesss: true}
                })
        : navigate('/', {replace: true})
        : admin && admin.isAdmin 
        ? navigate('/admin/dashboard/business', {replace: true})
        : navigate('/', {replace: true})
  }
  
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 bg-[#F9FADE] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${
              i % 4 === 0
                ? "w-4 h-4 bg-blue-200 rounded-full"
                : i % 4 === 1
                  ? "w-3 h-3 bg-teal-200 border border-teal-300"
                  : i % 4 === 2
                    ? "w-5 h-5 bg-cyan-200 rotate-45"
                    : "w-6 h-6 bg-sky-200 rounded-full border-2 border-sky-300"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="min-h-screen flex items-center justify-center px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="text-gray-600 text-lg font-medium mb-2">ERROR 404</p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 text-primaryDark mb-4">Page not found!</h1>
                <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
                  The page you're trying to access doesn't exist or has been removed.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={()=> goToHome()}
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-[10px] transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <Home className="w-5 h-5" />
                  Go Back Home
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.figure 
                className='ml-8 xs-sm:ml-0 w-[20rem] h-[8rem] xxs-sm:w-[25rem] xxs-sm:h-[8rem] xs-sm:w-[32rem] xs-sm:h-[12rem] sm:w-[35rem] sm:h-[16rem] lg:w-[32rem] lg:h-[12rem] x-lg:w-[37rem] x-lg:h-[16rem] lg:ml-[-2rem] x-lg:ml-[-5rem] xl:ml-0'
            >
                <motion.img alt='Error 403' 
                    src='/Images/404Error.png' 
                    className='w-full h-full'
                />
            </motion.figure>

          </div>
        </div>
      </div>
    </div>
  )
}
