import React from 'react'
import './FormComponents.css'

export function SearchInput({customStyle}){
    return(
        <input type='search' placeholder='Search Fitlab..' className='h-[34px] w-[34rem] rounded-[7px] placeholder:text-[11px]'
                 style={customStyle}/>
    )
}