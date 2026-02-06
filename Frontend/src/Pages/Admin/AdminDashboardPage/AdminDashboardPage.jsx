import React, { useState, useEffect, createContext } from 'react'
import {useOutletContext} from 'react-router-dom'

import {motion} from "framer-motion"

import {Search, ChevronDown} from 'lucide-react'

import SalesRevenueSection from "./Components/SalesRevenueSection"
import OrdersFulfillmentSection from "./Components/OrderFulfillmentSection."
import CustomerInsightsSection from "./Components/CustomerInsightsSection"
import InventoryInsightsSection from './Components/InventoryInsightsSection'
import CouponsInsightsSection from './Components/CouponsInsightsSection'
import OffersInsightsSection from './Components/OffersInsightsSection'
import PaymentsInsightsSection from './Components/PaymentsInsightsSection'

import AdminTitleSection from '../../../Components/AdminTitleSection/AdminTitleSection'

export const BusinessAnalyticsContext = createContext()
export const OperationsAnalyticsContext = createContext()


export default function AdminDashboardPage({ insightType }){

    const [dashboardQuery, setDashboardQuery] = useState('')

    const {setPageBgUrl} = useOutletContext() 
    setPageBgUrl(`linear-gradient(to right,rgba(255,255,255,0.96),rgba(255,255,255,0.96)), url('/admin-bg10.png')`)

    const [showBusinessAnalytics, setShowBusinessAnalytics] = useState({sales: true, orders: true, customers: true})
    const [showOperationsAnalytics, setShowOperationsAnalytics] = useState({inventory: true, payments: true, coupons: true, offers: true})

    const businessOverviewHeader = "Business Overview"
    const operationsOverviewHeader = "Operations Overview"

    const businessOverviewSubHeader = "Get a visual summary of sales, revenue, orders, and customer trends to track and analyze your business performance"
    const operationsOverviewSubHeader = "Visualize and monitor key operational metrics including inventory levels, payment trends, offers, and coupon usage"

    useEffect(()=> {
        setDashboardQuery('')
    }, [insightType])


    return(
        <section id='adminDashboard'>
            <header>

                {
                  (()=> {
                    const header = insightType === 'business' ? businessOverviewHeader : operationsOverviewHeader
                    const subheader = insightType === 'business' ? businessOverviewSubHeader : operationsOverviewSubHeader
                    return <AdminTitleSection heading={header} subHeading={subheader}/>
                  }
                  )()
                }

            </header>

            <main className="flex-1">

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-6 space-y-8"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    <div className={`hidden md:flex h-[2.4rem] items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5
                       rounded-md flex-1 max-w-md 
                        ${dashboardQuery.trim() ? 'border-2 border-secondary' : 'border border-dropdownBorder'}`}>
                        <Search size={18} className="text-gray-500 dark:text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="bg-transparent border-none outline-none w-full text-sm placeholder:text-[13px]
                                focus:outline-none focus:border-none focus:ring-0" 
                            value={dashboardQuery}
                            onChange={(e)=> setDashboardQuery(e.target.value)}
                        />
                    </div>
                    
                  </div>

                  <div className='flex flex-col gap-[3rem]'>

                      {
                        insightType === 'business' ?
                          <BusinessAnalyticsContext.Provider value={{dashboardQuery, showBusinessAnalytics, setShowBusinessAnalytics}}>

                            <SalesRevenueSection />

                            <OrdersFulfillmentSection />

                            <CustomerInsightsSection />

                          </BusinessAnalyticsContext.Provider>
                          
                          : insightType === 'operations' &&

                            <OperationsAnalyticsContext.Provider value={{dashboardQuery, showOperationsAnalytics, setShowOperationsAnalytics}}>

                              <InventoryInsightsSection />

                              <CouponsInsightsSection />

                              <OffersInsightsSection />

                              <PaymentsInsightsSection />

                            </OperationsAnalyticsContext.Provider>
                      }


                  </div>

                </motion.div>

            </main>

        </section>
    )
}