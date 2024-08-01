import React from 'react'
import './SiteButton.css'

export function SiteButton({text,customStyle}){
    
    return(
        <button type="button" className="bg-primary text-black text-descReg1 site-button" style={customStyle}>{text}</button>
    )
}

export function SiteButtonDark({text,customStyle}){
    return(
        <button type="button" className='bg-black text-white text-descReg1 site-button-dark' style={customStyle}>{text}</button>
    )
}

export function SiteButtonSquare({text,customStyle}){
    return(
        <button type="button" className="bg-primary text-black text-descReg1 site-button-square" style={customStyle}>{text}</button>
    )
}