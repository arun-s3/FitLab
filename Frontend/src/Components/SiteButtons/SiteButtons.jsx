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

export function SiteButtonSquare({customStyle, tailwindClasses, light, lighter, lowFont, lowerFont, lowShadow, children, clickHandler, shouldSubmit=false}){
    const computedStyle = {
        ...customStyle,
        fontSize: lowFont ? '14px' : lowerFont ? '13px' : undefined,
        boxShadow: lowShadow ? '0px 0px 5px rgb(215, 241, 72)' : undefined,
    }
    return(
        <button type={shouldSubmit?"submit":"button"} className={` ${tailwindClasses} site-button-square bg-primary text-black 
            text-descReg1 ${light ? 'font-[480]' : lighter ? 'font-[450]' : ''}`} style={computedStyle}
                 onClick={()=> clickHandler()}> {children} </button>
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

export function SitePrimaryWhiteTextButton({customStyle, tailwindClasses, light, lowFont, children, clickHandler, shouldSubmit=false}){
    return(
        <button type={shouldSubmit?"submit":"button"} className={`bg-primary text-white font-500 px-[2rem] py-[3px] tracking-[0.3px] 
              rounded ${tailwindClasses} ${light ? 'font-[480]' : ''}`} 
                style={lowFont? {...customStyle, fontSize:'14px'} : customStyle} onClick={()=> clickHandler()}> {children} </button>
    )
}

export function SitePrimaryButtonWithShadow({customStyle, tailwindClasses, light, lowFont, children, clickHandler, shouldSubmit=false}){
    return(
        <button type={shouldSubmit?"submit":"button"} className={`inline-flex justify-center items-center gap-[5px] py-[4px] px-[15px] rounded-[8px]
            text-[14px] text-[#332929] tracking-[0.2px] bg-primary cursor-pointer ${tailwindClasses? tailwindClasses:''} ${light ? 'font-[480]' : ''}`} 
                style={lowFont? {...customStyle, fontSize:'14px'} : customStyle} onClick={()=> clickHandler()}
                    id='SitePrimaryButtonWithShadow'> {children} </button>
    )
}

export function SitePrimaryMinimalButtonWithShadow({customStyle, tailwindClasses, light, lowFont, children, clickHandler, shouldSubmit=false}){
    return(
        <button type={shouldSubmit?"submit":"button"} className={` flex justify-center items-center gap-[3px] px-[16px] py-[2px] rounded-[4px]
             text-black bg-primary ${tailwindClasses} ${light ? 'font-[480]' : ''}`} 
                style={lowFont? {...customStyle, fontSize:'14px'} : customStyle} onClick={()=> clickHandler()}> {children} </button>
    )
}

export function SiteSecondaryFillButton({className, variant, size, clickHandler, customStyle, children}) {
    return(
        <button className={`px-[16px] py-[8px] rounded
            ${variant === 'outline' ? 'border border-gray-300' : 'bg-purple-600 text-white'} 
               ${size === 'icon' ? 'p-[8px]' : ''} ${className}`}  onClick={()=> clickHandler()} style={customStyle}>
           {children}
         </button>
    )
}

export function SiteSecondaryFillImpButton({className, clickHandler, customStyle, children}){
    return(
        <button className={`w-full mt-4 bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 
              transition duration-300 ${className}`} onClick={()=> clickHandler()} style={customStyle}>
            {children}
        </button>
    )
}
