import React from 'react'
import './SiteButton.css'

export function SiteButton({text}){
    
    return(
        <button type="button" className="bg-primary text-black text-descReg1 ml-[25px] site-button">{text}</button>
    )
}

export function SiteButtonDark({text}){
    return(
        <button type="button" className='bg-black text-white text-descReg1 site-button-dark'>{text}</button>
    )
}