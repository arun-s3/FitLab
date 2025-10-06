import React from 'react'
import {motion} from 'framer-motion'

import {Plus, CreditCard, Download} from "lucide-react"


export default function WalletUtilitySection({membershipCredits}){

    const containerVariants = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.25, 
        },
      },
    }

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
  }


    return(
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mx-[1.5rem] flex flex-col mob:flex-col s-sm:flex-col md:flex-row justify-between gap-[1rem]"
        >
          <motion.div
            variants={cardVariants}
            className="rounded-lg border bg-card text-card-foreground shadow-sm flex-1 min-w-[250px]"
          >
            <div className="flex flex-col space-y-1.5 p-6 pb-2">
              <p className="text-sm text-muted-foreground"> Membership Credits </p>
              <h3 className="text-4xl text-secondary font-bold"> {membershipCredits} </h3>
            </div>
            <div className="p-6 pt-0">
              <p className="text-sm text-muted-foreground">
                Use credits for class bookings or personal training sessions
              </p>
            </div>
            <div className="flex items-center p-6 pt-0">
              <button
                className="inline-flex items-center justify-center rounded-md text-sm font-medium
                 border border-primary bg-background hover:bg-primary hover:text-accent-foreground h-9 px-3 
                 transition-colors duration-200"
              >
                <Plus className="mr-2 h-3 w-3 text-secondary" />
                Buy Credits
              </button>
            </div>
          </motion.div>
        
          <motion.div
            variants={cardVariants}
            className="rounded-lg border bg-card text-card-foreground shadow-sm flex-1 min-w-[250px]"
          >
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-[20px] font-semibold leading-none tracking-tight">Quick Actions</h3>
            </div>
            <div className="p-6 pt-0 mt-[10px] mb-[1px] grid gap-[1rem]">
              <button
                className="inline-flex items-center justify-start rounded-md text-[12px] mob:text-[13px] xxs-sm:text-sm
                 text-muted font-medium border border-input bg-background hover:bg-whitesmoke hover:text-primaryDark 
                  h-10 px-4 py-2 w-full transition-colors duration-200"
              >
                <CreditCard className="mr-2 h-4 w-4 text-secondary" />
                Manage Payment Methods
              </button>
        
              <button
                className="inline-flex items-center justify-start rounded-md text-[12px] mob:text-[13px] xxs-sm:text-sm
                 text-muted font-medium border border-input bg-background hover:bg-whitesmoke hover:text-primaryDark
                  h-10 px-4 py-2 w-full transition-colors duration-200"
              >
                <Download className="mr-2 h-4 w-4 text-secondary" />
                Download Statement
              </button>
            </div>
          </motion.div>
        </motion.section>

    )
}