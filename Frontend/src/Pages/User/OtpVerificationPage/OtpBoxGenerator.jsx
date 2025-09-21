import React from 'react'
import {motion} from 'framer-motion'


export default function OtpBoxGenerator({counts, values, verificationError, handleChange, handleBlur, otpClickHandler, otpBoxDisabled}){

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !values[index]) {
            const prevInput = e.target.previousElementSibling
            if (prevInput) prevInput.focus();
        }
        if (/^\d$/.test(e.key) && e.target.value.length && index < 4 ) {
            const nextInput = e.target.nextElementSibling
            if (nextInput) nextInput.focus();
        }
    }

    return(
        [...Array.from({length: counts}, (_, index)=> (
            <motion.input key={index} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.15,
                  ease: "easeOut",
                }}
                type="text" 
                autoComplete="off" 
                disabled={otpBoxDisabled} 
                className={`w-[2rem] xs-sm:w-[2.5rem] p-[7px] xs-sm:p-[10px] xs-sm:pl-[12px] border-[2px] 
                        ${verificationError? 'border-red-500 bg-red-200' : 'border-white'} rounded-[6px] text-secondary`} 
                value={values[index]} 
                onChange={(e)=> handleChange(e, index)} 
                onBlur={(e)=> handleBlur(e)}
                onKeyDown={(e)=> handleKeyDown(e, index)} 
                onClick={otpClickHandler}/>
            )) 
        ]
    )
}