import React from 'react'
import './SiteButtons.css'
import {useSelector} from 'react-redux'
import {motion} from 'framer-motion'


export function SiteButton({customStyle, children, className, shouldSubmit = false}){
    
    return(
        <button type={shouldSubmit?"submit":"button"} 
            className={`bg-primary text-black text-descReg1 hover:bg-yellow-300 transition duration-300 ${className} site-button`} 
            style={customStyle}
        >
                {children}
        </button>
    )
}

export function SiteButtonDark({customStyle, children, shouldSubmit = false}){
    return(
        <button 
            type={shouldSubmit?"submit":"button"} 
            className='bg-black text-white text-descReg1 site-button-dark'
            style={customStyle}
        >
                {children}
        </button>
    )
}

export function SiteButtonSquare({customStyle, tailwindClasses, light, lighter, lowFont, lowerFont, lowShadow, children, clickHandler, shouldSubmit = false}){
    const computedStyle = {
        ...customStyle,
        fontSize: lowFont ? '14px' : lowerFont ? '13px' : undefined,
        boxShadow: lowShadow ? '0px 0px 5px rgb(215, 241, 72)' : undefined,
    }
    return(
        <button type={shouldSubmit?"submit":"button"}
            className={` ${tailwindClasses} site-button-square bg-primary text-black 
                text-descReg1 ${light ? 'font-[480]' : lighter ? 'font-[450]' : ''}`} style={computedStyle}
            onClick={clickHandler ? ()=> clickHandler() : undefined} 
        >
                 {children} 
        </button>
    )
}

export function SiteSecondaryButtonSquare({customStyle , light, children, shouldSubmit = false}){
    return(
        <button type={shouldSubmit?"submit":"button"}
            className=" text-black text-descReg1 site-button-square site-button-secondary-square" 
            style={customStyle}
        >
                {children}
        </button>
    )
}

export function SiteSecondaryBorderButtonSquare({customStyle, tailwindClasses, children, clickHandler, shouldSubmit = false}){
    return(
        <button type={shouldSubmit?"submit":"button"}
            className={`${tailwindClasses} bg-black text-primary text-descReg1 site-button-google`}
            style={customStyle} 
            onClick={clickHandler ? ()=> clickHandler() : undefined}
        > 
                {children}
        </button>
    )
}

export function SitePrimaryWhiteTextButton({customStyle, tailwindClasses, light, lowFont, children, clickHandler, shouldSubmit = false}){
    return(
        <button type={shouldSubmit?"submit":"button"}
            className={`bg-primary text-white font-500 px-[2rem] py-[3px] tracking-[0.3px] 
              rounded ${tailwindClasses} ${light ? 'font-[480]' : ''}`} 
            style={lowFont? {...customStyle, fontSize:'14px'} : customStyle} 
            onClick={clickHandler ? ()=> clickHandler() : undefined}
        >
                {children} 
        </button>
    )
}

export function SitePrimaryButtonWithShadow({customStyle, tailwindClasses, animated, noHover = false, light, lowFont, children, clickHandler, shouldSubmit = false}){
    return(
        <>
        {
            animated ?
                <motion.button type={shouldSubmit ? "submit" : "button"}
                    className={`inline-flex justify-center items-center gap-[5px] py-[4px] px-[15px] rounded-[8px]
                        text-[14px] text-[#332929] tracking-[0.2px] bg-primary ${!noHover && 'hover:bg-primaryDark'} cursor-pointer 
                        ${tailwindClasses? tailwindClasses:''} ${light ? 'font-[480]' : ''}`} 
                    style={lowFont? {...customStyle, fontSize:'14px'} : customStyle} onClick={clickHandler ? ()=> clickHandler() : undefined}
                    id='SitePrimaryButtonWithShadow'
                    whileHover={{
                      scale: 1.004,
                      y: -0.5,
                    //   boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
                    }}
                    whileTap={{
                      scale: 0.99,
                      y: 0,
                    //   boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                    }}
                    transition={{ type: "spring", stiffness: 600, damping: 17 }}
                >
                    {children} 
                 </motion.button>
                :
                <button type={shouldSubmit ? "submit" : "button"}
                    className={`inline-flex justify-center items-center gap-[5px] py-[4px] px-[15px] rounded-[8px]
                        text-[14px] text-[#332929] tracking-[0.2px] bg-primary cursor-pointer ${tailwindClasses? tailwindClasses:''} ${light ? 'font-[480]' : ''}`} 
                    style={lowFont? {...customStyle, fontSize:'14px'} : customStyle} onClick={clickHandler ? ()=> clickHandler() : undefined}
                    id='SitePrimaryButtonWithShadow'
                >
                    {children} 
                </button>

        }
        </>
    )
}

export function SitePrimaryMinimalButtonWithShadow({customStyle, tailwindClasses, light, lowFont, children, clickHandler, shouldSubmit = false}){
    return(
        <button type={shouldSubmit?"submit":"button"} className={` flex justify-center items-center gap-[3px] px-[16px] py-[2px] rounded-[4px]
             text-black bg-primary ${tailwindClasses} ${light ? 'font-[480]' : ''}`} 
            style={lowFont? {...customStyle, fontSize:'14px'} : customStyle} 
            onClick={clickHandler ? ()=> clickHandler() : undefined}
        >
                     {children}
         </button>
    )
}

export function SiteSecondaryFillButton({className, variant, size, clickHandler, customStyle, children, shouldSubmit = false}) {
    return(
        <button className={`px-[16px] py-[8px] rounded
                ${variant === 'outline' ? 'border border-gray-300' : 'bg-purple-600 text-white'} 
                ${size === 'icon' ? 'p-[8px]' : ''} ${className}`}  
            onClick={clickHandler ? ()=> clickHandler() : undefined} 
            style={customStyle} type={shouldSubmit?"submit":"button"}
        >
            {children}
         </button>
    )
}

export function SiteSecondaryFillImpButton({className, variant, clickHandler, isDisabled, customStyle, children, shouldSubmit = false}){
    return(
        <button className={`w-full mt-4 py-3 px-4 rounded-lg font-semibold transition duration-300
             ${variant === 'outline' ? 'bg-white border-[2px] text-secondary border-secondaryLight2 hover:text-white hover:bg-purple-500 hover:border-purple-500'
                    : 'text-white bg-purple-600 hover:bg-purple-700 '} ${className}`} disabled={isDisabled} 
                onClick={clickHandler ? ()=> clickHandler() : undefined} style={customStyle} type={shouldSubmit?"submit":"button"}
        >
            {children}
        </button>
    )
}
