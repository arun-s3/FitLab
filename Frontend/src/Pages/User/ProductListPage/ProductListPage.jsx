import React,{useState, useEffect, useRef} from 'react'
import {Link} from 'react-router-dom'
import './ProductListPage.css'
import Header from '../../../Components/Header/Header'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import PriceFilter from '../../../Components/PriceFilter/PriceFilter'
import {SearchInput} from '../../../Components/FromComponents/FormComponents'
import Products from '../../../Components/Products/Products'

import {VscSettings} from "react-icons/vsc";
import {RiArrowDropUpLine, RiArrowDropDownLine} from "react-icons/ri";
import {BsFillGrid3X3GapFill} from "react-icons/bs";
import {FaList} from "react-icons/fa";
import {IoPricetagOutline} from "react-icons/io5";
import {FaIndianRupeeSign, FaChartLine } from "react-icons/fa6";
import {VscFeedback} from "react-icons/vsc";
import {MdOutlineFeaturedVideo, MdOutlineNewReleases} from "react-icons/md";

export default function ProductList(){

    const headerBg = {
        backgroundImage: "url('/header-bg.png')",
        backgrounSize: 'cover'
    }

    const [showCategory, setShowCategory ] = useState(true)
    const [showProductsFilter, setShowProductsFilter] = useState(true)
    const [showPriceFilter, setShowPriceFilter] = useState(true)
    const [showSortBy, setShowSortBy] = useState(false)
    const [showByGrid, setShowByGrid] = useState(true)

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
                            <span onClick={()=> setShowCategory(status=> !status)}> <RiArrowDropUpLine/> </span>
                        </div>
                        {showCategory && <>
                        <ul className='list-none cursor-pointer' id='filter-body'>
                            <li> <Link to=''> Strength </Link> </li>
                            <li> <Link to=''> Cardio </Link> </li>
                            <li> <Link to=''> Accessories </Link> </li>
                            <li> <Link to=''> Supplements </Link> </li>
                        </ul>
                        <span className='mt-[5px] text-secondary text-[13px]'>See all</span>
                        </>
                        }
                    </div>
                    <div className='pb-[10px] border-b border-[#DEE2E7]' > 
                        <div id='filter-header'>
                            <h4>By Product</h4>
                            <span onClick={()=> setShowProductsFilter(status=> !status)}> <RiArrowDropUpLine/> </span>
                        </div>
                        {showProductsFilter && 
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
                        }
                    </div>
                    <div className='pb-[10px] border-gray-500'>
                        <div id='filter-header'>
                            <h4>Price Range</h4>
                            <span onClick={()=> setShowPriceFilter(status=> !status)}> <RiArrowDropUpLine/> </span>
                        </div>
                    <div id='filter-body'>
                        {
                            showPriceFilter && <PriceFilter/>
                        }
                    </div>
                    </div>
                </aside>

                <section className='basis-full flex-grow'>
                    <div className='flex justify-between' id='filter-content-header'>
                        <SearchInput/>
                        <div className='flex gap-[2rem] items-center'>
                            <div className='flex items-center sort-by relative sort-dropdown cursor-pointer' 
                                                                    onClick={()=> setShowSortBy(status=> !status)}>
                                <span className='text-[13px] font-[500]'> Sort By </span>
                                <RiArrowDropDownLine/>
                                {showSortBy && 
                                <ul className='list-none cursor-pointer absolute top-[22px] flex flex-col gap-[5px] justify-center 
                                        w-[10rem] h-[10rem] border rounded-[8px] text-[10px] z-[5] px-[19px]'>
                                    <li> Price: High to Low <FaIndianRupeeSign/> </li>
                                    <li> Price: Low to High <FaIndianRupeeSign/> </li>
                                    <li> Ratings: High to Low <VscFeedback/> </li>
                                    <li> Ratings: Low to High <VscFeedback/> </li>
                                    <li> Featured <MdOutlineFeaturedVideo/> </li>
                                    <li> Best Sellers <FaChartLine/> </li>
                                    <li> Newest Arrivals <MdOutlineNewReleases/> </li>
                                </ul>
                                }
                            </div>
                            <div className='flex items-center gap-[5px] view-type'>
                                <span onClick={()=> setShowByGrid(true)}>  <BsFillGrid3X3GapFill/> </span>
                                <span onClick={()=> setShowByGrid(false)}> <FaList/> </span>
                            </div>
                        </div>
                    </div>
                    <div className='mt-[2rem]'>

                        <Products gridView={showByGrid} />

                    </div>
                </section>
            </main>
        </>
    )
}