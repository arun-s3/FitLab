import React, {useEffect, useRef, useState} from 'react'
import './TransactionFilters.css'

import {ChevronDown, Check, ChevronUp, ArrowLeftRight, BanknoteX, LaptopMinimalCheck, FileChartColumn} from "lucide-react"

import {DateSelector} from '../../../Components/Calender/Calender'
import {camelToCapitalizedWords} from "../../../Utils/helperFunctions"
import {SiteButtonSquare} from '../../../Components/SiteButtons/SiteButtons'


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


    // const submitFilters = ()=> {
    //   setQueryOptions(query=> ({...query, status: statusValue.value, paymentMethod: paymentMethod.value}))
    //   if(minimumOrderValue >= 0 && !isDisabled.minimumOrderValue){
    //     setQueryOptions(query=> ({...query, minimumOrderValue}))
    //   }
    //   if(usedCount >= 0 && !isDisabled.usedCount){
    //     setQueryOptions(query=> ({...query, usedCount}))
    //   }
    //   close()
    // }



    return(
        <main className='w-max bg-white pt-[20px] pb-[25px] px-[35px] border border-borderLight2 rounded-[8px]'
             id='TransactionFilters' onClick={(e)=> e.stopPropagation()}>    

        <h4 className='text-[17px] font-[600] text-secondary tracking-[1.3px]'> Filter </h4>

        <div className='flex flex-col gap-[1rem] mt-[1rem]' id='filters'>

            <div className='w-full'>

                <DateSelector dateGetter={{startDate, endDate}} dateSetter={{setStartDate, setEndDate}}
                     labelNeeded={true} strokeColor='#7d7c8c' />

            </div>

            <div className='w-full'>
                <h5 className='filter-label'> Status </h5>
                <div className='relative w-full h-[30px] px-[10px] py-[8px] text-[14px] text-muted bg-white flex items-center 
                    gap-[10px] justify-center border border-dropdownBorder rounded-[4px] shadow-sm cursor-pointer
                     hover:bg-gray-50 transition-colors optionDropdown sort-dropdown'
                         onClick={()=> setStatusValue(statusValue=> ({...statusValue, show: !statusValue.show}))}>
                     <div className='w-full flex items-center justify-between'>
                      <div className='flex items-center gap-[5px]'>
                       {
                         (()=> {
                           const StatusIcon = getStatusIcon(statusValue.value)
                           return <StatusIcon className='w-[13px] h-[13px] text-muted'/>
                         })()
                       }
                        <span className='text-[12px] font-[470] text-secondary'> 
                          { camelToCapitalizedWords(statusValue.value) } 
                        </span> 
                      </div>
                      {
                        statusValue.show ? <ChevronUp className='h-[15px] w-[15px] text-muted'/>
                          : <ChevronDown className='h-[15px] w-[15px] text-muted'/>
                      }
                     </div>
                     {statusValue.show &&
                     <ul className='list-none w-full px-[10px] py-[1rem] absolute top-[37px] right-0 flex flex-col gap-[10px] justify-center 
                             text-[10px] bg-white border border-borderLight2 rounded-[8px] z-[5] cursor-pointer'
                              onMouseLeave={()=> setStatusValue(statusValue=> ({...statusValue, show: false}))} >
                         {status &&
                          status.map(type=> (
                            <li key={type} onClick={(e)=> {
                              e.stopPropagation()
                              setStatusValue({show: false, value: type})
                            } }> 
                             <span className={`w-full h-[26px] pl-[8px] flex items-center gap-[7px] rounded-[5px] hover:text-primaryDark
                                 hover:bg-[#F5FBD2] ${statusValue.value === type ? 'text-primaryDark' : 'text-muted'}}`} onClick={()=> setStatusValue({show:false, value: type}) }>  
                                {
                                  (()=> {
                                    const StatusIcon = getStatusIcon(type)
                                    return <StatusIcon className={`w-[15px] h-[15px] text-inherit`}/>
                                  })()
                                }        
                                 <span className='text-[13px] capitalize'> { camelToCapitalizedWords(type) } </span>
                             </span>
                            </li>
                          ))
                         }
                      </ul>
                      }
                </div>
            </div>
                
            <div className='w-full flex items-center justify-between'>
                <h5 className='filter-label'> Transaction Type </h5>
                <ul className='list-none flex items-center gap-[1rem]'>
                    {
                     transactionType.map(type=> (
                       <li key={type} className='flex items-center gap-[5px]'> 
                            <input type='radio' value={type} onClick={(e)=> radioClickHandler(e, type)}
                                onChange={(e)=> radioChangeHandler(e, type)} id={`${type}Type`}
                                    checked={queryOptions.type === type} className='!w-[10px] !h-[10px]
                                     !text-secondary focus:ring-2 focus:border-none focus:outline-none cursor-pointer'/>
                            <label htmlFor={`${type}Type`} className='capitalize text-[12px] text-muted font-[500]'> {type} </label>
                       </li>
                     ))
                    }
                </ul>
            </div>

            <div className='w-full'>
                <div className='w-full'>
                <h5 className='filter-label'> Payment Methods </h5>
                <div className='relative w-full h-[30px] px-[10px] py-[8px] text-[14px] text-muted bg-white flex items-center 
                    gap-[10px] justify-center border border-dropdownBorder rounded-[4px] shadow-sm cursor-pointer
                     hover:bg-gray-50 transition-colors optionDropdown sort-dropdown'
                        onClick={()=> setPaymentMethod(type=> ({...type, show: !paymentMethod.show}))} >
                     <div className='w-full flex items-center justify-between'>
                      <div className='flex items-center gap-[5px]'>
                       {
                         (()=> {
                            const Icon = getPaymentMethodIcon(paymentMethod.value)
                            console.log("paymentMethod.value--->", paymentMethod.value)
                            return paymentMethod.value === 'all' ? <Icon className={`w-[15px] h-[15px] text-inherit`}/>
                                                    : <img src={Icon}
                                                        className={`${paymentMethod.value === 'stripe' ? 'w-[25px] h-[25px] object-cover' : 'w-[15px] h-[15px]'} `}/>
                          })()
                       }
                        <span className='text-[12px] font-[470] text-secondary'> 
                          { paymentMethod.value } 
                        </span> 
                      </div>
                      {
                        paymentMethod.show ? <ChevronUp className='h-[15px] w-[15px] text-muted'/>
                          : <ChevronDown className='h-[15px] w-[15px] text-muted'/>
                      }
                     </div>
                     {paymentMethod.show && 
                     <ul className='list-none w-full px-[10px] py-[1rem] absolute top-[37px] right-0 flex flex-col gap-[10px] justify-center 
                         text-[10px] bg-white border border-borderLight2 rounded-[8px] z-[5] cursor-pointer'
                            onMouseLeave={()=> setPaymentMethod(type=> ({...type, show:false}))}>
                         {paymentMethods &&
                          paymentMethods.map(type=> (
                            <li key={type} onClick={(e)=> {
                              e.stopPropagation()
                              setPaymentMethod({show: false, value: type}) 
                            }}> 
                             <span className={`w-full h-[26px] pl-[8px] flex items-center gap-[7px] rounded-[5px] hover:text-primaryDark
                                 hover:bg-[#F5FBD2] ${paymentMethod.value === type ? 'text-primaryDark' : 'text-muted'}}`}>  
                                { 
                                  (()=> {
                                    const Icon = getPaymentMethodIcon(type)
                                    console.log("type.value--->", type)
                                    return type === 'all' ? <Icon className={`w-[15px] h-[15px] text-inherit`}/>
                                                : <img src={Icon}
                                                     className={`${type === 'stripe' ? 'w-[25px] h-[25px] object-cover' : 'w-[15px] h-[15px]'} `}/>
                                  })()
                                }        
                                 <span className='text-[13px] capitalize'> {type} </span>
                             </span>
                            </li>
                          ))
                         }
                      </ul>
                      }
                </div>
            </div>
            </div>

            <div className='w-full flex items-start gap-[5px]' id='user-level-transaction'>
                <input type='checkbox' id='userTransaction' className="mt-[3px] h-[13px] w-[13px]"
                     onChange={(e)=> setQueryOptions(query=> ({...query, userLevel: !query.userLevel}))}
                                checked={ queryOptions?.userLevel || false }/>
                <label htmlFor='userTransaction' className='text-[11px] font-[480] normal-case'>
                    User-level transactions only (Debit/Credit to/from other users)
                </label>
            </div>

            {/* <div className='text-right'>
                <SiteButtonSquare customStyle={{paddingBlock: '3px', paddingInline: '28px', borderRadius:'4px'}}
                   light={true} lowFont={true} clickHandler={()=> submitFilters()}> 
                    Apply
                </SiteButtonSquare>
            </div> */}

            </div>
        </main>
    )
}