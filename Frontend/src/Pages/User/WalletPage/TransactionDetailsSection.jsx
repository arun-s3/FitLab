import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import { ArrowDown, ArrowUp, ChevronRight, Pause, BanknoteArrowUp, BanknoteArrowDown, BanknoteX, Check, X } from "lucide-react"
import {toast} from 'react-toastify'
import {format} from "date-fns" 

import {confirmMoneyRequest, declineMoneyRequest, resetWalletStates} from '../../../Slices/walletSlice'
import {capitalizeFirstLetter} from '../../../Utils/helperFunctions'



export default function TransactionDetailsSection({transactions}){


    const [tooltip, setTooltip] = useState({id: '', showConfirm: false, showCancel: false})

    const dispatch = useDispatch()
    const {moneyRequestConfirmed, moneyRequestDeclined} = useSelector(state=> state.wallet)
    
    useEffect(()=> { 
      if(moneyRequestConfirmed){
        toast.success('Money request confirmed and amount transferred successfully!')
        dispatch(resetWalletStates())
      }
      if(moneyRequestDeclined){
        toast.success('Money request declined successfully!')
        dispatch(resetWalletStates())
      }
    },[moneyRequestConfirmed, moneyRequestDeclined])


    const getTransactionTypeStyle = (type, status)=> {
        switch(type){
            case 'credit': 
                return {color: 'text-green-500', bg: 'bg-green-100', icon: ArrowDown, symbol: '+'}
            case 'debit':
                return {color: 'text-red-500', bg: 'bg-red-100', icon: ArrowUp, symbol: '-'}
            case 'request_sent':
                { 
                  let icon = Pause
                  let color = 'text-[#f1c40f]' 
                  let bg = 'bg-[#f5ffbd]' 
                  if(status === 'success'){
                    icon = BanknoteArrowDown
                    color = 'text-green-500'
                    bg = 'bg-green-100'
                  }
                  if(status === 'failed'){
                    icon = BanknoteX 
                    color = 'text-red-500'
                    bg = 'bg-red-100'
                  }
                  return {color, bg, border: 'border-[#f1c40f]', icon, symbol: '#'}
                }
            case 'request_received':
              { 
                let icon = Pause
                let color = 'text-[#f1c40f]'
                let bg = 'bg-[#f5ffbd]'
                if(status === 'success'){
                  icon = BanknoteArrowUp
                }
                if(status === 'failed'){
                  icon = BanknoteX 
                  color = 'text-red-500'
                  bg = 'bg-red-100'
                }
                return {color, bg, border: 'border-[#d7f148]', icon, symbol: '#'}
              }
        }
    }

    const getTransactionStatusStyle = (status)=> {
      switch(status){
        case 'pending': 
            return 'bg-yellow-100 text-yellow-800'
        case 'success':
            return 'bg-green-100 text-green-800 '
        case 'failed':
            return 'bg-red-100 text-red-800 '
      }
    }

    const getTransactionSource = (detailsObj)=> {
        if(detailsObj.type === 'fitlab') return 'fitlab'
        else if(detailsObj.type === 'gateway') return capitalizeFirstLetter(detailsObj.account + ' ' + '(credited by you)')
        else if(detailsObj.type === 'user') return `User (${detailsObj.account})`
    }   


    return (
        <section className="bg-white shadow-sm rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[16px] capitalize tracking-[0.3px] font-semibold">Recent transactions</h2>
                { transactions && transactions?.length > 0 &&
                  <button className="text-[13px] text-purple-500 flex items-center gap-1 hover:underline focus:outline-none">
                    View all
                    <ChevronRight className="w-[14px] h-[14px]" />
                  </button>
                }
              </div>  
                {
                transactions && transactions?.length > 0 ?
                <table cellSpacing={10} cellPadding={10} className="w-full border-separate border-spacing-y-2">
                  {
                    transactions.map(transaction=> (
                      (
                        ()=> {
                            const transactionColor = getTransactionTypeStyle(transaction.type, transaction.status).color
                            const transactionBg = getTransactionTypeStyle(transaction.type, transaction.status).bg
                            const transactionBorder = transaction.status === 'pending' 
                                                        ? getTransactionTypeStyle(transaction.type).border : ''
                            const TransactionIcon = getTransactionTypeStyle(transaction.type, transaction.status).icon
                            const TransactionSymbol = getTransactionTypeStyle(transaction.type).symbol

                            const statusStyle = getTransactionStatusStyle(transaction.status)

                            return (
                                <tr key={transaction._id}> 
                                    <td className={` 
                                        ${transactionBorder && `border border-dashed border-r-0 rounded-[7px] ${transactionBorder}`}`}>
                                      <div className='flex items-center gap-[5px]'>
                                        <span className={`${transactionBg} rounded-full p-[5px]`}>
                                          <TransactionIcon className={`h-4 w-4 ${transactionColor}`} />
                                        </span>
                                        <span className="text-[13px] font-medium">
                                          {transaction.createdAt && format( new Date(transaction.createdAt), "MMMM dd, yyyy" )}
                                        </span>
                                      </div>
                                    </td>
                                    <td className={`${transactionColor} font-medium 
                                     ${transactionBorder && `border border-dashed border-x-0 ${transactionBorder}`}`}>
                                      <span>
                                      { `${TransactionSymbol}` }
                                      </span>
                                      <span> ₹ {transaction.amount} </span>
                                    </td>
                                    <td className={`text-sm text-secondary
                                     ${transactionBorder && `border border-dashed border-x-0 ${transactionBorder}`}`}>
                                        {getTransactionSource(transaction.transactionAccountDetails)} 
                                    </td>
                                    <td className={`text-sm text-muted 
                                        ${transactionBorder && `border border-dashed border-x-0 ${transactionBorder}`}`}> 
                                     <span className="font-medium"> Notes: </span>
                                     <span className="">
                                      {
                                        transaction.notes ? 
                                        transaction.notes.length > 25 
                                            ? capitalizeFirstLetter(transaction.notes.slice(0,25)) + '...' 
                                            : capitalizeFirstLetter(transaction.notes)
                                        : '---'
                                      } 
                                     </span>
                                    </td>
                                    <td className={`${transactionBorder && `border border-dashed border-l-0 rounded-[7px] ${transactionBorder}`}`}>
                                        <span className={`${statusStyle} px-3 py-1 text-[13px] capitalize rounded-[6px]`}>
                                            { transaction.status }
                                        </span>
                                    </td>
                                    {
                                      transaction.type === 'request_received' && transaction.status === 'pending' &&
                                      <td>
                                        <div className='flex flex-col gap-[10px]'>
                                          <div className='relative group cursor-pointer'
                                            onMouseEnter={()=> setTooltip(status=> ({...status, id: transaction._id, showConfirm: true}))}
                                              onMouseLeave={()=> setTooltip(status=> ({...status, showConfirm: false}))}
                                                onClick={()=> dispatch( confirmMoneyRequest({transaction_id: transaction._id}) )}>
                                            <Check className='w-[20px] h-[20px] p-[3px] text-green-500 bg-green-200 rounded-[12px]
                                              border border-green-500'/>
                                            <span className={`absolute bottom-[1.3rem] right-[1rem] whitespace-nowrap
                                             bg-gray-800 text-white text-xs rounded px-2 py-1  
                                               ${tooltip.id === transaction._id && tooltip.showConfirm ? 'opacity-100' : 'opacity-0'}
                                                transition-all duration-300 z-10`}>
                                              { `Confirm And Send ₹ ${transaction.amount}` }
                                            </span>
                                          </div >
                                          <div className='relative group inline-block cursor-pointer'
                                            onMouseEnter={()=> setTooltip(status=> ({...status, id: transaction._id, showCancel: true}))}
                                              onMouseLeave={()=> setTooltip(status=> ({...status, showCancel: false}))}
                                                onClick={()=> dispatch( declineMoneyRequest({transaction_id: transaction._id}) )}>
                                            <X className='mt-[10px] w-[20px] h-[20px] p-[3px] text-red-500 border bg-red-200
                                             rounded-[12px] border-red-500'/>
                                            <span className={`absolute bottom-[1.3rem] right-[1rem] whitespace-nowrap
                                             bg-gray-800 text-white text-xs rounded px-2 py-1 
                                              ${tooltip.id === transaction._id && tooltip.showCancel ? 'opacity-100' : 'opacity-0'}
                                               transition-opacity duration-300 z-10`}>
                                              Decline Request
                                            </span>
                                          </div>
                                        </div>
                                      </td>
                                    }
                                </tr>
                            )
                        }
                      ) ()
                    ))
                  }
                </table>
                : <p className="ml-[5px] text-[13px] text-muted capitalize tracking-[0.2px]"> 
                    You haven't made any transactions yet ! 
                  </p>
              } 
            </div>
        </section>
    )
}