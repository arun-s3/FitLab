import React, {useState, useEffect} from 'react'
import {AnimatePresence, motion} from 'framer-motion'

import Header from '../../../Components/Header/Header'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import OrderCompletedSummary from './OrderCompletedSummary'
import FeaturesDisplay from '../../../Components/FeaturesDisplay/FeaturesDisplay'
import Footer from '../../../Components/Footer/Footer'


export default function OrderConfirmationPage(){

  const [showCelebration, setShowCelebration] = useState(true)

  useEffect(()=> {
    if(showCelebration){
      setTimeout(()=> setShowCelebration(false), 3500)
    }
  }, [showCelebration])

  const headerBg = {
    backgroundImage: "url('/header-bg.png')",
    backgrounSize: 'cover'
  }

  return (

    <section id="OrderConfirmationPage">

      <header style={headerBg} className="h-[5rem]">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Header />
        </motion.div>
      </header>

      <BreadcrumbBar heading="Order Confirmation" />

      <main className="mb-[7rem]">
        <motion.div 
          className="min-h-screen bg-white"
          initial={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{ease: 'easeIn'}}
          >
          <AnimatePresence>
            {showCelebration &&
              <div className="absolute inset-0 pointer-events-none">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute ${
                        i % 4 === 0
                          ? "w-4 h-4 bg-yellow-200 rounded-full"
                          : i % 4 === 1
                            ? "w-3 h-3 bg-purple-200 border border-purple-300"
                            : i % 4 === 2
                              ? "w-5 h-5 bg-yellow-400 rotate-45"
                              : "w-6 h-6 bg-green-200 rounded-full border-2 border-green-300"
                      }`}
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      initial={{opacity: 0.5}}
                      animate={{
                        opacity: 1,
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
              }
            </AnimatePresence>

            <OrderCompletedSummary />

        </motion.div>
      </main>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <FeaturesDisplay />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Footer />
      </motion.div>

    </section>
  )
}


