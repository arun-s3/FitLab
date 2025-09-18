import React, {useState, useEffect, useContext, useRef} from "react"
import './WalletPage.css'
import {useNavigate, useLocation} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import { ArrowUp, Calendar, ChevronDown, ChevronRight, Clipboard, CloudLightningIcon as Lightning, PlusCircle,
  Share2, Tag, Users, Eye, EyeOff, Plus, Clock, CreditCard, Download,
  UserPlus} from "lucide-react"
import {toast} from 'react-toastify'
import axios from 'axios'

import WalletFundingModal from "./WalletFundingModal"
import MoneyTransferModal from "./MoneyTransferModal"
import TransactionDetailsSection from "./TransactionDetailsSection"
import AutoRechargeFeature from "./AutoRechargeFeature"
import AutoRechargeModal from "./AutoRechargeModal"
import WalletUtilitySection from "./WalletUtilitySection"
import {ProtectedUserContext} from '../../../Components/ProtectedUserRoutes/ProtectedUserRoutes'
import {UserPageLayoutContext} from '../UserPageLayout/UserPageLayout'
import {decryptData} from '../../../Utils/decryption'
import {getOrCreateWallet, resetWalletStates} from '../../../Slices/walletSlice'


export default function WalletPage() {

    const {setBreadcrumbHeading, setContentTileClasses, setPageLocation} = useContext(UserPageLayoutContext)
    setBreadcrumbHeading('Wallet')

    const {setIsAuthModalOpen, checkAuthOrOpenModal} = useContext(ProtectedUserContext)
    setIsAuthModalOpen({status: false, accessFor: 'wallet'})

    const location = useLocation()
    setPageLocation(location.pathname)

    setContentTileClasses('basis-[85%] mt-[2rem]')

    const [wallet, setWallet] = useState({})
    const [firstTimeUser, setFirstTimeUser] = useState(false)

    const [message, setMessage] = useState('')

    const [showAcNumber, setShowAcNumber] = useState(false)
    const [hiddenAccountNo, setHiddenAccountNo] = useState('')

    const [showFundingModal, setShowFundingModal] = useState(false)
    const [paymentVia, setPaymentVia] = useState("razorpayAndPaypal")

    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
    const [complexModal, setComplexModal] = useState(true)
    const [selectedPeerAccount, setSelectedPeerAccount] = useState(null)

    const [isRequester, setIsRequester] = useState(false)

    const [selectedRecipient, setSelectedRecipient] = useState({name: '', accountNumber: ''}) 
    const [selectedCreditor, setSelectedCreditor] = useState({name: '', accountNumber: ''}) 
    const [requestMoney, setRequestMoney] = useState(null)

    const [queryOptions, setQueryOptions] = useState({page: 1, status: 'all', type: 'all', userLevel: false})

    const [error, setError] = useState({sendMoney: '', receiveMoney: ''})
    const [inputMsg, setInputMsg] = useState({sendMoney: '', receiveMoney: ''})

    const [isAutoRechargeModalOpen, setIsAutoRechargeModalOpen] = useState(false)
    const [autoRechargeSettings, setAutoRechargeSettings] = useState(null)

    const dispatch = useDispatch()
    
    const sendMoneyRef = useRef(null) 
    const requestMoneyRef = useRef(null) 

    const {safeWallet, walletLoading, walletError, walletMessage} = useSelector(state=> state.wallet)
    const {user} = useSelector((state)=>state.user)

    const membershipCredits = 3

    useEffect(()=> {
      dispatch(resetWalletStates())
    },[])

    useEffect(() => {
      console.log("queryOptions----->", queryOptions)
      console.log('Getting wallet...')
      if(Object.keys(queryOptions).length > 0){
        dispatch( getOrCreateWallet({queryOptions}) )
      }
    }, [queryOptions])

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
        toast.success("A new FitLab Account has been created for you!")
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

    useEffect(() => {
      console.log("Error--->", error)
      if (Object.values(error).some(val=> val)){
        const timeout = setTimeout(()=> { setError({ sendMoney: '', receiveMoney: '' }) }, 2000)
        return () => clearTimeout(timeout)
      }
      if (Object.values(inputMsg).some(val=> val)){
        const msgTimeout = setTimeout(()=> { setInputMsg({ sendMoney: '', receiveMoney: '' }) }, 700)
        return () => clearTimeout(msgTimeout)
      }
    }, [error], inputMsg)

    useEffect(()=> {
      if(Object.values(selectedRecipient).some(val=> val)){
        setSelectedPeerAccount(selectedRecipient)
      }
      if(Object.values(selectedCreditor).some(val=> val)){
        setSelectedPeerAccount(selectedCreditor)
      }
      console.log('isRequester--->', isRequester)
      console.log('complexModal--->', complexModal)
      console.log('queryOptions--->', queryOptions)
    }, [selectedRecipient, selectedCreditor, isRequester, complexModal, queryOptions])

    const openFundingModal = () => {
      console.log("Opening funding modal...")
      if(checkAuthOrOpenModal()){
        return
      }
      setShowFundingModal(true)
    }
  
    const closeFundingModal = () => {
      setShowFundingModal(false)
    }  

    const openAutoRechargeModal = ()=> {
      console.log("Opening autoRechargeModal modal...")
      if(checkAuthOrOpenModal()){
        return
      }
      setIsAutoRechargeModalOpen(true)
    } 

    const walletActionButtons = [
      {name: 'Add Money', Icon: PlusCircle, clickHandler: ()=> openFundingModal()},
      {name: 'Auto-recharge', Icon: Lightning, clickHandler: ()=> openAutoRechargeModal()},
      {name: 'Wallet-only deals', Icon: Tag},
      {name: 'Refer', Icon: Users}
    ]

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

    const validateAccountNumber = (type, accountNumberGiven)=> {
      if(checkAuthOrOpenModal()){
        return
      }
      console.log("Inside validateAccountNumber..")
      const errorMessage = "Please enter a valid account number"

      const validityTest = (accountNumber)=> {
        return accountNumber && /^[0-9\s]{12}$/.test(accountNumber.replace(/\s/g, ""))
      }

      const returnError = (type)=> {
          console.log("Not valid-->", errorMessage)
          setError(error=> ({...error, [type]: errorMessage}))
          return 1
      }

      const returnNoError = (type)=> {
        console.log("Valid...")
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
      if(checkAuthOrOpenModal()){
        return
      }
      try {
        const text = await navigator.clipboard.readText()
        console.log("Clipboard text--->", text)
    
        const setAccNo = (no) => type === 'sendMoney' ? setSelectedRecipient({ name: '', accountNumber: no })
                                            : setSelectedCreditor({ name: '', accountNumber: no })
        setAccNo(text)

        const hasNonDigit = /\D/.test(text)
        if (hasNonDigit) {
          setInputMsg(msg => ({ ...msg, [type]: 'Extracting digits...' }))
    
          setTimeout(() => {
            const digitsOnly = text.replace(/\D/g, "")
            setAccNo(digitsOnly)
            const errorExists = validateAccountNumber(type, digitsOnly)
            console.log("errorExists after extracting digits-->", errorExists)
            if (!errorExists) {
              setInputMsg(msg => ({ ...msg, [type]: '' }))
            }
          }, 700)
        }else{
          const errorExists = validateAccountNumber(type, text)
          console.log("errorExists for pure digits-->", errorExists)
          if (errorExists) {
            setInputMsg(msg => ({ ...msg, [type]: 'Invalid account number format' }))
          } else {
            setInputMsg(msg => ({ ...msg, [type]: '' }))
          }
        }
      } catch (error) {
        console.error("Failed to read clipboard contents:", error.message)
      }
    }

    const openSimpleMoneyTransferModal = (type)=> {
      if(checkAuthOrOpenModal()){
        return
      }
      console.log('Inside openSimpleMoneyTransferModal(), type-->', type)
      const errorExists = validateAccountNumber(type)
      if(errorExists){
        console.log("Error exists...")
        return
      }

      const makeError = (type)=> {
        setError(error=> ({...error, [type]: "Please enter a FitLab account number"}))
      }

      const openModal = (type)=> {
        setComplexModal(false)
        console.log('inside, openModal(), type--->', type)
        console.log('isRequester before setting--->', isRequester)
        type === 'sendMoney' ? setIsRequester(false) : setIsRequester(true)
        console.log("Opening Modal....")
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
      if(checkAuthOrOpenModal()){
        return
      }
      type === 'sendMoney' ? setIsRequester(false) : setIsRequester(true)
      setComplexModal(true)
      setIsTransferModalOpen(true)
    }

    const handleSaveAutoRechargeSettings = (settings) => {
      setAutoRechargeSettings(settings)
      // In a real app, this would save to the backend
      console.log("Auto-recharge settings saved:", settings)
    }


  return (
        
        <section className='mb-[7rem]' id='WalletPage'>

            <div className="mx-auto p-4 max-w-7xl">
              <div className="flex flex-col space-y-6">
    
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  <div className="bg-white shadow-sm rounded-lg">
                    <div className="relative p-6">
                      <p className="absolute top-0 ml-[10px] text-[11px] text-green-600 tracking-[0.3px]"> 
                      {
                        firstTimeUser && message && message.toLowerCase().includes('welcome to fitlab wallet') &&
                        message
                      } 
                      <span className="ml-[5px] font-bold text-secondary">
                        {
                          firstTimeUser && message && message.toLowerCase().includes('welcome to fitlab wallet') &&
                          decryptData(safeWallet)?.accountNumber
                        }
                      </span>
                      </p>
                      <div className="relative bg-gradient-to-r from-purple-500 to-purple-700 rounded-xl p-5 text-white mb-6">
                        <div className="mb-1 text-sm opacity-80">Total Balance</div>
                        {/* <img src="/Logo_main.png" alt="Fitlab" className="absolute bottom-[5px] right-0 h-[2rem]"/> */}
                        <img src="/Logo_main_light1.png" alt="Fitlab" className="absolute bottom-[-18px] right-0 h-[4rem]"/>
                        <div className="text-4xl font-bold mb-2"> ₹ {user && safeWallet ? decryptData(safeWallet)?.balance : !user ? 0 : null} </div>
                        <div className="flex items-center gap-[10px]">
                          <pre className="text-sm opacity-80">
                            {
                              user && safeWallet && showAcNumber ? 
                              formatAccountNumber( decryptData(safeWallet)?.accountNumber ) 
                              : !user ?
                              '**** **** **** ****'
                              :user && safeWallet && !showAcNumber ?
                              hiddenAccountNo
                              : null
                            } 
                          </pre>
                          {
                            user && showAcNumber ?
                            <Eye className="w-[12px] h-[12px] cursor-pointer" onClick={()=> setShowAcNumber(status=> !status)}/>
                            : <EyeOff className="w-[12px] h-[12px] cursor-pointer" onClick={()=> user && setShowAcNumber(status=> !status)}/>
                          }
                        </div>
                      </div>
    
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {
                        walletActionButtons.map(button=> (
                            <div key={button.name} className={`h-[4.5rem] flex flex-col items-center justify-around py-[7px] text-muted 
                              bg-whitesmoke rounded-[6px] border border-dropdownBorder hover:shadow-md hover:text-primaryDark 
                                ${button.name === 'Add Money' ? 'text-primaryDark' : 'text-muted'} cursor-pointer
                                   ${button.name === 'Wallet-only deals' && 'w-[105%]'} `} onClick={()=> button.clickHandler()}>
                                <button.Icon className={`h-[1.3rem] w-[1.3rem] 
                                  ${button.name === 'Add Money' ? 'text-primaryDark' : 'text-muted'}`} />
                                <span className={`text-[13px] text-inherit font-medium ${button.name !== 'Wallet-only deals' && 'tracking-[0.3px]'}
                                    ${button.name === 'Add Money' ? 'text-muted' : 'text-inherit'}`}> 
                                  {button.name}
                                </span>
                            </div>
                        ))
                      }
                      </div>
                    </div>

                      {
                        showFundingModal &&
                        <WalletFundingModal showFundingModal={showFundingModal} closeFundingModal={closeFundingModal}
                          paymentVia={paymentVia} setPaymentVia={setPaymentVia}/>
                      }

                      <AutoRechargeModal isOpen={isAutoRechargeModalOpen} onClose={() => setIsAutoRechargeModalOpen(false)}
                         onSave={handleSaveAutoRechargeSettings} currentSettings={autoRechargeSettings} />

                  </div>
    
                  <div className="flex flex-col gap-[10px]">
                    <div className="bg-white shadow-sm rounded-lg">
                      <div className="pt-[1.5rem] pb-[1rem] px-[1.5rem]">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="bg-red-100 rounded-full p-1">
                            <ArrowUp className="h-[14px] w-[14px] text-red-500" />
                          </div>
                          <h2 className="text-[16px] font-semibold">Send</h2>
                        </div>
    
                        <div className="relative flex gap-2 mb-[5px]">
                          <input type="text" placeholder="Enter his/her FitLab account number" className="flex-1 h-[2rem] px-3
                           py-2 text-[12px] border border-gray-300 rounded-md focus:outline-none focus:ring-2
                            focus:ring-purple-500" onChange={(e)=> {
                              const value = e.target.value.replace(/[^\d\s]/g, "")
                              setSelectedRecipient({name:'', accountNumber: value})
                            }}
                            onBlur={()=> validateAccountNumber('sendMoney')} value={selectedRecipient?.accountNumber}/>
                          <button className="h-[2rem] w-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              onClick={()=> handlePasteFromClipboard('sendMoney')}>
                            <Clipboard className="h-4 w-4" />
                          </button>
                          <button className="h-[2rem] w-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                           onClick={()=> openComplexMoneyTransferModal('sendMoney')}>
                            <UserPlus className="h-4 w-4" />
                          </button>
                          <button className="h-[2rem] w-10 flex items-center justify-center bg-purple-500
                           text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              onClick={()=> openSimpleMoneyTransferModal('sendMoney')}>
                            <ChevronRight className="h-4 w-4" />
                          </button>
                          <p className="absolute top-[-20px] right-0 text-[11px] text-secondary"> {inputMsg.sendMoney} </p>
                        </div>
                        <div className="ml-[1px] flex items-center justify-between text-[11px] text-gray-500">
                          <span> Send Money for your friend as a gift! </span> 
                          <span className="text-[11px] text-red-500"> { error && error?.sendMoney} </span>
                        </div>
                      </div>
                      {
                        isTransferModalOpen &&

                        <MoneyTransferModal isTransferModalOpen={isTransferModalOpen} setIsTransferModalOpen={setIsTransferModalOpen}  
                          selectedPeerAccount={selectedPeerAccount} setSelectedPeerAccount={setSelectedPeerAccount} isRequester={isRequester} 
                              walletBalance={safeWallet && decryptData(safeWallet)?.balance} requestMoney={requestMoney}
                                complexModal={complexModal}/>

                      }
                    </div>

                    <div className="bg-white shadow-sm rounded-lg">
                      <div className="pt-[13px] pb-[1rem] px-[1.5rem]">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="bg-green-100 rounded-full p-1">
                            <ArrowUp className="h-4 w-4 text-green-500 transform rotate-180" />
                          </div>
                          <h2 className="text-[16px] font-semibold">Request</h2>
                        </div>
    
                        <div className="relative flex gap-2 mb-[5px]">
                          <input type="text" placeholder="Enter Amount" className="w-[7rem] h-[2rem] px-3 py-2 text-[12px]
                           border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              onChange={(e)=> {
                                const value = e.target.value.replace(/\D/g, "")
                                setRequestMoney(value)
                              }} value={requestMoney}/>
                            <input type="text" placeholder="Enter his/her FitLab account number" className="flex-1 h-[2rem] px-3 
                              py-2 text-[12px] border border-gray-300 rounded-md focus:outline-none focus:ring-2
                               focus:ring-purple-500"  onChange={(e)=> {
                                const value = e.target.value.replace(/[^\d\s]/g, "")
                                setSelectedCreditor({name:'', accountNumber: value})
                              }}
                                onBlur={()=> validateAccountNumber('receiveMoney')} value={selectedCreditor?.accountNumber}/>
                          <button className="h-[2rem] w-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              onClick={()=> handlePasteFromClipboard('receiveMoney')}>
                            <Clipboard className="h-4 w-4" />
                          </button>
                          <button className="h-[2rem] w-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"  
                            onClick={()=> openComplexMoneyTransferModal('receiveMoney')}>
                            <UserPlus className="h-4 w-4" />
                          </button>
                          <button className="h-[2rem] w-10 flex items-center justify-center bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                            onClick={()=> openSimpleMoneyTransferModal('receiveMoney')}>
                            <ChevronRight className="h-4 w-4" />
                          </button>
                          <p className="absolute top-[-20px] right-0 text-[11px] text-red-500"> {error.receiveMoney} </p>
                          <p className="absolute top-[-20px] left-[25%] text-[11px] text-secondary"> {inputMsg.receiveMoney} </p>
                        </div>
    
                        <div className="ml-[1px] text-[11px] text-gray-500"> Ask a friend for money by entering their FitLab account number! </div>
                      </div>
                    </div>

                  </div>
                </div>
    
                { 
                  safeWallet &&
                  <TransactionDetailsSection transactions={safeWallet && decryptData(safeWallet)?.transactions}
                    queryOptions={queryOptions} setQueryOptions={setQueryOptions}/>
                }

                <WalletUtilitySection membershipCredits={membershipCredits}/>

                {/* <AutoRechargeFeature /> */}

                </div>

              </div>

            </section>
  )
}
