import React,{useState} from 'react'
import './ProductFilterForAdmin.css'

import PriceFilter from '../PriceFilter/PriceFilter';
import {DateSelector} from '../Calender/Calender'

import {MdOutlineArrowDropDownCircle} from "react-icons/md";

export default function ProductFilterForAdmin({filter, setFilter, priceGetter, priceSetter}){

    const {minPrice, maxPrice} = priceGetter
    const {setMinPrice, setMaxPrice} = priceSetter

    const [showStatus, setShowStatus] = useState(false)

    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)

    const statusHandler = (e)=>{
        setShowStatus(!showStatus)
        e.target.style.borderBottomLeftRadius = e.target.style.borderBottomRightRadius = showStatus? '7px' : '0px'
    }

    return(
        <div className='w-[20rem] border border-[#e5e7eb] bg-white py-[15px] px-[25px] rounded-[8px] ' id='admin-product-filter'>
        <h4 className='text-[16px] font-[500] text-secondary tracking-[0.5px]'> Filter </h4>
        <div className='flex flex-col gap-[1.5rem] mt-[1rem]'>
            <div>
                <label for='category' className='filter-label'> Category </label>
                <div className='grid grid-cols-2 mt-[3px] category-radios'>
                    <div className='flex items-center gap-[2px]'>
                        <input type='radio' value='strength' />
                        <label for='strength'> Strength </label>
                    </div>
                    <div className='flex items-center gap-[2px]'>
                        <input type='radio' value='cardio' />
                        <label for='cardio'> Cardio </label>
                    </div>
                    <div className='flex items-center gap-[2px]'>
                        <input type='radio' value='supplements' />
                        <label for='supplements'> Supplements </label>
                    </div>
                    <div className='flex items-center gap-[2px]'>
                        <input type='radio' value='accessories' />
                        <label for='accessories'> Accessories </label>
                    </div>
                </div>
            </div>
            <div>
                <h5 for='status' className='filter-label'> Status </h5>
                <div id='status' className='relative w-[7rem] h-[1.7rem] rounded-[7px] border
                         border-secondary text-[14px] flex justify-center items-center gap-[5px] mt-[3px]'
                            onClick={(e)=> statusHandler(e)}>
                    <span className='text-[12px]' onClick={(e)=> statusHandler(e)}> { filter.status? filter.status : 'Active' } </span>  
                    <i> <MdOutlineArrowDropDownCircle/> </i> 
                    <div className='absolute bottom-[-43px] flex flex-col justify-center items-center gap-[5px] w-[7rem]
                             border border-secondary rounded-bl-[7px] rounded-br-[7px] bg-white z-[3] invisible'
                                style={showStatus? {visibility:'visible'} : {visibility:'hidden'}}>
                        <span onClick={()=> setFilter({...filter, status:'Active'})} 
                            className='hover:bg-primary w-full text-center text-[12px] cursor-pointer'> Active </span>
                        <span onClick={()=> setFilter({...filter, status:'Blocked'})}
                                 className='hover:bg-primary w-full text-center text-[12px] cursor-pointer'> Blocked </span>
                    </div>
                </div>
            </div>
            <div>
                <label for='' className='filter-label mb-[3px]'> Date </label>
                <DateSelector dateGetter={{startDate, endDate}} dateSetter={{setStartDate, setEndDate}} />
            </div>
            <div>
                <h5 for='' className='filter-label'> Price </h5>
                <div>
                    <PriceFilter priceGetter={{minPrice, maxPrice}} priceSetter={{setMinPrice, setMaxPrice}} mountingComponent='AdminProductListPage'/>
                </div>
                <div>
                    {/* <input type='text' value={inputLocalMinPrice} /> */}
                </div>
            </div>
            </div>
        </div>
    )
}