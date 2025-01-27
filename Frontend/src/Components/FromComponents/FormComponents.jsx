import React from 'react'
import './FormComponents.css'

export function SearchInput({onChange, customStyle}){
    return(
        <input type='search' placeholder='Search Fitlab..' className='h-[34px] w-[34rem] rounded-[7px] placeholder:text-[11px]'
                 onChange={(e)=> onChange(e)} style={customStyle}/>
    )
}