import React from 'react'
import './SiteButton.css'

export function SiteButton({text}){
    
    return(
        <button type="button" className="bg-primary text-black button-main ml-[25px]">{text}</button>
    )
}

