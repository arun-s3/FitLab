import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {motion} from 'framer-motion'

import { ArrowDown, ArrowUp, ChevronRight, FunnelPlus, ArrowUpDown, Pause, Banknote, BanknoteArrowUp, BanknoteArrowDown, 
  BanknoteX, Check, X } from "lucide-react"
import {toast as sonnerToast} from 'sonner'
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
    
    const [limit, setLimit] = useState(6) 
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(20)         

    const dispatch = useDispatch()
    const {moneyRequestConfirmed, moneyRequestDeclined, transactionsCount} = useSelector(state=> state.wallet)
    const {user} = useSelector((state)=> state.user)

    const sortTypes = [
      {name: 'Recent to Oldest Transactions', value: '-1', sortBy: 'createdAt'}, {name: 'Oldest to Recent Transactions', value: '1', sortBy: 'createdAt'},
      {name: 'Biggest to smallest amount', value: '-1', sortBy: 'amount'}, {name: 'Smallest to biggest amount', value: '1', sortBy: 'amount'}
    ]
    
    useEffect(()=> { 
      if(moneyRequestConfirmed){
        sonnerToast.success('Money request confirmed and amount transferred successfully!')
        dispatch(resetWalletStates())
      }
      if(moneyRequestDeclined){
        sonnerToast.success('Money request declined successfully!')
        dispatch(resetWalletStates())
      }
    },[moneyRequestConfirmed, moneyRequestDeclined])

    useEffect(()=> {
      if(transactionsCount && totalPages && limit){
        console.log(`transactionsCount-----> ${transactionsCount}, totalPages------>${totalPages}, limit------>${limit}`)
        setTotalPages(Math.ceil(transactionsCount/limit))
      }
    }, [transactions, transactionsCount])

    useEffect(()=> {
      setQueryOptions(query=> {
        return {...query, page: currentPage, limit}
      })
    },[currentPage, limit])

    const containerVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.4,
          ease: "easeOut",
          when: "beforeChildren",
          staggerChildren: 0.07,
        },
      },
    }

    const rowVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    }

    const headerVariants = {
      hidden: { opacity: 0, y: -10 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    }


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
          case 'auto-recharge': 
              return {color: 'text-green-500', bg: 'bg-green-100', icon: ArrowDown, symbol: '+'}
          default:
            return {color: 'text-muted', bg: 'bg-muted', icon: Banknote, symbol: '#'}
        }
    }

    const getTransactionStatusStyle = (status)=> {
      switch(status){
        case 'pending': 
            return 'bg-yellow-100 text-yellow-800'
        case 'success':
            return 'bg-green-100 text-green-800 '
        case 'refunded':
            return 'bg-green-100 text-green-800 '
        case 'failed':
            return 'bg-red-100 text-red-800 '
      }
    }

    const getTransactionSource = (detailsObj, type)=> {
        if(detailsObj.type === 'fitlab') return 'fitlab'
        else if(detailsObj.type === 'gateway') 
          return capitalizeFirstLetter(detailsObj.account + ' ' + `( ${type === 'auto-recharge' ? 'Auto-recharge credit' : 'Credited by you'})`)
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
      <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 bg-white shadow-sm rounded-lg w-full" 
          id="TransactionDetailsSection"
      >
        <div className={`px-3 mob:px-4 s-sm:px-5 md:px-6 pt-5 md:pt-6 
           ${openStickyDropdowns.filterDropdown ? 'overflow-x-visible' : 'overflow-x-auto '}`}>

          <motion.div 
            className="flex flex-wrap justify-between items-center gap-3 mb-4"
            variants={headerVariants}
          >
            <h2
              className="relative text-[14px] mob:text-[15px] md:text-[16px] capitalize tracking-[0.3px] font-semibold 
                flex items-center gap-[8px] flex-wrap"
              ref={stickyDropdownRefs.filterDropdown}
            >
              <span>Recent transactions</span>

              <FunnelPlus
                className="w-[21px] mob:w-[22px] h-[21px] mob:h-[22px] p-[3px] text-muted border border-inputBorderLow rounded-[4px]
                 hover:text-secondary hover:shadow-md hover:border-muted hover:bg-whitesmoke hover:scale-105
                  transition-all duration-200 cursor-pointer"
                onClick={(e) => {
                  toggleStickyDropdown(e, "filterDropdown");
                  setAdvFilterEvent(e);
                }}
                id="sort-options"
              />

              {openStickyDropdowns.filterDropdown && (
                <motion.div 
                  className="absolute top-[2.5rem] left-0 z-10"
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TransactionFilters
                    queryOptions={queryOptions}
                    setQueryOptions={setQueryOptions}
                    close={() => {
                      toggleStickyDropdown(advFilterEvent, "filterDropdown");
                      setAdvFilterEvent(null);
                    }}
                  />
                </motion.div>
              )}

              <div
                className="relative"
                onClick={() => toggleDropdown("sortDropdown")}
                id="sort-options"
                ref={dropdownRefs.sortDropdown}
              >
                <ArrowUpDown
                  className="w-[21px] mob:w-[22px] h-[21px] mob:h-[22px] p-[3px] text-muted border border-inputBorderLow rounded-[4px]
                   hover:text-secondary hover:shadow-md hover:border-muted hover:bg-whitesmoke hover:scale-105
                    transition-all duration-200 cursor-pointer"
                />

                {openDropdowns.sortDropdown && (
                  <ul className="list-none w-[12rem] mob:w-[13rem] px-[10px] py-[0.8rem] absolute top-[2.3rem] right-0
                        flex flex-col gap-[8px] justify-center text-[10px] bg-white border border-borderLight2 rounded-[8px] z-[5]
                        cursor-pointer shadow-md">
                    {sortTypes.map((sortType) => (
                      <li key={`${sortType.value}-${sortType.sortBy}`}>
                        <span className="flex items-center gap-[6px]">
                          <input
                            type="radio"
                            value={sortType.value}
                            className="!w-[12px] !h-[12px] text-secondary focus:ring-2 cursor-pointer"
                            onClick={(e) => radioClickHandler(e, sortType.sortBy)}
                            onChange={(e) => radioChangeHandler(e, sortType.value, sortType.sortBy)}
                            checked={
                              queryOptions.sort === Number(sortType.value) &&
                              queryOptions.sortBy === sortType.sortBy
                            }
                          />
                          <span className="text-[10px] mob:text-[11px] whitespace-nowrap text-muted font-medium
                              hover:text-secondary transition duration-300">
                            {sortType.name}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </h2>
              
            {transactions && transactions.length > 0 && (
              <motion.button
                className="text-[12px] mob:text-[13px] text-purple-500 flex items-center gap-1 hover:underline 
                  focus:outline-none cursor-pointer"
                onClick={() => (sliceIt === 3 ? setSliceIt(6) : setSliceIt(3))}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {sliceIt === 3 ? "View more" : "View less"}
                <ChevronRight className="w-[13px] mob:w-[14px] h-[13px] mob:h-[14px]" />
              </motion.button>
            )}
          </motion.div>
          
          {transactions && transactions.length > 0 ? (
            <div 
              className={`px-[5px] w-full 
               ${openStickyDropdowns.filterDropdown ? 'overflow-x-hidden' : 'overflow-x-auto '}`}>
              <table
                cellSpacing={10}
                cellPadding={10}
                className="w-full min-w-[620px] border-separate border-spacing-y-2 cursor-default"
              >
                {transactions.slice(0, sliceIt).map((transaction) => {
                  const transactionColor = getTransactionTypeStyle(transaction.type, transaction.status)?.color;
                  const transactionBg = getTransactionTypeStyle(transaction.type, transaction.status)?.bg;
                  const transactionBorder =
                    transaction.status === "pending"
                      ? getTransactionTypeStyle(transaction.type)?.border
                      : "";
                  const TransactionIcon = getTransactionTypeStyle(transaction.type, transaction.status)?.icon;
                  const TransactionSymbol = getTransactionTypeStyle(transaction.type)?.symbol;
                  const statusStyle = getTransactionStatusStyle(transaction.status);
                
                  return (
                    <motion.tr
                      key={transaction._id}
                      className="text-[12px] mob:text-[13px] sm:text-[14px] text-nowrap hover:bg-[rgba(245,245,245,0.6)]"
                      variants={rowVariants}
                      whileHover={{ scale: 1.01}}
                      transition={{ duration: 0.5 }}
                    >
                      <td className={`${transactionBorder && `border border-dashed border-r-0 rounded-[7px] ${transactionBorder}`}`}>
                        <div className="flex items-center gap-[5px]">
                          <span className={`${transactionBg} rounded-full p-[5px]`}>
                            <TransactionIcon className={`h-4 w-4 ${transactionColor}`} />
                          </span>
                          <span className="text-[12px] mob:text-[13px] font-medium whitespace-nowrap">
                            {transaction.createdAt &&
                              format(new Date(transaction.createdAt), "MMM dd, yyyy")}
                          </span>
                        </div>
                      </td>
                            
                      <td
                        className={`${transactionColor} font-medium ${
                          transactionBorder && `border border-dashed border-x-0 ${transactionBorder}`
                        }`}
                      >
                        {TransactionSymbol} ₹ {transaction.amount}
                      </td>
                      
                      <td
                        className={`text-secondary ${
                          transactionBorder && `border border-dashed border-x-0 ${transactionBorder}`
                        }`}
                      >
                        {getTransactionSource(transaction.transactionAccountDetails, transaction.type)}
                      </td>
                      
                      <td
                        className={`text-muted ${
                          transactionBorder && `border border-dashed border-x-0 ${transactionBorder}`
                        }`}
                      >
                        <span className="font-medium">Notes:</span>{" "}
                        <span>
                          {transaction.notes
                            ? transaction.notes.length > 25
                              ? capitalizeFirstLetter(transaction.notes.slice(0, 25)) + "..."
                              : capitalizeFirstLetter(transaction.notes)
                            : "---"}
                        </span>
                      </td>
                          
                      <td
                        className={`${
                          transactionBorder &&
                          `border border-dashed border-l-0 rounded-[7px] ${transactionBorder}`
                        }`}
                      >
                        <span
                          className={`${statusStyle} px-2 py-1 text-[12px] capitalize rounded-[6px]`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      
                      {transaction.type === "request_received" &&
                        transaction.status === "pending" && (
                          <td>
                            <div className="flex flex-col gap-[8px] items-center">
                              <div
                                className="relative group cursor-pointer"
                                onClick={() =>
                                  dispatch(confirmMoneyRequest({ transaction_id: transaction._id }))
                                }
                                onMouseEnter={()=> setTooltip(status=> ({...status, id: transaction._id, showConfirm: true}))}
                                onMouseLeave={()=> setTooltip(status=> ({...status, showConfirm: false}))}
                              >
                                <Check className="w-[18px] h-[18px] p-[3px] text-green-500 bg-green-200 rounded-[10px] border 
                                  border-green-500" />
                                <span
                                  className={`absolute bottom-[1.3rem] right-[0.5rem] whitespace-nowrap
                                    bg-gray-800 text-white text-xs rounded px-2 py-1
                                    opacity-0 group-hover:opacity-100 transition-all duration-300 z-10
                                    ${tooltip.id === transaction._id && tooltip.showConfirm ? 'opacity-100' : 'opacity-0'}
                                  `}
                                >
                                  Confirm And Send ₹{transaction.amount}
                                </span>
                              </div>
                                  
                              <div
                                className="relative group cursor-pointer"
                                onClick={() =>
                                  dispatch(declineMoneyRequest({ transaction_id: transaction._id }))
                                }
                                onMouseEnter={()=> setTooltip(status=> ({...status, id: transaction._id, showCancel: true}))}
                                onMouseLeave={()=> setTooltip(status=> ({...status, showCancel: false}))}
                              >
                                <X className="w-[18px] h-[18px] p-[3px] text-red-500 bg-red-200 rounded-[10px] border border-red-500" />
                                <span
                                  className={`absolute bottom-[1.3rem] right-[0.5rem] whitespace-nowrap
                                   bg-gray-800 text-white text-xs rounded px-2 py-1
                                    opacity-0 group-hover:opacity-100 transition-all duration-300 z-10
                                    ${tooltip.id === transaction._id && tooltip.showCancel ? 'opacity-100' : 'opacity-0'}
                                  `}
                                >
                                  Decline Request
                                </span>
                              </div>
                            </div>
                          </td>
                        )}
                    </motion.tr>
                  );
                })}
              </table>
            </div>
          ) : (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="ml-[5px] text-[13px] text-muted capitalize tracking-[0.2px]"
            >
              You haven't made any transactions yet!
            </motion.p>
          )}
        </div>

            
        {
          !user &&
            <div className='flex justify-center'>
            
              <AuthPrompt />

            </div>
        }

        <motion.div 
          className={`mb-[1rem] `}
          layout
          animate={{ marginTop: openStickyDropdowns.filterDropdown ? 160 : 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
         {
           transactions && totalPages &&
            <PaginationV2 currentPage={currentPage} totalPages={totalPages} bgColorStyle='mob:bg-primary max-mob:text-primary' 
            onPageChange={(page)=> {setCurrentPage(page); setSliceIt(6);}} />
         }
        
        </motion.div>

      </motion.section>
    )
}