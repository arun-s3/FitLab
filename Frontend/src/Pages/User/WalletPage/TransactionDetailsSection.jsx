import React, {useState, useEffect, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import { ArrowDown, ArrowUp, ChevronRight, FunnelPlus, ArrowUpDown, Pause, BanknoteArrowUp, BanknoteArrowDown, 
  BanknoteX, Check, X } from "lucide-react"
import {toast} from 'react-toastify'
import {format} from "date-fns" 

import useStickyDropdown from '../../../Hooks/StickyDropdown'
import useFlexiDropdown from '../../../Hooks/FlexiDropdown'
import TransactionFilters from './TransactionFilters'
import {confirmMoneyRequest, declineMoneyRequest, resetWalletStates} from '../../../Slices/walletSlice'
import {capitalizeFirstLetter} from '../../../Utils/helperFunctions'
import AuthPrompt from '../../../Components/AuthPrompt/AuthPrompt'
import PaginationV2 from '../../../Components/PaginationV2/PaginationV2'



export default function TransactionDetailsSection({transactions, queryOptions, setQueryOptions}){


    const [tooltip, setTooltip] = useState({id: '', showConfirm: false, showCancel: false})

    const [sliceIt, setSliceIt] = useState(3)

    const {openStickyDropdowns, stickyDropdownRefs, toggleStickyDropdown} = useStickyDropdown(['filterDropdown'])
    const [advFilterEvent, setAdvFilterEvent] = useState(null)

    const {openDropdowns, dropdownRefs, toggleDropdown} = useFlexiDropdown(['sortDropdown'])
    
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = 20

    const dispatch = useDispatch()
    const {moneyRequestConfirmed, moneyRequestDeclined} = useSelector(state=> state.wallet)
    const {user} = useSelector((state)=> state.user)

    const sortTypes = [
      {name: 'Recent to Oldest Transactions', value: '-1', sortBy: 'createdAt'}, {name: 'Oldest to Recent Transactions', value: '1', sortBy: 'createdAt'},
      {name: 'Biggest to smallest amount', value: '-1', sortBy: 'amount'}, {name: 'Smallest to biggest amount', value: '1', sortBy: 'amount'}
    ]
    
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

    useEffect(()=> {
      setQueryOptions(query=> {
        return {...query, page: currentPage}
      })
    },[currentPage])


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

    const radioClickHandler = (e, sortBy)=>{
      const value = Number.parseInt(e.target.value)
      console.log("value---->", value)
      const checkStatus = queryOptions.sort === value
      console.log("checkStatus-->", checkStatus)
      if(checkStatus){
          console.log("returning..")
          return
      }else{
          console.log("Checking radio..")
          setQueryOptions(query=> {
            return {...query, sort: value, sortBy}
          })
          const changeEvent = new Event('change', {bubbles:true})
          e.target.dispatchEvent(changeEvent)
      }
    }
  
    const radioChangeHandler = (e, value, sortBy)=>{
      e.target.checked = (queryOptions.sort === Number.parseInt(value))
    }


    return (
        <section className="bg-white shadow-sm rounded-lg" id='TransactionDetailsSection'>
            <div className="px-6 pt-6">
              <div className="flex justify-between items-center mb-4">
              <h2 className="relative text-[16px] capitalize tracking-[0.3px] font-semibold flex items-center gap-[10px]"
                ref={stickyDropdownRefs.filterDropdown}>
                <span> Recent transactions </span>
                <FunnelPlus className='w-[23px] h-[23px] p-[3px] text-muted border border-inputBorderLow rounded-[4px]
                  hover:text-secondary hover:shadow-md hover:border-muted hover:bg-whitesmoke hover:scale-105
                     transition-all duration-200 cursor-pointer'
                      onClick={(e)=> {
                       toggleStickyDropdown(e, 'filterDropdown')
                       setAdvFilterEvent(e)
                       }}
                        id='sort-options'/>

                {openStickyDropdowns.filterDropdown && 
                  <div className='absolute top-[2rem] left-[10.3rem] z-[10]'>

                    <TransactionFilters queryOptions={queryOptions} setQueryOptions={setQueryOptions} 
                      close={()=> {toggleStickyDropdown(advFilterEvent, 'filterDropdown'); setAdvFilterEvent(null)}}/> 

                  </div>
                }
                <div className='relative' onClick={(e)=> toggleDropdown('sortDropdown')} id='sort-options' 
                  ref={dropdownRefs.sortDropdown}>
                  <ArrowUpDown className='w-[23px] h-[23px] p-[3px] text-muted border border-inputBorderLow rounded-[4px]
                    hover:text-secondary hover:shadow-md hover:border-muted hover:bg-whitesmoke hover:scale-105
                       transition-all duration-200 cursor-pointer' />

                  {openDropdowns.sortDropdown && 
                    <ul className='list-none w-[13rem] px-[10px] py-[1rem] absolute top-[2rem] right-[-11.5rem] flex flex-col gap-[10px]
                       justify-center text-[10px] bg-white border border-borderLight2 rounded-[8px] z-[5] cursor-pointer'>
                        {
                         sortTypes.map(sortType=> (
                           <li key={`${sortType.value}-${sortType.sortBy}`}> 
                            <span className='flex items-center gap-[6px]'>  
                                <input type='radio' value={sortType.value} className='!w-[12px] !h-[12px]
                                text-secondary focus:ring-2 focus:border-none focus:outline-none cursor-pointer'
                                    onClick={(e)=> radioClickHandler(e, sortType.sortBy)}
                                      onChange={(e)=> radioChangeHandler(e, sortType.value, sortType.sortBy)} 
                                        checked={queryOptions.sort === Number(sortType.value) && queryOptions.sortBy === sortType.sortBy}/>
                                <span className='mt-[1px] text-[10px] text-muted font-[480]'> {sortType.name} </span>
                            </span>
                           </li>
                         ))
                        }
                    </ul>
                  }
                </div>

              </h2>
              { 
              transactions && transactions?.length > 0 &&
                <button className="text-[13px] text-purple-500 flex items-center gap-1 hover:underline focus:outline-none cursor-pointer"
                  onClick={()=> sliceIt === 3 ? setSliceIt(6) : setSliceIt(3)}>
                    { sliceIt === 3 ? 'View more' : 'View less' }
                  <ChevronRight className="w-[14px] h-[14px]" /> 
                </button>
              }


              </div>  
                {
                transactions && transactions?.length > 0 ?
                <table cellSpacing={10} cellPadding={10} className="w-full border-separate border-spacing-y-2">
                  {
                    transactions.slice(0, sliceIt).map(transaction=> (
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
            
            {
              !user &&
                <div className='flex justify-center'>
                
                  <AuthPrompt />

                </div>
            }

            <div className='mb-[1rem]'>
            
              <PaginationV2 currentPage={currentPage} totalPages={totalPages} bgColorStyle='bg-primary' 
                onPageChange={(page)=> {setCurrentPage(page); setSliceIt(6);}} />
            
            </div>

        </section>
    )
}