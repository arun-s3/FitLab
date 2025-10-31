import React, {useState, useEffect} from "react"
import './WalletPage.css'
import {useSelector} from 'react-redux'
import {motion} from 'framer-motion'

import {Eye, EyeOff} from "lucide-react"
import {toast as sonnerToast} from 'sonner'

import {decryptData} from '../../../Utils/decryption'


export default function WalletCard({children}) {

    const [wallet, setWallet] = useState({})
    const [firstTimeUser, setFirstTimeUser] = useState(false)

    const [message, setMessage] = useState('')

    const [showAcNumber, setShowAcNumber] = useState(false)
    const [hiddenAccountNo, setHiddenAccountNo] = useState('')

    const {safeWallet, walletMessage} = useSelector(state=> state.wallet)
    const {user} = useSelector((state)=>state.user)


    useEffect(()=> {
      if(safeWallet && Object.keys(safeWallet).length > 0){
        console.log("Got safeWallet--->", safeWallet)
        setWallet(safeWallet)
        const decryptedWallet = decryptData(safeWallet)
        console.log("decryptedWallet--->", decryptedWallet)
        const hiddenAcNo = "FTL **** ****" + " " + decryptedWallet?.accountNumber?.slice(11)
        setHiddenAccountNo(hiddenAcNo)
        }
      if(walletMessage && walletMessage?.includes('created')){
        console.log('Its a First time user!')
        setFirstTimeUser(true)
        setMessage("Welcome to FitLab Wallet! Your unique account number:")
        sonnerToast.success("A new FitLab Account has been created for you!")
      }
    },[safeWallet, walletMessage])

    useEffect(()=> {
      console.log('message--->', message)
      console.log('firstTimeUser--->', firstTimeUser)
      if(message){
        if(firstTimeUser && message && message.toLowerCase().includes('welcome to fitlab wallet')){
          setTimeout(()=> setMessage(''), 4000)
        }
      }
    },[message, firstTimeUser])

    const formatAccountNumber = (number)=> {
      const numbersOnly = number.slice(3)
      console.log("Acc no now--->",numbersOnly)
      let num = ''
      for(let i=0; i<numbersOnly.length; i++){
        if( (i+1) % 4 === 0 && i+1 !== numbersOnly.length ){
          num += numbersOnly[i] + ' '
        }else{
          num += numbersOnly[i]
        }
      }
      return 'FTL' + ' ' + num
    }


  return (
    <motion.div
      className="bg-white shadow-sm rounded-lg"
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 90,
        damping: 15,
        duration: 0.6,
      }}
    >
      <div className="relative p-4 mob:p-5 x-sm:p-6">
        <motion.p
          className="absolute top-0 left-2 t:text-[9px] mob:text-[10px] x-sm:text-[11px] text-green-600 tracking-[0.3px]"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {firstTimeUser && message?.toLowerCase().includes("welcome to fitlab wallet") && message}
          <span className="ml-[5px] font-bold text-secondary block mob:inline">
            {firstTimeUser &&
              message?.toLowerCase().includes("welcome to fitlab wallet") &&
              decryptData(safeWallet)?.accountNumber}
          </span>
        </motion.p>

        <motion.div
          className="relative bg-gradient-to-r from-purple-500 to-purple-700 rounded-xl p-4 mob:p-5 text-white mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
          whileHover={{
            scale: 1.02,
            boxShadow: "0px 6px 18px rgba(139, 92, 246, 0.35)",
          }}
        >
          <div className="mb-1 t:text-[10px] mob:text-xs opacity-80">Total Balance</div>

          <motion.img
            src="/Logo_main_light1.png"
            alt="Fitlab"
            className="absolute bottom-[-12px] right-0 h-[2.5rem] mob:h-[3rem] s-sm:h-[3.5rem] x-sm:h-[4rem]"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />

          <motion.div
            className="t:text-2xl mob:text-3xl x-sm:text-4xl font-bold mb-2 break-words"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            ₹ {user && safeWallet ? decryptData(safeWallet)?.balance : !user ? 0 : null}
          </motion.div>

          <div className="flex flex-wrap items-center gap-[6px] mob:gap-[10px]">
            <pre className="t:text-[11px] mob:text-xs x-sm:text-sm opacity-80 break-all">
              {user && safeWallet && showAcNumber
                ? formatAccountNumber(decryptData(safeWallet)?.accountNumber)
                : !user
                ? "**** **** **** ****"
                : user && safeWallet && !showAcNumber
                ? hiddenAccountNo
                : null}
            </pre>

            {user &&
              (showAcNumber ? (
                <Eye
                  className="w-3 h-3 mob:w-[12px] mob:h-[12px] cursor-pointer"
                  onClick={() => setShowAcNumber((s) => !s)}
                />
              ) : (
                <EyeOff
                  className="w-3 h-3 mob:w-[12px] mob:h-[12px] cursor-pointer"
                  onClick={() => setShowAcNumber((s) => !s)}
                />
              ))}
          </div>
        </motion.div>

        {children}
        
      </div>
    </motion.div>
    )
}
