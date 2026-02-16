import React,{useEffect, useRef, useState} from 'react'
import './ProductFilterForAdmin.css'

import PriceSliderAndFilter from '../PriceSliderAndFilter/PriceSliderAndFilter'
import {DateSelector} from '../Calender/Calender'
import {SiteButtonSquare} from '../SiteButtons/SiteButtons'

import {MdOutlineArrowDropDownCircle} from "react-icons/md"


export default function ProductFilterForAdmin({filter, setFilter, priceGetter, priceSetter, dateGetter, dateSetter}){

    const {minPrice, maxPrice} = priceGetter
    const {setMinPrice, setMaxPrice} = priceSetter
    const {startDate, endDate} = dateGetter
    const {setStartDate, setEndDate} = dateSetter

    const [showStatus, setShowStatus] = useState(false)

    const [brandErrorMsg, setBrandErrorMsg] = useState(null)

    let firstSlideRef = useRef(false)
    useEffect(()=>{
        if(firstSlideRef.current){
            setFilter({...filter, minPrice, maxPrice})
        }
    },[minPrice, maxPrice])

    useEffect(()=>{
        if(brandErrorMsg){
            setTimeout(()=>{
                setBrandErrorMsg('')
            }, 2000)
        }
    },[brandErrorMsg])

    const statusHandler = (e)=>{
        setShowStatus(!showStatus)
        e.currentTarget.style.borderBottomLeftRadius = e.currentTarget.style.borderBottomRightRadius = showStatus? '7px' : '0px'
    }

    const setBrands = (e)=>{
        let uniqueBrands = ''
        const brandPattern = /^(?!^\d+$)[a-zA-Z0-9\s,'-]{1,50}$/ 
        if(e.target.value.trim()){
           const brandsArr = e.target.value.trim().split(',')
           uniqueBrands = brandsArr.map(brand=> brand.trim())
           uniqueBrands = Array.from( new Set([...uniqueBrands]) )
           for(let brand of uniqueBrands){
            if(!brandPattern.test(brand)){
                e.target.nextElementSibling.style.visibility = 'visible'
                setBrandErrorMsg('Please put a valid brand name!')
                return;
            }
           }
           if(uniqueBrands.some(brand => !brand.trim())){
            e.target.nextElementSibling.style.visibility = 'visible'
            setBrandErrorMsg('Please make sure that there are no consecutive commas without any number between them!')
            return;
           }
           setFilter({...filter, brands: uniqueBrands})
        }
    }

    const categoryAddHandler = (e)=>{
        setFilter({...filter, categories:[...filter.categories, e.target.value]}) 
    }

    
    return(
        <div className='w-[20rem] border border-primary bg-white pt-[20px] pb-[25px] px-[35px] rounded-[8px] ' id='admin-product-filter'>    {/* border-[#e5e7eb] */}
        <h4 className='text-[16px] font-[500] text-secondary tracking-[1.3px]'> Filter </h4>
        <div className='flex flex-col gap-[1.5rem] mt-[1rem]'>
            <div>
                <label for='category' className='filter-label'> Category </label>
                <div className='grid grid-cols-2 mt-[3px] category-radios'>
                    <div className='flex items-center gap-[2px]'>
                        <input type='radio' value='strength' onChange={(e)=> categoryAddHandler(e)}/>
                        <label for='strength'> Strength </label>
                    </div>
                    <div className='flex items-center gap-[2px]'>
                        <input type='radio' value='cardio'  onChange={(e)=> categoryAddHandler(e)}/>
                        <label for='cardio'> Cardio </label>
                    </div>
                    <div className='flex items-center gap-[2px]'>
                        <input type='radio' value='supplements'  onChange={(e)=> categoryAddHandler(e)}/>
                        <label for='supplements'> Supplements </label>
                    </div>
                    <div className='flex items-center gap-[2px]'>
                        <input type='radio' value='accessories'  onChange={(e)=> categoryAddHandler(e)}/>
                        <label for='accessories'> Accessories </label>
                    </div>
                </div>
            </div>
            <div>
                <h5 for='status' className='filter-label'> Status </h5>
                <div id='status' className='relative w-[7rem] h-[1.7rem] rounded-[7px] border
                         border-secondaryLight2 text-[14px] flex justify-center items-center gap-[5px] mt-[3px]'
                            onClick={(e)=> statusHandler(e)}>
                    <span className='text-[12px]' onClick={(e)=> statusHandler(e)}>
                         { filter.status? filter.status.slice(0,1).toUpperCase() + filter.status.slice(1) : 'All' } 
                    </span>  
                    <i> <MdOutlineArrowDropDownCircle/> </i> 
                    <div className='absolute bottom-[-66px] flex flex-col justify-center items-center gap-[5px] w-[7rem]
                             border border-secondaryLight2 rounded-bl-[7px] rounded-br-[7px] bg-white z-[3] invisible'
                                style={showStatus? {visibility:'visible'} : {visibility:'hidden'}}>
                        <span onClick={()=> setFilter({...filter, status:'all'})} 
                            className='hover:bg-primary w-full text-center text-[12px] cursor-pointer'> All </span>
                        <span onClick={()=> setFilter({...filter, status:'active'})} 
                            className='hover:bg-primary w-full text-center text-[12px] cursor-pointer'> Active </span>
                        <span onClick={()=> setFilter({...filter, status:'blocked'})}
                                 className='hover:bg-primary w-full text-center text-[12px] cursor-pointer'> Blocked </span>
                    </div>
                </div>
            </div>
            <div>
                <label for='' className='filter-label mb-[3px]'> Date </label>
                <DateSelector dateGetter={{startDate, endDate}} dateSetter={{setStartDate, setEndDate}} />
            </div>
            <div>
                <label for='brand' className='filter-label mb-[3px]'> Brand </label>
                <input type='text' id='brand' className='h-[2rem] text-secondary border-secondaryLight2 rounded-[7px]'  
                    onBlur={(e)=> setBrands(e)}/>
                <p className='text-red-500 text-[10px] tracking-[0.3px] h-[18px] w-full flex items-center invisible'> {brandErrorMsg} </p>
            </div>
            <div className='mt-[-10px]'>
                <h5 for='' className='filter-label'> Price </h5>
                <div>
                    <PriceSliderAndFilter priceGetter={{minPrice, maxPrice}} priceSetter={{setMinPrice, setMaxPrice}} mountingComponent='AdminProductListPage' firstSlide={firstSlideRef} />
                </div>
            </div>
                <div className='text-right'>
                    <SiteButtonSquare customStyle={{paddingBlock: '3px', paddingInline: '28px', borderRadius:'7px'}} light={true} lowFont={true}> 
                        Save
                    </SiteButtonSquare>
                </div>
            </div>
        </div>
    )
}