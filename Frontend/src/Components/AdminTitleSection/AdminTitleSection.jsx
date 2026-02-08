import React from 'react'
import { useNavigate, useLocation } from "react-router-dom"

import {IoArrowBackSharp} from "react-icons/io5"


export default function AdminTitleSection ({heading, subHeading}){

    const navigate = useNavigate()
    const location = useLocation()

    const handleBack = () => {
        if (location.state?.from?.includes("/admin")) {
            navigate(-1)
        } else {
            navigate("/admin", { replace: true })
        }
    }


    return (
        <div className='flex justify-between items-center'>
            <div className='flex gap-[10px]'>
                <i
                    onClick={handleBack}
                    className='p-[7px] h-[33px] border border-[#c4c6ca] mt-[8px] rounded-[4px] self-start text-[#666363]
                        cursor-pointer hover:bg-gray-100 transition'>
                        <IoArrowBackSharp style={{ color: "#666363" }} />
                </i>
                <div className='flex flex-col'>
                    <h1> {heading} </h1>
                    <h5 className='text-[11px] font-[500] text-secondary tracking-[0.4px] mt-[-2px]'>{subHeading}</h5>
                </div>
            </div>
        </div>
    )
}