import React from 'react'

export default function OrderStepper({stepNumber}){

    return(
        <div className="mt-[2rem] mb-[3rem] flex items-center justify-center">
          <div className="flex items-center space-x-[1rem]">
            {['Shopping cart', 'Checkout details', 'Order complete'].map((step, index) => (
              <React.Fragment key={step}>
                <div className={`pb-[1rem] flex items-center border-b-2 
                        ${index === stepNumber ? 'border-secondaryLight2' : 'border-transparent'}`}>
                  <div className={`w-[2rem] h-[2rem] text-[14px] ${step === 'Shopping cart' ? 'bg-secondary' : '' } rounded-full
                       flex items-center justify-center ${index === 0 ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {index + 1}
                  </div>
                  <span className={`ml-[8px] ${index === stepNumber ? 'text-secondary' : '' } 
                         ${index === stepNumber ? 'font-medium' : 'text-gray-500'}`}>{step}</span>
                </div>
                {index < 2 && (
                  <div className="mb-[12px] w-[4rem] h-[2px] bg-gray-300"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
    )
}