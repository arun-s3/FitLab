import React, {useState, useEffect} from 'react'

import { Plus, CreditCard, Download } from "lucide-react"


export default function WalletUtilitySection({membershipCredits}){
    

    return(
        <section className="mx-[1.5rem] flex justify-between gap-[1rem]">

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

        </section>
    )
}