import React from 'react'

import {SiteSecondaryFillButton, SiteButtonSquare} from '../../Components/SiteButtons/SiteButtons'


export default function PaymentSummary({heading, absoluteTotal, absoluteTotalWithTaxes, deliveryCharge, gst}){

    return(
        <div className="h-[22rem] bg-[#F7EEFD] rounded-[8px] p-[1.5rem] border border-primary" id='order-summary'>
            <h2 className="mb-[1.5rem] text-[20px] font-bold tracking-[0.5px]"> {heading} </h2>
            <div className="space-y-[1rem]">
              <div className="flex justify-between">
                <span className='order-title'> Subtotal </span>
                <span className='order-value tracking-[0.5px]'> ₹{absoluteTotal.toFixed(2).toLocaleString()} </span>
              </div>
              <div className="flex justify-between">
                <span className='order-title'>Shipping Cost</span>
                <span className='order-value'> ₹{deliveryCharge} </span>
              </div>
              <div className="flex justify-between">
                <span className='order-title'> GST (10%) </span>
                <span className='order-value'> ₹{gst} </span>
              </div>
              <div className="!mt-[2rem] flex justify-between font-bold pt-[1rem] border-t border-dashed border-mutedDashedSeperation">
                <span> Order Total </span>
                <span> ₹{absoluteTotalWithTaxes} </span>
              </div>
            </div>
            {/* <button className="w-full bg-[#E6FF00] text-black font-bold py-[12px] rounded-[8px] mt-[1.5rem]
               hover:bg-[#E6FF00]/90 transition-colors">
              Checkout
            </button> */}
            <SiteButtonSquare tailwindClasses='mt-[1rem] w-full hover:bg-primaryDark transition-colors'>
              Checkout
            </SiteButtonSquare>
        </div>
    )
}