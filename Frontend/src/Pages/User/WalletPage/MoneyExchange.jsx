import React, {useState, useEffect} from "react"
import './WalletPage.css'
import {motion} from 'framer-motion'

import {ArrowUp, ChevronRight, Clipboard, UserPlus} from "lucide-react"
import {toast as sonnerToast} from 'sonner'

import MoneyTransferModal from "./Modals/MoneyTransferModal"


export default function MoneyExchange({walletBalance, onAuthCheckModal}){
  
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
    const [complexModal, setComplexModal] = useState(true)
    const [selectedPeerAccount, setSelectedPeerAccount] = useState(null)

    const [isRequester, setIsRequester] = useState(false)

    const [selectedRecipient, setSelectedRecipient] = useState({name: '', accountNumber: ''}) 
    const [selectedCreditor, setSelectedCreditor] = useState({name: '', accountNumber: ''}) 
    const [requestMoney, setRequestMoney] = useState(null)

    const [error, setError] = useState({sendMoney: '', receiveMoney: ''})
    const [inputMsg, setInputMsg] = useState({sendMoney: '', receiveMoney: ''})

    useEffect(()=> {
      if(Object.values(selectedRecipient).some(val=> val)){
        setSelectedPeerAccount(selectedRecipient)
      }
      if(Object.values(selectedCreditor).some(val=> val)){
        setSelectedPeerAccount(selectedCreditor)
      }
    }, [selectedRecipient, selectedCreditor, isRequester, complexModal])

    useEffect(() => {
      if (Object.values(error).some(val=> val)){
        const timeout = setTimeout(()=> { setError({ sendMoney: '', receiveMoney: '' }) }, 2000)
        return () => clearTimeout(timeout)
      }
      if (Object.values(inputMsg).some(val=> val)){
        const msgTimeout = setTimeout(()=> { setInputMsg({ sendMoney: '', receiveMoney: '' }) }, 700)
        return () => clearTimeout(msgTimeout)
      }
    }, [error], inputMsg)

     const validateAccountNumber = (type, accountNumberGiven)=> {
      if(onAuthCheckModal()){
        return
      }
      const errorMessage = "Please enter a valid account number"
    
      const validityTest = (accountNumber)=> {
        return accountNumber && /^[0-9\s]{12}$/.test(accountNumber.replace(/\s/g, ""))
      }
    
      const returnError = (type)=> {
          setError(error=> ({...error, [type]: errorMessage}))
          return 1
      }
    
      const returnNoError = (type)=> {
        setError(error=> ({...error, [type]: ''}))
      }
    
      if(accountNumberGiven){
        if (validityTest(accountNumberGiven)) {
          returnNoError(type)
          return 0
        }else {
          returnError(type)
          return 1
        }
      }
      if(type === 'sendMoney'){
        if(validityTest(selectedRecipient.accountNumber)){
          returnNoError('sendMoney')
          return 0
        }else{
          returnError('sendMoney')
          return 1
        }
      }
      if(type === 'receiveMoney'){
        if(validityTest(selectedCreditor.accountNumber)){
          returnNoError('receiveMoney')
          return 0
        }else{
          returnError('receiveMoney')
          return 1
        }
      }
    }
    
    const handlePasteFromClipboard = async (type)=> {
      if(onAuthCheckModal()){
        return
      }
      try {
        const text = await navigator.clipboard.readText()
    
        const setAccNo = (no) => 
            type === 'sendMoney' ? setSelectedRecipient({ name: '', accountNumber: no })
                                 : setSelectedCreditor({ name: '', accountNumber: no })
        setAccNo(text)

        const hasNonDigit = /\D/.test(text)
        if (hasNonDigit) {
          setInputMsg(msg => ({ ...msg, [type]: 'Extracting digits...' }))
    
          setTimeout(() => {
            const digitsOnly = text.replace(/\D/g, "")
            setAccNo(digitsOnly)
            const errorExists = validateAccountNumber(type, digitsOnly)
            if (!errorExists) {
              setInputMsg(msg => ({ ...msg, [type]: '' }))
            }
          }, 700)
        }else{
          const errorExists = validateAccountNumber(type, text)
          if (errorExists) {
            setInputMsg(msg => ({ ...msg, [type]: 'Invalid account number format' }))
          } else {
            setInputMsg(msg => ({ ...msg, [type]: '' }))
          }
        }
      } catch (error) {
        sonnerToast.error("Error while pasting. Please try again!")
      }
    }
    
    const openSimpleMoneyTransferModal = (type)=> {
        if(onAuthCheckModal()){
          return
        }
        const errorExists = validateAccountNumber(type)
        if(errorExists) return

        const makeError = (type)=> {
          setError(error=> ({...error, [type]: "Please enter a FitLab account number"}))
        }

        const openModal = (type)=> {
          setComplexModal(false)
          type === 'sendMoney' ? setIsRequester(false) : setIsRequester(true)
          setIsTransferModalOpen(true)
        }

        if(type === 'sendMoney'){
          if(!selectedRecipient.accountNumber){
            makeError('sendMoney')
            return
          }else{
            openModal('sendMoney')
            return
          }
        }

        if(type === 'receiveMoney'){
          if(!selectedCreditor.accountNumber){
            makeError('receiveMoney')
            return
          }else{
            openModal('receiveMoney')
            return
          }
      }
    }

    const openComplexMoneyTransferModal = (type)=> {
      if(onAuthCheckModal()){
        return
      }
      type === 'sendMoney' ? setIsRequester(false) : setIsRequester(true)
      setComplexModal(true)
      setIsTransferModalOpen(true)
    }

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.15,
          delayChildren: 0.1,
        },
      }
    }

    const cardVariants = {
      hidden: { opacity: 0, y: 25, scale: 0.96 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 70, damping: 15 },
      },
      hover: {
        y: -4,
        boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
        transition: { type: "spring", stiffness: 300, damping: 15 },
      },
      chevronHover: {
        x: 3,
        boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
        transition: { type: "spring", stiffness: 300, damping: 15 },
      },
      tap: { scale: 0.98 }
    }


  return (
    <motion.div
      className="flex flex-col gap-[10px]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mt-0 lg:mt-8 xl:mt-0 flex flex-col gap-[10px] lg:gap-12 xl:gap-[10px]">

        <motion.div
          className="bg-white shadow-sm rounded-lg"
        >
          <div className="pt-[1.2rem] pb-[1rem] px-[1rem] mob:px-[1.5rem]">
            <div className="flex items-center gap-2 mb-3">
              <motion.div
                className="bg-red-100 rounded-full p-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                <ArrowUp className="h-[14px] w-[14px] text-red-500" />
              </motion.div>
              <h2 className="text-[15px] mob:text-[16px] font-semibold">Send</h2>
            </div>

            <div className="relative flex flex-wrap gap-2 mb-[6px]">
              <input
                type="text"
                placeholder="Enter his/her FitLab account number"
                className="flex-1 min-w-[100px] xxs-sm:min-w-[140px] h-[2rem] px-2 mob:px-3 py-2 text-[11px] mob:text-[12px] 
                  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 
                  focus-visible:outline-none focus:border-secondary"
                onChange={(e)=> {
                  const value = e.target.value.replace(/[^\d\s]/g, "")
                  setSelectedRecipient({ name: "", accountNumber: value })
                }}
                onBlur={()=> onValidateAccount("sendMoney")}
                value={selectedRecipient?.accountNumber}
              />

              <motion.button
                className="h-[2rem] w-8 mob:w-10 flex items-center justify-center border border-gray-300 
                  rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:text-secondary 
                  hover:border-secondary hover:border-2 transition duration-300"
                whileTap={{ scale: 0.95 }}
                onClick={()=> handlePasteFromClipboard("sendMoney")}
              >
                <Clipboard className="h-3 w-3 mob:h-4 mob:w-4 text-inherit" />
              </motion.button>

              <motion.button
                className="h-[2rem] w-8 mob:w-10 flex items-center justify-center border border-gray-300 
                  rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:text-secondary 
                  hover:border-secondary hover:border-2 transition duration-300"
                whileTap={{ scale: 0.95 }}
                onClick={()=> openComplexMoneyTransferModal("sendMoney")}
              >
                <UserPlus className="h-3 w-3 mob:h-4 mob:w-4" />
              </motion.button>

              <motion.button
                className="h-[2rem] w-8 mob:w-10 flex items-center justify-center bg-purple-500 text-white 
                  rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                variants={cardVariants}
                whileHover="chevronHover"
                whileTap={{ scale: 0.95 }}
                onClick={()=> openSimpleMoneyTransferModal("sendMoney")}
              >
                <ChevronRight className="h-3 w-3 mob:h-4 mob:w-4" />
              </motion.button>

              <p className="absolute -top-5 right-0 text-[10px] mob:text-[11px] text-secondary">
                {inputMsg.sendMoney}
              </p>
            </div>

            <div className="ml-[1px] flex flex-wrap items-center justify-between text-[10px] mob:text-[11px] text-gray-500">
              <span>Send money to your friend as a gift!</span>
              <span className="text-[10px] mob:text-[11px] text-red-500">
                {error && error?.sendMoney}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white shadow-sm rounded-lg"
        >
          <div className="pt-[13px] pb-[1rem] px-[1rem] mob:px-[1.5rem]">
            <div className="flex items-center gap-2 mb-3">
              <motion.div
                className="bg-green-100 rounded-full p-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              >
                <ArrowUp className="h-[14px] w-[14px] text-green-500 rotate-180" />
              </motion.div>
              <h2 className="text-[15px] mob:text-[16px] font-semibold">Request</h2>
            </div>

            <div className="relative flex flex-wrap gap-2 mb-[6px]">
              <input
                type="text"
                placeholder="Enter Amount"
                className="w-[4.7rem] xxx-sm:w-[5rem] h-[2rem] px-2 mob:px-3 py-2 text-[11px] mob:text-[12px] 
                  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-secondary"
                onChange={(e)=> {
                  const value = e.target.value.replace(/\D/g, "")
                  setRequestMoney(value)
                }}
                value={requestMoney}
              />

              <input
                type="text"
                placeholder="Enter his/her FitLab account number"
                className="flex-1 min-w-[8px] mob:min-w-[100px] xx-lg:min-w-[140px] h-[2rem] px-2 mob:px-3 py-2 text-[11px] mob:text-[12px] 
                  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-secondary"
                onChange={(e)=> {
                  const value = e.target.value.replace(/[^\d\s]/g, "")
                  setSelectedCreditor({ name: "", accountNumber: value })
                }}
                onBlur={() => onValidateAccount("receiveMoney")}
                value={selectedCreditor?.accountNumber}
              />

              <motion.button
                className="static mob:absolute x-xl:static bg-none mob:bg-white x-xl:bg-none right-[6.1rem] top-[4px] 
                  h-[2rem] mob:h-[23px] x-xl:h-[2rem] w-8 mob:w-10 flex items-center justify-center 
                  border mob:border-0 x-xl:border border-gray-300 rounded-md hover:bg-gray-50 
                  focus:outline-none focus:ring-2 focus:ring-purple-500 hover:text-secondary 
                  hover:border-secondary hover:border-2 mob:hover:border-0 x-xl:hover:border-2 transition duration-300"
                whileTap={{ scale: 0.95 }}
                onClick={()=> handlePasteFromClipboard("receiveMoney")}
              >
                <Clipboard className="h-3 w-3 mob:h-4 mob:w-4 text-inherit" />
              </motion.button>

              <motion.button
                className="h-[2rem] w-8 mob:w-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 
                  focus:outline-none focus:ring-2 focus:ring-purple-500 hover:text-secondary 
                  hover:border-secondary hover:border-2 transition duration-300"
                whileTap={{ scale: 0.95 }}
                onClick={()=> openComplexMoneyTransferModal("receiveMoney")}
              >
                <UserPlus className="h-3 w-3 mob:h-4 mob:w-4 text-inherit" />
              </motion.button>

              <motion.button
                className="h-[2rem] w-8 mob:w-10 flex items-center justify-center bg-purple-500 text-white rounded-md 
                  hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                variants={cardVariants}
                whileHover="chevronHover"
                whileTap={{ scale: 0.95 }}
                onClick={()=> openSimpleMoneyTransferModal("receiveMoney")}
              >
                <ChevronRight className="h-3 w-3 mob:h-4 mob:w-4" />
              </motion.button>

              <p className="absolute -top-5 right-0 text-[10px] mob:text-[11px] text-red-500">
                {error.receiveMoney}
              </p>
              <p className="absolute -top-5 left-[25%] text-[10px] mob:text-[11px] text-secondary">
                {inputMsg.receiveMoney}
              </p>
            </div>

            <div className="ml-[1px] text-[10px] mob:text-[11px] text-gray-500">
              Ask a friend for money by entering their FitLab account number!
            </div>
          </div>
        </motion.div>
      </div>

      {isTransferModalOpen && (
        <MoneyTransferModal
          isTransferModalOpen={isTransferModalOpen}
          setIsTransferModalOpen={setIsTransferModalOpen}
          selectedPeerAccount={selectedPeerAccount}
          setSelectedPeerAccount={setSelectedPeerAccount}
          isRequester={isRequester}
          walletBalance={walletBalance}
          requestMoney={requestMoney}
          complexModal={complexModal}
        />
      )}
    </motion.div>
  )
}
