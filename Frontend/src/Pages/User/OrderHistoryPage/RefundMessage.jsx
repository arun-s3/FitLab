import React from 'react'


export default function RefundMessage({refundReqAccepted, onOpenChat}){


    return (
        <>
            {
                refundReqAccepted 
                    ?   <div className="mx-[1.5rem] mt-[1.5rem]">
                            <div className="p-[11px] text-[13px] font-[500] flex justify-between items-center
                               bg-gradient-to-r from-green-50 to-green-100 border border-primary rounded-xl">
                              <div className="flex items-center gap-[8px]">
                                <CheckCircle className="w-[20px] h-[20px] text-green-500" />
                                <span className="font-[13px]">
                                    Your return request for the product has been thoroughly reviewed and approved. 
                                    Your refund will be processed within 24 hours.
                                </span>   
                              </div>
                              <p className="text-xs md:text-sm text-gray-600" onClick={()=> onOpenChat()}>
                                Questions?{" "}
                                <span className="text-emerald-600 font-semibold cursor-pointer hover:underline">
                                  Contact our support team
                                </span>
                              </p>
                            </div>
                        </div>
                    :   <div className="mx-[1.5rem] mt-[1.5rem] bg-gradient-to-r from-red-50 to-red-100 border border-red-500 rounded-xl">
                          <div className="p-[11px] pb-0 text-[13px] font-[500] flex justify-between items-center">
                            <div className="flex items-center gap-[8px]">
                              <X className="w-[20px] h-[20px] text-red-700" strokeWidth={3} />
                              <span className="font-[13px]">
                                Your return request for the product has been thoroughly reviewed by our team. 
                                Unfortunately, we're unable to process this return at this time.
                              </span>
                            </div>
                            <p className="text-xs md:text-sm text-gray-600" onClick={()=> onOpenChat()}>
                              Questions?{" "}
                              <span className="text-emerald-600 font-semibold cursor-pointer hover:underline">
                                Contact our support team
                              </span>
                            </p>
                          </div>
                          <div className='-mt-[5px] ml-8 px-[11px] pb-[11px]'>
                            <span className='text-[13px] font-medium'> Probable Reasons: </span>
                            <ul className='list-disc ml-4 text-muted text-[11px]'>
                              <li>Product shows signs of significant wear and damage</li>
                              <li>Item appears to have been used professionally</li>
                            </ul>
                          </div>
                        </div>
            }
        </>
    )
}