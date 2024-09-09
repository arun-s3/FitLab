import React,{useState, useEffect, useRef} from 'react'
import './ProductListPage.css'
import Header from '../Components/Header'
import BreadcrumbBar from '../Components/BreadcrumbBar'
import PriceFilter from '../Components/PriceFilter'
import {SearchInput} from '../Components/FormComponents'
import Products from '../Components/Products'

import {VscSettings} from "react-icons/vsc";
import {RiArrowDropUpLine, RiArrowDropDownLine} from "react-icons/ri";
import {BsFillGrid3X3GapFill} from "react-icons/bs";
import {FaList} from "react-icons/fa";

export default function ProductList(){

    const headerBg = {
        backgroundImage: "url('/header-bg.png')",
        backgrounSize: 'cover'
    }

    return(
        <>  
            <header style={headerBg}>

                <Header/>

            </header>
            
            <BreadcrumbBar/>
            
            <main className='px-[60px] mt-[3rem] flex gap-[2.5rem] items-start justify-start' id='productlist'>
                <aside className='basis-[15rem] flex flex-col gap-[10px]'>
                    <div className='flex gap-[5px] items-center pb-[10px] border-b border-[#DEE2E7] filter-head'>
                        <VscSettings/>
                        <h3 className='text-[18px] font-[550] leading-[0.5px]'> Filter </h3>
                    </div>
                    <div className='pb-[10px] border-b border-[#DEE2E7]'>
                        <div className='flex justify-between items-center' id='filter-header'>
                            <h4 className='text-[15px] font-[500]'>By Category</h4>
                            <RiArrowDropUpLine/>
                        </div>
                        <ul className='list-none' id='filter-body'>
                            <li>Strength</li>
                            <li>Cardio</li>
                            <li>Accessories</li>
                            <li>Supplements</li>
                        </ul>
                        <span className='mt-[5px] text-secondary text-[13px]'>See all</span>
                    </div>
                    <div className='pb-[10px] border-b border-[#DEE2E7]' > 
                        <div id='filter-header'>
                            <h4>By Product</h4>
                            <RiArrowDropUpLine/>
                        </div>
                        <ul className='list-none' id='filter-body' >
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='weights'/>
                                    <label HTMLfor='weights'>Weights</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='benchesAndRacks'/>
                                    <label HTMLfor='benchesAndRacks'>Benches and Racks</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='gymbell'/>
                                    <label HTMLfor='gymbell'>Gymbell</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='treadmills'/>
                                    <label HTMLfor='treadmills'>Treadmills</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='plates'/>
                                    <label HTMLfor='plates'>Plates</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='bikesAndEllipticals'/>
                                    <label HTMLfor='bikesAndEllipticals'>Bikes and Ellipticals</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='proteinPowders'/>
                                    <label HTMLfor='proteinPowders'>Protein Powders</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='strengthMachines'/>
                                    <label HTMLfor='strengthMachines'>Strength Machines</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='multistationMachines'/>
                                    <label HTMLfor='multistationMachine'>MultistationMachine</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='resistanceBands'/>
                                    <label HTMLfor='resistanceBands'>Resistance Bands</label>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <input type='checkbox' className='' id='yogaMats'/>
                                    <label HTMLfor='yogaMats'>Yoga Mats</label>
                                </div>
                            </li>
                            <span className='mt-[5px] text-secondary text-[13px]'>See all</span>
                        </ul>
                    </div>
                    <div className='pb-[10px] border-gray-500'>
                        <div id='filter-header'>
                            <h4>Price Range</h4>
                            <RiArrowDropUpLine/>
                        </div>
                    <div id='filter-body'>
                        
                        <PriceFilter/>   
                    
                    </div>
                    </div>
                </aside>

                <section className='basis-full flex-grow'>
                    <div className='flex justify-between' id='filter-content-header'>
                        <SearchInput/>
                        <div className='flex gap-[2rem] items-center'>
                            <div className='flex items-center sort-by'>
                                <span className='text-[13px] font-[500]'> Sort By </span>
                                <RiArrowDropDownLine/>           
                            </div>
                            <div className='flex items-center gap-[5px] view-type'>
                                <BsFillGrid3X3GapFill/>
                                <FaList/>
                            </div>
                        </div>
                    </div>
                    <div className='mt-[2rem]'>

                        <Products/>

                    </div>
                </section>
            </main>
        </>
    )
}