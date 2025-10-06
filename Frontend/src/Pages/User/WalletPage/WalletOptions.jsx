import React from "react"
import './WalletPage.css'
import {motion} from 'framer-motion'

import { CloudLightningIcon as Lightning, PlusCircle, Tag, Users} from "lucide-react"


export default function WalletOptions({onClickFunding, onClickAutoRecharge}) {

    const walletActionButtons = [
      {name: 'Add Money', Icon: PlusCircle, clickHandler: ()=> onClickFunding()},
      {name: 'Auto-recharge', Icon: Lightning, clickHandler: ()=> onClickAutoRecharge()},
      {name: 'Wallet-only deals', Icon: Tag},
      {name: 'Refer', Icon: Users}
    ]

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2, delayChildren: 0.5 }
      }
    }

    const itemVariants = {
      hidden: { opacity: 0, y: 15, scale: 0.95 },
      visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 70 } },
      hover: { scale: 1.05, y: -3, transition: { type: "spring", stiffness: 300 } },
      tap: { scale: 0.97 }
    }

  
  return (
    
    <motion.div
      className="grid grid-cols-2 t:grid-cols-1 mob:grid-cols-2 s-sm:grid-cols-3 md:grid-cols-4 
        lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-3 mob:gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {walletActionButtons.map((button)=> (
        <motion.div
          key={button.name}
          variants={itemVariants}
          whileHover="hover"
          whileTap="tap"
          className={`h-[4.2rem] mob:h-[4.5rem] flex flex-col items-center justify-around py-[6px] mob:py-[7px] 
            text-muted bg-whitesmoke rounded-[6px] border border-dropdownBorder cursor-pointer
            hover:shadow-md hover:text-primaryDark transition-all duration-200
            ${button.name === "Add Money" ? "text-primaryDark" : "text-muted"}
            ${button.name === "Wallet-only deals" && "col-span-2 s-sm:col-span-1 w-full xl:w-fit xx-xl:w-full ml-0 xl:ml-[-4px] xx-xl:ml-0"} 
            ${button.name === "Auto-recharge" && "w-auto xl:w-fit x-xl:w-auto ml-0 xl:ml-[-4px] x-xl:ml-0"} 
            ${button.name === "Refer" && "ml-0 w-auto mob:w-[207%] s-sm:w-auto md:w-auto lg:w-[330%] xl:w-auto xl:ml-[8px] x-xl:ml-0"} 
          `}
          onClick={()=> button.clickHandler()}
        >
          <motion.div layout>
            <button.Icon
              className={`t:h-[1rem] t:w-[1rem] mob:h-[1.2rem] mob:w-[1.2rem] x-sm:h-[1.3rem] x-sm:w-[1.3rem]
                ${button.name === "Add Money" ? "text-primaryDark" : "text-muted"}`}
            />
          </motion.div>

          <motion.span
            className={`t:text-[11px] mob:text-[12px] x-sm:text-[13px] text-inherit font-medium whitespace-nowrap
              ${button.name !== "Wallet-only deals" && button.name !== "Auto-recharge" 
                ? "tracking-[0.3px]" 
                : button.name == "Auto-recharge"
                ? "xl:text-[12px] x-xl:text-[13px]"
                : button.name === "Wallet-only deals"
                ? "lg:text-[12px] deskt:text-[13px]"
                : null
              }
              ${button.name === "Add Money" ? "text-muted" : "text-inherit"}
            `}
          >
            {button.name}
          </motion.span>
        </motion.div>
      ))}
    </motion.div>
  )
}
