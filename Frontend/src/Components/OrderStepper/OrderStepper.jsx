import React from 'react'

import {Check, Plus, Minus, X, CreditCard, Lock, MapPin} from 'lucide-react'


export default function OrderStepper({stepNumber}){

    return(

        <div className="mt-[2rem] mb-[3rem] flex items-center justify-center px-4">
          <div className="flex items-center justify-between w-full max-w-3xl">
            {['Shopping cart', 'Checkout details', 'Order complete'].map((step, index)=> (
              <React.Fragment key={step}>
                <div className="flex items-center flex-1 last:flex-none">
                  <div className={`pb-[1rem] flex items-center border-b-2 cursor-pointer
                          ${index <= stepNumber-1 ? 'border-secondaryLight2' : 'border-transparent'}`}>
                    <div className={`w-[2rem] h-[2rem] text-[14px]
                         ${index <= stepNumber-1 ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-600' } rounded-full
                           flex items-center justify-center`}>
                      { (index < stepNumber-1) ? <Check className='text-white'/> :index + 1 }
                    </div>
                    <span className={`ml-[8px] xs-sm:text-[13px] sm:text-[16px] whitespace-nowrap
                     ${index <= stepNumber-1 ? 'text-secondary' : '' } ${index <= stepNumber-1 ? 'font-medium' : 'text-gray-500'}
                     hidden xs-sm:inline`}>
                      {step}
                    </span>
                  </div>
                    
                  {index < 2 && (
                    <div className="flex-1 x-sm:flex justify-normal x-sm:justify-center mx-2">
                      <div className="mb-[12px] h-[2px] bg-gray-300 w-auto x-sm:w-16"></div>
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
    )
}