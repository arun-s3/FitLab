import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import { CreditCard, BanknoteArrowUp, HeartPlus, Plus, User, ArrowRight, AlertCircle, X, Check, IndianRupee, } from "lucide-react" 
import {toast} from 'react-toastify'

import {addBeneficiaryAccount, sendMoneyToUser, resetWalletStates} from '../../../Slices/walletSlice'
import {decryptWalletData} from '../../../Utils/decryption'


    
export default function MoneyTransferModal({isTransferModalOpen, setIsTransferModalOpen, walletBalance, transferAmount, setTransferAmount,
     selectedRecipient, setSelectedRecipient}){

    if (!isTransferModalOpen) return null

    const [transferConfirmationChecked, setTransferConfirmationChecked] = useState(false)
    const [transferError, setTransferError] = useState(false)
    const [transferSuccess, setTransferSuccess] = useState(false)

    const [isAddingNewRecipient, setIsAddingNewRecipient] = useState(false)
    const [newRecipient, setNewRecipient] = useState({ name: "", accountNumber: "" })
    const [newRecipientErrors, setNewRecipientErrors] = useState({ name: "", accountNumber: "" })

    const dispatch = useDispatch()
    const {safeWallet, walletLoading, walletError, walletMessage, beneficiaryAdded, moneySent
      , moneyRequested} = useSelector(state=> state.wallet)

    const savedRecipients = [
        { id: 1, name: "Jane Smith", accountNumber: "9876 5432 1098 7654", recent: true },
        { id: 2, name: "Robert Johnson", accountNumber: "5678 9012 3456 7890", recent: true },
        { id: 3, name: "Sarah Williams", accountNumber: "1234 5678 9012 3456", recent: false },
    ]

    useEffect(()=> {
        if(moneySent){
            toast.success("Money sent successfull!")
            setTransferSuccess(true)
            dispatch(resetWalletStates())
        }
        if(moneyRequested){
            toast.success("Money requested successfull!")
            dispatch(resetWalletStates())
        }
        if(beneficiaryAdded){
            toast.success("Beneficiary account added successfully!")

            setSelectedRecipient(newRecipient)
            setNewRecipient({name: '', accountNumber: ''})
            setNewRecipientErrors({ name: "", accountNumber: "" })
            setIsAddingNewRecipient(false)

            dispatch(resetWalletStates())
        }
        if(walletError){
            toast.error(walletError)
            if(walletError.includes("doesn't match any existing FitLab user")){
              setNewRecipientErrors(error=> ({...error, accountNumber: walletError.toString()}))
              setIsAddingNewRecipient(true)
            }
            dispatch(resetWalletStates())
        }
    }, [moneySent, moneyRequested, beneficiaryAdded, walletError])

    const handleTransferAmountChange = (e) => {
        const value = e.target.value
        // Only allow numbers and decimals
        if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
          setTransferAmount(value)
          setTransferError(false)
        }
    }

    const validateAccountDetails = (type)=> {
      console.log("Inside validateAccountDetails..")
      const errors = { name: "", accountNumber: "" }

      if(type === 'name'){
        if(!newRecipient.name.trim()) {
          errors.name = "Name is required"
        }else if(!/^[a-zA-Z\s]+$/.test(newRecipient.name)) {
          errors.name = "Please enter a valid name"
        }
        else{
          errors.name = ""
        }
      }else{
        if(!newRecipient.accountNumber.trim()) {
          errors.accountNumber = "Account number is required"
        }else if(!/^[0-9\s]{12}$/.test(newRecipient.accountNumber.replace(/\s/g, ""))) {
          errors.accountNumber = "Please enter a valid account number"
        }else{
          errors.accountNumber = ""
        }
      }
      setNewRecipientErrors(errors)
    }

    const handleAddNewRecipient = ()=> {
        console.log("Inside handleAddNewRecipient..")
        const errors = { name: "", accountNumber: "" }
        let hasError = false
    
        if (!newRecipient.name.trim()) {
          errors.name = "Name is required"
          hasError = true
        }
    
        if (!newRecipient.accountNumber.trim()) {
          errors.accountNumber = "Account number is required"
          hasError = true
        } else if (!/^[0-9\s]{10,19}$/.test(newRecipient.accountNumber.replace(/\s/g, ""))) {
          errors.accountNumber = "Please enter a valid account number"
          hasError = true
        }
    
        if (hasError) {
          setNewRecipientErrors(errors)
          return
        }

        const accountDetails = {name: newRecipient.name, accountNumber: 'FTL' + newRecipient.accountNumber.toString()}
        console.log('accountDetails---->', accountDetails)

        dispatch( addBeneficiaryAccount({accountDetails}) )
      }

    const handleTransferSubmit = (e) => {
        e.preventDefault()
    
        const numAmount = Number.parseFloat(transferAmount)
        if (isNaN(numAmount) || numAmount <= 0 || numAmount > walletBalance) {
          setTransferError(true)
          return
        }
        const paymentDetails = {
            recipientAccountNumber: selectedRecipient.accountNumber,
            amount: transferAmount,
            notes: ''
        }
        console.log('paymentDetails--->', paymentDetails)
        dispatch( sendMoneyToUser({paymentDetails}) )
    
        setTimeout(() => {
          setTransferSuccess(false)
          setTransferAmount("")
          setTransferConfirmationChecked(false)
          setIsTransferModalOpen(false)
          setSelectedRecipient(null)
        }, 2700)
    }


    return (
        
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md">

          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h2 className="flex items-center gap-[10px] text-xl font-semibold">
              <BanknoteArrowUp className='w-[30px] h-[35px] text-primaryDark' />
              Send Money
            </h2>
            <button
              onClick={() => {
                setIsTransferModalOpen(false)
                setTransferAmount("")
                setTransferConfirmationChecked(false)
                setTransferError(false)
                setSelectedRecipient(null)
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full p-1
               hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <X className="h-5 w-5" />
              <span className="sr-only"> Close </span>
            </button>
          </div>

          {transferSuccess ? (
            <div className="p-6 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2"> Transfer Successful! </h3>
              <p className="text-center text-[15px] text-gray-600 tracking-[0.4px] dark:text-gray-300 mb-6">
                You have successfully sent ₹{Number.parseFloat(transferAmount).toFixed(2)} to{" "}
                {selectedRecipient?.name}.
              </p>
              <button
                onClick={() => {
                  setTransferSuccess(false)
                  setIsTransferModalOpen(false)
                  setTransferAmount("")
                  setTransferConfirmationChecked(false)
                  setSelectedRecipient(null)
                }}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background
                 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                  focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary
                   text-primary-foreground hover:bg-green-400 h-10 px-4 py-2">
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleTransferSubmit}>
              <div className="p-4 space-y-4">

                {!selectedRecipient ? (
                  <div className="space-y-4">
                    {
                    decryptWalletData(safeWallet)?.beneficiaryAccounts.length > 0 &&
                        <div className="space-y-2">
                            <label className="text-sm font-medium"> Select Recipient </label>
                            <div className="space-y-2">
                              { 
                                decryptWalletData(safeWallet)?.beneficiaryAccounts.map((recipient)=> (
                                <div key={recipient._id} onClick={()=> setSelectedRecipient(recipient)}
                                  className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50
                                   dark:hover:bg-gray-800">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                    <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-[14px] font-medium"> {recipient.name} </p>
                                    <p className="text-[12px] text-gray-500 dark:text-gray-400"> {recipient.accountNumber} </p>
                                  </div>
                                </div>
                              ))
                              }
                            </div>
                        </div>
                    }
                    <div className={`relative ${decryptWalletData(safeWallet)?.beneficiaryAccounts.length <= 0 && 'hidden'}`}>
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"></span>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400"> or </span>
                      </div>
                    </div>
                    {isAddingNewRecipient ? (
                      <div className="border rounded-md p-4 space-y-4">
                        <div className="!mb-[2rem] flex items-center justify-between">
                          <h3 className="text-[17px] text-secondary font-[550]">Add New Recipient</h3>
                          <button type="button"
                            onClick={() => {
                              setIsAddingNewRecipient(false)
                              setNewRecipient({name: '', accountNumber: ''})
                              setNewRecipientErrors({ name: "", accountNumber: "" })
                            }}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <X className="h-4 w-4 text-secondary" />
                          </button>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="recipientName" className="block text-sm font-medium">
                            Recipient Name
                          </label>
                          <div className='relative'>
                            <input id="recipientName" type="text" value={newRecipient.name} placeholder="Enter recipient name"
                              onChange={(e)=> setNewRecipient(user=> ({...user, name: e.target.value}))}
                                onBlur={()=> validateAccountDetails('name')}    
                                  className={`w-full px-3 py-2 border text-[14px] placeholder:text-[12px] ${
                                    newRecipientErrors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                                    } rounded-md focus:outline-none focus:border-none focus-within:ring-0 focus:ring-2
                                    focus:ring-secondary dark:bg-gray-800`}/>
                            {newRecipientErrors.name && (
                              <p className="absolute mt-[4px] text-[11px] text-red-500">{newRecipientErrors.name}</p>
                            )}
                          </div>
                        </div>

                        <div className="!mt-[1.5rem] space-y-2">
                          <label htmlFor="accountNumber" className="block text-sm font-medium">
                            Account Number (Enter the last 12 digits)
                          </label>
                          <div className='relative'>
                            <input id="accountNumber" type="text" value={newRecipient.accountNumber} placeholder="Enter account number"
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^\d\s]/g, "")
                                setNewRecipient(user=> ({...user, accountNumber: value}))
                              }}
                              onBlur={()=> validateAccountDetails('accountNumber')}
                              className={`w-full px-3 py-2 border text-[14px] placeholder:text-[12px] ${
                                newRecipientErrors.accountNumber ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                                  } rounded-md focus:outline-none focus:border-none focus-within:ring-0 focus:ring-2
                                     focus:ring-secondary dark:bg-gray-800`}/>
                            {newRecipientErrors.accountNumber && (
                              <p className="absolute mt-[4px] text-[11px] text-red-500"> {newRecipientErrors.accountNumber} </p>
                            )}
                          </div>
                        </div>

                        <button type="button" onClick={handleAddNewRecipient} className="w-full !mt-[1.5rem] px-4 py-2 text-sm
                         font-medium text-white bg-secondary rounded-md hover:bg-purple-700 focus:outline-none
                          focus:border-none focus:ring-purple-700">
                          Save Recipient
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className='flex gap-[1rem] text-[14px] text-secondary tracking-[0.3px]'>
                          <HeartPlus className='w-[50px] h-[25px] text-muted'/>
                          Add a beneficiary/recepient accouny to securely transfer funds from your FitLab wallet. Simply enter
                          their account number and name to send money anytime with ease.
                        </p>
                        <button type="button" onClick={()=> setIsAddingNewRecipient(true)}  className="mt-[1rem] w-full flex 
                          items-center justify-center text-[15px] gap-2 border border-dashed p-[7px] rounded-md text-gray-500
                           hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50
                            dark:hover:bg-gray-800">
                          <Plus className="h-4 w-4" />
                          Add New Recipient
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 border border-dashed border-inputBorderLow rounded-lg">
                      <div className="flex items-center mb-2">
                        <User className="h-5 w-5 text-secondary dark:text-gray-400 mr-2" />
                        <span className="text-[15px] font-medium"> Recipient </span>
                        <button type="button" onClick={()=> setSelectedRecipient(null)}
                          className="ml-auto text-[12px] text-blue-600 dark:text-blue-400 hover:underline">
                          Change
                        </button>
                      </div>
                      <div className="pl-7">
                        <p className="text-[14px] font-[400]"> {selectedRecipient.name} </p>
                        <div className="flex items-center mt-1">
                          <CreditCard className="h-[15px] w-[15px] text-gray-500 dark:text-gray-400 mr-1" />
                          <span className="text-[12px] text-gray-600 dark:text-gray-300">
                            {selectedRecipient.accountNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="amount" className="block text-[14px] font-medium">
                        Amount to Send
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-[15px] w-[15px] dark:text-gray-400" />
                        <input id="amount" type="text" value={transferAmount} onChange={handleTransferAmountChange} placeholder="0.00"
                          className={`w-full pl-10 pr-4 py-2 border text-[15px] text-secondary placeholder:text-[13px] ${
                            transferError ? "border-red-500 dark:border-red-500"
                              : "border-gray-300 dark:border-gray-600"
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800`}/>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-[12px] text-gray-500 dark:text-gray-400">
                          Available: ₹{walletBalance.toFixed(2)}
                        </span>
                        {transferError && (
                          <span className="text-red-500 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Invalid amount
                          </span>
                        )}
                      </div>
                    </div>

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

                    {transferAmount &&
                      !isNaN(Number.parseFloat(transferAmount)) &&
                      Number.parseFloat(transferAmount) > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md mt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium"> You're sending </span>
                            <span className="text-secondary font-bold"> ₹{Number.parseFloat(transferAmount).toFixed(2)} </span>
                          </div>
                          <div className="flex items-center text-[13px] text-gray-600 dark:text-gray-400 mt-1">
                            <span> Your walle t</span>
                            <ArrowRight className="h-3 w-3 mx-2" />
                            <span> {selectedRecipient.name} </span>
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
                    setSelectedRecipient(null)
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300
                   rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800
                    dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">
                  Cancel
                </button>

                {selectedRecipient && (
                  <button type="submit"
                    disabled={
                      !transferAmount || isNaN(Number.parseFloat(transferAmount)) || Number.parseFloat(transferAmount) <= 0 
                      || Number.parseFloat(transferAmount) > walletBalance || !transferConfirmationChecked}
                    className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-md hover:bg-purple-700
                     focus:outline-none focus:ring-2 focus:ring-purple-700 disabled:opacity-50 disabled:cursor-not-allowed
                      disabled:hover:bg-purple-400">
                    Send Money
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    )
}