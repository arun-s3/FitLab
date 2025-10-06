import React, {useEffect, useState} from 'react'
import './TransactionFilters.css'
import {motion} from "framer-motion"

import {ChevronDown, Check, ChevronUp, ArrowLeftRight, BanknoteX, LaptopMinimalCheck, FileChartColumn} from "lucide-react"

import {DateSelector} from '../../../Components/Calender/Calender'
import {camelToCapitalizedWords} from "../../../Utils/helperFunctions"


export default function TransactionFilters({queryOptions, setQueryOptions, close}){

    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)

    const [statusValue, setStatusValue] = useState({show: false, value: 'all'})
    const [paymentMethod, setPaymentMethod] = useState({show: false, value: 'all'})

    const status = ["all", "success", "pending", "failed"]

    const transactionType = ["all", "debit", "credit"]

    const paymentMethods = ["all", "wallet", "razorpay", "paypal", "stripe"]   

    useEffect(()=> {
        if(paymentMethod.value || statusValue.value|| startDate || endDate){
            setQueryOptions(query=> ({...query, paymentMethod: paymentMethod.value, status: statusValue.value, startDate, endDate})) 
        }
    },[statusValue, paymentMethod, startDate, endDate])

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.3,
          when: "beforeChildren",
          staggerChildren: 0.15, 
        },
      },
      exit: {
          opacity: 0,
          y: -15,
          scale: 0.98,
          transition: { duration: 0.25, ease: "easeInOut" }
        }
    }
  
    const childVariants = {
      hidden: { opacity: 0, y: 25 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
      },
    }

    const getStatusIcon = (statusValue)=> {
      switch(statusValue){
        case "all":
          return FileChartColumn
        case "success":
          return LaptopMinimalCheck
        case "pending":
          return ArrowLeftRight
        case "failed":
          return BanknoteX
      }
    }
    
    const getPaymentMethodIcon = (paymentMethod)=> {
        switch(paymentMethod){
          case "all":
            return Check
          case "wallet":
            return '/wallet.png'
          case "razorpay":
            return './razorpay.png'
          case "paypal":
            return '/paypal.png'
          case "stripe":
            return '/stripe.png'
        }
    }

    const radioClickHandler = (e, type)=>{
      const value = e.target.value
      console.log("type-->", type)
      console.log("value---->", value)
      const checkStatus = queryOptions.type === value
      console.log("checkStatus-->", checkStatus)
      if(checkStatus){
          console.log("returning..")
          return
      }else{
          console.log("Checking radio..")
          setQueryOptions(query=> {
            return {...query, type: value}
          })
          const changeEvent = new Event('change', {bubbles:true})
          e.target.dispatchEvent(changeEvent)
      }
    }
    
    const radioChangeHandler = (e, value)=>{
      e.target.checked = (queryOptions.type === value)
    }


    return(
        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-[280px] t:w-[310px] mob:w-[310px] xxs-sm:w-[350px] xs-sm2:w-[380px] xs-sm:w-[400px] s-sm:w-[450px]
            x-sm:w-[480px] l-md:w-[500px] bg-white pt-[20px] pb-[25px] px-[25px] mob:px-[20px] xs-sm2:px-[25px]
            border border-borderLight2 rounded-[8px] shadow-[0_2px_5px_rgba(0,0,0,0.04)]"
          id="TransactionFilters"
          onClick={(e)=> e.stopPropagation()}
        >
            <motion.h4
              variants={childVariants}
              className=" text-[16px] mob:text-[15px] s-sm:text-[16px] font-[600] text-secondary tracking-[1.1px] text-center mob:text-left"
            >
              Filter
            </motion.h4>

            <motion.div
              variants={childVariants}
              className="flex flex-col gap-[1rem] mt-[1rem] max-h-[75vh] scroll-smooth"
              id="filters"
            >
              <motion.div 
                variants={childVariants}
                className="w-full">
                <DateSelector
                  dateGetter={{ startDate, endDate }}
                  dateSetter={{ setStartDate, setEndDate }}
                  labelNeeded={true}
                  strokeColor="#7d7c8c"
                />
              </motion.div>

              <motion.div 
                variants={childVariants}
                className="w-full">
                <h5 className="filter-label text-[13px] mob:text-[12px]">Status</h5>
                <div
                  className="relative w-full h-[36px] mob:h-[34px] px-[10px] py-[8px] text-[13px] mob:text-[12px] 
                    text-muted bg-white flex items-center gap-[10px] justify-center border border-dropdownBorder 
                    rounded-[4px] shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={ ()=> setStatusValue((statusValue) => ({ ...statusValue, show: !statusValue.show })) }
                >
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-[5px]">
                      {(() => {
                        const StatusIcon = getStatusIcon(statusValue.value);
                        return <StatusIcon className="w-[13px] h-[13px] text-muted" />;
                      })()}
                      <span className="text-[12px] font-[470] text-secondary truncate">
                        {camelToCapitalizedWords(statusValue.value)}
                      </span>
                    </div>
                    {statusValue.show ? (
                      <ChevronUp className="h-[15px] w-[15px] text-muted" />
                    ) : (
                      <ChevronDown className="h-[15px] w-[15px] text-muted" />
                    )}
                  </div>
                  {statusValue.show && (
                    <motion.ul
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="list-none w-full px-[10px] py-[1rem] absolute top-[40px] right-0 flex flex-col gap-[10px]
                        justify-center text-[11px] bg-white border border-borderLight2 rounded-[8px] z-[5] cursor-pointer"
                      onMouseLeave={()=> setStatusValue((statusValue) => ({ ...statusValue, show: false }))}
                    >
                      {status &&
                        status.map((type) => (
                          <motion.li
                            variants={childVariants}
                            key={type}
                            onClick={(e) => {
                              e.stopPropagation()
                              setStatusValue({ show: false, value: type })
                            }}
                          >
                            <span
                              className={`w-full h-[26px] pl-[8px] flex items-center gap-[7px] rounded-[5px] hover:text-primaryDark
                                 hover:bg-[#F5FBD2] ${statusValue.value === type ? 'text-primaryDark' : 'text-muted'} `}
                            >
                              {(() => {
                                const StatusIcon = getStatusIcon(type);
                                return <StatusIcon className="w-[14px] h-[14px]" />
                              })()}
                              <span className="text-[13px] capitalize truncate">
                                {camelToCapitalizedWords(type)}
                              </span>
                            </span>
                          </motion.li>
                        ))}
                    </motion.ul>
                  )}
                </div>
              </motion.div>
                
              <motion.div 
                variants={childVariants}
                className="w-full flex flex-col mob:flex-col xs-sm:flex-row xs-sm:items-center xs-sm:justify-between gap-[0.5rem]">
                <h5 className="filter-label text-[13px] mob:text-[12px]"> Transaction Type </h5>
                <ul className="list-none flex flex-wrap items-center gap-[0.8rem] mob:gap-[0.6rem]">
                  {transactionType.map((type) => (
                    <motion.li 
                      key={type} 
                      className="flex items-center gap-[5px]"
                      variants={childVariants}
                    >
                      <input
                        type="radio"
                        value={type}
                        onClick={(e)=> radioClickHandler(e, type)}
                        onChange={(e)=> radioChangeHandler(e, type)}
                        id={`${type}Type`}
                        checked={queryOptions.type === type}
                        className="!w-[11px] !h-[11px] text-secondary focus:ring-2 cursor-pointer"
                      />
                      <label
                        htmlFor={`${type}Type`}
                        className="capitalize text-[12px] mob:text-[11px] text-muted font-[500]"
                      >
                        {type}
                      </label>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
                
              <motion.div 
                variants={childVariants}
                className="w-full">
                <h5 className="filter-label text-[13px] mob:text-[12px]"> Payment Methods </h5>
                <div
                  className="relative w-full h-[36px] mob:h-[34px] px-[10px] py-[8px] text-[13px] mob:text-[12px] 
                    text-muted bg-white flex items-center gap-[10px] justify-center border border-dropdownBorder 
                    rounded-[4px] shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={ ()=> setPaymentMethod((type) => ({ ...type, show: !paymentMethod.show })) }
                >
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-[5px]">
                      {(() => {
                        const Icon = getPaymentMethodIcon(paymentMethod.value)
                        return paymentMethod.value === 'all' ? (
                          <Icon className="w-[15px] h-[15px]" />
                        ) : (
                          <img
                            src={Icon}
                            className={`${ paymentMethod.value === 'stripe'  ? 'w-[22px] h-[22px]' : 'w-[15px] h-[15px]' }`}
                          />
                        )
                      })()}
                      <span className="text-[12px] font-[470] text-secondary truncate">
                        {paymentMethod.value}
                      </span>
                    </div>
                    {paymentMethod.show ? (
                      <ChevronUp className="h-[15px] w-[15px] text-muted" />
                    ) : (
                      <ChevronDown className="h-[15px] w-[15px] text-muted" />
                    )}
                  </div>
                  {paymentMethod.show && (
                    <motion.ul
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="list-none w-full px-[10px] py-[1rem] absolute top-[40px] right-0 flex flex-col gap-[10px] justify-center 
                        text-[11px] bg-white border border-borderLight2 rounded-[8px] z-[5] cursor-pointer"
                      onMouseLeave={()=> setPaymentMethod((type) => ({ ...type, show: false }))}
                    >
                      {paymentMethods &&
                        paymentMethods.map((type)=> (
                          <motion.li
                            variants={childVariants}
                            key={type}
                            onClick={(e)=> {
                              e.stopPropagation()
                              setPaymentMethod({ show: false, value: type })
                            }}
                          >
                            <span
                              className={`w-full h-[26px] pl-[8px] flex items-center gap-[7px] rounded-[5px] hover:text-primaryDark 
                                hover:bg-[#F5FBD2] ${paymentMethod.value === type ? 'text-primaryDark' : 'text-muted'} `}
                            >
                              {(() => {
                                const Icon = getPaymentMethodIcon(type)
                                return type === 'all' ? (
                                  <Icon className="w-[15px] h-[15px]" />
                                ) : (
                                  <img
                                    src={Icon}
                                    className={`${ type === 'stripe' ? 'w-[22px] h-[22px]'  : 'w-[15px] h-[15px]' }`}
                                  />
                                )
                              })()}
                              <span className="text-[13px] capitalize truncate"> {type} </span>
                            </span>
                          </motion.li>
                        ))}
                    </motion.ul>
                  )}
                </div>
              </motion.div>
                
              <motion.div
                variants={childVariants}
                className="w-full flex items-center gap-[6px]  text-[11px] mob:text-[10px]"
                id="user-level-transaction"
              >
                <input
                  type="checkbox"
                  id="userTransaction"
                  className="mt-[3px] h-[13px] w-[13px]"
                  onChange={(e)=> setQueryOptions((query) => ({...query, userLevel: !query.userLevel })) }
                  checked={queryOptions?.userLevel || false}
                />
                <label htmlFor="userTransaction" className="mt-[3px] font-[480] normal-case leading-[1.4]">
                  User-level transactions only (Debit/Credit to/from other users)
                </label>
              </motion.div>
            </motion.div>
        </motion.main>
    )
}