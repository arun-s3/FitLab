import React from 'react'

export default function PlaceholderIcon({icon, fromTop}){
    return(
        <span className='absolute top-[25%] left-[8px] text-[#6b7280] text-[11px]' style={fromTop? {top: `${fromTop}%`}: null}>
             {icon} 
        </span>
    )
}