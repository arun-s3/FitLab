import React, {useState, useEffect, useContext} from "react"
import './WalletPage.css'
import {useLocation} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import WalletCard from "./WalletCard"
import WalletOptions from "./WalletOptions"
import MoneyExchange from "./MoneyExchange"
import WalletFundingModal from "./Modals/WalletFundingModal"
import TransactionDetailsSection from "./TransactionDetailsSection"
import AutoRechargeFeature from "./AutoRechargeFeature"
import AutoRechargeModal from "./Modals/AutoRechargeModal"
import WalletUtilitySection from "./WalletUtilitySection"
import {ProtectedUserContext} from '../../../Components/ProtectedUserRoutes/ProtectedUserRoutes'
import {UserPageLayoutContext} from '../UserPageLayout/UserPageLayout'
import {decryptData} from '../../../Utils/decryption'
import {getOrCreateWallet, resetWalletStates} from '../../../Slices/walletSlice'


export default function WalletPage() {

    const {setBreadcrumbHeading, setPageWrapperClasses, setContentTileClasses, setSidebarTileClasses, setPageLocation} = useContext(UserPageLayoutContext)
    setBreadcrumbHeading('Wallet')
    setPageWrapperClasses('gap-[2rem] px-0 s-sm:px-[4rem] mb-[10rem]')
    setContentTileClasses('basis-full w-full x-lg:basis-[85%] mt-[2rem] content-tile')
    setSidebarTileClasses('hidden x-lg:inline-block')

    const {setIsAuthModalOpen, checkAuthOrOpenModal} = useContext(ProtectedUserContext)
    setIsAuthModalOpen({status: false, accessFor: 'wallet'})

    const location = useLocation()
    setPageLocation(location.pathname)

    const [showFundingModal, setShowFundingModal] = useState(false)
    const [paymentVia, setPaymentVia] = useState("razorpayAndPaypal")

    const [queryOptions, setQueryOptions] = useState({page: 1, status: 'all', type: 'all', limit: 6, userLevel: false})

    const [isAutoRechargeModalOpen, setIsAutoRechargeModalOpen] = useState(false)
    const [autoRechargeSettings, setAutoRechargeSettings] = useState(null)

    const dispatch = useDispatch()

    const {safeWallet, walletLoading, walletError, walletMessage} = useSelector(state=> state.wallet)

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
    
    const handleSaveAutoRechargeSettings = (settings) => {
      setAutoRechargeSettings(settings)
      // I should save the settings to the backend
      console.log("Auto-recharge settings saved:", settings)
    }


  return (
        
        <section className='mb-[7rem]' id='WalletPage'>

            <div className="mx-auto p-4 max-w-7xl">
              <div className="flex flex-col space-y-6">
    
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  <WalletCard>

                    <WalletOptions 
                      onClickFunding={openFundingModal} 
                      onClickAutoRecharge={openAutoRechargeModal}
                    />

                  </WalletCard>

                  <MoneyExchange 
                    onAuthCheckModal={checkAuthOrOpenModal} 
                    walletBalance={safeWallet && decryptData(safeWallet)?.balance}
                  />

                </div>
    
                { 
                  safeWallet &&
                  <TransactionDetailsSection 
                    transactions={safeWallet && decryptData(safeWallet)?.transactions}
                    queryOptions={queryOptions} setQueryOptions={setQueryOptions}
                  />
                }

                {
                  showFundingModal &&
                      <WalletFundingModal 
                        showFundingModal={showFundingModal} 
                        closeFundingModal={closeFundingModal}
                        paymentVia={paymentVia} 
                        setPaymentVia={setPaymentVia}
                      />
                }

                  <AutoRechargeModal 
                    isOpen={isAutoRechargeModalOpen} 
                    onClose={() => setIsAutoRechargeModalOpen(false)}
                    onSave={handleSaveAutoRechargeSettings} 
                    currentSettings={autoRechargeSettings}
                  />

                <WalletUtilitySection membershipCredits={membershipCredits}/>

                {/* <AutoRechargeFeature /> */}

                </div>

              </div>

            </section>
  )
}
