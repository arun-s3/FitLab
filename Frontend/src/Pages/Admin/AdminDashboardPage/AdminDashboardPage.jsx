import React, { useState, useEffect, createContext } from 'react'
import {motion} from "framer-motion"

import {Search, ChevronDown} from 'lucide-react'

import SalesRevenueSection from "./Components/SalesRevenueSection"
import OrdersFulfillmentSection from "./Components/OrderFulfillmentSection."
import CustomerInsightsSection from "./Components/CustomerInsightsSection"
import InventoryInsightsSection from './Components/InventoryInsightsSection'
import CouponOffersInsightsSection from './Components/CouponOffersInsightsSection'
import PaymentsInsightsSection from './Components/PaymentsInsightsSection'
import DateRangePicker from "./Components/DateRangePicker"

import AdminHeader from '../../../Components/AdminHeader/AdminHeader'

export const BusinessAnalyticsContext = createContext()
export const OperationsAnalyticsContext = createContext()


export default function AdminDashboardPage({ insightType }){

    const [dateRange, setDateRange] = useState("30d")

    const [showBusinessAnalytics, setShowBusinessAnalytics] = useState({sales: true, orders: true, customers: true})
    const [showOperationsAnalytics, setShowOperationsAnalytics] = useState({inventory: true, payments: true, couponOffers: true})

    const businessOverviewHeader = "Business Overview"
    const operationsOverviewHeader = "Operations Overview"

    const businessOverviewSubHeader = "Get a visual summary of sales, revenue, orders, and customer trends to track and analyze your business performance"
    const operationsOverviewSubHeader = "Visualize and monitor key operational metrics including inventory levels, payment trends, offers, and coupon usage"


    return(
        <section id='adminDashboard'>
            <header>

                {
                  (()=> {
                    const header = insightType === 'business' ? businessOverviewHeader : operationsOverviewHeader
                    const subheader = insightType === 'business' ? businessOverviewSubHeader : operationsOverviewSubHeader
                    return <AdminHeader heading={header} subHeading={subheader}/>
                  }
                  )()
                }

            </header>

            <main className="flex-1 overflow-y-auto">

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-6 space-y-8"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    <div className="hidden md:flex h-[2.4rem] items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5
                     border border-dropdownBorder rounded-md flex-1 max-w-md">
                        <Search size={18} className="text-gray-500 dark:text-gray-400" />
                        <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none w-full 
                            text-sm placeholder:text-[13px]" />
                    </div>
                    
                    <DateRangePicker value={dateRange} onChange={setDateRange} />

                  </div>

                  <div className='flex flex-col gap-[3rem]'>

                      {
                        insightType === 'business' ?
                          <BusinessAnalyticsContext.Provider value={{dateRange, showBusinessAnalytics, setShowBusinessAnalytics}}>

                            <SalesRevenueSection />

                            <OrdersFulfillmentSection />

                            <CustomerInsightsSection />

                          </BusinessAnalyticsContext.Provider>
                          
                          : insightType === 'operations' &&

                            <OperationsAnalyticsContext.Provider value={{dateRange, showOperationsAnalytics, setShowOperationsAnalytics}}>

                              <InventoryInsightsSection />

                              <CouponOffersInsightsSection />

                              <PaymentsInsightsSection />

                            </OperationsAnalyticsContext.Provider>
                      }


                  </div>

                </motion.div>

            </main>

        </section>
    )
}