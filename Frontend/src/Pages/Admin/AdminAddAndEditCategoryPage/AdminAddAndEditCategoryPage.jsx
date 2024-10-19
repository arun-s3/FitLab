import React from 'react'
// import '/AdminAddAndEditCategoryPage.css'

import {IoArrowBackSharp} from "react-icons/io5";

import {SearchInput} from '../../../Components/FromComponents/FormComponents'

export default function AdminAddAndEditCategoryPage(){

    return(
        <section id='AdminAddAndEditCategoryPage'>
            <header>
                <div className='flex justify-between items-center'>
                    <div className='flex gap-[10px]'>
                        <i className='p-[7px] h-[33px] border border-[#c4c6ca] mt-[-6px] rounded-[4px] self-center'> <IoArrowBackSharp/> </i>
                        <div className='flex flex-col'>
                            <h1> Categories </h1>
                            <h5 className='text-[12px] text-secondary tracking-[0.2px] mt-[-2px]'> Add, Edit or Block categories</h5>
                        </div>
                    </div>
                    <input type='search' placeholder='Search Categories' className='w-[12rem] h-[35px] border-dotted bg-[#fefff8]
                             rounded-[7px] placeholder:text-[11px]' />
                </div>
            </header>
            <main>

            </main>
        </section>
    )
}