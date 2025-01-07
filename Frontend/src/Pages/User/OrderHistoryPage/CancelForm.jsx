import React,{useEffect, useRef} from 'react'
import './CancelForm.css'

import {RiArrowDropDownLine} from "react-icons/ri"

import {SiteSecondaryFillImpButton} from '../../../Components/SiteButtons/SiteButtons'


export default function CancelForm({openSelectReasons, setOpenSelectReasons, cancelReasonHandler, setOpenCancelForm, submitReason, formFor}){

  
  const commonReasonTitles = [
    "Order created by mistake", "Need to change shipping address", "Product(s) price too high", "Poor product reviews discovered",
    "Need to change payment method", "Delivery charge too high", "Incorrect product ordered", "Found somewhere else cheaper",
    "Gift no longer needed", "Financial reasons", "Other"
  ]

  const dropdownBoxRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (e)=> {
      if(!e.target.closest('#dropdownBox')){
        setOpenSelectReasons((selectReason)=> ({ ...selectReason, status: false }))
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])
  

      return(
        <div id='CancelForm' className='flex flex-col items-center'>
            <h2 className='mt-[2rem] flex items-center gap-[1rem]'> 
              <span className='text-[15px] tracking-[0.2px] capitalize'> {`Reason for Cancellation of the ${formFor} (Optional):`} </span>
              <span className='relative px-[15px] py-[5px] w-[17rem] flex items-center justify-between border
                 border-dropdownBorder rounded-[6px] cursor-pointer' ref={dropdownBoxRef} id='dropdownBox'
                   onClick={()=> setOpenSelectReasons(selectReason=> ( {...selectReason, status: !selectReason.status} ))}>
                <span className='text-[14px] font-[450] text-secondary'>
                  {openSelectReasons.reasonTitle? openSelectReasons.reasonTitle :'Select Reasons'}
                </span>
                <RiArrowDropDownLine/> 
                {
                  openSelectReasons.status &&
                  <ul className='absolute top-[115%] left-0 w-[17rem] px-[25px] py-[15px] h-fit bg-white text-[13px]
                   flex flex-col gap-[10px] border border-dropdownBorder rounded-[6px] z-[5] cursor-pointer'>
                    {
                      commonReasonTitles.map(reasonTitle=> (
                        <li onClick={(e)=> cancelReasonHandler(e, {title: true})}> {reasonTitle} </li>
                      ))
                    }
                    
                </ul>
                }
              </span>
            </h2>
            <textarea row='6' cols='50' maxLength='500' placeholder='Please write your explanation (optional)' 
                className='mt-[1rem] mb-[1.5rem] resize-none h-[7rem] text-[13px] placeholder:text-[10px] border
                   border-mutedDashedSeperation rounded-[5px] focus:ring-secondary focus:ring-[1.5px]
                      focus:outline-none focus-within:border-none focus-within:outline-none' value={openSelectReasons.reason}
                        onChange={(e)=> cancelReasonHandler(e, {content: true})}/>
            <div className='flex items-center justify-center gap-[1rem]'>
              <SiteSecondaryFillImpButton className='py-[5px] px-[10px] w-[6rem] capitalize' clickHandler={()=> submitReason(formFor)}
                 customStyle={{marginTop:'0', paddingBlock:'5px', paddingInline:'25px', width:'fit-content'}}>
                        Submit 
              </SiteSecondaryFillImpButton>
              <SiteSecondaryFillImpButton className='py-[5px] px-[40px] w-[6rem]' 
                  clickHandler={()=> setOpenCancelForm({type:'', status:false, options:{}})}
                     customStyle={{marginTop:'0', paddingBlock:'5px', paddingInline:'25px', width:'fit-content'}}>
                            Cancel
              </SiteSecondaryFillImpButton>
            </div>
        </div>
      )
    }


