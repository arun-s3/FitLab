import React, {useState, useEffect, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {motion} from "framer-motion"

import {CreditCard, BanknoteArrowUp, HeartPlus, Plus, User, ArrowRight, AlertCircle, X, Check, IndianRupee, BanknoteArrowDown, } from "lucide-react" 
import {toast as sonnerToast} from 'sonner'

import {addPeerAccount, sendMoneyToUser, requestMoneyFromUser, resetWalletStates} from '../../../../Slices/walletSlice'
import {decryptData} from '../../../../Utils/decryption'
import useModalHelpers from '../../../../Hooks/ModalHelpers'
import useTermsConsent from "../../../../Hooks/useTermsConsent"
import TermsDisclaimer from "../../../../Components/TermsDisclaimer/TermsDisclaimer"


export default function MoneyTransferModal({isTransferModalOpen, setIsTransferModalOpen, walletBalance, selectedPeerAccount, setSelectedPeerAccount,
   isRequester, requestMoney, complexModal}){

    if (!isTransferModalOpen) return null

    const [isAddingPeerAccount, setIsAddingPeerAccount] = useState(false)
    const [newPeerAccount, setNewPeerAccount] = useState({ name: "", accountNumber: "" })
    const [newPeerAccountErrors, setNewPeerAccountErrors] = useState({ name: "", accountNumber: "" })

    const [transferAmount, setTransferAmount] = useState("")

    const [transferConfirmationChecked, setTransferConfirmationChecked] = useState(false)
    const [transferSuccess, setTransferSuccess] = useState(false)

    const [error, setError] = useState(false)

    const [userTermsConsent, setUserTermsConsent] = useState(false)

    const dispatch = useDispatch()
    const {safeWallet, walletLoading, walletError, peerAccountAdded, moneySent, moneyRequested} = useSelector(state=> state.wallet)

    const modalRef = useRef(null)
    useModalHelpers({open: isTransferModalOpen, onClose: ()=> setIsTransferModalOpen(false), modalRef})

    useEffect(()=> {
      if(complexModal){
        setSelectedPeerAccount(null)
      }
      if(!complexModal && requestMoney){
        setTransferAmount(requestMoney)
      }
    },[])

    useEffect(()=> {
        if(moneySent){
            sonnerToast.success("Money sent successfull!")
            setTransferSuccess(true)
            dispatch(resetWalletStates())
        }
        if(moneyRequested){
            sonnerToast.success("Money requested successfull!")
            dispatch(resetWalletStates())
        }
        if(peerAccountAdded){
            sonnerToast.success(`${!isRequester ? 'Beneficiary' : 'Creditor'} account added successfully!`)

            setSelectedPeerAccount(newPeerAccount)
            setNewPeerAccount({name: '', accountNumber: ''})
            setNewPeerAccountErrors({ name: "", accountNumber: "" })
            setIsAddingPeerAccount(false)

            dispatch(resetWalletStates())
        }
        if(walletError){
            sonnerToast.error(walletError)
            if(walletError.includes("doesn't match any existing FitLab user")){
              setNewPeerAccountErrors(error=> ({...error, accountNumber: walletError.toString()}))
              setIsAddingPeerAccount(true)
            }
            dispatch(resetWalletStates())
        }
    }, [moneySent, moneyRequested, peerAccountAdded, walletError])


    const handleTransferAmountChange = (e) => {
        const value = e.target.value
        if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
          setTransferAmount(value)
          setError(false)
        }
    }

    const validateAccountDetails = (type)=> {
      console.log("Inside validateAccountDetails..")
      const errors = { name: "", accountNumber: "" }

      if(type === 'name'){
        if(!newPeerAccount.name.trim()) {
          errors.name = "Name is required"
        }else if(!/^[a-zA-Z\s]+$/.test(newPeerAccount.name)) {
          errors.name = "Please enter a valid name"
        }
        else{
          errors.name = ""
        }
      }else{
        if(!newPeerAccount.accountNumber.trim()) {
          errors.accountNumber = "Account number is required"
        }else if(!/^[0-9\s]{12}$/.test(newPeerAccount.accountNumber.replace(/\s/g, ""))) {
          errors.accountNumber = "Please enter a valid account number"
        }else{
          errors.accountNumber = ""
        }
      }
      setNewPeerAccountErrors(errors)
    }

    const handleAddPeerAccount = ()=> {
        console.log("Inside handleAddPeerAccount..")
        const errors = { name: "", accountNumber: "" }
        let hasError = false
    
        if (!newPeerAccount.name.trim()) {
          errors.name = "Name is required"
          hasError = true
        }
    
        if (!newPeerAccount.accountNumber.trim()) {
          errors.accountNumber = "Account number is required"
          hasError = true
        } else if (!/^[0-9\s]{10,19}$/.test(newPeerAccount.accountNumber.replace(/\s/g, ""))) {
          errors.accountNumber = "Please enter a valid account number"
          hasError = true
        }
    
        if (hasError) {
          setNewPeerAccountErrors(errors)
          return
        }

        const accountDetails = {
          name: newPeerAccount.name,
          accountNumber: 'FTL' + newPeerAccount.accountNumber.toString(),
          isBeneficiary: !isRequester ? true : false
        }
        console.log('accountDetails---->', accountDetails)

        dispatch( addPeerAccount({accountDetails}) )
      }

    const handleTransferSubmit = (e) => {
        e.preventDefault()

        if(!userTermsConsent){
          sonnerToast.warning("Please review and accept our Terms & Conditions and Privacy Policy to continue.", {duration: 5500})
          return
        }

        acceptTermsOnFirstAction()

        const numAmount = Number.parseFloat(transferAmount)
        if (isNaN(numAmount) || numAmount <= 0 || numAmount > walletBalance) {
          setError(true)
          return
        }

        let accNo = selectedPeerAccount.accountNumber
        if(selectedPeerAccount.accountNumber.startsWith('FTL')){
          accNo = accNo.slice(3)
        }

        const targetAccountNumber = isRequester ? {destinationAccountNumber: accNo} : {recipientAccountNumber: accNo}
        const paymentDetails = {
            ...targetAccountNumber,
            amount: transferAmount,
            notes: ''
        }
        console.log('paymentDetails--->', paymentDetails)

        isRequester ? dispatch( requestMoneyFromUser({paymentDetails}) ) : dispatch( sendMoneyToUser({paymentDetails}) )
    
        setTimeout(() => {
          setTransferSuccess(false)
          setTransferAmount("")
          setTransferConfirmationChecked(false)
          setIsTransferModalOpen(false)
          complexModal && setSelectedPeerAccount(null)
        }, 2700)
    }


    return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md"
        >

          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h2 className="flex items-center gap-[10px] text-xl font-semibold">
              {
                !isRequester ? <BanknoteArrowUp className='w-[30px] h-[35px] text-primaryDark' />
                  : <BanknoteArrowDown className='w-[30px] h-[35px] text-primaryDark' />
              }
              { !isRequester ? 'Send Money' : 'Request Money' }
            </h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9, rotate: -90 }}
              onClick={() => {
                console.log('Closing Modal.....')
                setIsTransferModalOpen(false)
                setTransferAmount("")
                setTransferConfirmationChecked(false)
                setError(false)
                if(complexModal) setSelectedPeerAccount(null)
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full p-1
               hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <X className="h-5 w-5" />
              <span className="sr-only"> Close </span>
            </motion.button>
          </div>
          
          <motion.div
            className="max-h-[80vh] overflow-y-auto custom-scrollbar"
            ref={modalRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
          {transferSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="p-6 flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2"> Transfer Successful! </h3>
              <p className="text-center text-[15px] text-gray-600 tracking-[0.4px] dark:text-gray-300 mb-6">
                You have successfully sent ₹{Number.parseFloat(transferAmount).toFixed(2)} to{" "}
                {selectedPeerAccount?.name}.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setTransferSuccess(false)
                  setIsTransferModalOpen(false)
                  setTransferAmount("")
                  setTransferConfirmationChecked(false)
                  if(complexModal){
                    setSelectedPeerAccount(null)
                  }
                }}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background
                 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                  focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary
                   text-primary-foreground hover:bg-green-400 h-10 px-4 py-2"
                >
                  Done
              </motion.button>
            </motion.div>
          ) : (
            <motion.form 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              onSubmit={handleTransferSubmit}
            >
              <div className="p-4 space-y-4">

                { !selectedPeerAccount ? (
                  <div className="space-y-4">
                    {
                    ((!isRequester && decryptData(safeWallet)?.beneficiaryAccounts.length > 0) ||
                      (isRequester && decryptData(safeWallet)?.creditorAccounts.length > 0)) &&
                        <div className="space-y-2">
                            <label className="text-sm font-medium"> {!isRequester ? 'Select Recipient' : 'Select Creditor'} </label>
                            <div className="space-y-2">
                              { 
                               (function generateRecepientOrCreditor(){

                                  const accountGroup = !isRequester ? decryptData(safeWallet)?.beneficiaryAccounts
                                      : decryptData(safeWallet)?.creditorAccounts
                                  
                                  return (
                                    accountGroup.map((account)=> (
                                      <div key={account._id}
                                       onClick={()=> setSelectedPeerAccount(account)}
                                        className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50
                                           dark:hover:bg-gray-800">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                          <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                        </div>
                                        <div className="ml-3">
                                          <p className="text-[14px] font-medium"> {account.name} </p>
                                          <p className="text-[12px] text-gray-500 dark:text-gray-400"> {account.accountNumber} </p>
                                        </div>
                                      </div>
                                    ))
                                  )
                                }
                               )()
                              }
                            </div>
                        </div>
                    }
                    <div className={`relative ${!isRequester && decryptData(safeWallet)?.beneficiaryAccounts.length <= 0 && 'hidden' }
                         ${isRequester && decryptData(safeWallet)?.creditorAccounts.length <= 0 && 'hidden' } `}>
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"></span>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400"> or </span>
                      </div>
                    </div>
                    { isAddingPeerAccount ? (
                      <div className="border rounded-md p-4 space-y-4">
                        <div className="!mb-[2rem] flex items-center justify-between">
                          <h3 className="text-[17px] text-secondary font-[550]">Add New Recipient</h3>
                          <button type="button"
                            onClick={() => {
                              setIsAddingPeerAccount(false)
                              setNewPeerAccount({name: '', accountNumber: ''})
                              setNewPeerAccountErrors({ name: "", accountNumber: "" })
                            }}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <X className="h-4 w-4 text-secondary" />
                          </button>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="peerAccountName" className="block text-sm font-medium">
                            { !isRequester ? 'Recipient Name' : 'Creditor Name' }
                          </label>
                          <div className='relative'>
                            <input id="peerAccountName" type="text" value={newPeerAccount.name} 
                              placeholder={!isRequester ? "Enter recipient name" : "Enter creditor name"}
                              onChange={(e)=> setNewPeerAccount(user=> ({...user, name: e.target.value}))}
                                onBlur={()=> validateAccountDetails('name')}    
                                  className={`w-full px-3 py-2 border text-[14px] placeholder:text-[12px] ${
                                    newPeerAccountErrors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                                    } rounded-md focus:outline-none focus:border-none focus-within:ring-0 focus:ring-2
                                    focus:ring-secondary dark:bg-gray-800`}/>
                            {newPeerAccountErrors.name && (
                              <p className="absolute mt-[4px] text-[11px] text-red-500">{newPeerAccountErrors.name}</p>
                            )}
                          </div>
                        </div>

                        <div className="!mt-[1.5rem] space-y-2">
                          <label htmlFor="accountNumber" className="block text-sm font-medium">
                            Account Number (Enter the last 12 digits)
                          </label>
                          <div className='relative'>
                            <input id="accountNumber" type="text" value={newPeerAccount.accountNumber} placeholder="Enter account number"
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^\d\s]/g, "")
                                setNewPeerAccount(user=> ({...user, accountNumber: value}))
                              }}
                              onBlur={()=> validateAccountDetails('accountNumber')}
                              className={`w-full px-3 py-2 border text-[14px] placeholder:text-[12px] ${
                                newPeerAccountErrors.accountNumber ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                                  } rounded-md focus:outline-none focus:border-none focus-within:ring-0 focus:ring-2
                                     focus:ring-secondary dark:bg-gray-800`}/>
                            {newPeerAccountErrors.accountNumber && (
                              <p className="absolute mt-[4px] text-[11px] text-red-500"> {newPeerAccountErrors.accountNumber} </p>
                            )}
                          </div>
                        </div>

                        <button type="button" onClick={handleAddPeerAccount} className="w-full !mt-[1.5rem] px-4 py-2 text-sm
                         font-medium text-white bg-secondary rounded-md hover:bg-purple-700 focus:outline-none
                          focus:border-none focus:ring-purple-700">
                          { !isRequester ? 'Save Recipient' : 'Save Creditor' }
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className='flex gap-[1rem] text-[14px] text-secondary tracking-[0.3px]'>
                          <HeartPlus className='w-[50px] h-[25px] text-muted'/>
                          {`Add a ${!isRequester ? 'beneficiary/recepient' : 'creditor/payer'} account to securely transfer funds
                           from your FitLab wallet. Simply enter their account number and name to send money anytime with ease.`}
                        </p>
                        <button type="button" onClick={()=> setIsAddingPeerAccount(true)}  className="mt-[1rem] w-full flex 
                          items-center justify-center text-[15px] gap-2 border border-dashed p-[7px] rounded-md text-gray-500
                           hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50
                            dark:hover:bg-gray-800">
                          <Plus className="h-4 w-4" />
                          { !isRequester ? 'Add New Recipient' : 'Add New Creditor' }
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 border border-dashed border-inputBorderLow rounded-lg">
                      <div className="flex items-center mb-2">
                        <User className="h-5 w-5 text-secondary dark:text-gray-400 mr-2" />
                        <span className="text-[15px] font-medium"> { !isRequester ? 'Recipient' : 'Creditor' } </span>
                        {
                          complexModal &&
                            <button type="button" onClick={()=> setSelectedPeerAccount(null)}
                              className="ml-auto text-[12px] text-blue-600 dark:text-blue-400 hover:underline">
                                Change
                            </button>
                        }
                      </div>
                      <div className="pl-7">
                        {
                          selectedPeerAccount?.name &&
                          <p className="text-[14px] font-[400]"> {selectedPeerAccount.name} </p>
                        }
                        <div className="flex items-center mt-1">
                          <CreditCard className="h-[15px] w-[15px] text-gray-500 dark:text-gray-400 mr-1" />
                          <span className="text-[12px] text-gray-600 dark:text-gray-300">
                            {selectedPeerAccount.accountNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="amount" className="block text-[14px] font-medium">
                        {!isRequester ? 'Amount to Send' : 'Amount you want to receive'}
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-[15px] w-[15px] dark:text-gray-400" />
                        <input id="amount" type="text" value={transferAmount} onChange={handleTransferAmountChange} placeholder="0.00"
                          className={`w-full pl-10 pr-4 py-2 border text-[15px] text-secondary placeholder:text-[13px] ${
                            error ? "border-red-500 dark:border-red-500"
                              : "border-gray-300 dark:border-gray-600"
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800`}/>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-[12px] text-gray-500 dark:text-gray-400">
                          Available: ₹{walletBalance.toFixed(2)}
                        </span>
                        {error && (
                          <span className="text-red-500 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Invalid amount
                          </span>
                        )}
                      </div>
                    </div> 

                    {
                      !isRequester ?
                      <>
                      <div className="flex items-start mt-4">
                        <div className="flex items-center h-5">
                          <input id="confirmation" type="checkbox" checked={transferConfirmationChecked}
                            onChange={(e) => setTransferConfirmationChecked(e.target.checked)}
                            className="h-4 w-4 text-secondary border-gray-300 rounded focus:ring-secondary"/>
                        </div>
                        <label htmlFor="confirmation" className="ml-2 text-[12px] text-gray-600 dark:text-gray-300">
                          I confirm that I want to send money to this recipient and the account details are correct.
                        </label>
                      </div>
                      <TermsDisclaimer 
                          acknowledgementStyle="!text-[12px] text-gray-600 ml-2 !text-left"
                          checkboxType={true}
                          acknowledgeStatementEndsWith= "and understand that this is a peer-to-peer financial transaction."
                          onChecked={(status)=> setUserTermsConsent(status)}
                        />
                      </>
                      :
                      <p className='text-[10px] text-muted whitespace-nowrap'> 
                        This is a request only. Funds will move only if the other user approves and sends money.
                      </p>
                    }

                    {transferAmount &&
                      !isNaN(Number.parseFloat(transferAmount)) &&
                      Number.parseFloat(transferAmount) > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md mt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium"> {!isRequester ? "You're sending" : "You're requesting"} </span>
                            <span className="text-secondary font-bold"> ₹{Number.parseFloat(transferAmount).toFixed(2)} </span>
                          </div>
                          <div className="flex items-center text-[13px] text-gray-600 dark:text-gray-400 mt-1">
                            <span> 
                              { !isRequester ? 'Your wallet' 
                                    : selectedPeerAccount.name ? selectedPeerAccount.name : selectedPeerAccount.accountNumber
                              }
                            </span>
                            <ArrowRight className="h-3 w-3 mx-2" />
                            <span>
                              { !isRequester ? selectedPeerAccount.name ? selectedPeerAccount.name : selectedPeerAccount.accountNumber 
                                    : 'Your wallet' 
                              }
                            </span>
                          </div>
                        </div>
                      )}
                  </>
                )}
              </div>

              <div className="flex justify-end gap-3 p-4 border-t dark:border-gray-700">
                <button type="button"
                  onClick={() => {
                    setIsTransferModalOpen(false)
                    setTransferAmount("")
                    setTransferConfirmationChecked(false)
                    if(complexModal){
                      setSelectedPeerAccount(null)
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300
                   rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800
                    dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">
                  Cancel
                </button>

                {selectedPeerAccount && (
                  <button type="submit"
                    disabled={ !isRequester &&
                      (!transferAmount || isNaN(Number.parseFloat(transferAmount)) || Number.parseFloat(transferAmount) <= 0 
                        || Number.parseFloat(transferAmount) > walletBalance || !transferConfirmationChecked)}
                    className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-md hover:bg-purple-700
                     focus:outline-none focus:ring-2 focus:ring-purple-700 disabled:opacity-50 disabled:cursor-not-allowed
                      disabled:hover:bg-purple-400">
                     { walletLoading ? 
                        !isRequester  
                        ?'Sending Money...' 
                        : 'Requesting Money...' 
                      : !isRequester ? 
                      'Send Money' 
                      : 'Request Money' 
                      }
                  </button>
                )}
              </div>
            </motion.form>
          )}
          </motion.div>
        </motion.div>
      </motion.div>
    )
}


