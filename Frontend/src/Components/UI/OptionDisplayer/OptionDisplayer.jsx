import React from 'react'

export default function OptionDisplayer({FirstIcon, firstIconLabel, firstIconHandler, SecondIcon, secondIconLabel, secondIconHandler}){

    return(
        <div className=' mt-[1rem] w-[35px] flex flex-col gap-[2rem] text-secondary' id='OptionDisplayer'>
            <span data-label='Edit' className='w-[30px] p-[5px] border rounded-[20px] z-[2] flex items-center justify-center 
                  relative cursor-pointer option-control'>    
              <i> {FirstIcon && <FirstIcon/>} </i>  {/*onClick={()=> navigate('./edit', {state: {category}})}*/}
            </span>
            <span data-label='Block' className='w-[30px] p-[5px] border rounded-[20px] z-[2] flex items-center justify-center
                 relative cursor-pointer option-control'  onClick={()=> dispatch(toggleCategoryStatus(category._id))}>  
              <i> {SecondIcon && <SecondIcon/>} </i>           {/*onClick={()=> dispatch(toggleCategoryStatus(category._id))}*/}
            </span>
        </div>
    )
}