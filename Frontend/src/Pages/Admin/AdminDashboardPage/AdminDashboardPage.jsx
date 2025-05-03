import React, { useState, useEffect, createContext } from 'react'
import {motion} from "framer-motion"

import {Search, ChevronDown} from 'lucide-react'

import SalesRevenueSection from "./Components/SalesRevenueSection"
import OrdersFulfillmentSection from "./Components/OrderFulfillmentSection."
import CustomerInsightsSection from "./Components/CustomerInsightsSection"
import DateRangePicker from "./Components/DateRangePicker"

import AdminHeader from '../../../Components/AdminHeader/AdminHeader'

export const AnalyticsContext = createContext()


export default function AdminDashboardPage(){

    const [dateRange, setDateRange] = useState("30d")
    const [showAnalytics, setShowAnalytics] = useState({
      sales: true, customers: true, inventory: true, orders: true, payments: true, couponOffers: true
    })


    return(
        <section id='adminDashboard'>
            <header>

                <AdminHeader heading='Dashboard' subHeading='Manage, Monitor, and Optimize Your E-commerce Platform'/>

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

                    <AnalyticsContext.Provider value={{dateRange, showAnalytics, setShowAnalytics}}>

                      <SalesRevenueSection />

                      <OrdersFulfillmentSection />

                      <CustomerInsightsSection />

                    </AnalyticsContext.Provider>

                  </div>

                </motion.div>

            </main>

        </section>
    )
}