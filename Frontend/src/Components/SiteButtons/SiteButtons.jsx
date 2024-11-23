import React from 'react'
import './SiteButtons.css'
import {useSelector} from 'react-redux'

export function SiteButton({customStyle, children, shouldSubmit=false}){
    
    return(
        <button type={shouldSubmit?"submit":"button"} className="bg-primary text-black text-descReg1 site-button" 
                style={customStyle}>{children}</button>
    )
}

export function SiteButtonDark({customStyle, children, shouldSubmit=false}){
    return(
        <button type={shouldSubmit?"submit":"button"} className='bg-black text-white text-descReg1 site-button-dark'
                style={customStyle}>{children}</button>
    )
}

export function SiteButtonSquare({customStyle, light, lowFont, children, clickHandler, shouldSubmit=false}){
    return(
        <button type={shouldSubmit?"submit":"button"} className={`site-button-square bg-primary text-black text-descReg1 ${light ? 'font-[480]' : ''}`}
                style={lowFont? {...customStyle, fontSize:'14px'} : customStyle} onClick={()=> clickHandler()}> {children} </button>
    )
}

export function SiteSecondaryButtonSquare({customStyle , light, children, shouldSubmit=false}){
    return(
        <button type={shouldSubmit?"submit":"button"} className=" text-black text-descReg1 site-button-square site-button-secondary-square" 
                style={customStyle}>{children}</button>
    )
}

export function SiteSecondaryBorderButtonSquare({customStyle, children, clickHandler, shouldSubmit=false}){
    return(
        <button type={shouldSubmit?"submit":"button"} className="bg-black text-primary text-descReg1 site-button-google" 
                style={customStyle} onClick={()=>clickHandler()}> {children} </button>
    )
}
