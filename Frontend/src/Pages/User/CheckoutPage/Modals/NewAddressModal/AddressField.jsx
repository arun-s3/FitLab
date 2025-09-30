import React from 'react'

import {AlertCircle} from "lucide-react"

import {camelToCapitalizedWords} from '../../../../../Utils/helperFunctions'


export default function AddressField({infoArray, fieldType='input', formData, onChange, onBlur, errors}){

    const nonFullWidthFields = ['pincode', 'landmark']

    const optionalFields = [
        {field: "nickName", placeholderMsg: "Optional: Keeping Nickname would give a personal touch, if it's a Gift Address"},
        {field: "landmark", placeholderMsg: "Optional"}, 
        {field: "alternateMobileNumber", placeholderMsg: "Optional"},
        {field: "deliveryInstructions", placeholderMsg: "Example: 'Leave at the front door' at123 (Optional)"},
    ] 

    const ErrorMessage = ({error}) => {
      if (!error) return null

      return (
        <div className="absolute flex items-center gap-1 mt-1">
          <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />
          <span className="text-xs text-red-600">{error}</span>
        </div>
      )
    }

    return(
        <>
        {
            infoArray.map((info, index)=> (
                fieldType !== 'textarea' ?
                <div className={`${index === infoArray.length-1 && !nonFullWidthFields.includes(info) ? 'col-span-2' : null} relative`}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {camelToCapitalizedWords(info)} 
                    </label>
                    <input
                      type="text"
                      name={info}
                      value={formData[info]}
                      onChange={onChange}
                      onBlur={onBlur}
                      className={`w-full px-4 py-[6px] bg-purple-50 border rounded-lg focus:ring-2 focus:ring-purple-500 
                        focus:border-transparent transition-all duration-200 text-[13px] placeholder:text-[12px]
                        ${errors[info] ? "border-red-300 bg-red-50" : "border-purple-100"}`}
                      required={optionalFields.some(fieldObj=> fieldObj.field === info) ? false : true}
                      placeholder={optionalFields.some(fieldObj=> fieldObj.field === info) 
                        ? optionalFields.find(fieldObj=> fieldObj.field === info).placeholderMsg
                        : ''}
                    />
                      <ErrorMessage error={errors[info]} />
                </div>
                :
                <div>
                    <textarea
                      name={info}
                      value={formData[info]}
                      onChange={onChange}
                      onBlur={onBlur}
                      rows={4}
                      className={`w-full px-4 py-3 bg-purple-50 border rounded-lg focus:ring-2 focus:ring-purple-500 
                        focus:border-transparent transition-all duration-200 text-[13px] placeholder:text-[12px] resize-none 
                        ${errors[info] ? "border-red-300 bg-red-50" : "border-purple-100"}`}
                      placeholder={optionalFields.some(fieldObj=> fieldObj.field === info) 
                        ? optionalFields.find(fieldObj=> fieldObj.field === info).placeholderMsg
                        : ''}
                    />
                    <ErrorMessage error={errors[info]} />
                </div>

            ))
        }
    </>
    )
}