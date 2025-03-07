import React from 'react'

export default function PlaceholderIcon({icon, fromTop, className}){
    return(
        <span className={`absolute top-[25%] left-[8px] text-[#6b7280] text-[11px] ${className}`}
             style={fromTop? {top: `${fromTop}%`}: null}>
             {icon} 
        </span>
    )
}