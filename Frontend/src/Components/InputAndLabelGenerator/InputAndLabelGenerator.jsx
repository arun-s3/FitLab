import React,{useState, useEffect, useRef} from 'react'
import './InputAndLabelGenerator.css'
import {convertToCamelCase, camelToCapitalizedWords} from '../../Utils/helperFunctions'
import {handleInputValidation, displaySuccess, displayErrorAndReturnNewFormData, cancelErrorState} from '../../Utils/fieldValidator'


export const InputAndLabelGenerator = React.memo(({ name, label, optionalField, optionalMsg='', fieldType, inputType, inputStyles, labelStyles, 
                                        parentStyles, rows, cols, value, onChange, dataObj, setDataObj, primaryColor }) => {

    const labelName = label? camelToCapitalizedWords(label) : name ? camelToCapitalizedWords(name) : '';
    const inputName = name

    const errorRef = useRef(null)

    const inputBlurHandler = (e, fieldName, options)=>{
        console.log("inside inputBlurHandler, fieldname", fieldName)

        if(fieldName){
           console.log("fieldName from inputBlurHandler-->", fieldName)
           const value = e.target.value
           console.log("Value from the field--->", value)
        //   options.optionalField = options?.optionalField || false
           console.log("options?.optionalField form inputBlurHandler--->", (options || false))
        //   const statusObj =  (options || false)? handleInputValidation(fieldName, value, {optionalField: true}) : handleInputValidation(fieldName, value)
           const statusObj = handleInputValidation(fieldName, value, options || { optionalField: false })
           console.log("statusObj from inputBlurHandler--> ", JSON.stringify(statusObj))
           if(!statusObj.error && statusObj.message.startsWith("Optional")){
               console.log("Inside here----")
               e.target.nextElementSibling.textContent = optionalMsg ? optionalMsg : ''
               if(optionalMsg) e.target.nextElementSibling.style.color = 'rgb(125, 124, 140)'
               e.target.style.borderColor = primaryColor.current
               return
           }
           if(statusObj.error){
               const message = statusObj.message
               const newDataObj = displayErrorAndReturnNewFormData(e, message, dataObj, fieldName)
               setDataObj(newDataObj)
           }else{
               options ? displaySuccess(e, options) : displaySuccess(e)
           }
        }
   }

    return (
        <div className={`${parentStyles? parentStyles : 'basis-1/2 '}`} id='InputAndLabelGenerator'>
            {name && (
                <>
                    <label htmlFor={inputName} className={`block text-[13.5px] tracking-[0.3px] ${labelStyles ? labelStyles : ''}`}
                        style={{ wordSpacing: '0.5px' }}>
                        {labelName}
                    </label>
                    <div>
                    {!(fieldType === 'textarea') ? (
                        <>
                            <input type={inputType || 'text'} id={inputName}
                                className={`mt-[5px] w-full h-[2rem] px-[10px] text-[13px] text-secondary border-[1.5px] 
                                    border-inputBorderSecondary rounded-[4px] bg-inputBgSecondary ${inputStyles ? inputStyles : ''} caret-primaryDark`}
                                onChange={onChange} value={dataObj[inputName]} 
                                onBlur={(e)=> !optionalField? inputBlurHandler(e, inputName): inputBlurHandler(e, inputName, {optionalField:true, optionalMsg})}/>
                        </> 
                    ) : (
                        <>
                            <textarea id={inputName}
                                 className={`mt-[5px] w-full min-h-[2rem] px-[10px] text-[13px] text-secondary resize-none border-[1.5px] 
                                    border-inputBorderSecondary rounded-[4px] bg-inputBgSecondary ${inputStyles ? inputStyles : ''} caret-primaryDark`}
                                        rows={rows} onChange={onChange} value={dataObj[inputName]} 
                                            onBlur={(e)=> !optionalField? inputBlurHandler(e, inputName): inputBlurHandler(e, inputName, {optionalField:true})}/>
                        </>
                    )
                    }
                    <p className={`error ${optionalMsg?.includes('valid') && 'text-red-500'}`} 
                        onClick={(e) => !optionalField? cancelErrorState(e, primaryColor.current): cancelErrorState(e, primaryColor.current, {optionalField:true, optionalMsg})}
                             ref={errorRef}>
                        {optionalMsg}
                    </p>
                    </div>
                </>
            )}
        </div>
    )
})
