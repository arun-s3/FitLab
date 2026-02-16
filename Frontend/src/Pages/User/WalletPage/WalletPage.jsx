import React, {useState, useEffect, useContext} from "react"
import './WalletPage.css'
import {useLocation} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import {Elements} from "@stripe/react-stripe-js"
import {loadStripe} from "@stripe/stripe-js"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

import {toast as sonnerToast} from 'sonner'

import WalletCard from "./WalletCard"
import WalletOptions from "./WalletOptions"
import MoneyExchange from "./MoneyExchange"
import WalletFundingModal from "./Modals/WalletFundingModal"
import TransactionDetailsSection from "./TransactionDetailsSection"
import {SocketContext} from '../../../Components/SocketProvider/SocketProvider'
import AutoRechargeModal from "./Modals/AutoRechargeModal"
import CardExistsWarningModal from "./Modals/CardExistsWarningModal"
import WalletUtilitySection from "./WalletUtilitySection"
import {ProtectedUserContext} from '../../../Components/ProtectedUserRoutes/ProtectedUserRoutes'
import {UserPageLayoutContext} from '../../../Layouts/UserPageLayout/UserPageLayout'
import {decryptData} from '../../../Utils/decryption'
import {getOrCreateWallet, updateAutoRechargeSettings, resetWalletStates} from '../../../Slices/walletSlice'


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

    const {openSemiAutoRechargeModal, setOpenSemiAutoRechargeModal, openNotificationModal, setOpenNotificationModal} = useContext(SocketContext)

    const [showFundingModal, setShowFundingModal] = useState(false)
    const [paymentVia, setPaymentVia] = useState("razorpayAndPaypal")

    const [queryOptions, setQueryOptions] = useState({page: 1, status: 'all', type: 'all', limit: 6, userLevel: false})

    const [isAutoRechargeModalOpen, setIsAutoRechargeModalOpen] = useState(false)
    const [autoRechargeSettings, setAutoRechargeSettings] = useState(null)

    const [openCardExistsModal, setOpenCardExistsModal] = useState(false)

    const dispatch = useDispatch()

    const {safeWallet, walletError} = useSelector(state=> state.wallet)

    const membershipCredits = 3

    useEffect(()=> {
      dispatch(resetWalletStates())
    },[])

    useEffect(() => {
      if(Object.keys(queryOptions).length > 0){
        dispatch( getOrCreateWallet({queryOptions}) )
      }
    }, [queryOptions])

    useEffect(()=> {
      if(openSemiAutoRechargeModal.status){
        if(showFundingModal || isAutoRechargeModalOpen){
          setOpenSemiAutoRechargeModal({status: false, walletAmount: null, autoRechargeAmount: null, recharged: false})
        }
      }
      if(openSemiAutoRechargeModal.recharged){
          dispatch(getOrCreateWallet({queryOptions}))
          setTimeout(()=> setOpenSemiAutoRechargeModal((prev)=> ({...prev, recharged: false})), 2000)
      }
      if(openNotificationModal.walletRecharged){
        dispatch(getOrCreateWallet({queryOptions}))
        setTimeout(()=> setOpenNotificationModal((prev)=> ({...prev, walletRecharged: false})), 2000)
      }
    }, [showFundingModal, isAutoRechargeModalOpen, openSemiAutoRechargeModal, openNotificationModal])

    useEffect(()=> {
        if(walletError){
            sonnerToast.error(walletError)
            dispatch(resetWalletStates())
        }
    }, [walletError])

    const openFundingModal = () => {
      if(checkAuthOrOpenModal()){
        return
      }
      setShowFundingModal(true)
    }
  
    const closeFundingModal = () => {
      setShowFundingModal(false)
    }  

    const openAutoRechargeModal = ()=> {
      if(checkAuthOrOpenModal()){
        return
      }
      if(safeWallet && decryptData(safeWallet)?.autoRecharge.paymentMethodId){
        sonnerToast.warning("You already have applied for the auto-recharge! ")
        setOpenCardExistsModal(true)
        return 
      }
      setIsAutoRechargeModalOpen(true)
    } 
    
    const handleSaveAutoRechargeSettings = (settings) => {
      setAutoRechargeSettings(settings)
      dispatch(updateAutoRechargeSettings({settings}))
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
                
                <Elements stripe={stripePromise}>
                  <AutoRechargeModal 
                    isOpen={isAutoRechargeModalOpen} 
                    onClose={() => setIsAutoRechargeModalOpen(false)}
                    onSave={handleSaveAutoRechargeSettings} 
                    currentSettings={safeWallet && decryptData(safeWallet)?.autoRecharge || autoRechargeSettings}
                  />
                </Elements>

                <WalletUtilitySection membershipCredits={membershipCredits}/>

                {/* <AutoRechargeFeature /> */}

                <CardExistsWarningModal
                  isOpen={openCardExistsModal}
                  onClose={()=> {
                    setOpenCardExistsModal(false)
                  }}
                  onUpdateCard={()=> {
                    setOpenCardExistsModal(false)
                    setIsAutoRechargeModalOpen(true)
                  }}
                />

                </div>

              </div>

            </section>
  )
}
