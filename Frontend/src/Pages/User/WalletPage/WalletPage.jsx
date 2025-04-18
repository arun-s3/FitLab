import React, {useState, useEffect, useContext} from "react"
import './WalletPage.css'
import {useNavigate, useLocation} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import { ArrowUp, Calendar, ChevronDown, ChevronRight, Clipboard, CloudLightningIcon as Lightning, PlusCircle,
  Share2, Tag, Users, Eye, EyeOff, Plus, Clock, CreditCard, Download} from "lucide-react"

import {UserPageLayoutContext} from '../UserPageLayout/UserPageLayout'


export default function WalletPage() {

    const {setBreadcrumbHeading, setContentTileClasses, setPageLocation} = useContext(UserPageLayoutContext)
    setBreadcrumbHeading('Wallet')

    const location = useLocation()
    setPageLocation(location.pathname)

    setContentTileClasses('basis-[85%] mt-[2rem]')

    const [accountNo, setAccountNo] = useState('724598567414')
    const [showAcNumber, setShowAcNumber] = useState(false)
    const [hiddenAccountNo, setHiddenAccountNo] = useState('')

    const membershipCredits = 3

    useEffect(()=> {
      if(accountNo){
        const hiddenAcNo = "**** ****" + " " + accountNo.slice(8)
        setHiddenAccountNo(hiddenAcNo)
      }
    },[accountNo])

    const formatAccountNumber = (number)=> {
      let num = ''
      for(let i=0; i<number.length; i++){
        if( (i+1) % 4 === 0 && i+1 !== number.length ){
          num += number[i] + ' '
        }else{
          num += number[i]
        }
      }
      return num
    }

    const walletActionButtons = [
        {name: 'Add Money', Icon: PlusCircle}, {name: 'Auto-recharge', Icon: Lightning},
        {name: 'Wallet-only deals', Icon: Tag}, {name: 'Refer', Icon: Users}
    ]

    const headerBg = {
        backgroundImage: "url('/header-bg.png')",
        backgrounSize: 'cover'
    }

    const dummyTransactions = [
      {
        id: "Ty89cc28077knL",
        createdAt: "Feb 23, 10:30 AM",
        type: 'debit',
        amount: "1000",
        referenceAc: 'FitLab',
        status: "pending"
      },
      { 
        id: "Rj78p8cc2807",
        createdAt: "Feb 22, 11:22 PM",
        type: 'credit',
        amount: "500",
        referenceAc: 'FitLab',
        notes: "nweinwnfwnfewfopwefowefowe",
        status: "success"
      }
    ]

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


  return (
        
        <section className='mb-[7rem]' id='WalletPage'>

            <div className="mx-auto p-4 max-w-7xl">
              <div className="flex flex-col space-y-6">
    
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  <div className="bg-white shadow-sm rounded-lg">
                    <div className="p-6">
                      <div className="relative bg-gradient-to-r from-purple-500 to-purple-700 rounded-xl p-5 text-white mb-6">
                        <div className="mb-1 text-sm opacity-80">Total Balance</div>
                        {/* <img src="/Logo_main.png" alt="Fitlab" className="absolute bottom-[5px] right-0 h-[2rem]"/> */}
                        <img src="/Logo_main_light1.png" alt="Fitlab" className="absolute bottom-[-18px] right-0 h-[4rem]"/>
                        <div className="text-4xl font-bold mb-2">₹ 2000.00</div>
                        <div className="flex items-center gap-[10px]">
                          <pre className="text-sm opacity-80">
                            {
                              accountNo && 
                              showAcNumber ? formatAccountNumber(accountNo) : hiddenAccountNo
                            } 
                          </pre>
                          {
                            showAcNumber ?
                            <Eye className="w-[12px] h-[12px] cursor-pointer" onClick={()=> setShowAcNumber(status=> !status)}/>
                            : <EyeOff className="w-[12px] h-[12px] cursor-pointer" onClick={()=> setShowAcNumber(status=> !status)}/>
                          }
                        </div>
                      </div>
    
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {
                        walletActionButtons.map(button=> (
                            <div className={`h-[4.5rem] flex flex-col items-center justify-around py-[7px] text-muted 
                              bg-whitesmoke rounded-[6px] border border-dropdownBorder hover:shadow-md hover:text-primaryDark 
                                ${button.name === 'Add Money' ? 'text-primaryDark' : 'text-muted'} cursor-pointer
                                   ${button.name === 'Wallet-only deals' && 'w-[105%]'} `}>
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
    
                        <div className="flex gap-2 mb-[5px]">
                          <input type="text" placeholder="Enter his/her FitLab account number" className="flex-1 h-[2rem] px-3
                           py-2 text-[12px] border border-gray-300 rounded-md focus:outline-none focus:ring-2
                            focus:ring-purple-500" />
                          <button className="h-[2rem] w-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <Clipboard className="h-4 w-4" />
                          </button>
                          <button className="h-[2rem] w-10 flex items-center justify-center bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="ml-[1px] text-[11px] text-gray-500"> Send Money for your friend as a gift! </div>
                      </div>
                    </div>

                    <div className="bg-white shadow-sm rounded-lg">
                      <div className="pt-[13px] pb-[1rem] px-[1.5rem]">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="bg-green-100 rounded-full p-1">
                            <ArrowUp className="h-4 w-4 text-green-500 transform rotate-180" />
                          </div>
                          <h2 className="text-[16px] font-semibold">Request</h2>
                        </div>
    
                        <div className="flex gap-2 mb-[5px]">
                          <input type="text" placeholder="Enter Amount" className="w-[7rem] h-[2rem] px-3 py-2 text-[12px]
                           border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"/>
                          <input type="text" placeholder="Enter his/her FitLab account number" className="flex-1 h-[2rem] px-3 
                            py-2 text-[12px] border border-gray-300 rounded-md focus:outline-none focus:ring-2
                             focus:ring-purple-500"/>
                          <button className="h-[2rem] w-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <Clipboard className="h-4 w-4" />
                          </button>
                          <button className="h-[2rem] w-10 flex items-center justify-center bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
    
                        <div className="ml-[1px] text-[11px] text-gray-500"> Ask a friend for money by entering their FitLab account number! </div>
                      </div>
                    </div>

                  </div>
                </div>
    
                <div className="bg-white shadow-sm rounded-lg">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-[16px] capitalize tracking-[0.3px] font-semibold">Recent transactions</h2>
                      { dummyTransactions.length > 0 &&
                        <button className="text-[13px] text-purple-500 flex items-center gap-1 hover:underline focus:outline-none">
                          View all
                          <ChevronRight className="w-[14px] h-[14px]" />
                        </button>
                      }
                    </div>

                    {
                      dummyTransactions.length > 0 ?
                      <table cellSpacing={10} cellPadding={10} className="w-full">
                        {
                          dummyTransactions.map(transaction=> (
                            <tr>
                              <td className="flex items-center gap-[5px]">
                                <span className={`${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}
                                 rounded-full p-[5px]`}>
                                  {
                                    transaction.type === 'credit' ?
                                    <ArrowUp className="h-4 w-4 text-green-500 transform rotate-180" />
                                    : <ArrowUp className="h-4 w-4 text-red-500" />
                                  }
                                </span>
                                <span className="text-[13px] font-medium">
                                  {transaction.id}
                                </span>
                              </td>
                              <td className="text-sm text-muted"> {transaction.createdAt} </td>
                              <td className={`${transaction.type === 'credit' ? 'text-green-500' : 'text-red-500'} font-medium`}>
                                <span>
                                { transaction.type === 'credit' ? '+' : '-' }
                                </span>
                                <span> ₹ {transaction.amount} </span>
                              </td>
                              <td className="text-sm text-secondary"> {transaction.referenceAc} </td>
                              <td className="text-sm text-muted"> 
                               <span className="font-medium"> Notes: </span>
                               <span className="capitalize">
                                {
                                  transaction.notes ? 
                                  transaction.notes.length > 25 ? transaction.notes.slice(0,25) + '...' : transaction.notes
                                  : '---'
                                } 
                               </span>
                              </td>
                              <td>
                                {
                                  (()=>{
                                    const statusStyle = getTransactionStatusStyle(transaction.status)
                                    return (
                                      <span className={`${statusStyle} px-3 py-1 text-[13px] capitalize rounded-[6px]`}>
                                      { transaction.status }
                                      </span>
                                    )
                                    } 
                                  )()
                                }
                              </td>
                            </tr>
                          ))
                        }
                      </table>
                      : <p className="ml-[5px] text-[13px] text-muted capitalize tracking-[0.2px]"> 
                          You haven't made any transactions yet ! 
                        </p>
                    }

                    </div>
                  </div>


                  <div className="mx-[1.5rem] flex justify-between gap-[1rem]">

                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                      <div className="flex flex-col space-y-1.5 p-6 pb-2">
                        <p className="text-sm text-muted-foreground">Membership Credits</p>
                        <h3 className="text-4xl text-secondary font-bold">{membershipCredits}</h3>
                      </div>
                      <div className="p-6 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Use credits for class bookings or personal training sessions
                        </p>
                      </div>
                      <div className="flex items-center p-6 pt-0 ">
                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium
                          border border-primary border-input bg-background hover:bg-primary hover:text-accent-foreground h-9 px-3">
                          <Plus className="mr-2 h-3 w-3 text-secondary" />
                          Buy Credits
                        </button>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                      <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="text-[20px] font-semibold leading-none tracking-tight">Quick Actions</h3>
                      </div>
                      <div className="p-6 pt-0 mt-[10px] mb-[1px] grid gap-[1rem]">
                        <button className="inline-flex items-center justify-start rounded-md text-sm text-muted font-medium
                          border border-input bg-background hover:bg-whitesmoke hover:text-primaryDark h-10 px-4 py-2 w-full">
                          <CreditCard className="mr-2 h-4 w-4 text-secondary" />
                          Manage Payment Methods
                        </button>
                        {/* <button className="inline-flex items-center justify-start rounded-md text-sm text-muted
                         font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2
                          focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
                           border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full">
                          <Clock className="mr-2 h-4 w-4 text-secondary" />
                          Recurring Payments
                        </button> */}
                        <button className="inline-flex items-center justify-start rounded-md text-sm text-muted font-medium 
                          border border-input bg-background hover:bg-whitesmoke hover:text-primaryDark h-10 px-4 py-2 w-full">
                          <Download className="mr-2 h-4 w-4 text-secondary" />
                          Download Statement
                        </button>
                      </div>
                    </div>

                  </div>


                </div>

              </div>

            </section>
  )
}
