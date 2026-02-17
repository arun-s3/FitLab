import React from "react"

import { TriangleAlert, RotateCcw } from "lucide-react"


const StatError = ({ refreshFetch }) => {
    return (
        <div className='flex justify-center items-center gap-[5px] w-full h-full'>
            <TriangleAlert className='mb-[18px] text-primary w-[32px] h-[32px]' />
            <p className='flex flex-col'>
                <span className='flex items-center gap-[7px] text-[17px] text-[#686262] font-medium'>
                    Unable to load
                    <RotateCcw
                        className="w-[20px] h-[20px] text-muted p-1 rounded-full border border-dropdownBorder cursor-pointer 
                            hover:text-black transition-all duration-150 ease-in"
                        onClick={() => refreshFetch()}
                    />
                </span>
                <span className='text-[13px] text-muted'>Check connection</span>
            </p>
        </div>
    )
}

export default StatError